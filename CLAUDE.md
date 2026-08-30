# Wagglesworth Estate: rules for Claude Code

Read this file first in every session. The full content authority is
CLAUDE_CODE_START_HERE.txt in this folder; this file is the operational layer that
prompt does not cover. History lives in PROGRESS.md; open questions in ISSUES.md.

## Who this is for

This is Barb's project: 30 stories and 53 illustrations from her Facebook community,
built into a public website by Brian through Claude Code. Barb reviews visuals and
voice copy; she is not a developer. Brian verifies structure and accessibility by
keyboard and NVDA screen reader — nothing visual counts as verification from him.
Write summaries for him in plain prose, and say what to test with a keyboard or a
screen reader, not what to look at.

After handoff, the site is maintained from Barb's computer through a desktop chat
assistant (Claude Desktop or GPT Desktop), not through a local toolchain — see
MAINTENANCE.md once it exists. Every content shape (`content/templates/`) has to be
fillable correctly by an assistant working from a conversation, with the hard rules
restated in the template itself, because that assistant will not have read this file.

## Authority

CLAUDE_CODE_START_HERE.txt is the content authority for what the site must be and
contain. Where the archived documents conflict, Wagglesworth_Estate_V3 wins, and the
conflict is recorded in DECISIONS_AND_GAPS.md — never silently resolved. You may add
facts to the gap and decision files; you may not invent your way around a real gap.
The original three zip archives in this folder, and everything extracted into
`_source/`, are read-only reference and are never modified, renamed, or deleted.

## Non-negotiables (from CLAUDE_CODE_START_HERE.txt)

Public name is "Wagglesworth Estate." Never "Noodleverse" anywhere public-facing —
copy, routes, metadata, alt text, filenames. Credited "Created by Barb"; the About
page says only that the stories began in an online Facebook community.

Palette is royal purple `#5B2C83`, soft pink `#E8B7CF`, silver `#A7A9AC`, cream
`#FFF8E8`, ink `#2B2030`. Absolutely no gold, gold gradients, champagne gold, or
yellow-metal ornament, in raster art, SVG, or CSS. The Silver Rose is the permanent
crest and a recurring motif.

No invented canon. Character traits, relationships, sayings, titles, and story events
that are not in the source material stay marked "needs confirmation," visibly, rather
than being filled in with something plausible. Any interface copy written in a
character's voice (the front-gate welcome, section intros) is drafted from that
character's established voice in the 30 stories, but is never presented as canon: it
goes in COPY_REVIEW.md for Barb to approve, edit, or replace, clearly separated from
story text.

Generated stand-in art, where the plan calls for it in place of an absent original, is
authored original SVG in the approved palette — never an attempt to imitate the
painterly PNG style, and never inventing scene details the story text does not
describe. Every piece is logged in GENERATED_ART.md and marked
`"provenance": "generated-stand-in"` in image metadata, swap-ready the moment a real
original surfaces.

WCAG 2.2 AA is the floor: semantic structure, full keyboard operation, visible focus,
screen-reader support, responsive reflow, real alt text, `prefers-reduced-motion`
honored, contrast at 4.5:1 body / 3:1 large-and-UI, and a working A− / A+ / Reset
text-size control that survives a reload. No autoplay of music or audio. No comments,
guestbook, accounts, admin system, Facebook button, or audio narration in this release.

## Site shape

Eleventy generates plain HTML from `content/*.md` (stories, front matter) and
`data/*.json` (residents, locations, galleries, seasonal entrances, images). No
client-side framework ships to the browser — vanilla JS only for the text-size control
and the story-only search. Adding a story is adding one markdown file; the generator
is a build-time tool, never a runtime dependency for a visitor.

Original images live in `assets/originals/`, unchanged, and are tracked in git —
GitHub Actions builds the site on every push and has no access to anything outside the
repo, so the originals have to actually be there, not just in the local `_source/`
extraction folder (which is untracked working reference only, used for the Phase 1
inventory and as provenance). Every published derivative is generated at build time
into `assets/img/` from `assets/originals/` plus `data/images.json`, and is disposable —
never hand-edited, never committed by hand.

Every page carries a `noindex` meta tag and `robots.txt` disallows the whole site,
until Barb approves going live to search engines. That is a single documented switch
(see DECISIONS_AND_GAPS.md) — do not remove it without being told to.

## Code conventions

Plain Node for build scripts and validators (`tools/`), UTF-8, four-space indentation,
single quotes. Nunjucks templates for Eleventy. No TypeScript, no bundler beyond what
Eleventy needs, no framework runtime shipped to the browser.

## Verification, always

Before any commit: `npm run build` produces a clean `_site/` with no errors, and
`npm run check` (the validators — broken internal links, missing required metadata,
missing alt text, invalid episode ordering, duplicate IDs/slugs, "Noodleverse" in
output, gold-family color values in output) passes clean. Commit after every coherent
milestone with a message naming it, and push as part of the work — do not hold pushes
back for Brian to do separately.

After a phase that changes what the site looks or sounds like, spawn a fresh read-only
reviewer subagent: an accessibility auditor, a design-drift auditor checking output
against the V3 documents, or a content-fidelity check that nothing in the built site
states invented canon as fact and every in-character line traces to COPY_REVIEW.md.
Fix what is real; log the rest in REVIEW_NOTES.md.

## Delegation

Subagents are for read-only review (the three above) and for running the validators
and link/contrast/axe checks at scale and reporting anomalies. A subagent may not
decide a content-model shape, resolve a V2/V3 conflict, or invent a fact to fill a
gap — it reports, the main agent decides.

## Reporting

PROGRESS.md is a running log, one entry per phase or milestone: what was built, what
the validators said, what a reviewer found. ISSUES.md holds open questions and things
deferred. DECISIONS_AND_GAPS.md is the permanent record of every V2/V3 conflict and
every real content gap — read it before assuming something is missing that was
already resolved. At the end of a session, write MORNING_REPORT.md: the live URL,
exactly what to test with a keyboard and NVDA, what Barb needs to review (COPY_REVIEW.md,
GENERATED_ART.md, any open gap), and any decision still waiting on either of them.
