from django.contrib.auth import get_user_model
from django_countries.serializer_fields import CountryField
from djoser.serializers import UserCreateSerializer
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.gis.geos import Point

from .models import UserLocation

User = get_user_model()

#### Adding fields from Profile model into the User model
class UserSerializer(serializers.ModelSerializer):
    gender = serializers.CharField(source="profile.gender")
    phone_number = PhoneNumberField(source="profile.phone_number")
    profile_photo = serializers.ImageField(source="profile.profile_photo")
    country = CountryField(source="profile.country")
    city = serializers.CharField(source="profile.city")
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField(source="get_full_name")

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "gender",
            "phone_number",
            "profile_photo",
            "country",
            "city",
        ]

    def get_first_name(self, obj):
        return obj.first_name.title()

    def get_last_name(self, obj):
        return obj.last_name.title()

    ##Help us dynamically put a value to serializer fields
    def to_representation(self, instance):
        representation = super(UserSerializer, self).to_representation(instance)
        if instance.is_superuser:
            representation["admin"] = True
        return representation


class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "password"]

class UserLocationSerializer(serializers.ModelSerializer):
    """Serializer for user location data"""
    
    latitude = serializers.FloatField(write_only=True, required=False)
    longitude = serializers.FloatField(write_only=True, required=False)
    
    class Meta:
        model = UserLocation
        fields = [
            "id",
            "latitude",
            "longitude",
            "location",
            "address",
            "city",
            "state",
            "country",
            "last_updated",
            "is_active"
        ]
        read_only_fields = ["id", "last_updated", "location"]
    
    def validate(self, attrs):
        latitude = attrs.get('latitude')
        longitude = attrs.get('longitude')
        
        if latitude is not None and (latitude < -90 or latitude > 90):
            raise serializers.ValidationError("Latitude must be between -90 and 90")
        
        if longitude is not None and (longitude < -180 or longitude > 180):
            raise serializers.ValidationError("Longitude must be between -180 and 180")
        
        # Create Point object from latitude and longitude
        if latitude is not None and longitude is not None:
            attrs['location'] = Point(longitude, latitude)  # Point takes (x, y) = (longitude, latitude)
        
        return attrs

class UpdateUserLocationSerializer(serializers.ModelSerializer):
    """Serializer for updating user location"""
    
    latitude = serializers.FloatField(write_only=True, required=False)
    longitude = serializers.FloatField(write_only=True, required=False)
    
    class Meta:
        model = UserLocation
        fields = [
            "latitude",
            "longitude",
            "location",
            "address",
            "city",
            "state",
            "country"
        ]
        read_only_fields = ["location"]
    
    def validate(self, attrs):
        latitude = attrs.get('latitude')
        longitude = attrs.get('longitude')
        
        if latitude is not None and (latitude < -90 or latitude > 90):
            raise serializers.ValidationError("Latitude must be between -90 and 90")
        
        if longitude is not None and (longitude < -180 or longitude > 180):
            raise serializers.ValidationError("Longitude must be between -180 and 180")
        
        # Create Point object from latitude and longitude
        if latitude is not None and longitude is not None:
            attrs['location'] = Point(longitude, latitude)  # Point takes (x, y) = (longitude, latitude)
        
        return attrs

class UserLocationResponseSerializer(serializers.ModelSerializer):
    """Serializer for user location response with additional info"""
    
    coordinates = serializers.SerializerMethodField()
    full_address = serializers.SerializerMethodField()
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()
    
    class Meta:
        model = UserLocation
        fields = [
            "id",
            "latitude",
            "longitude",
            "location",
            "coordinates",
            "address",
            "city",
            "state",
            "country",
            "full_address",
            "last_updated",
            "is_active"
        ]
    
    def get_coordinates(self, obj):
        return obj.coordinates
    
    def get_full_address(self, obj):
        return obj.full_address
    
    def get_latitude(self, obj):
        if obj.location:
            return obj.location.y  # PointField returns (longitude, latitude)
        return None
    
    def get_longitude(self, obj):
        if obj.location:
            return obj.location.x  # PointField returns (longitude, latitude)
        return None
