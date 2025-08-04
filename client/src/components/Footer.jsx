import React from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import { GiCarWheel } from "react-icons/gi";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaApple, FaGooglePlay } from "react-icons/fa";

const Footer = () => {
	return (
		<footer style={{
			backgroundColor: '#0a0a0a',
			paddingTop: '3rem',
			paddingBottom: '2rem',
			borderTop: '1px solid rgba(255,215,0,0.2)'
		}}>
			<Container>
				{/* Top Row - Contact Info */}
				<Row className="mb-4">
					<Col lg={3} md={6} className="mb-3">
						<div className="d-flex align-items-center">
							<GiCarWheel className="me-2" style={{ fontSize: '1.5rem', color: '#FFD700' }} />
							<span className="fw-bold" style={{ color: '#fff', fontFamily: 'Helvetica, Arial, sans-serif' }}>Car Rental</span>
						</div>
					</Col>
					<Col lg={3} md={6} className="mb-3">
						<div className="d-flex align-items-center">
							<FaMapMarkerAlt className="me-2" style={{ color: '#FFD700' }} />
							<span style={{ color: '#fff' }}>Nairobi, Kenya</span>
						</div>
					</Col>
					<Col lg={3} md={6} className="mb-3">
						<div className="d-flex align-items-center">
							<FaEnvelope className="me-2" style={{ color: '#FFD700' }} />
							<span style={{ color: '#fff' }}>Carrental@gmail.com</span>
						</div>
					</Col>
					<Col lg={3} md={6} className="mb-3">
						<div className="d-flex align-items-center">
							<FaPhone className="me-2" style={{ color: '#FFD700' }} />
							<span style={{ color: '#fff' }}>+254 790 013248</span>
						</div>
					</Col>
				</Row>

				{/* Middle Row - Links and Info */}
				<Row className="mb-4">
					<Col lg={4} md={6} className="mb-3">
						<p style={{ color: '#ccc', fontFamily: 'Helvetica, Arial, sans-serif' }}>
							Experience luxury redefined with our premium car rental service. Where excellence meets the open road.
						</p>
					</Col>
					<Col lg={2} md={6} className="mb-3">
						<h6 className="fw-bold mb-3" style={{ color: '#FFD700', fontFamily: 'Helvetica, Arial, sans-serif' }}>Useful links</h6>
						<ul className="list-unstyled">
							<li className="mb-2"><a href="#about" className="text-decoration-none" style={{ color: '#ccc' }}>About us</a></li>
							<li className="mb-2"><a href="#contact" className="text-decoration-none" style={{ color: '#ccc' }}>Contact us</a></li>
							<li className="mb-2"><a href="#gallery" className="text-decoration-none" style={{ color: '#ccc' }}>Gallery</a></li>
							<li className="mb-2"><a href="#blog" className="text-decoration-none" style={{ color: '#ccc' }}>Blog</a></li>
							<li className="mb-2"><a href="#faq" className="text-decoration-none" style={{ color: '#ccc' }}>FAQ</a></li>
						</ul>
					</Col>
					<Col lg={2} md={6} className="mb-3">
						<h6 className="fw-bold mb-3" style={{ color: '#FFD700', fontFamily: 'Helvetica, Arial, sans-serif' }}>Vehicles</h6>
						<ul className="list-unstyled">
							<li className="mb-2"><a href="#sedan" className="text-decoration-none" style={{ color: '#ccc' }}>Sedan</a></li>
							<li className="mb-2"><a href="#cabriolet" className="text-decoration-none" style={{ color: '#ccc' }}>Cabriolet</a></li>
							<li className="mb-2"><a href="#pickup" className="text-decoration-none" style={{ color: '#ccc' }}>Pickup</a></li>
							<li className="mb-2"><a href="#minivan" className="text-decoration-none" style={{ color: '#ccc' }}>Minivan</a></li>
							<li className="mb-2"><a href="#suv" className="text-decoration-none" style={{ color: '#ccc' }}>SUV</a></li>
						</ul>
					</Col>
					<Col lg={4} md={6} className="mb-3">
						<h6 className="fw-bold mb-3" style={{ color: '#FFD700', fontFamily: 'Helvetica, Arial, sans-serif' }}>Download App</h6>
						<div className="d-flex gap-2">
							<Button
								variant="dark"
								size="sm"
								className="px-3 py-2"
								style={{
									backgroundColor: '#FFD700',
									border: 'none',
									color: '#000',
									fontWeight: '600'
								}}
							>
								<FaApple className="me-2" />
								App Store
							</Button>
							<Button
								variant="dark"
								size="sm"
								className="px-3 py-2"
								style={{
									backgroundColor: '#FFD700',
									border: 'none',
									color: '#000',
									fontWeight: '600'
								}}
							>
								<FaGooglePlay className="me-2" />
								Google Play
							</Button>
						</div>
					</Col>
				</Row>

				{/* Bottom Row - Copyright */}
				<Row>
					<Col className="text-center pt-3 border-top">
						<p style={{ color: '#ccc', fontFamily: 'Helvetica, Arial, sans-serif' }}>
							© Copyright Car Rental 2025.
						</p>
					</Col>
				</Row>
			</Container>
		</footer>
	);
};

export default Footer;