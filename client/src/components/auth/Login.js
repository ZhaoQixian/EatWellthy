import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import config from '../../config';

import { LOGIN_SUCCESS, GOOGLE_AUTO } from "../../actions/types";
import { login } from "../../actions/auth";
import { setAlert } from "../../actions/alert";
import Alert from "../layout/Alert";
import googleLogo from "./google.png";
import "./login.css";

const Login = ({ auth, login }) => {
  const googleAuthURL = `${config.backendUrl}/users/google`;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = () => {
      fetch(`${googleAuthURL}/success`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
        })
        .then((data) => {
          dispatch({
            type: LOGIN_SUCCESS,
            payload: data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (auth.googleAuto) {
      getUser();
    }
  }, [auth.googleAuto, dispatch]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      return dispatch(setAlert("Please enter your email address", "danger"));
    }
    try {
      const response = await fetch(
        `${config.backendUrl}/users/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      if (response.ok) {
        dispatch(setAlert("Password reset email sent successfully", "success"));
        setShowForgotPasswordModal(false);
      } else {
        dispatch(setAlert("Failed to send password reset email", "danger"));
      }
    } catch (err) {
      console.error("Error sending password reset email:", err);
      dispatch(setAlert("Server error. Please try again later.", "danger"));
    }
  };

  const handleGoogleAuth = async () => {
    const response = await fetch(`${googleAuthURL}/success`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    if (response.status === 400) {
      window.open(googleAuthURL, "_self");
      dispatch({
        type: GOOGLE_AUTO,
      });
    } else if (response.status === 200) {
      response.json().then((data) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: data,
        });
      });
    }
  };

  if (auth.isAuthenticated) {
    navigate("/dashboard");
  }

  return (
    <div className="login-form">
      <h1 className="heading">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <Alert />
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <input type="submit" className="btn" value="Login" />
      </form>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 35,
        }}
      >
        <div onClick={handleGoogleAuth} className="google_btn">
          <img src={googleLogo} alt="Google OAuth" />
          <span>Sign in with Google</span>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <p
          className="link"
          onClick={() => setShowForgotPasswordModal(true)}
          style={{ cursor: "pointer", color: "#007bff" }}
        >
          Forgot your password?
        </p>
      </div>
      <div style={{ marginTop: 60 }}>
        <p className="link">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn">
                Send Reset Email
              </button>
            </form>
            <button
              className="btn close-btn"
              onClick={() => setShowForgotPasswordModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { login })(Login);
