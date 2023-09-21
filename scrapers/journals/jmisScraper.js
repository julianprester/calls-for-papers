const scraperObject = {
    url: 'https://www.jmis-web.org/cfp',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);

        return await page.$$eval('p', items => items.map(item => {
            return {
                title: item.textContent,
                url: item.querySelector('a').href,
                dueDate: null,
                journal: 'Journal of Management Information Systems',
                abbreviation: 'jmis'
            }
        }));
    }
}

module.exports = scraperObject;