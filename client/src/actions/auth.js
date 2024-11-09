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
import config from '../config';

// Utility function for handling API errors
const handleApiError = (error, dispatch, customMessage = config.defaultErrorMsg) => {
  console.log('API Error:', error); // For debugging

  try {
    // Network or axios error
    if (!error.response) {
      dispatch(setAlert('Unable to connect to server. Please check your internet connection.', 'danger'));
      return;
    }

    // Server returned an error
    const data = error.response.data;
    
    if (data && Array.isArray(data.errors)) {
      data.errors.forEach(err => {
        dispatch(setAlert(err.msg || customMessage, 'danger'));
      });
      return;
    }

    if (data && typeof data.message === 'string') {
      dispatch(setAlert(data.message, 'danger'));
      return;
    }

    // Default error message
    dispatch(setAlert(customMessage, 'danger'));
  } catch (e) {
    console.error('Error handling failed:', e);
    dispatch(setAlert(customMessage, 'danger'));
  }
};

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'x-auth-token': token
    };

    const res = await axios.get(`${config.backendUrl}/users/auth`, { headers });

    dispatch({
      type: USER_LOADED,
      payload: res.data || {},
    });
  } catch (err) {
    handleApiError(err, dispatch, 'Authentication failed. Please log in again.');
    dispatch({ type: AUTH_ERROR });
  }
};

// Update Name
export const updateName = (name) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(setAlert('Authentication error - please login again', 'danger'));
      return false;
    }

    const headers = {
      'Content-Type': 'application/json',
      'x-auth-token': token
    };

    const res = await axios.put(
      `${config.backendUrl}/api/profile/update-name`,
      { name },
      { headers }
    );

    dispatch({
      type: UPDATE_NAME_SUCCESS,
      payload: res.data
    });

    dispatch(setAlert('Name updated successfully', 'success'));
    dispatch(loadUser());
    return true;
  } catch (err) {
    handleApiError(err, dispatch, 'Failed to update name. Please try again.');
    dispatch({ type: UPDATE_NAME_FAIL });
    return false;
  }
};

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    const res = await axios.post(
      `${config.backendUrl}/users/`,
      { name, email, password },
      { headers }
    );

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data || {},
    });

    dispatch(loadUser());
    dispatch(setAlert('Registration successful! Please check your email to verify your account.', 'success'));
    return true;
  } catch (err) {
    handleApiError(err, dispatch, 'Registration failed. Please try again.');
    dispatch({ type: REGISTER_FAIL });
    return false;
  }
};

// Verify Email with Code
export const verifyEmail = (email, code) => async (dispatch) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    const res = await axios.post(
      `${config.backendUrl}/users/verify-code`,
      { email, code },
      { headers }
    );

    dispatch({
      type: EMAIL_VERIFICATION_SUCCESS,
      payload: res.data
    });

    await dispatch(loadUser());
    dispatch(setAlert('Email verified successfully! You can now proceed to dashboard.', 'success'));
    return true;
  } catch (err) {
    handleApiError(err, dispatch, 'Email verification failed. Please try again.');
    dispatch({ type: EMAIL_VERIFICATION_FAIL });
    return false;
  }
};

// Resend Verification Code
export const resendVerification = (email) => async (dispatch) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    await axios.post(
      `${config.backendUrl}/users/resend-verification`,
      { email },
      { headers }
    );
    
    dispatch(setAlert('New verification code has been sent. Please check your inbox.', 'success'));
    return true;
  } catch (err) {
    handleApiError(err, dispatch, 'Failed to send verification code. Please try again.');
    return false;
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    const res = await axios.post(
      `${config.backendUrl}/users/auth`,
      { email, password },
      { headers }
    );

    if (res.data && res.data.token) {
      localStorage.setItem('token', res.data.token);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      await dispatch(loadUser());
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err) {
    handleApiError(err, dispatch, 'Login failed. Please check your credentials and try again.');
    dispatch({ type: LOGIN_FAIL });
  }
};

// Logout
export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem('token');
    dispatch({ type: LOGOUT });
    
    await fetch(`${config.backendUrl}/users/google/logout`, {
      method: "GET",
      credentials: 'include'
    });
  } catch (err) {
    handleApiError(err, dispatch, 'Logout completed with some errors');
    dispatch({ type: LOGOUT });
  }
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