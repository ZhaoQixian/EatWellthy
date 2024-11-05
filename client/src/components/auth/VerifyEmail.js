// client/src/components/auth/VerifyEmail.js

import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { verifyEmail, resendVerification } from "../../actions/auth";
import { setAlert } from "../../actions/alert";
import Alert from "../layout/Alert";

const VerifyEmail = ({
  verifyEmail,
  resendVerification,
  setAlert,
  isAuthenticated,
}) => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    code: "",
  });

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const { email, code } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !code) {
      return setAlert("Please fill in all fields", "danger");
    }
    setLoading(true);
    try {
      const success = await verifyEmail(email, code);
      if (success) {
        setVerified(true);
      }
    } catch (err) {
      console.error("Verification error:", err);
    }
    setLoading(false);
  };

  const handleResendCode = async () => {
    if (!email) {
      return setAlert("Please enter your email address", "danger");
    }
    setLoading(true);
    try {
      await resendVerification(email);
    } catch (err) {
      console.error("Resend error:", err);
    }
    setLoading(false);
  };

  if (verified) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="register-form">
      <h1 className="heading">Verify Your Email</h1>
      <p className="lead">
        <i className="fas fa-envelope"></i> Enter the verification code sent to
        your email
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
            disabled={loading}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter 6-digit verification code"
            name="code"
            value={code}
            onChange={onChange}
            maxLength="6"
            disabled={loading}
            required
          />
        </div>
        <input
          type="submit"
          className="btn btn-primary"
          value={loading ? "Verifying..." : "Verify Email"}
          disabled={loading}
        />
        <button
          type="button"
          className="btn btn-light"
          onClick={handleResendCode}
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          Resend Code
        </button>
      </form>
      <p className="link">
        Already verified? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

VerifyEmail.propTypes = {
  verifyEmail: PropTypes.func.isRequired,
  resendVerification: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  verifyEmail,
  resendVerification,
  setAlert,
})(VerifyEmail);
