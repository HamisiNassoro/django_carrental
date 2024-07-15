import axios from "axios";
import {
	CAR_LIST_FAIL,
	CAR_LIST_REQUEST,
	CAR_LIST_SUCCESS,
} from "./types";

export const listProperties = () => async (dispatch) => {
	try {
		dispatch({
			type: CAR_LIST_REQUEST,
		});
		const { data } = await axios.get("/api/cars/all/");

		dispatch({
			type: CAR_LIST_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: CAR_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
