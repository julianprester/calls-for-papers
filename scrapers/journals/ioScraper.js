const scraperObject = {
    url: 'https://www.sciencedirect.com/journal/information-and-organization/about/call-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url);
        if (await page.locator('h2[aria-label="Call for papers"]').count() == 0) {
            return [];
        }

        return await page.$$eval('main h3', items => items.map(item => {
            return {
                title: item.textContent,
                url: 'https://www.sciencedirect.com/journal/information-and-organization/about/call-for-papers#' + item.id,
                dueDate: null,
                journal: 'Information and Organization',
                abbreviation: 'io'
            }
        }));
    }
}

module.exports = scraperObject;