# Review notes

Findings from the three read-only reviewer subagents run at the end of Phase 4
(accessibility, design-drift vs. V3, content fidelity), plus one deploy-time bug found
afterward by checking the actual live URL rather than the local build. Each finding
says what was found, what was done about it, and where. Fixed items are also in
ISSUES.md's Done section; open items are in ISSUES.md's Open section.

## Accessibility audit

Built `_site/` fresh, ran `npm run check` (clean), then scanned all 71 built pages for
heading-level skips, alt-text quality, and computed real WCAG contrast ratios from the
token hex values.

- **Fixed:** `/estate/` skipped a heading level — h1 straight to five h3 card titles,
  because the only h2 on the page is conditional on a story having
  `newestAdventure: true`. An NVDA user navigating by heading (H key) would read this
  as a missing section. The five card titles are now h2.
- **Fixed:** focus outline on the purple header/footer measured 1.58:1 contrast against
  the bar (SC 1.4.11 needs 3:1) — nearly invisible when tabbing through nav. Added a
  cream-colored focus ring scoped to `.site-header`/`.site-footer` (9.30:1).
- **Checked clean, no action needed:** alt text on every image across all 71 pages;
  the text-size control (real buttons, individually labeled, single live-region
  announcer); the search box (correctly associated label, live-region status,
  genuinely removes filtered items from the accessibility tree via `hidden`, not just
  visually); the three generated stand-in SVGs (`role="img"` plus real `title`/`desc`
  matching their `alt` text); `prefers-reduced-motion` handled globally; zero
  audio/video/iframe/autoplay anywhere in the built site.
- **Theoretical/low-risk, not acted on:** SVG map hotspots get their accessible name
  from nested `<text>` rather than an explicit `aria-label` — low risk because every
  hotspot is duplicated as a plain HTML link right below it, so there's always a
  working fallback. Silver borders on white UI measure ~2.2-2.4:1 against the 3:1
  non-text minimum, but each also carries a text label and isn't the only visual cue.
- **Open, needs Brian's real keyboard/NVDA test:** whether Tab reaches the skip link
  first. Investigated at length; found no code-level cause (skip link is the literal
  first node in `<body>`, no `tabindex` anywhere in the built site, no
  `display:none`/`visibility:hidden` on it, no JS keydown handlers) and gave a
  high-confidence verdict that this is a known limitation of how the remote
  browser-automation tool simulates Tab, not a real site bug — but the honest answer
  needs real hardware, not more automated testing. See MORNING_REPORT.md for the exact
  test.

## Design-drift audit against V3

Checked the rendered `_site/` output against `site_blueprint.json`,
`decision_log.json`, and the design document, section by section.

- **PASS:** naming (zero "Noodleverse" anywhere), palette (exactly the five required
  hex values, no gold-family values anywhere), the front-gate page (no nav, no
  newest-adventure preview pre-entry, no autoplay), story pages (correct grouping,
  deterministic prev/next, one readable column), Meet the Residents (four groups,
  Baroness featured first, no story-appearance list), launch exclusions (no Facebook
  link, no accounts, no comments, no autoplay), and static accessibility checks
  (skip link, single h1 per page, working text-size reset, no `text-align: justify`,
  68ch story-body width).
- **Fixed, HIGH PRIORITY:** two silent Nunjucks bugs. `selectattr("galleryCategory",
  "equalto", cat.id)` isn't valid in Nunjucks (it only supports Jinja2's single-argument
  truthy form, and silently ignores the extra arguments instead of erroring) — every
  Estate Gallery category was rendering all 56 images identically. The same bug broke
  `selectattr("data.newestAdventure")` (Nunjucks doesn't support dotted attribute
  paths either), so the Homepage's Newest Adventure section — a locked item in
  `decision_log.json` — never rendered at all. Fixed with two real custom filters
  (`whereEquals`, `firstWhereTrue`) added to `eleventy.config.js`.
- **Fixed:** one image (`queso_valentine_stand_in`) had `galleryCategory:
  "holidays-and-special-events"`, matching none of the five real category ids — it
  would have silently vanished from the gallery the moment the bug above was fixed.
  Corrected to `"special-events"`.
- **Fixed:** primary nav was missing the "Home / Front Gates" entry the blueprint
  specifies as item 1 of 7 — there was no way back to the literal front gate (`/`)
  once a visitor clicked past it. Added.
- **Open, logged rather than guessed at:** no persistent "Story Search" nav entry (the
  blueprint lists one; search here is story-only and only lives on the Stories page,
  which is already a primary-nav item); `images.json` has no `title` field on any of
  56 records and 53 have an empty caption, and there's no story/series-link field —
  filling these in honestly means writing real per-image titles, not guessing from
  filenames; the Estate map doesn't have a visually distinct simplified graphic for
  small screens (same SVG scales fluidly at every width — not a functional gap, since
  the plain-link fallback list works identically regardless).

## Content-fidelity audit

Traced every in-character interface line to COPY_REVIEW.md, checked resident/location
data against the Character Bible and story manifest for invented facts, and
byte-for-byte diffed all 10 "Noodleverse"-substituted story files against their
originals with only the logged substitutions applied.

- **Clean:** the Baroness's front-gate welcome and the Estate landing intro both match
  COPY_REVIEW.md verbatim; every other interface page is narrator/informational voice,
  not a character claim. Every `confirmedNotes` entry (including the three "promoted"
  facts — Baroness's given name Grace, Tilly's title, Buttons's title) traces to the
  bible or story manifest; `needsConfirmation` arrays match the bible's own
  to-confirm lists. All 10 Noodleverse-substituted files match their originals
  byte-for-byte once only the logged substitutions are applied — no unlogged wording,
  plot, or joke drift anywhere. Zero "Noodleverse" hits anywhere in `_site/`.
- **Fixed, MEDIUM:** `PROGRESS.md` and a `tools/generate-stories.js` comment both
  claimed the Noodleverse substitution log lived "verbatim" in DECISIONS_AND_GAPS.md —
  it didn't; the real log was only ever the generator's own `SUBSTITUTIONS` table.
  Nothing was hidden or invented (the substitutions themselves were already verified
  correct), but the documentation trail didn't point where it claimed to. Added a real
  decision entry in DECISIONS_AND_GAPS.md pointing at the generator as the actual
  source of truth, and corrected PROGRESS.md's wording.
- **Fixed, LOW:** `locations.json`'s Rose Garden note said Lady Isla's Episode Two song
  is set there "per the story text" as if the Rose Garden/Secret Garden split were an
  explicit textual fact — the story actually describes one continuous garden, and the
  two-location split is this site's own editorial read of where one scene ends and the
  next begins. Reworded to say so honestly. Not invented canon (no character fact was
  asserted), just an overstated citation.

## Deploy-time bug found after all three reviews (not caught by any of them)

After pushing the Phase 4 fixes above and confirming the GitHub Actions build
succeeded, checking the actual live URL (not just the local build) found the page
loading with no CSS, JS, or working navigation at all. Every internal href/src was
root-absolute (`/assets/css/main.css`, `/stories/`, etc.), which only resolves
correctly when a site is served from the domain root — this repo is served at
`https://1eyebiney.github.io/wagglesworth/`, a GitHub Pages *project* subpath, so every
one of those requests 404'd against the wrong root. This was invisible to every check
run so far — `npm run build`, `npm run check`, the local static-file preview, and all
three reviewer subagents above — because all of them read or served the built output
from its own root, which never exposes a subpath mismatch. Only the live URL surfaced
it.

Fixed with Eleventy's `pathPrefix` plus the `url` filter applied to every internal
href/src and every `something.url` reference (Eleventy's `page.url` and any collection
item's `.url` are deliberately not pathPrefix-aware on their own). `tools/checks/
links.js` was strengthened at the same time to flag any internal link missing the
prefix as broken, closing the exact blind spot that let this ship — a future
regression like this now fails `npm run check` instead of only showing up live. Full
detail in PROGRESS.md. Re-verified against the actual live URL afterward: styled,
navigable, gallery filtering correctly, search working, story pages loading with
images.
