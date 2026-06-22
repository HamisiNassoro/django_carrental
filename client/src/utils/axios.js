import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";

const AUTH_SKIP_REDIRECT_PATHS = [
  "/v1/auth/jwt/create/",
  "/v1/auth/jwt/refresh/",
  "/v1/auth/users/",
  "/v1/auth/otp/send/",
  "/v1/auth/otp/verify/",
];

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    if (status === 401) {
      const shouldSkipRedirect = AUTH_SKIP_REDIRECT_PATHS.some((path) =>
        requestUrl.includes(path)
      );

      if (!shouldSkipRedirect) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        const isAuthPage =
          window.location.pathname === "/login" ||
          window.location.pathname === "/register" ||
          window.location.pathname === "/login/phone";

        if (!isAuthPage) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
