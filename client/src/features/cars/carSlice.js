import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import carAPIService from "./carAPIService";

const initialState = {
	cars: [],
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

export const carSlice = createSlice({
	name: "car",
	initialState,
	reducers: {
		reset: (state) => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(getCars.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getCars.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.cars = action.payload;
			})
			.addCase(getCars.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});

export const { reset } = carSlice.actions;
export default carSlice.reducer;