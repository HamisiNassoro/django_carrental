import api from "../../utils/axios";

const setUserLocation = async (locationData) => {
  const response = await api.post("/users/location/set/", locationData);
  return response.data;
};

const getUserLocation = async () => {
  const response = await api.get("/users/location/");
  return response.data;
};

const locationAPIService = {
  setUserLocation,
  getUserLocation,
};

export default locationAPIService;
