import React from "react";
import { FaStar } from "react-icons/fa";
import "./StarRating.css";

const StarRating = ({
  value = 0,
  onChange,
  readOnly = false,
  size = "md",
  showValue = false,
}) => {
  const stars = [1, 2, 3, 4, 5];
  const numericValue = Number(value) || 0;

  return (
    <div className={`star-rating star-rating--${size}`}>
      <div className="star-rating__stars" role={readOnly ? "img" : "group"} aria-label={`${numericValue} out of 5 stars`}>
        {stars.map((star) => {
          const filled = star <= Math.round(numericValue);
          const active = star <= numericValue;
          return (
            <button
              key={star}
              type="button"
              className={`star-rating__star ${filled ? "star-rating__star--filled" : ""} ${
                active && !readOnly ? "star-rating__star--active" : ""
              }`}
              onClick={() => !readOnly && onChange?.(star)}
              disabled={readOnly}
              aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            >
              <FaStar />
            </button>
          );
        })}
      </div>
      {showValue && numericValue > 0 && (
        <span className="star-rating__value">
          {numericValue.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
