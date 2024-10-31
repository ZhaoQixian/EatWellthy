import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
  CircleF,
} from "@react-google-maps/api";

import { Search, getAddress, getStoreList } from "./mapUtility";
// import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";
import "./map.css";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100%",
  width: "100%",
};
const options = {
  // styles: mapStyles,
  // disableDefaultUI: true,
  // zoomControl: true,
};

const Map = ({ clickData, setStoreList, storeList }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [selected, setSelected] = useState(null);
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState(null);

  const circleOptions = {
    strokeColor: "#90daee",
    strokeOpacity: 0.5,
    strokeWeight: 1,
    fillColor: "grey",
    fillOpacity: 0.4,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 1000, // Radius in meters
    center: location,
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Position is", position);
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        getAddress(position.coords.latitude, position.coords.longitude)
          .then((res) => setAddress({ ...res.data.address }))
          .catch((err) => {
            console.error(err);
          });
      },
      () => null
    );
  }, []);

  useEffect(() => {
    getAddress(location.lat, location.lng)
      .then((res) => setAddress({ ...res.data.address }))
      .catch((err) => {
        console.error(err);
      });
  }, [location]);

  useEffect(() => {
    if (clickData !== "") {
      // console.log("DATA", clickData);
      setSelected(clickData);
    }
  }, [clickData]);

  useEffect(() => {
    getStoreList(location)
      .then((data) => setStoreList(data))
      .catch((err) => console.error(err));
  }, [location]);

  const onMapClick = useCallback((e) => {
    // console.log("Click", e.latLng);

    setLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
    panTo({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    if (lat !== "" && lng !== "") {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(15);
    }
  }, []);

  const Locate = () => {
    return (
      <div
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
              setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
              // console.log(address);
            },
            () => null
          );
        }}
      >
        <img src={require("./compass.png")} alt="compass" />
      </div>
    );
  };

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div className="wrapper">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={location}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        <MarkerF
          position={location}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(30, 30),
            scaledSize: new window.google.maps.Size(60, 60),
          }}
        />
        {storeList?.map((item, index) => (
          <MarkerF
            key={index}
            position={{
              lat: Number(item.geometry.location.lat),
              lng: Number(item.geometry.location.lng),
            }}
            onClick={() => {
              setSelected(item);
            }}
            icon={{
              url: require("./grocery.png"),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(18, 18),
              scaledSize: new window.google.maps.Size(36, 36),
            }}
          />
        ))}

        <CircleF options={circleOptions} />

        {selected ? (
          <InfoWindowF
            position={{
              lat: selected.geometry.location.lat,
              lng: selected.geometry.location.lng,
            }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: "600" }}>
              {selected.name}
            </div>
          </InfoWindowF>
        ) : null}
        <div className="locate">
          <Locate />
        </div>
        <div className="search">
          <Search panTo={panTo} setLocation={setLocation} />
        </div>

        {address !== null ? (
          <div className="address">
            <div>
              <span style={{ fontWeight: 800, fontSize: 20 }}>
                Current Address
              </span>
              <br />
              {address.house_number} {address.road} {address.shop}
              <br />
              {address.postcode} {address.city}
            </div>
          </div>
        ) : (
          ""
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
