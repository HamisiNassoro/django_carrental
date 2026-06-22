import React, { useEffect } from "react";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
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

const OwnerBookingsPage = () => {
  const dispatch = useDispatch();
  const { ownerBookings, isLoading, isError, message } = useSelector(
    (state) => state.bookings
  );

  useEffect(() => {
    dispatch(getOwnerBookings());
    return () => dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  const handleApprove = async (pkid) => {
    const result = await dispatch(approveBooking(pkid));
    if (approveBooking.fulfilled.match(result)) {
      toast.success(
        result.payload?.message ||
          "Approved — renter will receive a payment prompt"
      );
      dispatch(getOwnerBookings());
    } else {
      toast.error(result.payload || "Could not approve booking");
    }
  };

  const handleDecline = async (pkid) => {
    const result = await dispatch(declineBooking(pkid));
    if (declineBooking.fulfilled.match(result)) {
      toast.success("Booking declined");
      dispatch(getOwnerBookings());
    } else {
      toast.error(result.payload || "Could not decline booking");
    }
  };

  const handleActivate = async (pkid) => {
    const result = await dispatch(activateBooking(pkid));
    if (activateBooking.fulfilled.match(result)) {
      toast.success("Rental marked as active");
      dispatch(getOwnerBookings());
    } else {
      toast.error(result.payload || "Could not activate rental");
    }
  };

  const handleComplete = async (pkid) => {
    const result = await dispatch(completeBooking(pkid));
    if (completeBooking.fulfilled.match(result)) {
      const { type, message } = getCompleteTripToast(result.payload?.owner_payout);
      toast[type](message);
      dispatch(getOwnerBookings());
    } else {
      toast.error(result.payload || "Could not complete trip");
    }
  };

  if (isLoading && ownerBookings.length === 0) return <Spinner />;

  return (
    <Container className="py-5" style={{ marginTop: "80px" }}>
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold page-title">Rental Requests</h1>
          <p className="text-muted mb-4">
            Approve requests, then receive payout after the trip completes.
            {" "}
            <Link to="/profile" className="text-decoration-none">
              Set your M-Pesa payout number
            </Link>
          </p>
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
                  <div className="d-flex justify-content-between align-items-start mb-3">
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
                  <p className="mb-1">
                    <strong>Rental total:</strong>{" "}
                    {formatMoney(booking.total_price, booking.currency)}
                  </p>
                  <p className="mb-1 text-success">
                    <strong>Your payout:</strong>{" "}
                    {formatMoney(booking.owner_payout, booking.currency)}
                  </p>
                  <p className="text-muted small mb-3">
                    Platform fee:{" "}
                    {formatMoney(booking.platform_fee, booking.currency)}
                    {(() => {
                      const payoutLabel = getPayoutStatusLabel(
                        booking.latest_transaction
                      );
                      return payoutLabel ? <> · Payout {payoutLabel}</> : null;
                    })()}
                  </p>
                  {booking.paid_at && (
                    <p className="text-muted small mb-2">
                      Renter paid: {new Date(booking.paid_at).toLocaleString()}
                    </p>
                  )}
                  {booking.activated_at && (
                    <p className="text-muted small mb-2">
                      Rental started: {new Date(booking.activated_at).toLocaleString()}
                    </p>
                  )}
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
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleActivate(booking.pkid)}
                      >
                        Start rental
                      </Button>
                    )}
                    {["PAID", "ACTIVE"].includes(booking.status) && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleComplete(booking.pkid)}
                      >
                        Complete trip
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default OwnerBookingsPage;
