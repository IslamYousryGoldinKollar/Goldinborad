-- Seed data aligned with schema.sql to support contract tests
INSERT INTO tenants (tenant_id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Nawras Training');

INSERT INTO tenant_settings (
  tenant_id,
  allowed_email_domains,
  default_language,
  enabled_languages,
  require_bilingual_content,
  rewards_store_enabled,
  leaderboard_enabled,
  video_completion_threshold,
  sa_enabled,
  sa_retry_days,
  sa_manager_sharing_allowed,
  reschedule_window_days,
  max_reschedules_per_mission,
  allow_reschedule_earlier,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  ARRAY['example.com','goldinkollar.com'],
  'en',
  ARRAY['en','ar'],
  true,
  false,
  true,
  0.8,
  true,
  30,
  true,
  3,
  2,
  true,
  now(),
  now()
);

INSERT INTO roles (role_key, description) VALUES
  ('ROLE.LEARNER', 'Standard end-user'),
  ('ROLE.MANAGER', 'Learner + team manager'),
  ('ROLE.ADMIN_TENANT', 'Tenant administrator');

INSERT INTO permissions (perm_key, description) VALUES
  ('PERM.LRN.ACCESS', 'Access learner app'),
  ('PERM.MGR.TEAM.VIEW', 'View team members'),
  ('PERM.MGR.TEAM.NUDGE', 'Send nudges to team members'),
  ('PERM.ADM.DASHBOARD.VIEW', 'View admin dashboard'),
  ('PERM.ADM.USERS.MANAGE', 'Manage users'),
  ('PERM.ADM.COHORTS.MANAGE', 'Manage cohorts'),
  ('PERM.ADM.JOURNEYS.MANAGE', 'Manage journeys'),
  ('PERM.ADM.CONTENT.MANAGE', 'Manage KB assets and templates'),
  ('PERM.ADM.CLAIMS.REVIEW', 'Review task claims'),
  ('PERM.ADM.REWARDS.MANAGE', 'Manage reward catalog'),
  ('PERM.ADM.SETTINGS.MANAGE', 'Manage tenant settings'),
  ('PERM.ADM.AUDIT.VIEW', 'View audit logs');

INSERT INTO role_permissions (role_key, perm_key) VALUES
  ('ROLE.LEARNER', 'PERM.LRN.ACCESS'),
  ('ROLE.MANAGER', 'PERM.LRN.ACCESS'),
  ('ROLE.MANAGER', 'PERM.MGR.TEAM.VIEW'),
  ('ROLE.MANAGER', 'PERM.MGR.TEAM.NUDGE'),
  ('ROLE.ADMIN_TENANT', 'PERM.ADM.DASHBOARD.VIEW'),
  ('ROLE.ADMIN_TENANT', 'PERM.ADM.USERS.MANAGE'),
  ('ROLE.ADMIN_TENANT', 'PERM.ADM.COHORTS.MANAGE'),
  ('ROLE.ADMIN_TENANT', 'PERM.ADM.JOURNEYS.MANAGE'),
  ('ROLE.ADMIN_TENANT', 'PERM.ADM.CONTENT.MANAGE'),
  ('ROLE.ADMIN_TENANT', 'PERM.ADM.CLAIMS.REVIEW'),
  ('ROLE.ADMIN_TENANT', 'PERM.ADM.REWARDS.MANAGE'),
  ('ROLE.ADMIN_TENANT', 'PERM.ADM.SETTINGS.MANAGE'),
  ('ROLE.ADMIN_TENANT', 'PERM.ADM.AUDIT.VIEW');

INSERT INTO users (
  user_id,
  tenant_id,
  email,
  first_name,
  last_name,
  language,
  timezone,
  is_active,
  created_at
) VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'learner@example.com', 'Lina', 'Learner', 'en', 'UTC', true, now()),
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Adil', 'Admin', 'en', 'UTC', true, now());

INSERT INTO user_roles (user_id, role_key) VALUES
  ('00000000-0000-0000-0000-000000000101', 'ROLE.LEARNER'),
  ('00000000-0000-0000-0000-000000000201', 'ROLE.ADMIN_TENANT');
