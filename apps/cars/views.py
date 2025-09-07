import logging

import django_filters
from django.db.models import query, Q, F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from django.core.cache import cache
import math

from .exceptions import CarNotFound
from .models import Car, CarViews
from .pagination import CarPagination
from .serializers import (
    CarSerializer,
    CarDetailSerializer,
    CarCreateSerializer,
    CarLocationSerializer,
    CarSearchSerializer,
    CarViewSerializer
)
from apps.bookings.models import Booking, BookingStatus

# Create your views here.

logger = logging.getLogger(__name__)


class CarFilter(django_filters.FilterSet):

    advert_type = django_filters.CharFilter(
        field_name="advert_type", lookup_expr="iexact"
    )
    car_type = django_filters.CharFilter(
        field_name="car_type", lookup_expr="iexact"
    )
    price = django_filters.NumberFilter()
    price__gt = django_filters.NumberFilter(field_name="price", lookup_expr="gt")
    price__lt = django_filters.NumberFilter(field_name="price", lookup_expr="lt")

    class Meta:
        model = Car
        fields = ["advert_type", "car_type", "price"]


class ListAllCarsAPIView(generics.ListAPIView):
    serializer_class = CarSerializer
    queryset = Car.objects.all().order_by("-created_at")
    pagination_class = CarPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = CarFilter
    search_fields = ["country", "city"]
    ordering_fields = ["created_at"]


class ListAgentsCarsAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CarSerializer
    pagination_class = CarPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = CarFilter
    search_fields = ["country", "city"]
    ordering_fields = ["created_at"]

    def get_queryset(self):
        user = self.request.user
        queryset = Car.objects.filter(user=user).order_by(
            "-created_at"
        )  ### Getting all properties of a certain user/agent
        return queryset


class CarViewsAPIView(generics.ListAPIView):
    serializer_class = CarViewSerializer
    queryset = CarViews.objects.all()


class CarDetailView(APIView):
    def get(self, request, slug):
        car = Car.objects.get(slug=slug)

        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")

        if not CarViews.objects.filter(car=car, ip=ip).exists():
            CarViews.objects.create(car=car, ip=ip)

            car.views += 1
            car.save()

        serializer = CarSerializer(car, context={"request": request})

        return Response(serializer.data, status=status.HTTP_200_OK)


#### Function based view for update
@api_view(["PUT"])
@permission_classes([permissions.IsAuthenticated])
def update_car_api_view(request, slug):
    try:
        car = Car.objects.get(slug=slug)
    except Car.DoesNotExist:
        raise CarNotFound

    user = request.user
    if car.user != user:
        return Response(
            {"error": "You can't update or edit a Car that doesn't belong to you"},
            status=status.HTTP_403_FORBIDDEN,
        )
    if request.method == "PUT":
        data = request.data
        serializer = CarSerializer(
            car, data, many=False
        )  # updating one instance
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


### Function based view for creating a car
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def create_car_api_view(request):
    user = request.user
    data = request.data
    data["user"] = request.user.pkid
    serializer = CarCreateSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        logger.info(
            f"Car {serializer.data.get('title')} created by {user.username}"
        )
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


### Function based view for deleting
@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def delete_car_api_view(request, slug):
    try:
        car = Car.objects.get(slug=slug)
    except Car.DoesNotExist:
        raise CarNotFound

    user = request.user
    if car.user != user:
        return Response(
            {"error": "You can't delete a Car that doesn't belong to you"},
            status=status.HTTP_403_FORBIDDEN,
        )

    if request.method == "DELETE":
        delete_operation = car.delete()
        data = {}
        if delete_operation:
            data["success"] = "Deletion was successful"
        else:
            data["failure"] = "Deletion failed"
        return Response(data=data)


#### Function based view to upload product image
@api_view(["POST"])
def uploadCarImage(request):
    data = request.data

    car_id = data["car_id"]
    car = Car.objects.get(id=car_id)
    car.cover_photo = request.FILES.get("cover_photo")
    car.photo1 = request.FILES.get("photo1")
    car.photo2 = request.FILES.get("photo2")
    car.photo3 = request.FILES.get("photo3")
    car.photo4 = request.FILES.get("photo4")
    car.save()
    return Response("Image(s) uploaded")


class NearbyCarsAPIView(generics.ListAPIView):
    """Get cars available for rent near the user's location"""

    serializer_class = CarSearchSerializer
    permission_classes = [permissions.AllowAny]  # Make it public for easier testing

    def get_queryset(self):
        # Get query parameters with error handling
        user_lat = self.request.query_params.get('latitude')
        user_lng = self.request.query_params.get('longitude')
        
        # Handle radius parameter with error handling
        try:
            radius_km = float(self.request.query_params.get('radius', 10))
        except (ValueError, TypeError):
            radius_km = 10  # Default 10km if invalid
        
        city = self.request.query_params.get('city')
        car_type = self.request.query_params.get('car_type')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        # Start with available cars
        queryset = Car.objects.filter(
            is_available=True,
            published_status=True,
            advert_type=Car.AdvertType.FOR_RENT
        )

        # Apply filters with error handling
        if car_type:
            queryset = queryset.filter(car_type=car_type)

        if min_price:
            try:
                min_price = float(min_price)
                queryset = queryset.filter(price__gte=min_price)
            except (ValueError, TypeError):
                pass  # Skip invalid min_price

        if max_price:
            try:
                max_price = float(max_price)
                queryset = queryset.filter(price__lte=max_price)
            except (ValueError, TypeError):
                pass  # Skip invalid max_price

        # Location-based filtering using PostGIS
        if user_lat and user_lng:
            try:
                user_lat = float(user_lat)
                user_lng = float(user_lng)
                
                # Create user location point
                user_location = Point(user_lng, user_lat, srid=4326)
                
                # Filter cars within radius using PostGIS Distance function
                queryset = queryset.filter(
                    location__isnull=False
                ).annotate(
                    distance=Distance('location', user_location)
                ).filter(
                    distance__lte=D(km=radius_km)
                ).order_by('distance')

                return queryset

            except (ValueError, TypeError):
                pass

        # Fallback to city-based search
        if city:
            queryset = queryset.filter(city__icontains=city)

        # Add default distance for non-location cars
        for car in queryset:
            car.distance = None

        return queryset

class CarSearchAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CarCreateSerializer

    def post(self, request):
        queryset = Car.objects.filter(published_status=True)
        data = self.request.data

        advert_type = data["advert_type"]
        queryset = queryset.filter(advert_type__iexact=advert_type)

        car_type = data["car_type"]
        queryset = queryset.filter(car_type__iexact=car_type)

        price = data["price"]
        if price == "$0+":
            price = 0
        elif price == "$500,000+":
            price = 500000
        elif price == "$1,000,000+":
            price = 1000000
        elif price == "$2,000,000+":
            price = 2000000
        elif price == "$4,000,000+":
            price = 4000000
        elif price == "$6,000,000+":
            price = 6000000
        elif price == "Any":
            price = -1

        if price != -1:
            queryset = queryset.filter(price__gte=price)

        total_seats = data["total_seats"]
        if total_seats == "0+":
            total_seats = 0
        elif total_seats == "1+":
            total_seats = 1
        elif total_seats == "2+":
            total_seats = 2
        elif total_seats == "3+":
            total_seats = 3
        elif total_seats == "4+":
            total_seats = 4
        elif total_seats == "5+":
            total_seats = 5
        elif total_seats == "6+":
            total_seats = 6
        elif total_seats == "7+":
            total_seats = 7

        queryset = queryset.filter(total_seats__gte=total_seats)

        catch_phrase = data["catch_phrase"]
        queryset = queryset.filter(description__icontains=catch_phrase)

        serializer = CarSerializer(queryset, many=True)

        return Response(serializer.data)

class AdvancedCarSearchAPIView(generics.ListAPIView):
    """Advanced car search with multiple filters and location support"""
    
    serializer_class = CarSearchSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Car.objects.filter(
            is_available=True,
            published_status=True,
            advert_type=Car.AdvertType.FOR_RENT
        )
        
        # Text search
        search_query = self.request.query_params.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(city__icontains=search_query)
            )
        
        # Car type filter
        car_type = self.request.query_params.get('car_type')
        if car_type:
            queryset = queryset.filter(car_type=car_type)
        
        # Price range filter with error handling
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            try:
                min_price = float(min_price)
                queryset = queryset.filter(price__gte=min_price)
            except (ValueError, TypeError):
                pass  # Skip invalid min_price
        
        if max_price:
            try:
                max_price = float(max_price)
                queryset = queryset.filter(price__lte=max_price)
            except (ValueError, TypeError):
                pass  # Skip invalid max_price
        
        # Seats filter with error handling
        min_seats = self.request.query_params.get('min_seats')
        if min_seats:
            try:
                min_seats = int(min_seats)
                queryset = queryset.filter(total_seats__gte=min_seats)
            except (ValueError, TypeError):
                pass  # Skip invalid min_seats
        
        # Location filter
        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city__icontains=city)
        
        # Date availability filter with error handling
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date and end_date:
            try:
                from datetime import datetime
                # Parse dates with error handling
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                
                # Check for booking conflicts
                conflicting_bookings = Booking.objects.filter(
                    car__in=queryset,
                    start_date__lte=end_date,
                    end_date__gte=start_date,
                    status__in=[BookingStatus.PENDING, BookingStatus.APPROVED]
                ).values_list('car_id', flat=True)
                
                queryset = queryset.exclude(id__in=conflicting_bookings)
                
            except (ValueError, TypeError):
                pass  # Skip invalid dates
        
        # Add distance if user location provided using PostGIS
        user_lat = self.request.query_params.get('latitude')
        user_lng = self.request.query_params.get('longitude')
        
        if user_lat and user_lng:
            try:
                user_lat = float(user_lat)
                user_lng = float(user_lng)
                
                # Create user location point
                user_location = Point(user_lng, user_lat, srid=4326)
                
                # Annotate queryset with distance using PostGIS
                queryset = queryset.filter(
                    location__isnull=False
                ).annotate(
                    distance=Distance('location', user_location)
                ).order_by('distance')
                
            except (ValueError, TypeError):
                pass
        
        return queryset

class UpdateCarLocationAPIView(generics.UpdateAPIView):
    """Update car's current location"""

    serializer_class = CarLocationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'

    def get_queryset(self):
        return Car.objects.filter(user=self.request.user)

    def get_object(self):
        """Override to provide better error handling"""
        try:
            return super().get_object()
        except Car.DoesNotExist:
            raise CarNotFound

    def update(self, request, *args, **kwargs):
        try:
            car = self.get_object()
        except Car.DoesNotExist:
            return Response({
                'error': 'Car not found',
                'message': 'The car with the specified slug does not exist or does not belong to you',
                'slug': kwargs.get('slug', 'unknown')
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Update location fields
        serializer = self.get_serializer(car, data=request.data, partial=True)
        
        if not serializer.is_valid():
            return Response({
                'error': 'Validation failed',
                'message': 'Invalid data provided for location update',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            car = serializer.save()
            
            return Response({
                'message': 'Car location updated successfully',
                'car_id': car.id,
                'slug': car.slug,
                'title': car.title,
                'latitude': car.latitude,
                'longitude': car.longitude,
                'current_location': car.current_location,
                'city': car.city,
                'state': car.state,
                'address': car.address
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': 'Update failed',
                'message': 'An error occurred while updating the car location',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
