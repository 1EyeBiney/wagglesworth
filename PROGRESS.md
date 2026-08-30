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
