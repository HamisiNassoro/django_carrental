import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Modal, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { getUserCars, deleteCar, reset } from "../features/cars/carSlice";

const CarManagementPage = () => {
	const { userCars, isLoading, isError, isSuccess, message } = useSelector(
		(state) => state.cars
	);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [carToDelete, setCarToDelete] = useState(null);

	useEffect(() => {
		if (isError) {
			toast.error(message, { icon: "😭" });
		}

		if (isSuccess) {
			dispatch(reset());
		}

		dispatch(getUserCars());
	}, [dispatch, isError, isSuccess, message]);

	const handleDeleteClick = (car) => {
		setCarToDelete(car);
		setShowDeleteModal(true);
	};

	const handleDeleteConfirm = () => {
		if (carToDelete) {
			dispatch(deleteCar(carToDelete.slug));
			setShowDeleteModal(false);
			setCarToDelete(null);
		}
	};

	const handleEditClick = (car) => {
		navigate(`/edit-car/${car.slug}`);
	};

	const handleViewClick = (car) => {
		navigate(`/car/${car.slug}`);
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<>
			<Container className="py-5" style={{ marginTop: '80px' }}>
				{/* Page Header */}
				<Row className="mb-4">
					<Col>
						<div className="d-flex justify-content-between align-items-center">
							<div>
								<h1 className="fw-bold" style={{ color: '#333' }}>
									My Cars
								</h1>
								<p className="text-muted">
									Manage your car listings
								</p>
							</div>
							<Link to="/create-car">
								<Button
									variant="primary"
									className="d-flex align-items-center gap-2"
									style={{
										backgroundColor: '#FFD700',
										borderColor: '#FFD700',
										color: '#000'
									}}
								>
									<FaPlus />
									Add New Car
								</Button>
							</Link>
						</div>
					</Col>
				</Row>

				{/* Cars Grid */}
				{userCars.length === 0 ? (
					<Row>
						<Col className="text-center py-5">
							<Card className="border-0 shadow-sm">
								<Card.Body className="py-5">
									<h4 className="text-muted mb-3">No cars found</h4>
									<p className="text-muted mb-4">
										You haven't added any cars yet. Start by adding your first car!
									</p>
									<Link to="/create-car">
										<Button
											variant="primary"
											className="d-flex align-items-center gap-2 mx-auto"
											style={{
												backgroundColor: '#FFD700',
												borderColor: '#FFD700',
												color: '#000'
											}}
										>
											<FaPlus />
											Add Your First Car
										</Button>
									</Link>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				) : (
					<Row>
						{userCars.map((car) => (
							<Col key={car.id} lg={4} md={6} className="mb-4">
								<Card className="h-100 border-0 shadow-sm" style={{
									borderRadius: '12px',
									transition: 'transform 0.3s ease, box-shadow 0.3s ease',
									overflow: 'hidden'
								}}>
									{/* Car Image */}
									<div className="position-relative">
										<img
											src={car.cover_photo}
											alt={car.title}
											style={{
												width: '100%',
												height: '200px',
												objectFit: 'cover'
											}}
										/>
										<Badge
											bg={car.published_status ? "success" : "warning"}
											className="position-absolute top-0 start-0 m-2"
										>
											{car.published_status ? "Published" : "Draft"}
										</Badge>
										<Badge
											bg="info"
											className="position-absolute top-0 end-0 m-2"
										>
											{car.advert_type}
										</Badge>
									</div>

									<Card.Body className="p-4">
										{/* Car Title and Price */}
										<div className="d-flex justify-content-between align-items-start mb-3">
											<div>
												<h5 className="fw-bold mb-1">{car.title}</h5>
												<p className="text-muted mb-0">{car.car_type}</p>
											</div>
											<div className="text-end">
												<h4 className="fw-bold mb-0" style={{ color: '#000' }}>
													${Number(car.price).toLocaleString()}
												</h4>
												<small className="text-muted">Price</small>
											</div>
										</div>

										{/* Car Details */}
										<div className="mb-3">
											<p className="text-muted mb-2">
												{car.description.substring(0, 100)}...
											</p>
											<div className="d-flex justify-content-between text-muted">
												<small>Seats: {car.total_seats}</small>
												<small>Views: {car.views}</small>
											</div>
										</div>

										{/* Action Buttons */}
										<div className="d-flex gap-2">
											<Button
												variant="outline-primary"
												size="sm"
												onClick={() => handleViewClick(car)}
												className="flex-fill d-flex align-items-center justify-content-center gap-1"
											>
												<FaEye />
												View
											</Button>
											<Button
												variant="outline-warning"
												size="sm"
												onClick={() => handleEditClick(car)}
												className="flex-fill d-flex align-items-center justify-content-center gap-1"
											>
												<FaEdit />
												Edit
											</Button>
											<Button
												variant="outline-danger"
												size="sm"
												onClick={() => handleDeleteClick(car)}
												className="flex-fill d-flex align-items-center justify-content-center gap-1"
											>
												<FaTrash />
												Delete
											</Button>
										</div>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
				)}
			</Container>

			{/* Delete Confirmation Modal */}
			<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Delete</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Are you sure you want to delete "{carToDelete?.title}"? This action cannot be undone.
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
						Cancel
					</Button>
					<Button variant="danger" onClick={handleDeleteConfirm}>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default CarManagementPage;