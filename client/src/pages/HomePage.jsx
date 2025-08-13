import React, { useState } from "react";
import { Button, Container, Row, Col, Form, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { FaSearch, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCar, FaUser, FaCalendar, FaRoad, FaDownload, FaApple, FaGooglePlay } from "react-icons/fa";

const HomePage = () => {
	const [bookingForm, setBookingForm] = useState({
		carType: "",
		rentalPlace: "",
		returnPlace: "",
		rentalDate: "",
		returnDate: ""
	});

	const features = [
		{
			icon: <FaMapMarkerAlt />,
			title: "Nationwide Coverage",
			description: "Pick up and drop off at any of our locations across Kenya, including major airports and city centers"
		},
		{
			icon: <FaCar />,
			title: "Premium Fleet",
			description: "Well-maintained vehicles ranging from economy to luxury, all equipped with modern amenities"
		},
		{
			icon: <FaUser />,
			title: "Competitive Rates",
			description: "Transparent pricing with no hidden fees and special discounts for long-term rentals"
		}
	];

	const carList = [
		{
			id: 1,
			name: "Mercedes",
			type: "Sedan",
			price: "$25 per day",
			features: ["Automat", "PD 85", "Air Conditioner"],
			image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop"
		},
		{
			id: 2,
			name: "Porsche",
			type: "SUV",
			price: "$50 per day",
			features: ["Automat", "PD 85", "Air Conditioner"],
			image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
		},
		{
			id: 3,
			name: "BMW",
			type: "Sedan",
			price: "$35 per day",
			features: ["Automat", "PD 85", "Air Conditioner"],
			image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop"
		},
		{
			id: 4,
			name: "Audi",
			type: "SUV",
			price: "$45 per day",
			features: ["Automat", "PD 85", "Air Conditioner"],
			image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop"
		},
		{
			id: 5,
			name: "Lexus",
			type: "Sedan",
			price: "$30 per day",
			features: ["Automat", "PD 85", "Air Conditioner"],
			image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
		},
		{
			id: 6,
			name: "Range Rover",
			type: "SUV",
			price: "$60 per day",
			features: ["Automat", "PD 85", "Air Conditioner"],
			image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop"
		}
	];

	const stats = [
		{ icon: <FaCar />, number: "200+", label: "Vehicles" },
		{ icon: <FaUser />, number: "15k+", label: "Happy Customers" },
		{ icon: <FaCalendar />, number: "12+", label: "Years Experience" },
		{ icon: <FaRoad />, number: "5m+", label: "Kilometers Driven" }
	];

	const handleBookingChange = (field, value) => {
		setBookingForm(prev => ({
			...prev,
			[field]: value
		}));
	};

	return (
		<>
			{/* Hero Section */}
			<section style={{
				background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(255, 215, 0, 0.3) 100%)',
				minHeight: '100vh',
				position: 'relative',
				overflow: 'hidden',
				paddingTop: '120px'
			}}>
				{/* Background Image */}
				<div style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'url("https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1920&h=1080&fit=crop")',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundAttachment: 'fixed',
					zIndex: 1
				}}></div>
				{/* Overlay */}
				<div style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(255, 215, 0, 0.2) 100%)',
					zIndex: 2
				}}></div>
				{/* Background pattern */}
				<div style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
					zIndex: 3
				}}></div>

				<Container style={{ position: 'relative', zIndex: 4 }}>
					<Row className="align-items-center min-vh-90">
						<Col lg={6} className="mb-5 mb-lg-0">
							<div className="text-white" style={{ paddingTop: '60px' }}>
								<h1 className="display-4 fw-bold mb-4" style={{
									fontSize: '3.5rem',
									lineHeight: '1.2',
									textShadow: '0 2px 4px rgba(0,0,0,0.3)',
									marginTop: '40px'
								}}>
									Premium Car Rental in Kenya
								</h1>
								<p className="lead mb-5" style={{
									fontSize: '1.25rem',
									opacity: 0.9,
									lineHeight: '1.6'
								}}>
									Discover luxury and comfort with our premium fleet of vehicles. From business trips to family vacations, we provide reliable, well-maintained cars for every journey across Kenya.
								</p>
								<Button
									variant="warning"
									size="lg"
									className="px-4 py-3"
									style={{
										borderRadius: '8px',
										fontWeight: '600',
										fontSize: '1.1rem',
										backgroundColor: '#FFD700',
										border: 'none',
										color: '#000'
									}}
								>
									View all cars
								</Button>
							</div>
						</Col>

						<Col lg={6} className="text-center">
							<div style={{ paddingTop: '80px' }}>
								<Card style={{
									borderRadius: '16px',
									border: 'none',
									boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
									backgroundColor: 'rgba(255,255,255,0.95)',
									backdropFilter: 'blur(10px)'
								}}>
									<Card.Body className="p-4">
										<h4 className="fw-bold mb-4" style={{ color: '#333' }}>Book your car</h4>

										<Form>
											<Row>
												<Col md={6} className="mb-3">
													<Form.Select
														value={bookingForm.carType}
														onChange={(e) => handleBookingChange('carType', e.target.value)}
														style={{ borderRadius: '8px', border: '1px solid #ddd' }}
													>
														<option value="">Car type</option>
														<option value="sedan">Sedan</option>
														<option value="suv">SUV</option>
														<option value="luxury">Luxury</option>
													</Form.Select>
												</Col>
												<Col md={6} className="mb-3">
													<Form.Control
														type="text"
														placeholder="Place of rental"
														value={bookingForm.rentalPlace}
														onChange={(e) => handleBookingChange('rentalPlace', e.target.value)}
														style={{ borderRadius: '8px', border: '1px solid #ddd' }}
													/>
												</Col>
											</Row>
											<Row>
												<Col md={6} className="mb-3">
													<Form.Control
														type="text"
														placeholder="Place of return"
														value={bookingForm.returnPlace}
														onChange={(e) => handleBookingChange('returnPlace', e.target.value)}
														style={{ borderRadius: '8px', border: '1px solid #ddd' }}
													/>
												</Col>
												<Col md={6} className="mb-3">
													<Form.Control
														type="date"
														placeholder="Rental date"
														value={bookingForm.rentalDate}
														onChange={(e) => handleBookingChange('rentalDate', e.target.value)}
														style={{ borderRadius: '8px', border: '1px solid #ddd' }}
													/>
												</Col>
											</Row>
											<Row>
												<Col md={12} className="mb-4">
													<Form.Control
														type="date"
														placeholder="Return date"
														value={bookingForm.returnDate}
														onChange={(e) => handleBookingChange('returnDate', e.target.value)}
														style={{ borderRadius: '8px', border: '1px solid #ddd' }}
													/>
												</Col>
											</Row>
											<Button
												variant="warning"
												size="lg"
												className="w-100 py-3"
												style={{
													borderRadius: '8px',
													fontWeight: '600',
													fontSize: '1.1rem'
												}}
											>
												Book now
											</Button>
										</Form>
									</Card.Body>
								</Card>
							</div>
						</Col>
					</Row>
				</Container>
			</section>

			{/* Features Section */}
			<section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
				<Container>
					<Row>
						{features.map((feature, index) => (
							<Col key={index} lg={4} className="mb-4">
								<div className="text-center p-4">
									<div className="mb-3" style={{
										fontSize: '2.5rem',
										color: '#FFD700'
									}}>
										{feature.icon}
									</div>
									<h5 className="fw-bold mb-3">{feature.title}</h5>
									<p className="text-muted">{feature.description}</p>
								</div>
							</Col>
						))}
					</Row>
				</Container>
			</section>

			{/* Middle Content Section */}
			<section className="py-5">
				<Container>
					<Row className="align-items-center">
						<Col lg={6} className="mb-4">
							<div style={{
								background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
								borderRadius: '16px',
								height: '400px',
								position: 'relative',
								overflow: 'hidden'
							}}>
								<div style={{
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									background: 'url("https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop")',
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									opacity: 0.3
								}}></div>
							</div>
						</Col>
						<Col lg={6} className="mb-4">
							<div className="ps-lg-4">
								{[
									{
										title: "24/7 Customer Support",
										description: "Our dedicated team is available round the clock to assist you with any queries or emergencies during your rental period."
									},
									{
										title: "Flexible Pickup & Drop-off",
										description: "Choose from multiple locations including airports, hotels, and city centers. Same-day rentals available with instant confirmation."
									},
									{
										title: "Comprehensive Insurance Coverage",
										description: "All rentals include full insurance coverage, giving you peace of mind throughout your journey across Kenya."
									},
									{
										title: "GPS Navigation Included",
										description: "Every vehicle comes equipped with GPS navigation to help you explore Kenya's beautiful destinations with confidence."
									}
								].map((item, index) => (
									<div key={index} className="mb-4">
										<h6 className="fw-bold mb-2">
											{index + 1}. {item.title}
										</h6>
										<p className="text-muted">
											{item.description}
										</p>
									</div>
								))}
							</div>
						</Col>
					</Row>
				</Container>
			</section>

			{/* Car Selection Section */}
			<section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
				<Container>
					<div className="d-flex justify-content-between align-items-center mb-5">
						<h2 className="fw-bold">Our Premium Fleet</h2>
						<Button variant="link" className="text-decoration-none fw-bold">
							View All →
						</Button>
					</div>

					<Row>
						{carList.map((car) => (
							<Col key={car.id} lg={4} md={6} className="mb-4">
								<Card className="h-100 border-0 shadow-sm" style={{
									borderRadius: '12px',
									transition: 'transform 0.3s ease, box-shadow 0.3s ease'
								}}>
									<Card.Body className="p-4">
										<div className="text-center mb-3">
											<img
												src={car.image}
												alt={`${car.name} ${car.type}`}
												style={{
													width: '100%',
													height: '120px',
													objectFit: 'cover',
													borderRadius: '8px',
													boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
												}}
											/>
										</div>
										<h5 className="fw-bold text-center mb-2">{car.name}</h5>
										<p className="text-muted text-center mb-2">{car.type}</p>
										<p className="fw-bold text-center mb-3" style={{ color: '#000' }}>{car.price}</p>

										<div className="d-flex justify-content-center gap-2 mb-3">
											{car.features.map((feature, index) => (
												<span key={index} className="badge bg-light text-dark px-2 py-1" style={{
													fontSize: '0.75rem',
													borderRadius: '4px'
												}}>
													{feature}
												</span>
											))}
										</div>

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
				</Container>
			</section>

			{/* Facts In Numbers Section */}
			<section className="py-5" style={{
				background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
				position: 'relative',
				overflow: 'hidden'
			}}>
				<div style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
					zIndex: 1
				}}></div>

				<Container style={{ position: 'relative', zIndex: 2 }}>
					<div className="text-center mb-5">
						<h2 className="fw-bold text-white mb-3">Our Success Story</h2>
						<p className="text-white-50">Trusted by thousands of customers across Kenya</p>
					</div>

					<Row>
						{stats.map((stat, index) => (
							<Col key={index} lg={3} md={6} className="mb-4">
								<div className="text-center">
									<div className="bg-white rounded p-4 mb-3" style={{
										width: '120px',
										height: '120px',
										margin: '0 auto',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center'
									}}>
										<div className="mb-2" style={{ fontSize: '2rem', color: '#FFD700' }}>
											{stat.icon}
										</div>
										<h4 className="fw-bold mb-0" style={{ color: '#FFD700' }}>{stat.number}</h4>
									</div>
									<p className="text-white fw-medium">{stat.label}</p>
								</div>
							</Col>
						))}
					</Row>
				</Container>
			</section>

			{/* Download Mobile App Section */}
			<section className="py-5">
				<Container>
					<Row className="align-items-center">
						<Col lg={6} className="mb-4">
							<h2 className="fw-bold mb-4">Download Our Mobile App</h2>
							<p className="text-muted mb-4">
								Book your car rental on the go with our user-friendly mobile app. Get instant quotes, manage your bookings, and access exclusive mobile-only discounts. Available for both iOS and Android devices.
							</p>
							<div className="d-flex gap-3">
								<Button
									variant="dark"
									className="px-4 py-2"
									style={{
										borderRadius: '8px',
										backgroundColor: '#FFD700',
										border: 'none',
										color: '#000',
										fontWeight: '600'
									}}
								>
									<FaApple className="me-2" />
									Download on the App Store
								</Button>
								<Button
									variant="dark"
									className="px-4 py-2"
									style={{
										borderRadius: '8px',
										backgroundColor: '#FFD700',
										border: 'none',
										color: '#000',
										fontWeight: '600'
									}}
								>
									<FaGooglePlay className="me-2" />
									Get it on Google Play
								</Button>
							</div>
						</Col>
						<Col lg={6} className="text-center">
							<div className="position-relative">
								{/* iPhone Mockup */}
								<div style={{
									width: '180px',
									height: '360px',
									backgroundColor: '#000',
									borderRadius: '30px',
									border: '8px solid #333',
									display: 'inline-block',
									marginRight: '-30px',
									position: 'relative',
									zIndex: 2,
									boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
								}}>
									{/* iPhone Screen */}
									<div style={{
										width: '100%',
										height: '100%',
										backgroundColor: '#f8f9fa',
										borderRadius: '22px',
										position: 'relative',
										overflow: 'hidden'
									}}>
										{/* iPhone Notch */}
										<div style={{
											width: '120px',
											height: '25px',
											backgroundColor: '#000',
											borderRadius: '0 0 15px 15px',
											position: 'absolute',
											top: '0',
											left: '50%',
											transform: 'translateX(-50%)',
											zIndex: 3
										}}></div>
										{/* App Content */}
										<div style={{
											position: 'absolute',
											top: '40px',
											left: '10px',
											right: '10px',
											bottom: '10px',
											backgroundColor: '#FFD700',
											borderRadius: '15px',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center',
											color: '#000',
											fontSize: '12px',
											fontWeight: 'bold'
										}}>
											<div style={{ fontSize: '16px', marginBottom: '5px' }}>🚗</div>
											<div>Car Rental</div>
										</div>
									</div>
								</div>

								{/* Android Phone Mockup */}
								<div style={{
									width: '180px',
									height: '360px',
									backgroundColor: '#2c3e50',
									borderRadius: '25px',
									border: '6px solid #34495e',
									display: 'inline-block',
									position: 'relative',
									zIndex: 1,
									boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
								}}>
									{/* Android Screen */}
									<div style={{
										width: '100%',
										height: '100%',
										backgroundColor: '#ecf0f1',
										borderRadius: '19px',
										position: 'relative',
										overflow: 'hidden'
									}}>
										{/* Android Status Bar */}
										<div style={{
											width: '100%',
											height: '25px',
											backgroundColor: '#2c3e50',
											position: 'absolute',
											top: '0',
											left: '0',
											zIndex: 3,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											padding: '0 10px',
											fontSize: '10px',
											color: 'white'
										}}>
											<span>9:41</span>
											<span>📶 📶 📶</span>
										</div>
										{/* App Content */}
										<div style={{
											position: 'absolute',
											top: '35px',
											left: '10px',
											right: '10px',
											bottom: '10px',
											backgroundColor: '#FFD700',
											borderRadius: '15px',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center',
											color: '#000',
											fontSize: '12px',
											fontWeight: 'bold'
										}}>
											<div style={{ fontSize: '16px', marginBottom: '5px' }}>🚗</div>
											<div>Car Rental</div>
										</div>
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		</>
	);
};

export default HomePage;