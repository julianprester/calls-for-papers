export const scraperObject = {
    url: 'https://pubsonline.informs.org/page/isre/calls-for-papers',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.goto(this.url);
        if (await page.locator('h1').count() == 0) {
            return [];
        }

        return await page.evaluate(() => {
            const cfps = [];
            const h2Elements = document.querySelectorAll('div.col-sm-9 h2');

            // If no h2 elements found, return empty array
            if (h2Elements.length === 0) {
                return cfps;
            }

            // Function to extract text content between nodes
            function getContentBetweenNodes(startNode, endNode) {
                // Create a temporary container
                const temp = document.createElement('div');

                let currentNode = startNode;
                while (currentNode && currentNode !== endNode) {
                    // Clone the node to avoid modifying the original
                    if (currentNode.nodeType === Node.ELEMENT_NODE) {
                        temp.appendChild(currentNode.cloneNode(true));
                    } else if (currentNode.nodeType === Node.TEXT_NODE) {
                        temp.appendChild(document.createTextNode(currentNode.textContent));
                    }
                    currentNode = currentNode.nextSibling;
                }

                return temp.innerHTML.trim();
            }

            // Process each h2 element
            h2Elements.forEach((h2, index) => {
                const title = h2.textContent.trim();
                
                // Get content between current h2 and next h2 (or end)
                const nextH2 = h2Elements[index + 1];
                
                // Include the current h2 in the content
                let content = h2.outerHTML + '\n';
                
                // Add content between h2s
                if (h2.nextSibling) {
                    content += getContentBetweenNodes(h2.nextSibling, nextH2);
                }

                cfps.push({
                    journal: 'Information Systems Research',
                    abbreviation: 'isr',
                    metaTitle: title,
                    url: 'https://pubsonline.informs.org/page/isre/calls-for-papers',
                    rawContent: content,
                });
            });

            return cfps;
        });
    }
}

