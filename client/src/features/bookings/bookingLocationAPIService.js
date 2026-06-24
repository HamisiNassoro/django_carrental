import api from "../../utils/axios";

const getTripLocation = async (pkid) => {
  const response = await api.get(`/bookings/${pkid}/location/`);
  return response.data;
};

const sendLocationPing = async (
  pkid,
  { latitude, longitude, accuracy_m, speed_kmh, heading }
) => {
  const payload = { latitude, longitude, accuracy_m };
  if (speed_kmh != null) payload.speed_kmh = speed_kmh;
  if (heading != null) payload.heading = heading;

  const response = await api.post(`/bookings/${pkid}/location/ping/`, payload);
  return response.data;
};

const setLocationSharing = async (pkid, enabled) => {
  const response = await api.patch(`/bookings/${pkid}/location/sharing/`, {
    enabled,
  });
  return response.data;
};

const bookingLocationAPIService = {
  getTripLocation,
  sendLocationPing,
  setLocationSharing,
};

export default bookingLocationAPIService;
