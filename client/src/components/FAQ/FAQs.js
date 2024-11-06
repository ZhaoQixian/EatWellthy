import React from "react";
import "./FAQs.css"; // importing CSS file for styling

const FAQs = () => {
  return (
    <div className="faqs__page-wrapper">
      <div className="faqs__container">
        <div className="faqs__header">
          <h1 className="faqs__title">FAQs</h1>
          <p className="faqs__description">
            Welcome to the FAQs page! Here are some common questions about how
            our platform works:
          </p>
        </div>

        <div className="faq-item">
          <h3>How do I input my meals and diet preferences?</h3>
          <p>
            You can easily input your meals and dietary preferences in the
            dashboard. Once you've logged in, navigate to the 'Tracker' section
            to select or manually enter your meals, along with specific dietary
            preferences (e.g., vegetarian, keto, etc.) in your 'Profile'.
          </p>
        </div>

        <div className="faq-item">
          <h3>What information does the 'Tracker' provide?</h3>
          <p>
            The 'Tracker' shows a detailed breakdown of your daily calorie
            intake, macronutrients (carbs, fats, proteins), and other
            nutritional values. You can view your meal history, compare daily
            totals, and see how they align with your goals for the day.
          </p>
        </div>

        <div className="faq-item">
          <h3>How do I view my progress and calorie summary?</h3>
          <p>
            The dashboard provides a 'Progress Tracking' section that shows your
            caloric summary, including your target, consumed, and remaining
            calories for the day. It also includes weight tracking for
            monitoring your progress.
          </p>
        </div>
        <div className="faq-item">
          <h3>
            Can I check the prices of ingredients before adding them to my plan?
          </h3>
          <p>
            Yes, you can! Our platform is integrated with Amazon Fresh, Giant,
            and other stores to provide real-time price information. Visit the
            'Grocery' section on the sidebar to see the availability and pricing
            of items at nearby stores.
          </p>
        </div>

        <div className="faq-item">
          <h3>What is Welloh, and how does the chatbot work?</h3>
          <p>
            WellOh is our AI-powered chatbot designed to help you with meal
            planning, nutrition advice, and more. You can ask WellOh about meal
            suggestions, nutritional information, or store availability, and it
            will assist you with real-time responses.
          </p>
        </div>
        <div className="faq-item">
          <h3>How do I manage events and track my schedule?</h3>
          <p>
            The 'Calendar' feature lets you add, update, and delete events
            related to your meal plan or health goals. You can even sync events
            to Google Calendar to keep track of your diet suggestions and
            progress easily.
          </p>
        </div>
        <div className="faq-item">
          <h3>How do I customize my profile and diet plan?</h3>
          <p>
            In the 'Profile' section, update your personal details, set your
            target weight, daily budget, and activity level. Choose from diet
            plans like vegetarian and specify any dietary restrictions or
            allergies to receive meal suggestions tailored to your needs.
          </p>
        </div>

        <div className="faq-item">
          <h3>How can I track my BMI and BMR?</h3>
          <p>
            The 'Analysis' section provides your BMI and BMR based on your
            profile details. These values guide you in setting achievable health
            goals and maintaining a balanced diet.
          </p>
        </div>

        <div className="faq-item">
          <h3>Can I access the platform from anywhere?</h3>
          <p>
            Yes! Our website is optimized for both desktop and mobile, and the
            location feature helps you find stores nearby based on your current
            location. This ensures you always have access to the latest meal
            options and prices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
