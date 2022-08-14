const Parser = require('rss-parser');
const Feed = require('feed').Feed;
const fs = require('fs/promises');

async function generateFeed(issues) {
    const now = new Date();
    let existingItems = await readFeed();
    if (issues.map(issue => issue.url).filter(value => !existingItems.map(item => item.guid).includes(value)).length == 0) {
        return;
    }
    const rssFeed = new Feed({
        title: "Calls for Papers",
        description: "Calls for Papers shows you the latest calls for papers of academic journals in your discipline.",
        id: "https://callsforpapers.org/",
        link: "https://callsforpapers.org/",
        language: "en",
        image: "https://callsforpapers.org/favicon/android-chrome-96x96.png",
        favicon: "https://callsforpapers.org/favicon/favicon.ico",
        copyright: "Calls for Papers © 2022",
        date: now,
        feedLinks: {
            json: "https://callsforpapers.org/json",
            atom: "https://callsforpapers.org/atom"
        },
        author: {
            name: "Julian Prester",
            email: "julian@julianprester.com",
            link: "https://julianprester.com/"
        }
    });
    issues.forEach(issue => {
        rssFeed.addItem({
            title: issue.title,
            id: issue.url,
            link: issue.url,
            date: existingItems.find(item => item.guid === issue.url) ? new Date(existingItems.find(item => item.guid === issue.url).pubDate) : now,
            author: [
                {
                    name: issue.abbreviation.toUpperCase(),
                    email: issue.journal
                }
            ],
        });
    });
    try {
        await fs.writeFile("./www/feed.rss", rssFeed.rss2());
    } catch (err) {
        console.log(err);
    }
}

async function readFeed() {
    try {
        const data = await fs.readFile("./www/feed.rss", { encoding: 'utf8' });
        let parser = new Parser();
        let feed = await parser.parseString(data);
        return await feed.items;
    } catch (err) {
        console.log(err);
    }
}

module.exports = (issues) => generateFeed(issues)