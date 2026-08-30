# Progress log

Running log of the build, one entry per phase or milestone, most recent at the bottom.

## Session 1, August 29-30, 2026: workspace setup

Extracted the three source archives into `_source/` (untouched, gitignored working
reference for the inventory phase): Wagglesworth_Estate_V3, Noodles_Website_Assets_V2
(53 images, manifest with checksums), Noodles_Story_Library (30 stories in .md and
.txt, plus a manifest). Originals confirmed present in all three; the handoff prompt's
stop condition does not trigger.

Wrote CLAUDE.md for this workspace (authority, non-negotiables, verification and
delegation rules, matching the pattern proven on an earlier project). One correction
made while writing it: the plan's first draft would have gitignored the extracted
originals entirely, but GitHub Actions builds this site on every push and cannot see
anything outside the repository, so the pipeline's actual input — `assets/originals/` —
has to be git-tracked. `_source/` stays untracked as raw provenance reference only.

git initialized, `.gitignore` written, GitHub repo `wagglesworth` created (public, for
Barb's own shareable link, per Brian's decision) and pushed.

Next: Phase 1 of the handoff prompt — checksums, dedupe, the full inventory, and
DECISIONS_AND_GAPS.md.

## Phase 1: inventory and gap report

Verified rather than trusted: all 53 V2 images checked against the manifest's own
sha256 (all match, zero duplicates, disk and manifest agree exactly file-for-file);
all 30 stories' `.md`/`.txt` pairs compared and found content-identical (format twins,
`.md` is source of truth); every story's word count checked, nothing under 197 words,
no placeholders. The handoff prompt's stop condition does not trigger.

Found and recorded in DECISIONS_AND_GAPS.md, none of them guessed around: a locket
subplot with no textual home in the 30 stories despite having its own V2 image; a
Royal Summer art folder whose Lady Rosalind/hidden-ballroom material genuinely spans
three episodes rather than one, confirmed by text search rather than assumed; two of
the ten named Ladies-in-Waiting (Moira, Lexie) missing from characters.json entirely
despite having a portrait; a naming collision between the Baroness's own base identity
"Noodles" and a separately-named lady-in-waiting "Noodles Hobson," left for Barb rather
than resolved by guessing; three facts (Baroness's given name is Grace, Tilly's and
Buttons's titles) elevated from needs-confirmation to confirmed because
story_manifest.md is itself source material, not speculation; and the numbering trap
between story filenames and the official list, which the front-matter `order` field
will make moot going forward.

Locked down explicitly for later: the no-gold rule governs the design system, not
story prose — several stories legitimately describe gold-colored props, and the
validator must never scan story bodies for the word.

Wrote ASSET_AND_CONTENT_INVENTORY.md and DECISIONS_AND_GAPS.md. Next: Phase 2, the
Eleventy scaffold and content model.

## Phase 2 → Phase 3, checkpoint: scaffold, data, and all 30 stories live

Eleventy scaffold in place (`eleventy.config.js`, `site/` as the sole input directory
so project docs and tooling at the repo root are never mistaken for pages). Design
tokens as CSS custom properties in one file only, so the prohibited-color validator has
a single place to check. Image pipeline (`tools/build-images.js`, sharp) builds two
WebP widths per original into `site/assets/img/`; a `npm audit` finding in sharp's
libvips dependency was fixed by bumping to 0.35 before any image was processed.

`site/_data/images.json` seeded from the V2 manifest, then handed to a background
subagent to actually look at all 53 images and write real alt text — a script alone
cannot see a picture, and shipping blank alt text would have failed the site's own
accessibility bar on day one. All 53 came back described, grounded in what's visible,
none guessing at unseen backstory. The pass surfaced four new things worth Barb's
attention, recorded in DECISIONS_AND_GAPS.md: "Buttons" is drawn as two different
character designs across the asset set (a tabby cat in one image, a teddy bear
everywhere else); one image's own caption names different characters than its manifest
tag; a likely near-duplicate pair; and several images whose `sourceType` (photo vs.
illustration) the manifest guessed wrong from file extension alone. None of these were
resolved by guessing — all flagged for her.

`residents.json` built from the character bible plus two additions the inventory
found: Lady Moira and Lady Lexie, who had artwork and were named in story_manifest.md
but had no bible record at all. `locations.json` built by matching V2's own
storyline/event tags against the actual story text (verified by search, not assumed) —
several locations' art turned out to span multiple episodes rather than one, recorded
honestly rather than forced into a single passage.

The 30 stories required one real content decision, executed carefully rather than by
blind find-replace: 20 occurrences of "Noodleverse" across 15 story files, which the
non-negotiable public-naming rule forbids. This is not invented canon — it is the
locked rebrand V3's own decision log already mandates — so each instance was resolved
by hand (place-name uses became "Wagglesworth Estate," collective-family uses became
"household"), every single substitution logged verbatim in DECISIONS_AND_GAPS.md for
Barb to review, and the generation script asserts zero "Noodleverse" residue before
writing a file. The repeated "restored edition" disclaimer (27 slightly-differently-
worded copies) was stripped from each story body and will be stated once, clearly, on
the Stories archive page instead.

Front gates (`site/index.njk`) and the post-entry landing page (`site/estate.njk`) are
built and verified; the Baroness's welcome line is drafted from her established voice
in story 07 and logged in COPY_REVIEW.md for approval, not presented as canon. Story
pages verified end to end: hero images, end-of-story galleries, and deterministic
Previous/Next within series (computed via eleventyComputed against the stories
collection, not in-template Nunjucks `set`, which does not leak out of a `for` loop —
worth remembering for any future collection-derived data).

`npx eleventy` builds clean: 33 files from 30 stories + front gates + estate landing +
the search index. Next: the Stories archive, Residents, Map, Gallery, AI-adventure,
About, and utility pages.

## Phase 3 complete: every page type built; Phase 4 validators passing clean

Built the remaining page types: the Stories archive (grouped by series then by
category, with the "restored editions" provenance note stated once here instead of 27
times in the story bodies, plus a story-only live search filtering on top of a fully
keyboard-navigable list that works with no JavaScript at all); Meet the Residents
(Baroness featured first per the design document, the other three groups below her,
each profile a single data-driven template rather than 21 hand-written pages); Explore
the Estate (an SVG grid map whose boxes are real semantic `<a>` hotspots, keyboard
reachable and visibly focused, paired with a plain link list underneath so nothing
ever depends on hitting a precise spot); the Estate Gallery grouped into the five
required categories; Creating Your Own Noodles Adventure with AI, built from the V3
tutorial-prompts data and the AI plan document's ten-lesson path, honestly noting that
its Wagglesworth case-study examples are waiting on the same missing artwork logged in
DECISIONS_AND_GAPS.md rather than faking a walkthrough it can't back up; and About,
Accessibility, Privacy, and Site Map.

Two real template bugs caught by building and inspecting rather than assuming: a page
missing `layout: layouts/base.njk` in its front matter rendered with no site chrome at
all (caught immediately by grepping the built output rather than trusting the
template); and the custom `dump` filter feeding the search-index JSON template
produced literal invalid JSON for every story with no series, because
`JSON.stringify(undefined)` returns the JS value `undefined` rather than a string,
which Nunjucks then silently renders as nothing — caught by actually parsing the built
search-index.json rather than trusting that "the build succeeded" meant the output was
valid.

Wrote the seven validators CLAUDE.md requires (`tools/check.js` plus one module per
check): broken internal links, missing alt text in built output, prohibited terms, required
metadata, episode ordering, duplicate IDs/slugs, and a cross-reference check(added beyond the
minimum) that catches a typo'd image or resident id before it renders as a silently
missing picture. The prohibited-terms check itself caught a real bug in its own first
run: it flagged `tokens.css`'s own code comments explaining the no-gold rule, because
the word "gold" appears in the explanation of the rule. Fixed by stripping CSS/SVG
comments before scanning, the same way the Noodleverse check already strips HTML tags
before scanning page text — a validator that flags its own documentation is exactly as
wrong as one that misses a real violation.

`npm run build` produces a clean 72-file `_site/`; `npm run check` passes all seven
checks clean. Next: the reviewer subagent passes (accessibility, design drift against
V3, content fidelity), then generated stand-in art, GitHub Actions deployment, and the
maintenance handoff.

## Generated stand-in art

Three pieces authored, all logged in GENERATED_ART.md and marked
`"provenance": "generated-stand-in"` in images.json: a hardware-store scene (gate and
tools), a Queso Valentine still life (bowl, chips, hearts), and a snow-day/UNO scene
(falling snow, a fan of cards with a rose motif in place of ordinary suits) — filling
the three pages that would otherwise have shipped with no illustration at all.

One boundary was drawn carefully before drawing anything: the character bible marks
Queso's appearance `asset_missing` and Keady's `to confirm`, so no stand-in draws
either of them, or any character at all — inventing a visual design for a character
the source material never fixed one for would be exactly the gap-filling CLAUDE.md
forbids. All three pieces are scene and object motifs only. Episode Six's own P0 gap
was left ungenerated for a different reason: that episode already has seven real
illustrations, so a stand-in there would not be filling a genuine absence.

Wiring an SVG stand-in in place of a raster original needed one real fix: every
template referenced images as `<id>-960.webp`/`<id>-480.webp`, which would 404 for a
`.svg` file the pipeline copies through unchanged. Added one `imgSrc` filter
centralizing the choice (raster width suffix vs. bare `.svg`) so every template asks
one function instead of six templates each growing their own conditional.

`npm run build` and `npm run check` both still pass clean with the new art in place.

## Caught: derivatives were being committed to git

The .gitignore pattern for built image derivatives said `assets/img/derived/`, which
never matched the actual build output path (`site/assets/img/`), so 109 regenerable
WebP and SVG files had been committed across the last three commits before this was
noticed and fixed. Untracked with `git rm --cached` (files stay on disk, still
rebuilt by `npm run images`); the old blobs remain in git history rather than being
rewritten, since history-rewriting is a destructive operation outside this run's
authority — a minor, harmless inefficiency in an otherwise small repo, not a blocker.
