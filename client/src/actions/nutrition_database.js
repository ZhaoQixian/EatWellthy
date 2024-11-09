import axios from "axios";
import appConfig from '../config';  // renamed to avoid conflict
import { setAlert } from "./alert";
import { 
  ADD_NUTRITION_INFOR_SUCCESS,
  ADD_NUTRITION_INFOR_FAIL,
  FETCH_FOODS_SUCCESS,
  FETCH_FOODS_FAIL,
  DELETE_FOOD_SUCCESS,
  DELETE_FOOD_FAIL,
  UPDATE_FOOD_SUCCESS,
  UPDATE_FOOD_FAIL
} from "./types";

// Fetch all foods for a user
export const fetchFoods = (userId) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${appConfig.backendUrl}/nutrition/query_food`, 
      { owner: userId }
    );
    
    dispatch({
      type: FETCH_FOODS_SUCCESS,
      payload: response.data.food_saved
    });
  } catch (err) {
    console.error("Error fetching foods:", err);
    dispatch({
      type: FETCH_FOODS_FAIL,
      payload: { msg: err.response?.data?.msg || "Error fetching foods" }
    });
    dispatch(setAlert("Error loading food data", "danger"));
  }
};

// Add new food
export const add_nutrition_infor = (nutritionData) => async (dispatch) => {
  const axiosConfig = {  // renamed from config
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post(
      `${appConfig.backendUrl}/nutrition/add`,
      nutritionData,
      axiosConfig
    );

    dispatch({
      type: ADD_NUTRITION_INFOR_SUCCESS,
      payload: res.data
    });

    dispatch(setAlert("Food added successfully", "success"));
  } catch (err) {
    console.error("Food addition Error: ", err);
    dispatch({
      type: ADD_NUTRITION_INFOR_FAIL,
      payload: { msg: err.response?.data?.msg || "Error adding food" }
    });
    dispatch(setAlert(err.response?.data?.msg || "Error adding food", "danger"));
  }
};

// Delete food
export const deleteFood = (id) => async (dispatch) => {
  try {
    await axios.delete(`${appConfig.backendUrl}/nutrition/delete/${id}`);
    
    dispatch({
      type: DELETE_FOOD_SUCCESS,
      payload: id
    });
    
    dispatch(setAlert("Food deleted successfully", "success"));
  } catch (err) {
    console.error("Error deleting food:", err);
    dispatch({
      type: DELETE_FOOD_FAIL,
      payload: { msg: err.response?.data?.msg || "Error deleting food" }
    });
    dispatch(setAlert("Error deleting food", "danger"));
  }
};

// Update food
export const updateFood = (id, foodData) => async (dispatch) => {
    try {
      const axiosConfig = {  // renamed from config
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      console.log("Sending update request with:", {
        id,
        foodData
      });
  
      const res = await axios.put(
        `${appConfig.backendUrl}/nutrition/update/${id}`,
        foodData,
        axiosConfig
      );
  
      dispatch({
        type: UPDATE_FOOD_SUCCESS,
        payload: { id, food: res.data }
      });
  
      dispatch(setAlert("Food updated successfully", "success"));
      return res.data;
  
    } catch (err) {
      console.error("Update food error:", err.response?.data);
      dispatch({
        type: UPDATE_FOOD_FAIL,
        payload: { msg: err.response?.data?.msg || "Error updating food" }
      });
      dispatch(setAlert("Error updating food", "danger"));
      throw err;
    }
};