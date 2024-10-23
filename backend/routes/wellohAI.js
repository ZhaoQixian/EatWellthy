const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const openAI = require("openai");
const client = new openAI({
    apiKey: process.env.OPENAI_KEY, // 你的 OpenAI API 密钥
});
// router.get("/chat_on",async (req,res)=>{
    
    
//     const userMessage = req.params.userMessage;
//     if (req.params.userMessage[0].role !==system)

// })

router.get("/init",async (req,res)=>{
    const userData = req.query.userData || "oppps no data avaible";
    const system_prompt = `You are an AI assistant called Welloh. You have been provided with a lot of basic information and background about the users. Our software is a health application that includes data about the food users have eaten and their dietary habits, as well as information from local supermarkets. Based on the user's prompts, you should answer flexibly. If you perform well, you'll receive a tip of 1000。Now these are the ${userData}`
    res.json([{role:"system",content:system_prompt}])
})

module.exports = router;
