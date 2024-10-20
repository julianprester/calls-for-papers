import { parse} from '../pdfParser.mjs';

export const scraperObject = {
    url: 'https://www.jmis-web.org/cfp',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url);
        if (await page.locator('h2').count() == 0) {
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

        return calls;
    }
}

