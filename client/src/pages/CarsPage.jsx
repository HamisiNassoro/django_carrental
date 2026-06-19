import React, { useEffect, useMemo, useState } from "react";
import { Col, Container, Row, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaCar, FaCog, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { getCars } from "../features/cars/carSlice";
import { resolveCarImage } from "../utils/mediaUrl";

const CarsPage = () => {
  const { cars, isLoading, isError, message } = useSelector((state) => state.cars);
  const dispatch = useDispatch();
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    dispatch(getCars());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const vehicleTypes = useMemo(() => {
    const types = new Set(
      (cars || []).map((car) => car.car_type).filter(Boolean)
    );
    return [
      { id: "all", label: "All vehicles" },
      ...Array.from(types).map((type) => ({
        id: type.toLowerCase(),
        label: type,
      })),
    ];
  }, [cars]);

  const filteredCars = useMemo(() => {
    if (selectedFilter === "all") return cars || [];
    return (cars || []).filter(
      (car) => car.car_type?.toLowerCase() === selectedFilter
    );
  }, [cars, selectedFilter]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container className="py-5" style={{ marginTop: "80px" }}>
      <Row className="mb-5">
        <Col className="text-center">
          <h1 className="fw-bold page-title">Available vehicles for rent</h1>
          <p className="text-muted">
            Browse real listings from owners near you
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col className="d-flex justify-content-center flex-wrap gap-2">
          {vehicleTypes.map((vehicleType) => (
            <Button
              key={vehicleType.id}
              variant={
                selectedFilter === vehicleType.id ? "primary" : "outline-secondary"
              }
              onClick={() => setSelectedFilter(vehicleType.id)}
              className="filter-pill"
            >
              {vehicleType.label}
            </Button>
          ))}
        </Col>
      </Row>

      {filteredCars.length === 0 ? (
        <Row>
          <Col className="text-center py-5">
            <h4>No cars available yet</h4>
            <p className="text-muted">
              Be the first to list a vehicle for rent.
            </p>
            <Link to="/create-car">
              <Button variant="primary">List your car</Button>
            </Link>
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
                      <p className="text-muted mb-0">{car.car_type}</p>
                    </div>
                    <div className="text-end">
                      <h4 className="fw-bold mb-0 text-primary">
                        ${Number(car.price).toLocaleString()}
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

                  <Link to={`/car/${car.slug}`} className="text-decoration-none">
                    <Button variant="primary" className="w-100">
                      View & Book
                    </Button>
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
