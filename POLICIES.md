# Key Policies (Canonical)

These policies remove ambiguity for engineering and QA.

---

## 1) Organizational email restriction (Auth)

On login and invite accept:
1) Extract domain from email (lowercase).
2) Domain must exist in `tenant_settings.allowed_email_domains`.
3) If not allowed: return **403** with `ERR.AUTH.DOMAIN_NOT_ALLOWED`.

Notes:
- This is enforced server-side.
- Client-side may pre-check to improve UX, but server is source of truth.

---

## 2) Video watch completion (system-tracked)

Backend calculates `watched_percent` from progress events.

A mission step of type `video_asset` is completed when:
- `watched_percent >= tenant_settings.video_completion_threshold` (default 0.80)
  - OR a step-specific override threshold exists (mission_steps.video_watch_threshold)

Once a step is completed:
- mark `user_mission_steps.status = completed`
- when all steps completed: enable mission complete CTA (`ELM-LRN-003-MARK-COMPLETE`)

---

## 3) Self Awareness monthly attempts (v1, v2, v3…)

Rule:
- user can start a new attempt only if the last completed_at is at least `tenant_settings.sa_retry_days` ago (default 30 days).

Behavior:
- New attempt creates `sa_instances.version_index = previous + 1`
- Holistic profile uses latest completed attempt by default
- Learner UI has **no delete button**; admin retains data

Errors:
- If too soon: `ERR.SA.RETRY_TOO_SOON`

---

## 4) Learner rescheduling (within tenant policy)

Defaults (tenant-configurable):
- Learner can move due date within ±3 days
- Max 2 reschedules per mission
- Compliance missions cannot be moved beyond due unless tenant allows

Each reschedule creates an audit trail row:
- user_mission reschedule_count increments
- create schedule override record (see schema.sql)

Errors:
- Out of policy: `ERR.MISSION.RESCHEDULE_OUT_OF_POLICY`

---

## 5) Trust-first attestation (self-claim) + admin undo

When user submits attestation:
- mission marked completed immediately (`completion_source = user_attestation`)
- points granted immediately (new ledger transaction)
- claim record created (`task_claims.status = unreviewed`)

Admin review outcomes:
- Keep: mark reviewed/kept, lock claim
- Revoke: reverse points via **new negative points transaction**, notify learner, update claim status

Undo (revoke) is never a deletion.

---

## 6) Rewards store gating (optional)

Rewards store is visible only if:
- `FF.LRN.REWARDS_STORE` is ON AND
- `tenant_settings.rewards_store_enabled = true`

If disabled:
- Hide nav entry
- Direct route shows friendly disabled state (`lrn.rewards.disabled`), not 404

Redemption:
- Must be atomic:
  - check stock + points
  - decrement stock
  - create redemption
  - create points transaction with `delta = -cost_points`

Errors:
- Insufficient points: `ERR.REWARDS.INSUFFICIENT_POINTS`
- Out of stock: `ERR.REWARDS.OUT_OF_STOCK`

---

## 7) Leaderboard computation

Leaderboard is computed over points ledger transactions where:
- status = active
- timeframe filter (weekly/monthly/all-time)
- scope filter (tenant/cohort/team)

Policy:
- Leaderboard uses **earned points** (positive deltas) by timeframe, not points balance.
- Display names obey tenant privacy mode.

---

## 8) i18n + RTL behavior

- Arabic UI is RTL.
- Layout must flip properly (sidebar, chevrons, progress).
- Store user language on profile (`users.language`).
- Content fallback rules are in SPEC.md.

