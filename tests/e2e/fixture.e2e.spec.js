const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const clickmap = require('../../fixtures/clickmap.json');

const fixturePath = path.join(__dirname, '..', '..', 'fixtures', 'html', 'today-plan.html');
const html = fs.readFileSync(fixturePath, 'utf8');

function hasElement(id) {
  const pattern = new RegExp(`data-testid=\"${id}\"`);
  return pattern.test(html);
}

test('static fixture contains actionable IDs for end-to-end flows', () => {
  clickmap.forEach((entry) => {
    const id = entry.elementId.replace('<um_id>', '123');
    assert(hasElement(id), `E2E fixture missing ${id}`);
  });
});

test('fixture encodes both learner and auth affordances', () => {
  assert(hasElement('SCR-LRN-014'));
  assert(hasElement('SCR-PUB-001'));
});
