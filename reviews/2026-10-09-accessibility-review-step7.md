<!-- Step 7 run, 2026-10-09, branch claude/step7-recruiter-critique.
     The Design plugin's `accessibility-review` skill was not available in this session, so Claude wrote this
     in the same format as reviews/2026-10-09-accessibility-review.md. Treat it as a self-review. -->

## Accessibility Audit: Shafik Adam portfolio (step 7 branch)
**Standard:** WCAG 2.1 AA | **Date:** 2026-10-09
**Method:** `npm run -s check` (axe-core 4.10 in both themes at 390px and 1280px, token contrast, touch targets at 390px, reduced motion, overflow, console errors), plus a read of the changed markup.
**Not covered:** real screen-reader testing, a scripted Tab walk-through, and 200% zoom. Those were done for v3/v4 and not repeated here.

### Summary
**Checker:** PASS on the final run. **axe violations:** 0 in all four runs. **Issues found by reading the changes:** 2 minor.

| Check | Result |
|-------|--------|
| axe-core, dark and light, 390px and 1280px | 0 violations |
| Horizontal overflow | 0px in all four runs |
| JS and console errors | none |
| Token contrast (text ≥ 4.5:1, focus ≥ 3:1) | all pass; lowest is `--code-c` on `--bg-deep` at night, 4.55:1 |
| Touch targets under 44px at 390px | none (the new "Code on GitHub" link is a 44px pill) |
| Reduced motion | 59 of 59 windows lit, 0 animations running |

### Findings
| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|---------------|----------|----------------|
| 1 | Chart bars are non-text graphics. Day mode: the amber model bar is 1.65:1 against the empty track | 1.4.11 Non-text contrast | 🟢 Minor | Not a failure: every value is also printed as text and in the figure's `aria-label`. Could deepen the day-mode track a little |
| 2 | Each chart `figure` has an `aria-label` and also visible labels and a `figcaption`, so some screen readers announce the numbers twice | 1.3.1 Info and relationships | 🟢 Minor | Same pattern as the v4 chart that passed review; leave, or mark the rows `aria-hidden` in a later pass |

### What changed and stays accessible
- The hero proof line is a plain paragraph; `<strong>` carries the emphasis.
- LinkedIn links are removed, not hidden, so nothing unreachable is left in the Tab order.
- The request-log figure keeps its `aria-label`; its bar is `aria-hidden`.
- New colours come from tokens (`--track` is derived from `--line`); no hard-coded colours were added.
