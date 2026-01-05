# Implementation Plan (Sprint-by-Sprint)

This plan assumes a small team building an MVP with the locked decisions in SPEC.md.

Principles:
- Contract-first (OpenAPI + schema + registries)
- Feature flags for optional modules
- Ship learner core end-to-end early, then admin tooling

---

## Phase 0 — Repo + contracts (Sprint 0)

Deliverables:
- Monorepo structure (web + api)
- CI: lint, typecheck, unit tests
- DB migrations pipeline
- Seed data (tenant + admin + learner)
- Import this context pack into repo root (docs/)

Work:
- Implement tenancy middleware (tenant_id from token)
- Implement RBAC middleware (permissions from DB)
- Implement error system with ERR.* codes
- Implement i18n wiring (en/ar, dir=rtl)

---

## Phase 1 — Auth + shells (Sprint 1)

Learner:
- SCR-PUB-001 login (domain restriction)
- SCR-PUB-002 forgot password (stub email provider ok)
- SCR-PUB-003 reset password
- CMP-LRN-SHELL responsive + nav (feature-gated tabs)

Backend:
- API-AUTH-LOGIN, API-AUTH-REFRESH, /v1/me
- Password reset tokens table (if needed)

QA:
- E2E: login happy path + domain blocked

---

## Phase 2 — Today Plan + Missions (Sprint 2)

Learner:
- SCR-LRN-001 home widgets (Today card)
- SCR-LRN-014 Today Plan list (CMP-TASK-CARD)
- SCR-LRN-003 Mission detail (system-tracked + attestation modes)
- SCR-LRN-027 reschedule modal (policy checks)

Backend:
- /v1/today_plan
- /v1/user_missions/{id} (detail)
- /v1/user_missions/{id}/reschedule
- /v1/user_missions/{id}/complete (system tracked)

Data:
- journey templates + mission templates + assignment seeding
- user_missions generation (scheduler)

---

## Phase 3 — Attestation + claims review (Sprint 3)

Learner:
- SCR-LRN-025 attestation modal (note/photo evidence)
- Points toast success + points history baseline

Admin:
- SCR-ADM-017 claims review list + drawer + keep/revoke
- In-app notification on revoke

Backend:
- /v1/uploads (signed upload)
- /v1/user_missions/{id}/attest_complete
- /v1/admin/task_claims list/detail/keep/revoke
- Points ledger + reversal behavior

QA:
- E2E: attest → points awarded → admin revoke → points reversed + notification

---

## Phase 4 — Knowledge Base (Sprint 4)

Learner:
- SCR-LRN-006 knowledge list + categories + search scope
- SCR-LRN-007 asset detail (video player heartbeat + complete for articles/pdfs)

Admin:
- SCR-ADM-008 knowledge manager list
- SCR-ADM-009 asset editor (upload video + metadata + publish)

Backend:
- /v1/knowledge_assets list/detail/progress/complete
- Admin CRUD for knowledge assets
- Optional: transcript generation flag (FF.ADM.AUTO_TRANSCRIBE_VIDEO)

---

## Phase 5 — Self Awareness (Sprint 5)

Learner:
- SCR-LRN-010 hub list + attempts
- SCR-LRN-011 runner (Likert + choice)
- SCR-LRN-013 holistic (latest by default, switch versions)

Admin (minimal):
- templates seeded in DB (sa_assessments)

Backend:
- /v1/self_awareness/* endpoints (start, answer, submit, list attempts)
- Enforce retry policy (ERR.SA.RETRY_TOO_SOON)

Privacy:
- sharing settings stored and enforced

---

## Phase 6 — Leaderboard + Gamification settings (Sprint 6)

Learner:
- SCR-LRN-024 leaderboard (timeframe + scope)
- SCR-LRN-026 points history (filtering)

Admin:
- SCR-ADM-011 gamification settings (leaderboard policy, defaults)
- opt-out support if enabled

Backend:
- /v1/leaderboard
- /v1/leaderboard/opt_out,opt_in
- Admin policy endpoints

---

## Phase 7 — Manager dashboard (Sprint 7)

Learner:
- Manager “Team” tab
- SCR-MGR-001 list + member detail
- SCR-MGR-004 nudge modal

Backend:
- /v1/manager/team
- /v1/manager/team/{user_id}
- /v1/manager/nudges

---

## Phase 8 — Rewards store (Optional; gated) (Sprint 8)

Learner:
- SCR-LRN-019 list + detail + redeem + my redemptions

Admin:
- rewards CRUD + redemption processing screens

Backend:
- /v1/rewards*
- atomic redemption transaction

---

## Phase 9 — AI Builder (Admin; gated) (Sprint 9+)

Admin:
- SCR-ADM-014 input (pdf upload + text + voice recording)
- STT jobs + transcript editor
- SCR-ADM-015 inventory view
- SCR-ADM-016 blueprint view

Backend/workers:
- STT jobs pipeline
- blueprint generation jobs
- inventory citations to sources

---

## Done definition (MVP)

All acceptance criteria in SPEC.md §11 satisfied +:
- Contract tests passing (OpenAPI + schema)
- E2E tests for core flows (login, today, complete, attest, revoke, KB)
- Admin audit log captures critical actions

