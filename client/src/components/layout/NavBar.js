import React, {Fragment} from 'react';
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {logout} from "../../store/actions/auth";

const NavBar = ({ auth: { isAuthenticated, loading }, logout}) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">Profiles</Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user hide-sm"/> Dashboard
        </Link>
      </li>
      <li>
        <Link to="/posts">
          <i className="fas fa-user hide-sm"/> Posts
        </Link>
      </li>
      <li>
        <Link onClick={logout} to="#!">
          <i className="fas fa-sign-out-alt"/>
          <span className="hide-sm">
            {" "}Logout
          </span>
        </Link>
      </li>
    </ul>
  );

  const questLinks = (
    <ul>
      <li>
        <Link to="/profiles">Profiles</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
      { !loading && (<Fragment>
        { isAuthenticated ? authLinks : questLinks }
      </Fragment>)}
    </nav>
  );
};

NavBar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth
})
export default connect(mapStateToProps, {logout})(NavBar);
