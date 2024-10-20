import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import * as chrono from 'chrono-node';
import slugify from 'slugify';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const Location = z.object({
    city: z.string().describe("The city of the affiliation").nullable(),
    state: z.string().describe("The state of the affiliation").nullable(),
    country: z.string().describe("The country of the affiliation").nullable(),
});

const Academic = z.object({
    name: z.string().describe("The academic's name"),
    affiliation: z.string().describe("The academic's university affiliation").nullable(),
    location: Location.describe("The location of the academic's affiliation").nullable(),
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

export async function parse(call) {
    if (!call.rawContent || call.rawContent.length == 0) {
        delete call.rawContent;
        call.tags = [];
        return call;
    }
    const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are an expert parser of calls for papers for special issues of academic journals. You do NOT make up any information. You only copy information from the call directly." },
            { role: "user", content: `Parse the following call for papers:\n\n${call.rawContent}` },
        ],
        response_format: zodResponseFormat(Call, "call_parsing"),
    });

    call = { ...call, ...completion.choices[0].message.parsed };
    delete call.rawContent
    call.dates = await Promise.all(call.dates.map(async date => {
        date.date = await parseFuzzyDate(date.date);
        return date;
    }));
    call.tags = await Promise.all(call.tags.map(async tag => {
        return tag.toLowerCase();
    }));
    return call;
}
