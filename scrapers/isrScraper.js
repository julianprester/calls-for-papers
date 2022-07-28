const scraperObject = {
    url: 'https://pubsonline.informs.org/page/isre/calls-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'networkidle2' });

        return await page.$$eval('div.col-sm-9 h2', items => items.map(item => {
            return {
                title: item.textContent,
                url: 'https://pubsonline.informs.org/page/isre/calls-for-papers',
                dueDate: null,
                journal: 'Information Systems Research',
                abbreviation: 'isr'
            }
        }));
    }
}

module.exports = scraperObject;