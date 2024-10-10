const scraperObject = {
    url: 'https://www.sciencedirect.com/journal/international-journal-of-information-management/about/call-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url);
        if (await page.locator('h2.section-heading').count() == 0) {
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