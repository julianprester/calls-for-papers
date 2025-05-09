import slugify from 'slugify';
import { createHash } from 'crypto';
import TurndownService from 'turndown';

export async function clean(issues) {
    return await Promise.all(
        issues.map(async (issue) => {
            issue = await cleanTitles(issue);
            issue = await generateSlug(issue);
            issue = await parseHTML(issue);
            issue = await hash(issue);
            return issue;
        })
    );
}

async function generateSlug(issue) {
    issue.slug = await slugify(issue.abbreviation + " " + issue.metaTitle, { lower: true, strict: true })
    return issue;
}

async function parseHTML(issue) {
    if (!issue.rawContent || typeof issue.rawContent !== 'string') {
        return issue;
    }
    var turndownService = new TurndownService();
    issue.rawContent = turndownService.turndown(issue.rawContent);
    return issue;
}

async function hash(issue) {
    if (!issue.rawContent || issue.rawContent.trim() === '') {
        issue.contentHash = await createHash('sha256').update(issue.slug).digest('hex');
    } else {
        issue.contentHash = await createHash('sha256').update(issue.rawContent).digest('hex');
    }
    return issue;
}

async function cleanTitles(issue) {
    const patterns = [
        /DSS Special Issue on /g,
        /Call for Papers on Special Issue: /g,
        /Call for Papers \(Special Section @ ?IJIM\) Theme: /g,
        /Call for Papers:  ?Special [I|i]ssue on /g,
        /Call for Papers: /g,
        /Special Issue: /g,
        /Special Issue on /g,
        /(\- )?Short Title SI: .+/g,
        /Special Section:? /g,
        /\(PDF\)/g,
        /'/g,
        /"/g,
        /”/g,
        /“/g
    ];
    for (let pattern of patterns) {
        issue.metaTitle = issue.metaTitle.replace(pattern, '').trim();
    }
    issue.metaTitle = issue.metaTitle.replace('–', '-').trim();
    return issue;
}
