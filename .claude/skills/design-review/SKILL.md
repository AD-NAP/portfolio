---
name: design-review
description: Check the portfolio site's design and accessibility after any change to index.html, assets/styles.css or assets/main.js, and before saying a UI change is done. Screenshots both themes at phone and desktop width, runs automated checks (overflow, JS errors, axe WCAG AA, token contrast, touch targets, reduced motion), then has Claude look at every screen, fix problems and re-check. Also use when Shafik asks to "review the design", "check the site", or "run a design review".
---

# Design review

A loop: **check → look → fix → re-check**, until the automated check passes and the screenshots look right. Stop after 3 rounds and report what's left instead of looping forever.

## 1. Run the checker

```bash
npm install            # first time in a session only (installs axe-core)
npm run -s check       # all themes × widths (dark/light × 390/1280)
# narrower runs while iterating:
npm run -s check -- --widths 390 --themes light
```

The script (`scripts/check.js`) serves the repo itself; nothing else needs to be running. It writes screenshots and `report.json` to `.review/` (git-ignored) and exits non-zero on any failure:
- horizontal overflow, JS/console errors
- axe-core WCAG 2.1 AA violations
- token contrast (text ≥ 4.5:1, focus ≥ 3:1) in each theme
- phone touch targets < 44px
- reduced motion not showing final states

## 2. Look at the screenshots

Start with the four contact sheets, `.review/<theme>-<width>-sheet.png` (every screen side by side). Open single screens (`.review/<theme>-<width>-NN.png`) only where a sheet shows something worth a closer look. The script can't see design problems, so check by eye:

- **Overlap and clipping:** text cut off, elements colliding (sun or moon vs. tower, clouds or stars behind text), anything hidden under the phone top bar.
- **Hierarchy:** name and role read first; section headings stand out; stats are readable at a glance.
- **Spacing and alignment:** consistent rhythm between sections; left edges line up; no orphaned single words in headings.
- **Both themes look intentional:** night (lights on) and day (lights off) each feel finished, not inverted.
- **Phone first screen:** name, role, small building and contact links visible; About begins within one swipe.
- **Content:** no invented facts (compare with `content/resume.md`); placeholders are visible and marked `PLACEHOLDER:`.
- **Project rules:** everything in `CLAUDE.md` under Design, Motion and Accessibility still holds.

## 3. Fix and re-check

- Fix the cause, not the symptom. Prefer changing a token in `:root` / `[data-theme]` over one-off overrides.
- Keep fixes inside what the task asked for. Anything bigger or out of scope goes into `BACKLOG.md` instead.
- Re-run the checker (narrowed to the affected theme/width while iterating, then the full run once at the end).

## 4. Report

Tell Shafik, briefly:
- PASS/FAIL from the final full run, and how many rounds it took.
- What you found by eye and what you fixed.
- Anything left over, added to `BACKLOG.md`.
- Show 2–4 representative screenshots (SendUserFile), not all of them.

## Full review rounds

When Shafik asks for a full review (not just a check after a change), also run the Design plugin skills `design-critique` and `accessibility-review` on the screenshots and the checker results. Save their reports as `reviews/YYYY-MM-DD-design-critique.md` and `reviews/YYYY-MM-DD-accessibility-review.md`, then triage the findings into `BACKLOG.md` with 🔴/🟡/🟢 severity.
