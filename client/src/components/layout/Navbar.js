import React, { Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import "./Navbar.css";

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
      <div className="left-section">
        <div className="icon-container">
          <img
            src="/favicon.ico"
            width="35"
            height="35"
            style={{ marginRight: "-500px" }}
            alt="Logo"
          />
        </div>
        {auth.isAuthenticated && (
          <li>
            <Link to="/dashboard">
              <i className="fas fa-user"></i>
              <span className="hide-sm">Dashboard</span>
            </Link>
          </li>
        )}
      </div>
      <h1></h1>
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