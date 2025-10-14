export const scraperObject = {
    url: 'https://misq.umn.edu/pages/special_issues',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url, { waitUntil: 'domcontentloaded' });
        const correctPage = await page.$$eval('h2', elements => elements.length > 0);
        if (!correctPage) {
            await page.close();
            return [];
        }

        let calls = await page.$$eval('div#mainContent section:first-of-type > div > h3 > a', items => items.map(item => {
            return {
                journal: 'MIS Quarterly',
                abbreviation: 'misq',
                metaTitle: item.textContent.trim(),
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
    const rawContent = await page.$eval('div.container', element => element.innerHTML);
    await page.close();
    return rawContent;
}