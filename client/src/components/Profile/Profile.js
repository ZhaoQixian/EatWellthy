import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  deleteAccount,
  updateProfile,
  getProfile,
} from "../../actions/Profile";
import { updateName } from "../../actions/auth";
import "./Profile.css";

// Import all animal icons
import bearIcon from "../../img/bear.png";
import capybaraIcon from "../../img/capybara.png";
import catIcon from "../../img/cat.png";
import dogIcon from "../../img/dog.png";
import otterIcon from "../../img/otter.png";
import pandaIcon from "../../img/panda.png";
import rabbitIcon from "../../img/rabbit.png";
import tigerIcon from "../../img/tiger.png";

const Profile = () => {
  const dispatch = useDispatch();
  const profileState = useSelector((state) => state.profile);
  const authState = useSelector((state) => state.auth);
  const { loading, error } = profileState;

  const [message, setMessage] = useState({ text: "", type: "" });
  const [validationErrors, setValidationErrors] = useState({});
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

  const validationRules = {
    age: {
      min: 1,
      max: 120,
      message: "Age must be between 1 and 120 years",
    },
    height: {
      min: 30,
      max: 300,
      message: "Height must be between 30 and 300 cm",
    },
    weight: {
      min: 20,
      max: 500,
      message: "Weight must be between 20 and 500 kg",
    },
    targetWeight: {
      min: 20,
      max: 500,
      message: "Target weight must be between 20 and 500 kg",
    },
    dailyBudget: {
      min: 0,
      max: 1000,
      message: "Daily budget must be between 0 and 1000 SGD",
    },
  };

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

  const validateField = (name, value) => {
    if (validationRules[name]) {
      const { min, max, message } = validationRules[name];
      const numValue = Number(value);
      
      if (value && (isNaN(numValue) || numValue < min || numValue > max)) {
        return message;
      }
    }
    return "";
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate name
    if (!name.trim()) {
      errors.name = "Name is required";
    }

    // Validate numeric fields
    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    
    // For numeric fields, prevent negative values on input
    if (validationRules[name] && value !== "") {
      const numValue = Number(value);
      if (numValue < 0) return;
    }

    setFormData({ ...formData, [name]: value });
    
    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleIconSelect = (iconName) => {
    setFormData({ ...formData, profileIcon: iconName });
  };

  const onSubmitProfile = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showMessage("Please correct the errors in the form", "error");
      return;
    }

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
        <div className={`message ${message.type === "error" ? "error" : "success"}`}>
          {message.text}
        </div>
      )}

      {error && <div className="message error">{error}</div>}

      <div className="profile-form active">
        <div className="profile-form-section">
          <h2>Basic Information</h2>
          <form onSubmit={onSubmitProfile}>
            <div className="form-row">
              <div className="form-field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  className={validationErrors.name ? "error" : ""}
                />
                {validationErrors.name && (
                  <span className="error-message">{validationErrors.name}</span>
                )}
              </div>
              <div className="form-field">
                <label>Gender</label>
                <select name="gender" value={gender} onChange={onChange}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="form-field">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={age}
                  onChange={onChange}
                  min="0"
                  className={validationErrors.age ? "error" : ""}
                />
                {validationErrors.age && (
                  <span className="error-message">{validationErrors.age}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={height}
                  onChange={onChange}
                  min="0"
                  className={validationErrors.height ? "error" : ""}
                />
                {validationErrors.height && (
                  <span className="error-message">{validationErrors.height}</span>
                )}
              </div>
              <div className="form-field">
                <label>Current Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={weight}
                  onChange={onChange}
                  min="0"
                  className={validationErrors.weight ? "error" : ""}
                />
                {validationErrors.weight && (
                  <span className="error-message">{validationErrors.weight}</span>
                )}
              </div>
              <div className="form-field">
                <label>Target Weight (kg)</label>
                <input
                  type="number"
                  name="targetWeight"
                  value={targetWeight}
                  onChange={onChange}
                  min="0"
                  className={validationErrors.targetWeight ? "error" : ""}
                />
                {validationErrors.targetWeight && (
                  <span className="error-message">{validationErrors.targetWeight}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Daily Budget (SGD)</label>
                <input
                  type="number"
                  name="dailyBudget"
                  value={dailyBudget}
                  onChange={onChange}
                  min="0"
                  className={validationErrors.dailyBudget ? "error" : ""}
                />
                {validationErrors.dailyBudget && (
                  <span className="error-message">{validationErrors.dailyBudget}</span>
                )}
              </div>
              <div className="form-field">
                <label>Activity Level</label>
                <select name="activityLevel" value={activityLevel} onChange={onChange}>
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="lightly">Lightly active (1-3 days/week)</option>
                  <option value="moderately">Moderately active (3-5 days/week)</option>
                  <option value="very">Very active (6-7 days/week)</option>
                  <option value="super">Super active (physical job)</option>
                </select>
              </div>
              <div className="form-field">
                <label>Diet Plan</label>
                <select name="dietPlan" value={dietPlan} onChange={onChange}>
                  <option value="maintenance">Maintenance Plan</option>
                  <option value="weightloss">Weight Loss Plan</option>
                  <option value="keto">Keto Plan</option>
                  <option value="vegetarian">Vegetarian Plan</option>
                </select>
              </div>
            </div>

            <div className="form-row-full">
              <div className="form-field">
                <label>Dietary Preferences</label>
                <input
                  type="text"
                  name="dietaryPreferences"
                  value={dietaryPreferences}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="form-row-full">
              <div className="form-field">
                <label>Allergies (comma separated)</label>
                <input
                  type="text"
                  name="allergies"
                  value={allergies}
                  onChange={onChange}
                />
              </div>
            </div>

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
                {Object.entries(animalIcons).map(([name, icon]) => (
                  <div
                    key={name}
                    className={`icon-option ${profileIcon === name ? "selected" : ""}`}
                    onClick={() => handleIconSelect(name)}
                  >
                    <img src={icon} alt={name} className="icon-preview" />
                    <span className="icon-name">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit">Update Profile</button>
          </form>
        </div>

        <div className="profile-form-section">
          <h2>Change Password</h2>
          <form onSubmit={onSubmitPassword}>
            <div className="form-field">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={onChange}
              />
            </div>
            <div className="form-field">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
              />
            </div>
            <button type="submit">Update Password</button>
          </form>
        </div>

        <div className="danger-zone">
          <h2>Delete Account</h2>
          <p className="danger-text">
            This action cannot be undone. Please be certain.
          </p>
          <button onClick={handleDelete}>Delete My Account</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;