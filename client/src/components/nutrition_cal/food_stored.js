import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect ,useSelector} from "react-redux";
 
 

const FoodStored = () => {
  const [foodList, setFoodList] = useState([]);
   
   
   
  const authState = useSelector((state) => state.auth);
  console.log('_authstate:',authState.user._id);
  const userId = authState.user._id;
   
  useEffect(() => {
    
    const fetchFoodOptions = async () => {
      try {
        
        const body = {"owner": userId}
        const response = await axios.post("http://localhost:5050/nutrition/query_food",body);
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
  

  
  const handleDelete = async (id, name) => {
    if (
      window.confirm(
        "Do you want to delete this food item: " + name + "?",
          

      )
    ){
        try {
       
          await axios.delete(`http://localhost:5050/nutrition/delete/${id}`);
          setFoodList(foodList.filter(food => food._id !== id));  
        } catch (error) {
          console.error("Error deleting food item:", error);
        }
       
  }};
    
 
    

  return (
    <div>
      <h2>Food List</h2>
      <h4>Please note that system owned data cannot be deleted</h4>
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
              <td>{food.owner != 'admin' ? <button onClick={() => handleDelete(food._id, food.name)}>Delete</button> : null}</td>
                
               
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodStored;
