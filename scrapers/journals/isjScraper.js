const scraperObject = {
    url: 'https://onlinelibrary.wiley.com/page/journal/13652575/homepage/special_issues.htm',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);

        return await page.$$eval('table tr td a', items => items.map(item => {
            return {
                title: item.textContent,
                url: item.href,
                dueDate: null,
                journal: 'Information Systems Journal',
                abbreviation: 'isj'
            }
        }));
    }
}

module.exports = scraperObject;