import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaLocationArrow, FaMapMarkerAlt } from "react-icons/fa";
import Spinner from "../components/Spinner";
import CarMap from "../components/CarMap";
import { getNearbyCars } from "../features/cars/carSlice";
import locationAPIService from "../features/location/locationAPIService";
import getCurrentPosition, { getDefaultCenter } from "../utils/geolocation";
import { resolveCarImage } from "../utils/mediaUrl";
import { formatDailyRate } from "../utils/currency";

const NearbyPage = () => {
  const dispatch = useDispatch();
  const { nearbyCars, isLoading } = useSelector((state) => state.cars);
  const { user } = useSelector((state) => state.auth);

  const [center, setCenter] = useState(getDefaultCenter());
  const [radius, setRadius] = useState(10);
  const [selectedCar, setSelectedCar] = useState(null);
  const [locating, setLocating] = useState(false);

  const fetchNearby = async (coords, searchRadius = radius) => {
    dispatch(
      getNearbyCars({
        latitude: coords.latitude,
        longitude: coords.longitude,
        radius: searchRadius,
      })
    );
  };

  const handleUseMyLocation = async () => {
    setLocating(true);
    try {
      const position = await getCurrentPosition();
      setCenter(position);
      await fetchNearby(position);

      if (user) {
        await locationAPIService.setUserLocation({
          latitude: position.latitude,
          longitude: position.longitude,
          city: "Current location",
        });
      }
      toast.success("Showing cars near your location");
    } catch (error) {
      toast.error("Could not access your location. Using Nairobi as default.");
      await fetchNearby(getDefaultCenter());
    } finally {
      setLocating(false);
    }
  };

  useEffect(() => {
    handleUseMyLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRadiusChange = (e) => {
    const value = Number(e.target.value);
    setRadius(value);
    fetchNearby(center, value);
  };

  return (
    <Container className="py-5" style={{ marginTop: "80px" }}>
      <Row className="mb-4 align-items-end">
        <Col lg={8}>
          <h1 className="fw-bold page-title">Cars near you</h1>
          <p className="text-muted mb-0">
            Discover available rentals around your current location
          </p>
        </Col>
        <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
          <Button
            variant="primary"
            onClick={handleUseMyLocation}
            disabled={locating || isLoading}
          >
            <FaLocationArrow className="me-2" />
            {locating ? "Locating..." : "Refresh location"}
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Search radius: {radius} km</Form.Label>
            <Form.Range
              min={1}
              max={50}
              value={radius}
              onChange={handleRadiusChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="border-0 shadow-sm map-card">
            <Card.Body className="p-0">
              <CarMap
                center={center}
                cars={nearbyCars}
                radiusKm={radius}
                onSelectCar={setSelectedCar}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          {isLoading ? (
            <Spinner />
          ) : nearbyCars.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <FaMapMarkerAlt size={32} className="text-muted mb-3" />
                <h5>No cars found nearby</h5>
                <p className="text-muted">
                  Try increasing the radius or list your own car for rent.
                </p>
                <Link to="/create-car">
                  <Button variant="primary">List a car</Button>
                </Link>
              </Card.Body>
            </Card>
          ) : (
            <div className="nearby-list">
              {nearbyCars.map((car) => (
                <Card
                  key={car.id}
                  className={`border-0 shadow-sm mb-3 nearby-card ${
                    selectedCar?.id === car.id ? "nearby-card-active" : ""
                  }`}
                  onClick={() => setSelectedCar(car)}
                >
                  <Card.Body>
                    <div className="d-flex gap-3">
                      <img
                        src={resolveCarImage(car.cover_photo)}
                        alt={car.title}
                        className="nearby-thumb"
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <h6 className="fw-bold mb-1">{car.title}</h6>
                          {car.distance != null && (
                            <Badge bg="primary">
                              {car.distance.toFixed(1)} km
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted small mb-2">
                          {car.car_type} · {car.city}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>{formatDailyRate(car.price, car.currency || "KES")}</strong>
                          <Link to={`/car/${car.slug}`}>
                            <Button size="sm" variant="outline-primary">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default NearbyPage;
