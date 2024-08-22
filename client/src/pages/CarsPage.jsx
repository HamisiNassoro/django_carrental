import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Car from "../components/Car";
import Spinner from "../components/Spinner";
import { getCars } from "../features/cars/carSlice";

const CarsPage = () => {
	const { cars, isLoading, isError, message } = useSelector(
		(state) => state.cars
	);

	const dispatch = useDispatch();

	useEffect(() => {
		if (isError) {
			toast.error(message, { icon: "😭" });
		}
		dispatch(getCars());
	}, [dispatch, isError, message]);

	if (isLoading) {
		return <Spinner />;
	}
	return (
		<>
			<Container>
				<Row>
					<Col className="mg-top text-center">
						<h1>Our Catalog of cars</h1>
						<hr className="hr-text" />
					</Col>
				</Row>
				{
					<>
						<Row className="mt-3">
							{cars.map((car) => (
								<Col
									key={car.id}
									sm={12}
									md={6}
									lg={4}
									xl={3}
								>
									<Car car={car} />
								</Col>
							))}
						</Row>
					</>
				}
			</Container>
		</>
	);
};

export default CarsPage;