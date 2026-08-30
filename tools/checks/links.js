// Broken internal link check. Walks every built HTML file for href/src
// attributes that start with "/" (site-relative) and confirms the target
// exists in _site/. External links and mailto/tel are not checked here.
'use strict';

const fs = require('fs');
const path = require('path');
const PATH_PREFIX = require('../path-prefix.js');
// pathPrefix changes the URLs Eleventy writes into HTML but never the
// physical layout of _site/, so a link has to have the prefix stripped
// before it can be resolved against a real file on disk.
const PREFIX_NO_SLASH = PATH_PREFIX.replace(/\/$/, '');

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
    let clean = url.split('#')[0].split('?')[0];
    if (clean === PREFIX_NO_SLASH || clean === PATH_PREFIX) clean = '/';
    else if (clean.startsWith(PATH_PREFIX)) clean = '/' + clean.slice(PATH_PREFIX.length);
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
            // A site-relative link that's missing the GitHub Pages project
            // subpath is exactly the bug class that broke the first live
            // deploy (see PROGRESS.md/ISSUES.md): it resolves fine here
            // against the physical _site/ layout but 404s for real once
            // deployed, since pathPrefix never moves files on disk. Only
            // "/" bare and "#..." fragment-only hrefs are exempt.
            if (url !== '/' && !url.startsWith('#') && !url.startsWith(PATH_PREFIX) && url !== PREFIX_NO_SLASH) {
                problems.push(path.relative(siteDir, file) + ' -> internal link "' + url + '" is missing the "' + PATH_PREFIX + '" project-page prefix and will 404 when deployed');
                continue;
            }
            const resolved = resolveTarget(siteDir, url);
            if (!resolved) {
                problems.push(path.relative(siteDir, file) + ' -> broken link "' + url + '"');
            }
        }
    }
    return problems;
};
