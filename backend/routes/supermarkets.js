const express = require("express");
const router = express.Router();
const Supermarket = require("../models/Supermarket");
const { check, validationResult } = require("express-validator");

// @route   POST /api/supermarkets
// @desc    Add a new supermarket
// @access  Public
router.post(
  "/",
  [check("name", "Name is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, branches, food_items } = req.body;

    try {
      // Create a new supermarket
      const supermarket = new Supermarket({
        name,
        branches,
        food_items,
      });

      await supermarket.save();

      res.json(supermarket);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET /api/supermarkets
// @desc    Get all supermarkets
// @access  Public
router.get("/supermarket_data", async (req, res) => {
  try {
    const supermarkets = await Supermarket.find();  // Fetch all supermarkets from the "supermarkets" collection
    res.json(supermarkets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route   PUT /api/supermarkets/:id
// @desc    Update supermarket
// @access  Public
router.put("/:id", async (req, res) => {
  const { name, branches, food_items } = req.body;

  try {
    let supermarket = await Supermarket.findById(req.params.id);

    if (!supermarket) {
      return res.status(404).json({ msg: "Supermarket not found" });
    }

    // Update supermarket details
    supermarket = await Supermarket.findByIdAndUpdate(
      req.params.id,
      { $set: { name, branches, food_items } },
      { new: true }
    );

    res.json(supermarket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/supermarkets/:id
// @desc    Delete supermarket
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    let supermarket = await Supermarket.findById(req.params.id);

    if (!supermarket) {
      return res.status(404).json({ msg: "Supermarket not found" });
    }

    await Supermarket.findByIdAndRemove(req.params.id);

    res.json({ msg: "Supermarket removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
