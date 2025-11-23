import { Feed } from 'feed';
import fs from 'fs';
import nunjucks from 'nunjucks';
import { DateTime } from "luxon";
import slugify from 'slugify';

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
        email: "hi@julianprester.com",
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
        author: [
            {
                name: call.abbreviation.toUpperCase(),
                email: call.journal
            }
        ],
        content: nunjucks.render('rss.html', { call: call })
    });
}
fs.writeFileSync("./www/rss.xml", rssFeed.rss2());

// Group calls by journal-abbreviation
const journalGroups = {};
for (const call of calls) {
    const key = `${call.abbreviation}-${call.journal}`;
    if (!journalGroups[key]) journalGroups[key] = [];
    journalGroups[key].push(call);
}

// Generate journal folder
fs.mkdirSync('./www/journal', { recursive: true });

// Generate RSS for each journal
for (const [key, journalCalls] of Object.entries(journalGroups)) {
    const firstCall = journalCalls[0];
    const journalFeed = new Feed({
        title: `Calls for Papers | ${firstCall.journal}`,
        description: `Latest calls for papers for ${firstCall.journal}.`,
        id: `https://callsforpapers.org/journal/${slugify(firstCall.journal, { lower: true, strict: true })}`,
        link: `https://callsforpapers.org/journal/${slugify(firstCall.journal, { lower: true, strict: true })}`,
        language: "en",
        image: "https://callsforpapers.org/public/favicon/android-chrome-96x96.png",
        favicon: "https://callsforpapers.org/public/favicon/favicon.ico",
        copyright: "Calls for Papers © 2025",
        date: new Date(),
        feedLinks: {
            json: `https://callsforpapers.org/journal/${slugify(firstCall.journal, { lower: true, strict: true })}.json`,
            atom: `https://callsforpapers.org/journal/${slugify(firstCall.journal, { lower: true, strict: true })}.atom`
        },
        author: rssFeed.options.author
    });
    for (const call of journalCalls) {
        journalFeed.addItem({
            title: call.title ? call.title : call.metaTitle,
            id: call.slug,
            link: `https://callsforpapers.org/call/${call.slug}`,
            date: new Date(call.pubDate),
            author: [
                {
                    name: call.abbreviation.toUpperCase(),
                    email: call.journal
                }
            ],
            content: nunjucks.render('rss.html', { call: call })
        });
    }
    // Write journal RSS file using slugified journal name
    const journalSlug = slugify(firstCall.journal, { lower: true, strict: true });
    fs.writeFileSync(`./www/journal/${journalSlug}.xml`, journalFeed.rss2(), { recursive: true });
}

// Generate tag folder
fs.mkdirSync('./www/tag', { recursive: true });

// Group calls by tag
const tagGroups = {};
for (const call of calls) {
    if (Array.isArray(call.tags)) {
        for (const tag of call.tags) {
            if (!tagGroups[tag]) tagGroups[tag] = [];
            tagGroups[tag].push(call);
        }
    }
}

fs.mkdirSync('./www/journal', { recursive: true });

// Generate RSS for each tag
for (const [tag, tagCalls] of Object.entries(tagGroups)) {
    const tagFeed = new Feed({
        title: `Calls for Papers | Tag: ${tag}`,
        description: `Latest calls for papers tagged with '${tag}'.`,
        id: `https://callsforpapers.org/tag/${slugify(tag, { lower: true, strict: true })}`,
        link: `https://callsforpapers.org/tag/${slugify(tag, { lower: true, strict: true })}`,
        language: "en",
        image: "https://callsforpapers.org/public/favicon/android-chrome-96x96.png",
        favicon: "https://callsforpapers.org/public/favicon/favicon.ico",
        copyright: "Calls for Papers © 2025",
        date: new Date(),
        feedLinks: {
            json: `https://callsforpapers.org/tag/${slugify(tag, { lower: true, strict: true })}.json`,
            atom: `https://callsforpapers.org/tag/${slugify(tag, { lower: true, strict: true })}.atom`
        },
        author: rssFeed.options.author
    });
    for (const call of tagCalls) {
        tagFeed.addItem({
            title: call.title ? call.title : call.metaTitle,
            id: call.slug,
            link: `https://callsforpapers.org/call/${call.slug}`,
            date: new Date(call.pubDate),
            author: [
                {
                    name: call.abbreviation ? call.abbreviation.toUpperCase() : '',
                    email: call.journal
                }
            ],
            content: nunjucks.render('rss.html', { call: call })
        });
    }
    // Write tag RSS file using slugified tag name
    const tagSlug = slugify(tag, { lower: true, strict: true });
    fs.writeFileSync(`./www/tag/${tagSlug}.xml`, tagFeed.rss2(), { recursive: true });
}
