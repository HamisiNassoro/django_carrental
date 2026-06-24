import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import StarRating from "./StarRating";
import "./StarRating.css";

const ReviewModal = ({
  show,
  onHide,
  booking,
  onSubmit,
  isSubmitting = false,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleClose = () => {
    setRating(0);
    setComment("");
    onHide();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return;
    onSubmit({ rating, comment: comment.trim() });
  };

  const carTitle = booking?.car_detail?.title || booking?.car || "this trip";

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Rate your experience</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="review-modal__prompt">
            How was your rental of <strong>{carTitle}</strong>? Your review helps
            other renters trust owners on the platform.
          </p>
          <div className="review-modal__stars">
            <span className="review-modal__stars-label">Your rating *</span>
            <StarRating value={rating} onChange={setRating} readOnly={false} size="lg" />
          </div>
          <Form.Group>
            <Form.Label>Comment (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Was the car as described? Was pickup smooth?"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn-accent"
            disabled={isSubmitting || !rating}
          >
            {isSubmitting ? "Submitting..." : "Submit review"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ReviewModal;
