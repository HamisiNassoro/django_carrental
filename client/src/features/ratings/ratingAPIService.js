import api from "../../utils/axios";

const createBookingReview = async (bookingPkid, { rating, comment }) => {
  const response = await api.post(`/ratings/bookings/${bookingPkid}/`, {
    rating,
    comment: comment || "",
  });
  return response.data;
};

const getOwnerReviews = async (profileId, limit = 10) => {
  const response = await api.get(`/ratings/owners/${profileId}/`, {
    params: { limit },
  });
  return response.data;
};

const ratingAPIService = {
  createBookingReview,
  getOwnerReviews,
};

export default ratingAPIService;
