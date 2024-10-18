import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import PlacesList from "./PlacesList";
import Map from "./Map";
import "./location.css";

const Location = ({ auth }) => {
  const [clickData, setClickData] = useState("");

  console.log("LOCATION/isAuthenticated", auth.isAuthenticated);
  console.log("LOCATION/Loading", auth.loading);
  console.log("LOCATION/User", auth.user);
  console.log("LOCATION/Google status", auth.googleAuto);

  return (
    <div className="container">
      <div className="list-container">
        <PlacesList setClickData={setClickData} />
      </div>
      <div className="map-container">
        <Map clickData={clickData} />
      </div>
    </div>
  );
};

Location.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Location);
