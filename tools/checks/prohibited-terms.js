// Two independent scans, deliberately scoped differently (see
// DECISIONS_AND_GAPS.md, "no gold governs design, not story prose"):
//
// 1. "Noodleverse" must never appear in built page text at all — this is a
//    public-facing naming rule with no exceptions, so it is checked against
//    every rendered HTML file's visible output.
// 2. Gold-family colors are a design-system rule, not a content filter. It
//    is checked ONLY against CSS files and inline <svg>...</svg> blocks
//    (the crest and any generated stand-in art), never against ordinary
//    page text — a story is allowed to say "a gold-plated marshmallow
//    holder" without tripping this.
'use strict';

const fs = require('fs');
const path = require('path');

const GOLD_PATTERNS = [
    /\bgold\b/i,
    /\bgolden\b/i,
    /champagne\s*gold/i,
    /goldenrod/i,
    /#f?fd700/i,
    /#d4af37/i,
    /#cfb53b/i,
    /#c5a028/i
];

function walk(dir, out) {
    out = out || [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, out);
        else out.push(full);
    }
    return out;
}

function stripTags(html) {
    return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
               .replace(/<style[\s\S]*?<\/style>/gi, ' ')
               .replace(/<[^>]+>/g, ' ');
}

// CSS/SVG comments legitimately explain the no-gold rule in prose (this
// very file's sibling, tokens.css, does exactly that) - strip comments
// before scanning so the explanation doesn't trip the rule it's explaining.
function stripCssComments(css) {
    return css.replace(/\/\*[\s\S]*?\*\//g, ' ');
}
function stripXmlComments(xml) {
    return xml.replace(/<!--[\s\S]*?-->/g, ' ');
}

module.exports = function checkProhibitedTerms(siteDir) {
    const problems = [];
    const allFiles = walk(siteDir);
    const htmlFiles = allFiles.filter(function (f) { return f.endsWith('.html'); });
    const cssFiles = allFiles.filter(function (f) { return f.endsWith('.css'); });
    const svgFiles = allFiles.filter(function (f) { return f.endsWith('.svg'); });

    for (const file of htmlFiles) {
        const html = fs.readFileSync(file, 'utf8');
        const visibleText = stripTags(html);
        if (/noodleverse/i.test(visibleText)) {
            problems.push(path.relative(siteDir, file) + ' -> "Noodleverse" found in page text (public naming rule).');
        }
    }

    for (const file of cssFiles) {
        const css = stripCssComments(fs.readFileSync(file, 'utf8'));
        for (const pattern of GOLD_PATTERNS) {
            if (pattern.test(css)) {
                problems.push(path.relative(siteDir, file) + ' -> gold-family value matched ' + pattern + ' in CSS.');
                break;
            }
        }
    }

    for (const file of svgFiles) {
        const svg = stripXmlComments(fs.readFileSync(file, 'utf8'));
        for (const pattern of GOLD_PATTERNS) {
            if (pattern.test(svg)) {
                problems.push(path.relative(siteDir, file) + ' -> gold-family value matched ' + pattern + ' in SVG.');
                break;
            }
        }
    }

    // Inline <svg>...</svg> blocks embedded directly in HTML (the crest
    // partial renders this way on every page).
    for (const file of htmlFiles) {
        const html = fs.readFileSync(file, 'utf8');
        const svgBlocks = html.match(/<svg[\s\S]*?<\/svg>/gi) || [];
        for (const rawBlock of svgBlocks) {
            const block = stripXmlComments(rawBlock);
            for (const pattern of GOLD_PATTERNS) {
                if (pattern.test(block)) {
                    problems.push(path.relative(siteDir, file) + ' -> gold-family value matched ' + pattern + ' in an inline <svg> block.');
                    break;
                }
            }
        }
    }

    return problems;
};
