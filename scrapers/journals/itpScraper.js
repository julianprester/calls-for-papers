const scraperObject = {
    url: 'https://www.emeraldgrouppublishing.com/journal/itp',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url);

        return await page.$$eval('div#journal_cfp div.card__cfp', items => items.map(item => {
            return {
                title: item.querySelector('div.card__cfp--content h2').textContent,
                url: item.querySelector('a').href,
                dueDate: null,
                journal: 'Information Technology & People',
                abbreviation: 'itp'
            }
        }));
    }
}

module.exports = scraperObject;