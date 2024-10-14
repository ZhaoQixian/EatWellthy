import { ADD_NUTRITION_INFOR_SUCCESS } from "../actions/types";

const initialState = [];

export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case ADD_NUTRITION_INFOR_SUCCESS:
        return [...state, payload];
       
      default:
        return state;
    }
  }
  