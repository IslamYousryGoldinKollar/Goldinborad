# Goldinkollar — Strategic Onboarding Ecosystem (SaaS)

**Final Product + UX + Technical Specification (Dev‑Ready, Consolidated)**  
Version: **1.2** (Finalized per decisions 1–9)  
Date: **2026‑01‑05**  
Audience: Product, UX, Engineering, Data/ML, QA

This document is the **high-level canonical spec**. For implementation-grade registries, see:
- ROUTES.md (screens + routes)
- CLICKMAP.md (elements + actions)
- IDS.md (ID system, tokens, flags)
- openapi.yaml (REST contract)
- schema.sql (DB contract)

---

## Change log

| Version | Date | Summary |
|---|---:|---|
| 1.1 | 2026‑01‑05 | Added AI Onboarding Builder, Knowledge Base, Today Plan, Self Awareness, Template Library |
| 1.2 | 2026‑01‑05 | Locked decisions: admin uploads videos, voice recording in browser, internal assessments, learner rescheduling, tenant-selectable Arabic/English, physical tasks, trust-first self-claim points + admin undo, leaderboard; closed remaining UX gaps end-to-end |

---

## Decisions locked (must not change without a spec update)

1) **Knowledge Base videos** → Admin uploads real videos (no automatic video generation).  
2) **AI Builder voice** → Record in-app (browser recording, up to 5 minutes).  
3) **Self Awareness tests** → Internal (in-app questionnaires + scoring).  
4) **Task rescheduling** → Learners can reschedule (within tenant policy constraints).  
5) **Languages** → Arabic + English enabled per tenant by admin (UI + content workflows).  
6) **Physical tasks** → Supported (e.g., “Visit your team in the office” scheduled on Day 7).  
7) **Untrackable tasks points** → Trust-first self-claim; points granted immediately; admins can undo later with full audit trail.  
8) **Leaderboard** → Learner leaderboard based on earned points (timeframe/scope configurable).  
9) **Finalize gaps** → This spec includes first-run flow, consent, scheduling policies, points ledger/reversal, claim review UI, notifications, anti-abuse guardrails, complete admin tooling, APIs, analytics, edge cases.

---

## 1) Product scope

Goldinkollar is an onboarding platform that:

- Converts onboarding into a **scheduled journey of daily tasks** (digital + physical).
- Uses AI for **admin-side program building** and **learner-side coaching**.
- Delivers content via **missions**, **knowledge assets**, **games**, **flashcards**, **mind maps**, and **assessments**.
- Personalizes learning based on Persona Quest + Self Awareness results.
- Gamifies behavior with **points** and a **leaderboard**.
- Provides governance: approvals, audit logs, revisions, undo, privacy controls.

---

## 2) Architecture (logical)

### 2.1 Key services
- **Core API**: tenant-aware, RBAC, journeys, missions, tasks, points, leaderboards
- **Content services**
  - Documents (PDF ingestion, chunking)
  - Media (upload, transcode, stream, captions/transcripts optional)
  - Knowledge Base library (assets, collections, progress)
- **AI services**
  - Nawras concierge (RAG + actions)
  - AI Onboarding Builder (multi-input → inventory → blueprint → draft outputs)
  - Self Awareness holistic summarizer (multi-assessment → holistic view)
- **Schedulers/Workers**
  - Speech-to-text jobs
  - Transcoding jobs
  - Notification jobs
  - Blueprint output generation jobs
- **Data**
  - relational DB (system of record)
  - object storage (PDF/video/audio/images)
  - search index (text + optional embeddings)
  - optional vector store (RAG)

---

## 3) Roles & permissions (summary)

- Learner + Manager live in the learner app.
- Admin Console has multiple admin roles (viewer/content/reviewer/tenant admin).
- Trust-first self-claim can be **kept** or **revoked** by specific admin roles.

Canonical definitions are in RBAC.md.

---

## 4) Multilingual behavior (Arabic + English)

### 4.1 Tenant language settings (admin-set)
- enabled_languages = ["en","ar"] (configurable)
- default_language (en or ar)
- require_bilingual_content (optional; default false)

### 4.2 User experience
- On first login, user selects preferred language from tenant-enabled languages.
- User can change language later in Profile.
- Content display fallback:
  1) If an asset/mission exists in the user’s language → show it
  2) Else fallback to tenant default
  3) Else fallback to any available language with a clear label (“English content”)

### 4.3 AI Builder & STT
- Voice recording: language auto-detected; admin can override.
- AI outputs can be generated in one language or bilingual packs (en+ar), subject to approval.

---

## 5) Data model (conceptual)

The schema supports:
- multi-tenancy + domain restriction
- missions (digital + physical)
- learner rescheduling overrides
- trust-first attestation claims
- video progress/threshold completion
- immutable points ledger + reversals
- optional rewards store
- Self Awareness assessment versioning (v1/v2/…)
- audit log + notifications
- leaderboard policies + opt-out

Canonical DB contract is in schema.sql.

---

## 6) UX navigation (final)

Learner tabs:
- Home
- Journey
- Playground
- Career
- Profile
Optional tabs (feature/tenant controlled):
- Rewards (if enabled)
Manager-only:
- Team

Key learner destinations:
- Today Plan (/app/today)
- Knowledge Base (/app/knowledge)
- Self Awareness (/app/self-awareness)
- Leaderboard (/app/leaderboard)
- Points History (/app/points)

Admin destinations (console):
- Dashboard
- Users
- Cohorts & teams
- Journeys + Builder
- Mission Templates
- Knowledge Base Manager + Asset Editor + Approvals
- AI Builder (Input → Inventory → Blueprint)
- Scheduling Builder
- Gamification/Leaderboard + Claims Review
- Rewards + Redemptions (if enabled)
- Language settings + Security settings
- Audit log

Canonical route registry is in ROUTES.md.

---

## 7) Learner UX (key flows)

### First Run Setup (SCR-LRN-000)
- Choose language (tenant-enabled)
- Confirm timezone (auto-detect, editable)
- Optional consents:
  - “Use Self Awareness results to personalize learning” (opt-in)
  - “Share Self Awareness results with my manager” (default off)

### Today Plan (SCR-LRN-014)
- Shows overdue mandatory tasks first, then today tasks by priority.
- Contains digital tasks + physical tasks + self-claim tasks.
- Allows rescheduling within tenant policy.
- Allows quick claim for attestation tasks (configurable).

### Mission Detail (SCR-LRN-003)
- For system-tracked: complete when steps complete.
- For trust-based: show attestation CTA (+ evidence capture if required).

### Trust-first attestation (SCR-LRN-025)
- User claims completion → mission completes immediately → points granted immediately.
- Claim is reviewable later by admin with keep/revoke.

### Leaderboard (SCR-LRN-024)
- Rankings by points earned (not points balance).
- Scopes: tenant/cohort/team; timeframes weekly/monthly/all-time (configurable).
- Privacy mode configurable; optional opt-out.

### Points History (SCR-LRN-026)
- Shows earned/spent/reversal transactions for transparency.

---

## 8) Admin UX (key flows)

### Knowledge Base Manager
- Admin uploads real video files, sets language, metadata, publish status.
- Optional auto-transcribe workflow (flag controlled) for search + Nawras grounding.

### Scheduling Builder
- Schedule digital missions, microlearning missions (KB-linked), physical tasks.
- Set points and attestation requirements (note/photo).
- Define reschedule policy: window, max reschedules, compliance constraints.

### Gamification & Leaderboard settings
- Enable/disable leaderboard, timeframes/scopes, privacy mode, opt-out.
- Define default points rules + anti-abuse guardrails.

### Task Claims Review
- Review self-claimed tasks and keep/revoke.
- Revoke creates negative points transaction + user notification + audit entry.

### AI Onboarding Builder
- Inputs: multi-PDF + text + in-browser voice recording (max 5 min).
- STT transcript editable.
- Outputs: inventory table, blueprint JSON, draft journeys/missions/KB assets (no video generation).

---

## 9) Scheduling behavior (“tasks of the day”)

- Day index is based on user onboarding start date + timezone.
- Today Plan ordering:
  1) overdue compliance tasks
  2) today scheduled tasks (by priority)
  3) recommended KB asset (persona-based)
  4) optional game suggestion
- Rescheduling defaults (tenant configurable):
  - move due date within ±3 days
  - max 2 reschedules per mission
  - compliance missions cannot be moved beyond due unless admin allows

---

## 10) Points & rewards

- Points are earned via:
  - mission completion (system-tracked)
  - mission completion (trust-first attestation)
  - KB completion (if configured)
  - games (via mapping)
  - Self Awareness assessment completion
- Points ledger is immutable; reversals are separate transactions.
- Rewards store is optional and tenant-enabled (feature-flag + tenant setting).

---

## 11) Acceptance criteria (MVP)

Learner:
- Can see Today Plan with scheduled tasks
- Can complete digital tasks and earn points
- Can complete physical/untrackable tasks via attestation and instantly earn points
- Can reschedule tasks within tenant policy
- Can view leaderboard and personal points history
- Can take Self Awareness tests internally and view results + holistic view

Admin:
- Can build journeys and schedule tasks by day index
- Can create physical tasks with attestation requirements and points
- Can review self-claimed tasks and revoke/keep with audit trail
- Can configure leaderboard privacy/scopes/timeframes
- Can upload and publish video assets into Knowledge Base
- Can use AI Builder with multi-input + in-browser voice recording to generate inventory + blueprint + draft outputs

