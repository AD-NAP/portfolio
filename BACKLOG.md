# Backlog

Working list for the portfolio site and the Claude Code learning path.
Update it whenever an item is added, finished, or changes status.

Status: `[ ]` to do · `[~]` in progress · `[x]` done · `[?]` waiting on Shafik

---

## Waiting on Shafik

- [?] Publish v1.1.0 on github.com: tag `v1.1.0` on the latest `main`, title "v1.1.0: The build log, Issue 2", notes from `docs/releases/v1.1.0.md`
- [?] Recruiter critic's questions (2026-11-18): cumulus-coach eval results; a demo, screenshot or recording of cumulus-coach; anything shareable about the metadata generator's effect; junior or mid-level target
- [?] Delete the two merged branches on GitHub (Branches → bin icon): `claude/ecstatic-dijkstra-wwvvi2` and `claude/beautiful-meitner-lxxr21`. Cloud sessions can't delete remote branches
- [x] Page order: Experience now comes before Projects (Shafik, 2026-11-18)
- [x] Section names are plain: Experience, Projects, Lessons learned, Skills, Education, Contact (Shafik, 2026-11-18)
- [x] TypeScript: Cloud BMS is Svelte and AWS CDK in TypeScript; shown on the page and in Skills (Shafik, 2026-11-18)
- [x] Riddle reset button in the centrefold; the cat moved from the cover to the riddle card (Shafik, 2026-11-18)
- [?] Shareable numbers: Event Log page size or volumes, tests or IaC for Cloud BMS, how much the metadata generator and config tool are used
- [?] cumulus-coach eval results (RAG agent vs tool agent), to add to the chart and a cover line
- [?] Where SQL and React were used (both are in Skills with no evidence on the page). GitHub Actions answered 2026-10-22: he worked with the team's pipeline, set up by a senior; cumulus-coach will add CI/CD he builds himself
- [~] LLM or AI engineering work to show: cumulus-coach (the AWS study agent: RAG, tool calling, eval, Docker, CI) will cover it, after the demo ships around 2026-10-30
- [?] Enable the Design plugin (install card shown 2026-10-09 and again 2026-10-22) so `design-critique` and `accessibility-review` are available

## v1.1.0: Issue 2, the name card (2026-11-18)

Decision: `docs/decisions/0003-name-card-and-new-inks.md`. Reviews: `reviews/2026-11-18-recruiter-critic-v1.1.md`, `reviews/2026-11-18-finish-review-v1.1.md`.

- [x] Grey and red inks across the site (tokens `--accent`, `--on-accent`, `--desk`)
- [x] Meishi name card first, handed over on load; scrubbed, pinned flip into the cover; returning visitors skip it
- [x] Intro line and links under the card (recruiter critic); card and cover pinned together, real 3D turn, CSS variables only (finish review)
- [x] Checker: card tests (first screen, button, returning visitor, replay, keyboard focus)
- [x] Docs, DESIGN.md regenerated, og.png from the card, release notes
- [ ] Thumbs holding the card during the hand-over: not built (the plan allowed it only if it read cleanly); revisit if wanted
- [ ] Ceiling ideas (finish review): a physical edge or thickness during the turn; the card back carrying the zine's title block
- [ ] Motion review: Shafik can run `/review-animations` on the hand-over and the flip (Claude cannot start that skill)
- [ ] Note: Impeccable's rendered scan reports the cover "occluded" by the card at the top of the page. That is the design (the card lies over the cover until the flip), and keyboard focus is handled; the scan's ignores cannot target rendered scans

## v1.0.0: The build log, a riso zine (2026-11-18)

Brainstormed with frontend-design and Impeccable `shape`; Shafik chose the riso zine. Decision: `docs/decisions/0002-riso-zine-redesign.md`. Reviews: `reviews/2026-11-18-recruiter-critic-v1.0.md`, `reviews/2026-11-18-finish-review-v1.0.md`.

- [x] Rebuild the page as a two-ink zine: cover with cover lines, spreads, back page, hidden centrefold
- [x] Day and night prints, Anybody + Literata, text-shadow misregistration, print run on load
- [x] Design checker retargeted (centrefold, ink tokens, finished print under reduced motion)
- [x] Recruiter critic and Impeccable finish review: all material fixes applied
- [x] CLAUDE.md, PRODUCT.md, DESIGN.md, architecture, README rewritten; favicon and og.png redone
- [x] v1.0.0 published 2026-11-18 by Shafik on github.com (the release form created a lightweight tag on `2955bce`; cloud sessions can't push tags)
- [x] GSAP skills installed (6 of GreenSock's official skills) and a trial feature: section titles print on scroll, scrubbed (2026-11-18)
- [ ] Decide after trying it: keep the scroll print, tune it, or remove it. Other scroll ideas, each needing Shafik's approval: charts filling to scale as they come into view, cover-line page numbers ticking as you move through the issue
- [ ] Ceiling ideas from the finish review: a cover-scale nameplate, page furniture (edges, fold, bigger folios), real overprint on chart fills, crop marks on trim lines, a two-ink cake

## Site: design and content

- [x] Phones: stars sit behind the hero text and read as specks inside letters; keep stars out of the text area or dim them there
- [x] Phones: status pill ("Systems and Application Engineer at Azbil, Singapore") wraps to two lines; consider a shorter label or plain text
- [x] Phones: the sun is partly tucked under the top bar in day mode
- [x] Favicon (a tiny building, lit at night)
- [x] Social preview card (Open Graph image and tags) so links look good when shared

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
- [x] 🟡 Stat panels and key numbers are buried in long bullet lists; give each role's headline result more weight
- [x] 🟢 Consistency: two corner radii (6px panels, round pills); reserve amber for light and progress, not labels
- [x] 🟢 Reduce desktop section padding from 120px to ~80px (step 7)
- [x] 🟢 Status pill looks clickable; make it plain text with the dot
- [x] 🟢 At night the lit windows outshine the name; consider dimming windows slightly or boosting the name

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
- [x] 🟡 Phones: Experience starts on the third screen because About repeats the hero; shorten About or move the Turtle block down (critic #5, #9)
- [x] 🟢 Day mode: the amber model bar is 1.65:1 against the chart track; deepen the track or the accent slightly
- [x] 🟢 Sidebar entry `edge-energy-optimizer.md` wraps to two lines at 1280px
- [x] 🟢 Phone "Files" button: consider "Sections" (critic #9)
- [x] 🟢 Azbil engineer role now says it was a conversion from the internship (v0.1.1)

## v0.1.1: Shafik's answers (2026-10-09)

- [x] `AD-NAP/edge-energy-optimizer` made public (history scanned for secrets first: none); the "Code on GitHub" link returns 200
- [x] Skills: React Native and Firebase trimmed
- [x] Cloud BMS MVP bullet says what he owned: the Event Log, plus help on other small features and bug fixes
- [x] NUS shows 2021 to Jan 2026
- [x] Contact says he is open to backend software development and AI engineering roles
- [x] All new facts recorded in `content/resume.md`

## v0.3.2: Ground Labs dates fixed (2026-10-22)

- [x] Ground Labs internship was dated Aug 2019 to Nov 2019 by mistake. Now May 2022 to Aug 2022 on the page, in `content/resume.md` and in the resume PDF. The `reviews/` reports from 2026-10-09 still say 2019; they are dated records and stay as they are

## v0.3.1: Shafik's answers (2026-10-22)

- [x] LinkedIn link in the hero and Contact: https://www.linkedin.com/in/shafikadam/
- [x] Resume PDF download (`assets/Shafik-Adam-Resume.pdf`) in the hero and Contact: the vault master CV, phone number removed (design critique, priority 1)
- [x] Cloud BMS or Event Log numbers: none to share yet. No real users; the MVP has approval to continue development and looks promising for certain markets
- [x] edge-energy-optimizer started 2026-10-04 (first commit, same day as phase 1). The site's "Oct 2026" is already right
- [x] May 2018 to 2021: full-time National Service. Recorded in `content/resume.md`, not shown on the site
- [x] Regenerate the PDF after cumulus-coach was added to the master CV (done 2026-10-31 in v0.4.0, now `npm run -s resume`)
- [ ] Rebuild the PDF whenever the vault master CV changes: `npm run -s resume`

## v0.2.0: isometric building (planned, 2026-10-09)

Shafik's goals. Goes through plan mode first.

Plan approved 2026-10-09. Branch `claude/v0.2-isometric`. Decisions: floors are R About, L6 Skills, L5 Experience, L4 Projects, L3 Education, L2 Fun facts, L1 Contact; B1 unlocks by typing the answer; the night window cat stays (now on L2).

- [x] Step 1: flip the order, rooftop first, down to level 1. Ground floor removed (`11c0dc6`)
- [x] Step 2: isometric building that leans a few degrees toward the mouse (desktop with a mouse only; off on phones and under reduced motion)
- [x] Step 3: the riddle is a typed guess that unlocks a hidden B1 level (section, `b1/cake.md` in the explorer, a dashed storey under the building). It stays open on later visits. Content for now: a cake
- [x] Checker: extra pass with B1 open, plus a test of the riddle; docs updated (`CLAUDE.md`, `docs/architecture.md`, the skill)
- [ ] B1 needs real content one day (Shafik: empty for now)
- [ ] 🟢 The B1 storey appears without an animation, because the visitor is on L2 when it unlocks and would not see one
- [x] `recruiter-critic` run before the merge: no blockers, verdict unchanged (Interview for junior or associate, Maybe for mid-level). Report: `reviews/2026-10-09-recruiter-critic-v0.2.md`. Its project date finding is fixed
- [x] Merged to `main`, tagged and released `v0.2.0` (2026-10-09)
- [x] 🟢 Night, desktop: a star sits right behind the "R" floor tag and reads as a strike-through (v0.2 critic #5)
- [ ] 🟢 Roof focus ring: the deck's front edges are covered by level 6's outline, so only the roof room shows the ring. Visible, but could be cleaner
- [ ] 🟢 Sidebar mini building still has the old flat shape with a wide base

## v0.3.0: phone fixes and polish (2026-10-20)

Plan approved 2026-10-20. Branch `claude/v0.3-phone-polish`.

- [x] Phones: Experience heading at 1609px on a 390x844 screen (was 2180px). Turtle block collapses behind "View as shafik.ttl"; Skills rows put the label beside the list; tighter section spacing
- [x] Phones: 35 fainter stars and a sky-coloured text halo at night, so stars no longer read as specks in letters
- [x] Status is plain text with the dot; phones drop ", Singapore" so it fits one line
- [x] Headline result per Azbil role: MVP approval line for the engineer role, the to-scale chart moved above the bullets for the intern role
- [x] Two radii only (6px panels, round pills); labels moved from amber to muted; new `--lit` token dims night windows slightly
- [x] `assets/favicon.svg` and `assets/og.png` with Open Graph and Twitter tags
- [ ] 🟢 `og.png` is a static screenshot; re-render it if the hero changes (see `docs/architecture.md`)

## v0.4.0: cumulus-coach and backlog fixes (2026-10-31)

Plan approved 2026-10-31. Branch `claude/v0.4-cumulus-coach`.

- [x] cumulus-coach on L4, first: purpose, a to-scale chart of the measured distances behind the 1.1 cutoff, 3 bullets, status, stack, repo link. Facts in `content/resume.md` with sources. Answers the old "any LLM or AI work to show?" question
- [x] Sidebar entry `projects/cumulus-coach.md`; Skills row "AI & LLM"; "Familiar: Java" folded into Languages, as in the master CV
- [x] Hero says "and LLM applications"; meta descriptions and `og.png` updated to match
- [x] Phones: Experience heading at 1655px on a 390x844 screen (under the 1688px target), after slightly tighter phone spacing and hero type
- [x] Resume PDF rebuilt from the master CV (adds cumulus-coach and the GitHub link), one page, no phone number. `tools/build-resume.js`, run with `npm run -s resume`
- [x] Day-mode result bars use a new `--bar-result` token (deeper amber, 3:1 against the track)
- [x] Sidebar is 260px wide and file names never wrap
- [x] Phone menu button says "Sections"
- [x] Night text halo now at all widths (off on the code block, which has its own background); floor tags have a solid fill
- [x] `playwright@1.64.0` in `devDependencies`
- [ ] 🟢 Update the cumulus-coach card when the eval set lands (its next milestone)

## edge-energy-optimizer phase 2 (2026-11-16, released as v0.4.1)

- [x] Project card: phases 1 and 2 done, phases 3 to 5 parked. Phase 2 bullets for the look-ahead heuristic and the MPC. Facts in `content/resume.md` with sources
- [x] Resume PDF rebuilt from the master CV updated 16-11-2026. One page, no phone number
- [x] `tools/build-resume.js`: the master CV now writes links as Markdown (`[text](url)`); the builder strips them to plain text before linking. Line height 1.27 to 1.23 so the longer CV stays on one page
- [ ] 🟢 Resume PDF: the long edge-energy-optimizer heading pushes its repo link onto a second line

## v0.5.0: design skills and polish (2026-11-17)

Plan approved 2026-11-17. Branch `claude/beautiful-meitner-lxxr21`. Report: `reviews/2026-11-17-skills-review.md`.

- [x] Researched outside UI skills. React Bits (pro.reactbits.dev) needs React, so kept plain HTML; picked Impeccable and Emil Kowalski's skills
- [x] Installed Impeccable (skill, 5 agents, design hook on edits and at turn end) and 12 of Emil's skills into `.claude/`. Sources, commits and licences in `.claude/skills/THIRD_PARTY.md`. Impeccable telemetry off
- [x] `PRODUCT.md` and `DESIGN.md` written for Impeccable (CLAUDE.md wins on conflicts)
- [x] Review: Impeccable detector (source and rendered page) and critique, Emil's `improve-animations`, `mobile-native` and `break-ui` checks
- [x] Fixes: phone skills label overlap, 16px riddle input (no iPhone zoom), shorter lines (60ch), no card inside a card, hover only on hover devices, press feedback, status dot ping removed, star twinkle settles by ~8s, cheaper building lean, motion tokens, `theme-color`, themed text selection
- [x] Checker uses the preinstalled Chromium in cloud sessions (`check.js`)
- [x] Detector clean on the rendered page at 1280px and 390px; rejected findings recorded as ignores with reasons in `.impeccable/config.json`

### Ideas from the skills review (Shafik picks)
- [ ] 🟡 Desktop floors leave the right ~40% empty: a second column for charts beside role text, or a side rail with the floor's level and file name
- [ ] 🟢 Consolidate the 13 font sizes into 5 or 6 size tokens
- [ ] 🟢 B1 reveal: light the basement windows one by one when the riddle is solved
- [ ] 🟢 Phone "Sections" menu: 180ms fade and small drop instead of appearing at once
- [ ] 🟢 Optional: a small to-scale chart for edge-energy-optimizer phase 2 (14% to 20% cost cut); the number is already in `content/resume.md` (recruiter critic, `reviews/2026-11-17-recruiter-critic-v0.5.md`)

Recruiter critic after the fixes: **Interview** (junior to early mid-level). Its concern that the test-data chart looked like a production chart was fixed (no amber on it), and the hero proof line is a size bigger.

## Deploy

- [x] Make `main` the default branch (done by Shafik)
- [x] GitHub Pages live from `main` at https://ad-nap.github.io/portfolio/ (verified: page, CSS, JS load with no errors in both themes; project files return 404)
- [x] Repo renamed to `AD-NAP/portfolio` (2026-10-09, was `portfolio-v0.1`). Served as a project site at `https://ad-nap.github.io/portfolio/`. A root URL (`https://ad-nap.github.io/`) would need the repo named `ad-nap.github.io`.
- [x] Versions are tagged releases in this one repo (`docs/decisions/0001-one-repo-tagged-releases.md`). `v0.1.0` tagged and released.
- [x] Add screenshots (day and night, phone and desktop) to the `v0.1.0` release
- [x] Step 7 deployed (2026-10-09, `13c330e`). Pages had been switched to source "GitHub Actions" with no workflow, so pushes did not deploy; set back to "Deploy from a branch: main" with Shafik's approval. Verified live: page, CSS and JS return 200 with no console errors in both themes; `CLAUDE.md`, `BACKLOG.md`, `README.md`, `content/`, `reviews/`, `docs/`, `package.json`, `_config.yml` and `.claude/` return 404
- [x] `v0.1.1` tagged and released (2026-10-09): step 7 plus Shafik's answers. Shafik reserved `v0.2.0` for the isometric rebuild
- [x] Keep working files out of the published site: `_config.yml` excludes them (Jekyll 3.10 test build publishes only `index.html` and `assets/`)

## Tooling

- [x] `/design-review` was picked up mid-session (new project skills can load without a restart)
- [x] `recruiter-critic` was registered mid-session too (after a short delay)
- [ ] Confirm the Stop hook fires live. Still unverified after step 7: that session started in `Workspace/`, so this repo's `.claude/settings.json` hook and the `recruiter-critic` agent were not loaded. Start the next session inside `projects/portfolio/`, edit a site file and finish a turn; expect "Running design check on changed site files…"
- [x] Local checker works on the Windows PC (2026-10-09): Node 24 LTS installed with winget; Playwright installed with `npm install --no-save playwright` and `npx playwright install chromium`. Note: a later plain `npm install` removes Playwright again, because it is not in `package.json`
- [x] Decide whether to add `playwright` to `devDependencies` so the checker installs the same way everywhere
- [ ] The Design plugin is not enabled (checked 2026-10-09: only `frontend-design` is). It is in the catalog as "Design" by Anthropic; install card shown, waiting on Shafik. The step 7 reports are Claude's self-review in the same format

## Learning path (Claude Code building blocks)

- [x] 1. Hands-on v1 with no setup; collect corrections (v1 to v4)
- [x] 2. Turn the corrections log into `CLAUDE.md` (approved; `content/resume.md` added as the source of facts)
- [x] 3. Plan mode for a bigger change: the v4 accessibility and design fix batch (plan approved, then built)
- [x] 4. First skill: `.claude/skills/design-review/` (SKILL.md plus `scripts/check.js`, run with `npm run -s check`). Tested: catches planted overflow, JS error, contrast and touch-target failures. Available as `/design-review`
- [x] 5. First hook: Stop hook runs the design checker when a turn ends with changed site files; blocks until it passes (max 3 attempts). Pipe-tested: pass, skip-when-unchanged, block ×3, give up, recover
- [x] 6. First subagent: `.claude/agents/recruiter-critic.md` (hiring-manager persona, read-only tools, fixed report format). First run's verdict: Interview. Registered mid-session, callable as `recruiter-critic`
- [x] 7. Full autonomous run: researched, planned, built, self-reviewed, merged (`13c330e`) and deployed on 2026-10-09 after Shafik's go-ahead

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
