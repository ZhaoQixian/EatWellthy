import React, { useState ,useCallback} from 'react';
import MealForm from './nutrition_cal/Meal_form';
import FoodStored from './nutrition_cal/food_stored';
import "./NutritionCalculator.css";
import axios from 'axios';
import { connect } from "react-redux";
import {useParams} from 'react-router-dom';

const NutritionCalculator = () => {
  // 使用状态管理当前选择的表单类型
  const [formType, setFormType] = useState(null);
  let { username } = useParams();
  console.log(username);
  const add_nutrition_infor2 = useCallback( 
    async(dispatch) => {
      dispatch.preventDefault();
      console.log("Called add_nutrition_infor2");
      // get the values from form
      const name = document.getElementById("name").value || null;
      const owner = username;
      const energy = document.getElementById("food_energy").value || null;
      const  fat = document.getElementById("food_fat").value || null;
      const sugar = document.getElementById("food_sugar").value || null;
      const fiber = document.getElementById("food_fiber").value || null;
      const protein = document.getElementById("food_protein").value || null;
      const sodium = document.getElementById("food_sodium").value || null;
      const vitamin_c = document.getElementById("food_vc").value || null;
      const calcium =document.getElementById("food_calcium").value || null;
      const iron = document.getElementById("food_iron").value || null;
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ name, owner, energy, fat, 
        sugar, fiber, protein, sodium, vitamin_c, calcium, iron });

      try {
        const res = await axios.post(
          "http://localhost:5050/nutrition/add",
          body,
          config
        );
        console.log(res);
      } catch (err) {
        console.error("Food addition Error: ", err); 
      }

    }
  )
  ;

  return (
    <div style={{paddingTop : "4rem",paddingLeft : "1.2rem" , paddingRight:"1.2rem"}}>
      <h1>NutritionCalculator</h1>
      <p>Hi,{ username} ! Welcome to the NutritionCalculator page!</p>
    
      <h3>Select an option:</h3>
      <div id="food_meal_buttons" className="select">
        <li id="add_food" onClick={() => setFormType('addFood')}>
          Add/Update a Food
        </li>

        <li id="add_meal" onClick={() => setFormType('addMeal')}>
          Add/Update a Meal
        </li>

        <li id="remove" onClick={() => setFormType('remove')}>
          Remove a Food/Meal
        </li>
      </div>

      <div id="food_meal_forms">
        {formType === 'addFood' && (
          <div className="add_food_form">
            <form id="add_food_form" onSubmit={add_nutrition_infor2}>
              <h3>Provide the following data for your food to add it to the registry:</h3>
              <p>Name: <input type="text" id="name" name='name' autoComplete="off" /></p>
              <p>Unit of Measurement: <input type="text" id="food_measurement_unit" autoComplete="off" /></p>
              <p>Serving Size: <input type="text" id="food_serving_size" autoComplete="off" /></p>
              <p>Energy (in kcal): <input type="text" id="food_energy" autoComplete="off" /></p>
              <p>Fat (in grams): <input type="text" id="food_fat" autoComplete="off" /></p>
              <p>Sugar (in grams): <input type="text" id="food_sugar" autoComplete="off" /></p>
              <p>Fiber (in grams): <input type="text" id="food_fiber" autoComplete="off" /></p>
              <p>Protein (in grams): <input type="text" id="food_protein" autoComplete="off" /></p>
              <p>Sodium (in milligrams): <input type="text" id="food_sodium" autoComplete="off" /></p>
              <p>Vitamin_c (in milligrams): <input type="text" id="food_vc" autoComplete="off" /></p>
              <p>Calcium (in milligrams): <input type="text" id="food_calcium" autoComplete="off" /></p>
              <p>Iron (in milligrams): <input type="text" id="food_iron" autoComplete="off" /></p>

              <div className="add_food_bottom_buttons">
                <button className="submit" type="submit" onClick={add_nutrition_infor2}>Submit</button>
                <button className="quit" type="reset">Quit</button>
              </div>
            </form>
          </div>
        )}

        {formType === 'addMeal' && (
          <MealForm username = {username}/>
        )}

        {formType === 'remove' && (
          <FoodStored/>
        )}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default NutritionCalculator;
 
