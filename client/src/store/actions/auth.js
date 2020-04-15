import {
  REGISTER_SUCCESS, REGISTER_FAIL,
  USER_LOADED, AUTH_ERROR,
  LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT
} from "./types";
import {setAlert} from "./alert";
import setAuthToken from "../../utils/setAuthToken";
import Axios from "axios";

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await Axios.get("/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    })
  } catch (err) {
    console.error(err.message);
    dispatch({
      type: AUTH_ERROR,
    })
  }
}

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
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")))
    }

    dispatch({
      type: REGISTER_FAIL,
    });
    console.error(err.message);
  }
}

// Login user
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  const body = JSON.stringify({email, password});

  try {
    const res = await Axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());

  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")))
    }

    dispatch({
      type: LOGIN_FAIL,
    });
    dispatch(loadUser());

    console.error(err.message);
  }
}

// Logout / Clear profile
export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT,
  })
}
