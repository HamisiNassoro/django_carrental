import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import {
	FaCar,
	FaCog,
	FaGasPump,
	FaSnowflake,
	FaDoorOpen,
	FaUser,
	FaRoad,
	FaCheck,
	FaArrowRight,
	FaMapMarkerAlt,
	FaCalendarAlt,
	FaEye
} from "react-icons/fa";
import { getCar, reset } from "../features/cars/carSlice";

const CarDetailPage = () => {
	const { slug } = useParams();
	const { car, isLoading, isError, message } = useSelector(
		(state) => state.cars
	);

	const dispatch = useDispatch();
	const [selectedImage, setSelectedImage] = useState(0);

	useEffect(() => {
		if (slug) {
			dispatch(getCar(slug));
		}
	}, [dispatch, slug]);

	useEffect(() => {
		if (isError) {
			toast.error(message, { icon: "😭" });
		}
	}, [isError, message]);

	if (isLoading) {
		return <Spinner />;
	}

	if (!car || Object.keys(car).length === 0) {
		return (
			<Container className="py-5" style={{ marginTop: '80px' }}>
				<div className="text-center">
					<h3>Car not found</h3>
					<Link to="/cars">
						<Button variant="primary">Back to Cars</Button>
					</Link>
				</div>
			</Container>
		);
	}

	// Car images array
	const carImages = [
		car.cover_photo,
		car.photo1,
		car.photo2,
		car.photo3,
		car.photo4
	].filter(img => img && img !== "/car_sample.jpg" && img !== "/interior_sample.jpg");

	// Car specifications
	const specifications = [
		{ icon: <FaCog />, label: "Car Type", value: car.car_type },
		{ icon: <FaUser />, label: "Seats", value: car.total_seats },
		{ icon: <FaGasPump />, label: "Advert Type", value: car.advert_type },
		{ icon: <FaMapMarkerAlt />, label: "Location", value: `${car.city}, ${car.country}` },
		{ icon: <FaEye />, label: "Views", value: car.views },
		{ icon: <FaCalendarAlt />, label: "Status", value: car.published_status ? "Published" : "Draft" }
	];

	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	return (
		<Container className="py-5" style={{ marginTop: '80px' }}>
			<Row>
				{/* Car Images */}
				<Col lg={8}>
					<Card className="border-0 shadow-sm mb-4">
						<div className="position-relative">
							<img
								src={carImages[selectedImage] || car.cover_photo}
								alt={car.title}
								className="w-100"
								style={{ height: '400px', objectFit: 'cover' }}
							/>
							<Badge
								bg={car.published_status ? "success" : "warning"}
								className="position-absolute top-0 start-0 m-3"
							>
								{car.published_status ? "Published" : "Draft"}
							</Badge>
							<Badge
								bg="info"
								className="position-absolute top-0 end-0 m-3"
							>
								{car.advert_type}
							</Badge>
						</div>

						{/* Image Thumbnails */}
						{carImages.length > 1 && (
							<div className="d-flex gap-2 p-3">
								{carImages.map((image, index) => (
									<img
										key={index}
										src={image}
										alt={`${car.title} ${index + 1}`}
										className={`border ${selectedImage === index ? 'border-primary' : 'border-light'}`}
										style={{
											width: '80px',
											height: '60px',
											objectFit: 'cover',
											cursor: 'pointer'
										}}
										onClick={() => setSelectedImage(index)}
									/>
								))}
							</div>
						)}
					</Card>
				</Col>

				{/* Car Details */}
				<Col lg={4}>
					<Card className="border-0 shadow-sm mb-4">
						<Card.Body className="p-4">
							<h2 className="fw-bold mb-3">{car.title}</h2>
							<p className="text-muted mb-4">{car.description}</p>

							<div className="mb-4">
								<h3 className="fw-bold text-primary mb-2">
									${numberWithCommas(Number(car.price))}
								</h3>
								<small className="text-muted">
									Price (Tax: ${numberWithCommas(Number(car.final_car_price) - Number(car.price))})
								</small>
							</div>

							<div className="mb-4">
								<h5 className="fw-bold mb-3">Specifications</h5>
								<Row>
									{specifications.map((spec, index) => (
										<Col key={index} xs={6} className="mb-3">
											<div className="d-flex align-items-center">
												<span className="text-primary me-2">{spec.icon}</span>
												<div>
													<small className="text-muted d-block">{spec.label}</small>
													<strong>{spec.value}</strong>
												</div>
											</div>
										</Col>
									))}
								</Row>
							</div>

							<div className="mb-4">
								<h5 className="fw-bold mb-3">Location</h5>
								<div className="d-flex align-items-center mb-2">
									<FaMapMarkerAlt className="text-primary me-2" />
									<span>{car.street_address}</span>
								</div>
								<div className="d-flex align-items-center mb-2">
									<FaMapMarkerAlt className="text-primary me-2" />
									<span>{car.city}, {car.postal_code}</span>
								</div>
								<div className="d-flex align-items-center">
									<FaMapMarkerAlt className="text-primary me-2" />
									<span>{car.country}</span>
								</div>
							</div>

							<Button
								variant="primary"
								size="lg"
								className="w-100 d-flex align-items-center justify-content-center gap-2"
								style={{
									backgroundColor: '#FFD700',
									borderColor: '#FFD700',
									color: '#000'
								}}
							>
								<FaArrowRight />
								Contact Owner
							</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* Additional Information */}
			<Row className="mt-5">
				<Col>
					<Card className="border-0 shadow-sm">
						<Card.Body className="p-4">
							<h4 className="fw-bold mb-4">Car Details</h4>
							<Row>
								<Col md={6}>
									<h6 className="fw-bold mb-3">Basic Information</h6>
									<ul className="list-unstyled">
										<li className="mb-2">
											<strong>Reference Code:</strong> {car.ref_code}
										</li>
										<li className="mb-2">
											<strong>Car Number:</strong> {car.car_number}
										</li>
										<li className="mb-2">
											<strong>Car Type:</strong> {car.car_type}
										</li>
										<li className="mb-2">
											<strong>Total Seats:</strong> {car.total_seats}
										</li>
									</ul>
								</Col>
								<Col md={6}>
									<h6 className="fw-bold mb-3">Pricing</h6>
									<ul className="list-unstyled">
										<li className="mb-2">
											<strong>Base Price:</strong> ${numberWithCommas(Number(car.price))}
										</li>
										<li className="mb-2">
											<strong>Tax Rate:</strong> {(Number(car.tax) * 100).toFixed(1)}%
										</li>
										<li className="mb-2">
											<strong>Final Price:</strong> ${numberWithCommas(Number(car.final_car_price))}
										</li>
										<li className="mb-2">
											<strong>Advert Type:</strong> {car.advert_type}
										</li>
									</ul>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default CarDetailPage;