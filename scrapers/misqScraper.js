const scraperObject = {
    url: 'https://misq.umn.edu/about',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'networkidle2' });

        return await page.$$eval('div.column.main hr:nth-of-type(9) ~ p a', items => items.map(item => {
            return {
                title: item.textContent,
                url: item.href,
                dueDate: null,
                journal: 'MIS Quarterly',
                abbreviation: 'misq'
            }
        }));
    }
}

module.exports = scraperObject;