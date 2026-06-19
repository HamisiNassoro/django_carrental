import React, { useEffect, useMemo, useState } from "react";
import { Col, Container, Row, Button, Card, Form, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaCog, FaMapMarkerAlt, FaUsers, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { getCars } from "../features/cars/carSlice";
import { resolveCarImage } from "../utils/mediaUrl";
import { formatDailyRate } from "../utils/currency";
import {
  CAR_TYPE_OPTIONS,
  carMatchesType,
  getCarTypeLabel,
  normalizeCarTypeFilter,
} from "../constants/carTypes";

const buildSearchFromState = (bookingSearch) => ({
  start_date: bookingSearch?.start_date || "",
  end_date: bookingSearch?.end_date || "",
  car_type: normalizeCarTypeFilter(bookingSearch?.carType) || "",
  city: bookingSearch?.rentalPlace || "",
});

const CarsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cars, isLoading, isError, message } = useSelector((state) => state.cars);
  const dispatch = useDispatch();

  const [search, setSearch] = useState(() =>
    buildSearchFromState(location.state?.bookingSearch)
  );
  const [selectedType, setSelectedType] = useState(
    normalizeCarTypeFilter(location.state?.bookingSearch?.carType) || "all"
  );

  const fetchParams = useMemo(() => {
    const params = { rentals_only: true };
    if (search.start_date && search.end_date) {
      params.start_date = search.start_date;
      params.end_date = search.end_date;
    }
    const carType = normalizeCarTypeFilter(
      selectedType !== "all" ? selectedType : search.car_type
    );
    if (carType) params.car_type = carType;
    if (search.city) params.search = search.city;
    return params;
  }, [search, selectedType]);

  useEffect(() => {
    dispatch(getCars(fetchParams));
  }, [dispatch, fetchParams]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const vehicleTypes = useMemo(() => {
    const types = new Set(
      (cars || []).map((car) => car.car_type).filter(Boolean)
    );
    CAR_TYPE_OPTIONS.forEach((option) => types.add(option.value));
    return [
      { id: "all", label: "All vehicles" },
      ...Array.from(types).map((type) => ({
        id: type,
        label: getCarTypeLabel(type),
      })),
    ];
  }, [cars]);

  const filteredCars = useMemo(() => {
    const activeType = selectedType !== "all" ? selectedType : search.car_type;
    return (cars || []).filter((car) => carMatchesType(car, activeType));
  }, [cars, selectedType, search.car_type]);

  const hasActiveSearch =
    search.start_date ||
    search.end_date ||
    search.car_type ||
    search.city ||
    selectedType !== "all";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.start_date && search.end_date && search.end_date < search.start_date) {
      toast.error("Return date must be on or after pickup date");
      return;
    }
    if (search.car_type) {
      setSelectedType(search.car_type);
    }
  };

  const handleClearSearch = () => {
    setSearch({
      start_date: "",
      end_date: "",
      car_type: "",
      city: "",
    });
    setSelectedType("all");
    navigate("/cars", { replace: true, state: null });
  };

  const bookingState =
    search.start_date && search.end_date
      ? {
          bookingSearch: {
            start_date: search.start_date,
            end_date: search.end_date,
            carType: selectedType !== "all" ? selectedType : search.car_type,
            rentalPlace: search.city,
          },
        }
      : undefined;

  if (isLoading && !cars.length) {
    return <Spinner />;
  }

  return (
    <Container className="py-5 cars-page" style={{ marginTop: "80px" }}>
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold page-title mb-2">Available vehicles for rent</h1>
          <p className="text-muted mb-0">
            Search by dates and type. Owners list cars as available; confirmed bookings block those dates automatically.
          </p>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm mb-4 cars-search-card">
        <Card.Body className="p-4">
          <Form onSubmit={handleSearchSubmit}>
            <Row className="g-3 align-items-end">
              <Col md={6} lg={3}>
                <Form.Label className="small text-muted mb-1">Pickup date</Form.Label>
                <Form.Control
                  type="date"
                  value={search.start_date}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, start_date: e.target.value }))
                  }
                />
              </Col>
              <Col md={6} lg={3}>
                <Form.Label className="small text-muted mb-1">Return date</Form.Label>
                <Form.Control
                  type="date"
                  value={search.end_date}
                  min={search.start_date}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, end_date: e.target.value }))
                  }
                />
              </Col>
              <Col md={6} lg={2}>
                <Form.Label className="small text-muted mb-1">Vehicle type</Form.Label>
                <Form.Select
                  value={search.car_type}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearch((prev) => ({ ...prev, car_type: value }));
                    setSelectedType(value || "all");
                  }}
                >
                  <option value="">Any type</option>
                  {CAR_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} lg={2}>
                <Form.Label className="small text-muted mb-1">City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Nairobi"
                  value={search.city}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
              </Col>
              <Col md={12} lg={2} className="d-flex gap-2">
                <Button type="submit" className="btn-accent flex-grow-1">
                  Search
                </Button>
                {hasActiveSearch && (
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={handleClearSearch}
                    title="Clear filters"
                  >
                    <FaTimes />
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {hasActiveSearch && (
        <div className="d-flex flex-wrap gap-2 mb-4 align-items-center">
          <span className="small text-muted me-1">Active filters:</span>
          {search.start_date && search.end_date && (
            <Badge bg="light" text="dark" className="cars-filter-badge">
              {search.start_date} → {search.end_date}
            </Badge>
          )}
          {(selectedType !== "all" || search.car_type) && (
            <Badge bg="light" text="dark" className="cars-filter-badge">
              {getCarTypeLabel(selectedType !== "all" ? selectedType : search.car_type)}
            </Badge>
          )}
          {search.city && (
            <Badge bg="light" text="dark" className="cars-filter-badge">
              {search.city}
            </Badge>
          )}
          <Button
            variant="link"
            size="sm"
            className="text-decoration-none p-0"
            onClick={handleClearSearch}
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="cars-filter-bar mb-4">
        {vehicleTypes.map((vehicleType) => (
          <Button
            key={vehicleType.id}
            size="sm"
            variant={
              (selectedType === "all" && vehicleType.id === "all") ||
              selectedType === vehicleType.id
                ? "dark"
                : "outline-secondary"
            }
            onClick={() => {
              setSelectedType(vehicleType.id);
              if (vehicleType.id === "all") {
                setSearch((prev) => ({ ...prev, car_type: "" }));
              } else {
                setSearch((prev) => ({ ...prev, car_type: vehicleType.id }));
              }
            }}
            className="cars-filter-chip"
          >
            {vehicleType.label}
          </Button>
        ))}
      </div>

      {filteredCars.length === 0 ? (
        <Row>
          <Col className="text-center py-5">
            {hasActiveSearch ? (
              <>
                <h4>No vehicles match your search</h4>
                <p className="text-muted">
                  Try different dates, another vehicle type, or clear filters to see all listings.
                </p>
                <Button variant="outline-secondary" onClick={handleClearSearch}>
                  Clear filters
                </Button>
              </>
            ) : (
              <>
                <h4>No cars available yet</h4>
                <p className="text-muted">
                  Be the first to list a vehicle for rent.
                </p>
                <Link to="/create-car">
                  <Button className="btn-accent">List your car</Button>
                </Link>
              </>
            )}
          </Col>
        </Row>
      ) : (
        <Row>
          {filteredCars.map((car) => (
            <Col key={car.id} lg={4} md={6} className="mb-4">
              <Card className="h-100 car-card border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="text-center mb-3">
                    <img
                      src={resolveCarImage(car.cover_photo)}
                      alt={car.title}
                      className="car-card-image"
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">{car.title}</h5>
                      <p className="text-muted mb-0">
                        {getCarTypeLabel(car.car_type)}
                      </p>
                    </div>
                    <div className="text-end">
                      <h4 className="fw-bold mb-0 text-primary">
                        {formatDailyRate(car.price, car.currency || "KES")}
                      </h4>
                      <small className="text-muted">per day</small>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center gap-4 mb-3 text-muted small">
                    <span>
                      <FaCog className="me-1" />
                      {car.advert_type}
                    </span>
                    <span>
                      <FaUsers className="me-1" />
                      {car.total_seats} seats
                    </span>
                    <span>
                      <FaMapMarkerAlt className="me-1" />
                      {car.city}
                    </span>
                  </div>

                  <Link
                    to={`/car/${car.slug}`}
                    state={bookingState}
                    className="text-decoration-none"
                  >
                    <Button className="w-100 btn-accent">View & Book</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CarsPage;
