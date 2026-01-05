# Roles + Permissions (RBAC) — Canonical

RBAC is enforced on **every request** server-side, and mirrored client-side for UX.

> Rule: A route must specify required permission(s) or role(s).  
> Source of truth: ROUTES.md + this file.

---

## 1) Roles

| Role key | Meaning | Notes |
|---|---|---|
| ROLE.LEARNER | Standard end-user | Access learner app |
| ROLE.MANAGER | Learner + team views | Inherits learner + manager screens |
| ROLE.ADMIN_VIEWER | Read-only admin | Limited access |
| ROLE.ADMIN_CONTENT | Content admin | KB assets, journeys, templates |
| ROLE.ADMIN_REVIEWER | Reviewer admin | Task claims review |
| ROLE.ADMIN_TENANT | Tenant admin | Settings, security, policies |
| ROLE.SUPER_ADMIN | Platform owner (optional) | Multi-tenant ops |

---

## 2) Minimum permissions (PERM.*)

### Learner / Manager
- PERM.LRN.ACCESS — access learner app
- PERM.MGR.TEAM.VIEW — view assigned team members
- PERM.MGR.TEAM.NUDGE — send nudges to assigned team members

### Admin
- PERM.ADM.DASHBOARD.VIEW
- PERM.ADM.USERS.MANAGE
- PERM.ADM.COHORTS.MANAGE
- PERM.ADM.JOURNEYS.MANAGE
- PERM.ADM.CONTENT.MANAGE — KB assets, approvals, templates
- PERM.ADM.CLAIMS.REVIEW — keep/revoke task claims
- PERM.ADM.REWARDS.MANAGE
- PERM.ADM.SETTINGS.MANAGE
- PERM.ADM.AUDIT.VIEW

---

## 3) Role → permission mapping (default)

This is the recommended default mapping; tenants may customize later.

| Role | Permissions |
|---|---|
| ROLE.LEARNER | PERM.LRN.ACCESS |
| ROLE.MANAGER | PERM.LRN.ACCESS, PERM.MGR.TEAM.VIEW, PERM.MGR.TEAM.NUDGE |
| ROLE.ADMIN_VIEWER | PERM.ADM.DASHBOARD.VIEW |
| ROLE.ADMIN_CONTENT | PERM.ADM.DASHBOARD.VIEW, PERM.ADM.JOURNEYS.MANAGE, PERM.ADM.CONTENT.MANAGE |
| ROLE.ADMIN_REVIEWER | PERM.ADM.DASHBOARD.VIEW, PERM.ADM.CLAIMS.REVIEW |
| ROLE.ADMIN_TENANT | PERM.ADM.DASHBOARD.VIEW, PERM.ADM.USERS.MANAGE, PERM.ADM.COHORTS.MANAGE, PERM.ADM.JOURNEYS.MANAGE, PERM.ADM.CONTENT.MANAGE, PERM.ADM.CLAIMS.REVIEW, PERM.ADM.REWARDS.MANAGE, PERM.ADM.SETTINGS.MANAGE, PERM.ADM.AUDIT.VIEW |
| ROLE.SUPER_ADMIN | all permissions + cross-tenant operations |

---

## 4) Special rule: who can keep/revoke self-claims

Per requirements, the following roles can **undo** (revoke) or **keep** (mark reviewed) a trust-first attestation claim:

- ROLE.ADMIN_TENANT
- ROLE.ADMIN_CONTENT (content creator)
- ROLE.ADMIN_REVIEWER (program admin / reviewer)

This action must:
- update claim review state
- create a points reversal transaction if revoked
- create an audit log entry
- notify the learner (reason required on revoke)

---

## 5) Enforcement rules

### Server-side (mandatory)
- Check JWT/session validity.
- Determine `tenant_id` + `user_id` from token.
- Load roles/permissions for user.
- Enforce:
  - route permission(s)
  - feature flag gating
  - tenant settings gating (e.g., rewards_store_enabled)

Return:
- 401: not authenticated
- 403: authenticated but forbidden
- 404: resource not found (after tenant scoping)

### Client-side (UX only)
- Hide nav + actions without permissions.
- Still render disabled states when helpful (e.g., Rewards disabled message).

---

## 6) Resource scoping

- Learner endpoints: user can only access own resources (user_id match).
- Manager endpoints: restricted to mapped teams (manager_team_map).
- Admin endpoints: scoped to tenant (tenant_id), then permission check.

