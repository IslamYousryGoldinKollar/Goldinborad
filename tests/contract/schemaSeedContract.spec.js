const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', '..', 'schema.sql');
const seedPath = path.join(__dirname, '..', '..', 'fixtures', 'seed', 'seed_data.sql');

const schema = fs.readFileSync(schemaPath, 'utf8');
const seed = fs.readFileSync(seedPath, 'utf8');

function buildTableMap(sql) {
  const tableRegex = /CREATE TABLE\s+(\w+)\s*\(([^;]+?)\);/gs;
  const tables = {};
  let match;
  while ((match = tableRegex.exec(sql)) !== null) {
    const [, tableName, body] = match;
    const columns = body
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('--'))
      .map((line) => line.split(/\s+/)[0].replace(/,$/, ''));
    tables[tableName] = columns;
  }
  return tables;
}

function parseInsertStatements(sql) {
  const insertRegex = /INSERT INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES/gi;
  const inserts = [];
  let match;
  while ((match = insertRegex.exec(sql)) !== null) {
    const [, tableName, cols] = match;
    const columns = cols.split(',').map((c) => c.trim());
    inserts.push({ tableName, columns });
  }
  return inserts;
}

test('seed statements only reference known tables/columns', () => {
  const tables = buildTableMap(schema);
  const inserts = parseInsertStatements(seed);

  inserts.forEach(({ tableName, columns }) => {
    assert(tables[tableName], `${tableName} is not defined in schema`);
    columns.forEach((col) => {
      assert(tables[tableName].includes(col), `${col} missing in ${tableName}`);
    });
  });
});

test('core tenancy rows are provided', () => {
  const inserts = parseInsertStatements(seed);
  const seededTables = inserts.map((i) => i.tableName);
  ['tenants', 'tenant_settings', 'users', 'user_roles', 'roles', 'permissions', 'role_permissions'].forEach((table) => {
    assert(seededTables.includes(table), `${table} not seeded`);
  });
});
