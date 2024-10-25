import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Profile.css";
import {
  changePassword,
  deleteAccount,
  updateProfile,
  getProfile,
} from "../actions/Profile";

const Profile = () => {
  const dispatch = useDispatch();
  const profileState = useSelector((state) => state.profile);
  const { loading, error } = profileState;

  const [message, setMessage] = useState({ text: "", type: "" });
  const [editing, setEditing] = useState(false); // State to toggle editing
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    age: "",
    height: "",
    weight: "",
    dailyBudget: "",
    dietaryPreferences: "",
    allergies: "",
  });

  const {
    newPassword,
    confirmPassword,
    age,
    height,
    weight,
    dailyBudget,
    dietaryPreferences,
    allergies,
  } = formData;

  useEffect(() => {
    const loadProfile = async () => {
      const profileData = await dispatch(getProfile());
      if (profileData) {
        setFormData((prev) => ({
          ...prev,
          age: profileData.age || "",
          height: profileData.height || "",
          weight: profileData.weight || "",
          dailyBudget: profileData.dailyBudget || "",
          dietaryPreferences: profileData.dietaryPreferences || "",
          allergies: profileData.allergies?.join(", ") || "",
        }));
      }
    };
    loadProfile();
  }, [dispatch]);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showMessage("Password must be at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showMessage("Passwords do not match", "error");
      return;
    }

    const success = await dispatch(changePassword(newPassword));
    if (success) {
      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
      showMessage("Password updated successfully");
    }
  };

  const onSubmitProfile = async (e) => {
    e.preventDefault();
    const profileData = {
      age: Number(age) || 0,
      height: Number(height) || 0,
      weight: Number(weight) || 0,
      dailyBudget: Number(dailyBudget) || 0,
      dietaryPreferences,
      allergies: allergies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const success = await dispatch(updateProfile(profileData));
    if (success) {
      showMessage("Profile updated successfully");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      const success = await dispatch(deleteAccount());
      if (success) {
        showMessage("Account deleted successfully");
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <button
          className="profile-edit-btn"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {message.text && (
        <div
          className={`message ${
            message.type === "error" ? "error" : "success"
          }`}
        >
          {message.text}
        </div>
      )}

      {error && <div className="message error">{error}</div>}

      {editing && (
        <div className="profile-form active">
          <div className="profile-form-section">
            <h2>Profile Information</h2>
            <form onSubmit={onSubmitProfile}>
              <input
                type="number"
                name="age"
                value={age}
                onChange={onChange}
                placeholder="Age"
              />
              <input
                type="number"
                name="height"
                value={height}
                onChange={onChange}
                placeholder="Height (cm)"
              />
              <input
                type="number"
                name="weight"
                value={weight}
                onChange={onChange}
                placeholder="Weight (kg)"
              />
              <input
                type="number"
                name="dailyBudget"
                value={dailyBudget}
                onChange={onChange}
                placeholder="Daily Budget"
              />
              <input
                type="text"
                name="dietaryPreferences"
                value={dietaryPreferences}
                onChange={onChange}
                placeholder="Dietary Preferences"
              />
              <input
                type="text"
                name="allergies"
                value={allergies}
                onChange={onChange}
                placeholder="Allergies (comma separated)"
              />
              <button type="submit">Update Profile</button>
            </form>
          </div>
        </div>
      )}

      <div className="profile-form-section">
        <h2>Change Password</h2>
        <form onSubmit={onSubmitPassword}>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={onChange}
            placeholder="New Password"
          />
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            placeholder="Confirm Password"
          />
          <button type="submit">Update Password</button>
        </form>
      </div>

      <div className="danger-zone">
        <h2>Delete Account</h2>
        <button onClick={handleDelete}>Delete My Account</button>
      </div>
    </div>
  );
};

export default Profile;
