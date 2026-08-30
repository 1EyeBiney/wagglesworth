// Eleventy configuration. Plain Node, no TypeScript, per CLAUDE.md.
//
// Input lives entirely under site/ so that non-site project files at the repo
// root (docs, tools/, _source/, assets/originals/) are never mistaken for pages.
// The only thing built outside site/ is assets/img/, which tools/build-images.js
// writes into site/assets/img/ before Eleventy runs, so it is passthrough-copied
// like any other static asset.

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ 'site/assets/css': 'assets/css' });
    eleventyConfig.addPassthroughCopy({ 'site/assets/js': 'assets/js' });
    eleventyConfig.addPassthroughCopy({ 'site/assets/img': 'assets/img' });
    eleventyConfig.addPassthroughCopy({ 'site/robots.txt': 'robots.txt' });
    eleventyConfig.addPassthroughCopy({ 'site/favicon.svg': 'favicon.svg' });

    // Stories, in series/episode order for anywhere the whole set is listed.
    // Individual episode Previous/Next uses seriesId + episodeNumber, not this
    // collection's overall order, so a story can belong to a series without
    // its neighbors in other series shifting its position here.
    eleventyConfig.addCollection('stories', function (api) {
        return api.getFilteredByGlob('site/content/stories/*.md')
            .sort(function (a, b) { return a.data.order - b.data.order; });
    });

    // Look up a resident/location record by id from the global data arrays —
    // templates do this constantly (a story's character list, a location's
    // associated residents) and a repeated Nunjucks filter loop is harder to
    // read than one filter call.
    // The URL for an image record at a given raster width. Generated
    // stand-in art (data/images.json "provenance": "generated-stand-in")
    // ships as SVG and is copied through unchanged rather than rasterized -
    // vector art doesn't need a fixed-width derivative, and a story hero
    // image referencing "-960.webp" on a record whose real file is
    // "<id>.svg" would otherwise 404 silently. Centralized here so every
    // template that shows an image asks this one function, not six.
    eleventyConfig.addFilter('imgSrc', function (img, width) {
        if (!img) return '';
        if (img.format === 'SVG') return '/assets/img/' + img.id + '.svg';
        return '/assets/img/' + img.id + '-' + width + '.webp';
    });

    eleventyConfig.addFilter('byId', function (records, id) {
        return (records || []).find(function (r) { return r.id === id; }) || null;
    });

    // Nunjucks' selectattr only supports a single truthy-attribute test, not
    // Jinja2's ("attr", "equalto", value) form - passing the extra arguments
    // is silently ignored rather than erroring, so `images | selectattr(
    // "galleryCategory", "equalto", cat.id)` quietly returned every image for
    // every category (found by a design-drift review of the built site, not
    // by any validator). These two filters replace every equality-filter use.
    eleventyConfig.addFilter('whereEquals', function (items, key, value) {
        return (items || []).filter(function (item) { return item[key] === value; });
    });

    eleventyConfig.addFilter('firstWhereTrue', function (items, dataKey) {
        return (items || []).find(function (item) { return item.data && item.data[dataKey]; }) || null;
    });

    eleventyConfig.addFilter('storiesForSeries', function (stories, seriesId) {
        return (stories || [])
            .filter(function (s) { return s.data.seriesId === seriesId; })
            .sort(function (a, b) { return a.data.episodeNumber - b.data.episodeNumber; });
    });

    eleventyConfig.addFilter('storiesInCollection', function (stories, collectionName) {
        return (stories || []).filter(function (s) { return s.data.primaryCollection === collectionName; });
    });

    // Used only to build the story-search JSON index (site/search-index.njk).
    // A plain JSON.stringify rather than Nunjucks' own dump, so behavior
    // never depends on which Nunjucks build Eleventy happens to vendor.
    // JSON.stringify(undefined) returns the JS value undefined, not a
    // string - Nunjucks then renders that as nothing at all, which left
    // "seriesId": , in the search index for every non-series story (found
    // by validating the built search-index.json, not by reading the
    // template). Coalescing to null first keeps the output valid JSON.
    eleventyConfig.addFilter('dump', function (obj) { return JSON.stringify(obj === undefined ? null : obj); });
    eleventyConfig.addFilter('striptags', function (str) {
        return String(str || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    });

    return {
        dir: {
            input: 'site',
            includes: '_includes',
            data: '_data',
            output: '_site'
        },
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        templateFormats: ['njk', 'md', '11ty.js']
    };
};
