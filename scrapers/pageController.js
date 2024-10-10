const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'journals');
const files = fs.readdirSync(folderPath);
const modules = files
    .filter(file => path.extname(file) === '.js')
    .map(file => require(path.join(folderPath, file)));

const dataPreparation = require('./dataPreparation');
const dataGenerator = require('./dataGenerator');

async function scrapeAll(browserInstance) {
    let browser;
    try {
        browser = await browserInstance;
        let issues = [];
        for (let module of modules) {
            const calls = await module.scraper(browser);
            console.log(`Found ${calls.length} calls at ${module.url}`);
            issues = issues.concat(calls);
        }
        await browser.close();
        issues = await dataPreparation(issues);
        dataGenerator(issues);
    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)