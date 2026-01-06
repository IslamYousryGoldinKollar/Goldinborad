const fs = require('fs');
const path = require('path');

const requiredFiles = ['IDS.md', 'CLICKMAP.md', 'openapi.yaml', 'schema.sql'];
const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(__dirname, '..', file)));
if (missing.length) {
  console.error('Required contract files missing:', missing);
  process.exit(1);
}

const clickmapPath = path.join(__dirname, '..', 'fixtures', 'clickmap.json');
const clickmap = JSON.parse(fs.readFileSync(clickmapPath, 'utf8'));
const duplicateIds = clickmap
  .map((entry) => entry.elementId)
  .filter((id, index, arr) => arr.indexOf(id) !== index);

if (duplicateIds.length) {
  console.error('Duplicate element IDs found in fixtures/clickmap.json:', duplicateIds);
  process.exit(1);
}

console.log('Lint checks passed: contracts present and clickmap fixtures deduped.');
