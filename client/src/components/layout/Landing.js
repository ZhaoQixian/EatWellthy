import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Landing = ({ auth }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate();
  }, []);

  console.log("LANDING/isAuthenticated", auth.isAuthenticated);
  console.log("LANDING/Loading", auth.loading);
  console.log("LANDING/User", auth.user);

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1>Welcome to EatWellthy</h1>
          <br />
          <div className="buttons">
            <Link to="/register" className="btn">
              Sign Up
            </Link>
            <Link to="/login" className="btn">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Landing);
