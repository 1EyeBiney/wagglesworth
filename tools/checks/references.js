// Referential integrity: every place one record points at another by id
// (a story's heroImage, a resident's portraitImage, a location's
// associatedResidents) must point at something that actually exists. A typo
// here would otherwise render silently as a missing picture or a dead link.
'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

module.exports = function checkReferences(root) {
    const problems = [];
    const dataDir = path.join(root, 'site', '_data');

    const residents = JSON.parse(fs.readFileSync(path.join(dataDir, 'residents.json'), 'utf8'));
    const locations = JSON.parse(fs.readFileSync(path.join(dataDir, 'locations.json'), 'utf8'));
    const images = JSON.parse(fs.readFileSync(path.join(dataDir, 'images.json'), 'utf8'));
    const imageIds = new Set(images.map(function (i) { return i.id; }));
    const residentIds = new Set(residents.map(function (r) { return r.id; }));

    function checkImageRef(where, id) {
        if (id && !imageIds.has(id)) problems.push(where + ' references unknown image id "' + id + '"');
    }
    function checkResidentRef(where, id) {
        if (id && !residentIds.has(id)) problems.push(where + ' references unknown resident id "' + id + '"');
    }

    for (const r of residents) {
        checkImageRef('resident "' + r.id + '".portraitImage', r.portraitImage);
        (r.galleryImages || []).forEach(function (id) { checkImageRef('resident "' + r.id + '".galleryImages', id); });
    }
    for (const loc of locations) {
        (loc.images || []).forEach(function (id) { checkImageRef('location "' + loc.id + '".images', id); });
        (loc.associatedResidents || []).forEach(function (id) { checkResidentRef('location "' + loc.id + '".associatedResidents', id); });
    }

    const storiesDir = path.join(root, 'site', 'content', 'stories');
    for (const f of fs.readdirSync(storiesDir)) {
        if (!f.endsWith('.md')) continue;
        const { data } = matter(fs.readFileSync(path.join(storiesDir, f), 'utf8'));
        checkImageRef('story "' + f + '".heroImage', data.heroImage);
        (data.galleryImages || []).forEach(function (id) { checkImageRef('story "' + f + '".galleryImages', id); });
        (data.characters || []).forEach(function (id) { checkResidentRef('story "' + f + '".characters', id); });
    }

    return problems;
};
