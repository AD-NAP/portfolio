# Shafik Adam portfolio

Single-page portfolio for Shafik Adam, a software engineer in Singapore. Plain HTML/CSS/JS with no build step: `index.html`, `assets/styles.css`, `assets/main.js`. Intended host: GitHub Pages, served from `main`.

The concept: the site is an isometric building, and each floor is a section. It reads top to bottom, the same direction as the scroll: R About, L6 Skills, L5 Experience, L4 Projects, L3 Education, L2 Fun facts, L1 Contact. There is no ground floor (Singapore buildings start at level 1). A hidden basement, B1, opens when a visitor solves the riddle on L2. The sidebar is a file explorer (`about.ttl`, `experience/`, …).

## Working with Shafik
- Shafik is learning Claude Code while we build. At each step, say briefly what you're doing, which Claude Code building block it uses, and what comes next.
- Read `BACKLOG.md` before starting work. Keep it current: tick finished items, add new ones, and keep "Waiting on Shafik" accurate.
- When Shafik gives feedback that is a lasting rule, add it to this file and tell him. One-off tasks go in `BACKLOG.md`.
- Bigger changes (several files, a new section, a layout change) go through plan mode first. Shafik approves the plan before anything is built.
- **Ask first** before changing repo settings (Pages, visibility), opening a PR, or deleting anything that isn't a merged branch.

## Content: never break these
- `content/resume.md` is the only source of facts. Never invent anything about Shafik. If a section needs content he hasn't given, add a visible `PLACEHOLDER: …` and ask him.
- Display name: "Shafik Adam". Email: shafik.adam98@gmail.com. No phone number. No photo.
- Never guess URLs. GitHub is `https://github.com/ad-nap`. No LinkedIn link until Shafik sends his profile URL (hide it rather than link the LinkedIn home page).
- Projects come from Shafik's private repo `AD-NAP/vault` (he approved it as a source). PomoZoo is removed. Copy any project fact you use into `content/resume.md` under a "From AD-NAP/vault" heading, with the source file, before it appears on the site.
- Linking a project repo that is still private is approved by Shafik (he will make it public later). Confirm which repo with him before linking it.

## Design
- Use the `frontend-design` skill for design work, and say how it shaped your choices.
- Two themes, both required:
  - **Night:** navy sky, amber window lights on, moon and stars.
  - **Day:** bright sky, lights off, sun and clouds.
- Colours come from the tokens in `:root` and `[data-theme]` in `styles.css`. Don't hard-code colours in components.
- The background should never feel empty: use sky elements that fit the building story.
- Stats must be readable at a glance, honest, and drawn to scale. A 330-cell grid was rejected as hard to read.
- Personality stays: the riddle on L2 (visitors type Shafik's favourite animal, hinted by `ad-nap` → `pan-da`; the answer is never shown before they solve it), the hidden B1 it unlocks, the perched cat, and the night-only window cat (Shafik confirmed on 2026-10-09 that it stays).
- B1 is a reward, not content: nothing a recruiter needs may live only there. For now it holds a cake.
- The building's light comes from the right, where the sun and moon sit: the front face is lit (`--facade`), the side face is in shade (`--wall-side`).
- Contact links (Email, GitHub, and LinkedIn once available) stay in the hero as well as at the bottom.
- Production results get the visual weight. Test data (e.g. the 330 mocked records) stays small.
- Phones: the building sits small beside the name, so content starts on the first screen.
- Fonts: Bricolage Grotesque (display and body) and Martian Mono (code and file names).

## Motion
- Allowed automatic motion:
  - the windows lighting up on page load;
  - a rare shooting star at night (20–40s apart, about 1s each);
  - ambient sky motion that settles within ~10s.
- Everything else answers the user: theme toggle, floor hover preview, the building leaning a few degrees toward the mouse (desktop with a mouse only), riddle flip, cat tail flick on scroll, request log, timeline fill.
- `prefers-reduced-motion` shows final states with no animation.

## Accessibility (WCAG 2.1 AA; the axe scan must stay at 0 violations)
- Contrast: text ≥ 4.5:1 and focus indicators ≥ 3:1, in both themes. Use the `--focus` token for focus styles.
- Building floors are real links, named like "Go to Experience, level 2", with a visible focus state.
- Touch targets ≥ 44px on phones. Mark decorative graphics `aria-hidden="true"`.

## Before saying a change is done
Use the `design-review` skill (`.claude/skills/design-review/`). Its checker, `npm run -s check`, serves the site, screenshots both themes at 390px and 1280px, and fails on overflow, JS errors, axe violations, token contrast, small touch targets or broken reduced motion. It repeats the checks with B1 open and tests the riddle itself. Then look at the contact sheets, fix, and re-check. Playwright and Chromium are preinstalled; don't run `playwright install`.
A Stop hook (`.claude/settings.json` → `.claude/hooks/design-check-on-stop.js`) runs the same checker automatically when a turn ends with changed site files, and blocks finishing until it passes (3 attempts, then it warns instead). Don't work around it: fix what it reports.

## Git
- Shafik trusts Claude's judgement here (2026-10-09): commit, push, merge to `main` and tag without asking. Report what was done afterwards.
- Commit each finished, checked piece of work, with a message saying what changed and why, and push it.
- Small changes (docs, backlog, fixes) go straight to `main`. Bigger changes go on a short-lived branch (or the session's assigned `claude/…` branch), merged into `main` once the check passes, then deleted.
- Versions are annotated tags on `main` with a GitHub Release each (notes and screenshots). Minor bump (`v0.2.0`) for a visible milestone, patch bump (`v0.1.1`) for fixes to a release. Update the versions table in `README.md` with each release. No version branches or per-version repos.
- Never force-push, rewrite pushed history, or move a published tag.
