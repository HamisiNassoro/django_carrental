import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaCar, FaCog, FaGasPump, FaSnowflake } from "react-icons/fa";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { getCars } from "../features/cars/carSlice";

const CarsPage = () => {
	const { cars, isLoading, isError, message } = useSelector(
		(state) => state.cars
	);

	const dispatch = useDispatch();
	const [selectedFilter, setSelectedFilter] = useState("all");

	useEffect(() => {
		if (isError) {
			toast.error(message, { icon: "😭" });
		}
		dispatch(getCars());
	}, [dispatch, isError, message]);

	// Vehicle type filters
	const vehicleTypes = [
		{ id: "all", label: "All vehicles", icon: <FaCar /> },
		{ id: "sedan", label: "Sedan", icon: <FaCar /> },
		{ id: "cabriolet", label: "Cabriolet", icon: <FaCar /> },
		{ id: "pickup", label: "Pickup", icon: <FaCar /> },
		{ id: "suv", label: "SUV", icon: <FaCar /> },
		{ id: "minivan", label: "Minivan", icon: <FaCar /> }
	];

	// Sample car data matching the design with real images
	const sampleCars = [
		{
			id: 1,
			brand: "Mercedes",
			type: "Sedan",
			price: 25,
			transmission: "Automat",
			fuel: "PB 95",
			airConditioner: true,
			image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop"
		},
		{
			id: 2,
			brand: "Mercedes",
			type: "Sport",
			price: 50,
			transmission: "Manual",
			fuel: "PB 95",
			airConditioner: true,
			image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
		},
		{
			id: 3,
			brand: "Mercedes",
			type: "Sedan",
			price: 45,
			transmission: "Automat",
			fuel: "PB 95",
			airConditioner: true,
			image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop"
		},
		{
			id: 4,
			brand: "Porsche",
			type: "SUV",
			price: 40,
			transmission: "Automat",
			fuel: "PB 95",
			airConditioner: true,
			image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop"
		},
		{
			id: 5,
			brand: "Toyota",
			type: "Sedan",
			price: 35,
			transmission: "Manual",
			fuel: "PB 95",
			airConditioner: true,
			image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
		},
		{
			id: 6,
			brand: "Porsche",
			type: "SUV",
			price: 50,
			transmission: "Automat",
			fuel: "PB 95",
			airConditioner: true,
			image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop"
		},
		{
			id: 7,
			brand: "Mercedes",
			type: "Van",
			price: 50,
			transmission: "Automat",
			fuel: "PB 95",
			airConditioner: true,
			image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop"
		},
		{
			id: 8,
			brand: "Toyota",
			type: "Sport",
			price: 60,
			transmission: "Manual",
			fuel: "PB 95",
			airConditioner: true,
			image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
		},
		{
			id: 9,
			brand: "Maybach",
			type: "Sedan",
			price: 70,
			transmission: "Automat",
			fuel: "PB 95",
			airConditioner: true,
			image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop"
		}
	];

	// Filter cars based on selected filter
	const filteredCars = selectedFilter === "all"
		? sampleCars
		: sampleCars.filter(car => car.type.toLowerCase() === selectedFilter);

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<>
			<Container className="py-5" style={{ marginTop: '80px' }}>
				{/* Page Title */}
				<Row className="mb-5">
					<Col className="text-center">
						<h1 className="fw-bold" style={{ fontSize: '2.5rem', color: '#333' }}>
							Select a vehicle group
						</h1>
					</Col>
				</Row>

				{/* Vehicle Type Filters */}
				<Row className="mb-5">
					<Col className="d-flex justify-content-center">
						<div className="d-flex flex-wrap gap-3 justify-content-center">
							{vehicleTypes.map((vehicleType) => (
								<Button
									key={vehicleType.id}
									variant={selectedFilter === vehicleType.id ? "primary" : "outline-secondary"}
									className="px-4 py-2"
									onClick={() => setSelectedFilter(vehicleType.id)}
									style={{
										borderRadius: '8px',
										fontWeight: '500',
										borderColor: selectedFilter === vehicleType.id ? '#FFD700' : '#dee2e6',
										backgroundColor: selectedFilter === vehicleType.id ? '#FFD700' : 'transparent',
										color: selectedFilter === vehicleType.id ? '#000' : '#6c757d',
										transition: 'all 0.3s ease'
									}}
								>
									<span className="me-2">{vehicleType.icon}</span>
									{vehicleType.label}
								</Button>
							))}
						</div>
					</Col>
				</Row>

				{/* Car Grid */}
				<Row>
					{filteredCars.map((car) => (
						<Col key={car.id} lg={4} md={6} className="mb-4">
							<Card className="h-100 border-0 shadow-sm" style={{
								borderRadius: '12px',
								transition: 'transform 0.3s ease, box-shadow 0.3s ease',
								overflow: 'hidden'
							}}>
								<Card.Body className="p-4">
									{/* Car Image */}
									<div className="text-center mb-3">
										<img
											src={car.image}
											alt={`${car.brand} ${car.type}`}
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
											<h5 className="fw-bold mb-1">{car.brand}</h5>
											<p className="text-muted mb-0">{car.type}</p>
										</div>
										<div className="text-end">
																			<h4 className="fw-bold mb-0" style={{ color: '#000' }}>
									${car.price}
								</h4>
											<small className="text-muted">per day</small>
										</div>
									</div>

									{/* Car Features */}
									<div className="d-flex justify-content-center gap-3 mb-3">
										<div className="text-center">
											<FaCog className="mb-1" style={{ color: '#FFD700' }} />
											<small className="d-block text-muted">{car.transmission}</small>
										</div>
										<div className="text-center">
											<FaGasPump className="mb-1" style={{ color: '#FFD700' }} />
											<small className="d-block text-muted">{car.fuel}</small>
										</div>
										<div className="text-center">
											<FaSnowflake className="mb-1" style={{ color: '#FFD700' }} />
											<small className="d-block text-muted">Air Conditioner</small>
										</div>
									</div>

									{/* View Details Button */}
									<Link to={`/car/${car.id}`} className="text-decoration-none">
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
									</Link>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>

				{/* Car Brand Logos Section */}
				<Row className="mt-5 pt-5">
					<Col className="text-center">
						<h6 className="fw-bold mb-4">Our Partners</h6>
						<div className="d-flex justify-content-center align-items-center gap-5 flex-wrap">
							{['Toyota', 'Ford', 'Mercedes-Benz', 'Jeep', 'BMW', 'Audi'].map((brand, index) => (
								<div key={index} style={{
									width: '80px',
									height: '40px',
									border: '2px solid #dee2e6',
									borderRadius: '8px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontWeight: '600',
									color: '#6c757d',
									fontSize: '0.9rem'
								}}>
									{brand}
								</div>
							))}
						</div>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default CarsPage;