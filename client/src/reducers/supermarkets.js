import { GET_SUPERMARKETS, SUPERMARKETS_ERROR } from "../actions/types";

const initialState = {
  supermarkets: [],
  loading: true,
  error: {},
};

export default function supermarketsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_SUPERMARKETS:
      return {
        ...state,
        supermarkets: payload,
        loading: false,
      };
    case SUPERMARKETS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
