const scraperObject = {
    url: 'https://onlinelibrary.wiley.com/page/journal/13652575/homepage/special_issues.htm',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'networkidle2' });

        return await page.$$eval('table tr', items => items.map(item => {
            return {
                title: item.querySelectorAll('td')[0].querySelector('a').textContent,
                url: item.querySelectorAll('td')[0].querySelector('a').href,
                dueDate: Date.parse(item.querySelectorAll('td')[1].textContent.replace(/([0-9])(st |nd |rd |th )/gi, '$1 ')),
                journal: 'Information Systems Journal',
                abbreviation: 'isj'
            }
        }));
    }
}

module.exports = scraperObject;