# Feature Flags (FF.*) — Canonical

Feature flags control optional features and rollout.
They are evaluated at runtime (tenant + user context) and should be readable by both FE and BE.

> **Rule:** Any optional feature MUST have a feature flag, even if default ON.

---

## Required flags and defaults

| Flag | Default | Scope | Notes |
|---|---:|---|---|
| FF.LRN.LEADERBOARD | ON | Tenant | Learner leaderboard screens + APIs |
| FF.LRN.REWARDS_STORE | OFF | Tenant | Rewards tab + store screens + APIs (also requires tenant_settings.rewards_store_enabled=true) |
| FF.LRN.SELF_AWARENESS | ON | Tenant | Self Awareness hub/runner/holistic |
| FF.LRN.MANAGER_DASHBOARD | ON | Tenant | Manager “Team” tab inside learner app |
| FF.LRN.NAWRAS | ON | Tenant | Learner Nawras overlay / FAB |
| FF.ADM.AI_BUILDER | ON | Tenant | Admin AI Builder screens |
| FF.ADM.AUTO_TRANSCRIBE_VIDEO | OFF | Tenant | Auto-transcribe uploaded videos (background job) |

---

## Storage recommendation

Option A (simple): store flags in `tenant_settings` columns (preferred for MVP).

Option B (flexible): `feature_flags` table:
- tenant_id
- flag_key (FF.*)
- enabled boolean
- updated_at

---

## Evaluation order (recommended)

When checking a flag:
1) explicit tenant override (DB)
2) default from this file
3) fallback: OFF

---

## Implementation rules

- FE should hide nav entries when flag is OFF.
- BE must still enforce flag gating (return 404/403 or a typed error).
- For feature-off routes, prefer a **friendly disabled state** over a hard 404:
  - Rewards store: show `lrn.rewards.disabled`

