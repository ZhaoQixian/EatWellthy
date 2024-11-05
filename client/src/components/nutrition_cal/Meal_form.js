import React, { useState ,useCallback,useEffect} from 'react';
import axios from 'axios';
 

  


const MealForm = ({userId}) => {
  console.log('mfuserid',userId);
  // 初始化表单状态
  const [foodList, setFoodList] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
   
  const [formData, setFormData] = useState({
    meal_type: "",
    food_taken: "",
    portion: "",
    time: "",
    owner: userId,
  });

  const [foodOptions, setFoodOptions] = useState([]);
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };
  // load food options 
   useEffect(() => {
    const fetchFoodOptions = async () => {
      try {
        const body = {"owner": userId}
        const response = await axios.post("http://localhost:5050/nutrition/query_food",body);
        const foods = response.data.food_saved;   
        setFoodOptions(foods.map(food => food.name));  
      } catch (err) {
        console.error("Error fetching food options: ", err);
      }
    };

    fetchFoodOptions();  
  }, []);

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // if (name === 'portion' && value < 0) {
    //   setMessage({ text: "Portion size cannot be negative", type: "error" });
    //   return; // Do not update formData if value is negative
    // }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMealDelete = async (id) => {
    try {
       
      await axios.delete(`http://localhost:5050/nutrition/meal_delete/${id}`);
      setFoodList(foodList.filter(food => food.meal._id !== id));  
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };
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
  const handleMealQuery = async(e) => {
    e.preventDefault();
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
    if (formData.time === "" ) {
      showMessage("Valid date is required!", "error");
      return;  
    }
    try {
      console.log("formData",formData);
      const response = await axios.post("http://localhost:5050/nutrition/query_meal", formData );
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
        showMessage("No meals found for this time period. Please try again.","error");
        setFoodList([]);
      }

    } catch (err) {
      setFoodList([]);
      console.error("Error fetching food options: ", err);
      showMessage("No meals found for this time period. Please try again.","error");
    }
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    
    const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
    e.preventDefault();
    console.log("Form Data: ", formData);
    if (formData.portion < 0) {
      showMessage("Portion size cannot be negative.", "error");
      return;  
    }

    //const body = JSON.stringify({ owner,meal_type, food_taken, portion, time });
    
        try {
          const dataToSend = {
            ...formData,
            owner: userId,   
          };
            const res = await axios.post(
                "http://localhost:5050/nutrition/log_meal",
                dataToSend, //  
                config
              );
          //nutrition_taken = res;
          //setMessage("Meal logged successfully!");
          console.log(res);
          handleMealQuery(e);
          showMessage("Meal logged successfully!");
      
  }catch (err) {
    console.error("Food addition Error: ", err);
    //nutrition_taken = err;
    //document.getElementById("food_meal_had").value=err;
     
    showMessage("Failed to log meal. Please try again.");
  };
  }
  
  return (
    <div>
      {message.text && (
        <div
          className={`message ${message.type === "error" ? "error" : "success"}`}
        >
          {message.text}
        </div>
      )}
    <form onSubmit={handleSubmit} id = 'add_meal_form' class = 'add_meal_form'>
      {/* Time Selection */}
      <label>
        Time:
        <input
          type="datetime-local"
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          required 
        />
      </label>
      <br />
      {/* 用餐时间选择框 */}
      <label>
        Meal Type:
        <select
          name="meal_type"
          value={formData.meal_type}
          onChange={handleInputChange}
            
        >
          <option value="">-- Select a meal type --</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snacks">Snacks</option>
          <option value="others">Others</option>
        </select>
      </label>
      <br />

      {/* 食物选择框，可以搜索 */}
      <label>
        Food Taken:
        <input
          list="food-options"
          name="food_taken"
          value={formData.food_taken}
          onChange={handleInputChange}
          placeholder="Search or type food"
        />
        <datalist id="food-options">
          {foodOptions.map(( name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </label>
      <br />
      {/* 份量输入框 */}
      <label>
        Portion Size:
        <input
          type="text"
          name="portion"
          value={formData.portion}
          onChange={handleInputChange}
          placeholder="Enter portion size"
        />
      </label>
      <br />

      <input type="hidden" name="owner" value={userId} />
      <button type="submit">Add</button>   
      <button onClick={handleMealQuery }>Query</button>
       
    </form> 
    <h2>What you took:</h2>
    <div style =  {{ overflowX: "auto", width: "100%" }}>
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
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
         
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
            <td>
              <button onClick={() => handleMealDelete(food.meal._id)}>Delete</button>
            </td>
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
    </div>
  </div>
  );
};

export default MealForm;
