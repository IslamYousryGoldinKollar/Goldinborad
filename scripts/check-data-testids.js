const fs = require('fs');
const path = require('path');
const clickmap = require('../fixtures/clickmap.json');

const ROOT = path.join(__dirname, '..');
const fixtureDir = path.join(ROOT, 'fixtures', 'html');
const elmPattern = /^ELM-[A-Z0-9-]+(__(<[a-z0-9_]+>|[A-Za-z0-9_-]+))?$/;

function extractDataTestIds(html) {
  const matches = [...html.matchAll(/data-testid="([^"]+)"/g)];
  return matches.map((m) => m[1]);
}

function validateDocument(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const ids = extractDataTestIds(html);
  const issues = [];

  ids.forEach((id) => {
    if (!elmPattern.test(id) && !id.startsWith('SCR-')) {
      issues.push(`Invalid data-testid ${id} in ${path.basename(filePath)}`);
    }
  });

  const dynamicIds = ids.filter((id) => id.includes('__'));
  dynamicIds.forEach((id) => {
    const dataEntityPattern = new RegExp(`data-testid=\"${id}\"[^>]*data-entity-id=`);
    if (!dataEntityPattern.test(html)) {
      issues.push(`Dynamic element ${id} missing data-entity-id in ${path.basename(filePath)}`);
    }
  });

  const expectedIds = clickmap.map((entry) => entry.elementId.replace('<um_id>', '123'));
  expectedIds.forEach((id) => {
    if (!ids.includes(id)) {
      issues.push(`Missing data-testid ${id} in fixture ${path.basename(filePath)}`);
    }
  });

  return issues;
}

const files = fs.readdirSync(fixtureDir).filter((file) => file.endsWith('.html'));
const problems = files.flatMap((file) => validateDocument(path.join(fixtureDir, file)));

if (problems.length) {
  console.error('data-testid validation failed:\n' + problems.join('\n'));
  process.exit(1);
}

console.log(`data-testid validation OK for ${files.length} fixture(s).`);
