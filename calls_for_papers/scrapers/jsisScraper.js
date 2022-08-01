const scraperObject = {
    url: 'https://www.sciencedirect.com/journal/the-journal-of-strategic-information-systems/about/call-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'networkidle2' });

        return await page.$$eval('h3 b', items => items.map(item => {
            return {
                title: item.textContent,
                url: 'https://www.sciencedirect.com/journal/the-journal-of-strategic-information-systems/about/call-for-papers',
                dueDate: null,
                journal: 'The Journal of Strategic Information Systems',
                abbreviation: 'jsis'
            }
        }));
    }
}

module.exports = scraperObject;