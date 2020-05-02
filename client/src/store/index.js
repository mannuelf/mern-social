import {createStore, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";
import setAuthToken from "../utils/setAuthToken";

const initState = {};
const middleware = [thunk];
let store;

store = createStore(
  rootReducer,
  initState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// set up a store subscription listener to store the users token in localStorage
let currentState = { auth: { token: null } }; // prevent auth error on first run of subscription
store.subscribe(() => {
   let previousState = currentState; // keep track of previous and current state
  currentState = store.getState();
  // if the token changes set the value in localStorage and axios headers
  if (previousState.auth.token !== currentState.auth.token) {
    const token = currentState.auth.token;
    setAuthToken(token);
  }
});

export default store;
