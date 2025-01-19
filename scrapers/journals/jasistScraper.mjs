import { parse} from '../pdfParser.mjs';

export const scraperObject = {
    url: 'https://asistdl.onlinelibrary.wiley.com/journal/23301643',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url, { waitUntil: 'domcontentloaded' });

        let calls = await page.$$eval('div.journal-resources ul li a[href^="/pb-assets/"]', items => items.map(item => {
            return {
                journal: 'Journal of the Association for Information Science and Technology',
                abbreviation: 'jasist',
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

