const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const openAI = require("openai");
const client = new openAI({
    apiKey: process.env.OPENAI_KEY, 
});
router.post("/chat", async (req, res) => {
    const userMessage = req.body.userMessage;

    try {
        const chatCompletion = await client.chat.completions.create({
            messages: userMessage,
            model: 'gpt-4o-mini',
        });
        res.json(chatCompletion.choices[0].message.content);

    } catch (error) {
        console.error("Error details:", error);
        console.error("Error message:", error.message);
        const error_message = "oppps something wrong with Welloh , maybe try again later?" + error + error.message;
        res.json(error_message);
    }
});

router.post("/init", async (req, res) => {
    const userData = req.body.userData || "oppps no data available";
    const system_prompt = `You are an AI assistant called Welloh. You have been provided with a lot of basic information and background about the users. Our software is a health application that includes data about the food users have eaten and their dietary habits, as well as information from local supermarkets. Based on the user's prompts, you should answer flexibly. If you perform well, you'll receive a tip of 1000。Now these are the ${userData}`;
    const background_information = `here are the data you have to remember and give answers while users ask about that ${userData}`;
    
    res.json([{ role: "system", content: system_prompt }, { role: "user", content: background_information }]);
});

module.exports = router;
