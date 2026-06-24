import React from "react";
import { buildBookingTimeline } from "../utils/bookingTimeline";
import "./BookingTimeline.css";

const BookingTimeline = ({ booking, compact = false }) => {
  const steps = buildBookingTimeline(booking);

  return (
    <div className={`booking-timeline ${compact ? "booking-timeline--compact" : ""}`}>
      <p className="booking-timeline__title">Trip progress</p>
      <ol className="booking-timeline__list">
        {steps.map((step, index) => (
          <li
            key={step.key}
            className={`booking-timeline__step booking-timeline__step--${step.state}`}
          >
            <span className="booking-timeline__marker" aria-hidden="true">
              {step.state === "done" ? "✓" : index + 1}
            </span>
            <div className="booking-timeline__content">
              <div className="booking-timeline__label">{step.label}</div>
              {step.timeLabel && (
                <div className="booking-timeline__time">{step.timeLabel}</div>
              )}
              {step.detail && !compact && (
                <div className="booking-timeline__detail">{step.detail}</div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default BookingTimeline;
