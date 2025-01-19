export const scraperObject = {
    url: 'https://www.sciencedirect.com/journal/the-journal-of-strategic-information-systems/about/call-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url, { waitUntil: 'domcontentloaded' });
        const correctPage = await page.$$eval('h2[aria-label="Call for papers"]', elements => elements.length > 0);
        if (!correctPage) {
            return [];
        }

        let calls = await page.$$eval('main h3 a', items => items.map(item => {
            return {
                journal: 'The Journal of Strategic Information Systems',
                abbreviation: 'jsis',
                metaTitle: item.textContent,
                url: item.href,
            }
        }));

        calls = await Promise.all(
            calls.map(async (call) => ({
                ...call,
                rawContent: await get_raw_content(browser, call.url)
            }))
        );

        await page.close();
        return calls;
    }
}

async function get_raw_content(browser, url) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const rawContent = await page.$eval('div.inner', element => element.innerHTML);
    await page.close();
    return rawContent;
}
