// Required front-matter fields on every story, and required fields on every
// resident/location/image record. Checked against source data, not built
// HTML, since that's where the actual fields live.
'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const STORY_REQUIRED = ['title', 'slug', 'order', 'primaryCollection', 'summary'];
const RESIDENT_REQUIRED = ['id', 'name', 'group', 'status', 'role'];
const LOCATION_REQUIRED = ['id', 'name', 'shortDescription'];
const IMAGE_REQUIRED = ['id', 'sourcePath', 'altText', 'altTextStatus'];

module.exports = function checkMetadata(root) {
    const problems = [];

    const storiesDir = path.join(root, 'site', 'content', 'stories');
    for (const f of fs.readdirSync(storiesDir)) {
        if (!f.endsWith('.md')) continue;
        const { data } = matter(fs.readFileSync(path.join(storiesDir, f), 'utf8'));
        for (const field of STORY_REQUIRED) {
            if (data[field] === undefined || data[field] === null || data[field] === '') {
                problems.push('content/stories/' + f + ' -> missing required field "' + field + '"');
            }
        }
        // A series episode must carry both series fields or neither.
        if ((data.seriesId && !data.episodeNumber) || (!data.seriesId && data.episodeNumber)) {
            problems.push('content/stories/' + f + ' -> seriesId and episodeNumber must both be set or both be absent');
        }
    }

    function checkRecords(file, required, label) {
        const records = JSON.parse(fs.readFileSync(path.join(root, 'site', '_data', file), 'utf8'));
        for (const rec of records) {
            for (const field of required) {
                if (rec[field] === undefined || rec[field] === null || rec[field] === '') {
                    problems.push('_data/' + file + ' -> ' + label + ' "' + (rec.id || '?') + '" missing required field "' + field + '"');
                }
            }
        }
        return records;
    }

    checkRecords('residents.json', RESIDENT_REQUIRED, 'resident');
    checkRecords('locations.json', LOCATION_REQUIRED, 'location');
    checkRecords('images.json', IMAGE_REQUIRED, 'image');

    // Alt text that is still just the seed placeholder is a real gap, not a
    // formality — flag any image not yet actually described.
    const images = JSON.parse(fs.readFileSync(path.join(root, 'site', '_data', 'images.json'), 'utf8'));
    for (const img of images) {
        if (img.altTextStatus === 'needs-confirmation' || !img.altText) {
            problems.push('_data/images.json -> image "' + img.id + '" has no real alt text yet (status: ' + img.altTextStatus + ')');
        }
    }

    return problems;
};
