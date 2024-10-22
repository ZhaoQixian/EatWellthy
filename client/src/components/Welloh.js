import React, { useState, useEffect } from 'react';
import './Welloh.css';
import axios from 'axios';

const Welloh = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isNew,setIsNew] = useState(true);
  const [nutrition,setNutrition] = useState([]);
  const [isNutritionLoad,setNutritionLoad] = useState(false);
  useEffect(()=>{
    async function fetch_nutrition(){
      try{
        const nutrition_data = await axios.get("http://localhost:5050/nutrition/nutrition_data");
        console.log("nutrition_fetch success!")
        setNutrition(nutrition_data.data);
        setNutritionLoad(true)
      }catch(error){
        console.log("nutrition_fetch error")
        const nutrition_data = ["error fetching nutrition data"];
        setNutrition(nutrition_data);
      }
    }
    fetch_nutrition();
    

    
  },[])

  const handleSend = async () => {
    if (!input) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await getChatGPTResponse(input);
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: response }]);
    } catch (error) {
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  const getChatGPTResponse = async (message) => {
    setIsNew(false);
    // Simulated GPT response for demonstration purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("I'm Welloh, here to assist you!");
      }, 1500);
    });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-icon"></div>
        <h2>Welloh Bot</h2>
      </div>
      <div className="chatbot-messages">
      {isNutritionLoad && 
        <div className={"message system"}>
          nutrition data loaded
        </div>}
        {!isNutritionLoad && 
        <div className={"message system"}>
          nutrition data loaded failed
        </div>}
      
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {isThinking && <div className="thinking-animation">...</div>}
        {isNew&& <div className='chatbot-greeting'>WELLOH</div>}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Welloh;