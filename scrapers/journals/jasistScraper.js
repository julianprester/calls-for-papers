const scraperObject = {
    url: 'https://asistdl.onlinelibrary.wiley.com/journal/23301643',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url);

        return await page.$$eval('div.journal-resources ul li a[href^="/pb-assets/"]', items => items.map(item => {
            return {
                title: item.textContent,
                url: item.href,
                dueDate: null,
                journal: 'Journal of the Association for Information Science and Technology',
                abbreviation: 'jasist'
            }
        }));
    }
}

module.exports = scraperObject;