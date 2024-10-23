import axios from "axios";
import { LOGOUT } from "./types"; // You'll also need a logout action in case of account deletion

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

    console.log("Sending request to update password...");

    await axios.put("http://localhost:5050/users/updatepassword", body, config);

    alert("Password updated successfully");
  } catch (err) {
    console.error("Error updating password:", err.message); // Log the error message
    if (err.response) {
      console.error("Error details:", err.response); // Log the full response object
      alert(`Error: ${err.response.data.msg || "Error updating password"}`);
    } else {
      alert("Error updating password. Please try again.");
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

    console.log("Sending request to delete account...");

    await axios.delete("http://localhost:5050/users/delete", config);

    dispatch({ type: LOGOUT });
    alert("Account deleted successfully");
  } catch (err) {
    console.error("Error deleting account:", err.message); // Log the error message
    if (err.response) {
      console.error("Error details:", err.response); // Log the full response object
      alert(`Error: ${err.response.data.msg || "Error deleting account"}`);
    } else {
      alert("Error deleting account. Please try again.");
    }
  }
};
