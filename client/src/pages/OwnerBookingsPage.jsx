import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BookingTimeline from "../components/BookingTimeline";
import OwnerEarningsSummary from "../components/OwnerEarningsSummary";
import Spinner from "../components/Spinner";
import TripHandoverModal from "../components/TripHandoverModal";
import bookingAPIService from "../features/bookings/bookingAPIService";
import {
  bookingStatusLabel,
  bookingStatusVariant,
  formatMoney,
} from "../utils/currency";
import {
  getCompleteTripToast,
  getPayoutStatusLabel,
} from "../utils/payoutMessages";
import {
  activateBooking,
  approveBooking,
  completeBooking,
  declineBooking,
  getOwnerBookings,
  reset,
} from "../features/bookings/bookingSlice";

const HandoverSummary = ({ booking }) => {
  if (!booking.pickup_mileage && !booking.return_mileage) return null;
  return (
    <div className="handover-summary">
      {booking.pickup_mileage != null && (
        <div>
          Pickup: <strong>{Number(booking.pickup_mileage).toLocaleString()} km</strong>
          {booking.pickup_notes ? ` — ${booking.pickup_notes}` : ""}
        </div>
      )}
      {booking.return_mileage != null && (
        <div className="mt-1">
          Return: <strong>{Number(booking.return_mileage).toLocaleString()} km</strong>
          {booking.return_notes ? ` — ${booking.return_notes}` : ""}
        </div>
      )}
    </div>
  );
};

const OwnerBookingsPage = () => {
  const dispatch = useDispatch();
  const { ownerBookings, isLoading, isError, message } = useSelector(
    (state) => state.bookings
  );
  const [earnings, setEarnings] = useState(null);
  const [handoverTarget, setHandoverTarget] = useState(null);
  const [handoverMode, setHandoverMode] = useState("pickup");
  const [handoverSubmitting, setHandoverSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getOwnerBookings());
    bookingAPIService.getOwnerEarnings().then(setEarnings).catch(() => {});
    return () => dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  const refresh = () => {
    dispatch(getOwnerBookings());
    bookingAPIService.getOwnerEarnings().then(setEarnings).catch(() => {});
  };

  const handleApprove = async (pkid) => {
    const result = await dispatch(approveBooking(pkid));
    if (approveBooking.fulfilled.match(result)) {
      toast.success(result.payload?.message || "Approved — renter can pay now");
      refresh();
    } else {
      toast.error(result.payload || "Could not approve booking");
    }
  };

  const handleDecline = async (pkid) => {
    const result = await dispatch(declineBooking(pkid));
    if (declineBooking.fulfilled.match(result)) {
      toast.success("Booking declined");
      refresh();
    } else {
      toast.error(result.payload || "Could not decline booking");
    }
  };

  const openHandover = (booking, mode) => {
    setHandoverTarget(booking);
    setHandoverMode(mode);
  };

  const handleHandoverSubmit = async (handover) => {
    if (!handoverTarget) return;
    setHandoverSubmitting(true);
    const action =
      handoverMode === "pickup"
        ? activateBooking({ pkid: handoverTarget.pkid, handover })
        : completeBooking({ pkid: handoverTarget.pkid, handover });

    const result = await dispatch(action);
    setHandoverSubmitting(false);

    if (activateBooking.fulfilled.match(result)) {
      toast.success(result.payload?.message || "Rental started");
      setHandoverTarget(null);
      refresh();
    } else if (completeBooking.fulfilled.match(result)) {
      const { type, message: payoutMsg } = getCompleteTripToast(
        result.payload?.owner_payout
      );
      toast[type](payoutMsg);
      setHandoverTarget(null);
      refresh();
    } else {
      toast.error(result.payload || "Could not save checklist");
    }
  };

  if (isLoading && ownerBookings.length === 0) return <Spinner />;

  return (
    <Container className="py-5" style={{ marginTop: "80px" }}>
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold page-title">Rental Requests</h1>
          <p className="text-muted mb-3">
            Approve requests, hand over the vehicle, then receive payout after the trip
            completes.{" "}
            <Link to="/profile" className="text-decoration-none">
              Set your M-Pesa payout number
            </Link>
          </p>
          <OwnerEarningsSummary earnings={earnings} />
        </Col>
      </Row>

      {ownerBookings.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <h4>No rental requests yet</h4>
            <p className="text-muted">
              When renters book your cars, requests will appear here.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {ownerBookings.map((booking) => (
            <Col md={6} key={booking.id}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="fw-bold mb-1">
                        {booking.car_detail?.title || booking.car}
                      </h5>
                      <p className="text-muted mb-0">
                        {booking.start_date} → {booking.end_date}
                      </p>
                    </div>
                    <Badge bg={bookingStatusVariant[booking.status] || "secondary"}>
                      {bookingStatusLabel[booking.status] || booking.status}
                    </Badge>
                  </div>

                  <BookingTimeline booking={booking} compact />

                  <p className="mb-1">
                    <strong>Rental total:</strong>{" "}
                    {formatMoney(booking.total_price, booking.currency)}
                  </p>
                  <p className="mb-1 text-success">
                    <strong>Your payout:</strong>{" "}
                    {formatMoney(booking.owner_payout, booking.currency)}
                  </p>
                  <p className="text-muted small mb-2">
                    Platform fee:{" "}
                    {formatMoney(booking.platform_fee, booking.currency)}
                    {(() => {
                      const payoutLabel = getPayoutStatusLabel(
                        booking.latest_transaction
                      );
                      return payoutLabel ? <> · Payout {payoutLabel}</> : null;
                    })()}
                  </p>

                  <HandoverSummary booking={booking} />

                  {booking.notes && (
                    <p className="text-muted small mb-3">{booking.notes}</p>
                  )}

                  <div className="d-flex flex-wrap gap-2">
                    {booking.status === "PENDING" && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprove(booking.pkid)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDecline(booking.pkid)}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {booking.status === "PAID" && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="btn-accent"
                        onClick={() => openHandover(booking, "pickup")}
                      >
                        Start rental (pickup)
                      </Button>
                    )}
                    {booking.status === "ACTIVE" && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => openHandover(booking, "return")}
                      >
                        Complete trip (return)
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <TripHandoverModal
        show={Boolean(handoverTarget)}
        onHide={() => setHandoverTarget(null)}
        mode={handoverMode}
        booking={handoverTarget}
        onSubmit={handleHandoverSubmit}
        isSubmitting={handoverSubmitting}
      />
    </Container>
  );
};

export default OwnerBookingsPage;
