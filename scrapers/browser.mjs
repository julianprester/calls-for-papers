import { connect } from 'puppeteer-real-browser';

export async function startBrowser() {
    const { _, browser } = await connect({
        headless: false,
        args: [],
        customConfig: {},
        turnstile: true,
        connectOption: {},
        disableXvfb: false,
        ignoreAllFlags: false
    });
    return browser;
}
