import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { LOGIN_SUCCESS, GOOGLE_AUTO, USER_LOADED } from "../../actions/types";
import { login } from "../../actions/auth";
import Alert from "../layout/Alert";
import googleLogo from "./google.png";
import "./login.css";

const Login = ({ auth, login }) => {
  const googleAuthURL = "http://localhost:5050/users/google";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  console.log("LOGIN/isAuthenticated", auth.isAuthenticated);
  console.log("LOGIN/Loading", auth.loading);
  console.log("LOGIN/User", auth.user);
  console.log("LOGIN/Google status", auth.googleAuto);

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
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
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
        console.log("DATA", data.user);
        dispatch({
          type: LOGIN_SUCCESS,
          payload: data,
        });
        // dispatch({
        //   type: USER_LOADED,
        //   payload: data.user,
        // });
      });
    }
  };

  // Redirect if logged in
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
      <br />
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn" value="Login" />
      </form>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
          marginTop: 35,
        }}
      >
        {/* <div
          style={{
            marginRight: 100,
            alignContent: "center",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          Or
        </div> */}
        <div onClick={handleGoogleAuth} className="google_btn">
          <img src={googleLogo} alt="Google OAuth" />
          <span>Sign in with Google</span>
        </div>
      </div>
      <div style={{ marginTop: 60 }}>
        <p className="link">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
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
