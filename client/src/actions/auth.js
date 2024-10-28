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
  EMAIL_VERIFICATION_SUCCESS,
  EMAIL_VERIFICATION_FAIL,
  UPDATE_NAME_SUCCESS,
  UPDATE_NAME_FAIL,
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
      payload: res.data || {},
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Update Name
export const updateName = (name) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.put(
      "http://localhost:5050/users/update-name",
      JSON.stringify({ name }),
      config
    );

    dispatch({
      type: UPDATE_NAME_SUCCESS,
      payload: res.data
    });

    dispatch(setAlert('Name updated successfully', 'success'));
    return true;
  } catch (err) {
    dispatch({
      type: UPDATE_NAME_FAIL
    });

    if (err.response && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    } else {
      dispatch(setAlert('Failed to update name', 'danger'));
    }
    return false;
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
        payload: res.data || {},
      });

      // Load user immediately after registration
      dispatch(loadUser());

      dispatch(setAlert('Registration successful! Please check your email to verify your account.', 'success'));
      return true;
    } catch (err) {
      console.error("Registration Error: ", err);

      if (err.response) {
        const errors = err.response.data.errors;

        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        } else {
          dispatch(
            setAlert(
              "Registration failed: " + err.response.data.message ||
                "Unknown error",
              "danger"
            )
          );
        }
      } else {
        dispatch(setAlert("Network error: Unable to reach server", "danger"));
      }

      dispatch({
        type: REGISTER_FAIL,
      });
      return false;
    }
  };

// Verify Email with Code
export const verifyEmail = (email, code) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, code });

  try {
    const res = await axios.post(
      "http://localhost:5050/users/verify-code",
      body,
      config
    );

    dispatch({
      type: EMAIL_VERIFICATION_SUCCESS,
      payload: res.data
    });

    // Load user after successful verification
    await dispatch(loadUser());

    dispatch(setAlert('Email verified successfully! You can now proceed to dashboard.', 'success'));
    return true;
  } catch (err) {
    dispatch({
      type: EMAIL_VERIFICATION_FAIL
    });

    if (err.response && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    } else {
      dispatch(setAlert('Email verification failed', 'danger'));
    }
    return false;
  }
};

// Resend Verification Code
export const resendVerification = (email) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email });

  try {
    const res = await axios.post(
      "http://localhost:5050/users/resend-verification",
      body,
      config
    );
    
    dispatch(setAlert('New verification code has been sent. Please check your inbox.', 'success'));
    return true;
  } catch (err) {
    if (err.response && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    } else {
      dispatch(setAlert('Failed to send verification code', 'danger'));
    }
    return false;
  }
};

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

    // Load user after successful login
    await dispatch(loadUser());
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

export default {
  loadUser,
  updateName,
  register,
  verifyEmail,
  resendVerification,
  login,
  logout
};