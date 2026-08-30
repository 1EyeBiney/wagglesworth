// Text-size control: A-, A+, Reset. Multiplies --text-scale on the root
// element, which every rem-based size in main.css is built from, so this
// composes with the visitor's own browser zoom instead of overriding it.
// Works without JavaScript too: the control simply doesn't appear, and the
// site is already legible at the default scale and at 200-400% browser
// zoom per the accessibility baseline.
(function () {
    'use strict';

    var STORAGE_KEY = 'wagglesworth-text-scale';
    var MIN_SCALE = 0.85;
    var MAX_SCALE = 1.6;
    var STEP = 0.1;
    var DEFAULT_SCALE = 1;

    function clamp(v) {
        return Math.min(MAX_SCALE, Math.max(MIN_SCALE, v));
    }

    function readScale() {
        try {
            var stored = window.localStorage.getItem(STORAGE_KEY);
            var n = parseFloat(stored);
            return isNaN(n) ? DEFAULT_SCALE : clamp(n);
        } catch (e) {
            return DEFAULT_SCALE;
        }
    }

    function writeScale(scale) {
        try {
            window.localStorage.setItem(STORAGE_KEY, String(scale));
        } catch (e) {
            // Private browsing or storage disabled: the control still works
            // for the current page view, it just won't persist. Silence is
            // correct here, not a bug — nothing the visitor did failed.
        }
    }

    function applyScale(scale) {
        document.documentElement.style.setProperty('--text-scale', String(scale));
    }

    function announce(message) {
        var live = document.getElementById('text-size-announcer');
        if (live) live.textContent = message;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var container = document.querySelector('.text-size-control');
        if (!container) return;

        var scale = readScale();
        applyScale(scale);

        var decBtn = container.querySelector('[data-action="decrease"]');
        var incBtn = container.querySelector('[data-action="increase"]');
        var resetBtn = container.querySelector('[data-action="reset"]');

        function update(newScale, label) {
            scale = clamp(newScale);
            applyScale(scale);
            writeScale(scale);
            announce(label + '. Text size ' + Math.round(scale * 100) + ' percent.');
        }

        if (decBtn) decBtn.addEventListener('click', function () { update(scale - STEP, 'Decreased'); });
        if (incBtn) incBtn.addEventListener('click', function () { update(scale + STEP, 'Increased'); });
        if (resetBtn) resetBtn.addEventListener('click', function () { update(DEFAULT_SCALE, 'Reset'); });
    });
})();
