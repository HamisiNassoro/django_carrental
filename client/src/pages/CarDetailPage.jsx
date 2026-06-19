import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Form,
  Modal,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import {
  FaCog,
  FaUser,
  FaGasPump,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEye,
  FaArrowRight,
} from "react-icons/fa";
import { getCar } from "../features/cars/carSlice";
import {
  createBooking,
  reset as resetBookings,
} from "../features/bookings/bookingSlice";
import { resolveCarImage, resolveMediaUrl } from "../utils/mediaUrl";

const CarDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { car, isLoading, isError, message } = useSelector(
    (state) => state.cars
  );
  const { user } = useSelector((state) => state.auth);
  const { isLoading: bookingLoading, isSuccess: bookingSuccess } = useSelector(
    (state) => state.bookings
  );

  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    start_date: "",
    end_date: "",
    notes: "",
  });

  useEffect(() => {
    if (slug) {
      dispatch(getCar(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  useEffect(() => {
    if (bookingSuccess) {
      toast.success("Booking request submitted!");
      setShowBookingModal(false);
      dispatch(resetBookings());
      navigate("/my-bookings");
    }
  }, [bookingSuccess, dispatch, navigate]);

  const handleBookClick = () => {
    if (!user) {
      toast.info("Please log in to book this car");
      navigate("/login", { state: { from: `/car/${slug}` } });
      return;
    }
    setShowBookingModal(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.start_date || !bookingForm.end_date) {
      toast.error("Please select start and end dates");
      return;
    }
    dispatch(
      createBooking({
        car: slug,
        start_date: bookingForm.start_date,
        end_date: bookingForm.end_date,
        notes: bookingForm.notes,
      })
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!car || Object.keys(car).length === 0) {
    return (
      <Container className="py-5" style={{ marginTop: "80px" }}>
        <div className="text-center">
          <h3>Car not found</h3>
          <Link to="/cars">
            <Button variant="primary">Back to Cars</Button>
          </Link>
        </div>
      </Container>
    );
  }

  const carImages = [
    car.cover_photo,
    car.photo1,
    car.photo2,
    car.photo3,
    car.photo4,
  ]
    .filter(Boolean)
    .map((url) => resolveMediaUrl(url))
    .filter((url, index, arr) => arr.indexOf(url) === index);

  const specifications = [
    { icon: <FaCog />, label: "Car Type", value: car.car_type },
    { icon: <FaUser />, label: "Seats", value: car.total_seats },
    { icon: <FaGasPump />, label: "Advert Type", value: car.advert_type },
    {
      icon: <FaMapMarkerAlt />,
      label: "Location",
      value: `${car.city}, ${car.country}`,
    },
    { icon: <FaEye />, label: "Views", value: car.views },
    {
      icon: <FaCalendarAlt />,
      label: "Status",
      value: car.published_status ? "Published" : "Draft",
    },
  ];

  const numberWithCommas = (x) =>
    x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <Container className="py-5" style={{ marginTop: "80px" }}>
      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <div className="position-relative">
              <img
                src={carImages[selectedImage] || resolveCarImage(car.cover_photo)}
                alt={car.title}
                className="w-100 car-detail-image"
                onError={(e) => {
                  e.currentTarget.src = resolveCarImage(null);
                }}
              />
              <Badge
                bg={car.published_status ? "success" : "warning"}
                className="position-absolute top-0 start-0 m-3"
              >
                {car.published_status ? "Published" : "Draft"}
              </Badge>
              <Badge bg="info" className="position-absolute top-0 end-0 m-3">
                {car.advert_type}
              </Badge>
            </div>

            {carImages.length > 1 && (
              <div className="d-flex gap-2 p-3">
                {carImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${car.title} ${index + 1}`}
                    className={`car-thumb ${
                      selectedImage === index ? "car-thumb-active" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                    onError={(e) => {
                      e.currentTarget.src = resolveCarImage(null);
                    }}
                  />
                ))}
              </div>
            )}
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <h2 className="fw-bold mb-3">{car.title}</h2>
              <p className="text-muted mb-4">{car.description}</p>

              <div className="mb-4">
                <h3 className="fw-bold text-primary mb-2">
                  ${numberWithCommas(Number(car.price))}
                </h3>
                <small className="text-muted">per day</small>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold mb-3">Specifications</h5>
                <Row>
                  {specifications.map((spec, index) => (
                    <Col key={index} xs={6} className="mb-3">
                      <div className="d-flex align-items-center">
                        <span className="text-primary me-2">{spec.icon}</span>
                        <div>
                          <small className="text-muted d-block">
                            {spec.label}
                          </small>
                          <strong>{spec.value}</strong>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleBookClick}
              >
                <FaArrowRight />
                Book This Car
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Book {car.title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBookingSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Start date</Form.Label>
              <Form.Control
                type="date"
                value={bookingForm.start_date}
                onChange={(e) =>
                  setBookingForm((prev) => ({
                    ...prev,
                    start_date: e.target.value,
                  }))
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End date</Form.Label>
              <Form.Control
                type="date"
                value={bookingForm.end_date}
                min={bookingForm.start_date}
                onChange={(e) =>
                  setBookingForm((prev) => ({
                    ...prev,
                    end_date: e.target.value,
                  }))
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Notes (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={bookingForm.notes}
                onChange={(e) =>
                  setBookingForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Pickup location, special requests..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowBookingModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={bookingLoading}>
              {bookingLoading ? "Submitting..." : "Request booking"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default CarDetailPage;
