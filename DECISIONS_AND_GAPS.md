# Decisions and gaps

The permanent record of every V2/V3 conflict and every real content gap, per CLAUDE.md.
Read this before assuming something is missing that was already resolved. Entries are
either a **Decision** (made, and binding on Phase 3 onward) or a **Flagged** item
(genuinely unresolved, needs Barb or Brian, must not be guessed around).

## Document authority actually used

No conflicts were found between `site_blueprint.json`, `decision_log.json`, and
`Conceptual_Website_Design_Document_Draft_1.md` — the three agree on every point they
both cover, and the design document simply carries more implementation detail (schemas,
a recommended story record shape, exact contrast/touch-target numbers) than the JSON
summaries do. Both were treated as authoritative; the design document filled gaps, it
did not override anything.

**Decision:** `Wagglesworth_Estate_Design_Document_Draft_1.docx` was not opened. V3's
own README describes the `.md` files as "editable source documents" and the `.docx` as
a "polished combined handoff" derived from them — i.e., an export, not an independent
source. If a future pass finds the `.docx` actually diverges from the `.md` files, that
is a real gap to log here, not something this pass silently assumed away.

`website_asset_inventory.csv` is a plain CSV export of the same 53 records in
`asset_manifest.json` — checked row-for-row equivalent, not a second source.

## Decision: "no gold" governs design, not story prose

The rule is a design-system rule — palette, generated art, UI chrome — not a content
filter. Several stories legitimately mention gold-colored props as plot details: a
gold-edged invitation and gold dust (story 14), a golden key that is a recurring plot
object across Episodes Three, Four, and Five, golden light from a chandelier (Episode
Five), and Baroness Wagglesworth's own "gold-plated marshmallow holder" running joke
(story 23). None of this is touched, censored, or reworded. The prohibited-terms
validator checks CSS custom properties, SVG fill/stroke values, and design tokens for
gold-family hex values — it must never scan story body text for the word "gold," or it
will flag content that was never in violation.

## Decision: "Noodleverse" substitutions — the log lives in the generator, not here

The non-negotiable rename replaced 20 occurrences of "Noodleverse" across 10 of the 30
story files (place-name uses became "Wagglesworth Estate," collective-household uses
became "the household"). The authoritative, complete record of every substitution is the
`SUBSTITUTIONS` and `TITLE_SUBSTITUTIONS` tables in `tools/generate-stories.js` — not a
copy here, because the generator is the single source of truth for generated story
content (per CLAUDE.md's rule that hand-patches to generated output must go into the
generator instead), and a second, hand-maintained copy in this file would drift out of
sync with it the first time either one changed. A content-fidelity review confirmed all
10 files match their originals byte-for-byte once only the logged substitutions are
applied — no other wording changed. (A stray line in `PROGRESS.md` previously claimed
this log lived here "verbatim"; that line has been corrected to point here instead.)

## Decision: generated stand-in art, per Brian's explicit instruction

CLAUDE_CODE_START_HERE.txt's default (Phase 3) calls for labeled placeholder frames
where an original is absent. Brian overrode this before the run started: absent
originals get an authored original SVG illustration instead, in the approved palette,
never imitating the painterly PNG style, never inventing scene details the story text
does not itself describe. Every one is logged in GENERATED_ART.md, marked
`"provenance": "generated-stand-in"` in `data/images.json`, and swappable the moment a
real original surfaces. This applies to: the Silver Rose crest itself (which should be
vector regardless of any gap), the three P0 absences, and the four unlocated legacy
images below, wherever a page genuinely needs an image to exist to be complete.

## Flagged: three P0 artworks confirmed absent (from the V3 register, re-verified)

- Hardware-store illustration for story 08. Not present in either archive.
  **RESOLVED Aug 30 2026:** Barb supplied the real original
  ("Noodles' Hardware Store Adventure," now `hardware_store_adventure`) in the first
  review round (fixes1); the generated stand-in was swapped out per GENERATED_ART.md.
- Episode Six "eavesdropping" art (Plush Puppies Eavesdrop at Her Grace's Door /
  Poodle Secrets Behind the Royal Door). **Still not present.**
- Newest Silver Rose ball material (royal-ball twirl, Tiny Petunia at the ball,
  additional tea-party/palace scenes). **Still not present.**

The two still-open items never had stand-ins (Episode Six already has seven real
illustrations — see GENERATED_ART.md's "Not generated, and why"); their drop-zone
folders remain designated for real artwork if it surfaces.

## Flagged: four unlocated legacy images (from V2's own MISSING_ASSETS.txt, re-verified absent)

Baroness & Queso; UNO Day/Suspicion (story 17 has full text, no art); Silly Chair; early
Keady-specific artwork. Originally: generated stand-in, logged, swap-ready.

**Update Aug 30 2026 (fixes1):** Barb supplied real original artwork covering the
first two — a Queso Valentine scene (`queso_valentine`) and a snow-day scene
(`snow_noodles`) — and both stand-ins were swapped out per GENERATED_ART.md. Silly
Chair and the early Keady artwork remain unlocated (neither ever had a stand-in).

## Flagged: a locket subplot with no textual home

`Lady_Noodles_Locket_Mystery.png` depicts a "locket mystery" per its own manifest tag,
but the word "locket" does not appear anywhere in the 30 restored stories. The other
three images in the same V2 folder (`01_Secret_Garden_and_Locket`) do fit the garden
mystery in Episodes One and Two by content (searched and confirmed: both episodes
contain real garden/rose/circle/bell/music-box text matching the folder's other three
images). **Decision:** those three go in the Episode One/Two end gallery as
series-level art, not forced into a specific passage. The locket image is held out of
the Stories section entirely for this launch — it may belong to material the
restoration did not carry forward, and inventing a passage for it would be exactly the
guessing CLAUDE.md forbids. It can go in the general gallery under
Behind-the-Scenes/Reference with a caption noting the unconfirmed subplot, or wait for
Barb's word. Recommend the gallery placement; final call is hers.

## Flagged: Royal Summer Series art folder 3 spans three episodes, not one

`03_Secret_Portrait_and_Hidden_Ballroom`'s "Lady Rosalind" and "hidden ballroom" material
cannot be pinned to a single episode: text search confirms Rosalind and the hidden
ballroom are both mentioned across Episodes Four, Five, *and* Six — this is a
throughline, not a one-episode scene. **Decision:** these five images are placed in the
Royal Summer Series' shared end gallery (reachable from all three episode pages) rather
than hard-anchored inside one episode's passage text, which is the honest reading of
what the source material actually supports.

## Flagged: Moira and Lexie have no character-bible record

Two of the ten Ladies-in-Waiting named explicitly in `story_manifest.md`'s character
notes — Lady Moira Ann and Lady Lexie Marie — have a paired portrait in V2
(`Lady_Moira_and_Lady_Lexie_Royal_Companions.png`, confirmed in the manifest) but no
entry in `characters.json` at all, unlike the other eight Ladies. **Decision:** give
both a minimal `placement_to_confirm` record identical in shape to the existing Hobson
and Dame Muriel entries (group: Ladies-in-Waiting; confirmed: individual/paired artwork
exists; everything else to-confirm) — this mirrors a pattern V3 already uses for
exactly this situation rather than inventing a new one, and adds no fact the source
material doesn't support.

## Flagged: naming collision — "Noodles Hobson" vs. "Noodles" as the Baroness's own name

Story 07 ("How Noodles Became Baroness Wagglesworth") establishes that the Baroness's
own base identity is named Noodles — the name the whole story world is built around.
`story_manifest.md`'s ten-Ladies-in-Waiting list separately names one lady-in-waiting
"Noodles Hobson," and one V2 image is captioned "Lady Noodles Hobson." These are
evidently two different individuals in the source material, but displaying a
lady-in-waiting as "Noodles Hobson" on a public page a few clicks from the Baroness's
own "Noodles" origin story risks real reader confusion. Interim choice for launch was
to display her as "Lady Hobson" (dropping the shared first name), with "also known as
Noodles Hobson" noted in the profile body.

**RESOLVED Aug 30 2026:** Barb's first review round (fixes1, item 4) confirmed the
name and picture as displayed — "Lady Hobson" with `lady_noodles_hobson_royal_courtyard_ride`
as her portrait. Her record's `needsConfirmation` items are cleared and her status is
`confirmed`. (Note: in the same round, item 5 removed the whole Ladies-in-Waiting
group from the public site — see the Decision below — so her confirmed record is
currently unlisted, ready if the group ever returns.)

## Decision: three facts elevated from "needs confirmation" to confirmed

`story_manifest.md`'s "Character notes used in this edition" section is source material
Barb's own restoration process produced, not a guess — so these move from the
character bible's "to confirm" list to confirmed, sourced explicitly to that file:
Baroness Wagglesworth's given name is Grace; Countess Tilly Toodlefluff holds the title
"Chief of Paw-Operations"; Buttons the Bear holds the title "Head of Royal Security."

## Flagged: "Tiny Petunia" — nickname or separate depiction?

The character bible already marks this unresolved and this pass found nothing to
resolve it: Petunia appears as a normal-sized resident in some material and as "Tiny
Petunia" (explicitly "a very small doll") in the Silver Rose Ball material and story 24.
**Decision for launch, reversible:** treated as one character (`petunia`) with a noted
variant, not two separate profiles — the safer error, since merging two truly distinct
characters is much easier to undo later than having publicly launched two profiles for
what turns out to be one doll.

## Flagged: three uncharacterized one-story names

Echo and Straxx (story 24, "The Great Peanut Butter Incident") and "Lady" (story 30,
met in Florida) are named once each, with no artwork and none of the fields the
character bible requires for a profile (appearance, personality, relationships, etc).
**Decision:** no dedicated resident profile for any of the three at launch — they
appear only within their own story's text, exactly as written, with nothing added.
Revisit if Barb wants profiles built once she supplies the missing facts.

## Flagged: "Buttons" is drawn as two different character designs

Writing alt text required actually looking at all 53 images (the seed script alone
could not produce honest alt text — see the images.json alt-text pass in PROGRESS.md).
That closer look found a real character-continuity break the manifest's text fields
don't surface: in `royal_court_of_baroness_wagglesworth.png`, the figure named "Buttons"
on screen is a tabby cat, while every other image showing Buttons (the ballroom
portraits, the morning-chat scene, the Mysterious Key and Silver Rose Ball sequences)
draws him as a cream teddy bear in a tartan kilt. The character bible's own continuity
rule (preserve species/type/face/fur across approved references) means one of these is
wrong, or the Royal Court image was an earlier, superseded design. **Not resolved
here** — flagged for Barb, who is the only one who can say which design is Buttons.
Interim choice: the teddy-bear design is treated as canonical (it appears in five of
six Main_Cast images and matches his `Head of Royal Security`/kilt description
elsewhere), and `royal_court_of_baroness_wagglesworth` is placed in the general
Wagglesworth_Estate gallery rather than on Buttons's own profile page.

## Flagged: an image caption names different characters than its own metadata tag

`buttons_and_lady_esme_gossip_tea.png` is tagged in the manifest as depicting Buttons
and Lady Esme, but the caption text legible within the image itself names the three
gossiping figures as Special Sparkle, Hobson, and Dame Muriel — gossiping *about*
Buttons, who is not shown. The alt text was written from what is actually visible in
the image, not the manifest's tag, which is the honest choice, but the manifest tag
itself is likely wrong and worth Barb's correction.

## Flagged: a possible near-duplicate pair

`enchanted_ballroom_before_silver_rose_doors.png` and `ladies_in_royal_ball_gowns.png`
both depict the same silver-doors "reveal" beat with the same characters and the same
sound-effect text. They are not byte-duplicates (different checksums, so the earlier
dedupe pass correctly did not merge them), but they may be two renders/crops of the
same generated moment rather than two distinct scenes. Both are kept — removing either
without Barb's say-so risks discarding a real, distinct image — but flagged so she can
decide if one is redundant.

## Flagged: sourceType may be wrong for several "recovered/early" images

The automated seed script guessed `sourceType` from file extension alone (JPEG = photo,
everything else = illustration). Actually looking at the images during the alt-text
pass found this is too blunt: `Making_Buckeyes_with_Cuddly_Helpers.png` is visibly a
real photograph (real hands, a real kitchen) despite being a PNG, and several
`Wagglesworth_Estate/` and `Early_Stories/` images use a photorealistic "costumed pet
photography" style distinct from the painterly illustration style used throughout
`Royal_Summer_Series/`. **Not corrected here** — a `sourceType` value is a provenance
claim (design doc §8 requires it per published image) and should not be reset without
Barb confirming which of these are real photographs of the actual plush toys versus
AI-generated images; guessing wrongly in either direction would misstate provenance,
which the design document treats as seriously as the no-invented-canon rule.

## Decision: generated stand-ins are scenes and motifs, never new character designs

Writing the actual stand-in art required one more line to be drawn precisely, beyond
what was decided before the run started: the character bible requires appearance
(species, fur color, face, proportions, outfit) to come only from approved reference
images, and explicitly marks Queso's appearance as unestablished (`asset_missing`) and
Keady's as `to confirm`. Drawing either of them — even in simple vector form — would be
inventing a visual design for a character the source material never fixed one for,
which is exactly the class of gap-filling CLAUDE.md forbids. So the three generated
pieces below depict scene and object motifs only (a gate and tools, a Valentine's still
life, a snow-day/card-game motif) and never a character's face or body. Queso's and
Keady's resident profiles stay text-only rather than getting an invented portrait —
that is the honest representation of "appearance not yet confirmed," not a gap to be
papered over with art.

## Decision: Ladies-in-Waiting removed from the public site (Barb, fixes1 item 5)

Barb's first review round asked to "remove all the ladies in waiting" from Meet the
Residents. Her list also separately confirmed Lady Hobson's profile (item 4), which
conflicted — Hobson is one of the ten. Brian resolved it: **remove all ten, Hobson
included**, with her item-4 approval recorded on her record so it isn't lost.

Implementation, chosen for reversibility: the ten records stay in
`site/_data/residents.json` in full (deleting them would break story-character
cross-references and discard real data) with `"unlisted": true` on each;
`site/_data/publicResidents.js` filters them out, and every public surface (the
residents directory, profile-page generation, the sitemap, map-location resident
lists) reads that filtered list. Their gallery images remain in the Estate Gallery —
Barb asked only about Meet the Residents — and the stories are untouched, so the
Ladies still appear in every story exactly as written. Reversal is deleting the ten
`unlisted` flags.

## Decision: Grand Drawing Room removed from Explore the Estate (Barb, fixes1 item 2)

Removed from `site/_data/locations.json` (it was an empty, schema-ready location with
no artwork and no associated residents — nothing else referenced it) and from the
map SVG's text description. Stories mentioning the Grand Drawing Room are untouched.
Re-adding it later is one new record via `content/templates/location-template.json`.

## Flagged: the Queso Valentine original may establish Queso's appearance

The real Valentine artwork Barb supplied (`queso_valentine`, fixes1) shows the
Baroness at the Valentine's table with a small doll in a red-and-black lace dress and
a cream teddy bear in a heart-print vest and red bow tie. The character bible marks
Queso's appearance as unestablished (`asset_missing`), so this image's record
describes both companions without naming them. If Barb confirms the bear (or doll) is
Queso, that would establish an appearance reference for the bible and Queso's profile
could gain a portrait — her call, not one to guess. (The doll closely matches the new
solo Petunia portraits, but the same rule applies: described, not asserted.)

## Not a gap: seasonal entrances and most map-location art

No seasonal-entrance package exists in either archive, and no location has dedicated
art beyond what a story or gallery image happens to depict. Both are schema-ready
(`data/seasonal.json` ships empty; `data/locations.json` is built from
`site_blueprint.json`'s location list, illustrated only where a real image already
depicts that place) — this is the "future expansion" the design document describes
happening by data record, not a launch blocker.
