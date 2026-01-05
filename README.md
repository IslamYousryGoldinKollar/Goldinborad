# Goldinkollar — Dev Context Pack (Canonical)

This folder is the **single source of truth** for building Goldinkollar as a multi-tenant, bilingual (EN/AR) onboarding SaaS.

It is optimized for:
- Engineering implementation (FE/BE contracts, schema, routes)
- QA (stable IDs, click-map, predictable errors)
- AI agent buildability (clear rules + canonical registries)

---

## Start here (recommended reading order)

1) **SPEC.md** — product scope, locked decisions, final behaviors (Version 1.2, 2026‑01‑05)  
2) **AI_AGENT_GUIDE.md** — build rules + checklists for an AI agent  
3) **ARCH.md** — architecture + repo conventions  
4) **IDS.md** — global ID system (SCR/ELM/ACT/API/EVT/ERR/FF/TOK/TPL/PERM)  
5) **ROUTES.md** — route + screen registry (SCR-*)  
6) **CLICKMAP.md** — element/action registry (ELM-* → ACT-* → API-* → EVT.*)  
7) **RBAC.md** — roles + permissions (PERM-*)  
8) **POLICIES.md** — domain/video/SA retry/reschedule/points/rewards/leaderboard rules  
9) **ERROR_CODES.md** — canonical ERR.* list  
10) **ANALYTICS.md** — event names + payload rules (EVT.*)  
11) **FLAGS.md** — feature flags and defaults (FF.*)  
12) **design_system.md** — design tokens (TOK-*) + RTL guidance  
13) **openapi.yaml** — OpenAPI 3.1 contract (operationIds = API-*)  
14) **schema.sql** — Postgres schema contract  
15) **messages/en.json**, **messages/ar.json** — i18n packs (all UI copy)  
16) **TESTING.md** — QA + automated test coverage checklist  
17) **PLAN.md** — sprint-by-sprint implementation plan  
18) **LEGACY_ID_MAP.md** — mapping for older/alternate IDs (use only if needed)  
19) **GLOSSARY.md** — shared terminology  

---

## Non-negotiable rules

- **All interactive UI elements must have `data-testid` equal to their ELM-* ID.**  
  Dynamic list items must suffix with `__<entity_id>` (see IDS.md).
- **Server-side RBAC is mandatory.** Client-side gating is UX only.
- **Tenancy is enforced by JWT tenant context.** Never trust `tenant_id` from client payload.
- **Points are an immutable ledger.** “Undo” is a reversal transaction, never deletion.
- **No hard-coded UI text.** All strings come from i18n packs (EN + AR).

---

## Quick mapping (most asked)

- “Where are the screens?” → ROUTES.md  
- “What do I click and what happens?” → CLICKMAP.md  
- “What endpoints do we need?” → openapi.yaml  
- “What tables do we need?” → schema.sql  
- “What strings do we show (EN/AR)?” → messages/*.json  
- “How do we name IDs / errors / events?” → IDS.md + ERROR_CODES.md + ANALYTICS.md  

