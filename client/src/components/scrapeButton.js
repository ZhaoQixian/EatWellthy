import React, { useState } from 'react';
import axios from 'axios';

const ScrapeButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScrape = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await axios.post('http://localhost:5050/api/scrape/fairprice');
      setResult(response.data);
    } catch (error) {
      console.error('Error during scraping:', error);
      setResult({ error: 'An error 3 occurred during scraping' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleScrape} disabled={isLoading}>
        {isLoading ? 'Scraping...' : 'Start Scraping'}
      </button>
      {result && (
        <div>
          {result.error ? (
            <p>Error: {result.error}</p>
          ) : (
            <p>{result.message} ({result.count} products)</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScrapeButton;