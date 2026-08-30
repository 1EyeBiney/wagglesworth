// One-time seed script: builds site/_data/images.json from the V2 asset
// manifest. Run once during Phase 2 setup; after that, images.json is hand
// (or assistant) maintained directly — this script is not part of the build.
//
// Categorization into the site's five gallery buckets is a judgment call
// recorded in DECISIONS_AND_GAPS.md, not an asserted fact from the source
// material: V2's own folders do not map 1:1 onto the site's gallery
// categories, so this is a reasonable starting placement Barb can freely
// recategorize later since it is only a data field.
'use strict';

const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', '_source', 'Noodles_Website_Assets_V2', 'asset_manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

function galleryCategoryFor(relPath) {
    if (relPath.startsWith('Characters/') || relPath.startsWith('Ladies_in_Waiting/')) return 'characters';
    if (relPath.startsWith('Royal_Summer_Series/')) return 'tales-from-the-estate';
    if (relPath.startsWith('Events_and_Memes/')) return 'special-events';
    if (relPath.startsWith('Reference_Photos/')) return 'behind-the-scenes';
    // Early_Stories/*, Wagglesworth_Estate/*
    return 'everyday-adventures';
}

function sourceTypeFor(a) {
    return a.format === 'JPEG' || a.relative_path.toLowerCase().endsWith('.jpeg') ? 'photo' : 'illustration';
}

const images = manifest.assets.map(function (a) {
    return {
        id: a.asset_id,
        sourcePath: 'assets/originals/' + a.relative_path,
        originalLibraryFilename: a.original_library_filename,
        galleryCategory: galleryCategoryFor(a.relative_path),
        sourceType: sourceTypeFor(a),
        characters: a.characters ? a.characters.split(';').map(function (s) { return s.trim(); }).filter(Boolean) : [],
        storylineOrEvent: a.storyline_or_event || '',
        width: a.width,
        height: a.height,
        format: a.format,
        sizeBytes: a.size_bytes,
        sha256: a.sha256,
        provenance: 'original',
        publicUseApproved: true,
        caption: '',
        // Real alt text needs a human (or an assistant working from the actual
        // picture) to look at the image and describe what is happening —
        // this script only has metadata, not eyes. Left explicitly blank
        // and flagged rather than guessed, per CLAUDE.md.
        altText: '',
        altTextStatus: 'needs-confirmation',
        notes: a.notes || ''
    };
});

const outPath = path.join(__dirname, '..', 'site', '_data', 'images.json');
fs.writeFileSync(outPath, JSON.stringify(images, null, 4) + '\n', 'utf8');
console.log('Wrote', images.length, 'image records to', outPath);
