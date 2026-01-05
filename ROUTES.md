# Routes + Screen Registry (SCR-*) — Canonical

This is the canonical registry of every screen and route.

Conventions:
- Screen IDs are stable (SCR-*)
- Title key must exist in `messages/en.json` and `messages/ar.json`
- If a screen is feature-gated, list its `FF.*`
- Auth gating:
  - Public screens: unauthenticated
  - Learner/Manager: require PERM.LRN.ACCESS
  - Admin: require listed PERM.*

---

## 1) Public (unauthenticated)

| Screen ID | Route | Title (i18n key) | Roles | Notes |
|---|---|---|---|---|
| SCR-PUB-001 | /login | pub.login.title | public | Domain validation + login |
| SCR-PUB-002 | /forgot-password | pub.forgot.title | public | Send reset link |
| SCR-PUB-003 | /reset-password | pub.reset.title | public | Token required |
| SCR-PUB-004 | /accept-invite | pub.invite.title | public | Invite token required |
| SCR-PUB-005 | /maintenance | pub.maintenance.title | public | Optional |

---

## 2) Learner (authenticated)

All learner routes require: **PERM.LRN.ACCESS**.

| Screen ID | Route | Title key | Flags | Roles |
|---|---|---|---|---|
| SCR-LRN-000 | /app/welcome | lrn.welcome.title | — | learner/manager |
| SCR-LRN-001 | /app/home | lrn.home.title | — | learner/manager |
| SCR-LRN-014 | /app/today | lrn.today.title | — | learner/manager |
| SCR-LRN-002 | /app/journey | lrn.journey.title | — | learner/manager |
| SCR-LRN-003 | /app/missions/:user_mission_id | lrn.mission.title | — | learner/manager |
| SCR-LRN-025 | (modal) | lrn.attest.title | — | learner/manager |
| SCR-LRN-027 | (modal) | lrn.reschedule.title | — | learner/manager |
| SCR-LRN-004 | /app/notifications | lrn.notifications.title | — | learner/manager |
| SCR-LRN-005 | /app/search | lrn.search.title | — | learner/manager |
| SCR-LRN-006 | /app/knowledge | lrn.knowledge.title | — | learner/manager |
| SCR-LRN-007 | /app/knowledge/:asset_id | lrn.asset.title | — | learner/manager |
| SCR-LRN-010 | /app/self-awareness | lrn.sa.title | FF.LRN.SELF_AWARENESS | learner/manager |
| SCR-LRN-011 | /app/self-awareness/instances/:instance_id | lrn.sa.runner.title | FF.LRN.SELF_AWARENESS | learner/manager |
| SCR-LRN-013 | /app/self-awareness/holistic | lrn.sa.holistic.title | FF.LRN.SELF_AWARENESS | learner/manager |
| SCR-LRN-015 | /app/playground | lrn.playground.title | — | learner/manager |
| SCR-LRN-018 | /app/career | lrn.career.title | — | learner/manager |
| SCR-LRN-024 | /app/leaderboard | lrn.leaderboard.title | FF.LRN.LEADERBOARD | learner/manager |
| SCR-LRN-026 | /app/points | lrn.points.title | — | learner/manager |
| SCR-LRN-019 | /app/rewards | lrn.rewards.title | FF.LRN.REWARDS_STORE | learner/manager |
| SCR-LRN-019A | /app/rewards/:reward_id | lrn.reward.title | FF.LRN.REWARDS_STORE | learner/manager |
| SCR-LRN-019B | /app/rewards/my | lrn.rewards.my.title | FF.LRN.REWARDS_STORE | learner/manager |
| SCR-LRN-020 | /app/profile | lrn.profile.title | — | learner/manager |
| SCR-LRN-021 | /app/settings | lrn.settings.title | — | learner/manager |
| SCR-LRN-022 | /app/language | lrn.language.title | — | learner/manager |
| SCR-LRN-030 | (overlay) | lrn.nawras.title | FF.LRN.NAWRAS | learner/manager |

---

## 3) Manager (inside learner app)

All manager routes require:
- role: ROLE.MANAGER
- flag: FF.LRN.MANAGER_DASHBOARD
- permission: PERM.MGR.TEAM.VIEW (and nudge requires PERM.MGR.TEAM.NUDGE)

| Screen ID | Route | Title key | Flags | Roles |
|---|---|---|---|---|
| SCR-MGR-001 | /app/team | mgr.team.title | FF.LRN.MANAGER_DASHBOARD | manager |
| SCR-MGR-002 | /app/team/:user_id | mgr.member.title | FF.LRN.MANAGER_DASHBOARD | manager |
| SCR-MGR-003 | /app/team/reports | mgr.reports.title | FF.LRN.MANAGER_DASHBOARD | manager |
| SCR-MGR-004 | (modal) | mgr.nudge.title | FF.LRN.MANAGER_DASHBOARD | manager |

---

## 4) Admin Console

Admin routes require authentication + the specific permission.

| Screen ID | Route | Title key | Permission |
|---|---|---|---|
| SCR-ADM-001 | /admin/dashboard | adm.dashboard.title | PERM.ADM.DASHBOARD.VIEW |
| SCR-ADM-002 | /admin/users | adm.users.title | PERM.ADM.USERS.MANAGE |
| SCR-ADM-003 | /admin/cohorts | adm.cohorts.title | PERM.ADM.COHORTS.MANAGE |
| SCR-ADM-004 | /admin/journeys | adm.journeys.title | PERM.ADM.JOURNEYS.MANAGE |
| SCR-ADM-005 | /admin/journeys/:journey_id/builder | adm.journey_builder.title | PERM.ADM.JOURNEYS.MANAGE |
| SCR-ADM-006 | /admin/mission-templates/:id | adm.mission_templates.title | PERM.ADM.JOURNEYS.MANAGE |
| SCR-ADM-007 | /admin/approvals | adm.approvals.title | PERM.ADM.CONTENT.MANAGE |
| SCR-ADM-008 | /admin/knowledge | adm.knowledge.title | PERM.ADM.CONTENT.MANAGE |
| SCR-ADM-009 | /admin/knowledge/assets/:asset_id | adm.asset_editor.title | PERM.ADM.CONTENT.MANAGE |
| SCR-ADM-010 | /admin/scheduling | adm.scheduling.title | PERM.ADM.SETTINGS.MANAGE |
| SCR-ADM-011 | /admin/gamification | adm.gamification.title | PERM.ADM.SETTINGS.MANAGE |
| SCR-ADM-012 | /admin/rewards | adm.rewards.title | PERM.ADM.REWARDS.MANAGE |
| SCR-ADM-013 | /admin/rewards/redemptions | adm.redemptions.title | PERM.ADM.REWARDS.MANAGE |
| SCR-ADM-014 | /admin/ai-builder/input | adm.ai.input.title | PERM.ADM.CONTENT.MANAGE |
| SCR-ADM-015 | /admin/ai-builder/inventory/:job_id | adm.ai.inventory.title | PERM.ADM.CONTENT.MANAGE |
| SCR-ADM-016 | /admin/ai-builder/blueprint/:job_id | adm.ai.blueprint.title | PERM.ADM.CONTENT.MANAGE |
| SCR-ADM-017 | /admin/reviews/task-claims | adm.claims.title | PERM.ADM.CLAIMS.REVIEW |
| SCR-ADM-019 | /admin/settings/language | adm.settings.language.title | PERM.ADM.SETTINGS.MANAGE |
| SCR-ADM-020 | /admin/settings/security | adm.settings.security.title | PERM.ADM.SETTINGS.MANAGE |
| SCR-ADM-021 | /admin/audit | adm.audit.title | PERM.ADM.AUDIT.VIEW |

