const test = require('node:test');
const assert = require('node:assert/strict');
const en = require('../../messages/en.json');
const ar = require('../../messages/ar.json');

function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return flattenKeys(value, next);
    }
    return [next];
  });
}

test('i18n coverage: en/ar packs stay in sync', () => {
  const enKeys = new Set(flattenKeys(en));
  const arKeys = new Set(flattenKeys(ar));

  const missingInAr = [...enKeys].filter((k) => !arKeys.has(k));
  const missingInEn = [...arKeys].filter((k) => !enKeys.has(k));

  assert.deepEqual(missingInAr, []);
  assert.deepEqual(missingInEn, []);
});
