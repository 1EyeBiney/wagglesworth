# Asset and content inventory

Phase 1 of CLAUDE_CODE_START_HERE.txt. Everything below was verified by inspection
(checksums, word counts, text search), not assumed from the accompanying documentation
alone. The handoff prompt's stop condition — missing story text or missing V2
full-resolution artwork — does not trigger: both are present and verified below.

## 1. Story files and series

30 stories, each present as both `.md` and `.txt` in `_source/Noodles_Story_Library/stories/`.
Verified: every `.md`/`.txt` pair is byte-for-byte the same content once markdown
emphasis characters are stripped — they are format twins, not independent drafts. `.md`
is the source of truth going forward (it is what `content/stories/` will be built from).
File 15 (`15_everyday_noodleverse_story_index.md`) is an index page, not a story — it has
no `.txt` twin, which is expected and confirms it is not one of the 30.

Word counts range from 197 to 1134 words; nothing is a stub or placeholder. The
library's own `story_manifest.md` states plainly that these are "restored full-story
editions, rebuilt from the finished plots, character details, jokes, and final
corrections" rather than verbatim transcripts of the original Facebook/ChatGPT
conversations — recorded here as provenance, not a defect.

### Numbering trap (real, worth stating once so nobody re-derives it under pressure)

Filenames 01–14 match the official story-list numbers 1–14 exactly (the six-episode
series, then eight standalone/everyday stories). Filename 15 is the index and is
skipped by the official list. Filenames 16–31 correspond to official list numbers
15–30 — i.e., for those sixteen stories, **file number = list number + 1**. The site's
`content/stories/` front matter will carry an explicit `episodeNumber`/`order` field
so display order never depends on anyone remembering this offset.

### Royal Summer / Silver Rose series (episodes 1–6)

| # | File | Title |
|---|------|-------|
| 1 | 01_episode_one_summer_at_wagglesworth.md | A Royal Summer at Wagglesworth Estate |
| 2 | 02_episode_two_garden_mystery.md | The Place Where Flowers Do Not Grow |
| 3 | 03_episode_three_home_leave.md | Home Leave and Palace Mischief |
| 4 | 04_episode_four_mysterious_key.md | The Mysterious Key |
| 5 | 05_episode_five_hidden_ballroom.md | The Secret of the Silver Rose |
| 6 | 06_enchanted_silver_rose_ball.md | The Enchanted Silver Rose Ball |

### Standalone and everyday adventures (7–14)

07_baroness_origin_story, 08_hardware_store, 09_jaws_movie_night,
10_astrid_roller_skates, 11_badminton_margaritas, 12_ladies_home_three_days,
13_great_pantry_raid_2025, 14_case_of_the_vanishing_invitation.

### Early Noodleverse classics (list 15–30, files 16–31)

16_baroness_valentine_queso, 17_snow_day_uno_suspicion, 18_making_buckeyes,
19_keadys_royal_interview, 20_we_are_expanding_couch, 21_purdue_goodbye_for_keady,
22_keadys_big_purdue_adventure, 23_campfire_exile, 24_petunias_secret_campfire_visit,
25_great_peanut_butter_incident, 26_noodles_mask_tastrophe,
27_operation_retrieve_credit_card, 28_operation_pawgarita_patrol, 29_go_be_free,
30_baroness_vs_spring, 31_princess_noodles_florida_adventure.

## 2. Original photographs and generated illustrations

**53 of 53 images verified.** Every file listed in `asset_manifest.json` exists on
disk; every file's actual sha256 matches the checksum recorded in the manifest; no
duplicate images exist within the archive (53 distinct hashes for 53 files); and no
image exists on disk that the manifest doesn't already describe. This is a clean,
already-curated set — there was no dedupe work left to do.

All but one file is PNG at 1536×1024 (Reference_Photos/Core_Cast is a JPEG, a genuine
photograph rather than generated art — see provenance note below). Total size ~150MB.

### By category (folder, count)

Characters/Main_Cast (6) · Early_Stories (6) · Events_and_Memes (6) ·
Ladies_in_Waiting (9) · Reference_Photos (2) · Royal_Summer_Series (19, across four
sub-folders) · Wagglesworth_Estate (5).

### Provenance

The manifest already tags provenance per image (`status`, `notes`). Two images are
photographic references rather than generated illustrations:
`Reference_Photos/Noodles_Floral_Dress_Unboxing_Reference.png` and
`Reference_Photos/Core_Cast/Noodles_Buttons_Petunia_Core_Cast_Reference.jpeg` — the
design doc explicitly permits reference photos beside finished art in educational
contexts, so these are candidates for the Gallery's Behind-the-Scenes category, not
for story illustration.

## 3. Characters and approved names

V3's `characters.json` lists 19 records with an explicit confirmation state per
character (`confirmed`, `placement_to_confirm`, or `asset_missing`). Cross-checked
against the story text and the V2 manifest's own character tags; see
DECISIONS_AND_GAPS.md for the two real gaps this turned up (Moira and Lexie have
artwork and are named in the story library but have no character-bible record; Echo,
Straxx, and Lady are one-story characters with neither art nor a bible record).

## 4. Estate locations

`site_blueprint.json` names nine map locations: Grand Drawing Room, Rose Garden,
Secret Garden, Hidden Ballroom, Grand Ballroom, Pool/Cabana, Main Gates, Baroness's
Rooms, High Tea Room. No location-specific data file exists yet beyond this list — the
Phase 2 content model will need to build `data/locations.json` from this plus whatever
each location's associated stories and art actually establish about it.

## 5. Gallery and seasonal assets

No seasonal-entrance art exists in either archive; the site launches with the standard
entrance only, and `data/seasonal.json` starts empty (schema-ready, no records), which
matches the design doc's "future expansion" framing rather than a gap. Gallery category
candidates are drawn from the same 53 images per the categories above.

## 6. Missing, duplicated, unidentified, or unapproved material

**No duplicates** (see section 2). **Nothing unidentified** — every image on disk is in
the manifest and every manifest entry has a resolved file.

**Confirmed missing** (already known from V3's own gap register, verified true — none
of these three exist anywhere in either archive):

- Hardware-store artwork (story 08 has full text; no illustration exists for it in V2).
- Episode Six "eavesdropping" art (the ball episode's own folder, `04_Silver_Rose_Ball`,
  has seven images, none matching this description).
- The "newest Silver Rose ball" pieces described in the register (royal-ball twirl,
  Tiny Petunia at the ball, tea-party/palace scenes) — not present.

**Unlocated legacy assets**, per V2's own `MISSING_ASSETS.txt`, confirmed still absent:
Baroness & Queso artwork; UNO Day/Suspicion artwork; Silly Chair artwork;
Keady-specific early-story artwork.

**Genuinely new findings from this inventory pass**, not previously documented:

- `Lady_Noodles_Locket_Mystery.png` (Royal_Summer_Series/01) depicts a "locket
  mystery," but the word "locket" appears in none of the 30 story files, in either
  spelling. The other three images in that same folder (secret garden, purple rose,
  tea-party investigation) do fit the garden-mystery content of Episodes One and Two.
  The locket subplot itself has no textual home in the current library.
- Two of the ten named Ladies-in-Waiting — Lady Moira and Lady Lexie — have a paired
  portrait in V2 (`Lady_Moira_and_Lady_Lexie_Royal_Companions.png`) and are named
  explicitly in `story_manifest.md`'s character notes, but have no entry at all in
  V3's `characters.json`.
- `story_manifest.md`'s character notes give three biographical facts none of the JSON
  files carry: Baroness Wagglesworth's given name is Grace; Countess Tilly Toodlefluff
  is "Chief of Paw-Operations"; Buttons the Bear is "Head of Royal Security."
- Three characters — Echo, Straxx, and "Lady" (met in Florida) — are named once each
  in single stories (24 and 30) with no artwork and no character-bible entry.

Full reasoning and confidence levels for every judgment call above are in
DECISIONS_AND_GAPS.md, which is the file that governs what Phase 3 is allowed to build
without further confirmation.
