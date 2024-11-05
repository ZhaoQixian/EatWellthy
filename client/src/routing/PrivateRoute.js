import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NutritionCalculator from '../components/nutrition_cal/NutritionCalculator';

const PrivateRoute = ({
  element: Element,
  auth: { isAuthenticated, loading },
  ...rest
}) => {
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  return <Element {...rest} />;
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
