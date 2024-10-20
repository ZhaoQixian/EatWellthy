import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodStored = () => {
  const [foodList, setFoodList] = useState([]);

   
   

  useEffect(() => {
    const fetchFoodOptions = async () => {
      try {
        const response = await axios.post("http://localhost:5050/nutrition/query_food");
        console.log(response.data);  
        if (response.data.success) {
          setFoodList(response.data.food_saved);
        }
      } catch (err) {
        console.error("Error fetching food options: ", err);
      }
    };
  
    fetchFoodOptions();  
  }, []);
  

  
  const handleDelete = async (id) => {
    try {
       
      await axios.delete(`http://localhost:5050/nutrition/delete/${id}`);
      setFoodList(foodList.filter(food => food._id !== id));  
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  return (
    <div>
      <h2>Food List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
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
            <tr key={food._id}>
              <td>{food.name}</td>
              <td>{food.energy}</td>
              <td>{food.fat}</td>
              <td>{food.sugar}</td>
              <td>{food.fiber}</td>
              <td>{food.protein}</td>
              <td>{food.sodium}</td>
              <td>{food.vitamin_c}</td>
              <td>{food.calcium}</td>
              <td>{food.iron}</td>
              <td>
                <button onClick={() => handleDelete(food._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodStored;
