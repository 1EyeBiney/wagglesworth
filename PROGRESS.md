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
