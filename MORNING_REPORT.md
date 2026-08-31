# Morning report — Wagglesworth Estate

Sessions 1-2, August 29-30, 2026. The full Phases 1-5 build ran to completion,
deployed, and was verified against the actual live URL (not just a local build).
**Session 2 then applied Barb's entire first review round** (the seven fixes and five
images from `fixes1/`): her real original artwork replaced all three generated
stand-ins, her portrait now greets visitors at the front gate, Petunia has her new
solo portraits, the Grand Drawing Room is off the map, Lady Hobson's name and picture
are confirmed, and the Ladies-in-Waiting are removed from Meet the Residents
(reversibly — see DECISIONS_AND_GAPS.md). Details in ISSUES.md's Done section.

## The live site

**https://1eyebiney.github.io/wagglesworth/**

It's live and reachable by anyone with the link, but not yet indexed by search engines
— every page carries a `noindex` meta tag and `robots.txt` disallows the whole site.
That's one deliberate switch, waiting on Barb (see "Going live to search engines"
below), not something left unfinished.

Every push to the `main` branch on GitHub rebuilds and redeploys the site automatically
within a couple of minutes (GitHub Actions runs `npm run build` and `npm run check`,
and only deploys if both pass clean). Nothing about this needs anyone's laptop to be on.

## What to test, Brian

Nothing here should be judged by how it looks — everything below is a keyboard/NVDA
question.

1. **Tab through the whole header on any page**, starting from the address bar. The
   very first Tab press should land on a "Skip to main content" link (it's invisible
   until focused, so you're listening for NVDA to announce it, not looking for it).
   This is the one thing I could not fully verify myself: I tested it as far as
   automated browser tools allow and found no code-level reason it would fail (the
   skip link is the first thing in the page, nothing hides it from the tab order in
   the accessibility tree, there's no script touching Tab or focus), but a
   remote-browser-automation tool has known limitations simulating Tab on
   off-screen-positioned links exactly like this one — the kind every production
   skip-link uses (GOV.UK's included). If it doesn't work for you with a real keyboard,
   that's a real bug to report back; if it does, that confirms the automated finding.
2. **Read the Homepage (`/estate/`) by heading (NVDA's H key).** You should land on
   "Welcome to the Estate," then "Newest Adventure," then five section headings
   (Stories, Meet the Residents, Explore the Estate, Estate Gallery, Creating Your Own
   Noodles Adventure with AI) — all at the same heading level, no level skipped.
   Then do the same on **Meet the Residents**: with the Ladies-in-Waiting removed,
   the page should read as three clean group headings (Main Household, Friends &
   Family, Special / Guest Characters) with no empty section and no orphaned links.
   Also confirm the front gate now announces the Baroness's portrait image before
   the site name — real alt text, not a filename.
3. **Open a story page and use the text-size control** (A−, Reset, A+ in the header).
   Confirm NVDA announces the new percentage each time you press one, and that
   reloading the page keeps your last chosen size.
4. **On the Stories page, type a search term** (try "peanut" or "queso") into the
   search box and confirm NVDA announces how many stories matched, and that the story
   list itself updates — not just a separate results panel.
5. **On the Explore the Estate map**, tab through the illustrated hotspots and confirm
   each announces a real place name, then confirm the plain link list below the map
   reaches every same location — it's meant to be a complete, always-working fallback,
   never required, just present.
6. **Zoom your browser to 200-400%** on a story page and a gallery page and confirm
   nothing overlaps or requires horizontal scrolling.

## What Barb needs to review

Three files hold everything that needs her judgment, not a developer's:

- **[COPY_REVIEW.md](COPY_REVIEW.md)** — two short lines written in the Baroness's
  voice (the front-gate welcome and the Estate landing intro), both still marked
  draft. Each has two alternative versions if she wants a different flavor. Nothing
  in either line states a new fact about her — approve, edit, or replace at will.
- **[GENERATED_ART.md](GENERATED_ART.md)** — good news here: all three stand-in
  scenes are gone, replaced by the real artwork Barb sent in the fixes1 folder. The
  only generated piece left in use is the Silver Rose crest (vector by design, never
  a stand-in). Worth a quick look from her to confirm the three real images landed on
  the right stories.
- **[DECISIONS_AND_GAPS.md](DECISIONS_AND_GAPS.md)** — the full record of every
  judgment call made without her, and everything genuinely unresolved. The ones that
  most need her word, not a developer's:
  - **"Buttons" is drawn as two different character designs** in the source images (a
    tabby cat in one, a cream teddy bear everywhere else) — the teddy-bear design was
    treated as canonical for launch since it's the overwhelming majority, but only she
    can say which one is actually right.
  - **Does the Queso Valentine artwork establish Queso's appearance?** The real
    Valentine image she sent shows a cream teddy bear (and a small doll) beside the
    Baroness. If that bear is Queso, say so and his profile can finally get a
    portrait — until she confirms, the image's description deliberately doesn't name
    them, since Queso's appearance was never established in the source material.
  - **A locket-mystery image with no matching story text** — held out of the Stories
    section rather than forced into a passage that doesn't mention it; recommended
    placement is the general gallery with a note, but it's her call.
  - **Still genuinely absent** (smaller now, after her fixes1 artwork filled three
    gaps): Episode Six's "eavesdropping" material, the newest Silver Rose ball
    material, the "Silly Chair" image, and the early Keady artwork. None ever had
    stand-ins; drop-zone folders stay ready if any surface.
  - ~~The "Noodles Hobson" naming collision~~ — **resolved**: Barb confirmed "Lady
    Hobson" and her picture in fixes1 (her record is currently unlisted with the
    rest of the Ladies-in-Waiting, but the confirmation is saved).
  - A handful of smaller flagged items (a caption that names different characters than
    its own image tag, a possibly-duplicate image pair, guessed `sourceType` values on
    several older images) are all listed in full in the file, none blocking launch.

## Launch blockers vs. everything else

**Nothing is blocking launch.** Every story has real text, every published image has
real alt text, and the build and every validator pass clean. The items above are
open questions for Barb's judgment, not missing work — CLAUDE.md is explicit that a gap
gets flagged, never guessed around, and that's what happened in every case.

The one thing worth flagging as a "should fix soon, not urgent" rather than a pure
content question: **[REVIEW_NOTES.md](REVIEW_NOTES.md)** documents a real deploy-time
bug found and fixed today — the first deploy shipped with every internal link pointing
at the wrong URL root, so the live site loaded with no styling or working navigation
until it was caught by checking the actual live URL (not just the local build) and
fixed. It's fixed and verified now, but it's the kind of thing worth remembering: from
here on, "the build passed" and "the live site works" are two different questions, and
only the second one is the real test.

## For future maintenance

**[MAINTENANCE.md](MAINTENANCE.md)** is written for Barb, working from her own
computer with Claude Desktop or GPT Desktop — no installs, no commands, just editing
files on GitHub's website and letting the automatic build do the rest. Every content
type (a story, a resident, a location, a gallery image, a seasonal entrance) has a
fill-in-the-blank template in `content/templates/` with the important rules (no
invented facts, no gold, never "Noodleverse") restated inline, since that desktop
assistant won't have read this project the way Claude Code has.
