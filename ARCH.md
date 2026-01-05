# Architecture & Implementation Guide (Canonical)

This file describes the recommended implementation architecture and repo structure.

> Contracts and registries come first:
> - IDS.md
> - ROUTES.md
> - CLICKMAP.md
> - openapi.yaml
> - schema.sql

---

## 1) System overview

Goldinkollar is a multi-tenant onboarding SaaS with:
- Learner web app (mobile-first responsive)
- Embedded Manager dashboard inside learner app (role-based)
- Admin Console (desktop-first)

Core concepts:
- **Tenant**: organization boundary (domain-restricted auth + tenant settings)
- **Journey**: onboarding program template (days + missions)
- **Mission**: task instance for a user (digital or physical)
- **Knowledge Asset**: video/article/pdf/flashcards
- **Self Awareness**: internal assessments with versioned attempts (v1/v2/…)
- **Points ledger**: immutable transactions + reversals
- **Leaderboard**: computed view over earned points

---

## 2) Recommended stack

### Frontend
- Next.js (App Router), TypeScript
- Tailwind CSS or CSS variables (must implement TOK-* tokens)
- React Hook Form for forms
- TanStack Query for API calls + caching
- i18n (e.g., next-intl) using `messages/en.json` and `messages/ar.json`
- Analytics wrapper (single `track(eventName, payload)`)

### Backend
- NestJS (TypeScript)
- Postgres (schema.sql is the contract)
- OpenAPI 3.1 (openapi.yaml is the contract)
- Job runner (e.g., BullMQ) for:
  - video transcoding
  - transcript generation
  - STT jobs
  - notification jobs
  - AI builder generation

### Storage / indexing (logical)
- Object storage (uploads: video/pdf/audio/images)
- Search index (text; optional embeddings)

---

## 3) Tenancy & security model

### 3.1 Tenant context
- A user belongs to exactly one tenant.
- Tenant context must be derived from:
  - user session/JWT (tenant_id)
  - or subdomain/tenant slug mapping (optional)
- **Never trust tenant_id from client payload**.

### 3.2 Organizational email restriction
- On login and invite accept:
  - Extract email domain (lowercase).
  - Must exist in `tenant_settings.allowed_email_domains`.
  - If not allowed: return 403 with `ERR.AUTH.DOMAIN_NOT_ALLOWED`.

### 3.3 Auth tokens
Recommended:
- Short-lived access token (JWT)
- Refresh token via httpOnly cookie
- `GET /v1/me` returns identity + roles + flags

---

## 4) Feature flags

Feature flags are referenced as `FF.*` in ROUTES.md and CLICKMAP.md.
- Tenant-level toggle (stored in `tenant_settings` or a feature_flags table)
- Default values are defined in FLAGS.md

Never implement conditional UI/behavior without a corresponding `FF.*` entry.

---

## 5) Global ID system

All IDs follow IDS.md:
- Screens: SCR-*
- Regions: REG-*
- Components: CMP-*
- Elements (clickable/input): ELM-*
- Actions: ACT-*
- API endpoints: API-* (operationId in openapi.yaml)
- Events: EVT.*
- Errors: ERR.*
- Feature flags: FF.*
- Design tokens: TOK.*
- Template tokens: TPL.*
- Permissions: PERM.*

This is required for:
- QA automation (selectors)
- analytics
- dev consistency across screens

---

## 6) Suggested repo structure

### Frontend (apps/web)
```
apps/web/
  app/
    (public)/
      login/
      forgot-password/
      reset-password/
      accept-invite/
      maintenance/
    (app)/
      app/
        home/
        today/
        journey/
        missions/[user_mission_id]/
        knowledge/
        knowledge/[asset_id]/
        self-awareness/
        self-awareness/instances/[instance_id]/
        self-awareness/holistic/
        playground/
        career/
        leaderboard/
        points/
        rewards/        # feature-gated
        rewards/[reward_id]/
        rewards/my/
        profile/
        settings/
        language/
        notifications/
        search/
  components/
    shells/
    shared/
    learner/
    admin/
  lib/
    api/
    auth/
    flags/
    analytics/
    i18n/
  messages/
    en.json
    ar.json
```

### Backend (apps/api)
```
apps/api/
  src/
    modules/
      auth/
      me/
      learner/
        today-plan/
        missions/
        knowledge/
        points/
        leaderboard/
        rewards/
        self-awareness/
      manager/
      admin/
        users/
        cohorts/
        journeys/
        knowledge/
        ai-builder/
        scheduling/
        gamification/
        reviews/
        audit/
    common/
      rbac/
      tenancy/
      errors/
      dto/
      analytics/
  openapi/
    openapi.yaml  # generated or source-of-truth depending on workflow
```

---

## 7) UI shells (responsive)

### 7.1 Learner shell (CMP-LRN-SHELL)
- Mobile (<768px): top bar + bottom nav
- Desktop (≥768px): left sidebar + top bar

Common global elements:
- toast, modal, drawer
- offline banner
- global actions: search, notifications, points, language, Nawras FAB (if enabled)

### 7.2 Admin shell (CMP-ADM-SHELL)
- Desktop-first
- left nav, tenant switcher, table layouts
- filters + kebab per row

---

## 8) Data integrity (points, claims, audit)

- **Points are immutable**: do not update/delete points rows.
- Reversal = insert new transaction with negative delta + reference original transaction id.
- Any admin action that changes learner-visible state should write:
  - audit_log row
  - notification row (if user-facing)

---

## 9) Testing guidance

- Use `data-testid` based on ELM IDs for E2E testing (Playwright/Cypress).
- Add contract tests validating:
  - OpenAPI response shapes match DTOs
  - schema constraints align with service behavior
- Add policy unit tests:
  - allowed email domains
  - reschedule policy windows + max reschedules
  - SA retry days
  - video threshold completion

