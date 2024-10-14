const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const fs = require("fs");
let multer = require("multer");
let uuidv4 = require("uuid");
const Nutrition_data = require("../models/Nutrition_data");
const Meal_data = require("../models/Meal_data")


router.post(
    // "/nutrition/add",
    "/add",
    [], // parameter check
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { name, owner, energy, fat, sugar, fiber, protein, sodium, vitamin_c, calcium, iron } = req.body;
        try {
            // See if user exists
            let nutrition = await Nutrition_data.findOne({ name });
      
            if (nutrition) {
              return res
                .status(400)
                .json({ errors: [{ msg: "Food already exists" }] });
            }
            nutrition = new Nutrition_data({
                name,
                owner,
                energy,
                fat,
                sugar,
                fiber,
                protein,
                sodium,
                vitamin_c,
                calcium,
                iron,
            });
            
            await nutrition.save();
            res.status(200).send('Add successfully');
        }
        
        
        catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
        
        
    }
)

router.post(
    // "/nutrition/add",
    "/log_meal",
    [], // parameter check
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { owner,meal_type, food_taken, portion, time } = req.body;
        try {
             
      
             
            let meal_data = new Meal_data({
                owner,meal_type, food_taken, portion, time
            });
            console.log(meal_data);
            await meal_data.save();
            res.status(200).send('Add successfully');
        }
        
        
        catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
        
        
    }
)

module.exports = router;