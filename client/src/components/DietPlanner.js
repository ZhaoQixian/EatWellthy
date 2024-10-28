import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../actions/Profile';
import { Link } from 'react-router-dom';
import './DietPlanner.css';

const DietPlanner = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);
  const [bmi, setBmi] = useState(null);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile?.height && profile?.weight) {
      const heightInMeters = profile.height / 100;
      const calculatedBMI = (
        profile.weight / (heightInMeters * heightInMeters)
      ).toFixed(1);
      setBmi(calculatedBMI);
    }
  }, [profile]);

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#FFA500', recommendation: 'Focus on increasing calorie intake with nutrient-rich foods.' };
    if (bmi < 24.9) return { category: 'Normal weight', color: '#4CAF50', recommendation: 'Maintain a balanced diet with regular exercise.' };
    if (bmi < 29.9) return { category: 'Overweight', color: '#FF6B6B', recommendation: 'Focus on portion control and regular physical activity.' };
    return { category: 'Obese', color: '#FF0000', recommendation: 'Consult with a healthcare provider for a personalized weight management plan.' };
  };

  if (loading) {
    return <div className="diet-planner-loading">Loading...</div>;
  }

  return (
    <div className="diet-planner-container">
      <h1>Diet Planner</h1>
      
      {!profile?.height || !profile?.weight ? (
        <div className="diet-planner-alert">
          <p>Please complete your profile with height and weight information to see your BMI and get diet recommendations.</p>
          <Link to="/profile" className="update-profile-btn">Update Profile</Link>
        </div>
      ) : (
        <>
          <div className="bmi-container">
            <h2>Your BMI Information</h2>
            <div className="bmi-card">
              <div className="bmi-value">
                BMI: <span style={{ color: getBMICategory(bmi)?.color }}>{bmi}</span>
              </div>
              <div className="bmi-category" style={{ color: getBMICategory(bmi)?.color }}>
                Category: {getBMICategory(bmi)?.category}
              </div>
              <div className="bmi-stats">
                Height: {profile.height} cm<br />
                Weight: {profile.weight} kg
              </div>
              <div className="bmi-recommendation">
                {getBMICategory(bmi)?.recommendation}
              </div>
            </div>
          </div>

          <div className="bmi-categories">
            <h2>BMI Categories Reference</h2>
            <div className="category-grid">
              <div className="category-item" style={{ borderColor: '#FFA500' }}>
                <h3>Underweight</h3>
                <p>BMI less than 18.5</p>
              </div>
              <div className="category-item" style={{ borderColor: '#4CAF50' }}>
                <h3>Normal Weight</h3>
                <p>BMI 18.5 to 24.9</p>
              </div>
              <div className="category-item" style={{ borderColor: '#FF6B6B' }}>
                <h3>Overweight</h3>
                <p>BMI 25 to 29.9</p>
              </div>
              <div className="category-item" style={{ borderColor: '#FF0000' }}>
                <h3>Obese</h3>
                <p>BMI 30 or greater</p>
              </div>
            </div>
          </div>

          {profile?.dietaryPreferences && (
            <div className="preferences-section">
              <h2>Your Dietary Preferences</h2>
              <p>{profile.dietaryPreferences}</p>
            </div>
          )}

          {profile?.allergies && profile.allergies.length > 0 && (
            <div className="allergies-section">
              <h2>Allergies to Consider</h2>
              <ul>
                {profile.allergies.map((allergy, index) => (
                  <li key={index}>{allergy}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DietPlanner;