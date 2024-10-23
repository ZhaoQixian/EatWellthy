import React from "react";

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="loading">Loading...</div>
      <style jsx="true">{`
        .spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .loading {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default Spinner;