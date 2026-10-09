# Backlog

Working list for the portfolio site and the Claude Code learning path.
Update it whenever an item is added, finished, or changes status.

Status: `[ ]` to do · `[~]` in progress · `[x]` done · `[?]` waiting on Shafik

---

## Waiting on Shafik

- [?] LinkedIn URL (contact section shows a marked placeholder until then)
- [?] More projects to add (Projects section is on hold until these arrive)
- [?] PomoZoo screenshot or link (placeholder in the card)
- [?] Pick animations from the idea list below, or none
- [?] Keep or remove the cat that sits in an L5 window at night
- [?] Hosting URL: decide where the site should live (see Deploy)

## Site: design and content

- [ ] Animation ideas (pending Shafik's pick)
  - [ ] Rare shooting star at night (at most once every ~20s)
  - [ ] Hovering a floor lights only that floor, as a preview
  - [ ] Building tilts slightly with the mouse (desktop only)
  - [ ] Cat's tail flicks once when the fun-facts floor scrolls into view
- [ ] Phones: stars sit behind the hero text and read as specks inside letters; keep stars out of the text area or dim them there
- [ ] Phones: status pill ("Systems and Application Engineer at Azbil, Singapore") wraps to two lines; consider a shorter label
- [ ] Favicon (a tiny building, lit at night)
- [ ] Social preview card (Open Graph image and tags) so links look good when shared
- [ ] Run `design-critique` on both themes at 390px and 1280px, then triage the findings into this file
- [ ] Run `accessibility-review`: contrast of muted text in day mode, keyboard order through the SVG floors, screen-reader labels on the building and riddle

## Deploy

- [ ] Enable GitHub Pages (**ask Shafik first**)
- [ ] Hosting URL: GitHub only serves a site at the root `https://ad-nap.github.io/` if the repo is named `ad-nap.github.io`. This repo (`autonomous-test.github.io`) would be served at `https://ad-nap.github.io/autonomous-test.github.io/`. Options: rename the repo, or keep it as a test site.
- [ ] Keep working files (this backlog, future CLAUDE.md, `.claude/`) out of the published site

## Learning path (Claude Code building blocks)

- [~] 1. Hands-on v1 with no setup; collect corrections (v1 and v2 done, iterating)
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

## Done

- [x] v1: building-themed single page, file-explorer nav, scroll-filled timeline, to-scale stats (commit `a77d751`)
- [x] v2: day/night themes with sun/moon swap and window cascade (commit `605fa5c`)
- [x] v2: hero renamed to "Shafik Adam"
- [x] v2: 330-cell grid replaced with a 4-request log and segmented bar
- [x] v2: GitHub link added
- [x] v2: fun-facts floor with the panda riddle and the night-time cat
- [x] Found the Design plugin (`design-critique`, `accessibility-review`) and showed the install card
