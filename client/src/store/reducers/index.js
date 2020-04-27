import {combineReducers} from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import posts from "./posts"

export default combineReducers({
  alert,
  auth,
  profile,
  posts,
});

/*
* 1. create reducer,
* 2. actions file,
* 3. components
* */
