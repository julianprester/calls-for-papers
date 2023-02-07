const fs = require('fs/promises');

async function writeData(issues) {
    const now = new Date();
    let existingIssues = await readData();
    issues.forEach(issue => {
        issue.pubDate = Date.parse(existingIssues.find(item => item.slug === issue.slug) ? new Date(existingIssues.find(item => item.slug === issue.slug).pubDate) : now);
    });
    fs.writeFile("./www/data.json", JSON.stringify(issues, null, 2), err => {
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