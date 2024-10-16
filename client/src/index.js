import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux"; // Make sure you import Provider
import { PersistGate } from "redux-persist/integration/react";

import "./index.css";
import App from "./App";
import store, { persistor } from "./store";

// Render the application
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <App />
      {/* </PersistGate> */}
    </Provider>
  </React.StrictMode>
);

// Measure performance in your app
reportWebVitals();

export default store; // Export the store for use in other files
