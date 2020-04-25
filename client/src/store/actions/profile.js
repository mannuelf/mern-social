import Axios from "axios";
import {setAlert} from "./alert";
import {
  CLEAR_PROFILE,
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED
} from "./types";

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

// Create or update profile
export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
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

// Add Experience
export const addExperience = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    const res = await Axios.put("/api/profile/experience", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })

    dispatch(setAlert("Experience added", "success"));

    // go to the dashboard page on success.
    history.push("/dashboard");
  } catch (err) {
    console.log(err.message);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
}

// Add Education
export const addEducation = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    const res = await Axios.put("/api/profile/education", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })

    dispatch(setAlert("Education added", "success"));

    // go to the dashboard page on success.
    history.push("/dashboard");
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

// Delete an experience
export const deleteExperience = id => async dispatch => {
  try {
    const res = await Axios.delete(`/api/profile/experience/${id}`);

    dispatch({type: UPDATE_PROFILE, payload: res.data});
    dispatch(setAlert("Experience removed", "success"))
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
}

// Delete education
export const deleteEducation = id => async dispatch => {
  try {
    const res = await Axios.delete(`/api/profile/education/${id}`);

    dispatch({type: UPDATE_PROFILE, payload: res.data});
    dispatch(setAlert("Education removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
}

// Delete account
export const deleteAccount = () => async dispatch => {
  if (window.confirm("Are you sure? The action cannot be undone")) {
    try {
      const res = await Axios.delete("/api/profile");
      dispatch({type: CLEAR_PROFILE});
      dispatch({type: ACCOUNT_DELETED});
      dispatch(setAlert("Your account has been permanently DELETED"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {msg: err.response.statusText, status: err.response.status}
      });
    }
  }
}
