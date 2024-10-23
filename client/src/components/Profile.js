import React, { useState } from "react";
import { useDispatch } from "react-redux";
//import { changePassword, deleteAccount } from "../actions/profile";
import { changePassword, deleteAccount } from "../actions/Profile";

const Profile = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const { newPassword, confirmPassword } = formData;
  const dispatch = useDispatch();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      dispatch(changePassword(newPassword));
    }
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
      <form onSubmit={onSubmit}>
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

      <button onClick={handleDelete} className="delete-btn">
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
