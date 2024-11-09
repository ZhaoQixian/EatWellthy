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
import appConfig from '../../config';  // Renamed to appConfig

export const Search = ({ panTo, setLocation }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 1.29027, lng: () => 103.851959 },
      radius: 1 * 1000,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

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
            data.map(({ id, description }) => (
              <ComboboxOption key={id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export const getAddress = (lat, lng) => {
  let axiosConfig = {  // Renamed to axiosConfig
    method: "get",
    url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
    headers: {},
  };
  const promiseAddress = new Promise((resolve, reject) => {
    resolve(axios.request(axiosConfig));
    reject(new Error("Failed to retrieve address!"));
  });
  return promiseAddress;
};

export const getStoreList = (location) => {
  let axiosConfig = {  // Renamed to axiosConfig
    method: "post",
    url: `${appConfig.backendUrl}/location`,  // Using appConfig instead
    headers: {},
    data: location,
  };

  const promiseStoreList = new Promise((resolve, reject) => {
    resolve(axios.request(axiosConfig).then((response) => response.data));
    reject(new Error("Failed to retrieve store!"));
  });
  return promiseStoreList;
};
