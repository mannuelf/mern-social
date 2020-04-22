import Axios from "axios";
import {setAlert} from "./alert";
import {GET_PROFILE, PROFILE_ERROR} from "./types";

export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await Axios.get("/api/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    })
    console.log(err.message)
  }
}

// Create of update profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    const res = await Axios.post("/api/profile", formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })

    dispatch(setAlert(edit ? "Profile Updated 🚀" : "Profile Created", "success"));

    // go to the dashboard page if not editing.
    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    console.log(err.message);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    })
  }
}

