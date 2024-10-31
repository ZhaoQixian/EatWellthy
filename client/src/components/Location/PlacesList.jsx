import React from "react";

import "./PlacesList.css";

const PlacesList = ({ storeList, setClickData }) => {
  const handleClick = (item) => setClickData(item);

  if (storeList == null || storeList.length < 1) {
    return (
      <>
        <div>No available data ... </div>
      </>
    );
  } else {
    return (
      <>
        <div className="list-wrapper">
          <div>
            {storeList.map((item, index) => (
              <div
                className="item"
                key={index}
                onClick={() => handleClick(item)}
              >
                <div style={{ fontWeight: "700", fontSize: 20 }}>
                  {item.name}
                </div>
                <div>{item.vicinity}</div>
                {/* <div>{item.geometry.location.lat}</div>
            <div>{item.geometry.location.lng}</div> */}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
};

export default PlacesList;
