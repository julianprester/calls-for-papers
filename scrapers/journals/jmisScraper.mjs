import { parse} from '../pdfParser.mjs';

export const scraperObject = {
    url: 'https://www.jmis-web.org/cfp',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url, { waitUntil: 'domcontentloaded' });
        const correctPage = await page.$$eval('h2', elements => elements.length > 0);
        if (!correctPage) {
            await page.close();
            return [];
        }

        let calls = await page.$$eval('p', items => items.map(item => {
            return {
                journal: 'Journal of Management Information Systems',
                abbreviation: 'jmis',
                metaTitle: item.textContent,
                url: item.querySelector('a').href
            }
        }));

        calls = await Promise.all(
            calls.map(async (call) => ({
                ...call,
                rawContent: await parse(browser, call.url)
            }))
        );

        await page.close();
        return calls;
    }
}

