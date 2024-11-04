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
const Meal_data = require("../models/Meal_data");

router.post(
    "/add",
    [],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        let { name, owner, energy, fat, sugar, fiber, protein, sodium, vitamin_c, calcium, iron } = req.body;
        owner = Nutrition_data.hashedOwner(owner);
        console.log(owner);
        try {
            query = {
              "$and": [
                {"owner": owner }, {"name": name}
              ]
            }
            let nutrition = await Nutrition_data.find(query);
            console.log(nutrition);
            if (nutrition.length > 0) {
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
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

router.post(
    "/query_food",
    [],
    async (req, res) => {
        try {
          let hashed_owner = Nutrition_data.hashedOwner(req.body.owner);
          query = {
            "$or": [
              {"owner": "admin"}, {"owner": hashed_owner}
            ]
          }
          const food_saved = await Nutrition_data.find(query).sort({name:1});
          res.status(200).json({success: true, food_saved});
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

router.post(
    "/log_meal",
    [],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        
        let { owner, meal_type, food_taken, portion, time } = req.body;
        console.log('before try');

        try {
            owner = Meal_data.hashedOwner(owner);
            console.log('afterhash', owner);

            query = {
                "$and": [
                    { "$or": [{ "owner": "admin" }, { "owner": owner }] },
                    { "name": food_taken }
                ]
            };
            let finding = await Nutrition_data.findOne(query);
            console.log('finding', finding);

            if (!finding) {
                try {
                    const config = {
                        headers: {
                            "x-app-id": process.env.NUTRITIONIX_ID,
                            "x-app-key": process.env.NUTRITIONIX_KEY,
                            "Content-Type": "application/json"
                        }
                    };

                    console.log('Querying Nutritionix for:', food_taken);
                    try {
                        // First try with natural/nutrients endpoint
                        const nutrientsResponse = await axios.post(
                            "https://trackapi.nutritionix.com/v2/natural/nutrients",
                            { "query": food_taken },
                            config
                        );
                        
                        if (nutrientsResponse.data && nutrientsResponse.data.foods && nutrientsResponse.data.foods.length > 0) {
                            const api_foods = nutrientsResponse.data.foods[0];
                            console.log('API response:', api_foods);

                            const nutrition = new Nutrition_data({
                                name: api_foods.food_name,
                                owner: 'admin',
                                energy: api_foods.nf_calories || 0,
                                fat: api_foods.nf_total_fat || 0,
                                sugar: api_foods.nf_sugars || 0,
                                fiber: api_foods.nf_fiber || 0,
                                protein: api_foods.nf_protein || 0,
                                sodium: api_foods.full_nutrients?.find(n => n.attr_id === 307)?.value || 0,
                                vitamin_c: api_foods.full_nutrients?.find(n => n.attr_id === 401)?.value || 0,
                                calcium: api_foods.full_nutrients?.find(n => n.attr_id === 301)?.value || 0,
                                iron: api_foods.full_nutrients?.find(n => n.attr_id === 303)?.value || 0
                            });

                            food_taken = api_foods.food_name;

                            let existing_nutrition = await Nutrition_data.findOne({
                                name: food_taken,
                                owner: 'admin'
                            });

                            if (!existing_nutrition) {
                                await nutrition.save();
                                console.log('Saved new nutrition data for:', food_taken);
                            }
                        } else {
                            throw new Error('No results from natural/nutrients endpoint');
                        }
                    } catch (nutrientsError) {
                        console.log('Trying search endpoint...');
                        // If natural/nutrients fails, try the search endpoint
                        const searchResponse = await axios.post(
                            "https://trackapi.nutritionix.com/v2/search/instant",
                            { "query": food_taken },
                            config
                        );

                        if (searchResponse.data && searchResponse.data.common && searchResponse.data.common.length > 0) {
                            const common_food = searchResponse.data.common[0];
                            
                            // Get detailed nutrients for the found food
                            const detailedResponse = await axios.post(
                                "https://trackapi.nutritionix.com/v2/natural/nutrients",
                                { "query": common_food.food_name },
                                config
                            );

                            if (detailedResponse.data && detailedResponse.data.foods && detailedResponse.data.foods.length > 0) {
                                const api_foods = detailedResponse.data.foods[0];
                                
                                const nutrition = new Nutrition_data({
                                    name: api_foods.food_name,
                                    owner: 'admin',
                                    energy: api_foods.nf_calories || 0,
                                    fat: api_foods.nf_total_fat || 0,
                                    sugar: api_foods.nf_sugars || 0,
                                    fiber: api_foods.nf_fiber || 0,
                                    protein: api_foods.nf_protein || 0,
                                    sodium: api_foods.full_nutrients?.find(n => n.attr_id === 307)?.value || 0,
                                    vitamin_c: api_foods.full_nutrients?.find(n => n.attr_id === 401)?.value || 0,
                                    calcium: api_foods.full_nutrients?.find(n => n.attr_id === 301)?.value || 0,
                                    iron: api_foods.full_nutrients?.find(n => n.attr_id === 303)?.value || 0
                                });

                                food_taken = api_foods.food_name;
                                
                                let existing_nutrition = await Nutrition_data.findOne({
                                    name: food_taken,
                                    owner: 'admin'
                                });

                                if (!existing_nutrition) {
                                    await nutrition.save();
                                    console.log('Saved new nutrition data for:', food_taken);
                                }
                            } else {
                                throw new Error('No detailed nutrition data found');
                            }
                        } else {
                            return res.status(404).json({
                                errors: [{ msg: "Food not found in database or Nutritionix" }]
                            });
                        }
                    }
                } catch (apiError) {
                    console.error('Nutritionix API Error:', apiError);
                    return res.status(400).json({
                        errors: [{
                            msg: "Error fetching nutrition data from API",
                            detail: apiError.message
                        }]
                    });
                }
            }

            const meal_data = new Meal_data({
                owner,
                meal_type,
                food_taken,
                portion,
                time
            });

            await meal_data.save();
            res.status(200).json({
                success: true,
                message: 'Meal logged successfully',
                food_name: food_taken
            });

        } catch (err) {
            console.error('Server Error:', err.message);
            res.status(500).json({
                success: false,
                message: "Server error",
                error: err.message
            });
        }
    }
);

router.post(
    "/query_meal",
    async (req, res) => {
      const { meal_type, time, owner } = req.body;
      console.log(meal_type, time, owner);
      try {
        const date = new Date(time);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        let hashedowner = Meal_data.hashedOwner(owner);
        
        const query = {
          meal_type: meal_type, 
          owner: hashedowner,
          time: {
            $gte: startOfDay,
            $lt: endOfDay  
          }
        };
         
        const meals = await Meal_data.find(query);
        
        if (meals.length > 0) {
          const mealsWithNutrition = await Promise.all(meals.map(async (meal) => {
            let query2 = {
              "$and": [
                {"$or":[{"owner": 'admin'},{"owner": hashedowner}] }, {"name": meal.food_taken}
              ]
            };
            const nutritionData = await Nutrition_data.find(query2);
            console.log('nutritionData', nutritionData);
            return {
              meal,
              nutrition: nutritionData || "No nutrition data found for this food"
            };
          }));
    
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
    [],
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
    [],
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