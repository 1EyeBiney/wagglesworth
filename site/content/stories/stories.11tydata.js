// Directory data for every story in content/stories/*.md. Eleventy merges
// this into every story's front matter automatically.
//
// Previous/Next is deterministic per the design document: within a series it
// follows episode order; a standalone story follows the archive's overall
// `order` field. Computed here via eleventyComputed (which Eleventy resolves
// once collections exist) rather than in the story layout template, because
// Nunjucks `{% set %}` inside a `{% for %}` loop does not leak its value out
// of the loop — trying to compute this directly in story.njk would have
// silently produced empty neighbors.

var SERIES_NAMES = {
    'royal-summer': 'Royal Summer / Silver Rose Series'
};

function orderedList(data) {
    var stories = (data.collections && data.collections.stories) || [];
    if (data.seriesId) {
        return stories
            .filter(function (s) { return s.data.seriesId === data.seriesId; })
            .sort(function (a, b) { return a.data.episodeNumber - b.data.episodeNumber; });
    }
    return stories.slice().sort(function (a, b) { return a.data.order - b.data.order; });
}

function currentIndex(list, data) {
    return list.findIndex(function (s) { return s.data.slug === data.slug; });
}

module.exports = {
    layout: 'layouts/story.njk',
    tags: ['story'],
    eleventyComputed: {
        seriesName: function (data) {
            return data.seriesId ? (SERIES_NAMES[data.seriesId] || data.seriesId) : null;
        },
        previousStory: function (data) {
            var list = orderedList(data);
            var i = currentIndex(list, data);
            return i > 0 ? list[i - 1] : null;
        },
        nextStory: function (data) {
            var list = orderedList(data);
            var i = currentIndex(list, data);
            return i >= 0 && i < list.length - 1 ? list[i + 1] : null;
        }
    }
};
