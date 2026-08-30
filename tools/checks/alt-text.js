// Every <img> in the built output must have an alt attribute at all. An
// empty alt="" is a legitimate, deliberate choice for a decorative image;
// a missing alt attribute entirely is the failure this checks for.
'use strict';

const fs = require('fs');
const path = require('path');

function walk(dir, out) {
    out = out || [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, out);
        else out.push(full);
    }
    return out;
}

module.exports = function checkAltText(siteDir) {
    const problems = [];
    const files = walk(siteDir).filter(function (f) { return f.endsWith('.html'); });
    const imgRe = /<img\b[^>]*>/g;

    for (const file of files) {
        const html = fs.readFileSync(file, 'utf8');
        let m;
        while ((m = imgRe.exec(html))) {
            const tag = m[0];
            if (!/\balt\s*=/.test(tag)) {
                problems.push(path.relative(siteDir, file) + ' -> <img> with no alt attribute: ' + tag.slice(0, 100));
            }
        }
    }
    return problems;
};
