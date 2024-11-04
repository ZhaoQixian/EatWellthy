import React from 'react';
import fairpriceLogo from '../img/fairprice-logo.jpg';
import giantLogo from '../img/giant-logo.png';
import coldstorageLogo from '../img/coldstorage-logo.png';
import shengsiongLogo from '../img/shengsiong-logo.png';
import './DailyPriceList.css';

const SupermarketShowcase = () => {
  const supermarkets = [
    {
      id: "fairprice",
      name: "FairPrice",
      url: "https://www.fairprice.com.sg/",
      description: "Singapore's largest retailer, serving the community with affordable groceries and household essentials since 1973.",
      logo: fairpriceLogo
    },
    {
      id: "giant",
      name: "Giant",
      url: "https://giant.sg/",
      description: "Known for great value and low prices, Giant offers a wide range of fresh food and daily necessities.",
      logo: giantLogo
    },
    {
      id: "coldstorage",
      name: "Cold Storage",
      url: "https://coldstorage.com.sg/",
      description: "Premium supermarket chain offering high-quality fresh produce, gourmet products, and international selections.",
      logo: coldstorageLogo
    },
    {
      id: "shengsiong",
      name: "Sheng Siong",
      url: "https://shengsiong.com.sg/",
      description: "A trusted name in Singapore retail, providing fresh food and daily essentials at competitive prices.",
      logo: shengsiongLogo
    }
  ];

  return (
    <div className="showcase-container">
      <div className="showcase-content">
        {/* Header Section */}
        <div className="showcase-header">
          <h1>Singapore's Leading Supermarkets</h1>
          <p>Discover the best grocery shopping experiences across Singapore with our partner supermarkets.</p>
        </div>

        {/* Supermarket Grid */}
        <div className="supermarket-grid">
          {supermarkets.map((market) => (
            <div key={market.id} className="supermarket-card">
              <div className="card-content">
                <a 
                  href={market.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="logo-link"
                >
                  <img
                    src={market.logo}
                    alt={`${market.name} logo`}
                    className="supermarket-logo"
                  />
                </a>
                
                <div className="card-body">
                  <h2>{market.name}</h2>
                  <p>{market.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="showcase-footer">
          <p>Prices and availability may vary by location. Please visit individual store websites for the most up-to-date information.</p>
        </div>
      </div>
    </div>
  );
};

export default SupermarketShowcase;