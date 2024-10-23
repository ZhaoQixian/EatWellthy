import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
        setFormData(prev => ({
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
      setFormData(prev => ({ ...prev, newPassword: "", confirmPassword: "" }));
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
      allergies: allergies.split(",").map(item => item.trim()).filter(Boolean),
    };

    const success = await dispatch(updateProfile(profileData));
    if (success) {
      showMessage("Profile updated successfully");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    )) {
      const success = await dispatch(deleteAccount());
      if (success) {
        showMessage("Account deleted successfully");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      {message.text && (
        <div className={`p-3 mb-4 rounded ${
          message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}>
          {message.text}
        </div>
      )}

      {error && (
        <div className="p-3 mb-4 rounded bg-red-100 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {/* Password Change Form */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={onSubmitPassword}>
            <div className="mb-4">
              <label className="block mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={onChange}
                className="w-full p-2 border rounded"
                minLength="6"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                className="w-full p-2 border rounded"
                minLength="6"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Profile Information Form */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <form onSubmit={onSubmitProfile}>
            <div className="mb-4">
              <label className="block mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={age}
                onChange={onChange}
                className="w-full p-2 border rounded"
                min="0"
                max="150"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={height}
                onChange={onChange}
                className="w-full p-2 border rounded"
                min="0"
                max="300"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={weight}
                onChange={onChange}
                className="w-full p-2 border rounded"
                min="0"
                max="500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Daily Budget</label>
              <input
                type="number"
                name="dailyBudget"
                value={dailyBudget}
                onChange={onChange}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Dietary Preferences</label>
              <input
                type="text"
                name="dietaryPreferences"
                value={dietaryPreferences}
                onChange={onChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Allergies (comma separated)</label>
              <input
                type="text"
                name="allergies"
                value={allergies}
                onChange={onChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Delete Account Section */}
        <div className="border border-red-200 p-4 rounded bg-red-50">
          <h2 className="text-xl font-semibold mb-4 text-red-700">Danger Zone</h2>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            disabled={loading}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;