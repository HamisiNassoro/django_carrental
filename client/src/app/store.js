import { configureStore } from "@reduxjs/toolkit";
import carReducer from "../features/cars/carSlice";
import authReducer from "../features/auth/authSlice";
import bookingReducer from "../features/bookings/bookingSlice";

export const store = configureStore({
	reducer: {
		cars: carReducer,
		auth: authReducer,
		bookings: bookingReducer,
	},
});