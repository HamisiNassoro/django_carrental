import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import bookingLocationAPIService from "../features/bookings/bookingLocationAPIService";
import { getCurrentPosition } from "../utils/geolocation";
import "./TripTrackingMap.css";

const TripSharingPanel = ({ booking, onUpdated }) => {
  const [submitting, setSubmitting] = useState(false);

  if (booking.status !== "ACTIVE") return null;

  const handleToggle = async () => {
    setSubmitting(true);
    const enabling = !booking.location_sharing_enabled;
    try {
      if (enabling) {
        const position = await getCurrentPosition();
        await bookingLocationAPIService.setLocationSharing(
          booking.pkid,
          true
        );
        await bookingLocationAPIService.sendLocationPing(booking.pkid, {
          latitude: position.latitude,
          longitude: position.longitude,
          accuracy_m: position.accuracy,
          speed_kmh: position.speed_kmh,
          heading: position.heading,
        });
      } else {
        await bookingLocationAPIService.setLocationSharing(
          booking.pkid,
          false
        );
      }
      toast.success(
        enabling
          ? "Location sharing enabled for this trip"
          : "Location sharing stopped"
      );
      onUpdated?.();
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Could not update location sharing";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`trip-sharing-panel ${
        booking.location_sharing_enabled ? "trip-sharing-panel--active" : ""
      }`}
    >
      <div className="trip-sharing-panel__title">Trip location</div>
      <p className="trip-sharing-panel__text mb-0">
        {booking.location_sharing_enabled
          ? "Your location is shared with the owner while this rental is active. GPS updates about every 15 seconds — keep this browser open on your phone or laptop."
          : "Allow the owner to see the vehicle location during your active rental."}
      </p>
      <Button
        variant={booking.location_sharing_enabled ? "outline-secondary" : "success"}
        size="sm"
        className="mt-2"
        onClick={handleToggle}
        disabled={submitting}
      >
        {submitting
          ? "Saving..."
          : booking.location_sharing_enabled
            ? "Stop sharing"
            : "Share location"}
      </Button>
    </div>
  );
};

export default TripSharingPanel;
