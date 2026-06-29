import React, { useEffect, useMemo, useState } from "react";
import { Col, Container, Row, Button, Card, Form, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import CarListingCard from "../components/CarListingCard";
import { getCars } from "../features/cars/carSlice";
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
  min_price: bookingSearch?.min_price || "",
  max_price: bookingSearch?.max_price || "",
  min_seats: bookingSearch?.min_seats || "",
  ordering: bookingSearch?.ordering || "-created_at",
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
    if (search.min_price) params.min_price = search.min_price;
    if (search.max_price) params.max_price = search.max_price;
    if (search.min_seats) params.min_seats = search.min_seats;
    if (search.ordering) params.ordering = search.ordering;
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
    search.min_price ||
    search.max_price ||
    search.min_seats ||
    selectedType !== "all";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.start_date && search.end_date && search.end_date < search.start_date) {
      toast.error("Return date must be on or after pickup date");
      return;
    }
    if (
      search.min_price &&
      search.max_price &&
      Number(search.max_price) < Number(search.min_price)
    ) {
      toast.error("Max price must be greater than or equal to min price");
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
      min_price: "",
      max_price: "",
      min_seats: "",
      ordering: "-created_at",
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
            min_price: search.min_price,
            max_price: search.max_price,
            min_seats: search.min_seats,
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
        <Card.Body className="cars-search-card__body">
          <Form onSubmit={handleSearchSubmit} className="cars-search-form">
            <Row className="g-2 align-items-end">
              <Col xs={6} md={3}>
                <Form.Label className="cars-search-form__label">Pickup</Form.Label>
                <Form.Control
                  type="date"
                  className="cars-search-form__control"
                  value={search.start_date}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, start_date: e.target.value }))
                  }
                />
              </Col>
              <Col xs={6} md={3}>
                <Form.Label className="cars-search-form__label">Return</Form.Label>
                <Form.Control
                  type="date"
                  className="cars-search-form__control"
                  value={search.end_date}
                  min={search.start_date}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, end_date: e.target.value }))
                  }
                />
              </Col>
              <Col xs={6} md={3}>
                <Form.Label className="cars-search-form__label">Vehicle type</Form.Label>
                <Form.Select
                  className="cars-search-form__control"
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
              <Col xs={6} md={3}>
                <Form.Label className="cars-search-form__label">City</Form.Label>
                <Form.Control
                  type="text"
                  className="cars-search-form__control"
                  placeholder="Nairobi"
                  value={search.city}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
              </Col>
            </Row>
            <Row className="g-2 align-items-end mt-2">
              <Col xs={6} md={2}>
                <Form.Label className="cars-search-form__label">Min price</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  className="cars-search-form__control"
                  placeholder="KSh/day"
                  value={search.min_price}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, min_price: e.target.value }))
                  }
                />
              </Col>
              <Col xs={6} md={2}>
                <Form.Label className="cars-search-form__label">Max price</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  className="cars-search-form__control"
                  placeholder="KSh/day"
                  value={search.max_price}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, max_price: e.target.value }))
                  }
                />
              </Col>
              <Col xs={6} md={2}>
                <Form.Label className="cars-search-form__label">Min seats</Form.Label>
                <Form.Select
                  className="cars-search-form__control"
                  value={search.min_seats}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, min_seats: e.target.value }))
                  }
                >
                  <option value="">Any</option>
                  {[2, 4, 5, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n}+ seats
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={6} md={3}>
                <Form.Label className="cars-search-form__label">Sort by</Form.Label>
                <Form.Select
                  className="cars-search-form__control"
                  value={search.ordering}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, ordering: e.target.value }))
                  }
                >
                  <option value="-created_at">Newest first</option>
                  <option value="price">Price: low to high</option>
                  <option value="-price">Price: high to low</option>
                </Form.Select>
              </Col>
              <Col xs={12} md={3}>
                <Form.Label className="cars-search-form__label cars-search-form__label--spacer">
                  Search
                </Form.Label>
                <div className="cars-search-form__actions">
                  <Button type="submit" className="btn-accent cars-search-form__submit">
                    Search
                  </Button>
                  {hasActiveSearch && (
                    <Button
                      type="button"
                      variant="outline-secondary"
                      className="cars-search-form__clear"
                      onClick={handleClearSearch}
                      title="Clear filters"
                      aria-label="Clear filters"
                    >
                      <FaTimes />
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {hasActiveSearch && (
        <div className="cars-active-filters mb-4">
          <span className="cars-active-filters__label">Active filters:</span>
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
          {(search.min_price || search.max_price) && (
            <Badge bg="light" text="dark" className="cars-filter-badge">
              {search.min_price && search.max_price
                ? `KSh ${search.min_price}–${search.max_price}/day`
                : search.min_price
                  ? `From KSh ${search.min_price}/day`
                  : `Up to KSh ${search.max_price}/day`}
            </Badge>
          )}
          {search.min_seats && (
            <Badge bg="light" text="dark" className="cars-filter-badge">
              {search.min_seats}+ seats
            </Badge>
          )}
          <Button
            variant="link"
            size="sm"
            className="cars-active-filters__clear"
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

      {filteredCars.length > 0 && (
        <p className="text-muted small mb-3">
          {filteredCars.length} vehicle{filteredCars.length !== 1 ? "s" : ""} available
        </p>
      )}

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
              <CarListingCard car={car} bookingState={bookingState} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CarsPage;
