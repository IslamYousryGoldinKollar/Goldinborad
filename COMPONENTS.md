# UI Component Registry (CMP-*) — Reusable Blocks

This registry prevents re-inventing click logic and styling across pages.

> All components must comply with TOK-* tokens and use ELM-* IDs for interactive elements.

---

## 1) App shells

### CMP-LRN-SHELL (Learner shell)
- Responsive:
  - Mobile: top bar + bottom nav
  - Desktop: sidebar + top bar
- Includes global components: CMP-TOAST, CMP-MODAL, CMP-DRAWER, CMP-OFFLINE-BANNER

Global clickable elements (always present):
- `ELM-GLOBAL-TOPBAR-SEARCH` → open SCR-LRN-005
- `ELM-GLOBAL-TOPBAR-NOTIFS` → open SCR-LRN-004
- `ELM-GLOBAL-TOPBAR-POINTS` → open SCR-LRN-026
- `ELM-GLOBAL-TOPBAR-LANG` → open SCR-LRN-022
- `ELM-GLOBAL-NAWRAS-FAB` → open SCR-LRN-030 (FF.LRN.NAWRAS)

### CMP-ADM-SHELL (Admin shell)
- Desktop-first
- Sidebar nav + tenant switcher
- Tables + filters + kebab menu per row

---

## 2) Shared primitives

### CMP-TOPBAR
- Search, notifications, points, language
- Emits analytics on key actions (see ANALYTICS.md)

### CMP-BOTTOMNAV / CMP-SIDENAV
- Learner nav entries, feature-gated:
  - Rewards (FF.LRN.REWARDS_STORE + tenant enabled)
  - Team (manager + FF.LRN.MANAGER_DASHBOARD)

### CMP-TOAST
- Used for success/error confirmations (attestation submit, profile save, etc.)

### CMP-MODAL / CMP-DRAWER
- Used for SCR-LRN-025 (attestation), SCR-LRN-027 (reschedule), SCR-MGR-004 (nudge), admin evidence drawers

### CMP-OFFLINE-BANNER
- Shows when network unavailable using `global.offline`

---

## 3) Domain components

### CMP-TASK-CARD
Used in Today Plan, Journey day lists, Manager dashboards.

Required interactive elements (dynamic IDs):
- `ELM-*-TASK-OPEN__<user_mission_id>`
- `ELM-*-TASK-RESCHEDULE__<user_mission_id>`
- `ELM-*-TASK-CLAIMDONE__<user_mission_id>` (attestation only)
- `ELM-*-TASK-MORE__<user_mission_id>`

### CMP-ASSET-CARD
Used in Knowledge list, recommendations.

Elements:
- `ELM-*-ASSET-OPEN__<asset_id>`
- `ELM-*-ASSET-SAVE__<asset_id>` (optional)

### CMP-LEADERBOARD-ROW
Used in leaderboard list.

Elements:
- `ELM-LRN-024-ROW-OPEN__<user_id>` (optional)

### CMP-REWARD-CARD
Used in Rewards list.

Elements:
- `ELM-LRN-019-REWARD-OPEN__<reward_id>`

### CMP-TABLE (admin)
Standard admin table with:
- filter row
- bulk select
- kebab per row
- server-side pagination

### CMP-EMPTY-STATE / CMP-ERROR-STATE
Standardized empty/error patterns; never bespoke.

### CMP-CONFIRM-MODAL
Used for destructive actions (revoke claim, redeem reward confirmation, etc.)

