const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// Nutritionix API credentials
const NUTRITIONIX_ID = process.env.NUTRITIONIX_ID;
const NUTRITIONIX_KEY = process.env.NUTRITIONIX_KEY;

// Route to get nutrition data
router.post("/nutrition", async (req, res) => {
  try {
    const { query } = req.body; // get the food item name from request body

    const response = await axios.post(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      { query },
      {
        headers: {
          "x-app-id": NUTRITIONIX_ID,
          "x-app-key": NUTRITIONIX_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
