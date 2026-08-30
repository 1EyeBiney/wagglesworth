// One-time content-generation script: builds site/content/stories/*.md from
// the restored story library in _source/. Kept in tools/ for repeatability
// (e.g. if a story is later corrected at the source), not part of the build.
//
// Two edits are made to every story's body text, both logged in full below
// and cross-referenced into DECISIONS_AND_GAPS.md, never applied silently:
//
// 1. Every "Noodleverse" occurrence is replaced. This is not an invented
//    change - it is the locked, non-negotiable rebrand from V3's own
//    decision_log.json ("never use 'Noodleverse' in public-facing copy")
//    and the character bible ("Match the approved public name. Use
//    Wagglesworth Estate, never Noodleverse."). No plot fact, character
//    trait, or event is altered - only the collective-noun label. Each
//    instance is a specific, reviewed find/replace pair below, not a blind
//    regex, because "Noodleverse" is sometimes used as a place name
//    ("came to the Noodleverse" -> "Wagglesworth Estate") and sometimes as
//    a stand-in for the household ("the Noodleverse missed him" ->
//    "the household missed him").
// 2. The italic/bold "restored edition" provenance disclaimer at the top of
//    most story files is stripped from the body. It is real, honest
//    provenance information (story_manifest.md says these are restored
//    editions, not verbatim transcripts) but repeating a differently-worded
//    version of it 27 times reads as noise; it is stated once, clearly, on
//    the Stories archive page instead.
'use strict';

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', '_source', 'Noodles_Story_Library', 'stories');
const OUT_DIR = path.join(__dirname, '..', 'site', 'content', 'stories');

// The one substitution needed in a story's H1 title rather than its body,
// applied separately below since the title line is stripped out of the body
// before body substitutions run.
const TITLE_SUBSTITUTIONS = {
    '19_keadys_royal_interview.md': [
        ['The Interview: Keady Comes to the Noodleverse', 'The Interview: Keady Comes to Wagglesworth Estate']
    ]
};

// Every "Noodleverse" instance found by `grep -in noodleverse *.md`, resolved
// by hand. Exact substring match, applied once each, in file order.
const SUBSTITUTIONS = {
    '05_episode_five_hidden_ballroom.md': [
        ['all of the Noodleverse shall be invited', 'all of Wagglesworth Estate shall be invited']
    ],
    '06_enchanted_silver_rose_ball.md': [
        ['looked around at her Noodleverse family', 'looked around at her Estate family']
    ],
    '07_baroness_origin_story.md': [
        ['the entire Noodleverse has been living under her rule', 'the entire Estate has been living under her rule']
    ],
    '16_baroness_valentine_queso.md': [
        ['arrived at the Noodleverse with flowers', 'arrived at Wagglesworth Estate with flowers']
    ],
    '17_snow_day_uno_suspicion.md': [
        ['every outdoor plan the Noodleverse had made', 'every outdoor plan the household had made']
    ],
    '19_keadys_royal_interview.md': [
        ['What qualifications do you bring to the Noodleverse?', 'What qualifications do you bring to Wagglesworth Estate?'],
        ['The Noodleverse could use an expansion', 'Wagglesworth Estate could use an expansion']
    ],
    '20_we_are_expanding_couch.md': [
        ['The Noodleverse had a seating crisis', 'Wagglesworth Estate had a seating crisis']
    ],
    '21_purdue_goodbye_for_keady.md': [
        ['For once, the Noodleverse was quiet', 'For once, the household was quiet'],
        ['the whole Noodleverse called after him', 'the whole household called after him']
    ],
    '22_keadys_big_purdue_adventure.md': [
        ['Back at home, the Noodleverse followed his adventures by phone', 'Back at home, the household followed his adventures by phone'],
        ['The Noodleverse missed him, but they cheered him on', 'The household missed him, but they cheered him on']
    ],
    '25_great_peanut_butter_incident.md': [
        ['The official Noodleverse report blamed', 'The official household report blamed']
    ]
};

// Strips the H1 title line and, if present immediately after it, one
// italic (*...*) or bold (**Archive status:**...) disclaimer paragraph.
// Returns { title, body }.
function splitTitleAndBody(raw) {
    const lines = raw.split('\n');
    let i = 0;
    while (i < lines.length && lines[i].trim() === '') i++;
    const titleLine = lines[i] || '';
    const title = titleLine.replace(/^#\s*/, '').trim();
    i++;
    while (i < lines.length && lines[i].trim() === '') i++;
    if (i < lines.length && (/^\*[^*].*\*$/.test(lines[i].trim()) || /^\*\*Archive status:\*\*/.test(lines[i].trim()))) {
        i++;
    }
    while (i < lines.length && lines[i].trim() === '') i++;
    return { title, body: lines.slice(i).join('\n').trim() + '\n' };
}

function applySubstitutions(filename, text) {
    const pairs = SUBSTITUTIONS[filename] || [];
    let out = text;
    const applied = [];
    for (const [from, to] of pairs) {
        if (out.indexOf(from) === -1) {
            throw new Error('Expected substitution text not found in ' + filename + ': "' + from + '"');
        }
        out = out.split(from).join(to);
        applied.push([from, to]);
    }
    return { text: out, applied };
}

// order, seriesId/episodeNumber, primaryCollection, characters (resident
// ids), summary (from story_manifest.md, Barb's own words), and confirmed
// image placements (see DECISIONS_AND_GAPS.md for the reasoning behind
// each). Categorization into collections is a navigational judgment call,
// freely adjustable later - not a canon fact.
const META = {
    '01_episode_one_summer_at_wagglesworth': { order: 1, seriesId: 'royal-summer', episodeNumber: 1, primaryCollection: 'tales-from-the-estate',
        characters: ['baroness-wagglesworth', 'isla', 'piper', 'siren', 'astrid', 'virginia', 'special-sparkle', 'hobson', 'dame-muriel', 'moira', 'lexie'],
        summary: 'Royal tea, white roses, pawgaritas, the ten Ladies-in-Waiting, and the first mysterious clue.' },
    '02_episode_two_garden_mystery': { order: 2, seriesId: 'royal-summer', episodeNumber: 2, primaryCollection: 'tales-from-the-estate',
        characters: ['isla'], heroImage: 'secret_garden_purple_rose_mystery', galleryImages: ['royal_pups_and_the_secret_garden', 'royal_tea_party_investigation'],
        summary: "Lady Isla's song, the bare circle in the garden, a silver bell, and the forgotten music box." },
    '03_episode_three_home_leave': { order: 3, seriesId: 'royal-summer', episodeNumber: 3, primaryCollection: 'tales-from-the-estate',
        characters: ['baroness-wagglesworth', 'tilly', 'buttons', 'esme'], heroImage: 'baroness_and_tilly_poolside_retreat',
        summary: "Baroness and Tilly at the pool, the ladies' return, croquet, Buttons's crush on Esme, and the mysterious golden key." },
    '04_episode_four_mysterious_key': { order: 4, seriesId: 'royal-summer', episodeNumber: 4, primaryCollection: 'tales-from-the-estate',
        characters: ['special-sparkle', 'lady-rosalind'], heroImage: 'countess_tilly_guards_mysterious_key',
        galleryImages: ['buttons_and_forbidden_crown_key', 'mysterious_key_warning_parchement'],
        summary: 'The "DO NOT TOUCH" signs, Special Sparkle\'s glitter gown, Lady Rosalind, the portrait door, and the possibly cursed staircase.' },
    '05_episode_five_hidden_ballroom': { order: 5, seriesId: 'royal-summer', episodeNumber: 5, primaryCollection: 'tales-from-the-estate',
        characters: ['baroness-wagglesworth', 'petunia', 'lady-rosalind'], heroImage: 'wagglesworth_hidden_ballroom',
        galleryImages: ['hidden_ballroom_royal_warning', 'royal_pups_descend_hidden_staircase', 'puppy_princesses_descend_hidden_ballroom', 'lady_rosalind_secret_portrait'],
        summary: 'The hidden ballroom, soft-pink velvet curtains, the restored Silver Rose, music boxes, candlelight, Petunia on the pedestal, and the announcement of the ball.' },
    '06_enchanted_silver_rose_ball': { order: 6, seriesId: 'royal-summer', episodeNumber: 6, primaryCollection: 'tales-from-the-estate',
        characters: ['baroness-wagglesworth', 'lady-rosalind'], heroImage: 'royal_court_of_the_glowing_rose',
        galleryImages: ['enchanted_ballroom_before_silver_rose_doors', 'ladies_in_royal_ball_gowns', 'plush_court_before_silver_rose', 'whimsical_royal_ballroom', 'royal_ball_before_silver_doors', 'baroness_silver_rose_ball_reminder'],
        summary: "The grand finale, the secret that Her Grace's name is Grace, the last silver key, the completed mystery, and the end of the Ladies-in-Waiting's royal summer." },
    '07_baroness_origin_story': { order: 7, primaryCollection: 'tales-from-the-estate',
        characters: ['baroness-wagglesworth', 'buttons', 'petunia', 'tilly', 'dad'], heroImage: 'baroness_wagglesworth_solo_ballroom',
        summary: 'The funny origin of the Baroness, her throne, her household, and her royal title.' },
    '08_hardware_store': { order: 8, primaryCollection: 'everyday-adventures', characters: ['dad', 'uncle-chris'],
        heroImage: 'hardware_store_stand_in',
        summary: "Dad, Uncle Chris, chai tea, the enormous gate, concrete bags, air vents, PA announcements, Dad's snark, beef jerky, and the pipe wrench." },
    '09_jaws_movie_night': { order: 9, primaryCollection: 'everyday-adventures', characters: ['dad', 'baroness-wagglesworth', 'buttons', 'petunia'],
        summary: 'Dad needs quiet to hear the movie, while the Baroness, Buttons, and Petunia react to the shark.' },
    '10_astrid_roller_skates': { order: 10, primaryCollection: 'tales-from-the-estate', characters: ['astrid'], heroImage: 'lady_astrid_royal_procession',
        summary: "Astrid makes sure the official Wagglesworth record never forgets her — or her roller skates — again." },
    '11_badminton_margaritas': { order: 11, primaryCollection: 'parties-and-balls',
        characters: ['piper', 'siren', 'astrid', 'virginia', 'isla', 'special-sparkle', 'hobson', 'dame-muriel', 'moira', 'lexie', 'buttons', 'esme'],
        heroImage: 'wagglesworth_estate_badminton_soiree',
        summary: "All ten Ladies-in-Waiting, a garden match, glitter, roller skates, Buttons and Esme, and Lady Virginia's refreshments." },
    '12_ladies_home_three_days': { order: 12, primaryCollection: 'everyday-adventures', characters: ['baroness-wagglesworth'],
        summary: 'The Baroness insists she enjoys the quiet and then spends three days proving otherwise.' },
    '13_great_pantry_raid_2025': { order: 13, primaryCollection: 'everyday-adventures', characters: ['baroness-wagglesworth', 'buttons', 'petunia', 'dad'],
        summary: 'The Baroness, Buttons, and Petunia attempt a midnight snack raid, but Dad hears everything.' },
    '14_case_of_the_vanishing_invitation': { order: 14, primaryCollection: 'tales-from-the-estate', characters: ['tilly', 'petunia', 'esme'],
        heroImage: 'royal_pawgarita_ball_invitation',
        summary: 'An earlier-style Estate mystery involving a gold-edged invitation, suspicious wind, missing crackers, and card night.' },
    '16_baroness_valentine_queso': { order: 15, primaryCollection: 'holidays-and-special-events', characters: ['baroness-wagglesworth', 'queso'],
        heroImage: 'queso_valentine_stand_in',
        summary: 'The Valentine\'s story with chips, queso, a steak quesadilla, extra cheese, and the Baroness\'s "emotionally supportive cheese."' },
    '17_snow_day_uno_suspicion': { order: 16, primaryCollection: 'everyday-adventures', characters: ['baroness-wagglesworth', 'buttons', 'petunia'],
        heroImage: 'uno_snow_day_stand_in',
        summary: 'Baroness, Buttons, and Petunia play UNO while Mom works; Buttons suspects everyone of cheating.' },
    '18_making_buckeyes': { order: 17, primaryCollection: 'everyday-adventures', characters: ['baroness-wagglesworth', 'buttons', 'petunia'],
        heroImage: 'making_buckeyes_with_cuddly_helpers',
        summary: 'Mom, Baroness, Buttons, and Petunia make peanut-butter-and-chocolate Buckeye candy.' },
    '19_keadys_royal_interview': { order: 18, primaryCollection: 'everyday-adventures', characters: ['keady', 'baroness-wagglesworth', 'buttons', 'petunia'],
        summary: 'The large Purdue bear meets the Baroness, Buttons, and Petunia at the tiny white bench and joins the household.' },
    '20_we_are_expanding_couch': { order: 19, primaryCollection: 'everyday-adventures', characters: ['keady', 'baroness-wagglesworth'],
        summary: "Keady's arrival proves the tiny bench is no longer enough; the Baroness demands a proper sectional." },
    '21_purdue_goodbye_for_keady': { order: 20, primaryCollection: 'everyday-adventures', characters: ['keady'],
        summary: 'A quiet family farewell as Keady leaves for his Purdue opportunity.' },
    '22_keadys_big_purdue_adventure': { order: 21, primaryCollection: 'trips-and-outings', characters: ['keady', 'buttons', 'petunia', 'baroness-wagglesworth'],
        summary: 'Keady helps students find books, parking, and snacks before Purdue offers him a permanent position.' },
    '23_campfire_exile': { order: 22, primaryCollection: 'trips-and-outings', characters: ['baroness-wagglesworth'],
        summary: "The Baroness sits safely away from the fire, salty about her unused gold-plated marshmallow holder." },
    '24_petunias_secret_campfire_visit': { order: 23, primaryCollection: 'trips-and-outings', characters: ['petunia', 'buttons'],
        summary: "Tiny Petunia sneaks to the campfire inside Noodles's bag while Buttons assists the mission." },
    '25_great_peanut_butter_incident': { order: 24, primaryCollection: 'everyday-adventures', characters: ['baroness-wagglesworth'],
        summary: 'Baroness, Echo, and Straxx create a sticky kitchen mystery for Mom and blind Dad.' },
    '26_noodles_mask_tastrophe': { order: 25, primaryCollection: 'holidays-and-special-events', characters: ['dad'],
        summary: 'A homemade foam, makeup, and glitter Halloween mask frightens Mom while Dad pauses NFB-NEWSLINE.' },
    '27_operation_retrieve_credit_card': { order: 26, primaryCollection: 'everyday-adventures', characters: [],
        summary: 'Mom and Dad discover that pajama-clad Noodles used the missing card to order tropical vacation clothes.' },
    '28_operation_pawgarita_patrol': { order: 27, primaryCollection: 'holidays-and-special-events', characters: [],
        summary: 'Mom and Dad overhear a ghost-costume meeting about Halloween candy, pawgaritas, and a blender mission until VoiceOver exposes them.' },
    '29_go_be_free': { order: 28, primaryCollection: 'holidays-and-special-events', characters: ['baroness-wagglesworth', 'buttons', 'petunia'],
        summary: 'Baroness, Buttons, and Petunia dress as ghosts, remain safely inside, and declare dessert-based freedom.' },
    '30_baroness_vs_spring': { order: 29, primaryCollection: 'everyday-adventures', characters: ['baroness-wagglesworth'],
        summary: 'Unicorn-tutu dancing, aggressive pollen, tree dandruff, crackers, weather ballet, and wet mulch.' },
    '31_princess_noodles_florida_adventure': { order: 30, primaryCollection: 'trips-and-outings', characters: ['baroness-wagglesworth'],
        newestAdventure: true,
        summary: 'Bibbidi Bobbidi Boutique, meeting Lady, Universal Grinchmas, Breakers, New Smyrna Beach, and a moonlit bungalow ending.' }
};

function slugFor(stem) {
    return stem.replace(/^\d+_/, '').replace(/_/g, '-');
}

function yamlString(s) {
    return JSON.stringify(s);
}
function yamlArray(arr) {
    if (!arr || !arr.length) return '[]';
    return '[' + arr.map(yamlString).join(', ') + ']';
}

function main() {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const allSubstitutionsApplied = [];
    let count = 0;

    for (const stem of Object.keys(META)) {
        const filename = stem + '.md';
        const srcPath = path.join(SRC_DIR, filename);
        const raw = fs.readFileSync(srcPath, 'utf8');
        const { title: rawTitle, body: rawBody } = splitTitleAndBody(raw);
        const { text: subbedBody, applied } = applySubstitutions(filename, rawBody);
        if (applied.length) allSubstitutionsApplied.push({ file: filename, applied });

        // The title itself needed a substitution in exactly one case (story
        // 19) — logged the same as any other, via its own table.
        let title = rawTitle;
        const titlePairs = TITLE_SUBSTITUTIONS[filename] || [];
        for (const [from, to] of titlePairs) {
            if (title.indexOf(from) === -1) {
                throw new Error('Expected title substitution text not found in ' + filename + ': "' + from + '"');
            }
            title = title.split(from).join(to);
        }
        if (titlePairs.length) allSubstitutionsApplied.push({ file: filename + ' (title)', applied: titlePairs });

        if (/noodleverse/i.test(subbedBody) || /noodleverse/i.test(title)) {
            throw new Error('Un-substituted "Noodleverse" survived in ' + filename + ' — fix SUBSTITUTIONS before continuing.');
        }

        const meta = META[stem];
        const slug = slugFor(stem);
        const front = [
            '---',
            'title: ' + yamlString(title),
            'slug: ' + yamlString(slug),
            'order: ' + meta.order,
            meta.seriesId ? 'seriesId: ' + yamlString(meta.seriesId) : null,
            meta.episodeNumber ? 'episodeNumber: ' + meta.episodeNumber : null,
            'primaryCollection: ' + yamlString(meta.primaryCollection),
            'characters: ' + yamlArray(meta.characters),
            'summary: ' + yamlString(meta.summary),
            meta.heroImage ? 'heroImage: ' + yamlString(meta.heroImage) : null,
            meta.galleryImages ? 'galleryImages: ' + yamlArray(meta.galleryImages) : null,
            meta.newestAdventure ? 'newestAdventure: true' : null,
            'permalink: ' + yamlString('/stories/' + slug + '/'),
            '---'
        ].filter(Boolean).join('\n');

        fs.writeFileSync(path.join(OUT_DIR, slug + '.md'), front + '\n\n' + subbedBody, 'utf8');
        count++;
    }

    console.log('Generated', count, 'story files in', OUT_DIR);
    console.log('\nSubstitutions applied (also recorded in DECISIONS_AND_GAPS.md):');
    for (const entry of allSubstitutionsApplied) {
        console.log(' ', entry.file);
        for (const [from, to] of entry.applied) {
            console.log('    "' + from + '"');
            console.log('    -> "' + to + '"');
        }
    }
}

main();
