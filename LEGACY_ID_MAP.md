# Legacy / Alternate ID Mapping

This file exists to resolve ID inconsistencies found across earlier drafts.

**Canonical source of truth is ROUTES.md + IDS.md + CLICKMAP.md.**

---

## 1) Admin screen ID mapping (Strategic Spec → Canonical)

Some versions of the “Strategic Onboarding Ecosystem” document used different SCR-ADM numbering.
Use this mapping when encountering those IDs:

| Strategic spec ID | Meaning | Canonical screen(s) |
|---|---|---|
| SCR-ADM-013 | AI Builder Inputs | SCR-ADM-014 (/admin/ai-builder/input) |
| SCR-ADM-016/017 | Knowledge Base Manager | SCR-ADM-008 (/admin/knowledge), SCR-ADM-009 (/admin/knowledge/assets/:asset_id), SCR-ADM-007 (/admin/approvals) |
| SCR-ADM-019 | Scheduling Builder | SCR-ADM-010 (/admin/scheduling) |
| SCR-ADM-021 | Gamification & Leaderboard Settings | SCR-ADM-011 (/admin/gamification) |
| SCR-ADM-022 | Task Claims Review | SCR-ADM-017 (/admin/reviews/task-claims) |
| SCR-ADM-023 | Tenant Language Settings | SCR-ADM-019 (/admin/settings/language) |

If you see other SCR-ADM IDs that do not exist in ROUTES.md, treat them as legacy and add a mapping here.

---

## 2) Element ID normalization

If earlier prototypes used non-dynamic IDs for list items (missing `__<id>`),
they MUST be upgraded to dynamic IDs per IDS.md.

Example:
- Legacy: `ELM-LRN-014-TASK-QUICK-CLAIM`
- Canonical: `ELM-LRN-014-TASK-CLAIMDONE__<user_mission_id>`

---

## 3) Policy sources

If any policy appears in multiple docs with different values:
- Use POLICIES.md as source of truth.
- Ensure tenant_settings supports overriding defaults (e.g., retry_days, threshold).

