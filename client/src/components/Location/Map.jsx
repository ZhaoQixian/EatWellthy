import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";

import { formatRelative } from "date-fns";

import { Search } from "./mapUtility";
import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";
import "./map.css";
import { dummyData } from "./dummyData";
import Compass from "./compass.png";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100%",
  width: "100%",
};
const options = {
  // styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 1.388843,
  lng: 103.849089,
};

const Map = ({ clickData }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [location, setLocation] = useState({
    lat: 1.388843,
    lng: 103.849089,
  });
  const [address, setAddress] = useState({
    city: "Singapore",
    country: "Singapore",
    house_number: "10",
    postcode: "569059",
    road: "Ang Mo Kio Street 65",
    shop: "Techpoint",
    suburb: "Ang Mo Kio",
  });

  useEffect(() => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1`;
    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        setAddress({ ...result.address });
        // console.log(address);
      })
      .catch((err) => console.error(err));
  }, [location]);

  useEffect(() => {
    if (clickData !== "") {
      console.log("DATA", clickData);
      setSelected(clickData);
    }
  }, [clickData]);

  const onMapClick = React.useCallback((e) => {
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

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
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
              console.log(address);
            },
            () => null
          );
        }}
      >
        <img src={Compass} alt="compass" />
      </div>
    );
  };

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div className="wrapper">
      <GoogleMap
        // id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
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
        {dummyData.map((item, index) => (
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
              url: "https://maps.google.com/mapfiles/ms/icons/grocerystore.png",
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(20, 20),
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        ))}

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
            <div>{selected.name}</div>
          </InfoWindowF>
        ) : null}
        <div className="locate">
          <Locate />
        </div>
        <div className="search">
          <Search panTo={panTo} setLocation={setLocation} />
        </div>
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
      </GoogleMap>
    </div>
  );
};

export default Map;
