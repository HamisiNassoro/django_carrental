import React, { useEffect, useState } from "react";
import {
	Container,
	Row,
	Col,
	Card,
	Form,
	Button,
	Alert,
	ProgressBar,
} from "react-bootstrap";
import {
	FaArrowLeft,
	FaArrowRight,
	FaCheck,
	FaCar,
	FaDollarSign,
	FaMapMarkerAlt,
	FaCamera,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import getCurrentPosition, { getDefaultCenter } from "../../utils/geolocation";
import CarPhotoUpload, {
	buildEmptyPhotos,
	buildPhotosFromCar,
} from "./CarPhotoUpload";
import {
	INITIAL_FORM_DATA,
	WIZARD_STEPS,
	CAR_TYPE_OPTIONS,
	PHOTO_SLOTS,
} from "./carFormConstants";

const STEP_ICONS = {
	basics: FaCar,
	pricing: FaDollarSign,
	location: FaMapMarkerAlt,
	photos: FaCamera,
};

const CarFormWizard = ({
	mode = "create",
	title,
	subtitle,
	initialFormData,
	initialCar,
	isSubmitting = false,
	onSubmit,
	onCancel,
}) => {
	const [step, setStep] = useState(0);
	const [formData, setFormData] = useState(initialFormData || INITIAL_FORM_DATA);
	const [photos, setPhotos] = useState(
		initialCar ? buildPhotosFromCar(initialCar) : buildEmptyPhotos()
	);
	const [errors, setErrors] = useState({});
	const [locationStatus, setLocationStatus] = useState("");

	const isLastStep = step === WIZARD_STEPS.length - 1;
	const progress = ((step + 1) / WIZARD_STEPS.length) * 100;

	useEffect(() => {
		if (initialFormData) {
			setFormData(initialFormData);
		}
	}, [initialFormData]);

	useEffect(() => {
		if (initialCar) {
			setPhotos(buildPhotosFromCar(initialCar));
		}
	}, [initialCar]);

	useEffect(() => {
		if (mode === "create" || !initialCar?.location?.coordinates) {
			getCurrentPosition()
				.then((position) => {
					setFormData((prev) => ({
						...prev,
						latitude: position.latitude,
						longitude: position.longitude,
					}));
					setLocationStatus("Using your current GPS location");
				})
				.catch(() => {
					const fallback = getDefaultCenter();
					setFormData((prev) => ({
						...prev,
						latitude: fallback.latitude,
						longitude: fallback.longitude,
					}));
					setLocationStatus("Using default Nairobi location");
				});
		} else if (initialCar?.location?.coordinates) {
			setLocationStatus("Location loaded from your listing");
		}
	}, [mode, initialCar]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));

		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handlePhotoChange = (key, entry) => {
		setPhotos((prev) => ({ ...prev, [key]: entry }));
		if (errors[key]) {
			setErrors((prev) => ({ ...prev, [key]: "" }));
		}
	};

	const validateStep = (currentStep) => {
		const newErrors = {};
		const stepId = WIZARD_STEPS[currentStep].id;

		if (stepId === "basics") {
			if (!formData.title.trim()) newErrors.title = "Title is required";
			if (!formData.description.trim()) {
				newErrors.description = "Description is required";
			}
			if (!formData.car_number.trim()) {
				newErrors.car_number = "Car number is required";
			}
		}

		if (stepId === "pricing") {
			if (!formData.price || Number(formData.price) <= 0) {
				newErrors.price = "Valid price is required";
			}
			if (!formData.total_seats || Number(formData.total_seats) <= 0) {
				newErrors.total_seats = "Valid number of seats is required";
			}
		}

		if (stepId === "location") {
			if (!formData.city.trim()) newErrors.city = "City is required";
		}

		if (stepId === "photos" && mode === "create") {
			const cover = photos.cover_photo;
			if (!cover?.file && !cover?.preview) {
				newErrors.cover_photo = "Cover photo is required";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const goNext = () => {
		if (!validateStep(step)) return;
		setStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length - 1));
	};

	const goBack = () => {
		setStep((prev) => Math.max(prev - 1, 0));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateStep(step)) return;
		await onSubmit(formData, photos);
	};

	const renderBasicsStep = () => (
		<Row className="g-4">
			<Col md={6}>
				<Form.Group>
					<Form.Label>Car Title *</Form.Label>
					<Form.Control
						type="text"
						name="title"
						value={formData.title}
						onChange={handleInputChange}
						isInvalid={!!errors.title}
						placeholder="e.g. 2022 Toyota RAV4"
					/>
					<Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
				</Form.Group>
			</Col>
			<Col md={6}>
				<Form.Group>
					<Form.Label>License Plate *</Form.Label>
					<Form.Control
						type="text"
						name="car_number"
						value={formData.car_number}
						onChange={handleInputChange}
						isInvalid={!!errors.car_number}
						placeholder="e.g. KDA 123A"
					/>
					<Form.Control.Feedback type="invalid">
						{errors.car_number}
					</Form.Control.Feedback>
				</Form.Group>
			</Col>
			<Col md={6}>
				<Form.Group>
					<Form.Label>Car Type</Form.Label>
					<Form.Select
						name="car_type"
						value={formData.car_type}
						onChange={handleInputChange}
					>
						{CAR_TYPE_OPTIONS.map((type) => (
							<option key={type.value} value={type.value}>
								{type.label}
							</option>
						))}
					</Form.Select>
				</Form.Group>
			</Col>
			<Col md={6}>
				<Form.Group>
					<Form.Label>Listing Type</Form.Label>
					<Form.Select
						name="advert_type"
						value={formData.advert_type}
						onChange={handleInputChange}
					>
						<option value="For Rent">For Rent</option>
						<option value="For Sale">For Sale</option>
						<option value="Auction">Auction</option>
					</Form.Select>
				</Form.Group>
			</Col>
			<Col xs={12}>
				<Form.Group>
					<Form.Label>Description *</Form.Label>
					<Form.Control
						as="textarea"
						rows={4}
						name="description"
						value={formData.description}
						onChange={handleInputChange}
						isInvalid={!!errors.description}
						placeholder="Describe condition, features, mileage, and what makes this vehicle a great rental..."
					/>
					<Form.Control.Feedback type="invalid">
						{errors.description}
					</Form.Control.Feedback>
				</Form.Group>
			</Col>
		</Row>
	);

	const renderPricingStep = () => (
		<Row className="g-4">
			<Col md={6}>
				<Form.Group>
					<Form.Label>
						{formData.advert_type === "For Rent" ? "Daily Rate (KSh) *" : "Price (KSh) *"}
					</Form.Label>
					<Form.Control
						type="number"
						name="price"
						value={formData.price}
						onChange={handleInputChange}
						isInvalid={!!errors.price}
						placeholder="0.00"
						step="0.01"
						min="0"
					/>
					<Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
				</Form.Group>
			</Col>
			<Col md={6}>
				<Form.Group>
					<Form.Label>Number of Seats *</Form.Label>
					<Form.Control
						type="number"
						name="total_seats"
						value={formData.total_seats}
						onChange={handleInputChange}
						isInvalid={!!errors.total_seats}
						placeholder="5"
						min="1"
						max="20"
					/>
					<Form.Control.Feedback type="invalid">
						{errors.total_seats}
					</Form.Control.Feedback>
				</Form.Group>
			</Col>
			<Col md={6}>
				<Form.Group>
					<Form.Label>Tax Rate</Form.Label>
					<Form.Control
						type="number"
						name="tax"
						value={formData.tax}
						onChange={handleInputChange}
						step="0.01"
						min="0"
						max="1"
					/>
					<Form.Text className="text-muted">
						Decimal format (0.15 = 15%)
					</Form.Text>
				</Form.Group>
			</Col>
			<Col md={6} className="d-flex align-items-center">
				<Form.Group className="mb-0">
					<Form.Check
						type="switch"
						id="is_available"
						name="is_available"
						label="Available for booking"
						checked={formData.is_available}
						onChange={handleInputChange}
					/>
					<Form.Text className="text-muted d-block">
						Turn off to pause new requests. Existing bookings still block those dates.
					</Form.Text>
				</Form.Group>
			</Col>
			<Col md={6} className="d-flex align-items-center">
				<Form.Group className="mb-0">
					<Form.Check
						type="switch"
						id="published_status"
						name="published_status"
						label="Publish listing immediately"
						checked={formData.published_status}
						onChange={handleInputChange}
					/>
					<Form.Text className="text-muted d-block">
						Draft listings are only visible to you
					</Form.Text>
				</Form.Group>
			</Col>
		</Row>
	);

	const renderLocationStep = () => (
		<>
			{locationStatus && (
				<Alert variant="info" className="car-form-alert mb-4">
					<div className="fw-semibold">{locationStatus}</div>
					{formData.latitude && formData.longitude && (
						<div className="small mt-1 text-muted">
							Coordinates: {Number(formData.latitude).toFixed(4)}, {" "}
							{Number(formData.longitude).toFixed(4)}
						</div>
					)}
				</Alert>
			)}
			<Row className="g-4">
				<Col md={6}>
					<Form.Group>
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
					<Form.Group>
						<Form.Label>City *</Form.Label>
						<Form.Control
							type="text"
							name="city"
							value={formData.city}
							onChange={handleInputChange}
							isInvalid={!!errors.city}
							placeholder="Nairobi"
						/>
						<Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
					</Form.Group>
				</Col>
				<Col md={6}>
					<Form.Group>
						<Form.Label>Postal Code</Form.Label>
						<Form.Control
							type="text"
							name="postal_code"
							value={formData.postal_code}
							onChange={handleInputChange}
						/>
					</Form.Group>
				</Col>
				<Col md={6}>
					<Form.Group>
						<Form.Label>Street Address</Form.Label>
						<Form.Control
							type="text"
							name="street_address"
							value={formData.street_address}
							onChange={handleInputChange}
						/>
					</Form.Group>
				</Col>
			</Row>
		</>
	);

	const renderPhotosStep = () => (
		<>
			<p className="text-muted mb-4">
				{mode === "create"
					? "Add at least a cover photo. Listings with more photos get more bookings."
					: "Update any photos below. Leave unchanged to keep existing images."}
			</p>
			<CarPhotoUpload photos={photos} onChange={handlePhotoChange} errors={errors} />
			<div className="photo-upload-tips mt-3">
				<strong>Tips:</strong> Use daylight photos, show interior and exterior, and keep
				images under 5 MB each.
			</div>
		</>
	);

	const stepContent = {
		basics: renderBasicsStep,
		pricing: renderPricingStep,
		location: renderLocationStep,
		photos: renderPhotosStep,
	};

	const currentStep = WIZARD_STEPS[step];

	return (
		<Container className="py-5 car-form-page" style={{ marginTop: "80px" }}>
			<Row className="justify-content-center">
				<Col lg={9} xl={8}>
					<div className="d-flex align-items-center mb-4">
						<Link to="/my-cars" className="me-3">
							<Button variant="outline-secondary" size="sm">
								<FaArrowLeft className="me-1" />
								Back
							</Button>
						</Link>
						<div>
							<h1 className="fw-bold car-form-title">{title}</h1>
							<p className="text-muted mb-0">{subtitle}</p>
						</div>
					</div>

					<Card className="border-0 shadow-sm car-form-card">
						<Card.Body className="p-4 p-md-5">
							<div className="wizard-progress mb-2">
								<div className="d-flex justify-content-between small text-muted mb-2">
									<span>
										Step {step + 1} of {WIZARD_STEPS.length}
									</span>
									<span>{Math.round(progress)}% complete</span>
								</div>
								<ProgressBar now={progress} className="wizard-progress-bar" />
							</div>

							<div className="wizard-steps mb-4">
								{WIZARD_STEPS.map((wizardStep, index) => {
									const Icon = STEP_ICONS[wizardStep.id];
									const isActive = index === step;
									const isComplete = index < step;

									return (
										<button
											key={wizardStep.id}
											type="button"
											className={`wizard-step ${isActive ? "active" : ""} ${
												isComplete ? "complete" : ""
											}`}
											onClick={() => {
												if (index < step) setStep(index);
											}}
											disabled={index > step}
										>
											<span className="wizard-step-icon">
												{isComplete ? <FaCheck /> : <Icon />}
											</span>
											<span className="wizard-step-label">{wizardStep.label}</span>
										</button>
									);
								})}
							</div>

							<Form onSubmit={isLastStep ? handleSubmit : (e) => e.preventDefault()}>
								<div className="wizard-step-heading mb-4">
									<h4 className="fw-semibold mb-1">{currentStep.label}</h4>
									<p className="text-muted mb-0">
										{currentStep.id === "basics" && "Tell renters about your vehicle"}
										{currentStep.id === "pricing" && "Set your rate and availability"}
										{currentStep.id === "location" && "Where can renters pick up the car?"}
										{currentStep.id === "photos" &&
											`Upload up to ${PHOTO_SLOTS.length} photos`}
									</p>
								</div>

								{stepContent[currentStep.id]()}

								<div className="wizard-actions mt-5">
									{step > 0 ? (
										<Button
											type="button"
											variant="outline-secondary"
											onClick={goBack}
											disabled={isSubmitting}
										>
											<FaArrowLeft className="me-2" />
											Back
										</Button>
									) : (
										<Button
											type="button"
											variant="outline-secondary"
											onClick={onCancel}
											disabled={isSubmitting}
										>
											Cancel
										</Button>
									)}

									{isLastStep ? (
										<Button
											type="submit"
											variant="primary"
											className="btn-accent"
											disabled={isSubmitting}
										>
											{isSubmitting ? (
												<>
													<span className="spinner-border spinner-border-sm me-2" />
													{mode === "create" ? "Creating..." : "Saving..."}
												</>
											) : (
												<>
													<FaCheck className="me-2" />
													{mode === "create" ? "Create Listing" : "Save Changes"}
												</>
											)}
										</Button>
									) : (
										<Button
											type="button"
											variant="primary"
											className="btn-accent"
											onClick={goNext}
										>
											Continue
											<FaArrowRight className="ms-2" />
										</Button>
									)}
								</div>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default CarFormWizard;
