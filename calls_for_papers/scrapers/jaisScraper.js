const scraperObject = {
    url: 'https://aisel.aisnet.org/jais/specialissues.html',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'networkidle2' });

        return await page.$$eval('div#main > div#breadcrumb + h2 + ul li', items => items.map(item => {
            return {
                title: item.querySelector('a').textContent.replace(/[\t\n\r]/gm, '').trim(),
                url: item.querySelector('a').href,
                dueDate: Date.parse([].reduce.call(item.childNodes, function (a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '').replace(/[\t\n\r]/gm, '')),
                journal: 'Journal of the Association for Information Systems',
                abbreviation: 'jais'
            }
        }));
    }
}

module.exports = scraperObject;