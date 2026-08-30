// Runs every validator against the built site (assumes `npm run build` has
// already run) and the source content model. Exits non-zero if anything
// fails, so it works as a CI gate as well as a local pre-commit check.
'use strict';

const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const SITE_DIR = path.join(ROOT, '_site');

if (!fs.existsSync(SITE_DIR)) {
    console.error('_site/ does not exist. Run `npm run build` first.');
    process.exit(1);
}

const checks = [
    { name: 'Broken internal links', fn: function () { return require('./checks/links')(SITE_DIR); } },
    { name: 'Missing alt text (built output)', fn: function () { return require('./checks/alt-text')(SITE_DIR); } },
    { name: 'Prohibited terms ("Noodleverse") and gold-family colors', fn: function () { return require('./checks/prohibited-terms')(SITE_DIR); } },
    { name: 'Required metadata', fn: function () { return require('./checks/metadata')(ROOT); } },
    { name: 'Episode ordering', fn: function () { return require('./checks/episode-order')(ROOT); } },
    { name: 'Duplicate IDs and slugs', fn: function () { return require('./checks/duplicate-ids')(ROOT); } },
    { name: 'Cross-references (image/resident ids)', fn: function () { return require('./checks/references')(ROOT); } }
];

let totalProblems = 0;
for (const check of checks) {
    const problems = check.fn();
    if (problems.length) {
        console.log('\nFAIL: ' + check.name + ' (' + problems.length + ')');
        for (const p of problems) console.log('  - ' + p);
        totalProblems += problems.length;
    } else {
        console.log('OK:   ' + check.name);
    }
}

if (totalProblems > 0) {
    console.log('\n' + totalProblems + ' problem(s) found. Fix before committing (CLAUDE.md).');
    process.exit(1);
}
console.log('\nAll checks passed clean.');
