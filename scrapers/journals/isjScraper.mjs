import { parse} from '../pdfParser.mjs';

export const scraperObject = {
    url: 'https://onlinelibrary.wiley.com/page/journal/13652575/homepage/special_issues.htm',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url);
        if (await page.locator('div.pb-rich-text h4').count() == 0) {
            return [];
        }

        let calls = await page.$$eval('table tr td:first-child', items => items.map(item => {
            return {
                journal: 'Information Systems Journal',
                abbreviation: 'isj',
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

