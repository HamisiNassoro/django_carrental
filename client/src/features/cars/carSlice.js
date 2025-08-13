import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import carAPIService from "./carAPIService";

const initialState = {
	cars: [],
	userCars: [],
	car: {},
	isError: false,
	isLoading: false,
	isSuccess: false,
	message: "",
};

// get all cars
export const getCars = createAsyncThunk(
	"cars/getAll",
	async (_, thunkAPI) => {
		try {
			return await carAPIService.getCars();
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			return thunkAPI.rejectWithValue(message);
		}
	}
);

// get user's cars
export const getUserCars = createAsyncThunk(
	"cars/getUserCars",
	async (_, thunkAPI) => {
		try {
			return await carAPIService.getUserCars();
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			return thunkAPI.rejectWithValue(message);
		}
	}
);

// get single car
export const getCar = createAsyncThunk(
	"cars/getCar",
	async (slug, thunkAPI) => {
		try {
			return await carAPIService.getCar(slug);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			return thunkAPI.rejectWithValue(message);
		}
	}
);

// create car
export const createCar = createAsyncThunk(
	"cars/create",
	async (carData, thunkAPI) => {
		try {
			return await carAPIService.createCar(carData);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			return thunkAPI.rejectWithValue(message);
		}
	}
);

// update car
export const updateCar = createAsyncThunk(
	"cars/update",
	async ({ slug, carData }, thunkAPI) => {
		try {
			return await carAPIService.updateCar(slug, carData);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			return thunkAPI.rejectWithValue(message);
		}
	}
);

// delete car
export const deleteCar = createAsyncThunk(
	"cars/delete",
	async (slug, thunkAPI) => {
		try {
			return await carAPIService.deleteCar(slug);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const carSlice = createSlice({
	name: "car",
	initialState,
	reducers: {
		reset: (state) => initialState,
	},
	extraReducers: (builder) => {
		builder
			// Get all cars
			.addCase(getCars.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getCars.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.cars = action.payload.results;
			})
			.addCase(getCars.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			// Get user cars
			.addCase(getUserCars.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getUserCars.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.userCars = action.payload.results;
			})
			.addCase(getUserCars.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			// Get single car
			.addCase(getCar.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getCar.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.car = action.payload;
			})
			.addCase(getCar.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			// Create car
			.addCase(createCar.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createCar.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.car = action.payload;
			})
			.addCase(createCar.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			// Update car
			.addCase(updateCar.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateCar.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.car = action.payload;
			})
			.addCase(updateCar.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			// Delete car
			.addCase(deleteCar.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteCar.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(deleteCar.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});

export const { reset } = carSlice.actions;
export default carSlice.reducer;