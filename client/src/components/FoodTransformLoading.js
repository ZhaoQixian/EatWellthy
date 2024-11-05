import React, { useEffect } from 'react';
import './LoadingAnimation.css';

const FoodTransformLoading = () => {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          <div className="progress-bar">
            <div className="progress-fill">
              {/* Moving food icons inside progress-fill */}
              <div className="moving-food">
                <div className="food-icon">
                  <span className="salad">🥗</span>
                  <span className="pear">🍐</span>
                  <span className="apple">🍎</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            
            <p className="text-lg text-gray-500 mt-3">
              Creating a balanced meal plan just for you...
            </p>
          </div>
        </div>
      </div>
    );
  };

export default FoodTransformLoading;