import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bookingAPIService from "./bookingAPIService";
import paymentAPIService from "../payments/paymentAPIService";

const formatApiError = (error) => {
  const data = error.response?.data;
  if (!data) return error.message || error.toString();
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  if (data.non_field_errors) {
    return Array.isArray(data.non_field_errors)
      ? data.non_field_errors.join(", ")
      : String(data.non_field_errors);
  }
  return Object.entries(data)
    .map(([field, value]) => {
      const message = Array.isArray(value) ? value.join(", ") : String(value);
      return `${field}: ${message}`;
    })
    .join("; ");
};

const initialState = {
  myBookings: [],
  ownerBookings: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const createBooking = createAsyncThunk(
  "bookings/create",
  async (bookingData, thunkAPI) => {
    try {
      return await bookingAPIService.createBooking(bookingData);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatApiError(error));
    }
  }
);

export const getMyBookings = createAsyncThunk(
  "bookings/getMyBookings",
  async (_, thunkAPI) => {
    try {
      return await bookingAPIService.getMyBookings();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatApiError(error));
    }
  }
);

export const getOwnerBookings = createAsyncThunk(
  "bookings/getOwnerBookings",
  async (_, thunkAPI) => {
    try {
      return await bookingAPIService.getOwnerBookings();
    } catch (error) {
      return thunkAPI.rejectWithValue(formatApiError(error));
    }
  }
);

export const approveBooking = createAsyncThunk(
  "bookings/approve",
  async (pkid, thunkAPI) => {
    try {
      return await bookingAPIService.approveBooking(pkid);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatApiError(error));
    }
  }
);

export const declineBooking = createAsyncThunk(
  "bookings/decline",
  async (pkid, thunkAPI) => {
    try {
      return await bookingAPIService.declineBooking(pkid);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatApiError(error));
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancel",
  async (pkid, thunkAPI) => {
    try {
      return await bookingAPIService.cancelBooking(pkid);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatApiError(error));
    }
  }
);

export const payBooking = createAsyncThunk(
  "bookings/pay",
  async ({ pkid, phoneNumber }, thunkAPI) => {
    try {
      return await paymentAPIService.payBooking(pkid, phoneNumber);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatApiError(error));
    }
  }
);

export const activateBooking = createAsyncThunk(
  "bookings/activate",
  async ({ pkid, handover }, thunkAPI) => {
    try {
      return await bookingAPIService.activateBooking(pkid, handover);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatApiError(error));
    }
  }
);

export const completeBooking = createAsyncThunk(
  "bookings/complete",
  async ({ pkid, handover }, thunkAPI) => {
    try {
      return await bookingAPIService.completeBooking(pkid, handover);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatApiError(error));
    }
  }
);

export const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMyBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBookings = action.payload;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getOwnerBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOwnerBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ownerBookings = action.payload;
      })
      .addCase(getOwnerBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(approveBooking.fulfilled, (state, action) => {
        const booking = state.ownerBookings.find(
          (item) => item.pkid === action.meta.arg
        );
        if (booking) {
          booking.status = action.payload.status || "AWAITING_PAYMENT";
        }
      })
      .addCase(declineBooking.fulfilled, (state, action) => {
        const booking = state.ownerBookings.find(
          (item) => item.pkid === action.meta.arg
        );
        if (booking) booking.status = action.payload.status;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const booking = state.myBookings.find(
          (item) => item.pkid === action.meta.arg
        );
        if (booking) booking.status = action.payload.status;
      })
      .addCase(payBooking.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(payBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const booking = state.myBookings.find(
          (item) => item.pkid === action.meta.arg.pkid
        );
        if (booking) {
          booking.status = action.payload.booking_status;
          booking.latest_transaction = action.payload.transaction;
        }
      })
      .addCase(payBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(activateBooking.fulfilled, (state, action) => {
        const pkid = action.meta.arg.pkid;
        const updateList = (list) => {
          const booking = list.find((item) => item.pkid === pkid);
          if (booking) {
            booking.status = action.payload.status;
            booking.activated_at = action.payload.activated_at;
            booking.pickup_mileage = action.payload.pickup_mileage;
          }
        };
        updateList(state.myBookings);
        updateList(state.ownerBookings);
      })
      .addCase(completeBooking.fulfilled, (state, action) => {
        const pkid = action.meta.arg.pkid;
        const updateList = (list) => {
          const booking = list.find((item) => item.pkid === pkid);
          if (booking) {
            booking.status = action.payload.status;
            booking.completed_at = action.payload.completed_at;
          }
        };
        updateList(state.myBookings);
        updateList(state.ownerBookings);
      });
  },
});

export const { reset } = bookingSlice.actions;
export default bookingSlice.reducer;
