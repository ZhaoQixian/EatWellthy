import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile } from "../../actions/Profile";
import { Link } from "react-router-dom";
import "./DietPlanner.css";

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
        profile.weight /
        (heightInMeters * heightInMeters)
      ).toFixed(1);
      setBmi(calculatedBMI);

      if (profile.age && profile.gender) {
        let calculatedBMR;
        if (profile.gender === "male") {
          calculatedBMR =
            88.362 +
            13.397 * profile.weight +
            4.799 * profile.height -
            5.677 * profile.age;
        } else {
          calculatedBMR =
            447.593 +
            9.247 * profile.weight +
            3.098 * profile.height -
            4.33 * profile.age;
        }
        setBmr(Math.round(calculatedBMR));

        const activityMultipliers = {
          sedentary: 1.2,
          lightly: 1.375,
          moderately: 1.55,
          very: 1.725,
          super: 1.9,
        };

        const baseCalories =
          calculatedBMR *
          activityMultipliers[profile.activityLevel || "sedentary"];
        const adjustedCalories = adjustCaloriesForPlan(
          baseCalories,
          profile.dietPlan,
          calculatedBMI
        );
        setDailyCalories(Math.round(adjustedCalories));
      }
    }
  }, [profile]);

  const adjustCaloriesForPlan = (baseCalories, plan, bmi) => {
    switch (plan) {
      case "weightloss":
        const deficitPercentage = parseFloat(bmi) > 30 ? 0.25 : 0.2;
        return baseCalories * (1 - deficitPercentage);
      case "keto":
        return baseCalories * 0.85;
      case "maintenance":
      case "vegetarian":
      default:
        return baseCalories;
    }
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5)
      return {
        category: "Underweight",
        color: "#FFA500",
        recommendation:
          "Focus on increasing calorie intake with nutrient-rich foods.",
      };
    if (bmi < 24.9)
      return {
        category: "Normal weight",
        color: "#4CAF50",
        recommendation: "Maintain a balanced diet with regular exercise.",
      };
    if (bmi < 29.9)
      return {
        category: "Overweight",
        color: "#FF6B6B",
        recommendation:
          "Focus on portion control and regular physical activity.",
      };
    return {
      category: "Obese",
      color: "#FF0000",
      recommendation:
        "Consult with a healthcare provider for a personalized weight management plan.",
    };
  };

  const calculateMacroCalories = (totalCalories, macroPercentage) => {
    const calories = totalCalories * (macroPercentage / 100);
    return Math.round(calories);
  };

  const getDietPlanMacros = (plan) => {
    const plans = {
      maintenance: { carbs: 55, protein: 15, fats: 30 },
      weightloss: { carbs: 50, protein: 25, fats: 25 },
      keto: { carbs: 5, protein: 20, fats: 75 },
      vegetarian: { carbs: 55, protein: 20, fats: 25 },
    };
    return plans[plan || "maintenance"];
  };

  const getActivityLevelDisplay = (level) => {
    const displays = {
      sedentary: "Sedentary (little or no exercise)",
      lightly: "Lightly active (1-3 days/week)",
      moderately: "Moderately active (3-5 days/week)",
      very: "Very active (6-7 days/week)",
      super: "Super active (physical job)",
    };
    return displays[level] || "Not specified";
  };

  const getDietPlanDisplay = (plan) => {
    const displays = {
      maintenance: "Maintenance Plan",
      weightloss: "Weight Loss Plan",
      keto: "Keto Plan",
      vegetarian: "Vegetarian Plan",
    };
    return displays[plan] || "Not specified";
  };

  const renderKeyMetrics = () => (
    <div className="diet-planner__metrics-grid">
      <div className="diet-planner__metric-card">
        <h3 className="diet-planner__metric-title">Daily Calories</h3>
        <div className="diet-planner__metric-value">{dailyCalories}</div>
        <div className="diet-planner__metric-unit">calories/day</div>
        <div className="diet-planner__metric-label">
          {getDietPlanDisplay(profile.dietPlan)}
        </div>
      </div>

      <div className="diet-planner__metric-card">
        <h3 className="diet-planner__metric-title">BMI</h3>
        <div
          className="diet-planner__metric-value"
          style={{ color: getBMICategory(bmi)?.color }}
        >
          {bmi}
        </div>
        <div className="diet-planner__metric-category">
          {getBMICategory(bmi)?.category}
        </div>
        <div className="diet-planner__metric-label">
          {getBMICategory(bmi)?.recommendation}
        </div>
      </div>

      <div className="diet-planner__metric-card">
        <h3 className="diet-planner__metric-title">BMR</h3>
        <div className="diet-planner__metric-value">{bmr}</div>
        <div className="diet-planner__metric-unit">calories/day</div>
        <div className="diet-planner__metric-label">Base Metabolic Rate</div>
      </div>
    </div>
  );

  const renderMacronutrients = () => (
    <div className="diet-planner__macros">
      <h2 className="diet-planner__macros-title">
        Daily Macronutrient Targets
      </h2>
      <div className="diet-planner__macros-grid">
        {Object.entries(getDietPlanMacros(profile.dietPlan)).map(
          ([macro, percentage]) => (
            <div key={macro} className="diet-planner__macro-card">
              <div className="diet-planner__macro-header">
                <h3 className="diet-planner__macro-name">
                  {macro.charAt(0).toUpperCase() + macro.slice(1)}
                </h3>
                <span className="diet-planner__macro-percentage">
                  {percentage}%
                </span>
              </div>
              <div className="diet-planner__macro-details">
                <div className="diet-planner__macro-calories">
                  {calculateMacroCalories(dailyCalories, percentage)} cal
                </div>
                <div className="diet-planner__macro-grams">
                  {Math.round(
                    calculateMacroCalories(dailyCalories, percentage) /
                      (macro === "fats" ? 9 : 4)
                  )}
                  g
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div className="diet-planner__loading">Loading...</div>;
  }

  return (
    <div className="diet-planner">
      <div className="diet-planner__page-wrapper">
        <div className="diet-planner__container">
          <div className="diet-planner__header">
            <h1 className="diet-planner__title">
              Your Nutrition Analysis Report
            </h1>
            <div className="diet-planner__profile-stats">
              <span className="diet-planner__stat-item">
                Height: {profile?.height}cm
              </span>
              <span className="diet-planner__stat-item">
                Weight: {profile?.weight}kg
              </span>
              <span className="diet-planner__stat-item">
                Activity: {getActivityLevelDisplay(profile?.activityLevel)}
              </span>
            </div>
          </div>

          {!profile?.height ||
          !profile?.weight ||
          !profile?.age ||
          !profile?.gender ? (
            <div className="diet-planner__alert">
              <h2 className="diet-planner__alert-title">
                Complete Your Profile
              </h2>
              <p className="diet-planner__alert-text">
                Please update your profile with height, weight, age, and gender
                information to see your personalized nutrition plan.
              </p>
              <Link to="/profile" className="diet-planner__update-btn">
                Update Profile
              </Link>
            </div>
          ) : (
            <div className="diet-planner__dashboard">
              {renderKeyMetrics()}
              {renderMacronutrients()}

              <div className="diet-planner__additional-info">
                {profile?.dietaryPreferences && (
                  <div className="diet-planner__info-card">
                    <h2 className="diet-planner__info-title">
                      Dietary Preferences
                    </h2>
                    <p className="diet-planner__info-text">
                      {profile.dietaryPreferences}
                    </p>
                  </div>
                )}

                {profile?.allergies && profile.allergies.length > 0 && (
                  <div className="diet-planner__info-card">
                    <h2 className="diet-planner__info-title">Allergies</h2>
                    <div className="diet-planner__allergies-grid">
                      {profile.allergies.map((allergy, index) => (
                        <div key={index} className="diet-planner__allergy-tag">
                          {allergy}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietPlanner;
