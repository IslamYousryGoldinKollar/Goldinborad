const test = require('node:test');
const assert = require('node:assert/strict');
const ids = require('../../fixtures/ids.json');
const clickmap = require('../../fixtures/clickmap.json');

const elementPattern = /^ELM-[A-Z0-9-]+(__<.+>)?$/;
const actionPattern = /^ACT-[A-Z0-9-]+$/;
const apiPattern = /^API-[A-Z0-9-]+$/;

test('element IDs follow ELM-* convention', () => {
  ids.referenceElements.forEach((elm) => {
    assert(elementPattern.test(elm), `Invalid element id ${elm}`);
  });
});

test('clickmap fixtures connect element → action → api', () => {
  clickmap.forEach((entry) => {
    assert(elementPattern.test(entry.elementId), `Invalid element id ${entry.elementId}`);
    assert(actionPattern.test(entry.actionId), `Invalid action id ${entry.actionId}`);
    if (entry.api) {
      assert(apiPattern.test(entry.api), `Invalid api id ${entry.api}`);
    }
  });
});

test('dynamic IDs carry the __<entity_id> suffix rule', () => {
  const dynamicIds = ids.referenceElements.filter((elm) => elm.includes('__'));
  dynamicIds.forEach((id) => {
    assert(id.endsWith(ids.dynamicSuffix) || id.includes('__<um_id>'));
  });
});
