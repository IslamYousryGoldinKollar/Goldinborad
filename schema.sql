-- Goldinkollar — Postgres Schema Contract (Canonical)
-- Version: 1.2 (2026-01-05)
--
-- Notes:
-- - IDs are stored as uuid. App may generate UUIDv7; DB does not enforce version.
-- - Tenancy: almost every table is scoped by tenant_id.
-- - Points: immutable ledger; reversals are new rows that reference originals.

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- ======================
-- Core tenancy
-- ======================
CREATE TABLE tenants (
  tenant_id uuid PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tenant_settings (
  tenant_id uuid PRIMARY KEY REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  allowed_email_domains text[] NOT NULL DEFAULT '{}',
  default_language text NOT NULL DEFAULT 'en',
  enabled_languages text[] NOT NULL DEFAULT ARRAY['en','ar'],
  require_bilingual_content boolean NOT NULL DEFAULT false,

  -- Feature switches / policies
  rewards_store_enabled boolean NOT NULL DEFAULT false,
  leaderboard_enabled boolean NOT NULL DEFAULT true,
  video_completion_threshold numeric(4,3) NOT NULL DEFAULT 0.800,

  sa_enabled boolean NOT NULL DEFAULT true,
  sa_retry_days int NOT NULL DEFAULT 30,
  sa_manager_sharing_allowed boolean NOT NULL DEFAULT true,

  -- Reschedule policy defaults
  reschedule_window_days int NOT NULL DEFAULT 3,
  max_reschedules_per_mission int NOT NULL DEFAULT 2,
  allow_reschedule_earlier boolean NOT NULL DEFAULT true,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ======================
-- Users + auth + RBAC
-- ======================
CREATE TABLE users (
  user_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,

  email citext NOT NULL,
  first_name text,
  last_name text,

  language text NOT NULL DEFAULT 'en', -- en/ar
  timezone text NOT NULL DEFAULT 'UTC',

  profile_photo_upload_id uuid,
  is_active boolean NOT NULL DEFAULT true,

  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, email)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);

CREATE TABLE user_credentials (
  user_id uuid PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  password_hash text NOT NULL,
  password_updated_at timestamptz NOT NULL DEFAULT now()
);

-- Optional: user consents related to Self Awareness personalization/sharing
CREATE TABLE user_sa_settings (
  user_id uuid PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  consent_personalize boolean NOT NULL DEFAULT false,
  consent_share_manager boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE roles (
  role_key text PRIMARY KEY, -- e.g. ROLE.LEARNER
  description text
);

CREATE TABLE user_roles (
  user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  role_key text NOT NULL REFERENCES roles(role_key) ON DELETE RESTRICT,
  PRIMARY KEY (user_id, role_key)
);

-- Optional: store explicit permissions (if not deriving from roles in code)
CREATE TABLE permissions (
  perm_key text PRIMARY KEY, -- e.g. PERM.ADM.USERS.MANAGE
  description text
);

CREATE TABLE role_permissions (
  role_key text NOT NULL REFERENCES roles(role_key) ON DELETE CASCADE,
  perm_key text NOT NULL REFERENCES permissions(perm_key) ON DELETE CASCADE,
  PRIMARY KEY (role_key, perm_key)
);

-- ======================
-- Auth flows (optional tables)
-- ======================
CREATE TABLE auth_password_resets (
  reset_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  email citext NOT NULL,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_password_resets_lookup ON auth_password_resets(tenant_id, email);

CREATE TABLE tenant_invites (
  invite_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  email citext NOT NULL,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  created_by uuid REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ======================
-- Cohorts / Teams / Manager mapping
-- ======================
CREATE TABLE cohorts (
  cohort_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE teams (
  team_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cohort_members (
  cohort_id uuid NOT NULL REFERENCES cohorts(cohort_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  PRIMARY KEY (cohort_id, user_id)
);

CREATE TABLE team_members (
  team_id uuid NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, user_id)
);

CREATE TABLE manager_team_map (
  manager_user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
  PRIMARY KEY (manager_user_id, team_id)
);

-- ======================
-- Uploads + content
-- ======================
CREATE TABLE uploads (
  upload_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  file_name text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL,
  storage_key text NOT NULL,
  created_by uuid REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_uploads_tenant ON uploads(tenant_id);

-- Knowledge categories (optional but supports UI filters)
CREATE TABLE knowledge_categories (
  category_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE knowledge_assets (
  asset_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,

  asset_type text NOT NULL CHECK (asset_type IN ('video','article','pdf','flashcards')),
  language text NOT NULL CHECK (language IN ('en','ar')),
  title text NOT NULL,
  description text,

  upload_id uuid REFERENCES uploads(upload_id),
  duration_seconds int,
  download_allowed boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,

  created_by uuid REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_knowledge_assets_tenant ON knowledge_assets(tenant_id);
CREATE INDEX idx_knowledge_assets_published ON knowledge_assets(tenant_id, published);

CREATE TABLE knowledge_asset_categories (
  asset_id uuid NOT NULL REFERENCES knowledge_assets(asset_id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES knowledge_categories(category_id) ON DELETE CASCADE,
  PRIMARY KEY (asset_id, category_id)
);

-- Track learner progress (system tracked)
CREATE TABLE user_asset_progress (
  user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES knowledge_assets(asset_id) ON DELETE CASCADE,
  watched_seconds int NOT NULL DEFAULT 0,
  watched_percent numeric(5,4) NOT NULL DEFAULT 0,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, asset_id)
);

-- ======================
-- Journeys + missions
-- ======================
CREATE TABLE journey_templates (
  journey_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  key text NOT NULL,
  title text NOT NULL,
  description text,
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en','ar')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_by uuid REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, key, language)
);

CREATE TABLE mission_templates (
  mission_template_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  key text NOT NULL,
  title text NOT NULL,
  description text,

  mission_type text NOT NULL CHECK (mission_type IN ('digital','physical','physical_task','microlearning_task')),
  completion_mode text NOT NULL CHECK (completion_mode IN ('system_tracked','user_attestation_trusted','manager_approval')),

  -- Points
  points_on_complete int NOT NULL DEFAULT 0,
  points_on_first_attempt_bonus int,
  points_cap_per_user int,

  -- Attestation requirements
  note_required boolean NOT NULL DEFAULT false,
  photo_required boolean NOT NULL DEFAULT false,
  allowed_attachment_types text[] NOT NULL DEFAULT '{}',

  -- Governance
  requires_approval boolean NOT NULL DEFAULT true,

  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_by uuid REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, key)
);

CREATE TABLE mission_steps (
  step_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  mission_template_id uuid NOT NULL REFERENCES mission_templates(mission_template_id) ON DELETE CASCADE,

  step_type text NOT NULL CHECK (step_type IN ('video_asset','article_asset','pdf_asset','quiz','flashcards','attestation')),
  title text NOT NULL,
  asset_id uuid REFERENCES knowledge_assets(asset_id),

  order_index int NOT NULL DEFAULT 0,
  video_watch_threshold numeric(4,3), -- optional override

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE journey_days (
  day_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  journey_id uuid NOT NULL REFERENCES journey_templates(journey_id) ON DELETE CASCADE,
  day_index int NOT NULL, -- 0..N-1 (Day 1 = 0)
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (journey_id, day_index)
);

CREATE TABLE journey_day_missions (
  day_id uuid NOT NULL REFERENCES journey_days(day_id) ON DELETE CASCADE,
  mission_template_id uuid NOT NULL REFERENCES mission_templates(mission_template_id) ON DELETE RESTRICT,
  order_index int NOT NULL DEFAULT 0,
  PRIMARY KEY (day_id, mission_template_id)
);

CREATE TABLE journey_assignments (
  assignment_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  journey_id uuid NOT NULL REFERENCES journey_templates(journey_id) ON DELETE RESTRICT,

  cohort_id uuid REFERENCES cohorts(cohort_id),
  team_id uuid REFERENCES teams(team_id),

  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (cohort_id IS NOT NULL)::int + (team_id IS NOT NULL)::int >= 1
  )
);

-- User mission instances
CREATE TABLE user_missions (
  user_mission_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  mission_template_id uuid NOT NULL REFERENCES mission_templates(mission_template_id) ON DELETE RESTRICT,

  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed','overdue','revoked')),
  completed_at timestamptz,

  completion_source text CHECK (completion_source IN ('system_event','user_attestation','admin_adjustment')),
  review_state text NOT NULL DEFAULT 'not_applicable'
    CHECK (review_state IN ('not_applicable','unreviewed','reviewed_kept','reviewed_revoked')),

  reschedule_count int NOT NULL DEFAULT 0,
  original_due_date date,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_missions_user_due ON user_missions(user_id, due_date);

CREATE TABLE user_mission_steps (
  user_mission_id uuid NOT NULL REFERENCES user_missions(user_mission_id) ON DELETE CASCADE,
  step_id uuid NOT NULL REFERENCES mission_steps(step_id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed')),
  completed_at timestamptz,
  PRIMARY KEY (user_mission_id, step_id)
);

-- Reschedule overrides (audit trail)
CREATE TABLE user_mission_schedule_overrides (
  override_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  user_mission_id uuid NOT NULL REFERENCES user_missions(user_mission_id) ON DELETE CASCADE,
  requested_by_user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

  previous_due_date date,
  new_due_date date NOT NULL,

  reason text,
  status text NOT NULL DEFAULT 'applied' CHECK (status IN ('applied','rejected')),

  created_at timestamptz NOT NULL DEFAULT now()
);

-- Attestation claims (reviewable)
CREATE TABLE task_claims (
  claim_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  user_mission_id uuid NOT NULL REFERENCES user_missions(user_mission_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

  note text,
  evidence_upload_ids uuid[] NOT NULL DEFAULT '{}',

  status text NOT NULL DEFAULT 'unreviewed' CHECK (status IN ('unreviewed','kept','revoked')),
  reviewed_by uuid REFERENCES users(user_id),
  reviewed_at timestamptz,
  revoke_reason text,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_task_claims_status ON task_claims(tenant_id, status);

-- ======================
-- Points ledger (immutable + reversals)
-- ======================
CREATE TABLE points_transactions (
  tx_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

  delta int NOT NULL,
  balance_after int NOT NULL,

  reason_type text NOT NULL CHECK (reason_type IN (
    'mission_complete',
    'knowledge_complete',
    'assessment_complete',
    'claim_revoke',
    'reward_redeem',
    'admin_adjust',
    'reversal'
  )),

  ref_id uuid, -- user_mission_id, asset_id, claim_id, redemption_id, etc.

  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','reversed')),
  reversal_of_tx_id uuid REFERENCES points_transactions(tx_id),

  created_by uuid REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  notes text
);

CREATE INDEX idx_points_tx_user ON points_transactions(user_id, created_at DESC);

-- ======================
-- Leaderboard policy + opt-out
-- ======================
CREATE TABLE leaderboard_policy (
  tenant_id uuid PRIMARY KEY REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  leaderboard_enabled boolean NOT NULL DEFAULT true,

  timeframes_enabled_json jsonb NOT NULL DEFAULT '["weekly","monthly","all_time"]'::jsonb,
  scopes_enabled_json jsonb NOT NULL DEFAULT '["tenant","cohort","team"]'::jsonb,

  privacy_mode text NOT NULL DEFAULT 'first_name_last_initial'
    CHECK (privacy_mode IN ('full_name','first_name_last_initial','nickname_only')),

  allow_user_opt_out boolean NOT NULL DEFAULT true,
  default_scope text NOT NULL DEFAULT 'tenant' CHECK (default_scope IN ('tenant','cohort','team')),
  default_timeframe text NOT NULL DEFAULT 'weekly' CHECK (default_timeframe IN ('weekly','monthly','all_time')),

  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE leaderboard_opt_out (
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  opted_out_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, user_id)
);

-- ======================
-- Rewards store (optional)
-- ======================
CREATE TABLE reward_items (
  reward_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  cost_points int NOT NULL,
  stock_count int,
  published boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reward_redemptions (
  redemption_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  reward_id uuid NOT NULL REFERENCES reward_items(reward_id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  cost_points int NOT NULL,

  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','fulfilled','rejected','cancelled')),
  fulfilled_by uuid REFERENCES users(user_id),
  fulfilled_at timestamptz,
  notes text,

  created_at timestamptz NOT NULL DEFAULT now()
);

-- ======================
-- Self Awareness (monthly attempts; v1/v2…)
-- ======================
CREATE TABLE sa_assessments (
  assessment_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  key text NOT NULL,
  title text NOT NULL,
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en','ar')),
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, key, language)
);

CREATE TABLE sa_instances (
  instance_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  assessment_id uuid NOT NULL REFERENCES sa_assessments(assessment_id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

  version_index int NOT NULL DEFAULT 1, -- v1, v2...
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed')),

  result_json jsonb, -- computed/scored results

  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,

  UNIQUE (assessment_id, user_id, version_index)
);

CREATE INDEX idx_sa_instances_user ON sa_instances(user_id, started_at DESC);

CREATE TABLE sa_responses (
  instance_id uuid NOT NULL REFERENCES sa_instances(instance_id) ON DELETE CASCADE,
  question_key text NOT NULL,
  answer_value jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (instance_id, question_key)
);

-- ======================
-- Governance: approvals, notifications, audit log
-- ======================
CREATE TABLE approval_requests (
  approval_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  target_type text NOT NULL, -- 'knowledge_asset' | 'journey' | 'mission_template' | etc.
  target_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  requested_by uuid REFERENCES users(user_id),
  reviewed_by uuid REFERENCES users(user_id),
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_approvals_status ON approval_requests(tenant_id, status);

CREATE TABLE notifications (
  notification_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

  type text NOT NULL,
  title text NOT NULL,
  body text,
  deep_link text,

  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

CREATE TABLE audit_log (
  audit_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  actor_user_id uuid REFERENCES users(user_id),

  action text NOT NULL, -- e.g. 'CLAIM_REVOKE'
  target_type text,
  target_id uuid,

  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_tenant_time ON audit_log(tenant_id, created_at DESC);


-- ======================
-- Issue reporting (learner)
-- ======================
CREATE TABLE issue_reports (
  issue_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  user_mission_id uuid REFERENCES user_missions(user_mission_id) ON DELETE SET NULL,
  category text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  closed_by uuid REFERENCES users(user_id)
);

CREATE INDEX idx_issue_reports_tenant_status ON issue_reports(tenant_id, status);


-- ======================
-- AI Builder (admin) — minimal job tables
-- ======================
CREATE TABLE ai_builder_jobs (
  job_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created','stt_running','ready_for_inventory','inventory_ready','blueprint_ready','failed')),

  input_upload_ids uuid[] NOT NULL DEFAULT '{}',
  voice_upload_id uuid,
  stt_language text,
  transcript_text text,

  inventory_json jsonb,
  blueprint_json jsonb,

  created_by uuid REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

