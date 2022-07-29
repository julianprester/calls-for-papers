const scraperObject = {
    url: 'URL GOES HERE',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'networkidle2' });

        return await page.$$eval('QUERY SELECTOR PATTERN GOES HERE', items => items.map(item => {
            return {
                title: 'TITLE GOES HERE',
                url: 'URL GOES HERE',
                dueDate: 'DUE DATE GOES HERE',
                journal: 'JOURNAL NAME GOES HERE',
                abbreviation: 'JOURNAL ABBREVIATION GOES HERE'
            }
        }));
    }
}

module.exports = scraperObject;