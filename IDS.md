# Global ID + Token System (Canonical)

This file defines the canonical ID taxonomy used across:
- routing & QA (SCR, REG, CMP, ELM)
- front-end behavior mapping (ACT)
- FE ↔ BE contract mapping (API)
- telemetry (EVT)
- predictable UI errors (ERR)
- rollout controls (FF)
- design system (TOK)
- runtime templates (TPL)
- RBAC (PERM)

> **Rule:** Do not invent IDs ad-hoc. Add them here first.

---

## 0.1 ID prefixes

| Type | Prefix | Example | Used by |
|---|---|---|---|
| Screen | SCR- | SCR-LRN-014 | Routing, QA |
| Region | REG- | REG-LRN-014-TASKLIST | Layout structure |
| Component | CMP- | CMP-TASK-CARD | UI library |
| Element (clickable/input) | ELM- | ELM-LRN-014-TASK-OPEN__<id> | `data-testid` |
| Action | ACT- | ACT-LRN-014-OPEN-TASK | FE behavior |
| API endpoint ID | API- | API-LRN-TODAY-GET | FE ↔ BE mapping |
| Analytics event | EVT- (dot style allowed) | EVT.lrn.today.open_task | Telemetry |
| Error code | ERR- (dot style allowed) | ERR.MISSION.RESCHEDULE_OUT_OF_POLICY | Predictable UI |
| Feature flag | FF- (dot style allowed) | FF.LRN.REWARDS_STORE | Rollout toggles |
| Design token | TOK- (dot style allowed) | TOK.color.primary.600 | Styling |
| Text template token | TPL- | {{TPL.user.first_name}} | Runtime text |
| Permission | PERM- (dot style allowed) | PERM.ADM.USERS.MANAGE | RBAC |

---

## 0.2 Dynamic element IDs (for lists/tables)

For list rows/cards, always suffix with `__<entity_id>`:

- `ELM-LRN-014-TASK-OPEN__<user_mission_id>`
- `ELM-ADM-017-CLAIM-REVOKE__<task_claim_id>`

Also include: `data-entity-id="<uuid>"` for easier debugging.

---

## 0.3 Design tokens (TOK-*)

Implement via CSS variables or Tailwind theme. These tokens are required.

### Colors
- `TOK.color.primary.{50..900}`
- `TOK.color.neutral.{0,50,100,200,300,500,700,900}`
- `TOK.color.success.{50..900}`
- `TOK.color.warning.{50..900}`
- `TOK.color.danger.{50..900}`
- `TOK.color.info.{50..900}`

### Typography
- `TOK.font.family.latin`
- `TOK.font.family.arabic`
- `TOK.font.size.{100,200,300,400,500}`
- `TOK.font.weight.{regular,medium,semibold}`

### Spacing / Radius / Motion
- `TOK.space.{0,1,2,3,4,5,6,8}`
- `TOK.radius.{sm,md,lg}`
- `TOK.motion.duration.{fast,base}`
- `TOK.motion.ease.standard`

### Functional policy tokens
- `TOK.policy.video_completion_threshold.default = 0.80`
- `TOK.policy.sa_retry_days = 30`

---

## 0.4 Core Feature Flags (FF-*)

Required flags + defaults are listed in FLAGS.md. Referenced flags include:

- `FF.LRN.LEADERBOARD` (default ON)
- `FF.LRN.REWARDS_STORE` (default OFF; tenant can enable)
- `FF.LRN.SELF_AWARENESS` (default ON)
- `FF.LRN.MANAGER_DASHBOARD` (default ON)
- `FF.LRN.NAWRAS` (default ON)
- `FF.ADM.AI_BUILDER` (default ON)
- `FF.ADM.AUTO_TRANSCRIBE_VIDEO` (default OFF initially)

---

## 0.5 Error codes (ERR.*)

Error codes must be stable and machine-readable. Guidelines:
- Use dot-separated namespaces: `ERR.AUTH.*`, `ERR.SA.*`, `ERR.MISSION.*`, `ERR.REWARDS.*`
- The API returns `{ error_code, message, details? }`
- UI chooses i18n messaging by `error_code` when possible

Examples:
- `ERR.AUTH.DOMAIN_NOT_ALLOWED`
- `ERR.SA.RETRY_TOO_SOON`
- `ERR.MISSION.RESCHEDULE_OUT_OF_POLICY`
- `ERR.REWARDS.INSUFFICIENT_POINTS`
- `ERR.REWARDS.OUT_OF_STOCK`

---

## 0.6 Template tokens (TPL.*)

Template tokens are runtime placeholders inside i18n strings, e.g.:

- `{{TPL.tenant.name}}`
- `{{TPL.user.first_name}}`
- `{{TPL.points.delta}}`
- `{{TPL.sa.retry_days}}`

Rules:
- Always provide a safe fallback if the value is missing.
- Do not embed HTML inside template tokens.

