import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { integrateCalls } from './diffChecker.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function scrapeAll(browserInstance) {
    let browser;
    try {
        browser = await browserInstance;
        const folderPath = path.join(__dirname, 'journals');
        const files = await fs.readdir(folderPath);

        const modules = await Promise.all(
            files
                .filter(file => path.extname(file) === '.mjs')
                .map(file => import(path.join(folderPath, file)))
        );

        const issues = await Promise.all(
            modules.map(async module => {
                const calls = await module.scraperObject.scraper(browser);
                console.log(`Found ${calls.length} calls at ${module.scraperObject.url}`);
                return calls;
            })
        ).then(results => results.flat());

        await integrateCalls(issues);
    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
    finally {
        if (browser) await browser.close()
    }
}
