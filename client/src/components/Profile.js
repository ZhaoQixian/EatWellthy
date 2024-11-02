import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Profile.css";
import {
  changePassword,
  deleteAccount,
  updateProfile,
  getProfile,
} from "../actions/Profile";
import { updateName } from "../actions/auth";

// Import all animal icons
import bearIcon from "../img/bear.png";
import capybaraIcon from "../img/capybara.png";
import catIcon from "../img/cat.png";
import dogIcon from "../img/dog.png";
import otterIcon from "../img/otter.png";
import pandaIcon from "../img/panda.png";
import rabbitIcon from "../img/rabbit.png";
import tigerIcon from "../img/tiger.png";

const Profile = () => {
  const dispatch = useDispatch();
  const profileState = useSelector((state) => state.profile);
  const authState = useSelector((state) => state.auth);
  const { loading, error } = profileState;

  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    name: "",
    newPassword: "",
    confirmPassword: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    targetWeight: "",
    dailyBudget: "",
    dietaryPreferences: "",
    allergies: "",
    activityLevel: "sedentary",
    dietPlan: "maintenance",
    profileIcon: "bear",
  });

  const animalIcons = {
    bear: bearIcon,
    capybara: capybaraIcon,
    cat: catIcon,
    dog: dogIcon,
    otter: otterIcon,
    panda: pandaIcon,
    rabbit: rabbitIcon,
    tiger: tigerIcon,
  };

  const {
    name,
    newPassword,
    confirmPassword,
    age,
    gender,
    height,
    weight,
    targetWeight,
    dailyBudget,
    dietaryPreferences,
    allergies,
    activityLevel,
    dietPlan,
    profileIcon,
  } = formData;

  useEffect(() => {
    const loadProfile = async () => {
      const profileData = await dispatch(getProfile());
      if (profileData) {
        setFormData((prev) => ({
          ...prev,
          name: authState.user?.name || "",
          age: profileData.age || "",
          gender: profileData.gender || "",
          height: profileData.height || "",
          weight: profileData.weight || "",
          targetWeight: profileData.targetWeight || "",
          dailyBudget: profileData.dailyBudget || "",
          dietaryPreferences: profileData.dietaryPreferences || "",
          allergies: profileData.allergies?.join(", ") || "",
          activityLevel: profileData.activityLevel || "sedentary",
          dietPlan: profileData.dietPlan || "maintenance",
          profileIcon: profileData.profileIcon || "bear",
        }));
      }
    };
    loadProfile();
  }, [dispatch, authState.user]);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIconSelect = (iconName) => {
    setFormData({ ...formData, profileIcon: iconName });
  };

  const onSubmitProfile = async (e) => {
    e.preventDefault();

    if (name !== authState.user?.name) {
      const nameUpdateSuccess = await dispatch(updateName(name));
      if (!nameUpdateSuccess) {
        return;
      }
    }

    const profileData = {
      age: Number(age) || 0,
      gender,
      height: Number(height) || 0,
      weight: Number(weight) || 0,
      targetWeight: Number(targetWeight) || 0,
      dailyBudget: Number(dailyBudget) || 0,
      dietaryPreferences,
      allergies: allergies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      activityLevel,
      dietPlan,
      profileIcon,
    };

    const success = await dispatch(updateProfile(profileData));
    if (success) {
      showMessage("Profile updated successfully");
    }
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
      </div>

      {message.text && (
        <div
          className={`message ${message.type === "error" ? "error" : "success"}`}
        >
          {message.text}
        </div>
      )}

      {error && <div className="message error">{error}</div>}

      <div className="profile-form active">
        <div className="profile-form-section">
          <h2>Profile Information</h2>
          <form onSubmit={onSubmitProfile}>
            {/* Profile Icon Selection */}
            <div className="profile-icon-section">
              <h3>Choose Your Profile Icon</h3>
              <div className="current-icon">
                <p>Current Icon:</p>
                <img 
                  src={animalIcons[profileIcon]} 
                  alt={profileIcon} 
                  className="current-icon-preview"
                />
              </div>
              <div className="icon-grid">
                {Object.entries(animalIcons).map(([name, icon], index) => (
                  <div
                    key={name}
                    className={`icon-option ${profileIcon === name ? 'selected' : ''}`}
                    onClick={() => handleIconSelect(name)}
                  >
                    <img src={icon} alt={name} className="icon-preview" />
                    <span className="icon-name">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rest of the form fields */}
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Name"
                className="name-input"
              />
            </div>
            <select
              name="gender"
              value={gender}
              onChange={onChange}
              className="gender-select"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
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
              name="targetWeight"
              value={targetWeight}
              onChange={onChange}
              placeholder="Target Weight (kg)"
            />
            <input
              type="number"
              name="dailyBudget"
              value={dailyBudget}
              onChange={onChange}
              placeholder="Daily Budget"
            />
            <select
              name="activityLevel"
              value={activityLevel}
              onChange={onChange}
              className="activity-select"
            >
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="lightly">Lightly active (1-3 days/week)</option>
              <option value="moderately">Moderately active (3-5 days/week)</option>
              <option value="very">Very active (6-7 days/week)</option>
              <option value="super">Super active (physical job)</option>
            </select>
            <select
              name="dietPlan"
              value={dietPlan}
              onChange={onChange}
              className="diet-plan-select"
            >
              <option value="maintenance">Maintenance Plan</option>
              <option value="weightloss">Weight Loss Plan</option>
              <option value="keto">Keto Plan</option>
              <option value="vegetarian">Vegetarian Plan</option>
            </select>
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
    </div>
  );
};

export default Profile;