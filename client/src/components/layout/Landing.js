// Landing.js
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./Landing.css";

const Landing = ({ auth }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate();
  }, []);

  const features = [
    {
      title: "Custom Meals",
      description: "Personalized nutrition plans",
      backDescription: "AI-powered meal plans tailored to your preferences and goals"
    },
    {
      title: "Track Progress",
      description: "Monitor your journey",
      backDescription: "Visual analytics to track your nutrition and health goals"
    },
    {
      title: "AI Chatbot",
      description: "Your best helper",
      backDescription: "Instant nutrition advice from Welloh, your own AI assistant"
    },
    {
      title: "Store Locator",
      description: "Find grocery easily",
      backDescription: "Discover nearby grocery stores conveniently"
    }
  ];

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1>Welcome to EatWellthy</h1>
          <div className="feature-cards">
            {features.map((feature, index) => (
              <div className="flip-card" key={index}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                  <div className="flip-card-back">
                    <p>{feature.backDescription}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="buttons">
            <Link to="/register" className="btn">
              Register
            </Link>
            <Link to="/login" className="btn">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Landing);