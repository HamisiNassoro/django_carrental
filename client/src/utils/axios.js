import axios from "axios";

// Get API URL from environment variable or use default
// For production, set REACT_APP_API_URL in your deployment platform
const API_URL = process.env.REACT_APP_API_URL || "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Request to:", config.url);
    console.log("Token present:", !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header added");
    } else {
      console.log("No token found, request will be unauthenticated");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log("Response error:", error.response?.status, error.config?.url, error.response?.data);
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log("401 error - clearing auth data and redirecting to login");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;