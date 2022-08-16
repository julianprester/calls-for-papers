const jaisScraper = require('./journals/jaisScraper');
const ejisScraper = require('./journals/ejisScraper');
const isjScraper = require('./journals/isjScraper');
const isrScraper = require('./journals/isrScraper');
const jitScraper = require('./journals/jitScraper');
const jmisScraper = require('./journals/jmisScraper');
const jsisScraper = require('./journals/jsisScraper');
const misqScraper = require('./journals/misqScraper');
const ioScraper = require('./journals/ioScraper');
const imScraper = require('./journals/imScraper');
const ijimScraper = require('./journals/ijimScraper');
const dssScraper = require('./journals/dssScraper');
const dataPreparation = require('./dataPreparation');
const feedGenerator = require('./feedGenerator');
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
        issues = issues.concat(await ijimScraper.scraper(browser));
        issues = issues.concat(await dssScraper.scraper(browser));
        await browser.close();
        issues = await dataPreparation(issues);
        fs.writeFile("./www/data.json", JSON.stringify(issues, null, 2), 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The data has been scraped and saved successfully! View it at 'data.json'");
        });
        feedGenerator(issues);
    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)