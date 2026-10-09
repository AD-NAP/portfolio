## Accessibility Audit: Shafik Adam portfolio (v3, commit `6f05f35`)
**Standard:** WCAG 2.1 AA | **Date:** 2026-10-09
**Method:** Design plugin `accessibility-review` framework. Evidence: axe-core 4.10 scan (both themes at 390px and 1280px), scripted Tab walk-through, Playwright accessibility-tree snapshot, contrast ratios computed from the theme tokens, touch-target measurement at 390px, and a 200% zoom check (640px viewport).
**Not covered:** real screen-reader testing (VoiceOver/NVDA). That still needs a human pass.

### Summary
**Issues found:** 11 | **Critical:** 1 | **Major:** 4 | **Minor:** 6

### Findings

#### Perceivable
| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|---------------|----------|----------------|
| 1 | Floor tags beside the building (`R`, `L5`…`G`) are 1.93:1 at night and 2.30:1 by day | 1.4.3 Contrast | 🟡 Major | Use `--muted` for the tags (7.5:1 night, 5.0:1 day) |
| 2 | Turtle code comments in day mode are 3.85:1 (axe flagged) | 1.4.3 Contrast | 🟡 Major | Darken `--code-c` in day mode to about `#55697F` (≥4.5:1) |
| 3 | Section headings read as "G About", "L1 Skills" because the floor badge is inside the heading | 1.3.1 Info and relationships | 🟢 Minor | Mark the badge `aria-hidden="true"` so headings read "About", "Skills" |
| 4 | Fun-fact answer puts `aria-label` on a `<p>`, which screen readers often ignore | 1.1.1 Non-text content | 🟢 Minor | Replace with visually hidden text: "ad-nap read backwards is pan-da" |

#### Operable
| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|---------------|----------|----------------|
| 5 | The building's 7 floor links are focusable but sit inside an `aria-hidden` SVG, so keyboard users land on links that screen readers can't announce (axe: `aria-hidden-focus`, all 4 runs) | 2.1.1 Keyboard, 4.1.2 | 🔴 Critical | Remove `aria-hidden`/`role="img"` from the SVG and give each floor a readable name ("Contact, roof"). Or take the floors out of the Tab order (`tabindex="-1"`), since the sidebar already has the same links |
| 6 | Day mode: the amber focus ring is 1.67:1 against the sky, nearly invisible | 2.4.7 Focus visible (1.4.11) | 🟡 Major | In day mode use the navy text colour for `:focus-visible`, or add a 2px dark inner ring |
| 7 | Building floors set `outline: none`; the only focus cue is the floor's border turning amber (1.91:1 by day) | 2.4.7 Focus visible | 🟡 Major | Keep a real outline on focused floors, or thicken the border and use a contrasting colour in day mode |
| 8 | Stars twinkle, clouds drift, and the shooting star repeats with no on-page pause; only `prefers-reduced-motion` stops them | 2.2.2 Pause, stop, hide | 🟢 Minor | Make the motion subtle enough to count as decorative, or let the theme toggle area pause sky motion |
| 9 | Touch targets under 44×44px at 390px: theme toggle 34×34, Files 65×33, GitHub/LinkedIn 33px tall, email link 38px tall, Show me 42px tall, building floors 40px tall | 2.5.5 Target size (AAA; listed by the skill) | 🟢 Minor | Raise padding so toggle and buttons reach 44px; everything already passes the 24px AA minimum in WCAG 2.2 |

#### Understandable
| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|---------------|----------|----------------|
| 10 | Theme button is announced "Switch to night, pressed": the label changes and it also reports a pressed state, which contradicts itself | 3.2.4 Consistent identification | 🟢 Minor | Keep one model: a fixed label "Night mode" with `aria-pressed`, or a changing label without `aria-pressed` |

#### Robust
| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|---------------|----------|----------------|
| 11 | Floor link names are machine-ish ("Go to fun", "Go to about") | 4.1.2 Name, role, value | 🟢 Minor | Use section titles: "Go to Fun facts", "Go to About" (fold into fix #5) |

### Color Contrast Check
| Element | Foreground | Background | Ratio | Required | Pass? |
|---------|-----------|------------|-------|----------|-------|
| Body text (night) | #E6EDF5 | #0F1E33 | 14.19:1 | 4.5:1 | ✅ |
| Muted text: dates, captions (night) | #9DB0C7 | #0F1E33 | 7.55:1 | 4.5:1 | ✅ |
| Amber text: org, skill labels (night) | #FFB84D | #0F1E33 | 9.74:1 | 4.5:1 | ✅ |
| Floor tags (night) | #2E4D73 | #0F1E33 | 1.93:1 | 4.5:1 | ❌ |
| Code comment (night) | #6C819C | #0A1626 | 4.55:1 | 4.5:1 | ✅ (barely) |
| Body text (day) | #0F2440 | #DCEDFA | 13.02:1 | 4.5:1 | ✅ |
| Muted text (day) | #4D6584 | #DCEDFA | 5.00:1 | 4.5:1 | ✅ |
| Amber text (day) | #8C5300 | #DCEDFA | 5.23:1 | 4.5:1 | ✅ |
| Floor tags (day) | #7F9FC2 | #DCEDFA | 2.30:1 | 4.5:1 | ❌ |
| Code comment (day) | #6A7F99 | #F3F8FD | 3.85:1 | 4.5:1 | ❌ |
| Placeholder text (day) | #B0174A | #F3F8FD | 6.41:1 | 4.5:1 | ✅ |
| Focus ring (night) | #FFB84D | #0F1E33 | 9.74:1 | 3:1 | ✅ |
| Focus ring (day) | #F2A922 | #DCEDFA | 1.67:1 | 3:1 | ❌ |

### Keyboard Navigation
| Element | Tab Order | Enter/Space | Escape | Arrow Keys |
|---------|-----------|-------------|--------|------------|
| Skip to content | 1 | Jumps to About | n/a | n/a |
| Theme toggle | 2 | Switches theme | n/a | n/a |
| Sidebar files (12 links) | 3–14 | Scrolls to section | n/a | n/a |
| Building floors (7 links) | 15–21 | Scrolls to section; focus also previews the floor | n/a | n/a |
| Show me (riddle) | 22 | Reveals and flips the answer | n/a | n/a |
| Email, GitHub, LinkedIn | 23–25 | Opens link | n/a | n/a |

Order is logical and nothing traps focus. The phone "Files" menu does not close on Escape (minor polish).

### Screen Reader
| Element | Announced As | Issue |
|---------|-------------|-------|
| Building | "figure, A building whose floors are the sections of this site" | Floor links inside are hidden from AT but still focusable (#5) |
| Section headings | "heading level 2, G About" | Badge read as part of the title (#3) |
| Theme toggle | "Switch to night, toggle button, pressed" | Contradictory (#10) |
| Request log | "figure, 330 mocked records loaded in four requests…" | ✅ Good summary |
| Time-saved bars | "figure, Preparation time: about 3 days by hand…" | ✅ Good summary |

### Also checked
- 200% zoom (640px): no horizontal scroll, layout holds ✅
- `prefers-reduced-motion`: all animation off, final states shown ✅
- Landmarks: `main`, `nav`, `complementary` present ✅; skip link works ✅

### Priority Fixes
1. **Building floor links (#5, #11)**: affects keyboard and screen-reader users, who reach links that aren't announced.
2. **Day-mode focus visibility (#6, #7)**: affects keyboard users in day mode, who can't see where focus is.
3. **Contrast (#1, #2)**: affects low-vision readers; two token changes.
4. **Minor polish (#3, #4, #8, #9, #10)**: headings, riddle label, target sizes, toggle semantics.

---

## Re-check after fixes (v4)
**Date:** 2026-10-09 | Same method as above.

| # | Finding | Status | Evidence |
|---|---------|--------|----------|
| 1 | Floor tags contrast | ✅ Fixed | Now `--muted`: 7.55:1 night, 5.00:1 day. Hidden on phones |
| 2 | Day code comments | ✅ Fixed | `#55697F` on `#F3F8FD` = 5.29:1 |
| 3 | Badge read in headings | ✅ Fixed | Headings announce "About", "Skills", … |
| 4 | Riddle label | ✅ Fixed | Announced "ad-nap read backwards is pan-da" |
| 5 | Floor links hidden from AT | ✅ Fixed | 7 links announced, e.g. "Go to Experience, level 2" |
| 6 | Day focus ring | ✅ Fixed | New `--focus` token: navy in day (13.0:1), amber at night (9.7:1) |
| 7 | Floors had no outline | ✅ Fixed | Focused floor gets an outline, a 3px border in the focus colour, and lights up |
| 8 | Sky motion | ✅ Fixed | Twinkle stops after 3 cycles; clouds drift ~10s then hold; shooting star lasts 1.1s |
| 9 | Touch targets | ✅ Fixed | Theme toggle, Files, contact pills, riddle button, skip link ≥44px. Phone floors are 28–33px (above the 24px WCAG 2.2 minimum; the Files menu has the same links) |
| 10 | Toggle semantics | ✅ Fixed | "Night mode, toggle button, pressed/not pressed" |
| 11 | Floor link names | ✅ Fixed | Folded into #5 |
| – | Files menu Escape | ✅ Fixed | Escape closes it and returns focus to Files; tapping outside closes it |

**axe-core:** 0 violations in all 4 runs (night/day × 390/1280). **200% zoom:** no horizontal scroll. **Still to do by a human:** VoiceOver/NVDA pass.
