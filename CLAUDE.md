# Shafik Adam portfolio

Single-page portfolio for Shafik Adam, a software engineer in Singapore. Plain HTML/CSS/JS with no build step: `index.html`, `assets/styles.css`, `assets/main.js`. Intended host: GitHub Pages, served from `main`.

The concept: the site is a building, and each floor is a section (G About, L1 Skills, L2 Experience, L3 Projects, L4 Education, L5 Fun facts, R Contact). The sidebar is a file explorer (`about.ttl`, `experience/`, …).

## Working with Shafik
- Shafik is learning Claude Code while we build. At each step, say briefly what you're doing, which Claude Code building block it uses, and what comes next.
- Read `BACKLOG.md` before starting work. Keep it current: tick finished items, add new ones, and keep "Waiting on Shafik" accurate.
- When Shafik gives feedback that is a lasting rule, add it to this file and tell him. One-off tasks go in `BACKLOG.md`.
- Bigger changes (several files, a new section, a layout change) go through plan mode first. Shafik approves the plan before anything is built.
- **Ask first** before enabling GitHub Pages, opening a PR, merging into `main`, or deleting anything.

## Content: never break these
- `content/resume.md` is the only source of facts. Never invent anything about Shafik. If a section needs content he hasn't given, add a visible `PLACEHOLDER: …` and ask him.
- Display name: "Shafik Adam". Email: shafik.adam98@gmail.com. No phone number. No photo.
- Never guess URLs. GitHub is `https://github.com/ad-nap`. LinkedIn temporarily points to the LinkedIn home page until Shafik sends his profile URL.
- The Projects section is on hold until Shafik sends more projects.

## Design
- Use the `frontend-design` skill for design work, and say how it shaped your choices.
- Two themes, both required:
  - **Night:** navy sky, amber window lights on, moon and stars.
  - **Day:** bright sky, lights off, sun and clouds.
- Colours come from the tokens in `:root` and `[data-theme]` in `styles.css`. Don't hard-code colours in components.
- The background should never feel empty: use sky elements that fit the building story.
- Stats must be readable at a glance, honest, and drawn to scale. A 330-cell grid was rejected as hard to read.
- Personality stays: fun facts (cats and pandas, the `ad-nap` → `pan-da` riddle), the perched cat, and the night-only window cat.
- Contact links (Email, GitHub, LinkedIn) stay in the hero as well as at the bottom.
- Phones: the building sits small beside the name, so content starts on the first screen.
- Fonts: Bricolage Grotesque (display and body) and Martian Mono (code and file names).

## Motion
- Allowed automatic motion:
  - the windows lighting up on page load;
  - a rare shooting star at night (20–40s apart, about 1s each);
  - ambient sky motion that settles within ~10s.
- Everything else answers the user: theme toggle, floor hover preview, riddle flip, cat tail flick on scroll, request log, timeline fill.
- `prefers-reduced-motion` shows final states with no animation.

## Accessibility (WCAG 2.1 AA; the axe scan must stay at 0 violations)
- Contrast: text ≥ 4.5:1 and focus indicators ≥ 3:1, in both themes. Use the `--focus` token for focus styles.
- Building floors are real links, named like "Go to Experience, level 2", with a visible focus state.
- Touch targets ≥ 44px on phones. Mark decorative graphics `aria-hidden="true"`.

## Before saying a change is done
Use the `design-review` skill (`.claude/skills/design-review/`). Its checker, `npm run -s check`, serves the site, screenshots both themes at 390px and 1280px, and fails on overflow, JS errors, axe violations, token contrast, small touch targets or broken reduced motion. Then look at the contact sheets, fix, and re-check. Playwright and Chromium are preinstalled; don't run `playwright install`.
A Stop hook (`.claude/settings.json` → `.claude/hooks/design-check-on-stop.js`) runs the same checker automatically when a turn ends with changed site files, and blocks finishing until it passes (3 attempts, then it warns instead). Don't work around it: fix what it reports.

## Git
- Work on the session's assigned `claude/…` branch. Commit each version worth keeping, with a message saying what changed and why, and push it.
- `main` only changes when Shafik asks for a merge.
