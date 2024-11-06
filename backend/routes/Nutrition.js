 
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const fs = require("fs");
const axios = require("axios");
let multer = require("multer");
let uuidv4 = require("uuid");
const Nutrition_data = require("../models/Nutrition_data");
const Meal_data = require("../models/Meal_data")
 
router.post("/add", [], async (req, res) => {
  try {
    let { name, owner, energy, fat, sugar, fiber, protein, sodium, vitamin_c, calcium, iron } = req.body;
    
    // Check required fields
    if (!name || !energy) {
      return res.status(400).json({ msg: "Name and Energy are required fields" });
    }

    // Hash the owner ID
    owner = Nutrition_data.hashedOwner(owner);

    query = {
      "$and": [
                {"$or":[{"owner": 'admin'},{"owner": owner}] }, {"name":new RegExp(`^${name}$`, 'i')}
              ]

    }

    // Check for existing food with same name for this user
    const existingFood = await Nutrition_data.find(
      query
    );

    if (existingFood.length > 0) {
      return res.status(400).json({ msg: "Food already exists in your list" });
    }

    // Create new food with defaults for optional fields
    const nutrition = new Nutrition_data({
      name,
      owner,
      energy,
      fat: fat || 0,
      sugar: sugar || 0,
      fiber: fiber || 0,
      protein: protein || 0,
      sodium: sodium || 0,
      vitamin_c: vitamin_c || 0,
      calcium: calcium || 0,
      iron: iron || 0,
    });

    await nutrition.save();
    res.status(200).json(nutrition);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
// In your nutrition route (query_food endpoint)
router.post("/query_food", [], async (req, res) => {
  try {
    let hashed_owner = Nutrition_data.hashedOwner(req.body.owner);
    query = {
      owner: hashed_owner  // Remove the $or with admin, only show user's foods
    };
    const food_saved = await Nutrition_data.find(query).sort({name:1});
    res.status(200).json({success : true , food_saved});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
router.put("/update/:id", [], async (req, res) => {
  try {
    const { 
      owner, 
      energy, 
      fat, 
      sugar, 
      fiber, 
      protein, 
      sodium, 
      vitamin_c, 
      calcium, 
      iron 
    } = req.body;

    // Find the food first
    let food = await Nutrition_data.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ msg: "Food not found" });
    }

    // Verify ownership
    const hashedOwner = Nutrition_data.hashedOwner(owner);
    if (food.owner !== hashedOwner) {
      return res.status(401).json({ msg: "Not authorized to update this food" });
    }

    // Update fields
    const updateFields = {
      energy,
      fat,
      sugar,
      fiber,
      protein,
      sodium,
      vitamin_c,
      calcium,
      iron
    };

    // Update the food
    food = await Nutrition_data.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(food);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});
//query
router.post(
    // "/nutrition/add",
    "/query_food",
    [], // parameter check
    async (req, res) => {
        try{
          let hashed_owner = Nutrition_data.hashedOwner(req.body.owner);
          query = {
            "$or": [
              {"owner": "admin"}, {"owner": hashed_owner}
            ]
            }
            const food_saved = await Nutrition_data.find(query).sort({name:1});
            
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
        
        let { owner,meal_type, food_taken, portion, time } = req.body;
        console.log('before try');
      try {
        owner = Meal_data.hashedOwner(owner); 
        console.log('afterhash',owner);

        query = {
          "$and": [
                    {"$or":[{"owner": 'admin'},{"owner": owner}] }, {"name":new RegExp(`^${food_taken}$`, 'i')}
                  ]
    
         }
          let finding = await Nutrition_data.find(query);
          console.log('finding', finding);
          const config = {headers: {
            "x-app-id": process.env.NUTRITIONIX_ID,
            "x-app-key": process.env.NUTRITIONIX_KEY,
            "Content-Type": "application/json",
          }};
          const body = JSON.stringify({"query": food_taken})
          if (finding.length ===0) {
            //console.log('finding api')
            const nutrix_resp = await axios.post(" https://trackapi.nutritionix.com/v2/natural/nutrients",body,config);
            if (nutrix_resp.status == 404) {
              return res.status(400).json({ errors: [{ msg: "Food not found" }] });}
            else if (nutrix_resp.status == 200) {
              const api_foods = nutrix_resp.data.foods[0];
              //console.log(api_foods);
              let name, owner, energy, fat, sugar, fiber, protein, sodium, vitamin_c, calcium, iron; ;
              name = api_foods.food_name;
              owner = 'admin';
              energy = api_foods.nf_calories;
              fat = api_foods.nf_total_fat;
              sugar = api_foods.nf_sugars;
              fiber = api_foods.nf_dietary_fiber;
              protein = api_foods.nf_protein;
              

               
              for (const nutrient of api_foods.full_nutrients) {
                if (nutrient.attr_id === 307) sodium = nutrient.value;
                if (nutrient.attr_id === 401) vitamin_c = nutrient.value;
                if (nutrient.attr_id === 301) calcium = nutrient.value;
                if (nutrient.attr_id === 303) iron = nutrient.value;
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
          if (food_taken != name){
            food_taken = name;
            let check_exist = await Nutrition_data.findOne({ name:food_taken });
            console.log('!checkex',!check_exist);
            console.log('checkex',check_exist);
            if (!check_exist) {
              await nutrition.save();
          }
          }
          else{
                await nutrition.save();
            
          }    
            
          }
              
          }//end if
          
              let meal_data = new Meal_data({
                  owner,meal_type, food_taken, portion, time
              });
              console.log(meal_data);
              await meal_data.save();
              res.status(200).send('Add successfully');
          
        
      }catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
        
        
  }
)

router.post(
    "/query_meal",
    
    async (req, res) => {
      const { meal_type, time, owner } = req.body;
      console.log(meal_type, time, owner);
      try {
        //Take the date and ignore the time
        
        const date = new Date(time);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        let hashedowner = Meal_data.hashedOwner(owner);
        // Only query meals for the specified date and meal type
        const query = {
          meal_type: meal_type, 
          owner: hashedowner,
          time: {
            $gte: startOfDay,  // between start and end of day
            $lt: endOfDay  
          }
        };
        const query_no_mealtype = {
          owner: hashedowner,
          time: {
            $gte: startOfDay,  // between start and end of day
            $lt: endOfDay  
          }
        };
        let meals = [];
        if (meal_type === ""){
          meals = await Meal_data.find(query_no_mealtype).sort({ meal_type: 1 });
        } else {
          meals = await Meal_data.find(query) ;
        }
      
        
        if (meals.length > 0) {
          const mealsWithNutrition = await Promise.all(meals.map(async (meal) => {
            let query2 = {
              "$and": [
                {"$or":[{"owner": 'admin'},{"owner": hashedowner}] }, {"name": new RegExp(`^${meal.food_taken}$`, 'i')}
              ]

            };
            const nutritionData = await Nutrition_data.find(query2);
            console.log('nutritionData', nutritionData);
            return {
              meal,
              nutrition: nutritionData || "No nutrition data found for this meal."
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


router.put(
  "/meal_update/:id",
  [],
  async (req, res) => {
    try {
      const { owner, meal_type, food_taken, portion, time } = req.body;
      
      // Find the meal first
      let meal = await Meal_data.findById(req.params.id);
      
      if (!meal) {
        return res.status(404).json({ msg: "Meal not found" });
      }

      // Verify ownership
      const hashedOwner = Meal_data.hashedOwner(owner);
      if (meal.owner !== hashedOwner) {
        return res.status(401).json({ msg: "Not authorized to update this meal" });
      }

      // Update fields
      const updateFields = {
        meal_type,
        food_taken,
        portion,
        time: meal.time // keep original time
      };

      // Update the meal
      meal = await Meal_data.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true }
      );

      res.json({ success: true, meal });
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ msg: "Server Error", error: err.message });
    }
  }
);