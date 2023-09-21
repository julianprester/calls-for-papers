const scraperObject = {
    url: 'https://www.tandfonline.com/journals/tjis20',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);

        return await page.$$eval('div.cfpContent a', items => items.map(item => {
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