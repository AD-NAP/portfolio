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
- [?] Keep or remove the cat that sits in an L5 window at night
- [?] Hosting URL: decide where the site should live (see Deploy)

## Site: design and content

- [ ] Building tilts slightly with the mouse (desktop only); not picked, parked
- [ ] Phones: stars sit behind the hero text and read as specks inside letters; keep stars out of the text area or dim them there
- [ ] Phones: status pill ("Systems and Application Engineer at Azbil, Singapore") wraps to two lines; consider a shorter label
- [ ] Favicon (a tiny building, lit at night)
- [ ] Social preview card (Open Graph image and tags) so links look good when shared

## Review findings (2026-10-09)

Full reports: `reviews/2026-10-09-design-critique.md` and `reviews/2026-10-09-accessibility-review.md`.

Accessibility (fix as one batch):
- [ ] 🔴 Building floor links are focusable inside an `aria-hidden` SVG; expose them with readable names, or remove them from the Tab order (a11y #5, #11)
- [ ] 🟡 Day-mode focus ring is 1.67:1; use a dark ring in day mode (a11y #6)
- [ ] 🟡 Building floors have `outline: none`; give focused floors a visible outline (a11y #7)
- [ ] 🟡 Floor tags (`R`, `L5`…`G`) fail contrast in both themes; switch to `--muted` (a11y #1)
- [ ] 🟡 Day-mode code comments are 3.85:1; darken `--code-c` (a11y #2)
- [ ] 🟢 Hide the floor badge from screen readers so headings read "About", not "G About" (a11y #3)
- [ ] 🟢 Riddle answer: replace `aria-label` on `<p>` with visually hidden text (a11y #4)
- [ ] 🟢 Theme toggle: fixed label with `aria-pressed`, or a changing label without it (a11y #10)
- [ ] 🟢 Touch targets to 44px on phones: theme toggle, Files, GitHub/LinkedIn pills (a11y #9)
- [ ] 🟢 Sky motion has no on-page pause (only reduced-motion stops it) (a11y #8)
- [ ] 🟢 Phone Files menu: close on Escape and outside tap

Design:
- [ ] 🔴 Recruiter fast path: email, GitHub, LinkedIn links in the hero (critique priority 1)
- [ ] 🟡 Phones: shrink or reposition the building so About is one swipe away (critique priority 2)
- [ ] 🟡 Stat panels and key numbers are buried in long bullet lists; give each role's headline result more weight
- [ ] 🟢 Consistency: two corner radii (6px panels, round pills); reserve amber for light and progress, not labels
- [ ] 🟢 Reduce desktop section padding from 120px to ~80px
- [ ] 🟢 Status pill looks clickable; make it plain text with the dot
- [ ] 🟢 At night the lit windows outshine the name; consider dimming windows slightly or boosting the name

## Deploy

- [ ] Enable GitHub Pages (**ask Shafik first**)
- [ ] Hosting URL: GitHub only serves a site at the root `https://ad-nap.github.io/` if the repo is named `ad-nap.github.io`. This repo (`autonomous-test.github.io`) would be served at `https://ad-nap.github.io/autonomous-test.github.io/`. Options: rename the repo, or keep it as a test site.
- [ ] Keep working files (this backlog, future CLAUDE.md, `.claude/`) out of the published site

## Learning path (Claude Code building blocks)

- [~] 1. Hands-on v1 with no setup; collect corrections (v1, v2, v3 done, iterating)
- [ ] 2. Turn the corrections log into `CLAUDE.md`
- [ ] 3. Plan mode for a bigger change (Shafik reviews the plan before anything is built)
- [ ] 4. First skill: `design-review` (screenshot at several widths, check contrast, spacing, overflow, fix, repeat). Reference: the Design plugin's `design-critique` and `accessibility-review`
- [ ] 5. First hook (e.g. a link check or screenshot run after edits)
- [ ] 6. First subagent: "recruiter critic" reviewing the site as a hiring manager. Reference: `design-critique`
- [ ] 7. Full autonomous run: one goal in, the agent plans, builds, self-reviews, fixes, deploys

## Corrections log (becomes CLAUDE.md in step 2)

1. Don't put the phone number on the site. Keep the email.
2. Ask for LinkedIn and GitHub URLs; never guess them. Use marked placeholders until then.
3. Never invent facts about Shafik. Use only resume content; mark anything missing as a placeholder and ask.
4. Respect `prefers-reduced-motion`; keep it fast and readable on phones.
5. Ask before enabling GitHub Pages or opening a PR.
6. No photo on the site.
7. Display name is "Shafik Adam", not the full legal name.
8. GitHub is `https://github.com/ad-nap`.
9. Keep the building theme: night is navy with amber lights on; day is a bright sky with lights off. Both themes are required.
10. The background shouldn't feel empty: use sky elements (sun, moon, stars, clouds) that fit the building story.
11. Stats must be easy to read at a glance (the 330-cell grid was rejected).
12. Personality is welcome: fun facts (cats, pandas, the `ad-nap` → `pan-da` riddle).
13. Projects section is on hold until Shafik sends more projects.
14. LinkedIn links to the LinkedIn home page temporarily, until Shafik sends his profile URL.
15. Chosen animations: rare shooting star at night (20-40s apart), floor hover preview, cat tail flick on the fun-facts floor. Mouse tilt was not picked.
16. Use the Design plugin's `design-critique` and `accessibility-review` as the review standard; save reports under `reviews/` and triage findings into this backlog.

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
