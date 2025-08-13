import api from "../../utils/axios";

//get cars
const getCars = async () => {
	const response = await api.get("/cars/all/");
	return response.data;
};

//get user's cars
const getUserCars = async () => {
	const response = await api.get("/cars/agents/");
	return response.data;
};

//get single car
const getCar = async (slug) => {
	const response = await api.get(`/cars/details/${slug}/`);
	return response.data;
};

//create car
const createCar = async (carData) => {
	const response = await api.post("/cars/create/", carData);
	return response.data;
};

//update car
const updateCar = async (slug, carData) => {
	const response = await api.put(`/cars/update/${slug}/`, carData);
	return response.data;
};

//delete car
const deleteCar = async (slug) => {
	const response = await api.delete(`/cars/delete/${slug}/`);
	return response.data;
};

const carAPIService = {
	getCars,
	getUserCars,
	getCar,
	createCar,
	updateCar,
	deleteCar
};

export default carAPIService;