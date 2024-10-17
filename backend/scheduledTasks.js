const cron = require('node-cron');
const { scrapeFairPrice } = require('./fairpriceScraper');
const Supermarket = require('./models/Supermarket');

function setupScheduledTasks() {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily scrape');
    try {
      const scrapedProducts = await scrapeFairPrice();
      const fairprice = await Supermarket.findOne({ name: 'FairPrice' });
      
      if (!fairprice) {
        console.error('FairPrice not found in the database');
        return;
      }

      fairprice.food_items = scrapedProducts;
      await fairprice.save();

      console.log('Daily scrape completed');
    } catch (error) {
      console.error('Error in daily scrape:', error);
    }
  });
}

module.exports = { setupScheduledTasks };