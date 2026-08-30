# Issues and open questions

Things noticed during the build that Brian or Barb should weigh in on. Claude Code adds
to this file as issues arise and moves resolved items to a Done section with a note.

## Open

1. **Images have no `title` field, and most have no `caption`.** The design document
   (§8) calls for a title and a story/series link on every gallery image record; none of
   the 56 `site/_data/images.json` records has a title, 53 of 56 have an empty caption,
   and there is no story/series-link field at all. Filling these in honestly means
   writing 56 real, specific titles — not something to guess or auto-generate from
   filenames — so it's logged here for Barb to do (or dictate to her desktop assistant
   one image at a time) rather than invented. Not a launch blocker: every image already
   has real alt text, which is the accessibility requirement; title/caption are a
   presentation nicety on top of that.
2. **No persistent "Story Search" nav entry.** `site_blueprint.json` lists it as a
   utility-nav item; the site's search only exists as a form embedded in the Stories
   page itself (by design — it's a story-only search, so it's not clear a
   site-wide-reachable entry adds much beyond linking to a page already in the primary
   nav as "Stories"). Left as-is rather than guessed at; flagging so Barb/Brian can say
   whether a dedicated nav entry is wanted.
3. **The Estate map doesn't have a distinct simplified graphic for small screens** —
   `site_blueprint.json` describes "simplified map plus named cards" on mobile; the
   built site instead fluidly scales the same SVG at every width. Not a functional gap
   (the plain-HTML hotspot link list beneath the map works identically at every screen
   size and never depends on the map rendering), but it's a visual simplification the
   blueprint calls for that wasn't built. Logged as a future-enhancement candidate, not
   a launch blocker.
4. **Tab order to the skip link needs a real-keyboard confirmation.** Investigated at
   length in the browser-automation pane and could not get simulated Tab to reach the
   skip link first; a dedicated accessibility-auditor review of the actual source found
   no code-level cause (no `tabindex`, no `display:none`/`visibility:hidden` on the
   skip link, no JS keydown handlers, the skip link is the literal first node in
   `<body>` on every page) and gave a high-confidence verdict that this is a known
   limitation of how the remote browser tool simulates Tab, not a real site bug — but
   the honest answer requires Brian's own hardware keyboard and NVDA, not more
   automated testing. See MORNING_REPORT.md for the exact test to run.

## Done

- Nunjucks' `selectattr` filter here doesn't support Jinja2's `("attr", "equalto",
  value)` form (it silently ignores the extra arguments and tests only truthiness) —
  this made every Estate Gallery category render all 56 images identically, and made
  the Homepage's "Newest Adventure" section never appear at all, because
  `"data.newestAdventure"` isn't a real dotted-path lookup either. Found by the
  design-drift review, not by any validator. Fixed by adding real `whereEquals` and
  `firstWhereTrue` filters in `eleventy.config.js` and using them in
  `site/gallery/index.njk` and `site/estate.njk`.
- One image (`queso_valentine_stand_in`) had `galleryCategory: "holidays-and-special-
  events"`, which matches none of the five real category ids — it would have silently
  vanished from the gallery the moment the bug above was fixed. Corrected to
  `"special-events"`.
- `/estate/` skipped a heading level (h1 straight to five h3 card titles, since the only
  h2 on the page is conditional on a story having `newestAdventure: true`, which none
  currently do) — an NVDA user navigating by heading would read this as a missing
  section. Fixed by making the five card titles h2.
- Focus outline on the purple header/footer bars measured 1.58:1 contrast against the
  bar (needs 3:1, SC 1.4.11) — nearly invisible when tabbing through primary/utility
  nav. Fixed with a cream-colored focus ring scoped to `.site-header`/`.site-footer`
  (9.30:1 against royal purple).
- The primary nav was missing a way back to the literal front gate (`/`) once a visitor
  clicks "Enter Wagglesworth Estate" — `site_blueprint.json` specifies 7 primary-nav
  items starting with "Home / Front Gates"; the site had built only the other 6. Added
  the missing entry.
- `PROGRESS.md` and a comment in `tools/generate-stories.js` both claimed the
  "Noodleverse" substitution log lived "verbatim" in `DECISIONS_AND_GAPS.md` — it
  didn't; the real log is only the generator's own `SUBSTITUTIONS` table. Content-
  fidelity review confirmed the substitutions themselves are all correct and complete,
  just undocumented in the place the file claimed. Added a real decision entry in
  DECISIONS_AND_GAPS.md pointing at the generator as source of truth, and corrected
  PROGRESS.md's wording.
- `locations.json`'s Rose Garden note said Lady Isla's Episode Two song is set there
  "per the story text" as if the two-garden split (Rose Garden vs. Secret Garden) were
  an explicit textual fact — the story actually describes one continuous garden.
  Reworded to be honest that the split is this site's own editorial read, not something
  the story text states.
