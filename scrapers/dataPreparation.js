async function clean(issues) {
    for (let issue of issues) {
        issue = cleanTitles(issue);
    }

    return await issues;
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

module.exports = (issues) => clean(issues)
