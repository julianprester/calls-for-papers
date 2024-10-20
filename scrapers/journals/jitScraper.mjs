import { parse} from '../pdfParser.mjs';

export const scraperObject = {
    url: 'https://journals.sagepub.com/page/jin/call-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url);
        if (await page.locator('div.sage-custom-pages h1').count() == 0) {
            return [];
        }

        let calls = await page.$$eval('div.pb-rich-text a', items => items.map(item => {
            return {
                journal: 'Journal of Information Technology',
                abbreviation: 'jit',
                metaTitle: item.textContent,
                url: item.href
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

