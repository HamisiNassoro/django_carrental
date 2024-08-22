import axios from "axios";

//get cars
const getCars = async () => {
	const response = await axios.get("/api/cars/all/");
	return response.data;
};

const carAPIService = { getCars };

export default carAPIService;