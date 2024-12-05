import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
  CircleF,
} from "@react-google-maps/api";
import { Search, getAddress, getStoreList } from "./mapUtility";
import mapStyles from "./mapStyles";
import "./map.css";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const defaultCenter = {
  lat: 1.29027, // Singapore default coordinates
  lng: 103.851959,
};

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const Map = ({ clickData, setStoreList, storeList }) => {
  const [selected, setSelected] = useState(null);
  const [location, setLocation] = useState(defaultCenter);
  const [address, setAddress] = useState(null);
  const mapRef = useRef();

  // Initialize panTo first to avoid reference issues
  const panTo = useCallback(({ lat, lng }) => {
    if (mapRef.current && lat && lng) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(15);
    }
  }, []);

  const onMapClick = useCallback(
    (e) => {
      const newLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setLocation(newLocation);
      panTo(newLocation);
    },
    [panTo]
  );

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          updateAddress(newLocation.lat, newLocation.lng);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation(defaultCenter);
          updateAddress(defaultCenter.lat, defaultCenter.lng);
        }
      );
    }
  }, []);

  const updateAddress = async (lat, lng) => {
    try {
      const res = await getAddress(lat, lng);
      setAddress(res.data.address);
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  const updateStoreList = async () => {
    try {
      const data = await getStoreList(location);
      setStoreList(data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  useEffect(() => {
    if (location) {
      updateAddress(location.lat, location.lng);
      updateStoreList();
    }
  }, [location]);

  useEffect(() => {
    if (clickData) {
      setSelected(clickData);
    }
  }, [clickData]);

  const Locate = () => (
    <div className="locate">
      <img
        src={require("./compass.png")}
        alt="compass"
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              panTo(newLocation);
              setLocation(newLocation);
            },
            (error) => {
              console.error("Error getting location:", error);
            }
          );
        }}
      />
    </div>
  );

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

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
        {location && (
          <MarkerF
            position={location}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(30, 30),
              scaledSize: new window.google.maps.Size(60, 60),
            }}
          />
        )}

        {storeList?.map((item, index) => (
          <MarkerF
            key={index}
            position={{
              lat: Number(item.geometry.location.lat),
              lng: Number(item.geometry.location.lng),
            }}
            onClick={() => setSelected(item)}
            icon={{
              url: require("./grocery.png"),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(18, 18),
              scaledSize: new window.google.maps.Size(36, 36),
            }}
          />
        ))}

        <CircleF
          options={{
            strokeColor: "#90daee",
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: "grey",
            fillOpacity: 0.4,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
            radius: 1000,
            center: location,
          }}
        />

        {selected && (
          <InfoWindowF
            position={{
              lat: Number(selected.geometry.location.lat),
              lng: Number(selected.geometry.location.lng),
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div style={{ fontSize: "16px", fontWeight: "600" }}>
              {selected.name}
            </div>
          </InfoWindowF>
        )}

        <Locate />

        <div className="search">
          <Search panTo={panTo} setLocation={setLocation} />
        </div>

        {address && (
          <div className="address">
            <div>
              <span>Current Address</span>
              <br />
              {address.house_number} {address.road} {address.shop}
              <br />
              {address.postcode} {address.city}
            </div>
          </div>
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
