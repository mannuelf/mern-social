import {REGISTER_SUCCESS, REGISTER_FAIL} from "./types";
import Axios from "axios";

// Register user
export const register = ({name, email, password}) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  const body = JSON.stringify({name, email, password});

  try {
    const res = await Axios.post("/api/users", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

  } catch (err) {
    console.error(err.message);

    dispatch({
      type: REGISTER_FAIL,
    })
  }
}
