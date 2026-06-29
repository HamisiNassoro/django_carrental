import React, { useEffect, useMemo, useState } from "react";
import { Button, Container, Row, Col, Form, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaShieldAlt,
  FaStar,
  FaMobileAlt,
  FaHandshake,
} from "react-icons/fa";
import { getCars } from "../features/cars/carSlice";
import CarListingCard from "../components/CarListingCard";
import { CAR_TYPE_OPTIONS } from "../constants/carTypes";
import "./HomePage.css";

const FEATURES = [
  {
    icon: <FaMapMarkerAlt />,
    title: "Cars near you",
    text: "Browse listings in Nairobi and across Kenya, or use the map to find vehicles close to your location.",
  },
  {
    icon: <FaMobileAlt />,
    title: "Pay with M-Pesa",
    text: "Book with confidence — pay securely via STK Push after the owner approves your request.",
  },
  {
    icon: <FaStar />,
    title: "Trusted owners",
    text: "Read verified reviews from past renters before you book. Rate owners after every completed trip.",
  },
  {
    icon: <FaHandshake />,
    title: "Handover checklist",
    text: "Pickup and return records keep both parties aligned on mileage, condition, and trip completion.",
  },
];

const STEPS = [
  {
    title: "Find a car",
    text: "Search by dates, city, price, and vehicle type across peer-to-peer listings.",
  },
  {
    title: "Request & pay",
    text: "The owner approves your dates, then you pay with M-Pesa to confirm the rental.",
  },
  {
    title: "Pick up & drive",
    text: "Meet the owner, complete the pickup checklist, and enjoy your trip.",
  },
  {
    title: "Return & review",
    text: "Complete the return checklist and leave a review to help the next renter.",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cars, isLoading } = useSelector((state) => state.cars);

  const [bookingForm, setBookingForm] = useState({
    carType: "",
    rentalPlace: "",
    rentalDate: "",
    returnDate: "",
  });

  useEffect(() => {
    dispatch(getCars({ rentals_only: true }));
  }, [dispatch]);

  const fleetCars = useMemo(() => (cars || []).slice(0, 6), [cars]);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const bookingState = useMemo(() => {
    if (!bookingForm.rentalDate || !bookingForm.returnDate) return undefined;
    return {
      bookingSearch: {
        carType: bookingForm.carType,
        rentalPlace: bookingForm.rentalPlace,
        start_date: bookingForm.rentalDate,
        end_date: bookingForm.returnDate,
      },
    };
  }, [bookingForm]);

  const handleBookingChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookNow = (e) => {
    e.preventDefault();

    if (!bookingForm.rentalDate || !bookingForm.returnDate) {
      toast.info("Please select pickup and return dates");
      return;
    }

    if (bookingForm.returnDate < bookingForm.rentalDate) {
      toast.error("Return date must be on or after pickup date");
      return;
    }

    navigate("/cars", { state: bookingState });
  };

  return (
    <>
      <section className="home-hero">
        <div className="home-hero__bg" aria-hidden="true" />
        <Container className="home-hero__content">
          <Row className="align-items-center g-4 g-lg-5">
            <Col lg={6}>
              <span className="home-hero__eyebrow">Peer-to-peer · Kenya</span>
              <h1 className="home-hero__title">
                Rent cars from local owners
              </h1>
              <p className="home-hero__subtitle">
                Discover well-maintained vehicles listed by real people in your
                city. Transparent daily rates in KSh, M-Pesa payments, and owner
                reviews you can trust.
              </p>
              <div className="home-hero__actions">
                <Button
                  as={Link}
                  to="/cars"
                  size="lg"
                  className="btn-accent px-4"
                >
                  Browse vehicles
                </Button>
                <Button
                  as={Link}
                  to="/nearby"
                  size="lg"
                  variant="outline-light"
                  className="px-4"
                >
                  Find nearby
                </Button>
              </div>
              <div className="home-trust-pills">
                <span className="home-trust-pill">
                  <FaMobileAlt /> M-Pesa payments
                </span>
                <span className="home-trust-pill">
                  <FaStar /> Owner reviews
                </span>
                <span className="home-trust-pill">
                  <FaShieldAlt /> Handover records
                </span>
              </div>
            </Col>

            <Col lg={6}>
              <Card className="home-booking-card">
                <Card.Body className="home-booking-card__body">
                  <h2 className="home-booking-card__title">Plan your trip</h2>
                  <p className="home-booking-card__subtitle">
                    Pick your dates and preferences — we&apos;ll show matching listings.
                  </p>
                  <Form onSubmit={handleBookNow} className="home-booking-form">
                    <Row className="g-2">
                      <Col xs={6}>
                        <Form.Label htmlFor="home-pickup-date" className="home-booking-form__label">
                          Pickup
                        </Form.Label>
                        <Form.Control
                          id="home-pickup-date"
                          type="date"
                          className="home-booking-form__control"
                          min={today}
                          value={bookingForm.rentalDate}
                          onChange={(e) =>
                            handleBookingChange("rentalDate", e.target.value)
                          }
                          required
                        />
                      </Col>
                      <Col xs={6}>
                        <Form.Label htmlFor="home-return-date" className="home-booking-form__label">
                          Return
                        </Form.Label>
                        <Form.Control
                          id="home-return-date"
                          type="date"
                          className="home-booking-form__control"
                          min={bookingForm.rentalDate || today}
                          value={bookingForm.returnDate}
                          onChange={(e) =>
                            handleBookingChange("returnDate", e.target.value)
                          }
                          required
                        />
                      </Col>
                      <Col xs={6}>
                        <Form.Label htmlFor="home-vehicle-type" className="home-booking-form__label">
                          Vehicle type
                        </Form.Label>
                        <Form.Select
                          id="home-vehicle-type"
                          className="home-booking-form__control"
                          value={bookingForm.carType}
                          onChange={(e) =>
                            handleBookingChange("carType", e.target.value)
                          }
                        >
                          <option value="">Any type</option>
                          {CAR_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col xs={6}>
                        <Form.Label htmlFor="home-city" className="home-booking-form__label">
                          City
                        </Form.Label>
                        <Form.Control
                          id="home-city"
                          type="text"
                          className="home-booking-form__control"
                          placeholder="Nairobi"
                          value={bookingForm.rentalPlace}
                          onChange={(e) =>
                            handleBookingChange("rentalPlace", e.target.value)
                          }
                        />
                      </Col>
                      <Col xs={12}>
                        <Button
                          type="submit"
                          className="home-booking-form__submit btn-accent"
                        >
                          Search available cars
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="home-section home-section--muted">
        <Container>
          <Row className="g-4">
            {FEATURES.map((feature) => (
              <Col key={feature.title} md={6} lg={3}>
                <div className="home-feature-card">
                  <div className="home-feature-card__icon">{feature.icon}</div>
                  <h3 className="home-feature-card__title">{feature.title}</h3>
                  <p className="home-feature-card__text">{feature.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="home-section">
        <Container>
          <div className="home-section__header text-center">
            <h2 className="home-section__title">How it works</h2>
            <p className="home-section__subtitle mx-auto">
              From search to return — a clear, professional rental flow built
              for Kenya.
            </p>
          </div>
          <div className="home-steps">
            {STEPS.map((step, index) => (
              <div key={step.title} className="home-step">
                <span className="home-step__number">{index + 1}</span>
                <h3 className="home-step__title">{step.title}</h3>
                <p className="home-step__text">{step.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="home-section home-section--muted">
        <Container>
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 home-section__header mb-0">
            <div>
              <h2 className="home-section__title mb-2">Available now</h2>
              <p className="home-section__subtitle mb-0">
                {fleetCars.length > 0
                  ? "Recently listed vehicles ready to book."
                  : "Be among the first — list your car or check back soon."}
              </p>
            </div>
            <Button
              as={Link}
              to="/cars"
              variant="outline-secondary"
              size="sm"
              className="home-section__view-all"
            >
              View all vehicles →
            </Button>
          </div>

          {isLoading && fleetCars.length === 0 ? (
            <p className="text-muted mt-4 mb-0">Loading listings…</p>
          ) : fleetCars.length === 0 ? (
            <div className="home-empty-fleet mt-4">
              <h4 className="fw-bold mb-2">No listings yet</h4>
              <p className="text-muted mb-4">
                Own a car? List it in minutes and start earning when renters
                book your vehicle.
              </p>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <Button as={Link} to="/create-car" className="btn-accent">
                  List your car
                </Button>
                <Button as={Link} to="/cars" variant="outline-secondary">
                  Browse vehicles
                </Button>
              </div>
            </div>
          ) : (
            <Row className="g-4 mt-1">
              {fleetCars.map((car) => (
                <Col key={car.id} lg={4} md={6}>
                  <CarListingCard car={car} bookingState={bookingState} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      <section className="home-cta-band">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2 className="home-cta-band__title">Earn from your car</h2>
              <p className="home-cta-band__text">
                Join as a vehicle owner, set your daily rate, approve rental
                requests, and receive payouts via M-Pesa when trips complete.
              </p>
            </Col>
            <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
              <Button
                as={Link}
                to="/create-car"
                size="lg"
                className="btn-accent px-4"
              >
                Start listing
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomePage;
