import { Feed } from 'feed';
import fs from 'fs';
import nunjucks from 'nunjucks';
import { DateTime } from "luxon";

var env = nunjucks.configure('www/_includes', { autoescape: true });
env.addFilter('dateOnly', function (str) {
    const dateTime = DateTime.fromISO(str);
    return dateTime.setLocale('en-us').toLocaleString(DateTime.DATE_FULL);
});

const rssFeed = new Feed({
    title: "Calls for Papers",
    description: "Calls for Papers shows you the latest calls for papers of academic journals in your discipline.",
    id: "https://callsforpapers.org/",
    link: "https://callsforpapers.org/",
    language: "en",
    image: "https://callsforpapers.org/public/favicon/android-chrome-96x96.png",
    favicon: "https://callsforpapers.org/public/favicon/favicon.ico",
    copyright: "Calls for Papers © 2025",
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

let data = fs.readFileSync("./www/_data/calls.json", "utf8");
let calls = JSON.parse(data);
calls = calls.filter(call => call.active || (!call.active && Date.now() < Date.parse(call.gracePeriod)));

for (const call of calls) {
    rssFeed.addItem({
        title: call.title ? call.title : call.metaTitle,
        id: call.slug,
        link: `https://callsforpapers.org/call/${call.slug}`,
        date: new Date(call.pubDate),
        author: call.editors ? call.editors.map(editor => {
            return {
                name: editor.affiliation,
                email: editor.name
            }
        }) : [
            {
                name: call.abbreviation.toUpperCase(),
                email: call.journal
            }
        ],
        contributor: [
            {
                name: call.abbreviation.toUpperCase(),
                email: call.journal
            }
        ],
        content: nunjucks.render('rss.html', { call: call })
    });
}

fs.writeFileSync("./www/rss.xml", rssFeed.rss2());
