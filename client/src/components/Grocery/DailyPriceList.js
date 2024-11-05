import React from "react";
import fairpriceLogo from "../../img/fairprice-logo.jpg";
import giantLogo from "../../img/giant-logo.png";
import coldstorageLogo from "../../img/coldstorage-logo.png";
import shengsiongLogo from "../../img/shengsiong-logo.png";
import primeLogo from "../../img/prime-logo.jpg";
import moreLogo from "../../img/more.png";
import "./DailyPriceList.css";

const SupermarketShowcase = () => {
  const supermarkets = [
    {
      id: "fairprice",
      name: "FairPrice",
      url: "https://www.fairprice.com.sg/",
      description:
        "Wide range of healthy options and organic produce at budget-friendly prices.",
      logo: fairpriceLogo,
      isClickable: true,
    },
    {
      id: "giant",
      name: "Giant",
      url: "https://giant.sg/",
      description:
        "Fresh fruits, vegetables, and lean proteins at great value prices.",
      logo: giantLogo,
      isClickable: true,
    },
    {
      id: "coldstorage",
      name: "Cold Storage",
      url: "https://coldstorage.com.sg/",
      description:
        "Premium selection of organic produce and specialty health foods.",
      logo: coldstorageLogo,
      isClickable: true,
    },
    {
      id: "shengsiong",
      name: "Sheng Siong",
      url: "https://shengsiong.com.sg/",
      description:
        "Fresh produce and healthy Asian ingredients at competitive prices.",
      logo: shengsiongLogo,
      isClickable: true,
    },
    {
      id: "prime",
      name: "Prime",
      url: "https://www.primesupermarket.com/",
      description:
        "Local neighborhood supermarket offering fresh groceries and daily essentials at affordable prices.",
      logo: primeLogo,
      isClickable: true,
    },
    {
      id: "more",
      name: "More Coming Soon",
      description: "Stay tuned for more healthy shopping options.",
      logo: moreLogo,
      isClickable: false,
    },
  ];

  return (
    <div className="showcase-container">
      <div className="showcase-content">
        {/* Header Section */}
        <div className="showcase-header">
          <h1>Eat Well and Healthy</h1>
          <p>
            Find all your healthy ingredients at these trusted supermarkets.
          </p>
          <p>
            Each store offers quality products to support your wellness journey.
          </p>
        </div>

        {/* Supermarket Grid */}
        <div className="supermarket-grid">
          {supermarkets.map((market) => (
            <div key={market.id} className="supermarket-card">
              <div className="card-content">
                {market.isClickable ? (
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
                ) : (
                  <div className="logo-link">
                    <img
                      src={market.logo}
                      alt={market.name}
                      className="supermarket-logo"
                    />
                  </div>
                )}

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
          <p>
            Visit store websites for current promotions on healthy products and
            fresh ingredients.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupermarketShowcase;
