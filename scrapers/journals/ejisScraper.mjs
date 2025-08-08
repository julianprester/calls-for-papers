export const scraperObject = {
    url: 'https://www.tandfonline.com/journals/tjis20',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url, { waitUntil: 'domcontentloaded' });
        const correctPage = await page.$$eval('div.journalMetaTitle > h1', elements => elements.length > 0);
        if (!correctPage) {
            await page.close();
            return [];
        }

        let calls = await page.$$eval('div.cfpContent > a', items => items.map(item => {
            return {
                journal: 'European Journal of Information Systems',
                abbreviation: 'ejis',
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
    const rawContent = await page.$eval('main#main-content > article', element => element.innerHTML);
    await page.close();
    return rawContent;
}