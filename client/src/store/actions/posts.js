import React from "react";
import {setAlert} from "./alert";
import Axios from "axios";
import {
  GET_POSTS,
  POST_ERROR
} from "./types";

// Get all posts
export const getPosts = () => async dispatch => {
  try {
    const res = Axios.get("/api/posts");
    dispatch({
      type: GET_POSTS,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    })
  }
}
