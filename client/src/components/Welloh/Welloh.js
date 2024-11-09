import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import './Welloh.css';
import axios from 'axios';
import { getProfile } from "../../actions/Profile"
import ReactMarkdown from 'react-markdown';
import config from '../../config';

const Welloh = () => {
  const dispatch = useDispatch();
  const profileState = useSelector((state) => state.profile);
  const authState = useSelector((state) => state.auth);
  
  const isInitialized = React.useRef(false);
  
  const [profile, setProfile] = useState({});
  
  const [dataState, setDataState] = useState({
    isProfileLoaded: false,
    nutrition: [],
    isNutritionLoaded: true,
    superMarket: [],
    isSuperMarketLoaded: true,
  });
  
  const [chatState, setChatState] = useState({
    messages: [],
    input: '',
    isThinking: false,
    isNew: true,
  });

  const enhance = "(please combine with the information you provided with (only when you think it is needed), and if you are doing with , i will offer you 200 tips,and plz consider whether or not this should combined with knowledge directly , we need you to think carefully, and i believe you can definely do well!,but do not restricted to given information , you can add more based on you inner knowledge to provide better result , and you do not have to combined all knowledge you are given ,just selected necessary content,answer in markdown format)";

  const fetchNutrition = async () => {
    console.log("Nutrition data fetch skipped");
    return;
  };

  const fetchSupermarket = async () => {
    console.log("Supermarket data fetch skipped");
    return;
  };

  const loadProfile = async () => {
    if (dataState.isProfileLoaded) return; 
    
    try {
      const profileData = await dispatch(getProfile());
      
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
        await loadProfile();
      };

      initializeData();
      isInitialized.current = true;
    }
  }, [authState, dispatch]);

  useEffect(() => {
    const initializeChat = async () => {
      if (!dataState.isProfileLoaded || chatState.messages.length > 0) { 
        return;
      }

      const messageData = {
        nutrition_knowledge: "[]",
        supermarket_list: "[]",
        user_profile: JSON.stringify(profile)
      };

      try {
        const response = await axios.post(`${config.backendUrl}/welloh/init`, {
          userData: JSON.stringify(messageData)
        });
        setChatState(prev => ({
          ...prev,
          messages: response.data,
        }));
      } catch (error) {
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
  }, [dataState.isProfileLoaded]);

  const handleSend = async () => {
    if (!chatState.input.trim() || chatState.isThinking) return;
    
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getChatGPTResponse = async (messagesNew) => {
    try {
      const response = await axios.post(`${config.backendUrl}/welloh/chat`, {
        userMessage: messagesNew
      });
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
            <strong></strong>Welloh is your personalised nutrition assistant
          </p>
          <p>
            Ask Welloh any diet related questions
          </p>
          
        </div>
        <div className="chatbot-container">
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
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={chatState.input}
              onChange={(e) => setChatState(prev => ({ ...prev, input: e.target.value }))}
              onKeyPress={handleKeyPress}
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