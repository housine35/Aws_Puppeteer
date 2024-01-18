'use strict';

const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');

module.exports.hello = async (event) => {
  try {
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    
    const page = await browser.newPage();

    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (
        req.resourceType() === 'image' ||
        req.resourceType() === 'video' ||
        req.resourceType() === 'stylesheet'
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    
    const userAgent = randomUseragent.getRandom();
    await page.setUserAgent(userAgent);

    
    await page.goto('https://www.ebay.com');

    
    const screenshot = await page.screenshot();

    
    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Puppeteer executed successfully!',
        screenshot: screenshot.toString('base64'),
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error executing Puppeteer.',
        error: error.message,
      }),
    };
  }
};
