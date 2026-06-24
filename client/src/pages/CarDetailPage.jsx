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
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import StarRating from "../components/StarRating";
import OwnerReviewsSection from "../components/OwnerReviewsSection";
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
import { formatDailyRate, formatMoney } from "../utils/currency";

const CarDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const bookingSearch = location.state?.bookingSearch;
  const { car, isLoading, isError, message } = useSelector(
    (state) => state.cars
  );
  const { user } = useSelector((state) => state.auth);
  const {
    isLoading: bookingLoading,
    isError: bookingError,
    message: bookingMessage,
  } = useSelector((state) => state.bookings);

  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    start_date: "",
    end_date: "",
    notes: "",
  });

  const isOwnCar =
    user &&
    car &&
    (car.owner_id === user.id ||
      (car.user &&
        String(car.user).toLowerCase() === String(user.username).toLowerCase()));

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
    if (bookingError && bookingMessage) {
      toast.error(bookingMessage);
      dispatch(resetBookings());
    }
  }, [bookingError, bookingMessage, dispatch]);

  useEffect(() => {
    if (bookingSearch?.start_date && bookingSearch?.end_date) {
      setBookingForm((prev) => ({
        ...prev,
        start_date: bookingSearch.start_date,
        end_date: bookingSearch.end_date,
      }));
    }
  }, [bookingSearch?.start_date, bookingSearch?.end_date]);

  const handleBookClick = () => {
    if (!user) {
      toast.info("Please log in to book this car");
      navigate("/login", { state: { from: `/car/${slug}` } });
      return;
    }
    if (isOwnCar) {
      toast.info("This is your own listing — you cannot book it");
      return;
    }
    dispatch(resetBookings());
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!bookingForm.start_date || !bookingForm.end_date) {
      toast.error("Please select start and end dates");
      return;
    }

    if (bookingForm.end_date < bookingForm.start_date) {
      toast.error("End date must be on or after start date");
      return;
    }

    if (isOwnCar) {
      toast.error("You cannot book your own car");
      return;
    }

    const result = await dispatch(
      createBooking({
        car: slug,
        start_date: bookingForm.start_date,
        end_date: bookingForm.end_date,
        notes: bookingForm.notes,
      })
    );

    if (createBooking.fulfilled.match(result)) {
      toast.success("Booking request submitted!");
      setShowBookingModal(false);
      setBookingForm({ start_date: "", end_date: "", notes: "" });
      dispatch(resetBookings());
      navigate("/my-bookings");
    }
  };

  const bookingDays =
    bookingForm.start_date && bookingForm.end_date
      ? Math.max(
          1,
          Math.ceil(
            (new Date(bookingForm.end_date) - new Date(bookingForm.start_date)) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  const estimatedTotal = bookingDays * Number(car?.price || 0);
  const currency = car?.currency || "KES";

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
              {car.owner_rating != null && car.owner_rating > 0 && (
                <div className="d-flex align-items-center gap-2 mb-3">
                  <StarRating
                    value={car.owner_rating}
                    readOnly
                    size="sm"
                    showValue
                  />
                  <span className="text-muted small">
                    · {car.owner_num_reviews || 0} owner review
                    {(car.owner_num_reviews || 0) !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {car.owner_name && (
                <p className="text-muted small mb-3">
                  Listed by <strong>{car.owner_name}</strong>
                </p>
              )}
              <p className="text-muted mb-4">{car.description}</p>

              <div className="mb-4">
                <h3 className="fw-bold text-primary mb-2">
                  {formatMoney(car.price, currency)}
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
                className={`w-100 d-flex align-items-center justify-content-center gap-2 ${
                  isOwnCar ? "" : "btn-accent"
                }`}
                onClick={handleBookClick}
                disabled={isOwnCar}
              >
                <FaArrowRight />
                {isOwnCar ? "Your Listing" : "Book This Car"}
              </Button>
              {isOwnCar && (
                <small className="text-muted d-block mt-2 text-center">
                  You cannot book a car you are listing
                </small>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {car.owner_profile_id && (
        <Row className="mt-2">
          <Col lg={8}>
            <OwnerReviewsSection
              profileId={car.owner_profile_id}
              ownerRating={car.owner_rating}
              ownerNumReviews={car.owner_num_reviews}
            />
          </Col>
        </Row>
      )}

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
            {bookingDays > 0 && (
              <div className="booking-summary p-3 rounded mb-3">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">
                    {bookingDays} day{bookingDays !== 1 ? "s" : ""} ×{" "}
                    {formatMoney(car.price, currency)}
                  </span>
                  <strong>{formatMoney(estimatedTotal, currency)}</strong>
                </div>
              </div>
            )}
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
              type="button"
              variant="secondary"
              onClick={() => setShowBookingModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="btn-accent"
              disabled={bookingLoading}
            >
              {bookingLoading ? "Submitting..." : "Request Booking"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default CarDetailPage;
