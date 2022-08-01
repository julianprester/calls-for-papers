const scraperObject = {
    url: 'https://orsociety.tandfonline.com/action/newsAndOffers?journalCode=tjis20',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'networkidle2' });

        return await page.$$eval('div.call-paper-widget > h2 + a', items => items.map(item => {
            return {
                title: item.textContent,
                url: item.href,
                dueDate: null,
                journal: 'European Journal of Information Systems',
                abbreviation: 'ejis'
            }
        }));
    }
}

module.exports = scraperObject;