import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import supermarkets from "./supermarkets";
import errorReducer from "./errorReducer";
import EventReducer from "./eventReducer";
import EventsReducer from "./eventsReducer";
import modalReducer from "./modelReducer";

export default combineReducers({
  alert,
  auth,
  supermarkets,
  event: EventReducer,
  events: EventsReducer,
  modalStatus: modalReducer,
  error: errorReducer,
});
