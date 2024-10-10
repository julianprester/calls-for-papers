const scraperObject = {
    url: 'https://onlinelibrary.wiley.com/page/journal/13652575/homepage/special_issues.htm',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url);

        return await page.$$eval('table tr', items => items.map(item => {
            return {
                title: item.querySelector('td:first-child a').textContent,
                url: item.querySelector('td:first-child a').href,
                dueDate: Date.parse(item.querySelector('td:last-child').textContent),
                journal: 'Information Systems Journal',
                abbreviation: 'isj'
            }
        }));
    }
}

module.exports = scraperObject;