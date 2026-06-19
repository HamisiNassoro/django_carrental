import React, { useEffect } from "react";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import {
  cancelBooking,
  getMyBookings,
  reset,
} from "../features/bookings/bookingSlice";

const statusVariant = {
  PENDING: "warning",
  APPROVED: "success",
  DECLINED: "danger",
  CANCELLED: "secondary",
};

const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const { myBookings, isLoading, isError, message } = useSelector(
    (state) => state.bookings
  );

  useEffect(() => {
    dispatch(getMyBookings());
    return () => dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (isError) toast.error(message);
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

  if (isLoading) return <Spinner />;

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
              <Button variant="primary">Browse cars</Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {myBookings.map((booking) => (
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
                    <Badge bg={statusVariant[booking.status] || "secondary"}>
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="mb-3">
                    <strong>Total:</strong> $
                    {Number(booking.total_price).toLocaleString()}
                  </p>
                  {booking.notes && (
                    <p className="text-muted small mb-3">{booking.notes}</p>
                  )}
                  {["PENDING", "APPROVED"].includes(booking.status) && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleCancel(booking.pkid)}
                    >
                      Cancel booking
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyBookingsPage;
