const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const clickmap = require('../../fixtures/clickmap.json');

const specPath = path.join(__dirname, '..', '..', 'openapi.yaml');
const spec = fs.readFileSync(specPath, 'utf8');

function collectOperationIds(doc) {
  return [...doc.matchAll(/operationId:\s*([A-Z0-9.-]+)/g)].map((match) => match[1]);
}

test('operationIds are present and stable', () => {
  const ids = collectOperationIds(spec);
  assert(ids.length > 0, 'No operationIds found');
  ids.forEach((id) => {
    assert(id.startsWith('API-'), `operationId ${id} missing API- prefix`);
  });
});

test('CLICKMAP API dependencies exist in spec', () => {
  const ids = new Set(collectOperationIds(spec));
  const expected = clickmap.filter((entry) => entry.api).map((entry) => entry.api);
  expected.forEach((id) => {
    assert(ids.has(id), `${id} missing from openapi.yaml`);
  });
});

test('spec declares bearer auth for tenancy enforcement', () => {
  assert(spec.includes('bearerAuth'), 'bearerAuth security scheme missing');
});
