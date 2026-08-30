// Story-only search (design doc §3: "Search indexes stories only, including
// title, summary, body, series, categories, and character keywords.").
//
// Progressive enhancement: the Stories archive is a complete, fully
// keyboard-navigable list of every story with no JavaScript at all. This
// script only adds a live filter on top of that list — if it fails to load
// or a visitor has JavaScript disabled, every story is still there and
// still reachable, just not filterable by keyword.
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('story-search-form');
        var input = document.getElementById('story-search-input');
        var status = document.getElementById('story-search-status');
        if (!form || !input || !status) return;

        // Story links are already on the page, grouped by series/category
        // (design doc: title-led archive, not a separate results list) —
        // search filters what's already there rather than replacing it.
        var index = null;
        var items = Array.prototype.slice.call(document.querySelectorAll('[data-story-url]'));

        function loadIndex() {
            if (index) return Promise.resolve(index);
            return fetch('/search-index.json')
                .then(function (r) { return r.json(); })
                .then(function (data) { index = data; return index; })
                .catch(function () { return []; });
        }

        function matches(entry, terms) {
            var haystack = [entry.title, entry.summary, entry.body, entry.seriesId,
                             entry.primaryCollection, (entry.characters || []).join(' ')]
                .join(' ').toLowerCase();
            return terms.every(function (t) { return haystack.indexOf(t) !== -1; });
        }

        function applyFilter(query) {
            var q = query.trim().toLowerCase();
            if (!q) {
                items.forEach(function (el) { el.hidden = false; });
                status.textContent = '';
                return;
            }
            var terms = q.split(/\s+/);
            loadIndex().then(function (data) {
                var visibleUrls = {};
                data.forEach(function (entry) {
                    if (matches(entry, terms)) visibleUrls[entry.url] = true;
                });
                var shown = 0;
                items.forEach(function (el) {
                    var url = el.getAttribute('data-story-url');
                    var show = !!visibleUrls[url];
                    el.hidden = !show;
                    if (show) shown++;
                });
                status.textContent = shown + (shown === 1 ? ' story matches "' : ' stories match "') + query + '".';
            });
        }

        form.addEventListener('submit', function (e) { e.preventDefault(); });
        input.addEventListener('input', function () { applyFilter(input.value); });
    });
})();
