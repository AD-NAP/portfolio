# Shafik Adam portfolio

Single-page portfolio for Shafik Adam, a software engineer in Singapore. Plain HTML/CSS/JS with no build step: `index.html`, `assets/styles.css`, `assets/main.js`. Intended host: GitHub Pages, served from `main`.

The concept (since v1.0.0, 2026-11-18): the site is **The build log**, a self-published two-ink riso zine by a builder and learner. Each minor or major release is a new issue (v1.0.0 is Issue 1, v1.1.0 Issue 2); a patch is a reprint. Update the masthead and colophon with each issue. It reads top to bottom: the cover, then spreads with plain names: Experience (pp. 2–3), Projects (pp. 4–5), Lessons learned (pp. 6–7), Skills and Education (pp. 8–9), and a back page, Contact, with the riddle. Experience comes before Projects, and section names stay plain so recruiters can scan them; the zine voice lives in the look, the masthead and the cover lines (Shafik, 2026-11-18). A hidden centrefold opens when a visitor solves the riddle. The masthead holds the zine's title, its contents and the print toggle. The isometric building (v0.2.0 to v0.5.0) is retired; see `docs/decisions/0002-riso-zine-redesign.md`.

## Working with Shafik
- Shafik is learning Claude Code while we build. At each step, say briefly what you're doing, which Claude Code building block it uses, and what comes next.
- Read `BACKLOG.md` before starting work. Keep it current: tick finished items, add new ones, and keep "Waiting on Shafik" accurate.
- When Shafik gives feedback that is a lasting rule, add it to this file and tell him. One-off tasks go in `BACKLOG.md`.
- Every change to the repo, however small, goes through plan mode first. Shafik describes the change briefly; Claude researches and writes the plan; Shafik approves it. After approval, Claude works autonomously to the end (build, check, commit, merge, deploy) without further check-ins, and reports afterwards. (Shafik, 2026-10-20)
- **Ask first** before changing repo settings (Pages, visibility), opening a PR, or deleting anything that isn't a merged branch.

## Content: never break these
- `content/resume.md` is the only source of facts. Never invent anything about Shafik. If a section needs content he hasn't given, add a visible `PLACEHOLDER: …` and ask him.
- Display name: "Shafik Adam". Email: shafik.adam98@gmail.com. No phone number. No photo.
- Never guess URLs. GitHub is `https://github.com/ad-nap`. LinkedIn is `https://www.linkedin.com/in/shafikadam/`.
- The resume PDF (`assets/Shafik-Adam-Resume.pdf`) is Shafik's vault master CV (`career/resume-master.md`) with the phone number removed. Never publish a version with the phone number.
- Projects come from Shafik's private repo `AD-NAP/vault` (he approved it as a source). PomoZoo is removed. Copy any project fact you use into `content/resume.md` under a "From AD-NAP/vault" heading, with the source file, before it appears on the site.
- Linking a project repo that is still private is approved by Shafik (he will make it public later). Confirm which repo with him before linking it.

## Design
- Use the `frontend-design` skill for design work, and say how it shaped your choices.
- Third-party design skills live in `.claude/skills/` (sources in `THIRD_PARTY.md`). Use **Impeccable** (`/impeccable critique`, `audit`, `polish`, …) for design reviews and refinements, and **Emil Kowalski's skills** (`improve-animations`, `review-animations`, `animate`, `mobile-native`, …) for motion and phone feel. `PRODUCT.md` and `DESIGN.md` feed Impeccable; CLAUDE.md wins wherever they or any skill disagree. Keep Impeccable telemetry off. (Shafik, 2026-11-17)
- Two prints, both required (the theme toggle reads "Night print"):
  - **Day print:** cool white stock, riso blue ink, sunflower ink for fills and charts. Never sunflower text on paper.
  - **Night print:** dark blue stock, pale ink, sunflower ink.
- Colours come from the tokens in `:root` and `[data-theme]` in `styles.css`. Don't hard-code colours in components.
- Two inks only. The sunflower pass is a `text-shadow` sitting a few pixels off the blue, like riso misregistration. Never duplicate text for an effect: find-in-page and copy must see one copy.
- The paper should feel printed, not distressed: one static grain layer, no torn edges or fake grunge.
- Stats must be readable at a glance, honest, and drawn to scale. A 330-cell grid was rejected as hard to read.
- Personality stays: the riddle on the back page (visitors type Shafik's favourite animal, hinted by `ad-nap` → `pan-da`; the answer is never shown before they solve it), the hidden centrefold it unlocks (with a "Reset the riddle" button so visitors can play again), the cat sitting on the riddle card, and the cat that only appears in the night print, perched on the colophon rule. The cat is not on the cover: it looked out of place there (Shafik, 2026-11-18).
- The centrefold is a reward, not content: nothing a recruiter needs may live only there. For now it holds a cake.
- The cover carries the proof: cover lines ("In this issue") link to the articles with page numbers, and the production result leads.
- Contact links (Email, GitHub, LinkedIn, Resume PDF) stay on the cover as well as on the back page.
- Production results get the visual weight. Test data (e.g. the 330 mocked records) stays small.
- Phones: the cover fits the name, the line, the contact links and the lead cover line on the first screen.
- Fonts: Anybody (display, set wide and heavy) and Literata (body). Code uses the system monospace, and only for code. (2026-11-18)

## Motion
- Allowed automatic motion: only the print run on page load (the sunflower pass rolls across the cover name, then the blue ink comes in; under 1s).
- Everything else answers the user: the print toggle, section titles snapping into register on hover or focus, the riddle corner unfolding and the `ad-nap` letters flipping, the cat's tail flick when the riddle card comes into view.
- `prefers-reduced-motion` shows final states with no animation.

## Accessibility (WCAG 2.1 AA; the axe scan must stay at 0 violations)
- Contrast: text ≥ 4.5:1 and focus indicators ≥ 3:1, in both themes. Use the `--focus` token for focus styles.
- Navigation is real links: the masthead contents and the cover lines, each with a visible focus state.
- Touch targets ≥ 44px on phones. Mark decorative graphics `aria-hidden="true"`.

## Before saying a change is done
Use the `design-review` skill (`.claude/skills/design-review/`). Its checker, `npm run -s check`, serves the site, screenshots both themes at 390px and 1280px, and fails on overflow, JS errors, axe violations, token contrast, small touch targets or broken reduced motion. It repeats the checks with the centrefold open and tests the riddle itself. Then look at the contact sheets, fix, and re-check. Playwright and Chromium are preinstalled; don't run `playwright install`.
A Stop hook (`.claude/settings.json` → `.claude/hooks/design-check-on-stop.js`) runs the same checker automatically when a turn ends with changed site files, and blocks finishing until it passes (3 attempts, then it warns instead). Don't work around it: fix what it reports.
Impeccable's design hook (same settings file) is a second gate: it scans each edited UI file for design anti-patterns and runs a deeper pass at turn end. Act on its findings, or record a reasoned ignore with `.claude/skills/impeccable/scripts/impeccable ignores add-value … --reason …`. To scan the rendered page in a cloud session, start `/opt/pw-browsers/chromium --headless --no-sandbox --remote-debugging-port=9333 <url>` and run `impeccable detect --cdp 9333`.

## Git
- Shafik trusts Claude's judgement here (2026-10-09): commit, push, merge to `main` and tag without asking. Report what was done afterwards.
- Commit each finished, checked piece of work, with a message saying what changed and why, and push it.
- Small changes (docs, backlog, fixes) go straight to `main`. Bigger changes go on a short-lived branch (or the session's assigned `claude/…` branch), merged into `main` once the check passes, then deleted.
- Versions are annotated tags on `main` with a GitHub Release each (notes and screenshots). Major bump (`v1.0.0`) for a new visual world, minor bump (`v0.2.0`) for a visible milestone, patch bump (`v0.1.1`) for fixes to a release. Update the versions table in `README.md` with each release. No version branches or per-version repos.
- Never force-push, rewrite pushed history, or move a published tag.
