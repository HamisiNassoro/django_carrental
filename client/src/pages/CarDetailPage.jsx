import React, { useState } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
	FaCar,
	FaCog,
	FaGasPump,
	FaSnowflake,
	FaDoorOpen,
	FaUser,
	FaRoad,
	FaCheck,
	FaArrowRight
} from "react-icons/fa";

const CarDetailPage = () => {
	const { id } = useParams();
	const [selectedImage, setSelectedImage] = useState(0);

	// Sample car data - in a real app this would come from an API
	const car = {
		id: id || 1,
		brand: "BMW",
		model: "X5",
		type: "SUV",
		price: 25,
		images: [
			"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop",
			"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
			"https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop"
		],
		specifications: [
			{ icon: <FaCog />, label: "Gear Box", value: "Automat" },
			{ icon: <FaGasPump />, label: "Fuel", value: "Petrol" },
			{ icon: <FaDoorOpen />, label: "Doors", value: "2" },
			{ icon: <FaSnowflake />, label: "Air Conditioner", value: "Yes" },
			{ icon: <FaUser />, label: "Seats", value: "5" },
			{ icon: <FaRoad />, label: "Distance", value: "500" }
		],
		equipment: [
			"ABS", "Air Bags", "Cruise Control", "Air Conditioner"
		]
	};

	// Other cars data
	const otherCars = [
		{
			id: 1,
			brand: "Mercedes",
			type: "Sedan",
			price: 25,
			transmission: "Automat",
			fuel: "PB 95",
			image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop"
		},
		{
			id: 2,
			brand: "Mercedes",
			type: "Sport",
			price: 50,
			transmission: "Manual",
			fuel: "PB 95",
			image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
		},
		{
			id: 3,
			brand: "Porsche",
			type: "SUV",
			price: 40,
			transmission: "Automat",
			fuel: "PB 95",
			image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop"
		},
		{
			id: 4,
			brand: "Toyota",
			type: "Sedan",
			price: 35,
			transmission: "Manual",
			fuel: "PB 95",
			image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop"
		},
		{
			id: 5,
			brand: "Porsche",
			type: "SUV",
			price: 50,
			transmission: "Automat",
			fuel: "PB 95",
			image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
		},
		{
			id: 6,
			brand: "Mercedes",
			type: "Van",
			price: 50,
			transmission: "Automat",
			fuel: "PB 95",
			image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop"
		}
	];

	return (
		<>
			<Container className="py-5" style={{ marginTop: '80px' }}>
				{/* Car Title and Price */}
				<Row className="mb-4">
					<Col>
						<h1 className="fw-bold mb-2">{car.brand}</h1>
						<div className="d-flex align-items-baseline">
							<h2 className="fw-bold mb-0" style={{ color: '#000' }}>${car.price}</h2>
							<span className="ms-2 text-muted">/ day</span>
						</div>
					</Col>
				</Row>

				<Row>
					{/* Left Column - Car Images */}
					<Col lg={8} className="mb-4">
						{/* Main Image */}
						<div className="mb-3">
							<img
								src={car.images[selectedImage]}
								alt={`${car.brand} ${car.model}`}
								style={{
									width: '100%',
									height: '400px',
									objectFit: 'cover',
									borderRadius: '12px',
									boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
								}}
							/>
						</div>

						{/* Thumbnail Images */}
						<div className="d-flex gap-2">
							{car.images.map((image, index) => (
								<div
									key={index}
									onClick={() => setSelectedImage(index)}
									style={{
										cursor: 'pointer',
										border: selectedImage === index ? '3px solid #FFD700' : '3px solid transparent',
										borderRadius: '8px',
										overflow: 'hidden'
									}}
								>
									<img
										src={image}
										alt={`${car.brand} ${car.model} ${index + 1}`}
										style={{
											width: '80px',
											height: '60px',
											objectFit: 'cover',
											filter: selectedImage === index ? 'none' : 'blur(1px)'
										}}
									/>
								</div>
							))}
						</div>
					</Col>

					{/* Right Column - Technical Specifications & Equipment */}
					<Col lg={4} className="mb-4">
						{/* Technical Specification */}
						<div className="mb-4">
							<h5 className="fw-bold mb-3">Technical Specification</h5>
							<Row>
								{car.specifications.map((spec, index) => (
									<Col key={index} xs={6} className="mb-3">
										<Card className="border-0 shadow-sm" style={{
											borderRadius: '8px',
											backgroundColor: '#f8f9fa'
										}}>
											<Card.Body className="p-3 text-center">
												<div className="mb-2" style={{ color: '#FFD700' }}>
													{spec.icon}
												</div>
												<h6 className="fw-bold mb-1">{spec.label}</h6>
												<p className="text-muted mb-0">{spec.value}</p>
											</Card.Body>
										</Card>
									</Col>
								))}
							</Row>
						</div>

						{/* Rent a car button */}
						<Button
							variant="primary"
							size="lg"
							className="w-100 mb-4"
							style={{
								borderRadius: '8px',
								backgroundColor: '#FFD700',
								borderColor: '#FFD700',
								color: '#000',
								padding: '12px'
							}}
						>
							Rent a car
						</Button>

						{/* Car Equipment */}
						<div>
							<h5 className="fw-bold mb-3">Car Equipment</h5>
							<Row>
								<Col xs={6}>
									{car.equipment.slice(0, 3).map((item, index) => (
										<div key={index} className="d-flex align-items-center mb-2">
											<FaCheck className="me-2" style={{ color: '#FFD700' }} />
											<span className="text-muted">{item}</span>
										</div>
									))}
								</Col>
								<Col xs={6}>
									{car.equipment.slice(3).map((item, index) => (
										<div key={index} className="d-flex align-items-center mb-2">
											<FaCheck className="me-2" style={{ color: '#FFD700' }} />
											<span className="text-muted">{item}</span>
										</div>
									))}
								</Col>
							</Row>
						</div>
					</Col>
				</Row>

				{/* Other Cars Section */}
				<section className="mt-5 pt-5">
					<div className="d-flex justify-content-between align-items-center mb-4">
						<h3 className="fw-bold">Other cars</h3>
						<Button variant="link" className="text-decoration-none fw-bold p-0">
							View All <FaArrowRight className="ms-1" />
						</Button>
					</div>

					<Row>
						{otherCars.map((otherCar) => (
							<Col key={otherCar.id} lg={4} md={6} className="mb-4">
								<Card className="h-100 border-0 shadow-sm" style={{
									borderRadius: '12px',
									transition: 'transform 0.3s ease, box-shadow 0.3s ease',
									overflow: 'hidden'
								}}>
									<Card.Body className="p-4">
										{/* Car Image */}
										<div className="text-center mb-3">
											<img
												src={otherCar.image}
												alt={`${otherCar.brand} ${otherCar.type}`}
												style={{
													width: '100%',
													height: '120px',
													objectFit: 'cover',
													borderRadius: '8px',
													boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
												}}
											/>
										</div>

										{/* Car Details */}
										<div className="d-flex justify-content-between align-items-start mb-3">
											<div>
												<h5 className="fw-bold mb-1">{otherCar.brand}</h5>
												<p className="text-muted mb-0">{otherCar.type}</p>
											</div>
											<div className="text-end">
												<h4 className="fw-bold mb-0" style={{ color: '#000' }}>
													${otherCar.price}
												</h4>
												<small className="text-muted">per day</small>
											</div>
										</div>

										{/* Car Features */}
										<div className="d-flex justify-content-center gap-3 mb-3">
											<div className="text-center">
												<FaCog className="mb-1" style={{ color: '#FFD700' }} />
												<small className="d-block text-muted">{otherCar.transmission}</small>
											</div>
											<div className="text-center">
												<FaGasPump className="mb-1" style={{ color: '#FFD700' }} />
												<small className="d-block text-muted">{otherCar.fuel}</small>
											</div>
											<div className="text-center">
												<FaSnowflake className="mb-1" style={{ color: '#FFD700' }} />
												<small className="d-block text-muted">Air Conditioner</small>
											</div>
										</div>

										{/* View Details Button */}
										<Button
											variant="primary"
											className="w-100"
											style={{
												borderRadius: '8px',
												backgroundColor: '#FFD700',
												borderColor: '#FFD700',
												color: '#000'
											}}
										>
											View Details
										</Button>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
				</section>
			</Container>
		</>
	);
};

export default CarDetailPage;