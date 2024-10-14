// DATABASE INITIALIZATION AND STANDARD SET-UP PROCEDURE //
function openDatabase() {
/** 
     
* This function initializes the database on the user's browser 
     
* The "request" value that is returned can be used in a "request.onsuccess"
* statement, and inside those statements are the code to manipulate the database
    
*/
    const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;
  
    if (!indexedDB) {
        console.log("IndexedDB could not be found in this browser.");
        return
    }

    const request = indexedDB.open("FoodMealDatabase", 1);

    request.onerror = function (event) {
        console.error("An error occurred with IndexedDB");
        console.error(event);
    };

    request.onupgradeneeded = function () {
        const db = request.result;

        const foodStore = db.createObjectStore("foods", { keyPath: "name" });
        const mealStore = db.createObjectStore("meals", { keyPath: "name" });
        const nutritionStore = db.createObjectStore("nutrition", { keyPath: "name" });
    };

    return request;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// FOOD CLASS
class Food {
    constructor(name, measurement_unit, serving_size, cals, carbs, protein, fat) {
        this.name = name;
        this.measurement_unit = measurement_unit;
        this.serving_size = serving_size;
        this.cals = cals;
        this.carbs = carbs;
        this.protein = protein;
        this.fat = fat;
    }
}

// MEAL CLASS
class Meal {
    constructor(name, ingredient_list, serving_list, cals, carbs, protein, fat) {
        this.name = name;
        this.ingredient_list = ingredient_list;
        this.serving_list = serving_list;
        this.cals = cals;
        this.carbs = carbs;
        this.protein = protein;
        this.fat = fat;
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// VARIABLE INITIALIZATION (FORMS, LISTS, BUTTONS)
let openedFile = '';    /** Initialized as empty, will later be set to whichever form is currently open */

const addFoodForm = document.getElementById('add_food_form');   
const addFoodButton = document.getElementById('add_food');  

const addMealForm = document.getElementById('add_meal_form');
const addMealButton = document.getElementById('add_meal');

const modifyForm = document.getElementById('modify_form');
const modifyButton = document.getElementById('modify');

const removeForm = document.getElementById('remove_form');
const removeButton = document.getElementById('remove');

const logNutritionForm = document.getElementById('log_nutrition_form');
const logNutritionButton = document.getElementById('log_nutrition');

const removeNutritionForm = document.getElementById('remove_nutrition_name');
const removeNutritionButton = document.getElementById('remove_nutrition');

/////////////////////////////////////////////////////////////////////////////////////////////////////////

function displayForm(form) {
/**
 
* This function displays the form that corresponds to the button pressed by the user.
* It ensures only one form is open at a time by using the "openedFile" variable initialized above.

*/
    if (openedFile === '') {
        openedFile = form;
    }

    else if (openedFile !== form) {
        let values = form.getElementsByTagName("input");
        for (let i = 0; i < values.length; i++) {
            values[i].value = '';
        }
        closeForm(openedFile);
        openedFile = form;
    }

    form.style.display = "flex";
}

function closeForm(form) {
/**

* This function closes whichever form was open.
* Can be activated by the user when they click the "Quit" button.

*/
    form.style.display = "none";
    error = document.getElementsByClassName('error');
    for (i = 0; i < error.length; i++) {
        error[i].innerHTML = '';
    }
}

function missingInformation() {
/**

* Sets the value of the error pop-up message in a form to indicate information is missing.

*/
    error = document.getElementsByClassName('error');
    for (i = 0; i < error.length; i++) {
        error[i].innerHTML = "You must appropriately fill out every field before submitting.";
    }
}

function addIngredient() {
/**

* Builds a new ingredient and serving input box for the addMeal form.
* Will activate whenever the user clicks the "Add Ingredient" button on the form.

*/
    let div = document.createElement("div");
    div.className = "ingredient_and_serving";

    let p_ingredient = document.createElement("p");
    let ingredient_text = document.createTextNode("Ingredient: ");
    let ingredient_input = document.createElement("input");
    ingredient_input.className = "meal_ingredients";
    p_ingredient.appendChild(ingredient_text);
    p_ingredient.appendChild(ingredient_input);

    let p_servings = document.createElement("p");
    let servings_text = document.createTextNode("Servings: ");
    let servings_input = document.createElement("input");
    servings_input.className = "meal_serving_sizes";
    p_servings.appendChild(servings_text);
    p_servings.appendChild(servings_input);

    ingredientsList = document.getElementById("ingredients");

    div.appendChild(p_ingredient);
    div.appendChild(p_servings);
    ingredientsList.appendChild(div);
}

function removeIngredient() {
/**

* Removes an ingredient and serving input box for the addMeal form.
* Will activate whenever the user clicks the "Remove Ingredient" button on the form.

*/
    let div = document.getElementById('ingredients');
    let ingredients_list = document.getElementsByClassName('ingredient_and_serving');
    div.removeChild(ingredients_list[(ingredients_list.length - 1)]);
}

function processForm(form) {
/**

* This function holds a majority of the code responsible for the nutrition calculator's functionality.
* When a user clicks the "Submit" button on a form, the form is sent through as a parameter to this function.

* The function will determine which form was sent through, and once it is determined, the appropriate
  procedures are performed to carry out the purpose of the form.

*/
    /**
    
    * In the addFoodForm case, all data is organized into their corresponding variables.

    * If any of these variables are empty (missing information), the user is prompted with the
      "missing information" error. 

    * Once all variables are properly set, they are made into a Food object.

    * Then the database is opened, the food is stored properly inside, and the page is reloaded to update the food list.

    */ 
    if(form === addFoodForm) {
        let name = document.getElementById("food_name").value;
        let measurement_unit = document.getElementById("food_measurement_unit").value;
        let serving_size = document.getElementById("food_serving_size").value;
        let calories = document.getElementById("food_calories").value;
        let carbs = document.getElementById("food_carbs").value;
        let protein = document.getElementById("food_protein").value;
        let fat = document.getElementById("food_fat").value;

        let foodAttributes = [name, measurement_unit, serving_size, calories, carbs, protein, fat];

        for (let i = 0; i < foodAttributes.length; i++){
            if(foodAttributes[i] === '') {
                missingInformation();
                return;
            }
        }

        let food = new Food(name, measurement_unit, serving_size, calories, carbs, protein, fat);
        
        const request = openDatabase();
        request.onsuccess = function () {
            console.log("Database opened successfully");
            const db = request.result;
            const foodTransaction = db.transaction("foods", "readwrite");        
            const foodStore = foodTransaction.objectStore("foods");

            foodStore.put({ name: food.name, measurement_unit: food.measurement_unit, serving_size: food.serving_size, cals: food.cals, carbs: food.carbs, protein: food.protein, fat: food.fat });

            foodTransaction.oncomplete = function () {
              db.close();
            };
        };

        document.getElementById("food_name").value = '';
        document.getElementById("food_measurement_unit").value = '';
        document.getElementById("food_serving_size").value = '';
        document.getElementById("food_calories").value = '';
        document.getElementById("food_carbs").value = '';
        document.getElementById("food_protein").value = '';
        document.getElementById("food_fat").value = '';
        closeForm(form);
        setNutritionLists();
    }

    /**
    * In the addMealForm case, the name is stored in a variable and then two parallel lists are built.
      for the ingredients and their corresponding number of servings.
    
    * All data is then checked for missing information. If any values are empty, the "missing information" error arises.
      Otherwise, the database is opened and variables for calories and micronutrients are initialized.
      
    * All of the current information is created into a Meal object and is updated in a for loop. This loop gets the nutrition of
      each food in the ingredient_list, and increments a total count for cals, carbs, protein, and fat.

    * The Meal object is stored in the database and repeatedly updated during the loop. Once the loop finishes,
      the page is reloaded to update the meal list.

     */
    else if (form === addMealForm) {
        let name = document.getElementById("meal_name").value;

        let temp_ingredient_list = document.getElementsByClassName('meal_ingredients');
        let temp_serving_list = document.getElementsByClassName('meal_serving_sizes');
        let ingredient_list = [];
        let serving_list = [];

        if (name !== '') {
            const request = openDatabase();
            request.onsuccess = function () {
                console.log("Database opened successfully");
                const db = request.result;
                const foodTransaction = db.transaction("foods", "readwrite");        
                const foodStore = foodTransaction.objectStore("foods");
                const foodList = foodStore.getAll();

                foodList.onsuccess = function () {
                    for (let i = 0; i < temp_ingredient_list.length; i++) {
                        if ((temp_ingredient_list[i].value !== '') && (temp_serving_list[i].value !== '')){
                            let ingredientExists = false;
                            for (let f = 0; f < foodList.result.length; f++) {
                                if (foodList.result[f].name === (temp_ingredient_list[i].value)) {
                                    ingredient_list.push(temp_ingredient_list[i].value);
                                    serving_list.push(temp_serving_list[i].value);
                                    ingredientExists = true;
                                }
                            }
                            
                            if (ingredientExists === false) {
                                let notRegistered = temp_ingredient_list[i].value;
                                error = document.getElementsByClassName('error');
                                for (i = 0; i < error.length; i++) {
                                    error[i].innerHTML = `${notRegistered} is not registered, and therefore cannot be included in this meal.`;
                                }
                                return
                            }
                        }
                        else {
                            missingInformation();
                            return
                        }
                    }

                    let cals = 0;
                    let carbs = 0;
                    let protein = 0;
                    let fat = 0;
        
                    let meal = new Meal(name, ingredient_list, serving_list, cals, carbs, protein, fat);
        
                    for (let i = 0; i < ingredient_list.length; i++) {
                        const food = foodStore.get(ingredient_list[i]);
                        food.onsuccess = function () {
        
                            const mealTransaction = db.transaction("meals", "readwrite");
                            const mealStore = mealTransaction.objectStore("meals");
        
                            cals += parseFloat(food.result.cals) * parseFloat(serving_list[i]);
                            carbs += parseFloat(food.result.carbs) * parseFloat(serving_list[i]);
                            protein += parseFloat(food.result.protein) * parseFloat(serving_list[i]);
                            fat += parseFloat(food.result.fat) * parseFloat(serving_list[i]);
        
                            mealStore.put( { name: meal.name, ingredient_list: meal.ingredient_list, serving_list: meal.serving_list, cals: (meal.cals + cals), carbs: (meal.carbs + carbs), protein: (meal.protein + protein), fat: (meal.fat + fat) });
                            
                            mealTransaction.oncomplete = function () {
                                db.close();
                            };
                        };
                    }
                    
                    document.getElementById("meal_name").value = '';
                    for (i = 0; i < temp_ingredient_list.length; i++) {
                        temp_ingredient_list[i].value = '';
                        temp_serving_list[i].value = '';
                    }
                    closeForm(form);
                    setNutritionLists();
        
                    foodTransaction.oncomplete = function () {
                        db.close();
                    }
                }
            }
        }
        else {
            missingInformation();
            return
        }
    }

    /**
    * In the removeForm case, the name is intialized and checked for missing information. If it is missing
      information, the user is prompted with the "missing information" error.

    * Otherwise, the database is opened and the program attempts to remove the given name from the
      food store first. If the name is not located there, the program then tries the meal store. 
      
    * If the program can't find the name in the meal store, it knows it isn't in the database, so
      it prompts the user with the "food/meal not in registry" error.

    * If the food/meal is found, the page is reloaded afterwards to update the lists.

     */

    else if (form === removeForm) {
        let name = document.getElementById('remove_name').value;

        if (name === '') {
            missingInformation();
            return
        }

        const request = openDatabase();
        request.onsuccess = function () {
            console.log("Database opened successfully");
            const db = request.result;

            const foodTransaction = db.transaction("foods", "readwrite");        
            const foodStore = foodTransaction.objectStore("foods");
            const foodList = foodStore.getAll();

            foodList.onsuccess = function () {
                let foodFound = false;
                for (let i = 0; i < foodList.result.length; i++) {
                    if (foodList.result[i].name === name) {
                        foodFound = true;
                        break;
                    }
                }

                if (foodFound === true) {
                    const deleteFood = foodStore.delete(name);
                    document.getElementById('remove_name').value = '';
                    closeForm(form);
                    setNutritionLists();
                    return;
                }
                else {
                    const mealTransaction = db.transaction("meals", "readwrite");
                    const mealStore = mealTransaction.objectStore("meals");
                    const mealList = mealStore.getAll();
                    
                    mealList.onsuccess = function () {
                        let mealFound = false;
                        for (let i = 0; i < mealList.result.length; i++) {
                            if (mealList.result[i].name === name) {
                                mealFound = true;
                                break;
                            }
                        }

                        if (mealFound === true) {
                            const deleteMeal = mealStore.delete(name);
                            document.getElementById('remove_name').value = '';
                            closeForm(form);
                            setNutritionLists();
                        }
                        else {
                            error = document.getElementsByClassName('error');
                            for (i = 0; i < error.length; i++) {
                                error[i].innerHTML = "The food/meal you entered is not registered.";
                            }
                            return;
                        }
                    }
                }
            }
        };
    }

    /**
      
    * In the logNutritionForm case, the name and number of servings are intialized and checked
     to see if they contain data. If they don't, the user is prompted with the "missing information" error.

    * If the data is accounted for, the database is opened and the program begins to search
      for a food that matches the name the user inputted in the food store.

    * If it cannot locate one, it will then search for a meal that matches the name in the meal store.

    * If no match is found for the name in either of the stores, the user is prompted with a
      "food/meal not in registry" error.

    */

    else if (form === logNutritionForm) {
        let name = document.getElementById("log_nutrition_name").value;
        let numServings = document.getElementById("log_nutrition_servings").value;
        
        try {
            parseFloat(numServings)
        }
        catch {
            missingInformation();
            return            
        }
        
        const request = openDatabase();
        request.onsuccess = function () {
            console.log("Database opened successfully");
            const db = request.result;

            const foodTransaction = db.transaction("foods", "readwrite");
            const foodStore = foodTransaction.objectStore("foods");
            const foodStoreList = foodStore.getAll();

            foodStoreList.onsuccess = function () {
                let foodFound = false;
                for (let i = 0; i < foodStoreList.result.length; i++) {
                    if (name === foodStoreList.result[i].name) {
                        foodFound = true;
                        break
                    }
                }

                if (foodFound === true) {
                /**
                    * If a food is found:
      
                    * The program sets the eaten_today information currently in the nutrition log
                      to a string value called "currentLog". It does the same for the current values of total calories,
                      total carbs, total protein, and total fat, except the calories are stored as an int and the micronutrients
                      are stored as floats.
            
                    * Then, using those retrieved and set values, the program increments the innerHTML for those values based
                      on the food's nutrition facts and number of servings.
                    
                    * Lastly, the nutrition store is opened and all of those updated innerHTML values are inserted into the store.
                      The logNutritionForm is then reset so that its values are empty and the form is closed.

                */
                    const foodToLog = foodStore.get(name);
                    foodToLog.onsuccess = function () {

                        const nutritionTransaction = db.transaction("nutrition", "readwrite");
                        const nutritionStore = nutritionTransaction.objectStore("nutrition");

                        const eatenToday = nutritionStore.get('eatenToday');
                        eatenToday.onsuccess = function () {
                            if (eatenToday.result === undefined){
                                nutritionStore.put({ name: "eatenToday", content: [`<br>${numServings}x ${foodToLog.result.name} (${foodToLog.result.serving_size} ${foodToLog.result.measurement_unit})<br>Calories: ${parseInt(foodToLog.result.cals * numServings)}<br>Carbs: ${Math.round(parseFloat(foodToLog.result.carbs * numServings) * 100) / 100}<br>Protein: ${Math.round(parseFloat(foodToLog.result.protein * numServings) * 100) / 100}<br>Fat: ${Math.round(parseFloat(foodToLog.result.fat * numServings) * 100) / 100}<br>`]} );
                            }
                            else {
                                eatenToday.result.content.push(`<br>${numServings}x ${foodToLog.result.name} (${foodToLog.result.serving_size} ${foodToLog.result.measurement_unit})<br>Calories: ${parseInt(foodToLog.result.cals * numServings)}<br>Carbs: ${Math.round(parseFloat(foodToLog.result.carbs * numServings) * 100) / 100}<br>Protein: ${Math.round(parseFloat(foodToLog.result.protein * numServings) * 100) / 100}<br>Fat: ${Math.round(parseFloat(foodToLog.result.fat * numServings) * 100) / 100}<br>`);
                                nutritionStore.put({ name: "eatenToday", content: eatenToday.result.content} );
                            }
                        };

                        const totalCals = parseInt(document.getElementById("total_calories").innerHTML);
                        const totalCarbs = parseFloat(document.getElementById("total_carbs").innerHTML);
                        const totalProtein = parseFloat(document.getElementById("total_protein").innerHTML);
                        const totalFat = parseFloat(document.getElementById("total_fat").innerHTML);        

                        nutritionStore.put({ name: "totalCals", content: totalCals + parseInt(foodToLog.result.cals * numServings) });
                        nutritionStore.put({ name: "totalCarbs", content: totalCarbs + Math.round(parseFloat(foodToLog.result.carbs * numServings) * 100) / 100 });
                        nutritionStore.put({ name: "totalProtein", content: totalProtein + Math.round(parseFloat(foodToLog.result.protein * numServings) * 100) / 100 });
                        nutritionStore.put({ name: "totalFat", content: totalFat + Math.round(parseFloat(foodToLog.result.fat * numServings) * 100) / 100 });
                        nutritionStore.put({ name: "currentDate", content: String(document.getElementById('current_date').innerHTML) })
                    };

                    document.getElementById("log_nutrition_name").value = '';
                    document.getElementById("log_nutrition_servings").value = '';
                    closeForm(form);
                    setNutritionToday();
                }
                else {
                    const mealTransaction = db.transaction("meals", "readwrite");
                    const mealStore = mealTransaction.objectStore("meals");
                    const mealStoreList = mealStore.getAll(); 

                    mealStoreList.onsuccess = function () {
                        let mealFound = false;
                        for (let i = 0; i < mealStoreList.result.length; i++) {
                            if (name === mealStoreList.result[i].name) {
                                mealFound = true;
                                break
                            }
                        }

                        if (mealFound === true) {
                        /** 
                            * If a meal is found:

                            * The program sets the same variables and information as it would have in the foodFound scenario.
                  
                            * Then it iterates through each ingredient, or food, in the ingredient_list. This is so that the program
                              can format a string that will list all of the ingredients of the meal when it is logged.

                            * Once that is complete, the program increments the innerHTML values for the previously retrieved variables
                              in the same way it would do for the foodFound scenario, but this time incrememting with the meal's nutrition facts.
                  
                            * Lastly, the nutrition store is opened and all of those updated innerHTML values are inserted into the store.
                              The logNutritionForm is then reset so that its values are empty and the form is closed.
                        */
                            const mealToLog = mealStore.get(name);
                            mealToLog.onsuccess = function () {

                                const nutritionTransaction = db.transaction("nutrition", "readwrite");
                                const nutritionStore = nutritionTransaction.objectStore("nutrition");

                                const eatenToday = nutritionStore.get('eatenToday');
                                eatenToday.onsuccess = function () {

                                    let mealString = (`<br>${numServings}x ${mealToLog.result.name} (`);
                                    for (let i = 0; i < mealToLog.result.ingredient_list.length; i++) {
                                        if (i != mealToLog.result.ingredient_list.length - 1){
                                            mealString += (`${mealToLog.result.serving_list[i]}x ${mealToLog.result.ingredient_list[i]}, `)
                                        }
                                        else {
                                            mealString += (`${mealToLog.result.serving_list[i]} ${mealToLog.result.ingredient_list[i]})`)
                                        }
                                    }

                                    mealString += (`<br>Calories: ${parseInt(mealToLog.result.cals * numServings)}<br>Carbs: ${Math.round(parseFloat(mealToLog.result.carbs * numServings) * 100) / 100}<br>Protein: ${Math.round(parseFloat(mealToLog.result.protein * numServings) * 100) / 100}<br>Fat: ${Math.round(parseFloat(mealToLog.result.fat * numServings) * 100) / 100}<br>`);

                                    if (eatenToday.result === undefined){
                                        nutritionStore.put({ name: "eatenToday", content: [mealString] });
                                    }
                                    else {
                                        eatenToday.result.content.push(mealString);
                                        nutritionStore.put({ name: "eatenToday", content: eatenToday.result.content} );
                                    }
                                };

                                const totalCals = parseInt(document.getElementById("total_calories").innerHTML);
                                const totalCarbs = parseFloat(document.getElementById("total_carbs").innerHTML);
                                const totalProtein = parseFloat(document.getElementById("total_protein").innerHTML);
                                const totalFat = parseFloat(document.getElementById("total_fat").innerHTML);
                                
                                nutritionStore.put({ name: "totalCals", content: totalCals + parseInt(mealToLog.result.cals * numServings) });
                                nutritionStore.put({ name: "totalCarbs", content: totalCarbs + Math.round(parseFloat(mealToLog.result.carbs * numServings) * 100) / 100 });
                                nutritionStore.put({ name: "totalProtein", content: totalProtein + Math.round(parseFloat(mealToLog.result.protein * numServings) * 100) / 100 });
                                nutritionStore.put({ name: "totalFat", content: totalFat + Math.round(parseFloat(mealToLog.result.fat * numServings) * 100) / 100 });
                                nutritionStore.put({ name: "currentDate", content: String(document.getElementById('current_date').innerHTML) })
                            };
                            document.getElementById("log_nutrition_name").value = '';
                            document.getElementById("log_nutrition_servings").value = '';
                            closeForm(form);
                            setNutritionToday();
                        }
                        else {
                            error = document.getElementsByClassName('error');
                            for (i = 0; i < error.length; i++) {
                                error[i].innerHTML = "The food/meal you entered is not registered.";
                            }
                            return
                        }
                    };
                }
            }
        }
    }

    else if (form === removeNutritionForm) {
        let name = document.getElementById("remove_nutrition_name").value;

        const request = openDatabase();
        request.onsuccess = function () {
            console.log("Database opened successfully");
            const db = request.result;
            const nutritionTransaction = db.transaction("nutrition", "readwrite");
            const nutritionStore = nutritionTransaction.objectStore("nutrition");
            const eatenToday = nutritionStore.get("eatenToday");

            eatenToday.onsuccess = function () {
                for (let i = 0; i < eatenToday.result.content.length; i++) {
                    
                    let charIndex = 1;

                    while (eatenToday.result.content[i].charAt(charIndex) != "x") {
                        charIndex++;
                    }

                    let numServings = parseFloat(eatenToday.result.content[i].slice(4, charIndex))
                    eatenToday.result = eatenToday.result.content.splice(i, 1);
                    nutritionStore.put(eatenToday.result);
                    const foodTransaction = db.transaction("foods", "readwrite");
                    const foodStore = foodTransaction.objectStore("foods");
                    const food = foodStore.get(name);

                    console.log(numServings.length)
                    console.log(numServings)

                    food.onsuccess = function () {
                        if (food.result != undefined) {
                            const nutritionTransaction = db.transaction("nutrition", "readwrite");
                            const nutritionStore = nutritionTransaction.objectStore("nutrition");
                            nutritionStore.put({ name: "totalCals", content: parseInt(document.getElementById("total_calories").innerHTML) - ((food.result.cals) * numServings) });
                            nutritionStore.put({ name: "totalCarbs", content: Math.round((parseFloat(document.getElementById("total_carbs").innerHTML) - (parseFloat(food.result.carbs) * numServings)) * 100) / 100 });
                            nutritionStore.put({ name: "totalProtein", content: Math.round((parseFloat(document.getElementById("total_protein").innerHTML) - (parseFloat(food.result.protein) * numServings)) * 100) / 100 });
                            nutritionStore.put({ name: "totalFat", content: Math.round((parseFloat(document.getElementById("total_fat").innerHTML) - (parseFloat(food.result.fat) * numServings)) * 100) / 100 });

                            document.getElementById("remove_nutrition_name").value = '';
                            closeForm(form);
                            setNutritionToday();
                        }
                        else {
                            const mealTransaction = db.transaction("meals", "readwrite");
                            const mealStore = mealTransaction.objectStore("meals");
                            const meal = mealStore.get(name);

                            meal.onsuccess = function () {
                                if (meal.result != undefined) {
                                    const nutritionTransaction = db.transaction("nutrition", "readwrite");
                                    const nutritionStore = nutritionTransaction.objectStore("nutrition");
                                    nutritionStore.put({ name: "totalCals", content: parseInt(document.getElementById("total_calories").innerHTML) - (meal.result.cals * numServings) });
                                    nutritionStore.put({ name: "totalCarbs", content: Math.round((parseFloat(document.getElementById("total_carbs").innerHTML) - (meal.result.carbs * numServings)) * 100) / 100 });
                                    nutritionStore.put({ name: "totalProtein", content: Math.round((parseFloat(document.getElementById("total_protein").innerHTML) - (meal.result.protein * numServings)) * 100) / 100 });
                                    nutritionStore.put({ name: "totalFat", content: Math.round((parseFloat(document.getElementById("total_fat").innerHTML) - (meal.result.fat * numServings)) * 100) / 100 });

                                    document.getElementById("remove_nutrition_name").value = '';
                                    closeForm(form);
                                    setNutritionToday();
                                }
                            };
                        }
                    };
                }
            }
        }
    }
}