import React from 'react';
import './DailyPriceList.css';

const DailyPriceList = () => {
  const supermarkets = [
    {
      id: "fairprice",
      name: "FairPrice",
      url: "https://www.fairprice.com.sg/",
      logo: "/images/fairprice-logo.png"
    },
    {
      id: "giant",
      name: "Giant",
      url: "https://giant.sg/",
      logo: "/images/giant-logo.png"
    },
    {
      id: "coldstorage",
      name: "Cold Storage",
      url: "https://coldstorage.com.sg/",
      logo: "/images/coldstorage-logo.png"
    },
    {
      id: "shengsiong",
      name: "Sheng Siong",
      url: "https://shengsiong.com.sg/",
      logo: "/images/shengsiong-logo.png"
    }
  ];

  return (
    <div className="supermarket-grid">
      {supermarkets.map(market => (
        <a 
          key={market.id}
          href={market.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="supermarket-link"
        >
          <img
            src={market.logo}
            alt={market.name}
            className="supermarket-logo"
          />
          <span className="supermarket-name">{market.name}</span>
        </a>
      ))}
    </div>
  );
};

export default DailyPriceList;




/*
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSupermarkets } from '../actions/supermarkets';
import axios from 'axios';

const DailyPriceList = ({ getSupermarkets, supermarketState }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scrapeResult, setScrapeResult] = useState(null);

  useEffect(() => {
    getSupermarkets(); // Fetch supermarkets when the component mounts
  }, [getSupermarkets]);

  const { supermarkets, loading } = supermarketState;

  // Add this console log to check if data is fetched correctly
  useEffect(() => {
    console.log(supermarkets);
  }, [supermarkets]);

  const handleScrape = async () => {
    setIsLoading(true);
    setScrapeResult(null);
    try {
      const response = await axios.post('http://localhost:5050/api/scrape/fairprice');
      setScrapeResult(response.data);
      getSupermarkets(); // Refresh the supermarket data after scraping
    } catch (error) {
      console.error('Error during scraping:', error);
      setScrapeResult({ error: 'An error 2 occurred during scraping' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{paddingTop: "4rem", paddingLeft: "1.2rem", paddingRight: "1.2rem"}}>
      <h1>Daily Price List</h1>

      <div>
        <h2>Scraping Controls</h2>
        <button onClick={handleScrape} disabled={isLoading}>
          {isLoading ? 'Scraping...' : 'Start Scraping'}
        </button>
        {scrapeResult && (
          <div>
            {scrapeResult.error ? (
              <p>Error: {scrapeResult.error}</p>
            ) : (
              <p>{scrapeResult.message} ({scrapeResult.count} products)</p>
            )}
          </div>
        )}
      </div>

      <p>Here are the available supermarket brands:</p>






      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {supermarkets.map((supermarket) => (
            <li key={supermarket._id}>
              <h3>{supermarket.name}</h3>
              <ul>
                {supermarket.food_items.map((item, index) => (
                  <li key={index}>
                    {item.specific_name} - ${item.price.toFixed(2)} ({item.description})
                  </li>
                ))}
              </ul>
            </li>
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
  supermarketState: state.supermarkets, // Access supermarket state from Redux
});

export default connect(mapStateToProps, { getSupermarkets })(DailyPriceList);*/