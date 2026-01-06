const en = require('../messages/en.json');
const ar = require('../messages/ar.json');

function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return flattenKeys(value, next);
    }
    return [next];
  });
}

const enKeys = new Set(flattenKeys(en));
const arKeys = new Set(flattenKeys(ar));

const missingInAr = [...enKeys].filter((k) => !arKeys.has(k));
const missingInEn = [...arKeys].filter((k) => !enKeys.has(k));

if (missingInAr.length || missingInEn.length) {
  console.error('i18n coverage mismatch');
  if (missingInAr.length) {
    console.error('Missing in ar.json:', missingInAr);
  }
  if (missingInEn.length) {
    console.error('Missing in en.json:', missingInEn);
  }
  process.exit(1);
}

console.log(`i18n coverage OK — ${enKeys.size} keys in both locales.`);
