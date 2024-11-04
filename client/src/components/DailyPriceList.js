import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSupermarkets } from '../actions/supermarkets';
import axios from 'axios';
import './DailyPriceList.css';

// Import images - adjust these paths as needed
import fairpriceLogo from '../img/fairprice-logo.png';
import giantLogo from '../img/giant-logo.png';
import coldstorageLogo from '../img/coldstorage-logo.png';
import shengsiongLogo from '../img/shengsiong-logo.png';

const DailyPriceList = ({ getSupermarkets, supermarketState }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scrapeResult, setScrapeResult] = useState(null);

  const supermarkets = [
    {
      id: "fairprice",
      name: "FairPrice",
      url: "https://www.fairprice.com.sg/",
      logo: fairpriceLogo
    },
    {
      id: "giant",
      name: "Giant",
      url: "https://giant.sg/",
      logo: giantLogo
    },
    {
      id: "coldstorage",
      name: "Cold Storage",
      url: "https://coldstorage.com.sg/",
      logo: coldstorageLogo
    },
    {
      id: "shengsiong",
      name: "Sheng Siong",
      url: "https://shengsiong.com.sg/",
      logo: shengsiongLogo
    }
  ];

  useEffect(() => {
    getSupermarkets(); // Fetch supermarkets when component mounts
  }, [getSupermarkets]);

  const { loading } = supermarketState;

  // Add this console log to check if data is fetched correctly
  useEffect(() => {
    console.log(supermarketState.supermarkets);
  }, [supermarketState.supermarkets]);

  const handleScrape = async () => {
    setIsLoading(true);
    setScrapeResult(null);
    try {
      const response = await axios.post('http://localhost:5050/api/scrape/fairprice');
      setScrapeResult(response.data);
      getSupermarkets(); // Refresh the supermarket data after scraping
    } catch (error) {
      console.error('Error during scraping:', error);
      setScrapeResult({ error: 'An error occurred during scraping' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 mt-16">
      <h1 className="text-2xl font-bold mb-4">Daily Price List</h1>

      {/* Scraping Controls */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Scraping Controls</h2>
        <button 
          onClick={handleScrape} 
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isLoading ? 'Scraping...' : 'Start Scraping'}
        </button>
        {scrapeResult && (
          <div className="mt-2">
            {scrapeResult.error ? (
              <p className="text-red-500">Error: {scrapeResult.error}</p>
            ) : (
              <p className="text-green-500">
                {scrapeResult.message} ({scrapeResult.count} products)
              </p>
            )}
          </div>
        )}
      </div>

      {/* Supermarket Grid */}
      <p className="mb-4">Here are the available supermarket brands:</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {supermarkets.map(market => (
          <a 
            key={market.id}
            href={market.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <img
              src={market.logo}
              alt={market.name}
              className="h-16 w-auto object-contain mb-2"
            />
            <span className="text-center font-medium">{market.name}</span>
          </a>
        ))}
      </div>

      {/* Product List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-6">
          {supermarketState.supermarkets.map((supermarket) => (
            <li key={supermarket._id} className="border-t pt-4">
              <h3 className="text-xl font-semibold mb-2">{supermarket.name}</h3>
              <ul className="space-y-2">
                {supermarket.food_items.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="flex-1">{item.specific_name}</span>
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                    <span className="text-gray-600 ml-2">({item.description})</span>
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
  supermarketState: state.supermarkets,
});

export default connect(mapStateToProps, { getSupermarkets })(DailyPriceList);

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