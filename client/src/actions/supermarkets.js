import axios from 'axios';
import { GET_SUPERMARKETS, SUPERMARKETS_ERROR } from './types';

// Fetch supermarket brands
export const getSupermarkets = () => async (dispatch) => {
  try {
    const res = await axios.get('http://localhost:5050/api/supermarkets/supermarket_data');  // Use the full URL with port 5050
    dispatch({
      type: GET_SUPERMARKETS,
      payload: res.data,  // Dispatch the supermarket data
    });
  } catch (err) {
    dispatch({
      type: SUPERMARKETS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
