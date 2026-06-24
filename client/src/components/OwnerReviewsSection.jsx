import React, { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import ratingAPIService from "../features/ratings/ratingAPIService";
import StarRating from "./StarRating";
import "./StarRating.css";

const formatReviewDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

const OwnerReviewsSection = ({ profileId, ownerRating, ownerNumReviews }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profileId) return;
    setLoading(true);
    ratingAPIService
      .getOwnerReviews(profileId, 8)
      .then(setData)
      .catch(() => setData({ reviews: [] }))
      .finally(() => setLoading(false));
  }, [profileId]);

  const reviews = data?.reviews || [];
  const rating = ownerRating ?? data?.rating;
  const count = ownerNumReviews ?? data?.num_reviews ?? 0;

  return (
    <Card className="border-0 shadow-sm owner-reviews">
      <Card.Body className="p-4">
        <div className="owner-reviews__header">
          <h5 className="fw-bold mb-0">Owner reviews</h5>
          {rating != null && rating > 0 && (
            <div className="owner-reviews__summary">
              <StarRating value={rating} readOnly size="sm" showValue />
              <span className="owner-reviews__count">
                ({count} review{count !== 1 ? "s" : ""})
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="owner-reviews__empty mb-0">
            No reviews yet — be the first to rent from this owner.
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="owner-reviews__item">
              <div className="owner-reviews__meta">
                <span className="owner-reviews__rater">{review.rater_name}</span>
                <StarRating value={review.rating} readOnly size="sm" />
              </div>
              {review.car_title && (
                <div className="owner-reviews__car">{review.car_title}</div>
              )}
              {review.comment && (
                <p className="owner-reviews__comment">{review.comment}</p>
              )}
              <div className="owner-reviews__date">
                {formatReviewDate(review.created_at)}
              </div>
            </div>
          ))
        )}
      </Card.Body>
    </Card>
  );
};

export default OwnerReviewsSection;
