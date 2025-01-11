export const scraperObject = {
    url: 'https://www.sciencedirect.com/journal/decision-support-systems/about/call-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url, { waitUntil: 'domcontentloaded' });
        const correctPage = await page.$$eval('h2[aria-label="Call for papers"]', elements => elements.length > 0);
        if (!correctPage) {
            return [];
        }

        return await page.$$eval('main div:has(> h3)', items => items.map(item => {
            return {
                journal: 'Decision Support Systems',
                abbreviation: 'dss',
                metaTitle: item.querySelector('h3').textContent,
                url: 'https://www.sciencedirect.com/journal/decision-support-systems/about/call-for-papers#' + item.querySelector('h3').id,
                rawContent: item.innerHTML,
            }
        }));
    }
}
