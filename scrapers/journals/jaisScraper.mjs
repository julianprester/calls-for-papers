import { parse} from '../pdfParser.mjs';

export const scraperObject = {
    url: 'https://aisel.aisnet.org/jais/specialissues.html',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url);
        if (await page.locator('div#main h2').count() == 0) {
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

        return calls;
    }
}

