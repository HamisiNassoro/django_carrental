import api from "../../utils/axios";

const getMyProfile = async () => {
  const response = await api.get("/profile/me/");
  return response.data.profile || response.data;
};

const updateProfile = async (username, data) => {
  const response = await api.patch(`/profile/update/${username}/`, data);
  return response.data.profile || response.data;
};

const profileAPIService = {
  getMyProfile,
  updateProfile,
};

export default profileAPIService;
