const { scrapeFairPrice } = require('./fairpriceScraper');

async function testScraper() {
  try {
    console.log('Starting to scrape FairPrice stone fruits category...');
    const products = await scrapeFairPrice();
    console.log(`Scraped ${products.length} products:`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Price: ${product.price}`);
      console.log(`   Weight: ${product.weight}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error testing scraper:', error);
  }
}

testScraper();