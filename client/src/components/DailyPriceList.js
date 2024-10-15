import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSupermarkets } from '../actions/supermarkets';  // Import the action

const DailyPriceList = ({ getSupermarkets, supermarketState }) => {
  useEffect(() => {
    getSupermarkets();  // Fetch supermarkets when the component mounts
  }, [getSupermarkets]);

  const { supermarkets, loading } = supermarketState;

  // Add this console log to check if data is fetched correctly
  useEffect(() => {
    console.log(supermarkets);
  }, [supermarkets]);

  return (
    <div style={{paddingTop : "4rem",paddingLeft : "1.2rem" , paddingRight:"1.2rem"}}>
      <h1>Daily Price List</h1>
      <p>Here are the available supermarket brands:</p>

      {/* Show a loading message if still loading */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {supermarkets.map((supermarket) => (
            <li key={supermarket._id}>{supermarket.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

DailyPriceList.propTypes = {
  getSupermarkets: PropTypes.func.isRequired,
  supermarketState: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  supermarketState: state.supermarkets,  // Access supermarket state from Redux
});

export default connect(mapStateToProps, { getSupermarkets })(DailyPriceList);
