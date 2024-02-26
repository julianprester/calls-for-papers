const fs = require('fs/promises');

async function writeData(scrapedIssues) {
    const now = new Date();
    let existingIssues = await readData();

    let scraped_not_existing = scrapedIssues.filter(issue => !existingIssues.some(existingIssue => existingIssue.slug === issue.slug));
    let existing_not_scraped = existingIssues.filter(issue => !scrapedIssues.some(scrapedIssue => scrapedIssue.slug === issue.slug));
    let existing_and_scraped = scrapedIssues.filter(issue => existingIssues.some(existingIssue => existingIssue.slug === issue.slug));

    for (let issue of existingIssues) {
        if (existing_not_scraped.find(item => item.slug === issue.slug)) {
            issue.active = false;
        }
        if (existing_and_scraped.find(item => item.slug === issue.slug)) {
            issue.active = true;
            issue.url = existing_and_scraped.find(item => item.slug === issue.slug).url;
            issue.dueDate = existing_and_scraped.find(item => item.slug === issue.slug).dueDate;
        }
    }

    for (let issue of scraped_not_existing) {
        issue.pubDate = Date.parse(now);
    }
    existingIssues = existingIssues.concat(scraped_not_existing);

    fs.writeFile("./www/data.json", JSON.stringify(existingIssues, null, 2), err => {
        if (err) {
            console.error(err);
        }
    });
}

async function readData() {
    try {
        const data = await fs.readFile("./www/data.json", { encoding: 'utf8' });
        return await JSON.parse(data);
    } catch (err) {
        console.log(err);
    }
}

module.exports = (issues) => writeData(issues)