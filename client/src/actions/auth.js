import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("http://localhost:5050/users/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data || {}, // Fallback to an empty object if data is undefined
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post(
        "http://localhost:5050/users/",
        body,
        config
      );

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data || {}, // Fallback to an empty object
      });

      dispatch(loadUser());
    } catch (err) {
      console.error("Registration Error: ", err); // Log the entire error

      // If err.response is undefined, that indicates a network error or the server is unreachable.
      if (err.response) {
        const errors = err.response.data.errors; // Check for validation errors

        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        } else {
          dispatch(
            setAlert(
              "Registration failed: " + err.response.data.message ||
                "Unknown error",
              "danger"
            )
          ); // Show server message
        }
      } else {
        dispatch(setAlert("Network error: Unable to reach server", "danger"));
      }

      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

// Login User
// Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post(
      "http://localhost:5050/users/auth",
      body,
      config
    );

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    if (err.response && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    } else {
      dispatch(setAlert("An unexpected error occurred", "danger"));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout / Clear Profile
export const logout = () => async (dispatch) => {
  dispatch({ type: "LOGOUT" });
  await fetch("http://localhost:5050/users/google/logout", {
    method: "GET",
  });
};
