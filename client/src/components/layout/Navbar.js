import React, { Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { logout } from "../../actions/auth";

const Navbar = ({ auth, logout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Location : ", location.pathname);

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  const authLinks = (
    <ul className="nav-links">
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user"></i>
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li onClick={handleLogout}>
        <Link>
          <i className="fas fa-sign-out-alt"></i>{" "}
          <span className="hide-sm"> &nbsp;Logout</span>
        </Link>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul className="nav-links">
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
        <Link to="/">HOME</Link>
      </h1>
      {!auth.loading && (
        <Fragment>
          {auth.isAuthenticated
            ? authLinks
            : location.pathname === "/"
            ? guestLinks
            : ""}
        </Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
