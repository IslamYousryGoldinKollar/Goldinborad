# Testing Strategy (QA + Engineering)

This doc defines the minimum test coverage expected for MVP.

---

## 1) Unit tests (backend)

### Policy functions
- Email domain restriction (allowed/blocked)
- Video completion threshold logic (tenant default + per-step override)
- Self Awareness retry window (`sa_retry_days`)
- Reschedule policy:
  - window ±N days
  - max reschedules
  - compliance lock behavior
- Points ledger:
  - append transaction
  - reversal transaction references original
  - balance_after updates correctly

### RBAC
- Permission allow/deny matrix for key endpoints
- Tenant boundary enforcement (cannot access other tenant IDs)

---

## 2) Integration tests (backend)

- Auth login + refresh flow
- Today plan query (correct task ordering)
- Completing system-tracked mission creates points transaction
- Attestation creates:
  - mission completion
  - task_claim record
  - points transaction
- Admin revoke creates reversal points tx + notification + audit log

---

## 3) Frontend component tests

- Shell navigation (mobile bottom nav vs desktop sidebar)
- CMP-TASK-CARD renders correct badges and CTAs
- Modals (attest/reschedule) focus trap + ESC close
- RTL snapshot checks for Arabic (dir=rtl)

---

## 4) E2E tests (Playwright/Cypress)

### Auth
1) Login success (allowed domain)
2) Login blocked (disallowed domain) → shows domain message

### Learner core
3) Open Today Plan → open mission
4) Complete a system-tracked mission (mock step completion) → points earned toast
5) Reschedule within policy → due date changes
6) Reschedule out of policy → shows ERR.MISSION.RESCHEDULE_OUT_OF_POLICY

### Attestation + admin review
7) Attest completion with required note/photo (if configured)
8) Verify points history shows +delta
9) Admin reviews claims list → revoke
10) Learner receives notification + points history shows reversal

### Knowledge
11) Play video asset → emits heartbeats → completes at threshold
12) Mark article/pdf complete

### Self Awareness
13) Start assessment → answer a few questions → submit → appears as v1
14) Retry too soon → shows retry message

### Leaderboard
15) Open leaderboard → change timeframe/scope → list updates

### i18n / RTL
16) Switch language to Arabic → UI flips RTL → navigation still works

---

## 5) Accessibility checks

- Keyboard navigation for all screens
- Visible focus for all interactive elements
- Form labels for inputs
- ARIA for modals/drawers
- Contrast (verify against TOK colors)

---

## 6) ID contract checks

Automated check (CI):
- Every ELM-* listed in CLICKMAP.md exists in the UI routes/components.
- No duplicate `data-testid` on a single screen.
- Snapshot list includes dynamic ID patterns.

