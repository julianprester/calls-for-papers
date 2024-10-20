import { startBrowser } from './browser.mjs';
import { scrapeAll } from './pageController.mjs';

//Start the browser and create a browser instance
let browserInstance = startBrowser();

// Pass the browser instance to the scraper controller
scrapeAll(browserInstance)