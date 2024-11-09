import axios from "axios";
import appConfig from '../config';  // renamed import to avoid conflict
import {
  SET_PROFILE,
  PROFILE_ERROR,
  LOADING_PROFILE,
  LOGOUT,
  CLEAR_PROFILE,
} from "./types";

// Get Profile
export const getProfile = () => async (dispatch) => {
  let axiosConfig = null;

  try {
    dispatch({ type: LOADING_PROFILE });

    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({
        type: PROFILE_ERROR,
        payload: "No token found. Please log in again.",
      });
      return null;
    }

    axiosConfig = {
      headers: {
        "x-auth-token": token,
      },
    };

    console.log("Fetching profile...");
    const res = await axios.get(`${appConfig.backendUrl}/api/profile/me`, axiosConfig);
    console.log("Profile response:", res.data);

    dispatch({
      type: SET_PROFILE,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    console.error("Error fetching profile:", err.response?.data || err.message);

    if (err.response?.status === 400) {
      try {
        const defaultProfile = {
          age: 0,
          height: 0,
          weight: 0,
          targetWeight: 0,
          dailyBudget: 0,
          dietaryPreferences: "",
          allergies: [],
          profileIcon: "bear"
        };

        const createRes = await axios.post(
          `${appConfig.backendUrl}/api/profile`,
          defaultProfile,
          axiosConfig
        );

        dispatch({
          type: SET_PROFILE,
          payload: createRes.data,
        });

        return createRes.data;
      } catch (createErr) {
        console.error("Error creating default profile:", createErr);
      }
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: err.response?.data?.msg || "Error fetching profile",
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
        payload: "No token found. Please log in again.",
      });
      return false;
    }

    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };

    const processedData = {
      ...profileData,
      age: Number(profileData.age) || 0,
      height: Number(profileData.height) || 0,
      weight: Number(profileData.weight) || 0,
      targetWeight: Number(profileData.targetWeight) || 0,
      dailyBudget: Number(profileData.dailyBudget) || 0,
      profileIcon: profileData.profileIcon || "bear",
      allergies: Array.isArray(profileData.allergies)
        ? profileData.allergies
        : profileData.allergies
            ?.split(",")
            .map((a) => a.trim())
            .filter(Boolean) || [],
    };

    console.log("Sending profile data:", processedData);
    const res = await axios.post(
      `${appConfig.backendUrl}/api/profile`,
      processedData,
      axiosConfig
    );
    console.log("Update response:", res.data);

    dispatch({
      type: SET_PROFILE,
      payload: res.data,
    });

    return true;
  } catch (err) {
    console.error("Error updating profile:", err.response?.data || err.message);

    dispatch({
      type: PROFILE_ERROR,
      payload: err.response?.data?.msg || "Error updating profile",
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
        payload: "No token found. Please log in again.",
      });
      return false;
    }

    if (!newPassword || newPassword.length < 6) {
      dispatch({
        type: PROFILE_ERROR,
        payload: "Password must be at least 6 characters",
      });
      return false;
    }

    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };

    console.log("Updating password...");
    const res = await axios.put(
      `${appConfig.backendUrl}/api/profile/updatepassword`,
      { password: newPassword },
      axiosConfig
    );
    console.log("Password update response:", res.data);

    return true;
  } catch (err) {
    console.error(
      "Error updating password:",
      err.response?.data || err.message
    );

    dispatch({
      type: PROFILE_ERROR,
      payload: err.response?.data?.msg || "Error updating password",
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
        payload: "No token found. Please log in again.",
      });
      return false;
    }

    const axiosConfig = {
      headers: {
        "x-auth-token": token,
      },
    };

    console.log("Deleting account...");
    await axios.delete(`${appConfig.backendUrl}/api/profile`, axiosConfig);
    console.log("Account deleted successfully");

    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOGOUT });
    return true;
  } catch (err) {
    console.error("Error deleting account:", err.response?.data || err.message);

    dispatch({
      type: PROFILE_ERROR,
      payload: err.response?.data?.msg || "Error deleting account",
    });

    return false;
  }
};

// Generate Diet Suggestions
export const generateDietSuggestions = () => async (dispatch) => {
  try {
    dispatch({ type: LOADING_PROFILE });

    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({
        type: PROFILE_ERROR,
        payload: "No token found. Please log in again.",
      });
      return null;
    }

    const axiosConfig = {
      headers: {
        "x-auth-token": token,
      },
    };

    console.log("Sending request to generate diet suggestions...");
    const res = await axios.post(
      `${appConfig.backendUrl}/api/profile/generate-diet`,
      {},
      axiosConfig
    );
    console.log("Received response:", res.data);

    await dispatch(getProfile());

    return res.data;
  } catch (err) {
    console.error("Error in generateDietSuggestions:", err);
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response?.data?.msg || "Error generating diet suggestions",
    });
    return null;
  }
};