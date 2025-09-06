from django_countries.serializer_fields import CountryField
from django_countries.serializers import CountryFieldMixin
from rest_framework import serializers
from django_countries import countries

from .models import Car, CarViews
from apps.profiles.serializers import ProfileSerializer
from apps.bookings.models import Booking, BookingStatus

class CarSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    country = CountryField(name_only=True)
    cover_photo = serializers.SerializerMethodField()
    profile_photo = serializers.SerializerMethodField()
    photo1 = serializers.SerializerMethodField()
    photo2 = serializers.SerializerMethodField()
    photo3 = serializers.SerializerMethodField()
    photo4 = serializers.SerializerMethodField()

    class Meta:
        model = Car
        fields = [
            "id",
            "user",
            "title",
            "slug",
            "ref_code",
            "description",
            "country",
            "city",
            "state",
            "address",
            "postal_code",
            "street_address",
            "car_number",
            "price",
            "tax",
            "total_seats",
            "advert_type",
            "car_type",
            "cover_photo",
            "profile_photo",
            "photo1",
            "photo2",
            "photo3",
            "photo4",
            "published_status",
            "views",
            "latitude",
            "longitude",
            "current_location",
            "is_available",
            "created_at",
            "updated_at",
        ]

    def get_user(self, obj):
        return obj.user.username

    def get_cover_photo(self, obj):
        if obj.cover_photo:
            return obj.cover_photo.url
        return None

    def get_profile_photo(self, obj):
        if hasattr(obj.user, 'profile') and obj.user.profile.profile_photo:
            return obj.user.profile.profile_photo.url
        return None

    def get_photo1(self, obj):
        if obj.photo1:
            return obj.photo1.url
        return None

    def get_photo2(self, obj):
        if obj.photo2:
            return obj.photo2.url
        return None

    def get_photo3(self, obj):
        if obj.photo3:
            return obj.photo3.url
        return None

    def get_photo4(self, obj):
        if obj.photo4:
            return obj.photo4.url
        return None

class CarDetailSerializer(CarSerializer):
    """Extended serializer for car details with additional fields"""
    
    # Inherit all fields from CarSerializer
    pass

class CarCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating cars"""
    
    country = CountryField(name_only=True)
    
    class Meta:
        model = Car
        fields = [
            "title",
            "description",
            "country",
            "city",
            "state",
            "address",
            "postal_code",
            "street_address",
            "car_number",
            "price",
            "tax",
            "total_seats",
            "advert_type",
            "car_type",
            "cover_photo",
            "photo1",
            "photo2",
            "photo3",
            "photo4",
            "published_status",
            "latitude",
            "longitude",
            "current_location",
            "is_available"
        ]
    
    def validate(self, attrs):
        """Validate car data before creation"""
        # Validate price
        price = attrs.get('price')
        if price and price <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        
        # Validate total seats
        total_seats = attrs.get('total_seats')
        if total_seats and total_seats < 0:
            raise serializers.ValidationError("Total seats cannot be negative")
        
        # Validate coordinates if provided
        latitude = attrs.get('latitude')
        longitude = attrs.get('longitude')
        
        if latitude is not None and (latitude < -90 or latitude > 90):
            raise serializers.ValidationError("Latitude must be between -90 and 90")
        
        if longitude is not None and (longitude < -180 or longitude > 180):
            raise serializers.ValidationError("Longitude must be between -180 and 180")
        
        return attrs
    
    def create(self, validated_data):
        """Create a new car with the current user as owner"""
        # Set the user to the current authenticated user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class CarLocationSerializer(serializers.ModelSerializer):
    """Serializer for updating car location"""
    
    class Meta:
        model = Car
        fields = [
            "latitude",
            "longitude",
            "current_location",
            "address",
            "city",
            "state",
            "country"
        ]
    
    def validate(self, attrs):
        latitude = attrs.get('latitude')
        longitude = attrs.get('longitude')
        
        if latitude is not None and (latitude < -90 or latitude > 90):
            raise serializers.ValidationError("Latitude must be between -90 and 90")
        
        if longitude is not None and (longitude < -180 or longitude > 180):
            raise serializers.ValidationError("Longitude must be between -180 and 180")
        
        return attrs

class CarSearchSerializer(CarSerializer):
    """Serializer for car search results with distance calculation"""
    
    distance = serializers.FloatField(read_only=True, help_text="Distance in kilometers from user location")
    
    class Meta(CarSerializer.Meta):
        fields = CarSerializer.Meta.fields + ["distance"]

class CarViewSerializer(serializers.ModelSerializer):
    """Serializer for car views"""
    
    class Meta:
        model = CarViews
        fields = ["id", "ip", "car", "created_at"]
