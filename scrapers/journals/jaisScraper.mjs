import { parse} from '../pdfParser.mjs';

export const scraperObject = {
    url: 'https://aisel.aisnet.org/jais/specialissues.html',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url, { waitUntil: 'domcontentloaded' });
        const correctPage = await page.$$eval('div#main h2', elements => elements.length > 0);
        if (!correctPage) {
            return [];
        }

        let calls = await page.$$eval('div#main > div#breadcrumb + h2 + ul li:not(br ~ li) a', items => items.map(item => {
            return {
                journal: 'Journal of the Association for Information Systems',
                abbreviation: 'jais',
                metaTitle: item.textContent,
                url: item.href,
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

