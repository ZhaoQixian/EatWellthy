import axios from "axios";
import { setAlert } from "./alert";
import { ADD_NUTRITION_INFOR_SUCCESS,
        ADD_NUTRITION_INFOR_FAIL
} from "./types"

export const add_nutrition_infor =
  ({ name, owner, energy, fat, sugar, fiber, protein, sodium, vitamin_c, calcium, iron }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("Called add_nutrition_infor");
    const body = JSON.stringify({ name, owner, energy, fat, sugar, fiber, protein, sodium, vitamin_c, calcium, iron });

    try {
      const res = await axios.post(
        "http://localhost:5050/nutrition/add",
        body,
        config
      );

      console.log(res);
      dispatch({
        type: ADD_NUTRITION_INFOR_SUCCESS,
        payload: res.data || {}, // Fallback to an empty object
      });

    //   dispatch(loadUser());
    } catch (err) {
      console.error("Food addition Error: ", err); // Log the entire error

      // If err.response is undefined, that indicates a network error or the server is unreachable.
      if (err.response) {
        const errors = err.response.data.errors; // Check for validation errors

        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        } else {
          dispatch(
            setAlert(
              "Registration failed: " + err.response.data.message ||
                "Unknown error",
              "danger"
            )
          ); // Show server message
        }
      } else {
        dispatch(setAlert("Network error: Unable to reach server", "danger"));
      }

      dispatch({
        type: ADD_NUTRITION_INFOR_FAIL,
      });
    }
  };