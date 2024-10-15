import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  GOOGLE_AUTO,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
  loading: false,
  user: null,
  googleAuto: localStorage.getItem("googleAuto") || false,
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;

  // Log the action type and payload for debugging
  // console.log("Action Type:", type, "Payload:", payload);

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload, // Ensure payload contains the user object
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token); // Save token to localStorage
      return {
        ...state,
        ...payload, // Ensure payload has the necessary user details
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token"); // Clear token on failure or logout
      localStorage.removeItem("googleAuto"); // Clear token to localStorage
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        googleAuto: false,
        user: null,
      };
    case GOOGLE_AUTO:
      localStorage.setItem("googleAuto", true); // Save token to localStorage
      return { googleAuto: true };
    default:
      return state; // Return current state if action type is unrecognized
  }
}
