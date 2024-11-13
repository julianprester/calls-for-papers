import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import * as chrono from 'chrono-node';
import fs from 'fs/promises';
import leven from 'leven';

const openai = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
});

const Academic = z.object({
    name: z.string().describe("The academic's name. Do NOT include titles such as doctor (dr.) or professor (prof.) here."),
    affiliation: z.string().describe("The academic's university affiliation. Only include the university or organization here. Do NOT include departments, cities, states, or countries.").nullable(),
});

const Date = z.object({
    date: z.string().describe("The date of the submission timeline event"),
    description: z.string().describe("The description of the submission timeline event").nullable(),
    is_full_paper_submission_deadline: z.boolean().describe("A flag that indicates whether the date is the full paper submission deadline. The most important date on a call for papers.").nullable(),
});

const Description = z.object({
    paragraphs: z.string().array().describe("The paragraphs of the description. This is the main content of the call for papers. Do NOT include headings as paragraphs. Do NOT include topics that appear in bullet point format. Do NOT include information related to formatting and submission instructions. If there is no paragraph structure in the text provided, you can organize the text into meaningful paragraphs."),
});

const Call = z.object({
    title: z.string().describe("Title of the call for papers. Only include the actual title here. Do NOT include statements such as 'call for papers' or 'special issue' or the journal name here."),
    topics: z.string().array().describe("Topics of the call for papers. This is a list of topics that the call for papers is interested in. This is usually in bullet point format. Bullet points can also include example research questions."),
    description: Description.describe("Description of the call for papers. This is the main content of the call for papers."),
    tags: z.string().array().describe("Tags that describe the content of the call for papers. Use as few tags as possible."),
    editors: Academic.array().describe("The editors of the special issue. This is a list of academics who are responsible for the special issue."),
    associate_editors: Academic.array().describe("The associate editors or editorial review board of the special issue. This is a list of academics who are assisting the editors with the special issue."),
    dates: Date.array().describe("This is a list of important dates for the call for papers."),
});

async function parseFuzzyDate(fuzzyDate) {
    return chrono.parseDate(fuzzyDate);
}

async function parse(call) {
    if (!call.rawContent || call.rawContent.length == 0) {
        call.tags = [];
        return call;
    }
    const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [
            { role: "system", content: "You are an expert parser of calls for papers for special issues of academic journals. You do NOT make up any information. You only copy information from the call directly." },
            { role: "user", content: `Parse the following call for papers:\n\n${call.rawContent}` },
        ],
        response_format: zodResponseFormat(Call, "call_parsing"),
    });

    call = { ...call, ...completion.choices[0].message.parsed };
    delete call.tags
    call.dates = await Promise.all(call.dates.map(async date => {
        date.date = await parseFuzzyDate(date.date);
        return date;
    }));
    return call;
}

async function eval_title(calls) {
    return await Promise.all(calls.map(async call => {
        const error = leven(call.gold_title, call.title);
        return {...call, 'error_title': error};
    }));
}

async function eval_topics(calls) {
    return await Promise.all(calls.map(async call => {
        const error = leven(call.gold_topics.join('\n'), call.topics.join('\n'));
        return {...call, 'error_topics': error};
    }));
}

async function eval_description(calls) {
    return await Promise.all(calls.map(async call => {
        const error = leven(call.gold_description.paragraphs.join('\n'), call.description.paragraphs.join('\n'));
        return {...call, 'error_description': error};
    }));
}

async function eval_editors(calls) {
    return await Promise.all(calls.map(async call => {
        const error = leven(call.gold_editors.map(editor => editor.name + ', ' + editor.affiliation).join('\n'), call.editors.map(editor => editor.name + ', ' + editor.affiliation).join('\n'));
        return {...call, 'error_editors': error};
    }));
}

async function eval_associate_editors(calls) {
    return await Promise.all(calls.map(async call => {
        const error = leven(call.gold_associate_editors.map(associate_editor => associate_editor.name + ', ' + associate_editor.affiliation).join('\n'), call.associate_editors.map(associate_editor => associate_editor.name + ', ' + associate_editor.affiliation).join('\n'));
        return {...call, 'error_associate_editors': error};
    }));
}

async function eval_dates(calls) {
    return await Promise.all(calls.map(async call => {
        const error = leven(call.gold_dates.map(date => date.date + ', ' + date.description + ', ' + date.is_full_paper_submission_deadline).join('\n'), call.dates.map(date => date.date + ', ' + date.description + ', ' + date.is_full_paper_submission_deadline).join('\n'));
        return {...call, 'error_dates': error};
    }));
}

async function evaluate(calls) {
    const calls_evaluated_title = await eval_title(calls);
    const calls_evaluated_topics = await eval_topics(calls_evaluated_title);
    const calls_evaluated_description = await eval_description(calls_evaluated_topics);
    const calls_evaluated_editors = await eval_editors(calls_evaluated_description);
    const calls_evaluated_associate_editors = await eval_associate_editors(calls_evaluated_editors);
    const calls_evaluated_dates = await eval_dates(calls_evaluated_associate_editors);
    return calls_evaluated_dates;
}

async function main() {
    const evalContent = await fs.readFile('eval/data.json', 'utf-8');
    const calls = JSON.parse(evalContent);

    const calls_parsed = await Promise.all(calls.map(async call => {
        const response = await parse(call);
        return {...call, ...response};
    }));

    const calls_evaluated = await evaluate(calls_parsed);
    const sum_error_title = calls_evaluated.reduce((acc, call) => acc + call.error_title, 0);
    const sum_error_topics = calls_evaluated.reduce((acc, call) => acc + call.error_topics, 0);
    const sum_error_description = calls_evaluated.reduce((acc, call) => acc + call.error_description, 0);
    const sum_error_editors = calls_evaluated.reduce((acc, call) => acc + call.error_editors, 0);
    const sum_error_associate_editors = calls_evaluated.reduce((acc, call) => acc + call.error_associate_editors, 0);
    const sum_error_dates = calls_evaluated.reduce((acc, call) => acc + call.error_dates, 0);
    console.log(`Total error title: ${sum_error_title}`);
    console.log(`Total error topics: ${sum_error_topics}`);
    console.log(`Total error description: ${sum_error_description}`);
    console.log(`Total error editors: ${sum_error_editors}`);
    console.log(`Total error associate editors: ${sum_error_associate_editors}`);
    console.log(`Total error dates: ${sum_error_dates}`);
    console.log(`Total error: ${sum_error_title + sum_error_topics + sum_error_description + sum_error_editors + sum_error_associate_editors + sum_error_dates}`);
}

main().catch(console.error);