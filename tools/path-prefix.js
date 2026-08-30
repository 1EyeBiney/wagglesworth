// Single source of truth for the GitHub Pages project-page subpath, shared
// between eleventy.config.js (which needs it to configure Eleventy's
// pathPrefix) and tools/checks/links.js (which needs to strip it back off
// before resolving a built href against the physical _site/ layout, since
// pathPrefix changes URLs written into HTML but never the output folder
// structure itself).
module.exports = '/wagglesworth/';
