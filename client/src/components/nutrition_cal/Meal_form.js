import React, { useState } from "react";
import axios from 'axios';

const MealForm = () => {
  // 初始化表单状态
  const [formData, setFormData] = useState({
    meal_type: "",
    food_taken: "",
    portion_size: "",
    time: "",
  });

  // 模拟的食物选项列表
  const foodOptions = [
    "Apple",
    "Banana",
    "Bread",
    "Chicken",
    "Rice",
    "Salad",
    "Steak",
    "Yogurt",
  ];

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    //const body = JSON.stringify({ owner,meal_type, food_taken, portion, time });
    
        try {
            const res = await axios.post(
                "http://localhost:5050/nutrition/log_meal",
                formData, //  
                config
              );
          //nutrition_taken = res;
          console.log(res);
      
  }catch (err) {
    console.error("Food addition Error: ", err);
    //nutrition_taken = err;
    document.getElementById("food_meal_had").value=err;
  };
  }
  return (
    <form onSubmit={handleSubmit}>
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
          {foodOptions.map((food, index) => (
            <option key={index} value={food} />
          ))}
        </datalist>
      </label>
      <br />

      {/* 份量输入框 */}
      <label>
        Portion Size:
        <input
          type="text"
          name="portion_size"
          value={formData.portion_size}
          onChange={handleInputChange}
          placeholder="Enter portion size"
        />
      </label>
      <br />

      {/* 时间选择框 */}
      <label>
        Time:
        <input
          type="datetime-local"
          name="time"
          value={formData.time}
          onChange={handleInputChange}
        />
      </label>
      <br />

      <button type="submit">Submit</button>
    </form>
  );
};

export default MealForm;
