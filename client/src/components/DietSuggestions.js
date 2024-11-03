import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../actions/Profile";
import { useDispatch, useSelector } from "react-redux";

const DietSuggestions = () => {
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
        const calories =
          calculatedBMR *
          activityMultipliers[profile.activityLevel || "sedentary"];
        setDailyCalories(Math.round(calories));
      }
    }
  }, [profile]);

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal weight";
    if (bmi < 29.9) return "Overweight";
    return "Obese";
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

  const generateDietSuggestions = (bmiCategory, dietPlan) => {
    const suggestions = {
      Underweight: {
        maintenance: [
          { meal: "Breakfast", dish: "Avocado toast with eggs" },
          { meal: "Lunch", dish: "Quinoa salad with chickpeas and nuts" },
          {
            meal: "Dinner",
            dish: "Grilled chicken with sweet potatoes and veggies",
          },
        ],
        keto: [
          { meal: "Breakfast", dish: "Eggs with avocado and cheese" },
          { meal: "Lunch", dish: "Chicken caesar salad (no croutons)" },
          { meal: "Dinner", dish: "Salmon with spinach and cream sauce" },
        ],
        vegetarian: [
          { meal: "Breakfast", dish: "Oatmeal with almond butter and banana" },
          { meal: "Lunch", dish: "Lentil soup with whole-grain bread" },
          {
            meal: "Dinner",
            dish: "Stuffed bell peppers with quinoa and black beans",
          },
        ],
      },
      "Normal weight": {
        maintenance: [
          { meal: "Breakfast", dish: "Greek yogurt with granola and berries" },
          { meal: "Lunch", dish: "Turkey sandwich with mixed greens" },
          { meal: "Dinner", dish: "Grilled salmon with roasted vegetables" },
        ],
        keto: [
          {
            meal: "Breakfast",
            dish: "Scrambled eggs with sausage and spinach",
          },
          {
            meal: "Lunch",
            dish: "Lettuce wrap with turkey, avocado, and bacon",
          },
          { meal: "Dinner", dish: "Zucchini noodles with meatballs" },
        ],
        vegetarian: [
          {
            meal: "Breakfast",
            dish: "Smoothie with spinach, banana, and protein powder",
          },
          {
            meal: "Lunch",
            dish: "Vegetable stir-fry with tofu and brown rice",
          },
          {
            meal: "Dinner",
            dish: "Whole-wheat pasta with marinara and roasted veggies",
          },
        ],
      },
      Overweight: {
        weightloss: [
          { meal: "Breakfast", dish: "Chia pudding with berries" },
          { meal: "Lunch", dish: "Grilled chicken salad with vinaigrette" },
          { meal: "Dinner", dish: "Vegetable soup with a side salad" },
        ],
        keto: [
          { meal: "Breakfast", dish: "Keto smoothie with avocado and spinach" },
          { meal: "Lunch", dish: "Grilled chicken with cauliflower rice" },
          { meal: "Dinner", dish: "Stuffed zucchini boats with ground turkey" },
        ],
        vegetarian: [
          {
            meal: "Breakfast",
            dish: "Overnight oats with chia seeds and berries",
          },
          { meal: "Lunch", dish: "Chickpea salad with mixed greens" },
          { meal: "Dinner", dish: "Vegetable stir-fry with tofu" },
        ],
      },
      Obese: {
        weightloss: [
          {
            meal: "Breakfast",
            dish: "Smoothie with greens and protein powder",
          },
          {
            meal: "Lunch",
            dish: "Cauliflower rice bowl with grilled vegetables",
          },
          { meal: "Dinner", dish: "Baked salmon with steamed broccoli" },
        ],
        keto: [
          { meal: "Breakfast", dish: "Egg muffins with spinach and cheese" },
          { meal: "Lunch", dish: "Avocado chicken salad" },
          { meal: "Dinner", dish: "Grilled steak with a side of asparagus" },
        ],
        vegetarian: [
          {
            meal: "Breakfast",
            dish: "Smoothie with almond milk and chia seeds",
          },
          { meal: "Lunch", dish: "Stuffed bell peppers with lentils" },
          { meal: "Dinner", dish: "Roasted vegetable quinoa bowl" },
        ],
      },
    };

    return suggestions[bmiCategory][dietPlan] || [];
  };

  const bmiCategory = getBMICategory(bmi);
  const dietPlan = profile?.dietPlan || "maintenance";
  const suggestions = generateDietSuggestions(bmiCategory, dietPlan);

  return (
    <div className="diet-suggestions">
      {loading ? (
        <p>Loading...</p>
      ) : suggestions.length > 0 ? (
        suggestions.map((suggestion, index) => (
          <div key={index}>
            <p>
              <strong>{suggestion.meal}:</strong> {suggestion.dish}
            </p>
          </div>
        ))
      ) : (
        <p>No suggestions available. Please update your profile.</p>
      )}
    </div>
  );
};

export default DietSuggestions;
