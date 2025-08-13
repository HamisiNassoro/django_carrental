import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { GiCarWheel } from "react-icons/gi";
import { FaPhone, FaCar, FaUser, FaSignOutAlt, FaBars } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import "./Header.css";

const Header = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useSelector((state) => state.auth);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 10;
			setScrolled(isScrolled);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const onLogout = () => {
		dispatch(logout());
		navigate("/");
	};

	const isActive = (path) => {
		return location.pathname === path;
	};

	return (
		<header>
			<Navbar
				fixed="top"
				expand="lg"
				collapseOnSelect
				className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}
				style={{
					background: scrolled
						? 'rgba(255, 255, 255, 0.95)'
						: 'rgba(255, 255, 255, 0.98)',
					backdropFilter: 'blur(20px)',
					transition: 'all 0.3s ease',
					boxShadow: scrolled
						? '0 8px 32px rgba(0, 0, 0, 0.1)'
						: '0 2px 20px rgba(0, 0, 0, 0.05)',
					borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
				}}
			>
				<Container fluid className="px-4">
					<LinkContainer to="/">
						<Navbar.Brand className="brand-container">
							<div className="brand-logo">
								<GiCarWheel className="brand-icon" />
							</div>
							<span className="brand-text">Car Rental</span>
						</Navbar.Brand>
					</LinkContainer>

					<Navbar.Toggle
						aria-controls="basic-navbar-nav"
						className="custom-toggler"
					>
						<FaBars />
					</Navbar.Toggle>

					<Navbar.Collapse
						id="basic-navbar-nav"
						className="justify-content-between"
					>
						<Nav className="main-nav">
							<LinkContainer to="/">
								<Nav.Link className={`nav-item ${isActive('/') ? 'active' : ''}`}>
									<span className="nav-text">Home</span>
								</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/cars">
								<Nav.Link className={`nav-item ${isActive('/cars') ? 'active' : ''}`}>
									<span className="nav-text">Vehicles</span>
								</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/my-cars">
								<Nav.Link className={`nav-item ${isActive('/my-cars') ? 'active' : ''}`}>
									<FaCar className="nav-icon" />
									<span className="nav-text">My Cars</span>
								</Nav.Link>
							</LinkContainer>
							<Nav.Link href="#details" className="nav-item">
								<span className="nav-text">Details</span>
							</Nav.Link>
							<LinkContainer to="/about">
								<Nav.Link className={`nav-item ${isActive('/about') ? 'active' : ''}`}>
									<span className="nav-text">About Us</span>
								</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/contact">
								<Nav.Link className={`nav-item ${isActive('/contact') ? 'active' : ''}`}>
									<span className="nav-text">Contact Us</span>
								</Nav.Link>
							</LinkContainer>
						</Nav>

						<div className="header-right">
							<div className="contact-info">
								<div className="contact-icon">
									<FaPhone />
								</div>
								<div className="contact-text">
									<span className="help-text">Need help?</span>
									<span className="phone-number">+996 247-1680</span>
								</div>
							</div>

							<div className="auth-buttons">
								{user ? (
									<>
										<div className="user-welcome">
											<FaUser className="user-icon" />
											<span className="welcome-text">
												Welcome, {user.first_name || user.username}
											</span>
										</div>
										<Button
											className="logout-btn"
											onClick={onLogout}
										>
											<FaSignOutAlt className="btn-icon" />
											Logout
										</Button>
									</>
								) : (
									<>
										<LinkContainer to="/login">
											<Button className="login-btn">
												Login
											</Button>
										</LinkContainer>
										<LinkContainer to="/register">
											<Button className="register-btn">
												Register
											</Button>
										</LinkContainer>
									</>
								)}
								<LinkContainer to="/auth-test">
									<Button className="auth-test-btn">
										Auth Test
									</Button>
								</LinkContainer>
							</div>
						</div>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;