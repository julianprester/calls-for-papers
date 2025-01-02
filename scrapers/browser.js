const { connect } = require('puppeteer-real-browser');

async function startBrowser() {
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

module.exports = {
    startBrowser
};