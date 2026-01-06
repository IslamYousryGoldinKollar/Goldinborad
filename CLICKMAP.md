# Element + Action Registry (Click‑Map) — Dev‑Ready

This is the canonical **UI click-map**: every clickable/input element → action → behavior → API → analytics.

Conventions:
- Every interactive UI element must have `data-testid` equal to its `ELM-*` ID.
- Dynamic list items must suffix `__<entity_id>`.
- Actions are `ACT-*` and should be implemented as functions in the screen controller/container.
- API mappings use `API-*` operation IDs defined in openapi.yaml.
- Analytics events use `EVT.*` names from ANALYTICS.md.

---

## Global (shared across shells)

| Element ID | UI | Action ID | Behavior |
|---|---|---|---|
| ELM-GLOBAL-TOPBAR-SEARCH | search icon/input | ACT-GLOBAL-OPEN-SEARCH | Open SCR-LRN-005 |
| ELM-GLOBAL-TOPBAR-NOTIFS | notifications icon | ACT-GLOBAL-OPEN-NOTIFS | Open SCR-LRN-004 |
| ELM-GLOBAL-TOPBAR-POINTS | points chip | ACT-GLOBAL-OPEN-POINTS | Open SCR-LRN-026 |
| ELM-GLOBAL-TOPBAR-LANG | language control | ACT-GLOBAL-OPEN-LANG | Open SCR-LRN-022 |
| ELM-GLOBAL-NAWRAS-FAB | floating action button | ACT-GLOBAL-OPEN-NAWRAS | Open SCR-LRN-030 (FF.LRN.NAWRAS) |

### Learner shell navigation (CMP-BOTTOMNAV / CMP-SIDENAV)

| Element ID | Action ID | Behavior |
|---|---|---|
| ELM-LRN-NAV-HOME | ACT-LRN-NAV-HOME | Route → SCR-LRN-001 (/app/home) |
| ELM-LRN-NAV-JOURNEY | ACT-LRN-NAV-JOURNEY | Route → SCR-LRN-002 (/app/journey) |
| ELM-LRN-NAV-PLAYGROUND | ACT-LRN-NAV-PLAYGROUND | Route → SCR-LRN-015 (/app/playground) |
| ELM-LRN-NAV-CAREER | ACT-LRN-NAV-CAREER | Route → SCR-LRN-018 (/app/career) |
| ELM-LRN-NAV-PROFILE | ACT-LRN-NAV-PROFILE | Route → SCR-LRN-020 (/app/profile) |

### Admin shell navigation (CMP-ADM-SHELL)

| Element ID | Action ID | Behavior |
|---|---|---|
| ELM-ADM-NAV-DASHBOARD | ACT-ADM-NAV-DASHBOARD | Route → SCR-ADM-001 (/admin/dashboard) |
| ELM-ADM-NAV-USERS | ACT-ADM-NAV-USERS | Route → SCR-ADM-002 (/admin/users) |
| ELM-ADM-NAV-COHORTS | ACT-ADM-NAV-COHORTS | Route → SCR-ADM-003 (/admin/cohorts) |
| ELM-ADM-NAV-JOURNEYS | ACT-ADM-NAV-JOURNEYS | Route → SCR-ADM-004 (/admin/journeys) |
| ELM-ADM-NAV-APPROVALS | ACT-ADM-NAV-APPROVALS | Route → SCR-ADM-007 (/admin/approvals) |
| ELM-ADM-NAV-KNOWLEDGE | ACT-ADM-NAV-KNOWLEDGE | Route → SCR-ADM-008 (/admin/knowledge) |
| ELM-ADM-NAV-SCHEDULING | ACT-ADM-NAV-SCHEDULING | Route → SCR-ADM-010 (/admin/scheduling) |
| ELM-ADM-NAV-GAMIFICATION | ACT-ADM-NAV-GAMIFICATION | Route → SCR-ADM-011 (/admin/gamification) |
| ELM-ADM-NAV-REWARDS | ACT-ADM-NAV-REWARDS | Route → SCR-ADM-012 (/admin/rewards) |
| ELM-ADM-NAV-AI-INPUT | ACT-ADM-NAV-AI-INPUT | Route → SCR-ADM-014 (/admin/ai-builder/input) |
| ELM-ADM-NAV-CLAIMS | ACT-ADM-NAV-CLAIMS | Route → SCR-ADM-017 (/admin/reviews/task-claims) |
| ELM-ADM-NAV-SETTINGS-LANG | ACT-ADM-NAV-SETTINGS-LANG | Route → SCR-ADM-019 (/admin/settings/language) |
| ELM-ADM-NAV-SETTINGS-SECURITY | ACT-ADM-NAV-SETTINGS-SECURITY | Route → SCR-ADM-020 (/admin/settings/security) |
| ELM-ADM-NAV-AUDIT | ACT-ADM-NAV-AUDIT | Route → SCR-ADM-021 (/admin/audit) |

---

## 5.1 SCR-PUB-001 — Login (/login)

Regions:
- REG-PUB-001-FORM
- REG-PUB-001-FOOTER

Elements → Actions:

| Element ID | UI | Action ID | Behavior / API |
|---|---|---|---|
| ELM-PUB-001-EMAIL | email input | ACT-PUB-001-SET-EMAIL | Validate email format live |
| ELM-PUB-001-PASSWORD | password input | ACT-PUB-001-SET-PASSWORD | Show/hide toggle supported |
| ELM-PUB-001-SHOWPASS | eye icon | ACT-PUB-001-TOGGLE-PW | Toggle password visibility |
| ELM-PUB-001-SUBMIT | “Log in” | ACT-PUB-001-LOGIN | Call **API-AUTH-LOGIN**; if domain not allowed → show `ERR.AUTH.DOMAIN_NOT_ALLOWED` |
| ELM-PUB-001-FORGOT | “Forgot password?” | ACT-PUB-001-GOTO-FORGOT | Navigate to SCR-PUB-002 |
| ELM-PUB-001-LANG | language dropdown | ACT-PUB-001-SET-LANG | Switch UI LTR/RTL + persist selection |

Analytics:
- EVT.pub.login.submit
- EVT.pub.login.domain_blocked (if blocked)

---

## 5.2 SCR-LRN-001 — Home (/app/home)

Primary goal: show Today Plan + continue + quick entry points.

| Element ID | Action ID | Navigation / API |
|---|---|---|
| ELM-LRN-001-TODAY-OPEN | ACT-LRN-001-OPEN-TODAY | Route → /app/today; call **API-LRN-TODAY-GET** |
| ELM-LRN-001-CONTINUE-OPEN | ACT-LRN-001-OPEN-CURRENT | Route → mission detail; call **API-LRN-CONTINUE-GET** (optional) |
| ELM-LRN-001-LEADERBOARD-OPEN | ACT-LRN-001-OPEN-LB | /app/leaderboard (FF.LRN.LEADERBOARD) |
| ELM-LRN-001-KNOWLEDGE-OPEN | ACT-LRN-001-OPEN-KB | /app/knowledge |
| ELM-LRN-001-SA-OPEN | ACT-LRN-001-OPEN-SA | /app/self-awareness (FF.LRN.SELF_AWARENESS) |
| ELM-LRN-001-REWARDS-OPEN | ACT-LRN-001-OPEN-REWARDS | /app/rewards (FF.LRN.REWARDS_STORE + tenant enabled) |
| ELM-LRN-001-TEAM-OPEN | ACT-MGR-001-OPEN-TEAM | /app/team (manager only, FF.LRN.MANAGER_DASHBOARD) |

Analytics:
- EVT.lrn.home.open_today
- EVT.lrn.home.open_leaderboard (if used)

---

## 5.3 SCR-LRN-014 — Today Plan (/app/today)

Task list uses CMP-TASK-CARD.

| Element ID | Action ID | Result / API |
|---|---|---|
| ELM-LRN-014-TASK-OPEN__<um_id> | ACT-LRN-014-OPEN-TASK | Route → /app/missions/<um_id> |
| ELM-LRN-014-TASK-RESCHEDULE__<um_id> | ACT-LRN-014-RESCHEDULE | Open SCR-LRN-027 modal |
| ELM-LRN-014-TASK-CLAIMDONE__<um_id> | ACT-LRN-014-ATTEST | Open SCR-LRN-025 modal (attestation) |
| ELM-LRN-014-TASK-MORE__<um_id> | ACT-LRN-014-MORE | Open actions sheet: “Details”, “Report issue” |
| ELM-LRN-014-REFRESH | ACT-LRN-014-REFRESH | Re-call **API-LRN-TODAY-GET** |

Analytics:
- EVT.lrn.today.open_task
- EVT.today_plan.reschedule_apply (after applying)
- EVT.task.attestation_start (when attestation started)

---

## 5.4 SCR-LRN-003 — Mission Detail (/app/missions/:user_mission_id)

| Element ID | Action ID | API | Notes |
|---|---|---|---|
| ELM-LRN-003-RESCHEDULE | ACT-LRN-003-RESCHEDULE | — | Opens SCR-LRN-027 |
| ELM-LRN-003-STEP-OPEN__<step_id> | ACT-LRN-003-OPEN-STEP | API-LRN-STEP-START (optional) | Opens video/article/quiz step |
| ELM-LRN-003-MARK-COMPLETE | ACT-LRN-003-COMPLETE | **API-LRN-UM-COMPLETE** | Only if all steps complete |
| ELM-LRN-003-ATTEST-DONE | ACT-LRN-003-ATTEST | — | Opens SCR-LRN-025 (trust-based tasks) |
| ELM-LRN-003-REPORT | ACT-LRN-003-REPORT | **API-LRN-ISSUE-REPORT** (optional) | Opens report modal |
| ELM-LRN-003-SHARE | ACT-LRN-003-SHARE | — | Web share if supported |

### System-tracked video rule
A mission step of type `video_asset` is complete when:  
`watched_percent >= tenant.video_completion_threshold` (default 0.80)  
Player emits progress heartbeats → **API-LRN-ASSET-PROGRESS**

Analytics:
- EVT.task.open
- EVT.task.reschedule_open
- EVT.task.attestation_open
- EVT.task.complete (system)
- EVT.task.report_issue

---

## 5.5 SCR-LRN-025 — Attestation Modal (trust-first completion)

| Element ID | Action ID | API | Result |
|---|---|---|---|
| ELM-LRN-025-CHECK-CONFIRM | ACT-LRN-025-TOGGLE | — | Required to enable submit |
| ELM-LRN-025-NOTE | ACT-LRN-025-SET-NOTE | — | Required if mission says so |
| ELM-LRN-025-UPLOAD-PHOTO | ACT-LRN-025-UPLOAD | **API-UPLOADS-CREATE** | Optional/required by mission |
| ELM-LRN-025-SUBMIT | ACT-LRN-025-SUBMIT | **API-LRN-UM-ATTEST** | Completes + awards points immediately + creates claim record |
| ELM-LRN-025-CANCEL | ACT-LRN-025-CANCEL | — | Close |

Admin later can Keep or Revoke claim; revoking creates negative points tx + notification.

Analytics:
- EVT.task.attestation_open
- EVT.task.attestation_submit
- EVT.task.attestation_cancel

---

## 5.6 SCR-LRN-027 — Reschedule Modal

| Element ID | Action ID | API | Result |
|---|---|---|---|
| ELM-LRN-027-DATE | ACT-LRN-027-SET-DATE | — | Select new date |
| ELM-LRN-027-REASON | ACT-LRN-027-SET-REASON | — | Optional |
| ELM-LRN-027-APPLY | ACT-LRN-027-APPLY | **API-LRN-UM-RESCHEDULE** | Applies if within policy; else show `ERR.MISSION.RESCHEDULE_OUT_OF_POLICY` |
| ELM-LRN-027-CANCEL | ACT-LRN-027-CANCEL | — | Close |

Analytics:
- EVT.today_plan.reschedule_apply (on success)
- EVT.task.reschedule_open (when opened)

---

## 5.7 SCR-LRN-006 — Knowledge Library (/app/knowledge)

| Element ID | Action ID | Result |
|---|---|---|
| ELM-LRN-006-SEARCH | ACT-LRN-006-OPEN-SEARCH | Route → /app/search?scope=knowledge |
| ELM-LRN-006-CAT-SELECT__<cat_id> | ACT-LRN-006-FILTER-CAT | Reload list |
| ELM-LRN-006-ASSET-OPEN__<asset_id> | ACT-LRN-006-OPEN-ASSET | Route → /app/knowledge/<asset_id> |

Analytics:
- EVT.lrn.knowledge.open_asset

---

## 5.8 SCR-LRN-007 — Knowledge Asset Detail (/app/knowledge/:asset_id)

| Element ID | Action ID | API | Notes |
|---|---|---|---|
| ELM-LRN-007-PLAY | ACT-LRN-007-PLAY | — | Starts player |
| ELM-LRN-007-VIDEO-HEARTBEAT | ACT-LRN-007-PROGRESS | **API-LRN-ASSET-PROGRESS** | Auto every 10–15s + on pause/end |
| ELM-LRN-007-MARK-COMPLETE | ACT-LRN-007-COMPLETE | **API-LRN-ASSET-COMPLETE** | For articles/pdfs |
| ELM-LRN-007-LANG-SWITCH | ACT-LRN-007-SWITCH-LANG | **API-LRN-ASSET-DETAIL** | Switches language variant |
| ELM-LRN-007-DOWNLOAD | ACT-LRN-007-DOWNLOAD | **API-LRN-ASSET-DOWNLOAD** (signed URL) | Only if allowed |

Analytics:
- EVT.lrn.asset.play
- EVT.lrn.asset.complete

---

## 5.9 SCR-LRN-010/011/013 — Self Awareness (monthly attempts, v1/v2…)

### Hub (SCR-LRN-010)
| Element ID | Action ID | Result |
|---|---|---|
| ELM-LRN-010-ASSESSMENT-START__<assessment_id> | ACT-LRN-010-START | Call **API-LRN-SA-START**; if last attempt < retry window → `ERR.SA.RETRY_TOO_SOON` |
| ELM-LRN-010-ATTEMPT-OPEN__<instance_id> | ACT-LRN-010-OPEN-ATTEMPT | Open runner (read-only if completed) |
| ELM-LRN-010-HOLISTIC-OPEN | ACT-LRN-010-OPEN-HOLISTIC | Route → /app/self-awareness/holistic |
| ELM-LRN-010-PRIVACY | ACT-LRN-010-OPEN-PRIVACY | Route → /app/settings#self-awareness |

### Runner (SCR-LRN-011)
- Next / Back / Save & exit / Submit

### Holistic (SCR-LRN-013)
- Shows “Based on: v2 (Dec 2025)” and lets user switch versions
- Latest used by default

Analytics:
- EVT.lrn.sa.start
- EVT.lrn.sa.submit
- EVT.lrn.sa.open_holistic

---

## 5.10 SCR-LRN-024 — Leaderboard (/app/leaderboard)

| Element ID | Action ID | API | Notes |
|---|---|---|---|
| ELM-LRN-024-TIMEFRAME | ACT-LRN-024-CHANGE-TIMEFRAME | **API-LRN-LEADERBOARD-GET** | Weekly/Monthly/All-time |
| ELM-LRN-024-SCOPE | ACT-LRN-024-CHANGE-SCOPE | **API-LRN-LEADERBOARD-GET** | Team/Cohort/Tenant |
| ELM-LRN-024-OPEN-POINTS | ACT-LRN-024-OPEN-POINTS | — | Navigate to /app/points |
| ELM-LRN-024-OPTOUT | ACT-LRN-024-OPTOUT | **API-LRN-LB-OPTOUT** | Only if allowed |
| ELM-LRN-024-OPTIN | ACT-LRN-024-OPTIN | **API-LRN-LB-OPTIN** | If previously opted out |

Analytics:
- EVT.leaderboard.open
- EVT.leaderboard.timeframe_change
- EVT.leaderboard.scope_change
- EVT.leaderboard.opt_out
- EVT.leaderboard.opt_in

---

## 5.11 SCR-LRN-019 — Rewards Store (optional)

Visible only if:
- `FF.LRN.REWARDS_STORE = ON` AND
- `tenant_settings.rewards_store_enabled = true`

Key clickable areas:

| Element ID | Action | API | Notes |
|---|---|---|---|
| ELM-LRN-019-REWARD-OPEN__<reward_id> | ACT-LRN-019-OPEN-REWARD | **API-LRN-REWARDS-DETAIL** | Open detail |
| ELM-LRN-019A-REDEEM | ACT-LRN-019A-REDEEM | **API-LRN-REWARDS-REDEEM** | Validate balance + stock |
| ELM-LRN-019A-CONFIRM | ACT-LRN-019A-CONFIRM | **API-LRN-REWARDS-REDEEM** | Show final balance |
| ELM-LRN-019B-OPEN__<redemption_id> | ACT-LRN-019B-OPEN | **API-LRN-REWARDS-REDEMPTION-DETAIL** | Receipt view |

Points behavior:
- Redemption creates points transaction with `delta = -cost_points`
- Leaderboard uses **earned points** by timeframe (positive deltas), not balance

Analytics:
- EVT.lrn.rewards.open_reward
- EVT.lrn.rewards.redeem

---

## 5.12 SCR-MGR-001 — Manager Team Dashboard (/app/team)

Manager sees only direct/assigned team users.

| Element ID | Action | API |
|---|---|---|
| ELM-MGR-001-MEMBER-OPEN__<user_id> | ACT-MGR-001-OPEN-MEMBER | **API-MGR-TEAM-MEMBER-DETAIL** |
| ELM-MGR-001-NUDGE__<user_id> | ACT-MGR-001-OPEN-NUDGE | Opens SCR-MGR-004 |
| ELM-MGR-001-FILTER | ACT-MGR-001-FILTER | Reload list |
| ELM-MGR-001-REPORTS | ACT-MGR-001-OPEN-REPORTS | /app/team/reports |

### Nudge modal (SCR-MGR-004)
- No sensitive Self Awareness data.

| Element ID | Action | API |
|---|---|---|
| ELM-MGR-004-MESSAGE | ACT-MGR-004-SET-MESSAGE | — |
| ELM-MGR-004-SEND | ACT-MGR-004-SEND | **API-MGR-NUDGE-CREATE** (POST /v1/manager/nudges) |
| ELM-MGR-004-CANCEL | ACT-MGR-004-CANCEL | — |

Analytics:
- EVT.mgr.nudge.send

---

## 5.13 Admin — Task Claims Review (SCR-ADM-017)

| Element ID | Action | API | Result |
|---|---|---|---|
| ELM-ADM-017-CLAIM-OPEN__<claim_id> | ACT-ADM-017-OPEN | **API-ADM-CLAIMS-DETAIL** | Open evidence drawer |
| ELM-ADM-017-CLAIM-KEEP__<claim_id> | ACT-ADM-017-KEEP | **API-ADM-CLAIM-KEEP** | Lock as reviewed |
| ELM-ADM-017-CLAIM-REVOKE__<claim_id> | ACT-ADM-017-REVOKE | **API-ADM-CLAIM-REVOKE** | Reverse points + notify learner |
| ELM-ADM-017-FILTERS | ACT-ADM-017-FILTER | **API-ADM-CLAIMS-LIST** | Server-side filtering |

Analytics:
- EVT.admin.task_claim.keep
- EVT.admin.task_claim.revoke
- EVT.admin.points.adjust (if used)

