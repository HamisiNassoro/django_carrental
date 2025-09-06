from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from .models import UserLocation
from .serializers import (
    UserLocationSerializer,
    UpdateUserLocationSerializer,
    UserLocationResponseSerializer
)

User = get_user_model()

class UserLocationAPIView(generics.RetrieveAPIView):
    """Get current user's location"""
    
    serializer_class = UserLocationResponseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        try:
            return UserLocation.objects.get(user=self.request.user, is_active=True)
        except UserLocation.DoesNotExist:
            return None
    
    def retrieve(self, request, *args, **kwargs):
        user_location = self.get_object()
        
        if user_location is None:
            return Response({
                'message': 'No location found for this user',
                'has_location': False
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(user_location)
        return Response({
            'message': 'User location retrieved successfully',
            'has_location': True,
            'location': serializer.data
        })

class UpdateUserLocationAPIView(generics.UpdateAPIView):
    """Update or create user's current location"""
    
    serializer_class = UpdateUserLocationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        try:
            return UserLocation.objects.get(user=self.request.user)
        except UserLocation.DoesNotExist:
            return None
    
    def update(self, request, *args, **kwargs):
        user_location = self.get_object()
        
        if user_location is None:
            # Create new location
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user_location = serializer.save(user=request.user)
            
            return Response({
                'message': 'User location created successfully',
                'location': UserLocationResponseSerializer(user_location).data
            }, status=status.HTTP_201_CREATED)
        
        # Update existing location
        serializer = self.get_serializer(user_location, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user_location = serializer.save()
        
        return Response({
            'message': 'User location updated successfully',
            'location': UserLocationResponseSerializer(user_location).data
        })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def set_user_location(request):
    """Set user's current location (alternative to update endpoint)"""
    
    try:
        user_location, created = UserLocation.objects.get_or_create(
            user=request.user,
            defaults={
                'latitude': request.data.get('latitude'),
                'longitude': request.data.get('longitude'),
                'address': request.data.get('address'),
                'city': request.data.get('city'),
                'state': request.data.get('state'),
                'country': request.data.get('country')
            }
        )
        
        if not created:
            # Update existing location
            user_location.latitude = request.data.get('latitude', user_location.latitude)
            user_location.longitude = request.data.get('longitude', user_location.longitude)
            user_location.address = request.data.get('address', user_location.address)
            user_location.city = request.data.get('city', user_location.city)
            user_location.state = request.data.get('state', user_location.state)
            user_location.country = request.data.get('country', user_location.country)
            user_location.save()
        
        serializer = UserLocationResponseSerializer(user_location)
        
        return Response({
            'message': 'Location set successfully',
            'created': created,
            'location': serializer.data
        })
        
    except Exception as e:
        return Response({
            'error': 'Failed to set location',
            'detail': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def clear_user_location(request):
    """Clear user's current location"""
    
    try:
        user_location = UserLocation.objects.get(user=request.user)
        user_location.is_active = False
        user_location.save()
        
        return Response({
            'message': 'User location cleared successfully'
        })
        
    except UserLocation.DoesNotExist:
        return Response({
            'message': 'No location found for this user'
        }, status=status.HTTP_404_NOT_FOUND)
