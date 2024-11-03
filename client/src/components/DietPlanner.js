import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from '../actions/Profile';
import { Link } from 'react-router-dom';
import './DietPlanner.css';

const DietPlanner = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);
  const [bmi, setBmi] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);

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

      if (profile.age && profile.gender) {
        let calculatedBMR;
        if (profile.gender === 'male') {
          calculatedBMR = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
        } else {
          calculatedBMR = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
        }
        setBmr(Math.round(calculatedBMR));

        const activityMultipliers = {
          sedentary: 1.2,
          lightly: 1.375,
          moderately: 1.55,
          very: 1.725,
          super: 1.9
        };
        
        // Calculate base calories
        const baseCalories = calculatedBMR * activityMultipliers[profile.activityLevel || 'sedentary'];
        
        // Adjust calories based on diet plan
        const adjustedCalories = adjustCaloriesForPlan(baseCalories, profile.dietPlan, calculatedBMI);
        setDailyCalories(Math.round(adjustedCalories));
      }
    }
  }, [profile]);

  const adjustCaloriesForPlan = (baseCalories, plan, bmi) => {
    switch (plan) {
      case 'weightloss':
        const deficitPercentage = parseFloat(bmi) > 30 ? 0.25 : 0.20;
        return baseCalories * (1 - deficitPercentage);
      case 'keto':
        return baseCalories * 0.85;
      case 'maintenance':
      case 'vegetarian':
      default:
        return baseCalories;
    }
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#FFA500', recommendation: 'Focus on increasing calorie intake with nutrient-rich foods.' };
    if (bmi < 24.9) return { category: 'Normal weight', color: '#4CAF50', recommendation: 'Maintain a balanced diet with regular exercise.' };
    if (bmi < 29.9) return { category: 'Overweight', color: '#FF6B6B', recommendation: 'Focus on portion control and regular physical activity.' };
    return { category: 'Obese', color: '#FF0000', recommendation: 'Consult with a healthcare provider for a personalized weight management plan.' };
  };

  const calculateMacroCalories = (totalCalories, macroPercentage) => {
    const calories = (totalCalories * (macroPercentage / 100));
    return Math.round(calories);
  };

  const getDietPlanMacros = (plan) => {
    const plans = {
      maintenance: { carbs: 55, protein: 15, fats: 30 },
      weightloss: { carbs: 50, protein: 25, fats: 25 },
      keto: { carbs: 5, protein: 20, fats: 75 },
      vegetarian: { carbs: 55, protein: 20, fats: 25 }
    };
    return plans[plan || 'maintenance'];
  };

  const getActivityLevelDisplay = (level) => {
    const displays = {
      sedentary: 'Sedentary (little or no exercise)',
      lightly: 'Lightly active (1-3 days/week)',
      moderately: 'Moderately active (3-5 days/week)',
      very: 'Very active (6-7 days/week)',
      super: 'Super active (physical job)'
    };
    return displays[level] || 'Not specified';
  };

  const getDietPlanDisplay = (plan) => {
    const displays = {
      maintenance: 'Maintenance Plan',
      weightloss: 'Weight Loss Plan',
      keto: 'Keto Plan',
      vegetarian: 'Vegetarian Plan'
    };
    return displays[plan] || 'Not specified';
  };

  if (loading) {
    return <div className="diet-planner-loading">Loading...</div>;
  }

  return (
    <div className="diet-planner-container">
      <h1>Diet Planner</h1>
      
      {!profile?.height || !profile?.weight || !profile?.age || !profile?.gender ? (
        <div className="diet-planner-alert">
          <p>Please complete your profile with height, weight, age, and gender information to see your BMI and get diet recommendations.</p>
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

          <div className="metabolic-info">
            <h2>Metabolic Information</h2>
            <div className="metabolic-card">
              <div className="bmr-value">
                Basal Metabolic Rate (BMR): {bmr} calories/day
              </div>
              <div className="activity-display">
                <label>Activity Level:</label>
                <span>{getActivityLevelDisplay(profile.activityLevel)}</span>
              </div>
              <div className="daily-calories">
                Daily Calorie Needs: {dailyCalories} calories/day
                {profile.dietPlan && profile.dietPlan !== 'maintenance' && (
                  <div className="calorie-adjustment-note">
                    (Adjusted for {profile.dietPlan} plan)
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="diet-plan">
            <h2>Your Diet Plan</h2>
            <div className="diet-plan-card">
              <div className="plan-display">
                <label>Current Plan:</label>
                <span>{getDietPlanDisplay(profile.dietPlan)}</span>
              </div>
              <div className="macros">
                <h3>Recommended Macronutrient Split:</h3>
                <div className="macros-breakdown">
                  <div className="macro-item">
                    <div className="macro-percentage">
                      Carbohydrates: {getDietPlanMacros(profile.dietPlan).carbs}%
                    </div>
                    <div className="macro-calories">
                      {calculateMacroCalories(dailyCalories, getDietPlanMacros(profile.dietPlan).carbs)} calories
                      ({Math.round(calculateMacroCalories(dailyCalories, getDietPlanMacros(profile.dietPlan).carbs) / 4)}g)
                    </div>
                  </div>
                  <div className="macro-item">
                    <div className="macro-percentage">
                      Proteins: {getDietPlanMacros(profile.dietPlan).protein}%
                    </div>
                    <div className="macro-calories">
                      {calculateMacroCalories(dailyCalories, getDietPlanMacros(profile.dietPlan).protein)} calories
                      ({Math.round(calculateMacroCalories(dailyCalories, getDietPlanMacros(profile.dietPlan).protein) / 4)}g)
                    </div>
                  </div>
                  <div className="macro-item">
                    <div className="macro-percentage">
                      Fats: {getDietPlanMacros(profile.dietPlan).fats}%
                    </div>
                    <div className="macro-calories">
                      {calculateMacroCalories(dailyCalories, getDietPlanMacros(profile.dietPlan).fats)} calories
                      ({Math.round(calculateMacroCalories(dailyCalories, getDietPlanMacros(profile.dietPlan).fats) / 9)}g)
                    </div>
                  </div>
                </div>
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