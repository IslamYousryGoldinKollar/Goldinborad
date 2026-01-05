# Analytics (EVT.*) — Canonical

Analytics events are used for:
- product insights
- funnel tracking
- debugging
- anti-abuse signals

Rules:
- Do not invent event names in code.
- Use canonical names from this file.
- Include `tenant_id`, `user_id`, `screen_id`, and relevant entity IDs in payload where possible.

---

## 1) Naming convention

Recommended format:
- `EVT.<area>.<screen>.<action>`
Examples:
- `EVT.pub.login.submit`
- `EVT.lrn.today.open_task`
- `EVT.admin.task_claim.revoke`

---

## 2) Required events (MVP)

### Public/auth
- EVT.pub.login.submit
- EVT.pub.login.domain_blocked

### Learner core
- EVT.lrn.home.open_today
- EVT.lrn.today.open_task
- EVT.task.open
- EVT.task.complete
- EVT.task.report_issue

### Rescheduling
- EVT.task.reschedule_open
- EVT.today_plan.reschedule_apply

### Attestation (trust-first claims)
- EVT.task.attestation_start
- EVT.task.attestation_open
- EVT.task.attestation_submit
- EVT.task.attestation_cancel

### Knowledge
- EVT.lrn.knowledge.open_asset
- EVT.lrn.asset.play
- EVT.lrn.asset.complete

### Self Awareness
- EVT.lrn.sa.start
- EVT.lrn.sa.submit
- EVT.lrn.sa.open_holistic

### Leaderboard
- EVT.leaderboard.open
- EVT.leaderboard.timeframe_change
- EVT.leaderboard.scope_change
- EVT.leaderboard.opt_out
- EVT.leaderboard.opt_in

### Rewards (if enabled)
- EVT.lrn.rewards.open_reward
- EVT.lrn.rewards.redeem

### Manager
- EVT.mgr.nudge.send

### Admin
- EVT.admin.task_claim.keep
- EVT.admin.task_claim.revoke
- EVT.admin.points.adjust
- EVT.admin.leaderboard.policy_update
- EVT.admin.points.policy_update
- EVT.admin.ai_builder.stt_start
- EVT.admin.ai_builder.voice_record_controls

---

## 3) Standard payload fields

All events SHOULD include:
- tenant_id
- user_id
- screen_id (SCR-*)
- locale (en/ar)
- timezone
- device_type (mobile/desktop)
- app_version / build_sha (if available)

Entity-specific examples:
- open_task: { user_mission_id }
- revoke_claim: { claim_id, user_mission_id, reason }
- redeem_reward: { reward_id, cost_points }

---

## 4) Privacy

- Never include raw answers from Self Awareness responses in analytics.
- Never include password, tokens, or sensitive PII.
- If storing names, obey tenant privacy mode for leaderboard.

