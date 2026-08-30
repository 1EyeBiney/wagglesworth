# Generated art

Every piece of stand-in art used in place of an absent original, per CLAUDE.md and the
override Brian gave before this run started (see DECISIONS_AND_GAPS.md). All of it is
authored original SVG in the approved palette, never an attempt to imitate the
painterly PNG style, and marked `"provenance": "generated-stand-in"` in
`site/_data/images.json`. Swapping any of these out is a two-step process: drop the
real file into `assets/originals/`, point the relevant `heroImage`/`portraitImage`
field at its new image id, and delete the entry below and the SVG it replaces.

None of these depict a character's face, body, or design — see DECISIONS_AND_GAPS.md,
"generated stand-ins are scenes and motifs, never new character designs." Drawing a
character whose appearance the character bible marks unconfirmed would be inventing
canon, not filling a gap honestly.

## The Silver Rose crest

**File:** `site/_includes/partials/silver-rose.njk` (inline SVG, reused as the
site-wide divider motif) and `site/favicon.svg` (a solid single-color simplified
variant, per the design document's favicon requirement).
**Used:** in the footer of every page, and the browser tab icon.
**Why generated:** the crest needed to exist in a permanent, scalable, exact-palette
form regardless of what original artwork was or wasn't available — this is the one
piece of "generated" art that isn't standing in for anything missing; it's simply
vector by design.

## Hardware store stand-in

**File:** `assets/originals/Generated_Stand_Ins/hardware_store_stand_in.svg`
**Used on:** the "Noodles at the Hardware Store" story page (`heroImage`).
**Illustrates:** the enormous gate and the shelf of tools/concrete bags the story text
itself describes — no characters, since the story doesn't fix a specific visual scene
beyond these objects.
**Replaces the gap:** the P0 hardware-store artwork listed as absent in
`DECISIONS_AND_GAPS.md` and the V3 high-priority asset register.

## Queso Valentine stand-in

**File:** `assets/originals/Generated_Stand_Ins/queso_valentine_stand_in.svg`
**Used on:** "Baroness Wagglesworth's Queso Valentine" story page (`heroImage`).
**Illustrates:** a Valentine's still life — a bowl of queso, chips, and hearts — drawn
directly from the story's own described props. No character (Queso's own appearance is
`asset_missing` in the character bible and is not invented here).
**Replaces the gap:** the unlocated "Baroness & Queso" legacy artwork.

## Snow day / UNO stand-in

**File:** `assets/originals/Generated_Stand_Ins/uno_snow_day_stand_in.svg`
**Used on:** "Snow Day Suspicion and the Great UNO Standoff" story page (`heroImage`).
**Illustrates:** falling snow and a fan of playing cards (given a rose motif instead of
ordinary suits, to stay in the Estate's visual language) — an object/mood scene, no
characters.
**Replaces the gap:** the unlocated "UNO Day / Suspicion" legacy artwork.

## Not generated, and why

Episode Six (the Enchanted Silver Rose Ball) and its "eavesdropping" P0 gap were
**not** given a stand-in: that episode already has seven real V2 illustrations on its
page, so a page here would not be filling a genuine absence — see
DECISIONS_AND_GAPS.md's "wherever a page genuinely needs an image to exist to be
complete." Queso's and Keady's resident profiles were also left without a generated
portrait, deliberately — see the character-design note above.

The "Silly Chair" gap was not given its own stand-in either: nothing in the recovered
material ties it to one specific story text this run could illustrate honestly, so it
stays an open item rather than a guessed scene.
