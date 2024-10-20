import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

StealthPlugin().enabledEvasions.delete('iframe.contentWindow')
chromium.use(StealthPlugin())

export async function startBrowser() {
    let browser;
    try {
        console.log("Opening the browser...")
        browser = await chromium.launch({
            headless: true,
            ignoreHTTPSErrors: true,
            args: [
                "--no-sandbox",
                "--window-size=1920,1080"
            ],
            defaultViewport: {
                width: 1920,
                height: 1080
            }
        })
    } catch (err) {
        console.log("Could not create a browser instance => : ", err)
    }
    return browser
}
