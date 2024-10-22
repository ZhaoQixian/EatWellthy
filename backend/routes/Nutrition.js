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


//query
router.post(
    // "/nutrition/add",
    "/query_food",
    [], // parameter check
    async (req, res) => {
        try{

            const food_saved = await Nutrition_data.find({ });
            
            res.status(200).json({success : true , food_saved});
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

router.post(
    "/query_meal",
    async (req, res) => {
      const { meal_type, time } = req.body;
      console.log(meal_type, time);
      try {
        //Take the date and ignore the time
        const date = new Date(time);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  
        // Only query meals for the specified date and meal type
        const query = {
          meal_type: meal_type,
          time: {
            $gte: startOfDay,  // between start and end of day
            $lt: endOfDay  
          }
        };
  
         
        const meals = await Meal_data.find(query);
  
        if (meals.length > 0) {const mealsWithNutrition = await Promise.all(meals.map(async (meal) => {
            const nutritionData = await Nutrition_data.findOne({ name: meal.food_taken });
            return {
              meal,
              nutrition: nutritionData || "No nutrition data found for this food"
            };
          }));
    
          // 返回包含营养信息的餐点数据
          return res.status(200).json({ success: true, meals: mealsWithNutrition });
           
        } else {
          return res.status(404).json({ success: false, message: "No meals found for the specified date and meal type" });
        }
        
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    }
  );

router.delete(
    "/delete/:id",
    [], // parameter check
    async (req, res)=> {
    try {
        await Nutrition_data.deleteOne({_id: req.params.id});
        res.status(204).send('Delete successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
 }
);

router.delete(
    "/meal_delete/:id",
    [], // parameter check
    async (req, res)=> {
    try {
        await Meal_data.deleteOne({_id: req.params.id});
        res.status(204).send('Delete successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
 }
);

router.get(
  "/nutrition_data",
  async (req, res) => {
    try {
      const nutritionData = await Nutrition_data.find();  
      res.status(200).json({ success: true, data: nutritionData });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;