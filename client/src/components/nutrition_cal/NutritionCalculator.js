import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFoods, deleteFood, updateFood, add_nutrition_infor } from '../../actions/nutrition_database';
import MealForm from './Meal_form';
import RecentMeals from './Recent_meals';
import FoodStored from './food_stored';
import "./NutritionCalculator.css";

const NutritionCalculator = () => {
  const [formType, setFormType] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editingFood, setEditingFood] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { foods = [], loading, error } = useSelector((state) => state.nutrition || { foods: [], loading: true });
  const userId = user?._id;
  const username = user?.name;

  useEffect(() => {
    if (userId && formType === 'customisedFood') {
      dispatch(fetchFoods(userId));
    }
  }, [userId, formType, dispatch]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Do you want to delete this food item: ${name}?`)) {
      dispatch(deleteFood(id));
    }
  };

  const handleEdit = async (e, food) => {
    e.preventDefault();
    try {
      const updatedFood = {
        ...food,
        owner: userId,
        name: food.name,
        energy: parseFloat(document.getElementById(`food_energy_${food._id}`).value) || 0,
        fat: parseFloat(document.getElementById(`food_fat_${food._id}`).value) || 0,
        sugar: parseFloat(document.getElementById(`food_sugar_${food._id}`).value) || 0,
        fiber: parseFloat(document.getElementById(`food_fiber_${food._id}`).value) || 0,
        protein: parseFloat(document.getElementById(`food_protein_${food._id}`).value) || 0,
        sodium: parseFloat(document.getElementById(`food_sodium_${food._id}`).value) || 0,
        vitamin_c: parseFloat(document.getElementById(`food_vc_${food._id}`).value) || 0,
        calcium: parseFloat(document.getElementById(`food_calcium_${food._id}`).value) || 0,
        iron: parseFloat(document.getElementById(`food_iron_${food._id}`).value) || 0,
      };

      await dispatch(updateFood(food._id, updatedFood));
      setEditingFood(null);
      dispatch(fetchFoods(userId));
      showMessage("Food updated successfully");
      
    } catch (err) {
      console.error("Error in handleEdit:", err);
      showMessage("Error updating food: " + (err.response?.data?.msg || "Unknown error"), "error");
    }
  };

  

  const add_nutrition_infor2 = useCallback(async(e) => {
    e.preventDefault();
    
    const name = document.getElementById("name").value;
    const energy = document.getElementById("food_energy").value;
  
    if (!name || !energy) {
      showMessage("Name and Energy are required fields", "error");
      return;
    }
  
    const existingFood = foods.find(
      food => food.name.toLowerCase() === name.toLowerCase()
    );
    if (existingFood) {
      showMessage("A food with this name already exists in your list", "error");
      return;
    }
  
    const newFood = {
      name,
      owner: userId,
      energy,
      fat: document.getElementById("food_fat").value || 0,
      sugar: document.getElementById("food_sugar").value || 0,
      fiber: document.getElementById("food_fiber").value || 0,
      protein: document.getElementById("food_protein").value || 0,
      sodium: document.getElementById("food_sodium").value || 0,
      vitamin_c: document.getElementById("food_vc").value || 0,
      calcium: document.getElementById("food_calcium").value || 0,
      iron: document.getElementById("food_iron").value || 0,
    };
  
    try {
      await dispatch(add_nutrition_infor(newFood));
      e.target.reset();
      setShowAddForm(false);
      showMessage("Food added successfully");
      dispatch(fetchFoods(userId));
    } catch (err) {
      showMessage(err.response?.data?.msg || "Error adding food", "error");
    }
  }, [userId, dispatch, foods]);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  useEffect(() => {
    setFormType('recentMeal');
  }, []);

  const renderCustomFoodTable = () => (
    <div className="custom-foods-section">
      {!showAddForm && (
        <>
          <h3>My Custom Foods</h3>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="error-message">{error.msg || "Error loading foods"}</div>
          ) : (
            <>
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
                  {(!foods || foods.length === 0) ? (
                    <tr>
                      <td colSpan="11" style={{ textAlign: 'center' }}>No custom foods added yet</td>
                    </tr>
                  ) : (
                    foods.map(food => (
                      editingFood === food._id ? (
                        <tr key={food._id}>
                          <td>{food.name}</td>
                          <td><input type="number" id={`food_energy_${food._id}`} defaultValue={food.energy} /></td>
                          <td><input type="number" id={`food_fat_${food._id}`} defaultValue={food.fat} /></td>
                          <td><input type="number" id={`food_sugar_${food._id}`} defaultValue={food.sugar} /></td>
                          <td><input type="number" id={`food_fiber_${food._id}`} defaultValue={food.fiber} /></td>
                          <td><input type="number" id={`food_protein_${food._id}`} defaultValue={food.protein} /></td>
                          <td><input type="number" id={`food_sodium_${food._id}`} defaultValue={food.sodium} /></td>
                          <td><input type="number" id={`food_vc_${food._id}`} defaultValue={food.vitamin_c} /></td>
                          <td><input type="number" id={`food_calcium_${food._id}`} defaultValue={food.calcium} /></td>
                          <td><input type="number" id={`food_iron_${food._id}`} defaultValue={food.iron} /></td>
                          <td>
                            <button onClick={(e) => handleEdit(e, food)}>Save</button>
                            <button onClick={() => setEditingFood(null)}>Cancel</button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={food._id}>
                          <td>{food.name}</td>
                          <td>{Math.round(food.energy)}</td>
                          <td>{Math.round(food.fat)}</td>
                          <td>{Math.round(food.sugar)}</td>
                          <td>{Math.round(food.fiber)}</td>
                          <td>{Math.round(food.protein)}</td>
                          <td>{Math.round(food.sodium)}</td>
                          <td>{Math.round(food.vitamin_c)}</td>
                          <td>{Math.round(food.calcium)}</td>
                          <td>{Math.round(food.iron)}</td>
                          <td>
                            <button onClick={() => setEditingFood(food._id)}>Edit</button>
                            <button onClick={() => handleDelete(food._id, food.name)}>Delete</button>
                          </td>
                        </tr>
                      )
                    ))
                  )}
                </tbody>
              </table>

              <button className="toggle-add-form" onClick={() => setShowAddForm(true)}>
                Add New Custom Food
              </button>
            </>
          )}
        </>
      )}

      {showAddForm && (
        <div className="add_food_form">
          <form id="add_food_form" onSubmit={add_nutrition_infor2}>
            <h3>Add New Custom Food:</h3>
            <p>Name: <input type="text" id="name" name='name' autoComplete="off" required /></p>
            <p>Energy (in kcal): <input type="number" id="food_energy" autoComplete="off" required /></p>
            <p>Fat (in grams): <input type="number" id="food_fat" autoComplete="off" /></p>
            <p>Sugar (in grams): <input type="number" id="food_sugar" autoComplete="off" /></p>
            <p>Fiber (in grams): <input type="number" id="food_fiber" autoComplete="off" /></p>
            <p>Protein (in grams): <input type="number" id="food_protein" autoComplete="off" /></p>
            <p>Sodium (in milligrams): <input type="number" id="food_sodium" autoComplete="off" /></p>
            <p>Vitamin_c (in milligrams): <input type="number" id="food_vc" autoComplete="off" /></p>
            <p>Calcium (in milligrams): <input type="number" id="food_calcium" autoComplete="off" /></p>
            <p>Iron (in milligrams): <input type="number" id="food_iron" autoComplete="off" /></p>

            <div className="add_food_bottom_buttons">
              <button className="submit" type="submit">Submit</button>
              <button className="quit" type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button className="clear" type="reset">Clear</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h1>Nutrition Tracker</h1>

      <div id="food_meal_buttons" className="select">
        <li id="recent_meal" onClick={() => setFormType('recentMeal')}>
          Recent meals
        </li>
        <li id="tracker" onClick={() => setFormType('tracker')}>
          Tracker
        </li>
        <li id="history_search" onClick={() => setFormType('historySearch')}>
          History Search
        </li>
        <li id="customised_food" onClick={() => setFormType('customisedFood')}>
          Customised Food
        </li>
      </div>

      {message.text && (
        <div className={`message ${message.type === "error" ? "error" : "success"}`}>
          {message.text}
        </div>
      )}

      <div id="food_meal_forms">
        {formType === 'recentMeal' && (
          <RecentMeals userId={userId} />
        )}

        {formType === 'tracker' && (
          <MealForm userId={userId} mode="tracker" />
        )}

        {formType === 'historySearch' && (
          <MealForm userId={userId} mode="historySearch" />
        )}

        {formType === 'customisedFood' && (
          <div>
            {renderCustomFoodTable()}
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionCalculator;