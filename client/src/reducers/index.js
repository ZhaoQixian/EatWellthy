import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import supermarkets from "./supermarkets";
import errorReducer from "./errorReducer";
import EventReducer from "./eventReducer";
import EventsReducer from "./eventsReducer";
import modalReducer from "./modelReducer";
import profileReducer from "./profileReducer"; // Add this import

export default combineReducers({
  alert,
  auth,
  supermarkets,
  event: EventReducer,
  events: EventsReducer,
  modalStatus: modalReducer,
  error: errorReducer,
  profile: profileReducer  // Add this line
});