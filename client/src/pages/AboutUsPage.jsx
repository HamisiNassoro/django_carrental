import React, { useState } from "react";
import { Container, Row, Col, Button, Card, Accordion } from "react-bootstrap";
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
	FaCheck,
	FaPlay,
	FaQuoteLeft,
	FaChevronUp,
	FaChevronDown,
	FaFacebook,
	FaInstagram,
	FaTwitter,
	FaYoutube
} from "react-icons/fa";

const AboutUsPage = () => {
	const [activeAccordion, setActiveAccordion] = useState(0);

	const features = [
		{
			title: "Premium Fleet",
			description: "Our diverse fleet includes luxury sedans, spacious SUVs, and reliable economy cars, all meticulously maintained and regularly serviced."
		},
		{
			title: "24/7 Support",
			description: "Round-the-clock customer support ensures you're never alone on your journey. Emergency assistance available anytime, anywhere."
		},
		{
			title: "Flexible Booking",
			description: "Book online, via phone, or through our mobile app. Same-day rentals available with instant confirmation and flexible cancellation."
		},
		{
			title: "Nationwide Coverage",
			description: "Pick up and drop off at any of our locations across Kenya, including major airports, hotels, and city centers."
		}
	];

	const stats = [
		{ number: "15k+", label: "Happy customers" },
		{ number: "200+", label: "Vehicles in fleet" },
		{ number: "12+", label: "Years of experience" }
	];

	const benefits = [
		"Comprehensive insurance coverage included with every rental",
		"GPS navigation systems available in all vehicles",
		"24/7 roadside assistance and emergency support",
		"Flexible pickup and drop-off locations across Kenya"
	];

	const testimonials = [
		{
			quote: "Excellent service! The car was in perfect condition and the pickup process was smooth. Highly recommend for business trips in Nairobi.",
			company: "Tech Solutions Ltd",
			name: "David Kamau"
		},
		{
			quote: "Great experience renting an SUV for our family vacation. The staff was helpful and the vehicle was spotless. Will definitely use again.",
			company: "Tourism Kenya",
			name: "Sarah Mwangi"
		},
		{
			quote: "Professional service with competitive rates. The car was well-maintained and the booking process was straightforward. Five stars!",
			company: "Global Logistics",
			name: "James Ochieng"
		}
	];

	const faqs = [
		{
			question: "What documents do I need to rent a car?",
			answer: "You'll need a valid driver's license, national ID or passport, and a credit card for the security deposit. International visitors need an International Driving Permit along with their home country license."
		},
		{
			question: "What is the minimum age to rent a car?",
			answer: "The minimum age to rent a car is 21 years old. Drivers under 25 may be subject to additional fees. A valid driver's license held for at least 2 years is required."
		},
		{
			question: "What happens if I have an accident?",
			answer: "All our vehicles come with comprehensive insurance coverage. In case of an accident, contact our 24/7 emergency line immediately. We'll guide you through the process and arrange for a replacement vehicle if needed."
		},
		{
			question: "Can I extend my rental period?",
			answer: "Yes, you can extend your rental period subject to vehicle availability. Contact us at least 24 hours before your scheduled return time. Additional charges will apply for the extended period."
		},
		{
			question: "Do you offer airport pickup and drop-off?",
			answer: "Yes, we offer convenient airport pickup and drop-off services at Jomo Kenyatta International Airport and other major airports across Kenya. Advance booking is recommended for airport services."
		}
	];

	return (
		<>
			{/* Hero Section */}
			<section className="py-5" style={{ marginTop: '80px' }}>
				<Container>
					<Row className="text-center">
						<Col>
							<h1 className="fw-bold mb-2">About Us</h1>
							<p className="text-muted">Home / About Us</p>
						</Col>
					</Row>
				</Container>
			</section>

			{/* Main Content - "Where every drive feels extraordinary" */}
			<section className="py-5">
				<Container>
					<Row className="align-items-center">
						<Col lg={6} className="mb-4">
							<h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem' }}>
								Where every drive feels extraordinary
							</h2>
						</Col>
						<Col lg={6} className="mb-4">
							<Row>
								{features.map((feature, index) => (
									<Col key={index} xs={6} className="mb-4">
										<div className="p-3">
											<h6 className="fw-bold mb-2">{feature.title}</h6>
											<p className="text-muted small">{feature.description}</p>
										</div>
									</Col>
								))}
							</Row>
						</Col>
					</Row>
				</Container>
			</section>

			{/* Video Section */}
			<section className="py-5">
				<Container>
					<div style={{
						background: 'url("https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop")',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						height: '400px',
						borderRadius: '16px',
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<div style={{
							width: '80px',
							height: '80px',
							backgroundColor: '#FFD700',
							borderRadius: '50%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							boxShadow: '0 4px 20px rgba(255, 215, 0, 0.3)'
						}}>
							<FaPlay style={{ color: 'white', fontSize: '1.5rem' }} />
						</div>
					</div>
				</Container>
			</section>

			{/* Statistics Section */}
			<section className="py-5">
				<Container>
					<Row>
						{stats.map((stat, index) => (
							<Col key={index} lg={4} className="text-center mb-4">
								<h2 className="fw-bold mb-2" style={{ color: '#FFD700', fontSize: '3rem' }}>
									{stat.number}
								</h2>
								<p className="text-muted">{stat.label}</p>
							</Col>
						))}
					</Row>
				</Container>
			</section>

			{/* "Unlock unforgettable memories" Section */}
			<section className="py-5">
				<Container>
					<Row className="align-items-center">
						<Col lg={6} className="mb-4">
							<h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem' }}>
								Unlock unforgettable memories on the road
							</h2>
							<div>
								{benefits.map((benefit, index) => (
									<div key={index} className="d-flex align-items-center mb-3">
										<FaCheck className="me-3" style={{ color: '#FFD700' }} />
										<span className="text-muted">{benefit}</span>
									</div>
								))}
							</div>
						</Col>
						<Col lg={6} className="mb-4">
							<div style={{
								background: 'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop")',
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								height: '400px',
								borderRadius: '16px'
							}}></div>
						</Col>
					</Row>
				</Container>
			</section>

			{/* Download App Section */}
			<section className="py-5">
				<Container>
					<div style={{
						background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
						borderRadius: '16px',
						padding: '60px 40px',
						position: 'relative',
						overflow: 'hidden'
					}}>
						<Row className="align-items-center">
							<Col lg={6} className="text-center mb-4">
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
										<div style={{
											width: '100%',
											height: '100%',
											backgroundColor: '#f8f9fa',
											borderRadius: '22px',
											position: 'relative',
											overflow: 'hidden'
										}}>
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
										<div style={{
											width: '100%',
											height: '100%',
											backgroundColor: '#ecf0f1',
											borderRadius: '19px',
											position: 'relative',
											overflow: 'hidden'
										}}>
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
							<Col lg={6} className="text-white">
								<small className="text-white-50">DOWNLOAD OUR APP</small>
								<h2 className="fw-bold mb-4">Download our app</h2>
								<p className="mb-4">
									Get instant quotes, manage your bookings, and access exclusive mobile-only discounts. Our user-friendly app makes car rental simple and convenient, available for both iOS and Android devices.
								</p>
								<div className="d-flex gap-3">
									<Button variant="light" className="px-4 py-2" style={{ borderRadius: '8px' }}>
										<FaApple className="me-2" />
										Download on the App Store
									</Button>
									<Button variant="light" className="px-4 py-2" style={{ borderRadius: '8px' }}>
										<FaGooglePlay className="me-2" />
										GET IT ON Google Play
									</Button>
								</div>
							</Col>
						</Row>
					</div>
				</Container>
			</section>

			{/* Reviews Section */}
			<section className="py-5">
				<Container>
					<div className="text-center mb-5">
						<h2 className="fw-bold">Reviews from our customers</h2>
					</div>
					<Row>
						{testimonials.map((testimonial, index) => (
							<Col key={index} lg={4} className="mb-4">
								<Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
									<Card.Body className="p-4">
										<FaQuoteLeft className="mb-3" style={{ color: '#FFD700', fontSize: '2rem' }} />
										<p className="text-muted mb-4">{testimonial.quote}</p>
										<div className="text-center">
											<div style={{
												width: '60px',
												height: '60px',
												borderRadius: '50%',
												backgroundColor: '#f8f9fa',
												margin: '0 auto 10px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												fontSize: '1.5rem'
											}}>
												👤
											</div>
											<small className="text-muted d-block">{testimonial.company}</small>
											<strong>{testimonial.name}</strong>
										</div>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
				</Container>
			</section>

			{/* FAQ Section */}
			<section className="py-5">
				<Container>
					<div className="text-center mb-5">
						<h2 className="fw-bold">Top Car Rental Questions</h2>
					</div>
					<Row className="justify-content-center">
						<Col lg={8}>
							<Accordion>
								{faqs.map((faq, index) => (
									<Accordion.Item key={index} eventKey={index.toString()}>
										<Accordion.Header className="fw-bold">
											{faq.question}
										</Accordion.Header>
										<Accordion.Body className="text-muted">
											{faq.answer}
										</Accordion.Body>
									</Accordion.Item>
								))}
							</Accordion>
						</Col>
					</Row>
				</Container>
			</section>

			{/* Call to Action Section */}
			<section className="py-5">
				<Container>
					<div style={{
						background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
						borderRadius: '16px',
						padding: '60px 40px',
						position: 'relative',
						overflow: 'hidden'
					}}>
						<div style={{
							position: 'absolute',
							top: 0,
							right: 0,
							bottom: 0,
							width: '300px',
							background: 'url("https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=600&fit=crop")',
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							opacity: 0.3,
							borderRadius: '0 16px 16px 0'
						}}></div>
						<Row className="align-items-center">
							<Col lg={6} className="text-white">
								<h2 className="fw-bold mb-4">Ready to book your car?</h2>
								<h3 className="fw-bold mb-3">+254 790 013248</h3>
								<p className="mb-4">
									Call us now for instant quotes, special offers, and personalized assistance. Our friendly team is ready to help you find the perfect vehicle for your journey.
								</p>
								<Button
									variant="warning"
									size="lg"
									className="px-4 py-3"
									style={{ borderRadius: '8px', fontWeight: '600' }}
								>
									Book now
								</Button>
							</Col>
						</Row>
					</div>
				</Container>
			</section>
		</>
	);
};

export default AboutUsPage;