import { 
  ADD_NUTRITION_INFOR_SUCCESS,
  ADD_NUTRITION_INFOR_FAIL,
  FETCH_FOODS_SUCCESS,
  FETCH_FOODS_FAIL,
  DELETE_FOOD_SUCCESS,
  DELETE_FOOD_FAIL,
  UPDATE_FOOD_SUCCESS,
  UPDATE_FOOD_FAIL
} from "../actions/types";

const initialState = {
  foods: [],  // Initialize as empty array
  loading: true,
  error: null
};

export default function nutritionReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_FOODS_SUCCESS:
      return {
        ...state,
        foods: payload,
        loading: false,
        error: null
      };

    case ADD_NUTRITION_INFOR_SUCCESS:
      return {
        ...state,
        foods: [...state.foods, payload],
        loading: false,
        error: null
      };

    case DELETE_FOOD_SUCCESS:
      return {
        ...state,
        foods: state.foods.filter(food => food._id !== payload),
        loading: false,
        error: null
      };

      case UPDATE_FOOD_SUCCESS:
        return {
          ...state,
          foods: state.foods.map(food => 
            food._id === payload.id ? payload.food : food
          ),
          loading: false,
          error: null
        };

    case FETCH_FOODS_FAIL:
    case DELETE_FOOD_FAIL:
    case UPDATE_FOOD_FAIL:
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