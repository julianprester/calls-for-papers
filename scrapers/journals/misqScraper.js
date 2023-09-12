const scraperObject = {
    url: 'https://misq.umn.edu/',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, { timeout: 60000 });
        await page.hover('nav ul li:first-child');
        
        return await page.$$eval('nav ul li:first-child section.ammenu-submenu-block p a[href*="/call_for_papers/"]', items => items.map(item => {
            return {
                title: item.title,
                url: item.href,
                dueDate: null,
                journal: 'MIS Quarterly',
                abbreviation: 'misq'
            }
        }));
    }
}

module.exports = scraperObject;