import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "./BookingTimeline.css";

const TripHandoverModal = ({
  show,
  onHide,
  mode = "pickup",
  booking,
  onSubmit,
  isSubmitting = false,
}) => {
  const [mileage, setMileage] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const isPickup = mode === "pickup";
  const title = isPickup ? "Pickup checklist" : "Return checklist";
  const submitLabel = isPickup ? "Start rental" : "Complete trip";

  const handleClose = () => {
    setMileage("");
    setNotes("");
    setPhoto(null);
    setConfirmed(false);
    onHide();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mileage || !confirmed) return;
    onSubmit({
      mileage: Number(mileage),
      notes: notes.trim(),
      photo,
    });
  };

  const minMileage = !isPickup && booking?.pickup_mileage != null ? booking.pickup_mileage : 0;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="text-muted small">
            {isPickup
              ? "Record the vehicle condition when handing keys to the renter."
              : "Record the vehicle condition when the trip ends."}
          </p>
          {!isPickup && booking?.pickup_mileage != null && (
            <p className="handover-summary mb-3">
              Pickup odometer: <strong>{Number(booking.pickup_mileage).toLocaleString()} km</strong>
            </p>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Odometer reading (km) *</Form.Label>
            <Form.Control
              type="number"
              min={minMileage}
              step="1"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder={isPickup ? "e.g. 45230" : "Must be ≥ pickup reading"}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isPickup
                  ? "Fuel level, existing scratches, accessories included…"
                  : "Damage, fuel level, late return notes…"
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Photo (optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
            <Form.Text className="text-muted">
              Dashboard or exterior photo for your records.
            </Form.Text>
          </Form.Group>
          <Form.Check
            type="checkbox"
            id="handover-confirmed"
            label={
              isPickup
                ? "I confirm the vehicle was handed over in the stated condition."
                : "I confirm the vehicle was returned in the stated condition."
            }
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn-accent"
            disabled={isSubmitting || !confirmed || !mileage}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TripHandoverModal;
