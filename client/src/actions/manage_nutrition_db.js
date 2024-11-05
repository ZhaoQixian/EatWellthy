import { 
  ADD_NUTRITION_INFOR_SUCCESS,
  ADD_NUTRITION_INFOR_FAIL 
} from "../actions/types";

const initialState = {
  foods: [],
  loading: true,
  error: null
};

export default function nutritionReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case 'FETCH_FOODS_SUCCESS':
      return {
        ...state,
        foods: payload,
        loading: false
      };
    case ADD_NUTRITION_INFOR_SUCCESS:
      return {
        ...state,
        foods: [...state.foods, payload],
        loading: false
      };
    case 'DELETE_FOOD_SUCCESS':
      return {
        ...state,
        foods: state.foods.filter(food => food._id !== payload),
        loading: false
      };
    case 'FETCH_FOODS_FAIL':
    case 'DELETE_FOOD_FAIL':
    case ADD_NUTRITION_INFOR_FAIL:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}