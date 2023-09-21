const scraperObject = {
    url: 'https://misq.umn.edu/',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, {waitUntil: 'domcontentloaded'});
        await page.locator('css=nav ul li:first-child').hover();
        await page.locator('css=nav ul li:first-child section.ammenu-submenu-block p a[href*="/call_for_papers/"]')
        await page.waitForTimeout(15000)
        
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