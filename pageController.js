const jaisScraper = require('./scrapers/jaisScraper');
const ejisScraper = require('./scrapers/ejisScraper');
const isjScraper = require('./scrapers/isjScraper');
const isrScraper = require('./scrapers/isrScraper');
const jitScraper = require('./scrapers/jitScraper');
const jmisScraper = require('./scrapers/jmisScraper');
const jsisScraper = require('./scrapers/jsisScraper');
const misqScraper = require('./scrapers/misqScraper');
const ioScraper = require('./scrapers/ioScraper');
const imScraper = require('./scrapers/imScraper');
const fs = require('fs');

async function scrapeAll(browserInstance) {
    let browser;
    try {
        browser = await browserInstance;
        let issues = [];
        issues = issues.concat(await jaisScraper.scraper(browser));
        issues = issues.concat(await ejisScraper.scraper(browser));
        issues = issues.concat(await isjScraper.scraper(browser));
        issues = issues.concat(await isrScraper.scraper(browser));
        issues = issues.concat(await jitScraper.scraper(browser));
        issues = issues.concat(await jmisScraper.scraper(browser));
        issues = issues.concat(await jsisScraper.scraper(browser));
        issues = issues.concat(await misqScraper.scraper(browser));
        issues = issues.concat(await ioScraper.scraper(browser));
        issues = issues.concat(await imScraper.scraper(browser));
        await browser.close();
        fs.writeFile("data.json", JSON.stringify(issues), 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The data has been scraped and saved successfully! View it at 'data.json'");
        });
    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)