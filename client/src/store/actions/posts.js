import {setAlert} from "./alert";
import Axios from "axios";
import {
  GET_POSTS,
  POST_ERROR, UPDATE_LIKES
} from "./types";

// Get all posts
export const getPosts = () => async dispatch => {
  try {
    const res = Axios.get("/api/posts");
    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    })
  }
}

// Get all posts
export const addLike = postId => async dispatch => {
  try {
    const res = Axios.put(`/api/posts/like/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    })
  }
}
// Get all posts
export const removeLike = postId => async dispatch => {
  try {
    const res = Axios.put(`/api/posts/unlike/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    })
  }
}
