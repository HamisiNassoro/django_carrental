import React from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { FaBed, FaShower } from "react-icons/fa";
import { GiStairs } from "react-icons/gi";
import { Link } from "react-router-dom";

const Car = ({ car }) => {
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	return (
		<Card style={{ width: "18rem" }}>
			<Badge
				bg="success"
				className="position-absolute top-0 start-100 translate-middle rounded-pill"
			>
				{car.advert_type}
			</Badge>
			<Link to={`/car/${car.slug}`}>
				<Card.Img src={car.cover_photo} variant="top" />
			</Link>
			<Card.Title className="car-price">
				${numberWithCommas(Number(car.price))}
			</Card.Title>
			<Card.Body>
				<Card.Title as="h4">
					<strong>{car.title}</strong>
				</Card.Title>

				<Card.Text as="p">
					{car.description.substring(0, 70)}...
				</Card.Text>
				<hr />
				<Row>
					<Col className="d-flex justify-content-between">
						<span>
							<FaBed /> {car.car_type}
						</span>
						<span>
							<GiStairs /> {car.total_seats}
						</span>
					</Col>
				</Row>
				<hr />
				<Link to={`/car/${car.slug}`}>
					<Button variant="primary">Get More Info &gt; &gt;</Button>
				</Link>
			</Card.Body>
		</Card>
	);
};

export default Car;