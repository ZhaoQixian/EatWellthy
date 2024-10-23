import {
    SET_PROFILE,
    PROFILE_ERROR,
    LOADING_PROFILE,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    LOGOUT,
    AUTH_ERROR
  } from '../actions/types';
  
  const initialState = {
    profile: null,
    loading: true,
    error: null
  };
  
  const profileReducer = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case LOADING_PROFILE:
        return {
          ...state,
          loading: true
        };
  
      case SET_PROFILE:
      case UPDATE_PROFILE:
        return {
          ...state,
          profile: payload,
          loading: false,
          error: null
        };
  
      case PROFILE_ERROR:
        return {
          ...state,
          error: payload,
          loading: false,
          profile: null
        };
  
      case CLEAR_PROFILE:
      case LOGOUT:
      case AUTH_ERROR:
        return {
          ...initialState,
          loading: false
        };
  
      default:
        return state;
    }
  };
  
  export default profileReducer;