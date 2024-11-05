import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  GOOGLE_AUTO,
  EMAIL_VERIFICATION_SUCCESS,
  EMAIL_VERIFICATION_FAIL,
  UPDATE_NAME_SUCCESS,
  UPDATE_NAME_FAIL
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: localStorage.getItem("token") ? true : false, // Initialize based on token presence
  loading: true, // Start with true to prevent flash of unauthorized content
  user: null,
  googleAuto: localStorage.getItem("googleAuto") === "true", // Convert string to boolean
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case UPDATE_NAME_SUCCESS:
      return {
        ...state,
        user: payload,
        loading: false
      };
    case UPDATE_NAME_FAIL:
      return {
        ...state,
        loading: false
      };
    case EMAIL_VERIFICATION_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          isVerified: true
        },
        loading: false
      };
    case EMAIL_VERIFICATION_FAIL:
      return {
        ...state,
        loading: false
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("googleAuto");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        googleAuto: false,
        user: null,
      };
    case GOOGLE_AUTO:
      localStorage.setItem("googleAuto", "true"); // Store as string
      return { 
        ...state,
        googleAuto: true 
      };
    default:
      return state;
  }
}