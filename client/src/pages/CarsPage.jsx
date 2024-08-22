import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import { getCars } from "../features/cars/carSlice";

const CarsPage = () => {
	const { cars, isLoading, isSuccess } = useSelector(
		(state) => state.cars
	);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getCars());
	}, [dispatch]);

	if (isLoading) {
		return <Spinner />;
	}
	return (
		<>
			<Container>
				<Row>
					<Col className="mg-top">
						<h1>Cars will be displayed here</h1>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default CarsPage;