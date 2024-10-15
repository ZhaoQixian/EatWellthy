import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import supermarkets from "./supermarkets";

export default combineReducers({
  alert,
  auth,
  supermarkets,
});
