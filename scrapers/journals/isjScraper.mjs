import { parse} from '../fileParser.mjs';

export const scraperObject = {
    url: 'https://onlinelibrary.wiley.com/page/journal/13652575/homepage/special_issues.htm',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url, { waitUntil: 'domcontentloaded' });
        const correctPage = await page.$$eval('div.pb-rich-text h2', elements => elements.length > 0);
        if (!correctPage) {
            await page.close();
            return [];
        }

        let calls = await page.$$eval('table tr td:first-child p', items => items.map(item => {
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
                rawContent: call.url.endsWith(".pdf") ? await parse(browser, call.url) : await get_raw_content(browser, call.url)
            }))
        );

        await page.close();
        return calls;
    }
}

async function get_raw_content(browser, url) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const rawContent = await page.$eval('div.pb-rich-text', element => element.innerHTML);
    await page.close();
    return rawContent;
}
