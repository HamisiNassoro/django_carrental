import React from "react";
import { Button, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const HomePage = () => {
	return (
		<>
			<header className="masthead main-bg-image">
				<Container className="px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center">
					<div className="d-flex justify-content-center">
						<div className="text-center">
							<h1 className="mx-auto my-0 text-uppercase">
								Car Rental
							</h1>
							<h2 className="text-white-50 mx-auto mt-2 mb-5">
								The one stop shop for all matters cars.
								Buy,Rent or sell with us!
							</h2>
							<LinkContainer to="/cars">
								<Button variant="primary">Get Started</Button>
							</LinkContainer>
						</div>
					</div>
				</Container>
			</header>
		</>
	);
};

export default HomePage;