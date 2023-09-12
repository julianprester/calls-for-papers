const scraperObject = {
    url: 'https://www.emeraldgrouppublishing.com/journal/itp',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'networkidle2' });

        return await page.$$eval('div.card__cfp', items => items.map(item => {
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