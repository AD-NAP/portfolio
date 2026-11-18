# Architecture

High-level view only. Choices that are hard to reverse are recorded in [decisions/](decisions/).

## Goal

A portfolio a recruiter can read in under a minute, with enough personality to be remembered, and a visible history of how it improved.

## The site

One page, three files, no build step:

| File | Job |
|---|---|
| `index.html` | All content and structure, in zine order: masthead, the name card (`#card`), cover, spreads (Experience, Projects, the hidden centrefold, Lessons learned, Skills and Education), back page (Contact), colophon. |
| `assets/styles.css` | Layout, both prints, the two-ink effect, the name card and its hand-over. Colours come from tokens in `:root` and `[data-theme]`. |
| `assets/main.js` | Behaviour: the name card (button, flip, returning visitors, replay), print toggle, contents highlight, the riddle and centrefold, the `ad-nap` flip, the cat's tail, and the scroll print of section titles. |
| `assets/vendor/` | GSAP 3.15.0 (`gsap.min.js`, `ScrollTrigger.min.js`), self-hosted. Licence and source in `.claude/skills/THIRD_PARTY.md`. |

Also in `assets/`: `favicon.svg` (a two-ink "SA" stamp) and `og.png`, the 1200x630 link preview. `og.png` is a screenshot of the name card in the day print with the masthead hidden; re-render it with Playwright if the cover changes.

The resume download, `assets/Shafik-Adam-Resume.pdf`, is built from the vault master CV with `npm run -s resume` (`tools/build-resume.js`: drops the phone number, prints one A4 page with Playwright). Rebuild it whenever `vault/career/resume-master.md` changes.

`content/resume.md` is the only source of facts. Nothing appears on the site unless it is in that file first.

## The name card

Since v1.1.0 the page opens on a meishi ([decisions/0003-name-card-and-new-inks.md](decisions/0003-name-card-and-new-inks.md)).

- **Hand-over.** `@keyframes hand-over` on `.meishi-hand`: the card rises with a slight forward tilt that levels out. The only automatic motion.
- **Flip.** One GSAP timeline on `#card` with a ScrollTrigger (`start: "top top"`, `end: "+=100%"`, `pin`, `pinSpacing: false`, `scrub: 0.5`). It hides the call to action, turns `.meishi` 180° on Y (two faces with `backface-visibility: hidden`), grows it until its back covers the screen (`fillScale()` measures from the card's real position), then fades the faces so the cover shows through. The faces fade, never the card itself: opacity on the 3D card would flatten it and show the front mirrored. Once the cover shows through, the stage stops taking pointer events.
- **Button and replay.** "Open the build log" scrolls to the end of the pin and focuses the cover heading; "See my card again" scrolls back to the top.
- **Returning visitors.** `card = seen` in localStorage; on the next visit (no `#hash`) the page jumps to the cover after `load`.
- **Fallback.** Without GSAP or with reduced motion, `.has-card-motion` is never set: the card is a normal section above the cover.

## The zine

Since v1.0.0 the site is "The build log", a two-ink riso zine ([decisions/0002-riso-zine-redesign.md](decisions/0002-riso-zine-redesign.md)).

- **Two inks.** Headings with the class `ink` get the red pass as a `text-shadow`, offset a few pixels (`--mis-x`, `--mis-y`). There is only one copy of the text. Hovering or focusing a section brings its title into register.
- **The scroll print.** Each `.spread__title` gets a GSAP timeline with a ScrollTrigger (`top 90%` to `top 60%`, scrubbed). It tweens two CSS variables, `--print` (clip-path roll) and `--mis-x` (red pass into register). Created inside `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`; `ScrollTrigger.refresh()` runs when the centrefold opens or closes.
- **Paper.** One static SVG noise layer (`body::after`) blends into both prints.
- **Charts.** Bars are drawn to scale with CSS custom properties (`--from`, `--to`). Results print in solid red; baselines print as a grey halftone.

## Phones

Below 900px each spread becomes one column and the masthead contents become a horizontal strip. Below 600px the masthead stops being sticky, so the cover (name, line, contact links, lead cover line) fills the first screen.

## The centrefold

The centrefold section is in the page from the start but `hidden`, with its contents entry. Solving the riddle on the back page shows both and saves `centrefold = open` in `localStorage`, so it stays open on later visits. Nothing a recruiter needs lives there.

## Hosting

GitHub Pages serves `main` at https://ad-nap.github.io/portfolio/. `_config.yml` keeps project files (docs, backlog, reviews, tooling) out of the published site, so only `index.html` and `assets/` are public pages.

## Quality gate

```
edit site file ──► npm run -s check ──► pass ──► done
                        │
                        └── fail ──► fix ──► re-check
```

- `.claude/skills/design-review/` holds the checker (`scripts/check.js`) and the review steps. The checker also runs with the centrefold open, and tests that only the right answer opens it.
- A Stop hook (`.claude/hooks/design-check-on-stop.js`) runs the checker when a Claude Code turn ends with changed site files.
- `.claude/agents/recruiter-critic.md` reviews the site as a hiring manager. Reports land in `reviews/`.

## Versions

One repo. Each version is an annotated tag on `main` plus a GitHub Release with notes. See [decisions/0001-one-repo-tagged-releases.md](decisions/0001-one-repo-tagged-releases.md).
