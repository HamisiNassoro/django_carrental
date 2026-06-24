import React from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaCog, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { formatDailyRate } from "../utils/currency";
import { resolveCarImage } from "../utils/mediaUrl";
import { getCarTypeLabel } from "../constants/carTypes";
import StarRating from "./StarRating";
import "./CarListingCard.css";

const CarListingCard = ({ car, bookingState, className = "" }) => {
  const currency = car.currency || "KES";

  return (
    <Card className={`car-listing-card border-0 shadow-sm h-100 ${className}`}>
      <div className="car-listing-card__media">
        <img
          src={resolveCarImage(car.cover_photo)}
          alt={car.title}
          className="car-listing-card__image"
          onError={(e) => {
            e.currentTarget.src = resolveCarImage(null);
          }}
        />
        {car.owner_rating > 0 && (
          <div className="car-listing-card__rating">
            <StarRating value={car.owner_rating} readOnly size="sm" />
          </div>
        )}
      </div>
      <Card.Body className="car-listing-card__body">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <div>
            <h5 className="car-listing-card__title">{car.title}</h5>
            <p className="car-listing-card__type mb-0">
              {getCarTypeLabel(car.car_type)}
            </p>
          </div>
          <div className="text-end">
            <div className="car-listing-card__price">
              {formatDailyRate(car.price, currency)}
            </div>
            <small className="text-muted">per day</small>
          </div>
        </div>

        <div className="car-listing-card__meta">
          <span>
            <FaUsers className="me-1" />
            {car.total_seats} seats
          </span>
          <span>
            <FaMapMarkerAlt className="me-1" />
            {car.city}
          </span>
          <span>
            <FaCog className="me-1" />
            {car.advert_type}
          </span>
        </div>

        {car.owner_num_reviews > 0 && (
          <p className="car-listing-card__reviews small text-muted mb-3">
            {car.owner_num_reviews} owner review{car.owner_num_reviews !== 1 ? "s" : ""}
          </p>
        )}

        <Link
          to={`/car/${car.slug}`}
          state={bookingState}
          className="text-decoration-none"
        >
          <Button className="w-100 btn-accent car-listing-card__cta">
            View & Book
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default CarListingCard;
