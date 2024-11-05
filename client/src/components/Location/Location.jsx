import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import PlacesList from "./PlacesList";
import Map from "./Map";
import Sidebar from "../Sidebar";
import "./location.css";

const Location = ({ auth }) => {
  const [clickData, setClickData] = useState("");
  const [storeList, setStoreList] = useState(null);

  console.log("LOCATION/isAuthenticated", auth.isAuthenticated);
  console.log("LOCATION/Loading", auth.loading);
  console.log("LOCATION/User", auth.user);
  console.log("LOCATION/Google status", auth.googleAuto);

  return (
    <div className="location-page">
      {auth.user && <Sidebar user={auth.user} />}
      <div className="container">
        <div className="list-container">
          <PlacesList storeList={storeList} setClickData={setClickData} />
        </div>
        <div className="map-container">
          <Map
            clickData={clickData}
            setStoreList={setStoreList}
            storeList={storeList}
          />
        </div>
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
