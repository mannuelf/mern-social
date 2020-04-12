import React, {Fragment} from 'react';
import './App.css';
import NavBar from "./components/layout/NavBar";
import Landing from "./components/layout/Landing";
import {BrowserRouter as Router, Route, Switch} from "react-router";

const App = () =>
  <Router>
    <Fragment>
      <NavBar/>
      <Route exact="/" component={Landing}/>
    </Fragment>
  </Router>

export default App;
