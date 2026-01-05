# Design System (TOK-*) — Implementation Notes

This file defines how to implement the required design tokens (TOK-*) in code.

> TOK-* tokens are the contract; implementation can be CSS variables or Tailwind theme values.

---

## 1) Fonts

- `TOK.font.family.latin` → Inter (or system UI fallback)
- `TOK.font.family.arabic` → Cairo (or Noto Kufi Arabic fallback)

Rules:
- When locale is `ar`, default font family should be arabic token.
- Ensure Arabic shaping works correctly (no letter spacing hacks).

---

## 2) Token mapping (recommended)

### Option A: CSS variables (preferred)
Define variables in `:root` and `[dir="rtl"]` if needed.

Example mapping:
- `--tok-color-primary-600`
- `--tok-space-4`
- `--tok-radius-md`

Then in Tailwind:
- set theme colors to `rgb(var(--tok-color-primary-600) / <alpha-value>)` (or hex string)
- spacing, radius, etc. reference variables

### Option B: Tailwind theme constants
Define `theme.extend.colors.primary.600 = "#..."` etc.

---

## 3) Required tokens (must exist)

### Colors
- TOK.color.primary.{50..900}
- TOK.color.neutral.{0,50,100,200,300,500,700,900}
- TOK.color.success.{50..900}
- TOK.color.warning.{50..900}
- TOK.color.danger.{50..900}
- TOK.color.info.{50..900}

### Typography
- TOK.font.size.{100,200,300,400,500}
- TOK.font.weight.{regular,medium,semibold}

### Spacing / radius
- TOK.space.{0,1,2,3,4,5,6,8}
- TOK.radius.{sm,md,lg}

### Motion
- TOK.motion.duration.{fast,base}
- TOK.motion.ease.standard

### Policy tokens
- TOK.policy.video_completion_threshold.default = 0.80
- TOK.policy.sa_retry_days = 30

---

## 4) Component styling rules

- Use neutral colors for surfaces and borders; primary for CTAs.
- All interactive elements:
  - visible focus ring (keyboard accessible)
  - minimum touch target ~44px on mobile
- Modals/drawers:
  - trap focus
  - ESC to close (unless destructive confirmation)
- Use consistent badge styles for:
  - mission_type: digital/physical
  - completion_mode: system-tracked vs attestation

---

## 5) RTL support checklist (Arabic)

- `dir="rtl"` at document root when language is ar.
- Icons that imply direction must flip (chevrons, arrows).
- Numeric values still LTR; use unicode bidi isolation if needed.
- Keep spacing tokens consistent; do not hard-code left/right paddings.

