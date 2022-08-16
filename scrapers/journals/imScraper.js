const scraperObject = {
    url: 'https://www.journals.elsevier.com/information-and-management/call-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'networkidle2' });

        return await page.$$eval('main h3', items => items.map(item => {
            return {
                title: item.textContent,
                url: 'https://www.journals.elsevier.com/information-and-management/call-for-papers#' + item.id,
                dueDate: null,
                journal: 'Information and Management',
                abbreviation: 'im'
            }
        }));
    }
}

module.exports = scraperObject;