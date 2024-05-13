const Feed = require('feed').Feed;
const fs = require('fs');

let data = fs.readFileSync("./www/data.json", "utf8");
let issues = JSON.parse(data);
issues = issues.filter(issue => issue.active || (!issue.active && Date.now() < issue.gracePeriod));
const rssFeed = new Feed({
    title: "Calls for Papers",
    description: "Calls for Papers shows you the latest calls for papers of academic journals in your discipline.",
    id: "https://callsforpapers.org/",
    link: "https://callsforpapers.org/",
    language: "en",
    image: "https://callsforpapers.org/favicon/android-chrome-96x96.png",
    favicon: "https://callsforpapers.org/favicon/favicon.ico",
    copyright: "Calls for Papers © 2022",
    date: new Date(),
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
        id: issue.slug,
        link: issue.url,
        date: new Date(issue.pubDate),
        author: [
            {
                name: issue.abbreviation.toUpperCase(),
                email: issue.journal
            }
        ],
    });
});
try {
    fs.writeFileSync("./www/rss.xml", rssFeed.rss2());
} catch (err) {
    console.log(err);
}