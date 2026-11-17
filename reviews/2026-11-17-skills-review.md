# Skills review (17-11-2026)

The first review with the new third-party skills. Sources:
- **Impeccable** slop detector (`impeccable detect`): on the source, and on the rendered page at 1280px and 390px through a headless Chromium.
- **Impeccable** critique heuristics, applied to the design-review contact sheets (both themes, both widths).
- **Emil Kowalski** `improve-animations` (quick effort, all eight categories), `mobile-native` checks and `break-ui` style edge cases.

CLAUDE.md wins over every skill. Verdicts: **fix now** (done in v0.5.0), **backlog** (Shafik picks), **rejected** (with the reason).

## Fix now

| # | Sev | Source | Where | Finding | Fix |
|---|---|---|---|---|---|
| 1 | High | critique, break-ui | Skills, 390px | The label "Cloud & infrastructure" runs into its list ("infrastructureDynamoDB") | Wider label column on phones (8rem) |
| 2 | High | mobile-native | Riddle input | 14px text makes iPhone Safari zoom the page on focus | 16px on the input |
| 3 | Med | detect `line-length` | Role bullets, range-chart caption | Lines run 89–108 characters; `68ch` is measured in zeros, which are wider than average letters | `--measure` 68ch → 60ch; captions capped at 60ch |
| 4 | Med | detect `nested-cards`, critique | Charts inside project cards | A bordered, filled chart box inside a bordered, filled card: two frames for one idea | Inside a project, the chart drops its box and keeps a top rule |
| 5 | Med | mobile-native | Pills, buttons, floors | Colour-only `:hover` sticks after a tap on phones (a tapped pill stays amber) | Hover rules only for devices that hover |
| 6 | Med | emil-design-eng, mobile-native | Pills and buttons | No press feedback; the grey tap flash is the only response | `scale(.97)` on `:active`, 160ms strong ease-out; tap flash removed |
| 7 | Med | CLAUDE.md motion rules (found by improve-animations) | Status dot | The dot pings twice on load. That's automatic motion outside the three allowed kinds | Ping removed; the dot stays |
| 8 | Low | improve-animations, CLAUDE.md | Star twinkle | 3 × 4s with negative delays can run past 10s | 2 iterations, so it settles by ~8s |
| 9 | Low | improve-animations (performance) | Building lean | `--tilt-x/-y` set on the SVG make every one of its ~200 children recalculate style on each pointer frame | JS sets `transform` on the two moving elements directly |
| 10 | Low | improve-animations (cohesion) | 4 hand-typed cubic-beziers | Near-duplicate curves, no motion tokens | `--ease-out` and `--ease-in-out` tokens (Emil's values) |
| 11 | Low | mobile-native | Browser bar | No `theme-color`, so the phone status bar doesn't match the sky | `theme-color` follows `--bg-deep` for the theme |

## Backlog (for Shafik)

- **Desktop floors leave the right ~40% empty** (critique, layout). Content sits in a 68ch column inside a 1040px frame. Options: a second column for charts beside role text, or a side rail showing the floor's level and file name. That changes the layout, so it's Shafik's call.
- **13 font sizes** (detect `design-system-font-size`, advisory). Consolidate into five or six size tokens. Low risk but touches every rule, so it gets its own step.
- **B1 reveal moment** (improve-animations, missed opportunity). When the riddle is solved, light the basement windows one by one, the way the building lights up on load. It answers the user, so CLAUDE.md allows it.
- **Phone "Sections" menu teleports** (improve-animations, missed opportunity). A 180ms fade and 4px drop from the top bar (`@starting-style`) would show where it came from.

## Rejected

| Finding | Source | Why |
|---|---|---|
| `dark-glow` on the sun, moon, result bar and the star-hiding text halo | detect | DESIGN.md's light-source rule: these are light sources (and the halo hides stars behind letters, a fix from v0.3). Recorded as detector ignores. |
| `low-contrast` 1.5:1 on the contact email | detect (source scan) | False positive: the amber "gradient" is a 2px underline, not the text background. axe passes. |
| `cramped-padding` on floor sections | detect (source scan) | False positive without CSS: floors have 48–80px padding. The rendered scan doesn't flag it. |
| Reduced motion should keep gentle fades | improve-animations (accessibility) | CLAUDE.md: reduced motion shows final states with no animation. |
| Shooting star uses `ease-in` | improve-animations (easing) | It's sky decoration, not UI: a meteor speeding up as it burns in is the intended look. |
| Theme switch is 1.1s, over the 300ms UI budget | improve-animations (duration) | A rare, explanatory moment (the sun sets and the moon rises); Emil's table allows longer for those. |
