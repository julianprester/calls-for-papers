export const scraperObject = {
    url: 'https://pubsonline.informs.org/page/isre/calls-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url, { waitUntil: 'domcontentloaded' });
        const correctPage = await page.$$eval('h1', elements => elements.length > 0);
        if (!correctPage) {
            await page.close();
            return [];
        }

        let calls = await page.$$eval('div.WordSection1:has(p)', items => items.map(item => {
            return {
                journal: 'Information Systems Research',
                abbreviation: 'isr',
                metaTitle: item.querySelector('p').textContent.trim(),
                url: 'https://pubsonline.informs.org/page/isre/calls-for-papers',
                rawContent: item.innerHTML
            }
        }));

        await page.close();
        return calls;
    }
}

