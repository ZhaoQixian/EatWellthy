import axios from "axios";
import {
  SET_PROFILE,
  PROFILE_ERROR,
  LOADING_PROFILE,
  LOGOUT
} from "./types";

// Get Profile
export const getProfile = () => async (dispatch) => {
  try {
    dispatch({ type: LOADING_PROFILE });

    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({
        type: PROFILE_ERROR,
        payload: "No token found. Please log in again."
      });
      return null;
    }

    const config = {
      headers: {
        "x-auth-token": token,
      },
    };

    const res = await axios.get("http://localhost:5050/profile", config);
    
    console.log("Profile response:", res.data); // Debug log

    dispatch({
      type: SET_PROFILE,
      payload: res.data
    });

    return res.data;
  } catch (err) {
    console.error("Error fetching profile:", err.response?.data || err.message);
    
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response?.data?.msg || "Error fetching profile"
    });
    
    return null;
  }
};

// Update Profile
export const updateProfile = (profileData) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_PROFILE });

    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({
        type: PROFILE_ERROR,
        payload: "No token found. Please log in again."
      });
      return false;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };

    const res = await axios.put(
      "http://localhost:5050/profile",
      profileData,
      config
    );

    dispatch({
      type: SET_PROFILE,
      payload: res.data
    });

    return true;
  } catch (err) {
    console.error("Error updating profile:", err.response?.data || err.message);
    
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response?.data?.msg || "Error updating profile"
    });
    
    return false;
  }
};

// Change Password
export const changePassword = (newPassword) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({
        type: PROFILE_ERROR,
        payload: "No token found. Please log in again."
      });
      return false;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };

    await axios.put(
      "http://localhost:5050/users/updatepassword",
      { password: newPassword },
      config
    );

    return true;
  } catch (err) {
    console.error("Error updating password:", err.response?.data || err.message);
    
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response?.data?.msg || "Error updating password"
    });
    
    return false;
  }
};

// Delete Account
export const deleteAccount = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({
        type: PROFILE_ERROR,
        payload: "No token found. Please log in again."
      });
      return false;
    }

    const config = {
      headers: {
        "x-auth-token": token,
      },
    };

    await axios.delete("http://localhost:5050/users/delete", config);

    dispatch({ type: LOGOUT });
    return true;
  } catch (err) {
    console.error("Error deleting account:", err.response?.data || err.message);
    
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response?.data?.msg || "Error deleting account"
    });
    
    return false;
  }
};