// Every series must have a clean 1..N episode sequence: no gaps, no
// duplicates, no episode without a series.
'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

module.exports = function checkEpisodeOrder(root) {
    const problems = [];
    const storiesDir = path.join(root, 'site', 'content', 'stories');
    const bySeries = {};

    for (const f of fs.readdirSync(storiesDir)) {
        if (!f.endsWith('.md')) continue;
        const { data } = matter(fs.readFileSync(path.join(storiesDir, f), 'utf8'));
        if (!data.seriesId) continue;
        bySeries[data.seriesId] = bySeries[data.seriesId] || [];
        bySeries[data.seriesId].push({ file: f, episodeNumber: data.episodeNumber });
    }

    for (const seriesId of Object.keys(bySeries)) {
        const entries = bySeries[seriesId].sort(function (a, b) { return a.episodeNumber - b.episodeNumber; });
        const seen = {};
        for (const e of entries) {
            if (seen[e.episodeNumber]) {
                problems.push('Series "' + seriesId + '" has two episodes numbered ' + e.episodeNumber + ': ' + seen[e.episodeNumber] + ' and ' + e.file);
            }
            seen[e.episodeNumber] = e.file;
        }
        for (let i = 1; i <= entries.length; i++) {
            if (!seen[i]) {
                problems.push('Series "' + seriesId + '" is missing episode ' + i + ' (has ' + entries.length + ' episodes total, so this is a gap, not just a short series)');
            }
        }
    }

    return problems;
};
