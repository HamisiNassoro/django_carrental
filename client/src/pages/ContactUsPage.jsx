import React, { useState } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
	FaPhone,
	FaEnvelope,
	FaMapMarkerAlt,
	FaCar,
	FaUser,
	FaCalendar,
	FaRoad,
	FaApple,
	FaGooglePlay,
	FaClock,
	FaFacebook,
	FaInstagram,
	FaTwitter,
	FaYoutube
} from "react-icons/fa";

const ContactUsPage = () => {
	const [bookingForm, setBookingForm] = useState({
		carType: "",
		rentalPlace: "",
		returnPlace: "",
		rentalDate: "",
		returnDate: ""
	});

	const contactInfo = [
		{
			icon: <FaMapMarkerAlt />,
			title: "Address",
			value: "Nairobi, Kenya"
		},
		{
			icon: <FaEnvelope />,
			title: "Email",
			value: "Carrental@gmail.com"
		},
		{
			icon: <FaPhone />,
			title: "Phone",
			value: "+254 790 013248"
		},
		{
			icon: <FaClock />,
			title: "Opening hours",
			value: "Sun-Mon: 10am - 10pm"
		}
	];

	const blogPosts = [
		{
			image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop",
			title: "Top 10 Road Trip Destinations in Kenya",
			date: "Travel Guide / 15 April 2024"
		},
		{
			image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop",
			title: "Essential Car Rental Tips for First-Time Renters",
			date: "Tips & Advice / 12 April 2024"
		},
		{
			image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop",
			title: "Business Travel: Choosing the Right Vehicle",
			date: "Business Guide / 10 April 2024"
		}
	];

	const carBrands = [
		"Toyota", "Ford", "Mercedes-Benz", "Jeep", "BMW", "Audi"
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
			<section className="py-5" style={{ marginTop: '80px' }}>
				<Container>
					<Row className="text-center">
						<Col>
							<h1 className="fw-bold mb-2">Contact Us</h1>
							<p className="text-muted">Home / Contact Us</p>
						</Col>
					</Row>
				</Container>
			</section>

			{/* Main Content - Booking Form and Image */}
			<section className="py-5">
				<Container>
					<Row>
						<Col lg={6} className="mb-4">
							<Card style={{
								backgroundColor: '#000',
								borderRadius: '16px',
								border: 'none',
								boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)'
							}}>
								<Card.Body className="p-4">
									<h4 className="fw-bold mb-4 text-white">Book your car</h4>
									<Form>
										<Row>
											<Col md={6} className="mb-3">
												<Form.Select
													value={bookingForm.carType}
													onChange={(e) => handleBookingChange('carType', e.target.value)}
													style={{ borderRadius: '8px', border: 'none' }}
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
													style={{ borderRadius: '8px', border: 'none' }}
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
													style={{ borderRadius: '8px', border: 'none' }}
												/>
											</Col>
											<Col md={6} className="mb-3">
												<Form.Control
													type="date"
													placeholder="Rental date"
													value={bookingForm.rentalDate}
													onChange={(e) => handleBookingChange('rentalDate', e.target.value)}
													style={{ borderRadius: '8px', border: 'none' }}
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
													style={{ borderRadius: '8px', border: 'none' }}
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
						</Col>
						<Col lg={6} className="mb-4">
							<div style={{
								background: 'url("https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop")',
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								height: '100%',
								minHeight: '300px',
								borderRadius: '16px',
								filter: 'blur(2px)'
							}}></div>
						</Col>
					</Row>
				</Container>
			</section>

			{/* Contact Information Cards */}
			<section className="py-5">
				<Container>
					<Row>
						{contactInfo.map((info, index) => (
							<Col key={index} lg={3} md={6} className="mb-4">
								<Card className="h-100 border-0 shadow-sm text-center" style={{ borderRadius: '12px' }}>
									<Card.Body className="p-4">
										<div style={{
											width: '60px',
											height: '60px',
											backgroundColor: '#ffc107',
											borderRadius: '50%',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											margin: '0 auto 15px',
											color: 'white',
											fontSize: '1.5rem'
										}}>
											{info.icon}
										</div>
										<h6 className="fw-bold mb-2">{info.title}</h6>
										<p className="text-muted mb-0">{info.value}</p>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
				</Container>
			</section>

			{/* Latest Blog Posts & News Section */}
			<section className="py-5">
				<Container>
					<div className="text-center mb-5">
						<h2 className="fw-bold">Latest blog posts & news</h2>
					</div>
					<Row>
						{blogPosts.map((post, index) => (
							<Col key={index} lg={4} className="mb-4">
								<Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
									<div style={{
										background: `url("${post.image}")`,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										height: '200px',
										filter: 'blur(1px)'
									}}></div>
									<Card.Body className="p-4">
										<h6 className="fw-bold mb-2">{post.title}</h6>
										<small className="text-muted">{post.date}</small>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
				</Container>
			</section>

			{/* Car Brand Logos Section */}
			<section className="py-5">
				<Container>
					<Row className="justify-content-center">
						<Col lg={8}>
							<div className="d-flex justify-content-center align-items-center gap-5 flex-wrap">
								{carBrands.map((brand, index) => (
									<div key={index} style={{
										width: '100px',
										height: '50px',
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
			</section>
		</>
	);
};

export default ContactUsPage;