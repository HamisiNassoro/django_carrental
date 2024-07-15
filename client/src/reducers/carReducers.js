import {
	CAR_LIST_FAIL,
	CAR_LIST_REQUEST,
	CAR_LIST_SUCCESS,
} from "../actions/types";

export const carsListReducer = (state = { cars: [] }, action) => {
	switch (action.type) {
		case CAR_LIST_REQUEST:
			return { loading: true, cars: [] };
		case CAR_LIST_SUCCESS:
			return { loading: false, cars: action.payload.results };

		case CAR_LIST_FAIL:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

