import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bookingAPIService from "./bookingAPIService";

const formatApiError = (error) => {
  const data = error.response?.data;
  if (!data) return error.message || error.toString();
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
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
        if (booking) booking.status = action.payload.status;
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
      });
  },
});

export const { reset } = bookingSlice.actions;
export default bookingSlice.reducer;
