// The residents actually shown on the public site. Records in residents.json
// marked "unlisted": true (currently the ten Ladies-in-Waiting, removed at
// Barb's instruction in the first review round — see DECISIONS_AND_GAPS.md)
// keep their full data there so story cross-references stay valid and the
// removal is reversible by deleting the flag, but they get no profile page,
// no directory card, no sitemap entry, and no mention on map location pages.
// Every template that renders residents publicly must read this list, not
// residents.json directly.
module.exports = require('./residents.json').filter(function (r) {
    return !r.unlisted;
});
