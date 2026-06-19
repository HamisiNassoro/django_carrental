import React, { useEffect } from "react";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import {
  approveBooking,
  declineBooking,
  getOwnerBookings,
  reset,
} from "../features/bookings/bookingSlice";

const statusVariant = {
  PENDING: "warning",
  APPROVED: "success",
  DECLINED: "danger",
  CANCELLED: "secondary",
};

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
    if (isError) toast.error(message);
  }, [isError, message]);

  const handleApprove = async (pkid) => {
    const result = await dispatch(approveBooking(pkid));
    if (approveBooking.fulfilled.match(result)) {
      toast.success("Booking approved");
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

  if (isLoading) return <Spinner />;

  return (
    <Container className="py-5" style={{ marginTop: "80px" }}>
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold page-title">Rental Requests</h1>
          <p className="text-muted">
            Approve or decline booking requests for your vehicles
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
                  {booking.status === "PENDING" && (
                    <div className="d-flex gap-2">
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
                    </div>
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

export default OwnerBookingsPage;
