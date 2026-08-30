# Maintaining Wagglesworth Estate

This is for Barb, working from her own computer with a desktop chat assistant
(Claude Desktop or ChatGPT Desktop) — not a developer's setup guide. Nothing here
requires installing anything or running a command.

## The one thing to understand

**The website you see is built automatically from files stored on GitHub.** You never
edit the website directly, and you never need to "publish" anything separately.
Editing a file on GitHub and saving it *is* publishing — the site rebuilds itself and
updates within a few minutes, every time.

Your computer doesn't need to have anything installed for this to work. The building
happens on GitHub's own computers, not yours.

## How to add a new story

1. Open a chat with your assistant (Claude Desktop or GPT Desktop) and tell it you
   want to add a new Wagglesworth Estate story. Give it the story text and tell it
   which section it belongs in (an everyday adventure, a holiday, a trip, a party, or
   part of an ongoing series).
2. Ask your assistant to fill in the story using the template at
   `content/templates/story-template.md` in this project (show it that file, or ask it
   to open it from the GitHub repository). The template explains every field in plain
   language and repeats the important rules — no invented details, no gold, never the
   word "Noodleverse" — right there in the file, because your assistant won't have
   read this whole project the way Claude Code has.
3. Once your assistant has a finished file, go to the `content/stories/` folder on
   GitHub, choose "Add file" → "Create new file," paste in the finished text, name the
   file something short and descriptive ending in `.md` (like `new-story-title.md`),
   and commit it.
4. That's it. Within a few minutes, check the site — your new story is there. If
   something was filled in wrong (a missing required field, a duplicate ID), the
   commit will show a red X instead of a green check — see "If something goes wrong,"
   below.

## Adding a resident, a location, a gallery image, or a seasonal entrance

Same pattern as a story, using the matching template:

- A new resident: `content/templates/resident-template.json`, added as a new entry in
  `site/_data/residents.json` (open that file on GitHub, add your new record inside
  the square brackets, following the same shape as the ones already there).
- A new location: `content/templates/location-template.json`, added to
  `site/_data/locations.json` the same way.
- A new gallery image: first upload the actual image file into the right folder under
  `assets/originals/`, then add a matching record to `site/_data/images.json` using
  `content/templates/image-template.json` — your assistant can help you write real,
  specific alt text once it can actually see the image you're adding.
- A seasonal entrance: `content/templates/seasonal-template.json`, added to
  `site/_data/seasonal.json`.

Every one of these files is a list of records in `{ curly braces }`, separated by
commas. Adding one means adding one more `{ }` entry to the list, in the same shape as
the ones already there. Your assistant is good at this — show it an existing entry as
an example and ask it to follow the same pattern.

## If something goes wrong

After you save a change on GitHub, look for a small icon next to your commit:

- A green checkmark means the site rebuilt successfully. You're done.
- A red X means something was filled in incorrectly — normally a required field left
  out, or two things given the same ID by accident. Click on the red X, then click
  "Details," and you'll see a plain-language message naming exactly what's wrong and
  in which file. Paste that message to your assistant and ask it to help you fix it.

Nothing you do here can break the *live* site while you're fixing it — the old version
stays up until a new version successfully passes every check.

## Where things live

- `content/stories/` — every story, as plain text files.
- `site/_data/` — residents, locations, gallery images, and seasonal entrances, as
  structured lists.
- `assets/originals/` — every original image, full size, untouched. Web-friendly
  versions are made automatically from these; you never create or upload those
  yourself.
- `content/templates/` — the fill-in-the-blank templates described above.

## What never changes automatically

The rules in `CLAUDE.md` — no gold, never "Noodleverse" in public text, no invented
character facts, real alt text on every image — are checked automatically on every
save, but they can't catch everything a human eye would. When in doubt, ask your
assistant to re-read `CLAUDE.md` before it drafts new content; it's written for exactly
that purpose.

## Going live to search engines

The site currently tells search engines not to index it (`site/robots.txt` and a
`noindex` tag on every page), so it's reachable only by the direct link. When you're
ready for it to be found by search, open `site/_data/site.json` and change
`"goLiveToSearchEngines": false` to `true`, then also remove the `Disallow: /` line
from `site/robots.txt`. That is the entire switch — see `DECISIONS_AND_GAPS.md` for why
it was built this way.
