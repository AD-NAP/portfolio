# Backlog

Working list for the portfolio site and the Claude Code learning path.
Update it whenever an item is added, finished, or changes status.

Status: `[ ]` to do · `[~]` in progress · `[x]` done · `[?]` waiting on Shafik

---

## Waiting on Shafik

- [?] LinkedIn profile URL (currently links to the LinkedIn home page as a stand-in)
- [?] Resume PDF, if you want a download link (design critique, priority 1)
- [?] More projects to add (Projects section is on hold until these arrive)
- [?] PomoZoo screenshot or link (placeholder in the card)
- [?] Public repos worth linking for a backend role (recruiter critic #6)
- [?] Any shareable production results: Event Log / Cloud BMS rollout, how often the config tool has been used, onboarding-guide effect (recruiter critic questions; only if real and shareable)
- [?] Keep or remove the cat that sits in an L5 window at night

## Site: design and content

- [ ] Building tilts slightly with the mouse (desktop only); not picked, parked
- [ ] Phones: stars sit behind the hero text and read as specks inside letters; keep stars out of the text area or dim them there
- [ ] Phones: status pill ("Systems and Application Engineer at Azbil, Singapore") wraps to two lines; consider a shorter label or plain text
- [ ] Phones: the sun is partly tucked under the top bar in day mode
- [ ] Favicon (a tiny building, lit at night)
- [ ] Social preview card (Open Graph image and tags) so links look good when shared

## Review findings (2026-10-09)

Full reports: `reviews/2026-10-09-design-critique.md` and `reviews/2026-10-09-accessibility-review.md`.

Accessibility (all fixed in v4; see the re-check section of the report):
- [x] 🔴 Building floor links are focusable inside an `aria-hidden` SVG; expose them with readable names, or remove them from the Tab order (a11y #5, #11)
- [x] 🟡 Day-mode focus ring is 1.67:1; use a dark ring in day mode (a11y #6)
- [x] 🟡 Building floors have `outline: none`; give focused floors a visible outline (a11y #7)
- [x] 🟡 Floor tags (`R`, `L5`…`G`) fail contrast in both themes; switch to `--muted` (a11y #1)
- [x] 🟡 Day-mode code comments are 3.85:1; darken `--code-c` (a11y #2)
- [x] 🟢 Hide the floor badge from screen readers so headings read "About", not "G About" (a11y #3)
- [x] 🟢 Riddle answer: replace `aria-label` on `<p>` with visually hidden text (a11y #4)
- [x] 🟢 Theme toggle: fixed label with `aria-pressed`, or a changing label without it (a11y #10)
- [x] 🟢 Touch targets to 44px on phones: theme toggle, Files, GitHub/LinkedIn pills (a11y #9)
- [x] 🟢 Sky motion has no on-page pause (only reduced-motion stops it) (a11y #8)
- [x] 🟢 Phone Files menu: close on Escape and outside tap

Design:
- [x] 🔴 Recruiter fast path: email, GitHub, LinkedIn links in the hero (critique priority 1)
- [x] 🟡 Phones: small building beside the name; About now starts on the first screen (critique priority 2)
- [ ] 🟡 Stat panels and key numbers are buried in long bullet lists; give each role's headline result more weight
- [ ] 🟢 Consistency: two corner radii (6px panels, round pills); reserve amber for light and progress, not labels
- [ ] 🟢 Reduce desktop section padding from 120px to ~80px
- [ ] 🟢 Status pill looks clickable; make it plain text with the dot
- [ ] 🟢 At night the lit windows outshine the name; consider dimming windows slightly or boosting the name

## Recruiter critique (2026-10-09)

Report: `reviews/2026-10-09-recruiter-critic.md`. Verdict: **Interview**, but the strongest proof sits too far down the page.
- [ ] 🔴 Put one line of proof near the top, using resume facts only (~3 days → under 5 minutes; MVP approved by Azbil Japan leadership) (critic #1)
- [ ] 🔴 LinkedIn points to the LinkedIn home page in hero and Contact; hide it until the real URL arrives, or swap it in (critic #2; needs Shafik's call)
- [ ] 🟡 Visible PomoZoo `PLACEHOLDER` reads as unfinished on a live site; hide it while Projects is on hold (critic #3; needs Shafik's call)
- [ ] 🟡 Time-saved chart: the empty track is 1.47:1 against the full bar at night, so both bars look full; make the track much fainter (critic #5, verified)
- [ ] 🟡 The 330-mock-records log is the biggest graphic but shows a test fixture; shrink it, give production results the visual weight (critic #4; the log was Shafik's pick, so ask first)
- [ ] 🟢 Tighten spacing in Fun facts and Contact (critic #7; overlaps the section-padding item above)

## Deploy

- [x] Make `main` the default branch (done by Shafik)
- [x] GitHub Pages live from `main` at https://ad-nap.github.io/portfolio-v0.1/ (verified: page, CSS, JS load with no errors in both themes; project files return 404)
- [x] Repo renamed to `AD-NAP/portfolio-v0.1` (2026-10-09). Served as a project site at `https://ad-nap.github.io/portfolio-v0.1/`. A root URL (`https://ad-nap.github.io/`) would need the repo named `ad-nap.github.io`.
- [x] Keep working files out of the published site: `_config.yml` excludes them (Jekyll 3.10 test build publishes only `index.html` and `assets/`)

## Tooling

- [x] `/design-review` was picked up mid-session (new project skills can load without a restart)
- [ ] Confirm `recruiter-critic` is listed as an agent in the next session (subagents load at session start, unlike skills)
- [ ] Confirm the Stop hook fires live: in the next session, edit a site file and finish a turn; expect "Running design check on changed site files…"

## Learning path (Claude Code building blocks)

- [x] 1. Hands-on v1 with no setup; collect corrections (v1 to v4)
- [x] 2. Turn the corrections log into `CLAUDE.md` (approved; `content/resume.md` added as the source of facts)
- [x] 3. Plan mode for a bigger change: the v4 accessibility and design fix batch (plan approved, then built)
- [x] 4. First skill: `.claude/skills/design-review/` (SKILL.md plus `scripts/check.js`, run with `npm run -s check`). Tested: catches planted overflow, JS error, contrast and touch-target failures. Available as `/design-review`
- [x] 5. First hook: Stop hook runs the design checker when a turn ends with changed site files; blocks until it passes (max 3 attempts). Pipe-tested: pass, skip-when-unchanged, block ×3, give up, recover
- [x] 6. First subagent: `.claude/agents/recruiter-critic.md` (hiring-manager persona, read-only tools, fixed report format). First run's verdict: Interview. Callable by name from the next session
- [ ] 7. Full autonomous run: one goal in, the agent plans, builds, self-reviews, fixes, deploys

## Corrections log

Moved into `CLAUDE.md` in step 2 (all 20 entries). New lasting rules go straight into `CLAUDE.md`; one-off tasks go in this file.

## Done

- [x] v1: building-themed single page, file-explorer nav, scroll-filled timeline, to-scale stats (commit `a77d751`)
- [x] v2: day/night themes with sun/moon swap and window cascade (commit `605fa5c`)
- [x] v2: hero renamed to "Shafik Adam"
- [x] v2: 330-cell grid replaced with a 4-request log and segmented bar
- [x] v2: GitHub link added
- [x] v2: fun-facts floor with the panda riddle and the night-time cat
- [x] Design plugin installed (`design-critique`, `accessibility-review`)
- [x] v3: shooting star, floor hover preview, perched cat with tail flick, LinkedIn link (commit `6f05f35`)
- [x] First design critique and accessibility review run and triaged (see Review findings)
- [x] Merged everything into `main` (created `main` at `5de676b`)
- [x] Merged v4 into `main` (`2924b09`)
- [x] v4: all 11 accessibility findings fixed, hero contact links, phone hero with small building (axe: 0 violations)
