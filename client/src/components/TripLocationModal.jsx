import React, { useCallback, useEffect, useState } from "react";
import { Badge, Modal, Spinner } from "react-bootstrap";
import bookingLocationAPIService from "../features/bookings/bookingLocationAPIService";
import TripTrackingMap from "./TripTrackingMap";
import "./TripTrackingMap.css";

const POLL_MS = 8_000;

const formatLastSeen = (recordedAt, staleMinutes) => {
  if (!recordedAt) return "No location received yet";
  if (staleMinutes != null && staleMinutes < 2) return "Updated just now";
  if (staleMinutes != null) return `Last seen ${staleMinutes} min ago`;
  return `Last seen ${new Date(recordedAt).toLocaleString()}`;
};

const TripLocationModal = ({ show, onHide, booking, isOwner = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLocation = useCallback(async () => {
    if (!booking?.pkid) return;
    try {
      const result = await bookingLocationAPIService.getTripLocation(booking.pkid);
      setData(result);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Could not load trip location"
      );
    } finally {
      setLoading(false);
    }
  }, [booking?.pkid]);

  useEffect(() => {
    if (!show || !booking?.pkid) return undefined;

    setLoading(true);
    fetchLocation();
    const timer = setInterval(fetchLocation, POLL_MS);

    return () => clearInterval(timer);
  }, [show, booking?.pkid, fetchLocation]);

  const sharingOn = data?.sharing_enabled;
  const hasLocation = Boolean(data?.latest);
  const isLive = sharingOn && hasLocation && !data?.is_stale;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {isOwner ? "Track active rental" : "Trip location"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {booking && (
          <p className="text-muted small mb-3">
            {booking.car_detail?.title || booking.car}
            {booking.activated_at && (
              <> · Started {new Date(booking.activated_at).toLocaleString()}</>
            )}
          </p>
        )}

        {loading && !data ? (
          <div className="text-center py-5">
            <Spinner animation="border" size="sm" />
          </div>
        ) : error ? (
          <p className="text-danger mb-0">{error}</p>
        ) : (
          <>
            <div className="trip-location-status">
              {!sharingOn && (
                <span className="trip-location-status__badge trip-location-status__badge--off">
                  Sharing off
                </span>
              )}
              {sharingOn && isLive && (
                <span className="trip-location-status__badge trip-location-status__badge--live">
                  Sharing active
                </span>
              )}
              {sharingOn && hasLocation && data?.is_stale && (
                <span className="trip-location-status__badge trip-location-status__badge--stale">
                  Location stale
                </span>
              )}
              <span className="trip-location-meta">
                {formatLastSeen(data?.latest?.recorded_at, data?.stale_minutes)}
              </span>
              {data?.ping_count > 0 && (
                <Badge bg="light" text="dark">
                  {data.ping_count} ping{data.ping_count !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            {!sharingOn && isOwner && (
              <p className="small text-muted mb-3">
                Waiting for the renter to enable location sharing on their device.
              </p>
            )}

            <TripTrackingMap
              latest={data?.latest}
              trail={data?.trail || []}
              followVehicle={isOwner && sharingOn}
            />

            {sharingOn && (
              <p className="small text-muted mt-2 mb-0">
                {isOwner
                  ? "Map follows the vehicle as new GPS points arrive (about every 15 seconds while the renter is sharing)."
                  : "Your route trail updates as location is shared during this rental."}
              </p>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default TripLocationModal;
