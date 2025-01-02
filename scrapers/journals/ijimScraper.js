const scraperObject = {
    url: 'https://www.sciencedirect.com/journal/international-journal-of-information-management/about/call-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url);
        const correctPage = await page.$$eval('h2[aria-label="Call for papers"]', elements => elements.length > 0);
        if (!correctPage) {
            return [];
        }

        return await page.$$eval('main h3', items => items.map(item => {
            return {
                title: item.textContent,
                url: 'https://www.sciencedirect.com/journal/international-journal-of-information-management/about/call-for-papers#' + item.id,
                dueDate: null,
                journal: 'International Journal of Information Management',
                abbreviation: 'ijim'
            }
        }));
    }
}

module.exports = scraperObject;