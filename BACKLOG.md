# Backlog

Working list for the portfolio site and the Claude Code learning path.
Update it whenever an item is added, finished, or changes status.

Status: `[ ]` to do · `[~]` in progress · `[x]` done · `[?]` waiting on Shafik

---

## Waiting on Shafik

- [?] LinkedIn profile URL (link hidden until then)
- [?] Resume PDF, if you want a download link (design critique, priority 1)
- [?] Make `AD-NAP/edge-energy-optimizer` public: the site links it ("Code on GitHub") and it returns 404 to visitors until then (step 7 critic #1, verified)
- [?] Critic questions only Shafik can answer (step 7): real Cloud BMS or Event Log numbers; what he owned in the MVP beyond the Event Log; where GitHub Actions and SQL were used; NUS start date and the 2018 to 2025 period; whether intern to full-time was a conversion; what roles he is open to
- [?] React Native and Firebase have no evidence on the page now that PomoZoo is gone: bring PomoZoo back as one line, or trim those skills (step 7 critic #6)
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
- [x] 🟢 Reduce desktop section padding from 120px to ~80px (step 7)
- [ ] 🟢 Status pill looks clickable; make it plain text with the dot
- [ ] 🟢 At night the lit windows outshine the name; consider dimming windows slightly or boosting the name

## Recruiter critique (2026-10-09)

Report: `reviews/2026-10-09-recruiter-critic.md`. Verdict: **Interview**, but the strongest proof sits too far down the page.

Shafik's decisions (2026-10-09), to be built in the step 7 run:
- LinkedIn: hide the link (hero and Contact) until he sends the URL.
- Projects: remove PomoZoo; replace it with the best project(s) from his private repo `AD-NAP/vault`, adding more if they fit. Show the pick in the plan first.
- Request log: OK to shrink it so production results get the visual weight.
- Link a project repo that is private for now (he'll make it public); confirm which one.
- Onboarding guide: add the same-day setup result (now in `content/resume.md`).
- Other critic questions (production metrics, tool usage counts): none to add.

- [x] 🔴 Put one line of proof near the top, using resume facts only (~3 days → under 5 minutes; MVP approved by Azbil Japan leadership) (critic #1)
- [x] 🔴 Hide the LinkedIn link in hero and Contact until the real URL arrives (critic #2; decided)
- [x] 🔴 Replace PomoZoo (and its PLACEHOLDER) with the best project(s) from `AD-NAP/vault` (critic #3, #6; decided)
- [x] 🟡 Onboarding guide bullet: add the same-day setup result from `content/resume.md`
- [x] 🟡 Time-saved chart: the empty track is 1.47:1 against the full bar at night, so both bars look full; make the track much fainter (critic #5, verified)
- [x] 🟡 The 330-mock-records log is the biggest graphic but shows a test fixture; shrink it, give production results the visual weight (critic #4; approved)
- [x] 🟢 Tighten spacing in Fun facts and Contact (critic #7; overlaps the section-padding item above)

## Step 7 run (2026-10-09)

Branch `claude/step7-recruiter-critique`. Reports: `reviews/2026-10-09-recruiter-critic-step7-first.md`, `reviews/2026-10-09-recruiter-critic-step7-recheck.md`, `reviews/2026-10-09-design-critique-step7.md`, `reviews/2026-10-09-accessibility-review-step7.md`.

Critic verdict after the fixes: **Maybe for mid-level, Interview for junior or associate** (first report: Interview, levelled junior+). The presentation concerns from the first report are gone; what is left is mostly facts only Shafik can supply (see Waiting on Shafik).

Built:
- [x] Hero proof line: "Cut config preparation from ~3 days to under 5 minutes. Helped build a Cloud BMS MVP approved by Azbil Japan leadership."
- [x] Projects: `edge-energy-optimizer` (phase 1 result, to-scale MAE chart, known limits, repo link). Facts are in `content/resume.md` under "From AD-NAP/vault". No other vault project had anything to show.
- [x] Chart track is the new `--track` token; full bar vs track is 7.36:1 night, 4.93:1 day (was 1.47 and 1.77)
- [x] Request log is a 6px segmented bar with a one-line caption
- [x] From the critic's first pass: Event Log bullet now leads the Azbil engineer role; the project's five-phase list became one status line

Left over:
- [ ] 🟡 Phones: Experience starts on the third screen because About repeats the hero; shorten About or move the Turtle block down (critic #5, #9)
- [ ] 🟢 Day mode: the amber model bar is 1.65:1 against the chart track; deepen the track or the accent slightly
- [ ] 🟢 Sidebar entry `edge-energy-optimizer.md` wraps to two lines at 1280px
- [ ] 🟢 Phone "Files" button: consider "Sections" (critic #9)
- [ ] 🟢 Consider one Azbil entry showing intern then full-time (needs Shafik's answer on the conversion question)

## Deploy

- [x] Make `main` the default branch (done by Shafik)
- [x] GitHub Pages live from `main` at https://ad-nap.github.io/portfolio/ (verified: page, CSS, JS load with no errors in both themes; project files return 404)
- [x] Repo renamed to `AD-NAP/portfolio` (2026-10-09, was `portfolio-v0.1`). Served as a project site at `https://ad-nap.github.io/portfolio/`. A root URL (`https://ad-nap.github.io/`) would need the repo named `ad-nap.github.io`.
- [x] Versions are tagged releases in this one repo (`docs/decisions/0001-one-repo-tagged-releases.md`). `v0.1.0` tagged and released.
- [x] Add screenshots (day and night, phone and desktop) to the `v0.1.0` release
- [x] Keep working files out of the published site: `_config.yml` excludes them (Jekyll 3.10 test build publishes only `index.html` and `assets/`)

## Tooling

- [x] `/design-review` was picked up mid-session (new project skills can load without a restart)
- [x] `recruiter-critic` was registered mid-session too (after a short delay)
- [ ] Confirm the Stop hook fires live. Still unverified after step 7: that session started in `Workspace/`, so this repo's `.claude/settings.json` hook and the `recruiter-critic` agent were not loaded. Start the next session inside `projects/portfolio/`, edit a site file and finish a turn; expect "Running design check on changed site files…"
- [x] Local checker works on the Windows PC (2026-10-09): Node 24 LTS installed with winget; Playwright installed with `npm install --no-save playwright` and `npx playwright install chromium`. Note: a later plain `npm install` removes Playwright again, because it is not in `package.json`
- [ ] Decide whether to add `playwright` to `devDependencies` so the checker installs the same way everywhere
- [ ] The Design plugin skills (`design-critique`, `accessibility-review`) were not available in the step 7 session; its two reports are Claude's self-review in the same format

## Learning path (Claude Code building blocks)

- [x] 1. Hands-on v1 with no setup; collect corrections (v1 to v4)
- [x] 2. Turn the corrections log into `CLAUDE.md` (approved; `content/resume.md` added as the source of facts)
- [x] 3. Plan mode for a bigger change: the v4 accessibility and design fix batch (plan approved, then built)
- [x] 4. First skill: `.claude/skills/design-review/` (SKILL.md plus `scripts/check.js`, run with `npm run -s check`). Tested: catches planted overflow, JS error, contrast and touch-target failures. Available as `/design-review`
- [x] 5. First hook: Stop hook runs the design checker when a turn ends with changed site files; blocks until it passes (max 3 attempts). Pipe-tested: pass, skip-when-unchanged, block ×3, give up, recover
- [x] 6. First subagent: `.claude/agents/recruiter-critic.md` (hiring-manager persona, read-only tools, fixed report format). First run's verdict: Interview. Registered mid-session, callable as `recruiter-critic`
- [~] 7. Full autonomous run: researched, planned, built, self-reviewed and pushed on `claude/step7-recruiter-critique`; waiting for Shafik's go-ahead to merge and deploy

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
