import api from "../../utils/axios";

const createBooking = async (bookingData) => {
  const response = await api.post("/bookings/", bookingData);
  return response.data;
};

const getMyBookings = async () => {
  const response = await api.get("/bookings/me/");
  return response.data;
};

const getOwnerBookings = async () => {
  const response = await api.get("/bookings/owner/");
  return response.data;
};

const approveBooking = async (pkid) => {
  const response = await api.patch(`/bookings/${pkid}/approve/`);
  return response.data;
};

const declineBooking = async (pkid) => {
  const response = await api.patch(`/bookings/${pkid}/decline/`);
  return response.data;
};

const cancelBooking = async (pkid) => {
  const response = await api.patch(`/bookings/${pkid}/cancel/`);
  return response.data;
};

const activateBooking = async (pkid) => {
  const response = await api.patch(`/bookings/${pkid}/activate/`);
  return response.data;
};

const completeBooking = async (pkid) => {
  const response = await api.patch(`/bookings/${pkid}/complete/`);
  return response.data;
};

const bookingAPIService = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  approveBooking,
  declineBooking,
  cancelBooking,
  activateBooking,
  completeBooking,
};

export default bookingAPIService;
