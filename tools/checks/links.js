// Broken internal link check. Walks every built HTML file for href/src
// attributes that start with "/" (site-relative) and confirms the target
// exists in _site/. External links and mailto/tel are not checked here.
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

function resolveTarget(siteDir, url) {
    const clean = url.split('#')[0].split('?')[0];
    if (!clean || clean === '/') return path.join(siteDir, 'index.html');
    const direct = path.join(siteDir, clean);
    if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
    const asIndex = path.join(siteDir, clean, 'index.html');
    if (fs.existsSync(asIndex)) return asIndex;
    const withHtml = direct.endsWith('.html') ? direct : direct + '.html';
    if (fs.existsSync(withHtml)) return withHtml;
    return null;
}

module.exports = function checkLinks(siteDir) {
    const problems = [];
    const files = walk(siteDir).filter(function (f) { return f.endsWith('.html'); });
    const attrRe = /(?:href|src)="(\/[^"]*)"/g;

    for (const file of files) {
        const html = fs.readFileSync(file, 'utf8');
        let m;
        while ((m = attrRe.exec(html))) {
            const url = m[1];
            if (url.startsWith('//')) continue; // protocol-relative external
            const resolved = resolveTarget(siteDir, url);
            if (!resolved) {
                problems.push(path.relative(siteDir, file) + ' -> broken link "' + url + '"');
            }
        }
    }
    return problems;
};
