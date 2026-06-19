import api from "../../utils/axios";

const TOKEN_KEY = "token";
const REFRESH_KEY = "refreshToken";
const USER_KEY = "user";

const getToken = () => localStorage.getItem(TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

const setTokens = (access, refresh) => {
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
};

const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
};

const fetchCurrentUser = async () => {
  const response = await api.get("/v1/auth/users/me/");
  setUser(response.data);
  return response.data;
};

const loginWithCredentials = async ({ email, password }) => {
  const response = await api.post("/v1/auth/jwt/create/", {
    email: email.trim().toLowerCase(),
    password,
  });
  if (!response.data.access) {
    throw new Error("Login failed: no access token received");
  }
  setTokens(response.data.access, response.data.refresh);
  return fetchCurrentUser();
};

const login = async (userData) => loginWithCredentials(userData);

const logout = () => {
  clearAuth();
};

const getCurrentUser = async () => {
  if (!getToken()) {
    throw new Error("No token found");
  }
  return fetchCurrentUser();
};

const register = async (userData) => {
  await api.post("/v1/auth/users/", userData);
  return loginWithCredentials({
    email: userData.email,
    password: userData.password,
  });
};

const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new Error("No refresh token");
  }
  const response = await api.post("/v1/auth/jwt/refresh/", { refresh });
  if (response.data.access) {
    setTokens(response.data.access, refresh);
    return response.data.access;
  }
  throw new Error("Token refresh failed");
};

const authService = {
  login,
  logout,
  getCurrentUser,
  register,
  refreshAccessToken,
  getToken,
  getRefreshToken,
  setTokens,
  clearAuth,
};

export default authService;
