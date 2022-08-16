async function clean(issues) {
    for (let issue of issues) {
        issue = cleanTitles(issue);
    }
    
    // Filter for outdated issues
    let filteredIssues = issues.filter(item => item.dueDate > Date.now() || item.dueDate === null);

    return await filteredIssues;
}

async function cleanTitles(issue) {
    const patterns = [
        /DSS Special Issue on /g,
        /Call for Papers on Special Issue: /g,
        /Call for Papers \(Special Section @ ?IJIM\) Theme: /g,
        /Call for Papers:  ?Special [I|i]ssue on /g,
        /Special Issue on /g,
        /(\- )?Short Title SI: .+/g,
        /Special Section( Call for Papers)?: /g,
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