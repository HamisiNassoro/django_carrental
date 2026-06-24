import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GiCarWheel } from "react-icons/gi";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Container>
        <Row className="g-4">
          <Col lg={4} md={6}>
            <div className="site-footer__brand">
              <span className="site-footer__logo">
                <GiCarWheel />
              </span>
              <span className="site-footer__name">Car Rental</span>
            </div>
            <p className="site-footer__tagline">
              Peer-to-peer car rental in Kenya. Find, book, and pay with M-Pesa —
              or list your vehicle and earn when trips complete.
            </p>
          </Col>

          <Col lg={2} md={6}>
            <h6 className="site-footer__heading">Explore</h6>
            <ul className="site-footer__links">
              <li><Link to="/cars">Browse vehicles</Link></li>
              <li><Link to="/nearby">Nearby map</Link></li>
              <li><Link to="/create-car">List your car</Link></li>
              <li><Link to="/my-bookings">My bookings</Link></li>
            </ul>
          </Col>

          <Col lg={2} md={6}>
            <h6 className="site-footer__heading">Company</h6>
            <ul className="site-footer__links">
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/login">Sign in</Link></li>
              <li><Link to="/register">Create account</Link></li>
            </ul>
          </Col>

          <Col lg={4} md={6}>
            <h6 className="site-footer__heading">Contact</h6>
            <div className="site-footer__contact">
              <FaMapMarkerAlt />
              <span>Nairobi, Kenya</span>
            </div>
            <div className="site-footer__contact">
              <FaEnvelope />
              <span>support@carrental.co.ke</span>
            </div>
            <div className="site-footer__contact">
              <FaPhone />
              <span>+254 790 013248</span>
            </div>
          </Col>
        </Row>

        <div className="site-footer__bottom">
          © {year} Car Rental. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
