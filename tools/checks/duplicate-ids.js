// Duplicate id/slug detection across every place a stable identifier is
// supposed to be unique.
'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function findDupes(values) {
    const seen = {}, dupes = [];
    for (const v of values) {
        if (v === undefined || v === null) continue;
        seen[v] = (seen[v] || 0) + 1;
        if (seen[v] === 2) dupes.push(v);
    }
    return dupes;
}

module.exports = function checkDuplicateIds(root) {
    const problems = [];

    const storiesDir = path.join(root, 'site', 'content', 'stories');
    const slugs = [];
    for (const f of fs.readdirSync(storiesDir)) {
        if (!f.endsWith('.md')) continue;
        const { data } = matter(fs.readFileSync(path.join(storiesDir, f), 'utf8'));
        slugs.push(data.slug);
    }
    for (const dup of findDupes(slugs)) problems.push('Duplicate story slug: "' + dup + '"');

    function idsOf(file) {
        return JSON.parse(fs.readFileSync(path.join(root, 'site', '_data', file), 'utf8')).map(function (r) { return r.id; });
    }
    for (const dup of findDupes(idsOf('residents.json'))) problems.push('Duplicate resident id: "' + dup + '"');
    for (const dup of findDupes(idsOf('locations.json'))) problems.push('Duplicate location id: "' + dup + '"');
    for (const dup of findDupes(idsOf('images.json'))) problems.push('Duplicate image id: "' + dup + '"');

    return problems;
};
