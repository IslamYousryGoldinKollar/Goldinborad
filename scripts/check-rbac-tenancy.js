const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'schema.sql');
const rbacPath = path.join(__dirname, '..', 'RBAC.md');
const seedPath = path.join(__dirname, '..', 'fixtures', 'seed', 'seed_data.sql');

const schema = fs.readFileSync(schemaPath, 'utf8');
const rbac = fs.readFileSync(rbacPath, 'utf8');
const seed = fs.readFileSync(seedPath, 'utf8');

const tableRegex = /CREATE TABLE\s+(\w+)\s*\(([^;]+?)\);/gs;
const tables = {};
let match;
while ((match = tableRegex.exec(schema)) !== null) {
  const [, tableName, body] = match;
  const columns = body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('--'))
    .map((line) => line.split(/\s+/)[0].replace(/,$/, ''));
  tables[tableName] = columns;
}

const tenantExemptTables = new Set([
  'roles',
  'permissions',
  'role_permissions',
  'tenants',
  'user_credentials',
  // Tenant context is derived from user_id/user_mission_id foreign keys
  'user_roles',
  'cohort_members',
  'team_members',
  'manager_team_map',
  'knowledge_asset_categories',
  'user_asset_progress',
  'journey_day_missions',
  'user_mission_steps',
  'sa_responses'
]);

const missingTenantScope = Object.entries(tables)
  .filter(([name]) => !tenantExemptTables.has(name))
  .filter(([, cols]) => !cols.includes('tenant_id'))
  .map(([name]) => name);

const permMatches = new Set((rbac.match(/PERM\.[A-Z0-9._-]+/g) || []));
const seedPerms = new Set(Array.from(seed.matchAll(/'(?<perm>PERM\.[^']+)'/g)).map((m) => m.groups.perm));
const missingPerms = [...permMatches].filter((perm) => !seedPerms.has(perm));

if (missingTenantScope.length || missingPerms.length) {
  if (missingTenantScope.length) {
    console.error('Tables missing tenant_id (tenancy enforcement check):', missingTenantScope);
  }
  if (missingPerms.length) {
    console.error('Seed data missing RBAC permissions:', missingPerms);
  }
  process.exit(1);
}

console.log('RBAC + tenancy checks passed. Tenant scoping present and seed permissions align.');
