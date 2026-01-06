const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const clickmap = require('../../fixtures/clickmap.json');

const fixturePath = path.join(__dirname, '..', '..', 'fixtures', 'html', 'today-plan.html');
const html = fs.readFileSync(fixturePath, 'utf8');

function extractDataTestIds(doc) {
  return [...doc.matchAll(/data-testid="([^"]+)"/g)].map((m) => m[1]);
}

test('data-testid coverage', () => {
  const ids = extractDataTestIds(html);

  clickmap.forEach((entry) => {
    const id = entry.elementId.replace('<um_id>', '123');
    assert(ids.includes(id), `Expected ${id} in fixture`);
  });

  ids
    .filter((id) => id.includes('__'))
    .forEach((id) => {
      const dataEntityPattern = new RegExp(`data-testid=\"${id}\"[^>]*data-entity-id=`);
      assert(dataEntityPattern.test(html), `Expected data-entity-id on ${id}`);
    });
});
