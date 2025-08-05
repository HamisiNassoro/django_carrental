import api from "../../utils/axios";

// Get token from localStorage
const getToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

// Set token in localStorage
const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem("token");
};

// Login user
const login = async (userData) => {
  const response = await api.post("/v1/auth/jwt/create/", userData);
  if (response.data.access) {
    setToken(response.data.access);
  }
  return response.data;
};

// Logout user
const logout = () => {
  removeToken();
};

// Get current user
const getCurrentUser = async () => {
  const response = await api.get("/v1/auth/users/me/");
  return response.data;
};

// Register user
const register = async (userData) => {
  const response = await api.post("/v1/auth/users/", userData);
  return response.data;
};

const authService = {
  login,
  logout,
  getCurrentUser,
  register,
  getToken,
  setToken,
  removeToken,
};

export default authService;