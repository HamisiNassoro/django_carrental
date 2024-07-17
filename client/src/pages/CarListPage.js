import { Alert, Col, Row, Spin } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listCars } from "../actions/carActions";

function CarListPage() {
	const dispatch = useDispatch();

	const carsList = useSelector((state) => state.carsList);

	const { loading, error, cars } = carsList;

	useEffect(() => {
		dispatch(listCars());
	}, [dispatch]);
	return (
		<>
			{loading ? (
				<div className="spinner">
					<Spin size="large" />
				</div>
			) : error ? (
				<Alert
					type="error"
					message={error}
					showIcon
					className="alert-margin--top"
				/>
			) : (
				<>
					<Row>
						<Col span={24}>
							<h2 className="margin--top">
								Our Catalog of Cars
							</h2>
						</Col>
						{cars.map((car) => (
							<Col key={car.id} sm={12} md={6} lg={4} xs={3}>
								<p>{car.title}</p>
							</Col>
						))}
					</Row>
				</>
			)}
		</>
	);
}

export default CarListPage;
