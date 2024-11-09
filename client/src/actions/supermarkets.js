import axios from 'axios';
import config from '../config';
import { GET_SUPERMARKETS, SUPERMARKETS_ERROR } from './types';

// Fetch supermarket brands
export const getSupermarkets = () => async (dispatch) => {
  try {
    // Wrong: '${config.backendUrl}/api/supermarkets/supermarket_data'
    // Correct: Use backticks (`) instead of single quotes (')
    const res = await axios.get(`${config.backendUrl}/api/supermarkets/supermarket_data`);
    
    dispatch({
      type: GET_SUPERMARKETS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SUPERMARKETS_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status },
    });
  }
};