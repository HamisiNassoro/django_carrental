import React from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { GiCarWheel } from "react-icons/gi";
import { FaPhone, FaCar } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {
	return (
		<header>
			<Navbar
				fixed="top"
				bg="white"
				variant="light"
				expand="lg"
				collapseOnSelect
				style={{
					boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
					backdropFilter: 'blur(10px)',
					backgroundColor: 'rgba(255,255,255,0.95)'
				}}
			>
				<Container>
					<LinkContainer to="/">
						<Navbar.Brand className="fw-bold" style={{ fontSize: '1.5rem' }}>
							<GiCarWheel className="nav-icon me-2" style={{ color: '#FFD700' }} />
							<span style={{ color: '#333' }}>Car Rental</span>
						</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse
						id="basic-navbar-nav"
						className="justify-content-end"
					>
						<Nav className="me-auto">
							<LinkContainer to="/">
								<Nav.Link className="fw-medium px-3">Home</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/cars">
								<Nav.Link className="fw-medium px-3">Vehicles</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/my-cars">
								<Nav.Link className="fw-medium px-3">
									<FaCar className="me-1" />
									My Cars
								</Nav.Link>
							</LinkContainer>
							<Nav.Link href="#details" className="fw-medium px-3">Details</Nav.Link>
							<LinkContainer to="/about">
								<Nav.Link className="fw-medium px-3">About Us</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/contact">
								<Nav.Link className="fw-medium px-3">Contact Us</Nav.Link>
							</LinkContainer>
						</Nav>
						<div className="d-flex align-items-center">
							<div className="me-3 text-muted">
								<FaPhone className="me-1" />
								Need help? +996 247-1680
							</div>
							<LinkContainer to="/login">
								<Button variant="outline-primary" size="sm">
									Login
								</Button>
							</LinkContainer>
						</div>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;