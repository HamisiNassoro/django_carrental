from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.bookings.models import Booking, BookingStatus
from apps.profiles.models import Profile

from .models import Rating
from .serializers import CreateBookingReviewSerializer, RatingSerializer
from .services import refresh_owner_rating


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def create_booking_review(request, booking_pkid):
    """Renter reviews the car owner after a completed trip."""
    booking = get_object_or_404(
        Booking.objects.select_related("car__user__profile", "renter"),
        pkid=booking_pkid,
    )

    if booking.renter_id != request.user.pkid:
        return Response({"detail": "Only the renter can leave a review"}, status=status.HTTP_403_FORBIDDEN)

    if booking.status != BookingStatus.COMPLETED:
        return Response(
            {"detail": "You can review after the trip is completed"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if hasattr(booking, "renter_review") and booking.renter_review:
        return Response({"detail": "You already reviewed this trip"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = CreateBookingReviewSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    owner_profile = getattr(booking.car.user, "profile", None)
    if not owner_profile:
        return Response({"detail": "Owner profile not found"}, status=status.HTTP_400_BAD_REQUEST)

    if booking.car.user_id == request.user.pkid:
        return Response({"detail": "You can't review yourself"}, status=status.HTTP_403_FORBIDDEN)

    review = Rating.objects.create(
        rater=request.user,
        car_owner=owner_profile,
        booking=booking,
        rating=data["rating"],
        comment=data.get("comment", "").strip(),
    )
    refresh_owner_rating(owner_profile)

    return Response(
        {
            "message": "Thank you for your review",
            "review": RatingSerializer(review).data,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def list_owner_reviews(request, profile_id):
    """Public list of reviews for a car owner profile."""
    profile = get_object_or_404(Profile, id=profile_id)
    reviews = (
        profile.car_owner_review.select_related("rater", "booking__car")
        .order_by("-created_at")
    )
    limit = min(int(request.query_params.get("limit", 10)), 50)
    reviews = reviews[:limit]
    return Response(
        {
            "profile_id": str(profile.id),
            "rating": float(profile.rating) if profile.rating is not None else None,
            "num_reviews": profile.num_reviews or 0,
            "reviews": RatingSerializer(reviews, many=True).data,
        }
    )
