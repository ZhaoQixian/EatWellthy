import React, { useEffect } from "react";
import axios from "axios";

import "./PlacesList.css";
import { dummyData } from "./dummyData";

const PlacesList = ({ setClickData }) => {
  useEffect(() => {
    // fetch(
    //   `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=1.388843,103.849089&radius=3000&types=supermarket&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
    //   {
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //       "Access-Control-Allow-Headers":
    //         "Origin, X-Requested-With, Content-Type, Accept",
    //     },
    //   }
    // )
    //   .then((response) => response.json())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.error(error));
  }, []);

  const handleClick = (item) => setClickData(item);
  return (
    <div className="list-wrapper">
      <div>
        {dummyData.map((item, index) => (
          <div className="item" key={index} onClick={() => handleClick(item)}>
            <div style={{ fontWeight: "700", fontSize: 20 }}>{item.name}</div>
            <div>{item.vicinity}</div>
            {/* <div>{item.geometry.location.lat}</div>
            <div>{item.geometry.location.lng}</div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesList;
