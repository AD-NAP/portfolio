# Architecture

High-level view only. Choices that are hard to reverse are recorded in [decisions/](decisions/).

## Goal

A portfolio a recruiter can read in under a minute, with enough personality to be remembered, and a visible history of how it improved.

## The site

One page, three files, no build step:

| File | Job |
|---|---|
| `index.html` | All content and structure: the bar, the opening (the card `#card` lying over About), then Experience, Projects, the hidden Bonus, Lessons learned, Skills and Education, Contact with the riddle, and the title block footer. |
| `assets/styles.css` | Layout, both themes, the type ramp, the card and the CSS variables the transition drives. Colours and font sizes come from tokens in `:root` and `[data-theme]`. |
| `assets/main.js` | Behaviour: the card-to-sheet transition (button, scrub, snap, returning visitors, replay, keyboard), theme toggle, section highlight, the riddle and its bonus, the `ad-nap` flip. |
| `assets/vendor/` | GSAP 3.15.0 (`gsap.min.js`, `ScrollTrigger.min.js`), self-hosted. Licence and source in `.claude/skills/THIRD_PARTY.md`. |

Also in `assets/`: `favicon.svg` (a tiny card on the desk) and `og.png`, the 1200x630 link preview: a screenshot of the closed card in the light theme. Re-render it with Playwright if the card changes.

The resume download, `assets/Shafik-Adam-Resume.pdf`, is built from the vault master CV with `npm run -s resume` (`tools/build-resume.js`: drops the phone number, prints one A4 page with Playwright). Rebuild it whenever `vault/career/resume-master.md` changes.

`content/resume.md` is the only source of facts. Nothing appears on the site unless it is in that file first.

## The card opens into the sheet

Since v1.2.0 ([decisions/0004-card-into-portfolio.md](decisions/0004-card-into-portfolio.md)).

- **Lift.** `@keyframes lift` on `.card-lift`: the card settles 18px onto the desk on load (0.7s). It is visible from the first frame. It is the only automatic motion.
- **The opening.** `.opening` holds the card stage (`#card`) and the About section. With motion (`.has-card-motion`), the stage lies over About (`position: absolute`, full viewport), and GSAP ScrollTrigger pins `.opening` (`end: "+=110%"`, `scrub: 0.8`). A scrubbed tween drives one number, `p` from 0 to 1, and `render(p)` writes CSS variables on three elements only: the stage, About and the bar. Nothing is set on `:root`, so style recalculation stays local.
- **Timeline.** 0 to 0.16: the card's lines, dimensions and the links under it fade out. 0.05 to 0.6: `.card__paper` (no text on it) scales from the card's box to the viewport (`--paper-sx/sy`, `--paper-x/y`), and its shadow fades out. 0.1 to 0.64: the name moves to the bar's name slot (`--name-x/y/s`, transform-origin top-left), then swaps with `.bar__name` in the same frame. 0.44 to 0.7: the bar's links arrive from the right, each with its own `--d` delay. 0.58 to 0.86: About fades in. 0.6 to 0.8: the paper fades out, so the sheet's grid shows through. At 0.9 the stage hides.
- **Landing.** `measure()` (run on every ScrollTrigger refresh, after fonts load, and when the lift ends) works out the paper's scale and the name's offset from layout positions. It then puts the name at its landing spot, compares the two text boxes, and corrects the offset. It allows for the stage being scrolled away and for the card's lift still running.
- **Snap.** `snapTo: [0, 1]`, directional: if the visitor lets go mid-way, it settles at the card or the portfolio, in the direction they were scrolling.
- **Button and replay.** "Open the portfolio" scrolls to the end of the pin and focuses the About heading. "See my card again" scrolls back to the top.
- **Returning visitors.** `card = seen` in localStorage. The head script sets `data-card="seen"` before paint (no lift), and `main.js` jumps to the end of the pin after `load`, with scroll restoration set to manual.
- **Keyboard.** If focus lands anywhere outside the card (except the skip link) while the card is still closed, the page jumps to the end and finishes the scrub, so a focused link is never hidden.
- **Fallback.** Without GSAP or with reduced motion, `.has-card-motion` is never set: the card is a plain first section, About follows, and the bar is always shown.

## The sheet

- **Grid.** `body::before`, fixed: twelve hairline columns across the content width.
- **Type ramp.** Eight tokens (`--fs-label` to `--fs-name`). Every font size is one of them.
- **Charts.** Bars are drawn to scale with CSS custom properties (`--from`, `--to`). The result is solid red, baselines are hatched, and other ranges are outlined in ink.

## Phones

Below 900px the bar grows to two rows (name and theme button, then the links in a row that scrolls sideways and fades at the edge only when it overflows). Content pairs become one column. Below 600px the About link leaves the bar (the name links there), the card's dimension marks go, and the theme button shows only its icon.

## The bonus

The Bonus section is in the page from the start but `hidden`, along with its bar link. Solving the riddle in Contact shows both and saves `bonus = open` in `localStorage`, so it stays open on later visits. The older keys `centrefold` (v1.x) and `b1` (v0.x) also open it. Nothing a recruiter needs lives there.

## Hosting

GitHub Pages serves `main` at https://ad-nap.github.io/portfolio/. `_config.yml` keeps project files (docs, backlog, reviews, tooling) out of the published site, so only `index.html` and `assets/` are public pages.

## Quality gate

```
edit site file ──► npm run -s check ──► pass ──► done
                        │
                        └── fail ──► fix ──► re-check
```

- `.claude/skills/design-review/` holds the checker (`scripts/check.js`) and the review steps. The checker also runs with the bonus open, tests the riddle, and tests the card (first screen, bar hidden then shown, the button, the name landing within 1px, the snap, returning visitors, replay, keyboard focus).
- A Stop hook (`.claude/hooks/design-check-on-stop.js`) runs the checker when a Claude Code turn ends with changed site files.
- `.claude/agents/recruiter-critic.md` reviews the site as a hiring manager. Reports land in `reviews/`.

## Versions

One repo. Each version is an annotated tag on `main` plus a GitHub Release with notes. See [decisions/0001-one-repo-tagged-releases.md](decisions/0001-one-repo-tagged-releases.md).
