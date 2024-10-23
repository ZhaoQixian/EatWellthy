import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  changePassword,
  deleteAccount,
  updateProfile,
  getProfile,
} from "../../actions/Profile";

const Profile = () => {
  const dispatch = useDispatch();

  // Local state for form inputs
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

  // Get profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await dispatch(getProfile()); // Fetch profile from backend
      if (profile) {
        setFormData({
          ...formData,
          age: profile.age || "", // Default to empty if not set
          height: profile.height || "",
          weight: profile.weight || "",
          dailyBudget: profile.dailyBudget || "",
          dietaryPreferences: profile.dietaryPreferences || "",
          allergies: profile.allergies ? profile.allergies.join(", ") : "", // Convert array to comma-separated string
        });
      }
    };

    fetchProfile();
  }, [dispatch]);

  // Handle change for all input fields
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle password change
  const onSubmitPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      dispatch(changePassword(newPassword));
    }
  };

  // Handle profile update
  const onSubmitProfile = (e) => {
    e.preventDefault();
    dispatch(
      updateProfile({
        age,
        height,
        weight,
        dailyBudget,
        dietaryPreferences,
        allergies: allergies.split(",").map((allergy) => allergy.trim()), // Convert string back to array
      })
    );
    alert("Profile updated successfully");
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      dispatch(deleteAccount());
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>

      {/* Form for password change */}
      <form onSubmit={onSubmitPassword}>
        <div>
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>

      {/* Form for profile update */}
      <form onSubmit={onSubmitProfile}>
        <div>
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={age}
            onChange={onChange}
            min="0"
            max="150"
          />
        </div>
        <div>
          <label>Height (cm)</label>
          <input
            type="number"
            name="height"
            value={height}
            onChange={onChange}
            min="0"
            max="300"
          />
        </div>
        <div>
          <label>Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={weight}
            onChange={onChange}
            min="0"
            max="500"
          />
        </div>
        <div>
          <label>Daily Budget</label>
          <input
            type="number"
            name="dailyBudget"
            value={dailyBudget}
            onChange={onChange}
            min="0"
          />
        </div>
        <div>
          <label>Dietary Preferences</label>
          <input
            type="text"
            name="dietaryPreferences"
            value={dietaryPreferences}
            onChange={onChange}
          />
        </div>
        <div>
          <label>Allergies (comma separated)</label>
          <input
            type="text"
            name="allergies"
            value={allergies}
            onChange={onChange}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>

      <button onClick={handleDelete} className="delete-btn">
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
