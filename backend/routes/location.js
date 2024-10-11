const express = require("express");
const locationRouter = express.Router();

//website to check public ip
//https://api.ipify.org/?format=json

locationRouter.post("/", async (req, res) => {
  const ip = req.body.ip;
  console.log(ip);
  const response = await fetch(
    `http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,query`
  );
  const result = await response.json();
  console.log("response :", result);

  if (result == null) {
    return res.status(400).json({ error: "no address found" });
  }

  const address = {
    continent: result.continent,
    country: result.country,
    region: result.regionName,
    district: result.district,
    city: result.city,
    zip: result.zip,
    lat: result.lat,
    lon: result.lon,
  };
  return res.status(200).json({ location: address });
});

module.exports = locationRouter;
