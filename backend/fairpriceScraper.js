const puppeteer = require('puppeteer');

async function scrapeFairPrice() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to FairPrice stone fruits category...');
    await page.goto('https://www.fairprice.com.sg/category/stone-fruits', { waitUntil: 'networkidle0', timeout: 60000 });
    console.log('Page loaded. Waiting for 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));  // Wait for 5 seconds after page load

    console.log('Extracting product information...');
    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.sc-e68f503d-0.kxZjUB.product-container');
      return Array.from(productElements).slice(0, 10).map(element => {
        const nameElement = element.querySelector('[data-testid="product-name-and-metadata"] .sc-aa673588-1.iCYFVg');
        const priceElement = element.querySelector('.sc-aa673588-1.sc-65bf849-1.kdTuLI.cXCGWM');
        const weightElement = element.querySelector('.sc-aa673588-1.cIXEsR');
        
        return {
          name: nameElement ? nameElement.textContent.trim() : 'Name not found',
          price: priceElement ? priceElement.textContent.trim() : 'Price not found',
          weight: weightElement ? weightElement.textContent.trim() : 'Weight not found'
        };
      });
    });

    console.log(`Extracted ${products.length} products.`);
    return products;
  } catch (error) {
    console.error('Error scraping FairPrice:', error);
    return [];
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeFairPrice };