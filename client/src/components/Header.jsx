import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { GiCarWheel } from "react-icons/gi";
import {
	FaPhone,
	FaCar,
	FaUser,
	FaSignOutAlt,
	FaBars,
	FaMapMarkerAlt,
} from "react-icons/fa";
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
		const handleScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const onLogout = () => {
		dispatch(logout());
		navigate("/");
	};

	const isActive = (path) => location.pathname === path;
	const displayName = user?.first_name || user?.username || "Account";

	return (
		<header>
			<Navbar
				fixed="top"
				expand="lg"
				collapseOnSelect
				className={`modern-navbar ${scrolled ? "scrolled" : ""}`}
			>
				<Container fluid className="header-container px-3 px-lg-4">
					<LinkContainer to="/">
						<Navbar.Brand className="brand-container">
							<div className="brand-logo">
								<GiCarWheel className="brand-icon" />
							</div>
							<span className="brand-text">Car Rental</span>
						</Navbar.Brand>
					</LinkContainer>

					{user && (
						<div className="header-auth-bar d-none d-lg-flex">
							<span className="header-user-label">
								<FaUser className="me-1" />
								{displayName}
							</span>
							<Button
								variant="danger"
								size="sm"
								className="header-logout-btn"
								onClick={onLogout}
							>
								<FaSignOutAlt className="me-1" />
								Logout
							</Button>
						</div>
					)}

					{!user && (
						<div className="header-auth-bar d-none d-lg-flex">
							<LinkContainer to="/login">
								<Button className="login-btn" size="sm">
									Login
								</Button>
							</LinkContainer>
							<LinkContainer to="/register">
								<Button className="register-btn" size="sm">
									Register
								</Button>
							</LinkContainer>
						</div>
					)}

					<Navbar.Toggle
						aria-controls="basic-navbar-nav"
						className="custom-toggler ms-2"
					>
						<FaBars />
					</Navbar.Toggle>

					<Navbar.Collapse id="basic-navbar-nav" className="header-collapse">
						<Nav className="main-nav">
							<LinkContainer to="/">
								<Nav.Link className={`nav-item ${isActive("/") ? "active" : ""}`}>
									Home
								</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/cars">
								<Nav.Link className={`nav-item ${isActive("/cars") ? "active" : ""}`}>
									Vehicles
								</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/nearby">
								<Nav.Link className={`nav-item ${isActive("/nearby") ? "active" : ""}`}>
									<FaMapMarkerAlt className="nav-icon" />
									Nearby
								</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/my-cars">
								<Nav.Link className={`nav-item ${isActive("/my-cars") ? "active" : ""}`}>
									<FaCar className="nav-icon" />
									My Cars
								</Nav.Link>
							</LinkContainer>
							{user && (
								<>
									<LinkContainer to="/my-bookings">
										<Nav.Link
											className={`nav-item ${isActive("/my-bookings") ? "active" : ""}`}
										>
											My Bookings
										</Nav.Link>
									</LinkContainer>
									<LinkContainer to="/owner-bookings">
										<Nav.Link
											className={`nav-item ${isActive("/owner-bookings") ? "active" : ""}`}
										>
											Rental Requests
										</Nav.Link>
									</LinkContainer>
									<LinkContainer to="/profile">
										<Nav.Link className={`nav-item ${isActive("/profile") ? "active" : ""}`}>
											Profile
										</Nav.Link>
									</LinkContainer>
								</>
							)}
							<LinkContainer to="/about">
								<Nav.Link className={`nav-item ${isActive("/about") ? "active" : ""}`}>
									About Us
								</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/contact">
								<Nav.Link className={`nav-item ${isActive("/contact") ? "active" : ""}`}>
									Contact Us
								</Nav.Link>
							</LinkContainer>
						</Nav>

						{user && (
							<div className="header-mobile-auth d-lg-none">
								<p className="header-mobile-user mb-2">
									Signed in as <strong>{displayName}</strong>
								</p>
								<Button
									variant="danger"
									className="w-100 header-logout-btn"
									onClick={onLogout}
								>
									<FaSignOutAlt className="me-2" />
									Logout
								</Button>
							</div>
						)}

						{!user && (
							<div className="header-mobile-auth d-lg-none">
								<LinkContainer to="/login" className="d-grid mb-2">
									<Button className="login-btn">Login</Button>
								</LinkContainer>
								<LinkContainer to="/register" className="d-grid">
									<Button className="register-btn">Register</Button>
								</LinkContainer>
							</div>
						)}
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;
