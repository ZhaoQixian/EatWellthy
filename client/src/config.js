// client/src/config.js
const config = {
    backendUrl: process.env.NODE_ENV === 'production'
      ? 'https://eatwellthy-backend.onrender.com'  // your Render backend URL
      : 'http://localhost:5050',
    defaultErrorMsg: 'An error occurred. Please try again.'
  };
  
  export default config;