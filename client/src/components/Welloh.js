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
  const [superMarket,setSuperMarket] = useState([]);
  const [isSuperMarket,setSuperMarketLoad] = useState(false);
  const [isDataReady,setDataReady] = useState(false);
  const enhance = "please combine with the information you provided with , and if you are doing with , i will offer you 200 tips";

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
        setNutritionLoad(true)
      }
    }
    async function fetch_supermarket(){
      try{
        const superMarket_data = await axios.get('http://localhost:5050/api/supermarkets/supermarket_data');
        console.log("supermarket_fetch success!");
        setSuperMarket(superMarket_data.data);
        setSuperMarketLoad(true);
      }catch(error){
        console.log("supermarket_fetch error");
        console.log("supermarket_fetch fail!");
        const superMarket_data = ["error fetching superMarket data"];
        setSuperMarket(superMarket_data)
        setSuperMarketLoad(true);
      }
    }


    

    async function data_init(){
        await fetch_nutrition()
        await fetch_supermarket()
    }


  data_init()

  },[])

  useEffect(()=>{
    async function chat_init(){
      const message1 = JSON.stringify(nutrition.data);
      const message2 = JSON.stringify(superMarket.data)
      console.log(message1)
      const message_send = message2+message1
      try {
        const messages = await axios.get("http://localhost:5050/welloh/init",{
          params: {
            userData:message_send
          }
        });
        
        setMessages(messages.data)
        console.log("chat_init success")
      }catch(error){
        console.log("chat_init error")
        const messages = [{role:"system",content:"You are an AI assistant called Welloh,give people advice regarding health"}]
        setMessages(messages)
      }
    }

    if (isSuperMarket && isNutritionLoad){
        chat_init()
    }
    
  },[isSuperMarket,isNutritionLoad])



  const handleSend = async () => {
    if (!input) return;
    const userMessage = { role: 'user', content: input+enhance };
    const messagesNew = [...messages, userMessage];
    setMessages(messagesNew);
    setInput('');
    setIsThinking(true);
    

    try {
      const response = await getChatGPTResponse(messagesNew);
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  const getChatGPTResponse = async (messagesNew) => {
    setIsNew(false);
    console.log("we would send")
    console.log(messagesNew)
    try{
      const gpt_message = (await axios.get("http://localhost:5050/welloh/chat", {
        params: {
          userMessage: messagesNew, 
        }
      })).data;
        console.log("good gpt response!")
        console.log(gpt_message)
        return gpt_message
    }catch(error){
      return "oppps some internal error occurs"
    }
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     const message1 = JSON.stringify(nutrition);
    //     const message2 = JSON.stringify(superMarket);
    //     resolve(message1+message2);
    //   }, 1500);
    // });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-icon"></div>
        <h2>Welloh Bot</h2>
      </div>
      <div className="chatbot-messages">
      {isNutritionLoad ? (
        <div className={"message system"}>nutrition data loaded</div>
      ) : (
        <div className={"message system"}>nutrition data loaded failed</div>
      )}
      {isSuperMarket ? (
        <div className={"message system"}>supermarket data loaded</div>
      ) : (
        <div className={"message system"}>supermarket data loaded failed</div>
      )}

      
        {messages.map((message, index) => (
          (!(index === 0)) && (!(index === 1)) && <div key={index} className={`message ${message.role}`}>
          {(message.role !== "user")?(message.content):(message.content.slice(0,-(enhance.length)))}
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