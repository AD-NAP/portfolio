# Shafik Adam portfolio

Single-page portfolio for Shafik Adam, a software engineer in Singapore. Plain HTML/CSS/JS with no build step: `index.html`, `assets/styles.css`, `assets/main.js`. Intended host: GitHub Pages, served from `main`.

The concept (since v1.2.0, 2026-11-18): **the business card opens into a drawing sheet**. The page opens on a business card lying on a drafting desk. Scrolling, or "Open the portfolio", grows the card's stock into a technical drawing sheet, moves the name up to the bar at the top-left, and brings the bar's links in: the portfolio was inside the card all along. From Shafik's vault note `ideas/business-card-idea.md`; see `docs/decisions/0004-card-into-portfolio.md`. After the card it reads top to bottom: About (with Highlights linking to the proof), Experience, Projects, Lessons learned, Skills and Education, Contact with the riddle, and last the hidden Bonus (moved below Contact in v1.3.1 so the evidence reads unbroken; Shafik, 2026-11-19). Experience comes before Projects, and section names stay plain so recruiters can scan them (Shafik, 2026-11-18). A hidden Bonus section opens when a visitor solves the riddle, and leads to **the fun side** (`back/`, since v1.3.0): a 3D room that is the third state of the site. The footer is a drawing title block (drawn by, built with, revision, date): update its revision and date with each release. Retired worlds: the isometric building (v0.2.0 to v0.5.0) and The build log zine (v1.0.0 to v1.1.0); see decisions 0002 and 0003.

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
- Third-party design skills live in `.claude/skills/` (sources in `.claude/skills/THIRD_PARTY.md`). Use **Impeccable** (`/impeccable critique`, `audit`, `polish`, …) for design reviews and refinements, and **Emil Kowalski's skills** (`improve-animations`, `review-animations`, `animate`, `choreograph`, `mobile-native`, …) for motion and phone feel. GreenSock's **GSAP skills** (`gsap-scrolltrigger`, `gsap-timeline`, `gsap-core`, …) cover GSAP code. `PRODUCT.md` and `DESIGN.md` feed Impeccable; CLAUDE.md wins wherever they or any skill disagree. Keep Impeccable telemetry off. (Shafik, 2026-11-17)
- The world is a technical drawing sheet: a light warm-grey sheet, almost-black ink, a faint twelve-column hairline grid, section titles standing on full-width rules, and the title block footer. No grain, gradients, glow or decoration a draughtsman would not draw. (Shafik, 2026-11-18)
- Two themes, both required. Dark is the default for first-time visitors, whatever their system setting; the toggle remembers a visitor's choice. (Shafik, 2026-11-18)
  - The theme button shows the theme it switches to: a sun and "Light mode" in dark, a moon and "Dark mode" in light. A twin icon-only button sits at the card's top-right; as the card opens, its icon walks into the bar's button like the name. (Shafik, 2026-11-19)
  - **Light:** warm-grey sheet, almost-black ink, red accent.
  - **Dark:** graphite sheet, chalk-white ink, a brighter red. The card's stock (`--card`) is a lighter graphite so it stands off the dark desk. (Shafik, 2026-11-19)
- One accent, the Azbil-like red, for the one mark that matters in a region: the card's rule, the key result, focus. Red is text only where it reaches 4.5:1, otherwise a fill with `--on-accent` text on it. (Shafik, 2026-11-18)
- Colours and font sizes come from the tokens in `:root` and `[data-theme]` in `styles.css` (`--fs-label` to `--fs-name` for type). Don't hard-code either in components.
- Stats must be readable at a glance, honest, and drawn to scale. Results are solid red, baselines hatched. A 330-cell grid was rejected as hard to read.
- Personality: the riddle in Contact (visitors type Shafik's favourite animal, hinted by `ad-nap` → `pan-da`; the answer is never shown before they solve it) and the hidden Bonus it unlocks, with a "Reset the riddle" button so visitors can play again. The cats were retired in v1.2.0 (Shafik chose "riddle only", 2026-11-18).
- The Bonus is a reward, not content: nothing a recruiter needs may live only there. It holds a still preview of the fun side's room and "Take me to the fun zone" beside "Reset the riddle" (Shafik, 2026-11-19; the cake is retired).
- The business card (91 × 55): "Azbil ASPO, Singapore" as text with a short red rule (never the Azbil logo), the name (the page's `h1`), the title, the email, and the sun/moon theme switch at its top-right. Drafting dimension marks sit outside it on wider screens. (Shafik, 2026-11-18)
- About carries the proof on the first portfolio screen: Highlights link to the articles, and the production result leads.
- Contact links (Email, GitHub, LinkedIn, Resume PDF) stay in About as well as in Contact.
- Production results get the visual weight. Test data (e.g. the 330 mocked records) stays small.
- First screen, at every width: the card (name, title, Azbil, email), then under it a one-line intro ("Software engineer: cloud backends and AI tools…"), GitHub, LinkedIn and Resume (PDF), and "Open the portfolio". The recruiter critic asked for this so the first screen still answers who, what and how to reach him (2026-11-18).
- Font: Archivo (variable width and weight) for everything; wide and heavy for the name and section titles. The card's name and the bar's name share lettering so they can swap. Code uses the system monospace, and only for code. (2026-11-18)
- GSAP (core and ScrollTrigger) and Three.js (`assets/vendor/three/`) are self-hosted, each pinned to one version; the pages load no third-party scripts. Only `back/` loads Three.js. Use the `gsap-*` skills for GSAP work, but prefer plain CSS where it is enough. Animate CSS variables on the elements that need them (never on `:root`) rather than inline transforms, so the CSS states (hover, focus, reduced motion) keep working, and the page must look finished if GSAP fails to load. (2026-11-18)

## Motion
- The theme icon's walk from the card to the bar is part of the same transition (translate only, same timing as the name).
- Allowed automatic motion: only the card's lift on page load (it settles 18px onto the desk, under 1s, visible from the first frame).
- Scroll motion: the card-to-sheet transition only, as two states. Any amount of scroll, swipe or a scrolling key on the card, or "Open the portfolio", plays the whole transition in 1.5s, the same length every way (not scrubbed: it doesn't follow how far you scroll). At the very top of the page, moving up plays it back in the same 1.5s; everywhere else the page scrolls normally. The page doesn't scroll while the card is closed or moving. Only transforms and opacity move, and text is never scaled up: the paper behind it scales, the name moves and lands exactly on the bar's name. Every visit opens on the card; the page doesn't remember that you've seen it (Shafik, 2026-11-19). A `#section` link lands on that section, and "See my card again" plays it back. Any other scroll motion needs Shafik's approval first. (Shafik, 2026-11-18)
- Everything else answers the user: the theme toggle, button presses, the `ad-nap` letters flipping when the riddle is solved, and "Take me to the fun zone" growing the room preview to fill the screen (0.6s, transforms only) before `back/` opens.
- `prefers-reduced-motion` shows final states with no animation: no lock, no transition; the card and About are plain sections and the bar is always shown.

## The fun side (`back/`)
Shafik's creative side, behind the riddle (Shafik, 2026-11-19; `docs/decisions/0005-the-fun-side.md`, vault `ideas/back-of-the-sheet-idea.md`).
- It has its own look. The Design section above (drawing sheet, tokens, Archivo, two themes, one red) does not apply to `back/`; DESIGN.md doesn't either. Content, Accessibility and Git rules still apply.
- A Three.js room with clean, detailed models, not low poly. Models are CC0 (Poly Haven now; Kenney pieces can be added from Shafik's PC). Credit the source on the page.
- Desktop first. Phones, reduced motion and browsers without WebGL get the same content as a plain list, with a note; nobody has to use the 3D room to read anything.
- Content: hobbies, a museum of past versions, a monthly learning log (like a summarised dev log for the month), future goals, and a mini game (Squash the bugs, for now). Facts about Shafik still come from `content/resume.md`; what he hasn't written is a visible `PLACEHOLDER`.

## Accessibility (WCAG 2.1 AA; the axe scan must stay at 0 violations)
- Contrast: text ≥ 4.5:1 and focus indicators ≥ 3:1, in both themes. Use the `--focus` token for focus styles.
- Navigation is real links: the bar's links and the Highlights, each with a visible focus state.
- Touch targets ≥ 44px on phones. Mark decorative graphics `aria-hidden="true"`.

## Before saying a change is done
Use the `design-review` skill (`.claude/skills/design-review/`). Its checker, `npm run -s check`, serves the site, screenshots both themes at 390px and 1280px, and fails on overflow, JS errors, axe violations, token contrast, small touch targets or broken reduced motion. It repeats the checks with the Bonus open, tests the riddle, and tests the card (first screen, bar hidden then shown, the button and one wheel step both taking about 1.5s, the name landing within 1px, closing at the top, normal scrolling once open, returning visitors, replay, keyboard focus) and that dark is the default. It also tests the fun zone (no Three.js on the main page, the zoom, the phone note, the room drawing with software WebGL, the dock, Escape, the list view, reduced motion, axe). Then look at the contact sheets, fix, and re-check. Playwright and Chromium are preinstalled; don't run `playwright install`.
A Stop hook (`.claude/settings.json` → `.claude/hooks/design-check-on-stop.js`) runs the same checker automatically when a turn ends with changed site files, and blocks finishing until it passes (3 attempts, then it warns instead). Don't work around it: fix what it reports.
Impeccable's design hook (same settings file) is a second gate: it scans each edited UI file for design anti-patterns and runs a deeper pass at turn end. Act on its findings, or record a reasoned ignore with `.claude/skills/impeccable/scripts/impeccable ignores add-value … --reason …`. To scan the rendered page in a cloud session, start `/opt/pw-browsers/chromium --headless --no-sandbox --remote-debugging-port=9333 <url>` and run `impeccable detect --cdp 9333`.

## Git
- Shafik trusts Claude's judgement here (2026-10-09): commit, push, merge to `main` and tag without asking. Report what was done afterwards.
- Commit each finished, checked piece of work, with a message saying what changed and why, and push it.
- Small changes (docs, backlog, fixes) go straight to `main`. Bigger changes go on a short-lived branch (or the session's assigned `claude/…` branch), merged into `main` once the check passes, then deleted.
- Versions are annotated tags on `main` with a GitHub Release each (notes and screenshots). Major bump (`v1.0.0`) for a new visual world, but only when Shafik says so: he kept v1.2.0's new look on v1 as an iteration (2026-11-18). Minor bump (`v0.2.0`) for a visible milestone, patch bump (`v0.1.1`) for fixes to a release. Update the versions table in `README.md` with each release. No version branches or per-version repos.
- Never force-push, rewrite pushed history, or move a published tag.
- Cloud sessions can't push tags. Claude prepares the release notes and screenshots in `docs/releases/`; Shafik publishes the release on github.com, which creates the tag (a lightweight tag, accepted). (Shafik, 2026-11-18)
