const express = require("express");
const locationRouter = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

// Route to fetch nearby supermarkets based on location
locationRouter.post("/", async (req, res) => {
  const location = req.body;
  const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${url}location=${location.lat},${location.lng}&radius=1000&types=supermarket&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    headers: {},
  };

  try {
    const response = await axios.request(config);
    const filteredResult = response.data.results.filter(
      (item) =>
        item.name.toLowerCase().includes("fairprice") ||
        item.name.toLowerCase().includes("sheng siong") ||
        item.name.toLowerCase().includes("giant") ||
        item.name.toLowerCase().includes("cold") ||
        item.name.toLowerCase().includes("cs fresh") ||
        item.name.toLowerCase().includes("prime")
    );

    return res.status(200).json(filteredResult);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch location data" });
  }
});

// Route to fetch Google Maps API key
locationRouter.get("/google-maps-api-key", (req, res) => {
  try {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(404).json({ error: "Google Maps API key not found" });
    }
    res.status(200).json({ apiKey });
  } catch (e) {
    console.error("Error fetching API key:", e);
    return res.status(500).json({ error: "Failed to fetch API key" });
  }
});

module.exports = locationRouter;
