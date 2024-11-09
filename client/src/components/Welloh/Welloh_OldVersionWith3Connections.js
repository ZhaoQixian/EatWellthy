/*

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import './Welloh.css';
import axios from 'axios';
import { getProfile } from "../../actions/Profile"
import ReactMarkdown from 'react-markdown';

const Welloh = () => {
  const dispatch = useDispatch();
  const profileState = useSelector((state) => state.profile);
  const authState = useSelector((state) => state.auth);
  
  const isInitialized = React.useRef(false);
  
  const [profile, setProfile] = useState({});
  
  const [dataState, setDataState] = useState({
    isProfileLoaded: false,
    nutrition: [],
    isNutritionLoaded: false,
    superMarket: [],
    isSuperMarketLoaded: false,
  });
  
  const [chatState, setChatState] = useState({
    messages: [],
    input: '',
    isThinking: false,
    isNew: true,
  });

  const enhance = "(please combine with the information you provided with (only when you think it is needed), and if you are doing with , i will offer you 200 tips,and plz consider whether or not this should combined with knowledge directly , we need you to think carefully, and i believe you can definely do well!,but do not restricted to given information , you can add more based on you inner knowledge to provide better result , and you do not have to combined all knowledge you are given ,just selected necessary content)";

  const fetchNutrition = async () => {
    if (dataState.isNutritionLoaded) return; 
    
    try {
      const response = await axios.get("http://localhost:5050/nutrition/nutrition_data");
      console.log("nutrition_fetch success!");
      console.log("nutrition_content")
      console.log(response)
      // Only take the first 5 items from the nutrition data
      console.log("nutri array:")
      console.log(response.data.data)
      const nutri_array = response.data.data
      const length_nutrition = nutri_array.length
      const maxSliceSize = 10
      const startIndex = Math.floor(Math.random() * (length_nutrition - maxSliceSize + 1))
      console.log(startIndex)
      const endIndex = startIndex + maxSliceSize;
      const limitedNutritionData = response.data.data.slice(startIndex,endIndex)
      setDataState(prev => ({
        ...prev,
        nutrition: limitedNutritionData,
        isNutritionLoaded: true,
      }));
    } catch (error) {
      console.log("nutrition_fetch error");
      setDataState(prev => ({
        ...prev,
        nutrition: ["error fetching nutrition data"],
        isNutritionLoaded: true,
      }));
    }
  };

  const fetchSupermarket = async () => {
    if (dataState.isSuperMarketLoaded) return; 
    
    try {
      const response = await axios.get('http://localhost:5050/api/supermarkets/supermarket_data');
      console.log("supermarket_fetch success!");
      setDataState(prev => ({
        ...prev,
        superMarket: response.data,
        isSuperMarketLoaded: true,
      }));
    } catch (error) {
      console.log("supermarket_fetch error");
      setDataState(prev => ({
        ...prev,
        superMarket: ["error fetching superMarket data"],
        isSuperMarketLoaded: true,
      }));
    }
  };

  const loadProfile = async () => {
    if (dataState.isProfileLoaded) return; 
    
    try {
      const profileData = await dispatch(getProfile());
      console.log("profile")
      console.log(profileData)
      console.log("name")
      console.log(authState.user)
      
      const updatedProfile = {
        name: authState.user?.name || "",
        age: profileData.age || "",
        gender: profileData.gender || "",
        height: profileData.height || "",
        weight: profileData.weight || "",
        dailyBudget: profileData.dailyBudget || "",
        dietaryPreferences: profileData.dietaryPreferences || "",
        allergies: profileData.allergies?.join(", ") || ""
      };

      setProfile(updatedProfile);
      setDataState(prev => ({
        ...prev,
        isProfileLoaded: true,
      }));
      console.log("Profile data updated:", updatedProfile);
    } catch (error) {
      console.log("Error fetching profile data:", error);
      setProfile(prev => ({ ...prev, message: "error reading data" }));
      setDataState(prev => ({
        ...prev,
        isProfileLoaded: true,
      }));
    }
  };

  useEffect(() => {
    if (!isInitialized.current) {
      const initializeData = async () => {
        await Promise.all([
          fetchNutrition(),
          fetchSupermarket(),
          loadProfile()
        ]);
      };

      initializeData();
      isInitialized.current = true;
    }
  }, [authState, dispatch]);

  useEffect(() => {
    console.log("auth_data")
    console.log(authState)
  }, [authState, dispatch]);

  useEffect(() => {
    const initializeChat = async () => {
      if (!dataState.isNutritionLoaded || 
          !dataState.isSuperMarketLoaded || 
          !dataState.isProfileLoaded ||
          chatState.messages.length > 0) { 
        return;
      }

      const messageData = {
        nutrition_knowledge: JSON.stringify(dataState.nutrition),
        supermarket_list: JSON.stringify(dataState.superMarket),
        user_profile: JSON.stringify(profile)
      };

      console.log("Chat initialization data:", messageData);
      try {
        const response = await axios.post("http://localhost:5050/welloh/init", {
          userData: JSON.stringify(messageData)

        });
        setChatState(prev => ({
          ...prev,
          messages: response.data,
        }));
        console.log("chat_init success");
      } catch (error) {
        console.log("chat_init error");
        setChatState(prev => ({
          ...prev,
          messages: [{
            role: "system",
            content: "You are an AI assistant called Welloh, give people advice regarding health"
          }],
        }));
      }
    };

    initializeChat();
  }, [dataState.isNutritionLoaded, dataState.isSuperMarketLoaded, dataState.isProfileLoaded]);

  const handleSend = async () => {
    if (!chatState.input) return;
    
    const userMessage = { role: 'user', content: chatState.input + enhance };
    
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      input: '',
      isThinking: true,
      isNew: false,
    }));

    try {
      const response = await getChatGPTResponse([...chatState.messages, userMessage]);
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, { role: 'assistant', content: response }],
        isThinking: false,
      }));
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, { role: 'assistant', content: 'Sorry, something went wrong.' }],
        isThinking: false,
      }));
    }
  };

  const getChatGPTResponse = async (messagesNew) => {
    try {
      const response = await axios.post("http://localhost:5050/welloh/chat", {
        userMessage: messagesNew
      });
      console.log("Good GPT response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Error fetching GPT response:", error);
      return "Oops, some internal error occurred";
    }
  };

  return (
    <div className="faqs__page-wrapper">
      <div className="faqs__container">
        <div className="faqs__header">
          <h1 className="faqs__title">Welloh</h1>
        </div>
        <div className="faq-item">
          <h3>What is Welloh?</h3>
          <p>
            Welloh , your personal health assistant
          </p>
          <p>
            Welloh knows what you like , Welloh can tell what you need
          </p>
          <p>
            <strong>Welloh is not restricted to being a health assistant, talk to it whenever you like</strong>
          </p>
        </div>
        {dataState.isNutritionLoaded ? (
          <div className="faq-item">Nutrition data loaded</div>
        ) : (
          <div className="faq-item">Loading nutrition data...</div>
        )}
        {dataState.isSuperMarketLoaded ? (
          <div className="faq-item">Supermarket data loaded</div>
        ) : (
          <div className="faq-item">Loading supermarket data...</div>
        )}
        {dataState.isProfileLoaded ? (
          <div className="faq-item">Profile data loaded</div>
        ) : (
          <div className="faq-item">loading profile data...</div>
        )}
    <div className="chatbot-container">
      {/* <div className="chatbot-header">
        <div className="chatbot-icon"></div>
        <h2>Welloh Bot</h2>
      </div> }
      <div className="chatbot-messages">
        {chatState.messages.map((message, index) => (
          (index !== 0 && index !== 1) && (
            <div key={index} className={`message ${message.role}`}>
              {message.role !== "user" 
                ? <ReactMarkdown>{message.content}</ReactMarkdown>
                : <ReactMarkdown>{message.content.slice(0, -enhance.length)}</ReactMarkdown>}
            </div>
          )
        ))}
        {chatState.isThinking && <div className="thinking-animation">...</div>}
        {/* {chatState.isNew && <div className='chatbot-greeting'>WELLOH</div>} }
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={chatState.input}
          onChange={(e) => setChatState(prev => ({ ...prev, input: e.target.value }))}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Welloh;

*/
