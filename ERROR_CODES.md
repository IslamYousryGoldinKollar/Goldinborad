# Error Codes (ERR.*) — Canonical

Error codes are returned by the API as `ErrorResponse.error_code` and drive predictable UI/QA.

Rules:
- Do not return free-form error strings without an `ERR.*` code.
- Do not overload a code with multiple unrelated meanings.
- Prefer `409` for policy conflicts and `403` for forbidden.

---

## Auth

### ERR.AUTH.DOMAIN_NOT_ALLOWED
- When: user tries to login or accept invite with an email domain not in `tenant_settings.allowed_email_domains`
- HTTP: 403
- UI: show `pub.login.domain_blocked`

### ERR.AUTH.INVALID_CREDENTIALS
- When: email/password incorrect
- HTTP: 401

### ERR.AUTH.USER_DISABLED
- When: user exists but `users.is_active=false`
- HTTP: 403

---

## Missions / Scheduling

### ERR.MISSION.RESCHEDULE_OUT_OF_POLICY
- When: user attempts to reschedule beyond tenant policy (window/max reschedules/compliance lock)
- HTTP: 409
- UI: show toast/modal error

### ERR.MISSION.ALREADY_COMPLETED
- When: mission already completed and cannot be rescheduled/attested again
- HTTP: 409

---

## Self Awareness

### ERR.SA.RETRY_TOO_SOON
- When: user attempts to start a new assessment attempt before `tenant_settings.sa_retry_days`
- HTTP: 409
- UI: show `lrn.sa.retry_in` with template days

---

## Rewards

### ERR.REWARDS.DISABLED
- When: tenant rewards store disabled but user calls rewards endpoints
- HTTP: 403

### ERR.REWARDS.INSUFFICIENT_POINTS
- When: user balance < reward cost
- HTTP: 409
- UI: `lrn.reward.insufficient_points`

### ERR.REWARDS.OUT_OF_STOCK
- When: reward stock_count is 0 / not in stock
- HTTP: 409
- UI: `lrn.reward.out_of_stock`

---

## Generic

### ERR.FORBIDDEN
- When: RBAC denies access
- HTTP: 403
- UI: `global.errors.forbidden`

### ERR.UNAUTHORIZED
- When: token missing/expired
- HTTP: 401
- UI: `global.errors.unauthorized`

### ERR.NETWORK
- Client-only: network failures
- UI: `global.errors.network`

