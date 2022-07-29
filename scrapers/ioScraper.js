const scraperObject = {
    url: 'https://www.journals.elsevier.com/information-and-organization/call-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'networkidle2' });

        return await page.$$eval('main > div > ul > li > article > a', items => items.map(item => {
            return {
                title: item.textContent,
                url: item.href,
                dueDate: null,
                journal: 'Information and Organization',
                abbreviation: 'io'
            }
        }));
    }
}

module.exports = scraperObject;