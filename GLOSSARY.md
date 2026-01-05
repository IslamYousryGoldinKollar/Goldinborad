# Glossary

- **Tenant**: An organization boundary. Users belong to exactly one tenant.
- **Allowed email domains**: Tenant policy for login/invite; only emails from these domains can authenticate.
- **Journey**: An onboarding program template, structured as days containing missions.
- **Mission template**: A reusable task definition (digital/physical/microlearning).
- **User mission**: A mission instance assigned to a specific user with a due date and status.
- **Completion mode**:
  - `system_tracked`: completion determined by app events (video threshold, quiz finish, etc.)
  - `user_attestation_trusted`: trust-first self-claim by the learner; reviewable later
- **Attestation**: The learner’s claim that they completed an untrackable/physical task.
- **Task claim**: The stored record of an attestation submission; admins can keep/revoke.
- **Points ledger**: Immutable log of points transactions; reversals are separate rows.
- **Leaderboard**: Ranking view computed over earned points transactions by timeframe + scope.
- **Knowledge asset**: Content item (video, article, pdf, flashcards) with progress tracking.
- **Self Awareness assessment**: Internal questionnaire/scoring, stored as versioned attempts (v1/v2/…).
- **Nawras**: Learner-side concierge (RAG + actions) exposed as an overlay/FAB (feature-gated).

