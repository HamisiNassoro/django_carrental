import { combineReducers } from "redux";
import { carsListReducer } from "./carReducers";

export default combineReducers({
	carsList: carsListReducer,
});