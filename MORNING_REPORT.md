# Morning report — Wagglesworth Estate

Session 1, August 29-30, 2026. The full Phases 1-5 build ran to completion, deployed,
and was verified against the actual live URL (not just a local build).

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
- **[GENERATED_ART.md](GENERATED_ART.md)** — four pieces of original stand-in
  illustration (the Silver Rose crest, plus three story-page scenes for gaps where no
  real artwork exists: the hardware store, a Valentine's still life, a snow-day/UNO
  scene). None depict a character's face or body — deliberately, since two of the
  characters those stories center on don't have a confirmed appearance yet. Each is
  swap-ready the moment a real original surfaces — see the file for the two-step swap
  process.
- **[DECISIONS_AND_GAPS.md](DECISIONS_AND_GAPS.md)** — the full record of every
  judgment call made without her, and everything genuinely unresolved. The ones that
  most need her word, not a developer's:
  - **"Buttons" is drawn as two different character designs** in the source images (a
    tabby cat in one, a cream teddy bear everywhere else) — the teddy-bear design was
    treated as canonical for launch since it's the overwhelming majority, but only she
    can say which one is actually right.
  - **The "Noodles Hobson" / "Noodles" naming collision** — the Baroness's own base
    identity is named Noodles (her origin story), and a separate lady-in-waiting is
    also named "Noodles Hobson" in the source material. She's displayed as "Lady
    Hobson" for launch to avoid confusing readers, with her full name noted in her own
    profile. Barb may want a different display name entirely.
  - **A locket-mystery image with no matching story text** — held out of the Stories
    section rather than forced into a passage that doesn't mention it; recommended
    placement is the general gallery with a note, but it's her call.
  - **Three P0 artworks and four legacy images remain genuinely absent** (the
    hardware-store scene, Episode Six's "eavesdropping" material, the newest Silver
    Rose ball material, plus four smaller unlocated pieces) — each has a
    swap-ready stand-in per GENERATED_ART.md, and a designated drop-zone folder if the
    real originals are ever found.
  - A handful of smaller flagged items (a caption that names different characters than
    its own image tag, a possibly-duplicate image pair, guessed `sourceType` values on
    several older images, two Ladies-in-Waiting with no character-bible record) are
    all listed in full in the file, none blocking launch.

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
