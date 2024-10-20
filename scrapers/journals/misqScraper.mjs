export const scraperObject = {
    url: 'https://misq.umn.edu/special-issues',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url, { waitUntil: 'domcontentloaded' });
        if (await page.locator('h2').count() == 0) {
            return [];
        }

        let calls = await page.$$eval('div[data-content-type="text"] p', (paragraphs) => {
            const calls = [];
            let currentCall = {};

            for (let i = 0; i < paragraphs.length; i++) {
                const p = paragraphs[i];
                
                // Check if this paragraph contains a title
                const titleElement = p.querySelector('span > strong');
                if (titleElement) {
                    // If we have a previous call, push it
                    if (currentCall.metaTitle) {
                        calls.push(currentCall);
                    }
                    
                    // Start a new call
                    currentCall = {
                        journal: 'MIS Quarterly',
                        abbreviation: 'misq',
                        metaTitle: titleElement.textContent.trim(),
                        url: '',
                        rawContent: '',
                    };
                    continue;
                }

                // Look for other details in the following paragraph
                const link = p.querySelector('a[href^="https://misq.umn.edu/"]');
                
                if (link) {
                    currentCall.url = link.href;
                }
            }

            // Don't forget to push the last call
            if (currentCall.metaTitle) {
                calls.push(currentCall);
            }

            return calls;
        });

        // Filter out any incomplete entries
        calls = calls.filter(call => call.metaTitle);

        // If URL exists, visit each call's page to get additional details
        for (let call of calls) {
            if (call.url) {
                try {
                    let callPage = await browser.newPage();
                    await callPage.goto(call.url, {waitUntil: 'domcontentloaded'});
                    call.rawContent = await callPage.$eval('div[data-element="main"]:has(h2)', (element) => element.innerHTML);
                    await callPage.close();
                } catch (error) {
                    console.error(`Error accessing URL ${call.url}: ${error.message}`);
                }
            }
        }

        return calls;
    }
}

