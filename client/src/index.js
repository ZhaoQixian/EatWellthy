import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux"; // Make sure you import Provider
import { thunk } from "redux-thunk"; // Correctly import thunk as a named export
import rootReducer from "./reducers";

const initialState = {};

const middleware = [thunk];

// Create the Redux store
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// Render the application
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {" "}
      {/* Wrap your App with Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);

// Measure performance in your app
reportWebVitals();

export default store; // Export the store for use in other files
