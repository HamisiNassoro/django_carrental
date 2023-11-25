import logging

import django_filters
from django.db.models import query
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from .exceptions import CarNotFound
from .models import Car, CarViews
from .pagination import CarPagination
from .serializers import CarCreateSerializer, CarSerializer, CarViewSerializer

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
