const scraperObject = {
    url: 'https://misq.umn.edu/special-issues',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url, { waitUntil: 'domcontentloaded' });

        return await page.$$eval('div[data-content-type="text"]:nth-child(3) p:has(span > strong), div[data-content-type="text"]:nth-child(3) p:has(span > strong) ~ p:has(a)', items => items.map(item => {
            const titleElement = item.querySelector('span > strong');
            const title = titleElement ? titleElement.textContent.trim() : '';

            let url = '';
            let dueDate = '';
            let currentElement = item.nextElementSibling;

            while (currentElement && !currentElement.querySelector('span > strong')) {
                const linkElement = currentElement.querySelector('a[href^="https://misq.umn.edu/"]');
                if (linkElement && !url) {
                    url = linkElement.href;
                }

                const dueDateMatch = currentElement.textContent.match(/Submission Deadline: (.+?)Expected Publication/);
                if (dueDateMatch && !dueDate) {
                    dueDate = Date.parse(dueDateMatch[1].trim());
                }

                currentElement = currentElement.nextElementSibling;
            }

            return {
                title: title,
                url: url,
                dueDate: dueDate,
                journal: 'MIS Quarterly',
                abbreviation: 'misq'
            };
        }));
    }
}

module.exports = scraperObject;