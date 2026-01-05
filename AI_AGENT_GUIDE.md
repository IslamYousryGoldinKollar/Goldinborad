# AI Agent Build Guide (Goldinkollar)

This guide is written for an AI agent (or a new engineer) to build Goldinkollar consistently.

## 0) Mission

Implement Goldinkollar as a multi-tenant, bilingual (EN/AR) onboarding SaaS with:
- Learner responsive web app
- Embedded Manager dashboard inside learner app
- Admin console for building/managing content and governance

**Hard constraints**: SPEC.md “Decisions locked”.

---

## 1) Where truth lives

When building, consult files in this order:

1) **SPEC.md** — product behavior + locked decisions
2) **IDS.md** — ID taxonomy + token rules
3) **ROUTES.md** — route/screen registry (what screens exist)
4) **CLICKMAP.md** — element/action registry (what each click does)
5) **RBAC.md** — roles/permissions (who can see/do what)
6) **POLICIES.md** — domain/video/SA retry/points/rewards/leaderboard rules
7) **openapi.yaml** — API contract (operationIds must match CLICKMAP)
8) **schema.sql** — DB schema contract
9) **messages/en.json, messages/ar.json** — all copy

> If anything conflicts, update the registries/contracts first.

---

## 2) Required implementation conventions

### 2.1 Stable IDs everywhere
- Screens: `SCR-*`
- Clickable/input elements: `ELM-*`
- Actions: `ACT-*`
- API operation IDs: `API-*`
- Analytics events: `EVT.*`
- Error codes: `ERR.*`

### 2.2 `data-testid` is mandatory
Every clickable / input element:
- `data-testid="<ELM-ID>"`
Dynamic list items:
- `data-testid="...__<entity_id>"`
Also include `data-entity-id="<uuid>"` where applicable.

### 2.3 i18n only
- No hard-coded UI text. Use i18n keys from `messages/*`.
- Arabic must render RTL correctly.

### 2.4 Error handling (typed)
All errors:
- API returns `ErrorResponse { error_code, message, details? }`
- UI maps `error_code` to a user message (i18n) when possible.

### 2.5 Points ledger is immutable
- Never delete points rows.
- Undo/revoke is a reversal transaction + audit log + notification.

---

## 3) Build order (recommended)

### Step A — Contracts and scaffolding
- Generate types from openapi.yaml (FE + BE).
- Create DB migrations from schema.sql.
- Create common libs:
  - tenancy middleware
  - RBAC middleware
  - feature flag evaluation
  - error code mapping
  - analytics tracking wrapper

### Step B — Learner core loop
Goal: user logs in → sees Today Plan → completes a mission → earns points.

Implement screens:
- SCR-PUB-001 login
- SCR-LRN-001 home
- SCR-LRN-014 today plan
- SCR-LRN-003 mission detail
- SCR-LRN-026 points history

Implement endpoints:
- API-AUTH-LOGIN, API-AUTH-REFRESH
- API-ME-GET, API-ME-PATCH
- API-LRN-TODAY-GET
- API-LRN-UM-GET, API-LRN-UM-COMPLETE
- API-LRN-POINTS-HISTORY

### Step C — Trust-first attestation + admin review
Implement:
- SCR-LRN-025 attestation modal
- SCR-ADM-017 task claims review (keep/revoke)

Endpoints:
- API-UPLOADS-CREATE
- API-LRN-UM-ATTEST
- API-ADM-CLAIMS-* keep/revoke/list/detail

### Step D — Knowledge + Self Awareness + Leaderboard
Then add:
- Knowledge (SCR-LRN-006/007 + admin KB screens)
- Self Awareness (SCR-LRN-010/011/013)
- Leaderboard (SCR-LRN-024 + admin policy)

---

## 4) Checklists (definition of done)

### For every screen
- [ ] Screen is listed in ROUTES.md
- [ ] All interactive elements listed in CLICKMAP.md exist and have correct `data-testid`
- [ ] i18n keys exist in both en.json and ar.json
- [ ] Feature flag gating matches ROUTES.md
- [ ] Analytics events emitted match ANALYTICS.md
- [ ] Permission gating enforced server-side (and hidden client-side)

### For every endpoint
- [ ] operationId matches `API-*` in CLICKMAP.md
- [ ] Response shapes match OpenAPI
- [ ] Tenant scoping enforced
- [ ] Correct error_code on failure

### For every policy
- [ ] Covered by unit tests
- [ ] Covered by at least one E2E test if user-facing

---

## 5) “Don’t do this”

- Don’t create new IDs in code without updating IDS.md/ROUTES.md/CLICKMAP.md.
- Don’t ship hard-coded text.
- Don’t rely on client-only RBAC.
- Don’t delete ledger data (points, claims, SA attempts).
- Don’t store tenant_id on the client and trust it.

