import api from "../../utils/axios";

const payBooking = async (pkid, phoneNumber) => {
  const response = await api.post(`/payments/bookings/${pkid}/pay/`, {
    phone_number: phoneNumber,
  });
  return response.data;
};

const getPaymentStatus = async (pkid) => {
  const response = await api.get(`/payments/bookings/${pkid}/status/`);
  return response.data;
};

const paymentAPIService = {
  payBooking,
  getPaymentStatus,
};

export default paymentAPIService;
