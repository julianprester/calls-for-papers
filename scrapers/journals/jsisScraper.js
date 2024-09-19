const scraperObject = {
    url: 'https://www.sciencedirect.com/journal/the-journal-of-strategic-information-systems/about/call-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}`);
        await page.goto(this.url);
        if (await page.locator('h2.section-heading').count() == 0) {
            return [];
        }

        return await page.$$eval('main h3', items => items.map(item => {
            return {
                title: item.textContent,
                url: 'https://www.sciencedirect.com/journal/the-journal-of-strategic-information-systems/about/call-for-papers#' + item.id,
                dueDate: null,
                journal: 'The Journal of Strategic Information Systems',
                abbreviation: 'jsis'
            }
        }));
    }
}

module.exports = scraperObject;