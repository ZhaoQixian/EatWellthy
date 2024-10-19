import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux"; // Make sure you import Provider

import "./index.css";
import App from "./App";
import store from "./store";

// Render the application
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Measure performance in your app
reportWebVitals();

export default store; // Export the store for use in other files
