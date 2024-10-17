const express = require('express');
const router = express.Router();
const { scrapeFairPrice } = require('../fairpriceScraper');
const createSupermarketModel = require('../models/Supermarket');

let Supermarket;

router.post('/fairprice', async (req, res) => {
  try {
    if (!Supermarket) {
      Supermarket = createSupermarketModel();
    }

    const scrapedProducts = await scrapeFairPrice();
    
    const fairprice = await Supermarket.findOne({ name: 'FairPrice' });
    
    if (!fairprice) {
      return res.status(404).json({ error: 'FairPrice not found in the database' });
    }

    fairprice.food_items = scrapedProducts;
    await fairprice.save();

    res.json({ message: 'Scraping completed and data saved', count: scrapedProducts.length });
  } catch (error) {
    console.error('Error in scraping route:', error);
    res.status(500).json({ error: 'An error 1 occurred during scraping' });
  }
});

module.exports = router;