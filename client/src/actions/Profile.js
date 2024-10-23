import axios from "axios";
import { LOGOUT } from "./types"; // Assuming you have a LOGOUT action type

// Change Password
export const changePassword = (newPassword) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token, // Token retrieved from localStorage
      },
    };

    const body = JSON.stringify({ password: newPassword });

    await axios.put("http://localhost:5050/users/updatepassword", body, config);

    alert("Password updated successfully");
  } catch (err) {
    console.error("Error updating password:", err.message);
    if (err.response) {
      alert(`Error: ${err.response.data.msg || "Error updating password"}`);
    } else {
      alert("Error updating password. Please try again.");
    }
  }
};

// Get Profile
export const getProfile = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    const config = {
      headers: {
        "x-auth-token": token, // Token retrieved from localStorage
      },
    };

    const res = await axios.get("http://localhost:5050/profile", config);

    return res.data;
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    if (err.response) {
      alert(`Error: ${err.response.data.msg || "Error fetching profile"}`);
    } else {
      alert("Error fetching profile. Please try again.");
    }
  }
};

// Update Profile
export const updateProfile = (profileData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token, // Token retrieved from localStorage
      },
    };

    const body = JSON.stringify(profileData);

    await axios.put("http://localhost:5050/profile", body, config);

    alert("Profile updated successfully");
  } catch (err) {
    console.error("Error updating profile:", err.message);
    if (err.response) {
      alert(`Error: ${err.response.data.msg || "Error updating profile"}`);
    } else {
      alert("Error updating profile. Please try again.");
    }
  }
};

// Delete Account
export const deleteAccount = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    const config = {
      headers: {
        "x-auth-token": token, // Token retrieved from localStorage
      },
    };

    await axios.delete("http://localhost:5050/users/delete", config);

    dispatch({ type: LOGOUT });
    alert("Account deleted successfully");
  } catch (err) {
    console.error("Error deleting account:", err.message);
    if (err.response) {
      alert(`Error: ${err.response.data.msg || "Error deleting account"}`);
    } else {
      alert("Error deleting account. Please try again.");
    }
  }
};
