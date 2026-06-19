import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import PayBookingModal from "../components/PayBookingModal";
import {
  bookingStatusLabel,
  bookingStatusVariant,
  formatMoney,
} from "../utils/currency";
import {
  cancelBooking,
  completeBooking,
  getMyBookings,
  payBooking,
  reset,
} from "../features/bookings/bookingSlice";

const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const { myBookings, isLoading, isError, message } = useSelector(
    (state) => state.bookings
  );
  const [payTarget, setPayTarget] = useState(null);

  useEffect(() => {
    dispatch(getMyBookings());
    return () => dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  const handleCancel = async (pkid) => {
    const result = await dispatch(cancelBooking(pkid));
    if (cancelBooking.fulfilled.match(result)) {
      toast.success("Booking cancelled");
      dispatch(getMyBookings());
    } else {
      toast.error(result.payload || "Could not cancel booking");
    }
  };

  const handlePay = async (phoneNumber) => {
    if (!payTarget) return;
    const result = await dispatch(
      payBooking({ pkid: payTarget.pkid, phoneNumber })
    );
    if (payBooking.fulfilled.match(result)) {
      toast.success(result.payload.message || "Payment successful");
      setPayTarget(null);
      dispatch(getMyBookings());
    } else {
      toast.error(result.payload || "Payment failed");
    }
  };

  const handleComplete = async (pkid) => {
    const result = await dispatch(completeBooking(pkid));
    if (completeBooking.fulfilled.match(result)) {
      toast.success(result.payload.message || "Trip marked complete");
      dispatch(getMyBookings());
    } else {
      toast.error(result.payload || "Could not complete trip");
    }
  };

  if (isLoading && myBookings.length === 0) return <Spinner />;

  return (
    <Container className="py-5" style={{ marginTop: "80px" }}>
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold page-title">My Bookings</h1>
          <p className="text-muted">Track cars you have rented or requested</p>
        </Col>
      </Row>

      {myBookings.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <h4>No bookings yet</h4>
            <p className="text-muted">Find a car and make your first booking.</p>
            <Link to="/cars">
              <Button variant="primary" className="btn-accent">
                Browse cars
              </Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {myBookings.map((booking) => {
            const needsPayment = ["AWAITING_PAYMENT", "APPROVED"].includes(
              booking.status
            );
            return (
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
                      <strong>Total:</strong>{" "}
                      {formatMoney(booking.total_price, booking.currency)}
                    </p>
                    {booking.platform_fee > 0 && (
                      <p className="text-muted small mb-3">
                        Includes {formatMoney(booking.platform_fee, booking.currency)}{" "}
                        platform fee
                      </p>
                    )}
                    {booking.latest_transaction?.mpesa_receipt_number && (
                      <p className="small text-success mb-3">
                        Receipt: {booking.latest_transaction.mpesa_receipt_number}
                      </p>
                    )}
                    {booking.notes && (
                      <p className="text-muted small mb-3">{booking.notes}</p>
                    )}
                    <div className="d-flex flex-wrap gap-2">
                      {needsPayment && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="btn-accent"
                          onClick={() => setPayTarget(booking)}
                        >
                          Pay with M-Pesa
                        </Button>
                      )}
                      {["PENDING", "AWAITING_PAYMENT", "APPROVED"].includes(
                        booking.status
                      ) && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleCancel(booking.pkid)}
                        >
                          Cancel
                        </Button>
                      )}
                      {["PAID", "ACTIVE"].includes(booking.status) && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleComplete(booking.pkid)}
                        >
                          Mark trip complete
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <PayBookingModal
        show={Boolean(payTarget)}
        onHide={() => setPayTarget(null)}
        booking={payTarget}
        onPay={handlePay}
        isPaying={isLoading}
      />
    </Container>
  );
};

export default MyBookingsPage;
