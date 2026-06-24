from decimal import Decimal


def refresh_owner_rating(profile):
    """Recalculate aggregate rating on an owner profile from all reviews."""
    reviews = profile.car_owner_review.all()
    count = reviews.count()
    profile.num_reviews = count
    if count:
        total = sum(review.rating for review in reviews)
        profile.rating = Decimal(str(round(total / count, 2)))
    else:
        profile.rating = None
    profile.save(update_fields=["num_reviews", "rating"])
