import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { createCar, reset } from "../features/cars/carSlice";

const CreateCarPage = () => {
	const { isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.cars
	);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		country: "KE",
		city: "Nairobi",
		postal_code: "140",
		street_address: "KG8 Avenue",
		car_number: "",
		price: "",
		tax: "0.15",
		total_seats: "",
		advert_type: "For Sale",
		car_type: "Other",
		published_status: false,
		location: "0,0"
	});

	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (isError) {
			toast.error(message, { icon: "😭" });
		}

		if (isSuccess) {
			toast.success("Car created successfully!", { icon: "✅" });
			dispatch(reset());
			navigate("/my-cars");
		}
	}, [dispatch, isError, isSuccess, message, navigate]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ""
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Title is required";
		}

		if (!formData.description.trim()) {
			newErrors.description = "Description is required";
		}

		if (!formData.car_number.trim()) {
			newErrors.car_number = "Car number is required";
		}

		if (!formData.price || formData.price <= 0) {
			newErrors.price = "Valid price is required";
		}

		if (!formData.total_seats || formData.total_seats <= 0) {
			newErrors.total_seats = "Valid number of seats is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (validateForm()) {
			dispatch(createCar(formData));
		}
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<Container className="py-5" style={{ marginTop: '80px' }}>
			<Row className="justify-content-center">
				<Col lg={8}>
					{/* Page Header */}
					<div className="d-flex align-items-center mb-4">
						<Link to="/my-cars" className="me-3">
							<Button variant="outline-secondary" size="sm">
								<FaArrowLeft className="me-1" />
								Back
							</Button>
						</Link>
						<div>
							<h1 className="fw-bold" style={{ color: '#333' }}>
								Add New Car
							</h1>
							<p className="text-muted">
								Create a new car listing
							</p>
						</div>
					</div>

					<Card className="border-0 shadow-sm">
						<Card.Body className="p-4">
							<Form onSubmit={handleSubmit}>
								<Row>
									{/* Basic Information */}
									<Col md={6}>
										<h5 className="mb-3">Basic Information</h5>

										<Form.Group className="mb-3">
											<Form.Label>Car Title *</Form.Label>
											<Form.Control
												type="text"
												name="title"
												value={formData.title}
												onChange={handleInputChange}
												isInvalid={!!errors.title}
												placeholder="Enter car title"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.title}
											</Form.Control.Feedback>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>Car Number *</Form.Label>
											<Form.Control
												type="text"
												name="car_number"
												value={formData.car_number}
												onChange={handleInputChange}
												isInvalid={!!errors.car_number}
												placeholder="Enter car number plate"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.car_number}
											</Form.Control.Feedback>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>Car Type</Form.Label>
											<Form.Select
												name="car_type"
												value={formData.car_type}
												onChange={handleInputChange}
											>
												<option value="Sedan">Sedan</option>
												<option value="Sports Utility Vehicle(SUV)">SUV</option>
												<option value="Hatchback">Hatchback</option>
												<option value="Luxury">Luxury</option>
												<option value="Convertible">Convertible</option>
												<option value="Van">Van</option>
												<option value="Electric">Electric</option>
												<option value="Other">Other</option>
											</Form.Select>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>Advert Type</Form.Label>
											<Form.Select
												name="advert_type"
												value={formData.advert_type}
												onChange={handleInputChange}
											>
												<option value="For Sale">For Sale</option>
												<option value="For Rent">For Rent</option>
												<option value="Auction">Auction</option>
											</Form.Select>
										</Form.Group>
									</Col>

									{/* Pricing and Details */}
									<Col md={6}>
										<h5 className="mb-3">Pricing & Details</h5>

										<Form.Group className="mb-3">
											<Form.Label>Price *</Form.Label>
											<Form.Control
												type="number"
												name="price"
												value={formData.price}
												onChange={handleInputChange}
												isInvalid={!!errors.price}
												placeholder="Enter price"
												step="0.01"
												min="0"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.price}
											</Form.Control.Feedback>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>Tax Rate</Form.Label>
											<Form.Control
												type="number"
												name="tax"
												value={formData.tax}
												onChange={handleInputChange}
												placeholder="Enter tax rate"
												step="0.01"
												min="0"
												max="1"
											/>
											<Form.Text className="text-muted">
												Tax rate as decimal (e.g., 0.15 for 15%)
											</Form.Text>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>Number of Seats *</Form.Label>
											<Form.Control
												type="number"
												name="total_seats"
												value={formData.total_seats}
												onChange={handleInputChange}
												isInvalid={!!errors.total_seats}
												placeholder="Enter number of seats"
												min="1"
												max="20"
											/>
											<Form.Control.Feedback type="invalid">
												{errors.total_seats}
											</Form.Control.Feedback>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Check
												type="checkbox"
												name="published_status"
												label="Publish immediately"
												checked={formData.published_status}
												onChange={handleInputChange}
											/>
										</Form.Group>
									</Col>
								</Row>

								{/* Description */}
								<Row>
									<Col>
										<h5 className="mb-3">Description</h5>
										<Form.Group className="mb-3">
											<Form.Label>Description *</Form.Label>
											<Form.Control
												as="textarea"
												rows={4}
												name="description"
												value={formData.description}
												onChange={handleInputChange}
												isInvalid={!!errors.description}
												placeholder="Describe the car features, condition, and any additional information..."
											/>
											<Form.Control.Feedback type="invalid">
												{errors.description}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
								</Row>

								{/* Location Information */}
								<Row>
									<Col>
										<h5 className="mb-3">Location</h5>
									</Col>
								</Row>
								<Row>
									<Col md={6}>
										<Form.Group className="mb-3">
											<Form.Label>Country</Form.Label>
											<Form.Select
												name="country"
												value={formData.country}
												onChange={handleInputChange}
											>
												<option value="KE">Kenya</option>
												<option value="US">United States</option>
												<option value="UK">United Kingdom</option>
												<option value="CA">Canada</option>
												<option value="AU">Australia</option>
											</Form.Select>
										</Form.Group>
									</Col>
									<Col md={6}>
										<Form.Group className="mb-3">
											<Form.Label>City</Form.Label>
											<Form.Control
												type="text"
												name="city"
												value={formData.city}
												onChange={handleInputChange}
												placeholder="Enter city"
											/>
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col md={6}>
										<Form.Group className="mb-3">
											<Form.Label>Postal Code</Form.Label>
											<Form.Control
												type="text"
												name="postal_code"
												value={formData.postal_code}
												onChange={handleInputChange}
												placeholder="Enter postal code"
											/>
										</Form.Group>
									</Col>
									<Col md={6}>
										<Form.Group className="mb-3">
											<Form.Label>Street Address</Form.Label>
											<Form.Control
												type="text"
												name="street_address"
												value={formData.street_address}
												onChange={handleInputChange}
												placeholder="Enter street address"
											/>
										</Form.Group>
									</Col>
								</Row>

								{/* Submit Button */}
								<Row>
									<Col>
										<div className="d-flex justify-content-end gap-2">
											<Link to="/my-cars">
												<Button variant="outline-secondary">
													Cancel
												</Button>
											</Link>
											<Button
												type="submit"
												variant="primary"
												disabled={isLoading}
												className="d-flex align-items-center gap-2"
												style={{
													backgroundColor: '#FFD700',
													borderColor: '#FFD700',
													color: '#000'
												}}
											>
												{isLoading ? (
													<>
														<span className="spinner-border spinner-border-sm me-2" />
														Creating...
													</>
												) : (
													<>
														<FaSave />
														Create Car
													</>
												)}
											</Button>
										</div>
									</Col>
								</Row>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default CreateCarPage;