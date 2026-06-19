import api from "../../utils/axios";

//get cars
const getCars = async () => {
	const response = await api.get("/cars/all/");
	return response.data;
};

// get nearby cars for rent
const getNearbyCars = async ({ latitude, longitude, radius = 10, car_type }) => {
	const params = new URLSearchParams({
		latitude: String(latitude),
		longitude: String(longitude),
		radius: String(radius),
	});
	if (car_type) params.append("car_type", car_type);
	const response = await api.get(`/cars/nearby/?${params.toString()}`);
	return response.data;
};

// update car location
const updateCarLocation = async (slug, locationData) => {
	const response = await api.patch(`/cars/location/update/${slug}/`, locationData);
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

// upload car images (multipart)
const uploadCarImages = async (slug, photos) => {
	const formData = new FormData();

	Object.entries(photos).forEach(([field, entry]) => {
		if (entry?.file instanceof File) {
			formData.append(field, entry.file);
		}
	});

	if (![...formData.keys()].length) {
		return null;
	}

	const response = await api.post(`/cars/upload-image/${slug}/`, formData, {
		transformRequest: [
			(data, headers) => {
				delete headers["Content-Type"];
				return data;
			},
		],
	});
	return response.data;
};

const carAPIService = {
	getCars,
	getNearbyCars,
	getUserCars,
	getCar,
	createCar,
	updateCar,
	deleteCar,
	updateCarLocation,
	uploadCarImages,
};

export default carAPIService;