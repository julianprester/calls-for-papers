export const scraperObject = {
    url: 'https://www.sciencedirect.com/journal/international-journal-of-information-management/about/call-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url);
        if (await page.locator('h2[aria-label="Call for papers"]').count() == 0) {
            return [];
        }

        return await page.$$eval('main div:has(> h3)', items => items.map(item => {
            return {
                journal: 'International Journal of Information Management',
                abbreviation: 'ijim',
                metaTitle: item.querySelector('h3').textContent,
                url: 'https://www.sciencedirect.com/journal/international-journal-of-information-management/about/call-for-papers#' + item.querySelector('h3').id,
                rawContent: item.innerHTML,
            }
        }));
    }
}

