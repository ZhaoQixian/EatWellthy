// src/components/layout/Layout.js
import React from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar";

const Layout = ({ auth, children }) => {
  // Check authentication
  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Check if user exists before rendering
  if (!auth.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar user={auth.user} />
      <div className="dashboard-content">{children}</div>
    </div>
  );
};

Layout.propTypes = {
  auth: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Layout);
