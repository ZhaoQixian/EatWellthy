const express = require("express");
const locationRouter = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

locationRouter.post("/", async (req, res) => {
  const location = req.body;
  const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
  // console.log(location);

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
        item.name.toLowerCase().includes("red") ||
        item.name.toLowerCase().includes("amazon") ||
        item.name.toLowerCase().includes("cs fresh")
    );
    console.log(filteredResult);

    // return res.status(200).json(response.data.results);
    return res.status(200).json(filteredResult);
  } catch (e) {
    console.log(e);
  }
});

module.exports = locationRouter;
