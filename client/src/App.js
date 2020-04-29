import React, {Fragment, useEffect} from 'react';
import NavBar from "./components/layout/NavBar";
import Landing from "./components/layout/Landing";
import Routes from "./components/routing/Routes";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./store/index";
import {loadUser} from "./store/actions/auth";
import setAuthToken from "./utils/setAuthToken";
import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (<Provider store={store}>
    <Router>
      <Fragment>
        <NavBar/>
        <Switch>
          <Route exact path="/" component={Landing}/>
          <Route component={Routes}/>
        </Switch>
      </Fragment>
    </Router>
  </Provider>)
}

export default App;
