var slugify = require('slugify')

async function clean(issues) {
    for (let issue of issues) {
        issue = await cleanTitles(issue);
        issue = await generateSlug(issue);
    }
    issues = await dropEmpty(issues);
    issues = await addActive(issues);

    return await issues;
}

async function generateSlug(issue) {
    issue.slug = slugify(issue.abbreviation + " " + issue.title, {lower: true, strict: true})
    return await issue;
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
        issue.title = issue.title.replace(pattern, '').trim();
    }
    issue.title = issue.title.replace('–', '-').trim();
    return await issue;
}

async function addActive(issues) {
    return await issues.map(issue => {
        issue.active = true;
        return issue;
    });
}

async function dropEmpty(issues) {
    return await issues.filter(issue => issue.title.length > 0);
}

module.exports = (issues) => clean(issues)
