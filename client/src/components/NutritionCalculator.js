import React from 'react';
import { add_nutrition_infor } from "../actions/manage_nutrition_db"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from 'axios';
import SelectFoodComponent from './nutrition_cal/select_food_meal';
import "./NutritionCalculator.css";


var nutrition_taken = '222';
const new_food_Submit = async (e) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log("Form data submitting");
  console.log("Form data", e);
  e.preventDefault();  

  // get the values from form
  const name = document.getElementById("name").value || null;
  const owner = document.getElementById("food_measurement_unit").value || null;
  const energy = document.getElementById("food_serving_size").value || null;
  const  fat = document.getElementById("food_calories").value || null;
  const sugar = document.getElementById("food_fat").value || null;
  const fiber = document.getElementById("food_carbs").value || null;
  const protein = document.getElementById("food_protein").value || null;
  const sodium = 0.0;
  const vitamin_c = 0.0;
  const calcium = 0.0;
  const iron = 0.0;
  // pass the data
  const body = JSON.stringify({ name, owner, energy, fat, 
    sugar, fiber, protein, sodium, vitamin_c, calcium, iron });

    try {
      const res = await axios.post(
        "http://localhost:5050/nutrition/add",
        body,
        config
      );
      //nutrition_taken = res;
      console.log(res);
  

  // await add_nutrition_infor({
  //   name,
  //   measurementUnit,
  //   servingSize,
  //   calories,
  //   fat,
  //   carbs,
  //   protein,
  //   temp1,
  //   temp2,
  //   temp3,
  //   temp4
  // });
  // console.log("new_food_submit is called");
  }catch (err) {
    console.error("Food addition Error: ", err);
    //nutrition_taken = err;
    document.getElementById("food_meal_had").value=err;
  }
};



const NutritionCalculator = () => {
  return (
    <div style={{paddingTop : "4rem",paddingLeft : "1.2rem" , paddingRight:"1.2rem"}}>
      <h1>NutritionCalculator</h1>
      <p>Welcome to the NutritionCalculator page!</p>
    
    <h3>Select an option:</h3>
    <div id="food_meal_buttons" class="select">
      <li id="add_food" >
        <Link to="/add-food">Add/Update a Food</Link>
      </li>

      <li id="add_meal">
        <Link to="/log-meal">Add/Update a Meal</Link>
      </li>

      <li id="remove">
        <Link to="/remove-food">Remove a Food/Meal</Link>
      </li>
    </div>

    <div id="food_meal_forms" >
      <div class="add_food_form">
        <form id="add_food_form" onSubmit={new_food_Submit}>
        <h3>Provide the following data for your food to add it to the registry:<br/><br/>(If the name of the food that you enter already exists, that food will be updated) </h3>

            <h4><span class="error"></span></h4>
            <p>Name: <input type="text" id="name" autocomplete="off" /></p>
<p>Unit of Measurement: <input type="text" id="food_measurement_unit" autocomplete="off" /></p>
<p>Serving Size: <input type="text" id="food_serving_size" autocomplete="off" /></p>
<p>Calories: <input type="text" id="food_calories" autocomplete="off" /></p>
<p>Fat (in grams): <input type="text" id="food_fat" autocomplete="off" /></p>
<p>Carbs (in grams): <input type="text" id="food_carbs" autocomplete="off" /></p>
<p>Protein (in grams): <input type="text" id="food_protein" autocomplete="off" /></p>


            <div id="add_food_bottom_buttons" class="add_food_bottom_buttons">
                <button class="submit" type="submit"   >Submit</button>
                <button class="quit" type="reset" onclick="closeForm(addFoodForm)">Quit</button>
            </div>
        </form>
        </div>

        <form id="add_meal_form">
            <h3>Provide the following data for your meal to add it to the registry:</h3>
            <br></br>
            <h5>(If the name of the meal that you enter already exists, that meal will be updated)</h5>
            <h4><span class="error"></span></h4>
            <p>Name:  <input type="text" id="meal_name" autocomplete="off"/></p>
            <div id="ingredients">
                <div class="ingredient_and_serving">
                    <p>Ingredient:  <input type="text" class="meal_ingredients" autocomplete="off"/></p>  
                    <p>Servings:  <input type="text" class="meal_serving_sizes" autocomplete="off"/></p>
                </div>
            </div>

            <div id="add_remove_buttons">
                <button id="add_ingredient" type="button" onclick="addIngredient()">Add Ingredient</button>
                <button id="remove_ingredient" type="button" onclick="removeIngredient()">Remove Ingredient</button>
            </div>

            <div id="add_meal_bottom_buttons">
                <button class="submit" type="button" onclick="processForm(addMealForm)">Submit</button>
                <button class="quit" type="reset" onclick="closeForm(addMealForm)">Quit</button>
                
            </div>
        </form>

        <form id="remove_form">
            <h3>Enter the name of the food/meal you would like to delete from the registry:</h3>
            <h4><span class="error"></span></h4>
            <p>Name: <input type="text" id="remove_name" autocomplete="off"/></p>

            <div id="remove_bottom_buttons">
                <button class="submit" type="button" onclick="processForm(removeForm)">Submit</button>
                <button class="quit" type="reset" onclick="closeForm(removeForm)">Quit</button>
            </div>
        </form>
        
        <div id="calculate_nutrition">
            <h3>Enter the name of the food/meal you just had:</h3>
            
            <h4><span class="error"></span></h4>
            <SelectFoodComponent/>

            <p>Name: <input type="text" id="food_meal_had" autocomplete="off" value={nutrition_taken}/></p>

             
        </div>

        <form action=""></form>
        <form action=""></form>
    </div>
    </div>
  );
};

export default NutritionCalculator;
