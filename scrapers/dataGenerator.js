const fs = require('fs/promises');
const OpenAI = require('openai');
const { zodResponseFormat } = require('openai/helpers/zod');
const { z } = require('zod');

const openai = new OpenAI({
    baseUrl: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
});

const Tagging = z.object({
    tags: z.string().array(),
});

async function tag(calls) {
    for (let call of calls) {
        const completion = await openai.beta.chat.completions.parse({
            model: "gemini-2.0-flash",
            messages: [
                { role: "system", content: "You are a world-class text tagging system." },
                { role: "user", content: `Tag the following text: ${call.title}\nUse as few tags as possible.` },
            ],
            response_format: zodResponseFormat(Tagging, "tagging"),
        });

        const tagging = completion.choices[0].message.parsed;
        call.tags = tagging.tags.map(tag => tag.toLowerCase());
    }
    return calls;
}

async function writeData(scrapedIssues) {
    const now = new Date();
    let existingIssues = await readData();

    let scraped_not_existing = scrapedIssues.filter(issue => !existingIssues.some(existingIssue => existingIssue.slug === issue.slug));
    let existing_not_scraped = existingIssues.filter(issue => !scrapedIssues.some(scrapedIssue => scrapedIssue.slug === issue.slug));
    let existing_and_scraped = scrapedIssues.filter(issue => existingIssues.some(existingIssue => existingIssue.slug === issue.slug));

    for (let issue of existingIssues) {
        if (existing_not_scraped.find(item => item.slug === issue.slug)) {
            issue.active = false;
            if (!issue.gracePeriod) {
                issue.gracePeriod = Date.parse(now) + 2592000000;
            }
        }
        if (existing_and_scraped.find(item => item.slug === issue.slug)) {
            issue.active = true;
            delete issue.gracePeriod;
            issue.url = existing_and_scraped.find(item => item.slug === issue.slug).url;
            issue.dueDate = existing_and_scraped.find(item => item.slug === issue.slug).dueDate;
        }
    }

    for (let issue of scraped_not_existing) {
        issue.pubDate = Date.parse(now);
        issue.active = true;
    }
    scraped_not_existing = await tag(scraped_not_existing);
    existingIssues = existingIssues.concat(scraped_not_existing);

    existingIssues.sort((a, b) => {
        return b.pubDate - a.pubDate;
    });

    fs.writeFile("./www/data/calls.json", JSON.stringify(existingIssues, null, 2), err => {
        if (err) {
            console.error(err);
        }
    });
}

async function readData() {
    try {
        const data = await fs.readFile("./www/data/calls.json", { encoding: 'utf8' });
        return await JSON.parse(data);
    } catch (err) {
        console.log(err);
    }
}

module.exports = (issues) => writeData(issues)