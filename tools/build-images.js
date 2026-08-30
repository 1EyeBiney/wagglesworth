// Builds every web derivative from assets/originals/ + site/_data/images.json.
// Runs before every `eleventy` build (see package.json). Originals are never
// touched or overwritten; every derivative here is disposable and can be
// regenerated from scratch at any time — that's the point of separating them.
//
// Two widths per image: 960 (story hero / detail view) and 480 (gallery
// cards, end-of-story thumbnails), both as WebP. A generated stand-in SVG
// (GENERATED_ART.md) is copied through unchanged — vector art doesn't need
// raster derivatives.
'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMAGES_JSON = path.join(ROOT, 'site', '_data', 'images.json');
const OUT_DIR = path.join(ROOT, 'site', 'assets', 'img');
const WIDTHS = [480, 960];

async function main() {
    const images = JSON.parse(fs.readFileSync(IMAGES_JSON, 'utf8'));
    fs.mkdirSync(OUT_DIR, { recursive: true });

    let built = 0, skippedMissing = 0, copiedSvg = 0;

    for (const img of images) {
        const srcPath = path.join(ROOT, img.sourcePath);

        if (img.sourcePath.toLowerCase().endsWith('.svg')) {
            const dest = path.join(OUT_DIR, img.id + '.svg');
            if (!fs.existsSync(srcPath)) {
                console.warn('MISSING generated-art source:', img.sourcePath);
                skippedMissing++;
                continue;
            }
            fs.copyFileSync(srcPath, dest);
            copiedSvg++;
            continue;
        }

        if (!fs.existsSync(srcPath)) {
            console.warn('MISSING original, skipped:', img.sourcePath);
            skippedMissing++;
            continue;
        }

        for (const width of WIDTHS) {
            const dest = path.join(OUT_DIR, img.id + '-' + width + '.webp');
            await sharp(srcPath)
                .resize({ width, withoutEnlargement: true })
                .webp({ quality: 82 })
                .toFile(dest);
        }
        built++;
    }

    console.log('Image pipeline: ' + built + ' originals processed (' + WIDTHS.length + ' sizes each), ' +
                copiedSvg + ' generated-art SVGs copied through, ' + skippedMissing + ' missing sources skipped.');
    if (skippedMissing > 0) {
        console.warn('Skipped sources indicate a data/images.json record whose file does not exist yet — check GENERATED_ART.md / ASSET_AND_CONTENT_INVENTORY.md.');
    }
}

main().catch(function (err) {
    console.error(err);
    process.exit(1);
});
