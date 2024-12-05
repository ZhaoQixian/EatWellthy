import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import axios from "axios";
import "./map.css";
import "@reach/combobox/styles.css";
import appConfig from "../../config"; // Renamed to appConfig

export const Search = ({ panTo, setLocation, isLoaded }) => {
  // Hooks must be called unconditionally
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: 1.29027, lng: 103.851959 }, // Use numbers instead of functions
      radius: 1000, // Radius in meters
    },
  });

  // Handle the case when Google Maps API is not loaded yet
  if (!isLoaded) {
    return (
      <Combobox className="box-style">
        <ComboboxInput
          className="box-input"
          value=""
          onChange={() => {}}
          disabled={true}
          placeholder="Loading..."
        />
      </Combobox>
    );
  }

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      console.log(lat, lng);
      setLocation({
        lat,
        lng,
      });
      panTo({ lat, lng });
      setValue("");
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <Combobox className="box-style" onSelect={handleSelect}>
      <ComboboxInput
        className="box-input"
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Search your location"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export const getAddress = (lat, lng) => {
  const axiosConfig = {
    method: "get",
    url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
    headers: {},
  };
  return axios.request(axiosConfig);
};

export const getStoreList = (location) => {
  const axiosConfig = {
    method: "post",
    url: `${appConfig.backendUrl}/location`,
    headers: {},
    data: location,
  };

  return axios.request(axiosConfig).then((response) => response.data);
};
