import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { formatMoney } from "../utils/currency";

const PayBookingModal = ({ show, onHide, booking, onPay, isPaying, defaultPhone = "" }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (show) {
      setPhoneNumber(defaultPhone || "");
    }
  }, [show, defaultPhone]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onPay(phoneNumber);
  };

  if (!booking) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Pay with M-Pesa</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="text-muted mb-3">
            Complete payment for{" "}
            <strong>{booking.car_detail?.title || booking.car}</strong>
          </p>
          {booking.payment_due_at && (
            <p className="small text-warning mb-3">
              Pay before {new Date(booking.payment_due_at).toLocaleString()}
            </p>
          )}
          <div className="booking-summary p-3 rounded mb-3">
            <div className="d-flex justify-content-between mb-2">
              <span>Rental total</span>
              <strong>{formatMoney(booking.total_price, booking.currency)}</strong>
            </div>
            <div className="d-flex justify-content-between small text-muted">
              <span>Platform fee (10%)</span>
              <span>{formatMoney(booking.platform_fee, booking.currency)}</span>
            </div>
          </div>
          <Form.Group>
            <Form.Label>M-Pesa phone number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="e.g. 0712345678 or 254712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              STK push is sent to this number. Use your profile phone or enter another
              M-Pesa line.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="btn-accent" disabled={isPaying}>
            {isPaying ? "Processing..." : "Pay Now"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PayBookingModal;
