import React, { useEffect, useState } from "react";
import {
	Button,
	Container,
	Nav,
	Navbar,
	NavDropdown,
} from "react-bootstrap";
import { GiCarWheel } from "react-icons/gi";
import {
	FaBars,
	FaCar,
	FaSignOutAlt,
	FaMapMarkerAlt,
	FaUserCircle,
	FaChevronDown,
	FaArrowRight,
} from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import "./Header.css";

const ACCOUNT_PATHS = ["/my-bookings", "/owner-bookings", "/profile"];
const MORE_PATHS = ["/about", "/contact"];

const Header = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useSelector((state) => state.auth);
	const [scrolled, setScrolled] = useState(false);
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		setExpanded(false);
	}, [location.pathname]);

	const onLogout = () => {
		dispatch(logout());
		navigate("/");
		setExpanded(false);
	};

	const isActive = (path) => location.pathname === path;
	const isActivePrefix = (paths) => paths.some((path) => isActive(path));
	const displayName = user?.first_name || user?.username || "Account";

	const primaryLinks = [
		{ to: "/", label: "Home" },
		{ to: "/cars", label: "Vehicles" },
		{ to: "/nearby", label: "Nearby", icon: <FaMapMarkerAlt className="nav-icon" /> },
	];

	const accountLinks = user
		? [
				{ to: "/my-bookings", label: "My Bookings" },
				{ to: "/owner-bookings", label: "Rental Requests" },
				{ to: "/profile", label: "Profile" },
		  ]
		: [];

	const moreLinks = [
		{ to: "/about", label: "About Us" },
		{ to: "/contact", label: "Contact Us" },
	];

	const renderNavLink = ({ to, label, icon, className = "" }) => (
		<LinkContainer to={to} key={to}>
			<Nav.Link className={`nav-item ${isActive(to) ? "active" : ""} ${className}`}>
				{icon}
				{label}
			</Nav.Link>
		</LinkContainer>
	);

	const renderAuthButtons = (variant = "desktop") => (
		<div className={`header-auth-group header-auth-group--${variant}`}>
			<LinkContainer to="/login">
				<Button className="header-auth-btn header-auth-btn--login">
					Login
				</Button>
			</LinkContainer>
			<LinkContainer to="/register">
				<Button className="header-auth-btn header-auth-btn--register">
					Register
					<FaArrowRight className="header-auth-btn__arrow" aria-hidden="true" />
				</Button>
			</LinkContainer>
		</div>
	);

	return (
		<header className="site-header">
			<Navbar
				fixed="top"
				expand="xl"
				collapseOnSelect
				expanded={expanded}
				onToggle={setExpanded}
				className={`modern-navbar ${scrolled ? "scrolled" : ""}`}
			>
				<Container fluid className="header-container px-3 px-xl-4">
					<LinkContainer to="/">
						<Navbar.Brand className="brand-container header-brand-link">
							<div className="brand-logo">
								<GiCarWheel className="brand-icon" />
							</div>
							<span className="brand-text">Car Rental</span>
						</Navbar.Brand>
					</LinkContainer>

					<div className="header-actions d-xl-none">
						{user ? (
							<button
								type="button"
								className="header-mobile-account"
								onClick={() => setExpanded(true)}
								aria-label="Open menu"
							>
								<FaUserCircle />
							</button>
						) : (
							renderAuthButtons("mobile-inline")
						)}
					</div>

					<Navbar.Toggle
						aria-controls="site-navbar"
						className="custom-toggler"
					>
						<FaBars />
					</Navbar.Toggle>

					<Navbar.Collapse id="site-navbar" className="header-collapse">
						<Nav className="main-nav mx-xl-auto">
							{primaryLinks.map((link) => renderNavLink(link))}

							{user && renderNavLink({ to: "/my-cars", label: "My Cars", icon: <FaCar className="nav-icon" /> })}

							{/* Desktop: compact dropdowns */}
							<NavDropdown
								title={
									<span className="nav-dropdown-title">
										More <FaChevronDown className="nav-dropdown-caret" />
									</span>
								}
								id="nav-more-dropdown"
								className={`nav-dropdown nav-dropdown--more d-none d-xl-block ${
									isActivePrefix(MORE_PATHS) ? "active" : ""
								}`}
							>
								{moreLinks.map((link) => (
									<LinkContainer to={link.to} key={link.to}>
										<NavDropdown.Item>{link.label}</NavDropdown.Item>
									</LinkContainer>
								))}
							</NavDropdown>

							{/* Mobile: flat links */}
							<div className="header-mobile-section d-xl-none">
								<p className="header-mobile-section__label">Company</p>
								{moreLinks.map((link) => renderNavLink(link))}
							</div>

							{user && (
								<div className="header-mobile-section d-xl-none">
									<p className="header-mobile-section__label">Your account</p>
									{accountLinks.map((link) => renderNavLink(link))}
								</div>
							)}
						</Nav>

						<div className="header-auth-bar d-none d-xl-flex">
							{user ? (
								<NavDropdown
									title={
										<span className="header-account-trigger">
											<span className="header-account-avatar">
												{(displayName[0] || "U").toUpperCase()}
											</span>
											<span className="header-account-name">{displayName}</span>
											<FaChevronDown className="nav-dropdown-caret" />
										</span>
									}
									id="nav-account-dropdown"
									align="end"
									className={`nav-dropdown nav-dropdown--account ${
										isActivePrefix(ACCOUNT_PATHS) ? "active" : ""
									}`}
								>
									{accountLinks.map((link) => (
										<LinkContainer to={link.to} key={link.to}>
											<NavDropdown.Item>{link.label}</NavDropdown.Item>
										</LinkContainer>
									))}
									<NavDropdown.Divider />
									<NavDropdown.Item onClick={onLogout} className="text-danger">
										<FaSignOutAlt className="me-2" />
										Logout
									</NavDropdown.Item>
								</NavDropdown>
							) : (
								renderAuthButtons("desktop")
							)}
						</div>

						{user && (
							<div className="header-mobile-auth d-xl-none">
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
							<div className="header-mobile-auth d-xl-none">
								<p className="header-mobile-auth__hint">
									New here? Create an account to book cars or list your own.
								</p>
								{renderAuthButtons("mobile-menu")}
							</div>
						)}
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;
