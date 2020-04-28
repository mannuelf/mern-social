import {setAlert} from "./alert";
import Axios from "axios";
import {
  ADD_POSTS,
  DELETE_POSTS,
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES
} from "./types";

// Get all posts
export const getPosts = () => async dispatch => {
  try {
    const res = await Axios.get("/api/posts");
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

export const addLike = postId => async dispatch => {
  try {
    const res = await Axios.put(`/api/posts/like/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: {postId, likes: res.data}
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    })
  }
}

export const removeLike = postId => async dispatch => {
  try {
    const res = await Axios.put(`/api/posts/unlike/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: {postId, likes: res.data}
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    })
  }
}

export const deletePost = id => async dispatch => {
  try {
    const res = await Axios.delete(`/api/posts/${id}`);
    dispatch({
      type: DELETE_POSTS,
      payload: id
    });
    dispatch(setAlert("Post Removed", "success"))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    })
  }
}

export const addPost = formData => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }
  try {
    const res = await Axios.post(`/api/posts/`, formData, config);
    dispatch({
      type: ADD_POSTS,
      payload: res.data
    });
    dispatch(setAlert("Post created", "success"))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    })
  }
}
