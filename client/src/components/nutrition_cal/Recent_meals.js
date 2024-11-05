import React, { useState ,useCallback,useEffect,Component} from 'react';
import axios from 'axios';
 

 


const RecentMeals = ({userId }) => {
   
  console.log('mfuserid',userId);
  // intialize the state
  const [foodList, setFoodList] = useState([]);
  const [foodList2, setFoodList2] = useState([]);
  const [foodList3, setFoodList3] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const getYesterdayDate = () => {
    const date1 = new Date( );
    console.log('date1',date1);
    const yesterday = new Date(date1);
    yesterday.setDate(yesterday.getDate() -1);
    console.log('yesterday',yesterday);
    return yesterday ;  
  };
  

  const yesterdayMeal = JSON.stringify({
    "meal_type":'',
    "owner": userId,
    "time":getYesterdayDate(),
  });
    
  const getTwoDayBeforeDate = () => {
    const date2 = new Date( );
    console.log('date2',date2);
    const twoDaysBefore = new Date(date2);
    twoDaysBefore.setDate(twoDaysBefore.getDate() -2);
     
    return twoDaysBefore ;  
  };
  

  const twoDaysBeforeMeal = JSON.stringify({
    "meal_type":'',
    "owner": userId,
    "time":getTwoDayBeforeDate(),
  });

  const getThreeDayBeforeDate = () => {
    const date3 = new Date( );
    console.log('date3',date3);
    const threeDaysBefore = new Date(date3);
    threeDaysBefore.setDate(threeDaysBefore.getDate() -3);
     
    return threeDaysBefore ;  
  };
  

  const threeDaysBeforeMeal = JSON.stringify({
    "meal_type":'',
    "owner": userId,
    "time":getThreeDayBeforeDate(),
  });
   
  const [nutritionTotals, setNutritionTotals] = useState({
    energy: 0,
    fat: 0,
    sugar: 0,
    fiber: 0,
    protein: 0,
    sodium: 0,
    vitamin_c: 0,
    calcium: 0,
    iron: 0,
  });
  const [nutritionTotals2, setNutritionTotals2] = useState({
    energy: 0,
    fat: 0,
    sugar: 0,
    fiber: 0,
    protein: 0,
    sodium: 0,
    vitamin_c: 0,
    calcium: 0,
    iron: 0,
  });
  const [nutritionTotals3, setNutritionTotals3] = useState({
    energy: 0,
    fat: 0,
    sugar: 0,
    fiber: 0,
    protein: 0,
    sodium: 0,
    vitamin_c: 0,
    calcium: 0,
    iron: 0,
  });
  const handleMealQuery = async(e) => {
     
    let newNutritionTotals = {
      energy: 0,
      fat: 0,
      sugar: 0,
      fiber: 0,
      protein: 0,
      sodium: 0,
      vitamin_c: 0,
      calcium: 0,
      iron: 0,
    };
    setNutritionTotals(newNutritionTotals);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
     
    try {
      //console.log(formData);
      const response = await axios.post("http://localhost:5050/nutrition/query_meal", yesterdayMeal, config);
      console.log(response.data);  
      if (response.data.success) {
        const meals = response.data.meals;
        setFoodList(response.data.meals);
        
        meals.forEach(({ meal, nutrition }) => {
          if (nutrition !== "No nutrition data found for this meal.") {
            newNutritionTotals.energy += nutrition[0].energy * meal.portion || 0;
            newNutritionTotals.fat += nutrition[0].fat * meal.portion || 0;
            newNutritionTotals.sugar += nutrition[0].sugar * meal.portion || 0;
            newNutritionTotals.fiber += nutrition[0].fiber * meal.portion || 0;
            newNutritionTotals.protein += nutrition[0].protein * meal.portion || 0;
            newNutritionTotals.sodium += nutrition[0].sodium * meal.portion || 0;
            newNutritionTotals.vitamin_c += nutrition[0].vitamin_c * meal.portion || 0;
            newNutritionTotals.calcium += nutrition[0].calcium * meal.portion || 0;
            newNutritionTotals.iron += nutrition[0].iron * meal.portion || 0;
          }
          else{
            window.alert("No nutrition data found for this meal.");
          }
        });
        setNutritionTotals(newNutritionTotals);
        console.log("Total Nutrition Data:", nutritionTotals);

        
      }else{
        console.log("No meals found for this time period.");
        //showMessage("No meals found for this time period. Please try again.","error");
        setFoodList([]);
      }

    } catch (err) {
      setFoodList([]);
      console.error("Error fetching food options: ", err);
      //showMessage("No meals found for this time period. Please try again.","error");
    }
  };

  const handleMealQuery2 = async(e) => {
     
    let newNutritionTotals = {
      energy: 0,
      fat: 0,
      sugar: 0,
      fiber: 0,
      protein: 0,
      sodium: 0,
      vitamin_c: 0,
      calcium: 0,
      iron: 0,
    };
    setNutritionTotals2(newNutritionTotals);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
     
    try {
      //console.log(formData);
      const response = await axios.post("http://localhost:5050/nutrition/query_meal", twoDaysBeforeMeal, config);
      console.log(response.data);  
      if (response.data.success) {
        const meals = response.data.meals;
        setFoodList2(response.data.meals);
        
        meals.forEach(({ meal, nutrition }) => {
          if (nutrition !== "No nutrition data found for this meal.") {
            newNutritionTotals.energy += nutrition[0].energy * meal.portion || 0;
            newNutritionTotals.fat += nutrition[0].fat * meal.portion || 0;
            newNutritionTotals.sugar += nutrition[0].sugar * meal.portion || 0;
            newNutritionTotals.fiber += nutrition[0].fiber * meal.portion || 0;
            newNutritionTotals.protein += nutrition[0].protein * meal.portion || 0;
            newNutritionTotals.sodium += nutrition[0].sodium * meal.portion || 0;
            newNutritionTotals.vitamin_c += nutrition[0].vitamin_c * meal.portion || 0;
            newNutritionTotals.calcium += nutrition[0].calcium * meal.portion || 0;
            newNutritionTotals.iron += nutrition[0].iron * meal.portion || 0;
          }
          else{
            window.alert("No nutrition data found for this meal.");
          }
        });
        setNutritionTotals2(newNutritionTotals);
        console.log("Total Nutrition Data:", nutritionTotals2);

        
      }else{
        console.log("No meals found for this time period.");
        //showMessage("No meals found for this time period. Please try again.","error");
        setFoodList([]);
      }

    } catch (err) {
      setFoodList([]);
      console.error("Error fetching food options: ", err);
      //showMessage("No meals found for this time period. Please try again.","error");
    }
  };

  const handleMealQuery3 = async(e) => {
     
    let newNutritionTotals = {
      energy: 0,
      fat: 0,
      sugar: 0,
      fiber: 0,
      protein: 0,
      sodium: 0,
      vitamin_c: 0,
      calcium: 0,
      iron: 0,
    };
    setNutritionTotals3(newNutritionTotals);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
     
    try {
      //console.log(formData);
      const response = await axios.post("http://localhost:5050/nutrition/query_meal", threeDaysBeforeMeal, config);
      console.log(response.data);  
      if (response.data.success) {
        const meals = response.data.meals;
        setFoodList3(response.data.meals);
        
        meals.forEach(({ meal, nutrition }) => {
          if (nutrition !== "No nutrition data found for this meal.") {
            newNutritionTotals.energy += nutrition[0].energy * meal.portion || 0;
            newNutritionTotals.fat += nutrition[0].fat * meal.portion || 0;
            newNutritionTotals.sugar += nutrition[0].sugar * meal.portion || 0;
            newNutritionTotals.fiber += nutrition[0].fiber * meal.portion || 0;
            newNutritionTotals.protein += nutrition[0].protein * meal.portion || 0;
            newNutritionTotals.sodium += nutrition[0].sodium * meal.portion || 0;
            newNutritionTotals.vitamin_c += nutrition[0].vitamin_c * meal.portion || 0;
            newNutritionTotals.calcium += nutrition[0].calcium * meal.portion || 0;
            newNutritionTotals.iron += nutrition[0].iron * meal.portion || 0;
          }
          else{
            window.alert("No nutrition data found for this meal.");
          }
        });
        setNutritionTotals3(newNutritionTotals);
        console.log("Total Nutrition Data:", nutritionTotals3);

        
      }else{
        console.log("No meals found for this time period.");
        //showMessage("No meals found for this time period. Please try again.","error");
        setFoodList([]);
      }

    } catch (err) {
      setFoodList([]);
      console.error("Error fetching food options: ", err);
      //showMessage("No meals found for this time period. Please try again.","error");
    }
  };

  useEffect(() => {
    handleMealQuery();
    handleMealQuery2();
    handleMealQuery3();
    
  } , [userId ]);
  
  return (
    <div>
      {message.text && (
        <div
          className={`message ${message.type === "error" ? "error" : "success"}`}
        >
          {message.text}
        </div>
      )}
    
    <h2>What you took yesterday:</h2>
    <table>
      <thead>
        <tr>
          <th>Meal Type</th>
          <th>Food</th>
          <th>Amount</th>
          <th>Energy(kcal)</th>
          <th>Fat(g)</th>
          <th>Sugar(g)</th>
          <th>Fiber(g)</th>
          <th>Protein(g)</th>
          <th>Sodium(mg)</th>
          <th>Vitamin C(mg)</th>
          <th>Calcium(mg)</th>
          <th>Iron(mg)</th>
           
        </tr>
      </thead>
      <tbody>
        {!foodList.length && <tr> <td colSpan='13'> No meals found for this time period.</td></tr>} 
        {foodList.map(food => (
          <tr key={food.meal._id}>
            <td>{food.meal.meal_type}</td>
            <td>{food.meal.food_taken}</td>
            <td>{food.meal.portion}</td>
            <td>{food.meal.portion * food.nutrition[0].energy}</td>
            <td>{food.meal.portion * food.nutrition[0].fat}</td>
            <td>{food.meal.portion * food.nutrition[0].sugar}</td>
            <td>{food.meal.portion * food.nutrition[0].fiber}</td>
            <td>{food.meal.portion * food.nutrition[0].protein}</td>
            <td>{food.meal.portion * food.nutrition[0].sodium}</td>
            <td>{food.meal.portion * food.nutrition[0].vitamin_c}</td>
            <td>{food.meal.portion * food.nutrition[0].calcium}</td>
            <td>{food.meal.portion * food.nutrition[0].iron}</td>
             
          </tr>
        ))}
        <tr>
            <td colSpan= {3}>Total Nutrition:</td>
             
            <td>{nutritionTotals.energy}</td>
            <td>{nutritionTotals.fat}</td>
            <td>{nutritionTotals.sugar}</td>
            <td>{nutritionTotals.fiber}</td>
            <td>{nutritionTotals.protein}</td>
            <td>{nutritionTotals.sodium}</td>
            <td>{nutritionTotals.vitamin_c}</td>
            <td>{nutritionTotals.calcium}</td>
            <td>{nutritionTotals.iron}</td>
            <td>
               
            </td>
          </tr>
      </tbody>
    </table>
    <h2>What you took the day before yesterday:</h2>
    <table>
      <thead>
        <tr>
          <th>Meal Type</th>
          <th>Food</th>
          <th>Amount</th>
          <th>Energy(kcal)</th>
          <th>Fat(g)</th>
          <th>Sugar(g)</th>
          <th>Fiber(g)</th>
          <th>Protein(g)</th>
          <th>Sodium(mg)</th>
          <th>Vitamin C(mg)</th>
          <th>Calcium(mg)</th>
          <th>Iron(mg)</th>
           
        </tr>
      </thead>
      <tbody>
        {!foodList2.length && <tr> <td colSpan='13'> No meals found for this time period.</td></tr>} 
        {foodList2.map(food => (
          <tr key={food.meal._id}>
            <td>{food.meal.meal_type}</td>
            <td>{food.meal.food_taken}</td>
            <td>{food.meal.portion}</td>
            <td>{food.meal.portion * food.nutrition[0].energy}</td>
            <td>{food.meal.portion * food.nutrition[0].fat}</td>
            <td>{food.meal.portion * food.nutrition[0].sugar}</td>
            <td>{food.meal.portion * food.nutrition[0].fiber}</td>
            <td>{food.meal.portion * food.nutrition[0].protein}</td>
            <td>{food.meal.portion * food.nutrition[0].sodium}</td>
            <td>{food.meal.portion * food.nutrition[0].vitamin_c}</td>
            <td>{food.meal.portion * food.nutrition[0].calcium}</td>
            <td>{food.meal.portion * food.nutrition[0].iron}</td>
             
          </tr>
        ))}
        <tr>
            <td colSpan= {3}>Total Nutrition:</td>
             
            <td>{nutritionTotals2.energy}</td>
            <td>{nutritionTotals2.fat}</td>
            <td>{nutritionTotals2.sugar}</td>
            <td>{nutritionTotals2.fiber}</td>
            <td>{nutritionTotals2.protein}</td>
            <td>{nutritionTotals2.sodium}</td>
            <td>{nutritionTotals2.vitamin_c}</td>
            <td>{nutritionTotals2.calcium}</td>
            <td>{nutritionTotals2.iron}</td>
            <td>
               
            </td>
          </tr>
      </tbody>
    </table>
    <h2>What you took the day three days before:</h2>
    <table>
      <thead>
        <tr>
          <th>Meal Type</th>
          <th>Food</th>
          <th>Amount</th>
          <th>Energy(kcal)</th>
          <th>Fat(g)</th>
          <th>Sugar(g)</th>
          <th>Fiber(g)</th>
          <th>Protein(g)</th>
          <th>Sodium(mg)</th>
          <th>Vitamin C(mg)</th>
          <th>Calcium(mg)</th>
          <th>Iron(mg)</th>
           
        </tr>
      </thead>
      <tbody>
        {!foodList3.length && <tr> <td colSpan='13'> No meals found for this time period.</td></tr>} 
        {foodList3.map(food => (
          <tr key={food.meal._id}>
            <td>{food.meal.meal_type}</td>
            <td>{food.meal.food_taken}</td>
            <td>{food.meal.portion}</td>
            <td>{food.meal.portion * food.nutrition[0].energy}</td>
            <td>{food.meal.portion * food.nutrition[0].fat}</td>
            <td>{food.meal.portion * food.nutrition[0].sugar}</td>
            <td>{food.meal.portion * food.nutrition[0].fiber}</td>
            <td>{food.meal.portion * food.nutrition[0].protein}</td>
            <td>{food.meal.portion * food.nutrition[0].sodium}</td>
            <td>{food.meal.portion * food.nutrition[0].vitamin_c}</td>
            <td>{food.meal.portion * food.nutrition[0].calcium}</td>
            <td>{food.meal.portion * food.nutrition[0].iron}</td>
             
          </tr>
        ))}
        <tr>
            <td colSpan= {3}>Total Nutrition:</td>
             
            <td>{nutritionTotals3.energy}</td>
            <td>{nutritionTotals3.fat}</td>
            <td>{nutritionTotals3.sugar}</td>
            <td>{nutritionTotals3.fiber}</td>
            <td>{nutritionTotals3.protein}</td>
            <td>{nutritionTotals3.sodium}</td>
            <td>{nutritionTotals3.vitamin_c}</td>
            <td>{nutritionTotals3.calcium}</td>
            <td>{nutritionTotals3.iron}</td>
            <td>
               
            </td>
          </tr>
      </tbody>
    </table>
  </div>
  );
};

export default RecentMeals;
