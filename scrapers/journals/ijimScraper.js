const scraperObject = {
    url: 'https://www.journals.elsevier.com/international-journal-of-information-management/call-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);

        return await page.$$eval('main h3', items => items.map(item => {
            return {
                title: item.textContent,
                url: 'https://www.journals.elsevier.com/international-journal-of-information-management/call-for-papers#' + item.id,
                dueDate: null,
                journal: 'International Journal of Information Management',
                abbreviation: 'ijim'
            }
        }));
    }
}

module.exports = scraperObject;