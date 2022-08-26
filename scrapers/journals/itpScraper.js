const scraperObject = {
    url: 'https://www.emeraldgrouppublishing.com/journal/itp#calls-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'networkidle2' });

        return await page.$$eval('div#calls-for-papers a', items => items.map(item => {
            return {
                title: item.textContent,
                url: item.href,
                dueDate: null,
                journal: 'Information Technology & People',
                abbreviation: 'itp'
            }
        }));
    }
}

module.exports = scraperObject;