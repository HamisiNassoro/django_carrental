import api from "../../utils/axios";

const buildHandoverPayload = ({ mileage, notes, photo }) => {
  if (photo) {
    const formData = new FormData();
    formData.append("mileage", String(mileage));
    formData.append("notes", notes || "");
    formData.append("photo", photo);
    return formData;
  }
  return { mileage, notes: notes || "" };
};

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

const getOwnerEarnings = async () => {
  const response = await api.get("/bookings/owner/earnings/");
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

const activateBooking = async (pkid, handover) => {
  const payload = buildHandoverPayload(handover);
  const config = payload instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  const response = await api.patch(`/bookings/${pkid}/activate/`, payload, config);
  return response.data;
};

const completeBooking = async (pkid, handover) => {
  const payload = buildHandoverPayload(handover);
  const config = payload instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  const response = await api.patch(`/bookings/${pkid}/complete/`, payload, config);
  return response.data;
};

const bookingAPIService = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getOwnerEarnings,
  approveBooking,
  declineBooking,
  cancelBooking,
  activateBooking,
  completeBooking,
};

export default bookingAPIService;
