# Architecture

High-level view only. Choices that are hard to reverse are recorded in [decisions/](decisions/).

## Goal

A portfolio a recruiter can read in under a minute, with enough personality to be remembered, and a visible history of how it improved.

## The site

One page, three files, no build step:

| File | Job |
|---|---|
| `index.html` | All content and structure: the bar, the opening (the card `#card` lying over About), then Experience, Projects, Lessons learned, Skills and Education, Contact with the riddle, the hidden Bonus (the way into the fun side, right after the riddle that opens it; moved there in v1.3.1), and the title block footer. |
| `assets/styles.css` | Layout, both themes, the type ramp, the card and the CSS variables the transition drives. Colours and font sizes come from tokens in `:root` and `[data-theme]`. |
| `assets/main.js` | Behaviour: the card-to-sheet transition (two states: wheel, touch, keys and the button; returning visitors, replay, keyboard), theme toggle, section highlight, the riddle and its bonus, the `ad-nap` flip. |
| `assets/vendor/` | GSAP 3.15.0 (`gsap.min.js`, `ScrollTrigger.min.js`) and Three.js 0.187.0 (`three/`, used only by `back/`), self-hosted. Licences and sources in `.claude/skills/THIRD_PARTY.md`. |

Also in `assets/`: `favicon.svg` (a tiny card on the desk) and `og.png`, the 1200x630 link preview: a screenshot of the closed card in the light theme. Re-render it with Playwright if the card changes.

The resume download, `assets/Shafik-Adam-Resume.pdf`, is built from the vault master CV with `npm run -s resume` (`tools/build-resume.js`: drops the phone number, prints one A4 page with Playwright). Rebuild it whenever `vault/career/resume-master.md` changes.

`content/resume.md` is the only source of facts. Nothing appears on the site unless it is in that file first.

## Projects as engineering stories

Since v1.5.0. Each project `<article>` (ids `cumulus-coach` and `edge-energy-optimizer`, which the Highlights link to) holds a `<dl class="story">`: Problem, Result (the to-scale chart and one line) and Key decisions are always shown. A native `<details class="story__more">` ("Read the full story") folds Constraints, Architecture, Implementation and What went wrong. Result comes before Decisions on purpose, so the number is seen first. No JS: it works without GSAP and under reduced motion, and it opens instantly. The summary's plus is two CSS bars (`::before`, `::after`); the upright hides when open.

## The card opens into the sheet

Since v1.2.0, as two states since v1.2.1 ([decisions/0004-card-into-portfolio.md](decisions/0004-card-into-portfolio.md)).

- **Lift.** `@keyframes lift` on `.card-lift`: the card settles 18px onto the desk on load (0.7s). It is visible from the first frame. It is the only automatic motion.
- **Two states.** State 1 is the card; state 2 is the portfolio. With motion (`.has-card-motion`), the card stage is `position: fixed` over the page and About sits under it at the top of the document. One paused GSAP tween drives `p` from 0 to 1 over 1.5s (`sine.inOut`); opening calls `play()`, closing calls `reverse()`, so turning around mid-way just reverses. `render(p)` writes CSS variables on three elements only: the stage, About and the bar. Nothing is set on `:root`, so style recalculation stays local. While the card is closed or moving, `html.is-card-locked` stops the page scrolling (`scrollbar-gutter: stable` keeps the width steady when the lock lifts).
- **Triggers.** `ScrollTrigger.observe()` (the Observer built into ScrollTrigger; `type: "wheel,touch"`, `wheelSpeed: -1`, `tolerance: 10`): any downward wheel or swipe up opens; at scroll position 0, an upward wheel or swipe down closes, but not within 400ms of arriving at the top by scrolling, so the tail of a flick stops at About. Space, PageDown, ArrowDown and End open; PageUp, ArrowUp and Home at the top close. Keys typed into fields are left alone.
- **Timeline.** 0 to 0.16: the card's lines, dimensions and the links under it fade out. 0.05 to 0.6: `.card__paper` (no text on it) scales from the card's box to the viewport (`--paper-sx/sy`, `--paper-x/y`), and its shadow fades out. 0.1 to 0.64: the name moves to the bar's name slot (`--name-x/y/s`, transform-origin top-left), then swaps with `.bar__name` in the same frame. 0.44 to 0.7: the bar's links arrive from the right, each with its own `--d` delay. 0.58 to 0.86: About fades in. 0.6 to 0.8: the paper fades out, so the sheet's grid shows through. At 0.9 the stage hides.
- **Landing.** `measure()` (run on every ScrollTrigger refresh, after fonts load, and when the lift ends) works out the paper's scale and the name's offset from layout positions. It then puts the name at its landing spot, compares the two text boxes, and corrects the offset. It allows for the stage being scrolled away and for the card's lift still running.
- **Button and replay.** "Open the portfolio" plays the same 1.5s and then focuses the About heading. "See my card again" scrolls to the top if needed, then plays back and focuses the button.
- **Every visit opens on the card** (since v1.2.2; before that, `card = seen` skipped it, and `main.js` now clears that old key). A visitor arriving on a `#link` starts in state 2: `finish()` jumps there through the tween itself (`tween.progress(1)`), so the tween keeps 0 as its start value and can still play back.
- **The theme icon.** The card's switch (`.card-theme`) and the bar's (`.theme-toggle`) share one SVG with a sun and a moon; CSS shows the one for the theme they switch to. `measure()` finds the offset from the card's icon to the bar's (the bar's button at rest, the card's lift taken out), and `render()` walks it with `--icon-x/--icon-y` on the name's ease; at p .64 the two swap, like the names. The bar's button arrives early (`--d` .12) so its frame is there first.
- **Keyboard.** If focus lands anywhere outside the card (except the skip link) while the card is still closed, `finish()` opens it at once, so a focused link is never hidden. The card's name (the page's `h1`) stays in the page, transparent, when the stage hides.
- **Fallback.** Without GSAP or with reduced motion, `.has-card-motion` is never set: no lock, the card is a plain first section, About follows, and the bar is always shown.
- **Theme.** Dark is the default for first-time visitors: the head script uses `dark` unless `localStorage.theme` holds a choice from the toggle.

## The sheet

- **Grid.** `body::before`, fixed: twelve hairline columns across the content width.
- **Type ramp.** Eight tokens (`--fs-label` to `--fs-name`). Every font size is one of them.
- **Charts.** Bars are drawn to scale with CSS custom properties (`--from`, `--to`). The result is solid red, baselines are hatched, and other ranges are outlined in ink.

## Phones

Below 900px the bar grows to two rows (name and theme button, then the links in a row that scrolls sideways and fades at the edge only when it overflows). Content pairs become one column. Below 600px the About link leaves the bar (the name links there), the card's dimension marks go, and the theme button shows only its icon.

## The bonus

The Bonus section is in the page from the start but `hidden`, along with its bar link. Solving the riddle in Contact shows both and saves `bonus = open` in `localStorage`, so it stays open on later visits. The older keys `centrefold` (v1.x) and `b1` (v0.x) also open it. Nothing a recruiter needs lives there.

It shows `assets/fun-preview.webp`, a still of the fun side's room, and "Take me to the fun zone". On a desktop the link grows a fixed copy of the preview to cover the screen (Web Animations, 0.6s, transforms only) and then opens `back/`. On a phone the first tap shows a note instead ("built for a computer"); the second opens `back/`, which shows a list there. Under reduced motion it opens `back/` at once.

## The fun side (`back/`)

Since v1.3.0 ([decisions/0005-the-fun-side.md](decisions/0005-the-fun-side.md)). Its own look; the drawing sheet's rules don't apply.

| File | Job |
|---|---|
| `back/index.html` | All the content as real HTML: one `.thing` section per object, the dock of object buttons, the panel, the note. Import map for Three.js. |
| `back/fun.css` | Its own palette and type (Bricolage Grotesque), room mode and list mode. |
| `back/fun.js` | Picks the view, opens one thing at a time, runs Squash the bugs. Loads `room.js` only when the 3D room is shown. |
| `back/room.js` | The Three.js scene, seen first person: renderer, lights (ceiling spot, window, floor lamp), the three-walled room with a ceiling, Poly Haven models, the procedural arcade, panda, books and door, the mouse look-around, hover and click, GSAP walks up to each thing. |
| `back/models/` | Nine Poly Haven glTF models at 1k textures (CC0), converted to WebP: about 5.9 MB. |
| `back/museum/` | Small screenshots of the three looks for the museum. |
| `assets/vendor/three/` | Three.js 0.187.0 as the official ES modules: `build/three.module.js`, `build/three.core.js` and the addons GLTFLoader and RoomEnvironment (with the two utils GLTFLoader imports). |

- **Views.** Room mode (desktop, WebGL) or list mode (phones, reduced motion, no WebGL, or `?view=list`). The header toggle or the note's button switches. The list never downloads Three.js.
- **Room.** A 4.6 m wide room with back, left and right walls, a floor and a ceiling; the visitor stands at the open side at eye height (`HOME` in `room.js`). The walls and ceiling run on past the camera, so turning never shows an edge. ACES tone mapping, RoomEnvironment lighting, a shadow-casting ceiling spotlight, a warm window and floor lamp.
- **Look-around.** `LOOK` sets the head turn: ±30° and ±10° in the room, ±8° and ±5° up close. The pointer's position on the page sets the target turn, eased every frame (`1 - exp(-dt·5)`); arrow keys call `look()`. Under reduced motion there is no turn.
- **Hidden UI.** `body.ui-open` shows the title, list toggle, back link, row of things and credits; without it, in room mode, only `.menu-btn` shows. Menu, Esc and `focusin` on a hidden control set it; a click on the room clears it.
- **Choosing a thing.** Clicking an object or its button opens the panel on that thing's section, glides the camera to its spot in `SPOTS` (look at, stand from, distance), and focuses the section heading (from the row). "Back to the room" or Escape glides back; focus returns to the row after keyboard use. The door (`exit`) goes to `../#bonus`.
- **Way in.** The page opens on `.stage__poster` (the Bonus's picture, `object-fit: cover`). `room.js` fits the camera to that crop (narrower vertical view on screens wider than 16:10), compiles its shaders (`compileAsync`) and draws hidden frames; then the canvas fades in over the poster (0.4s). Fonts load without blocking the first paint; the arcade's screen waits up to 1.5s for Bricolage.
- **Prefetch.** `back/manifest.json` lists every file the room needs. `main.js` prefetches them once the card has opened (the `portfolio:open` event from `opened()`) and the browser is idle, on a desktop with no reduced motion or Data Saver, or on hover or focus of the link. Textures are WebP. The checker fails if the room requests a file the manifest doesn't list.
- **Checker hook.** `window.__fun.room.stats()` renders a frame and reports how much of the centre is drawn, the things and the camera position.

## Hosting

GitHub Pages serves `main` at https://ad-nap.github.io/portfolio/. `_config.yml` keeps project files (docs, backlog, reviews, tooling) out of the published site, so only `index.html` and `assets/` are public pages.

## Quality gate

```
edit site file ──► npm run -s check ──► pass ──► done
                        │
                        └── fail ──► fix ──► re-check
```

- `.claude/skills/design-review/` holds the checker (`scripts/check.js`) and the review steps. The checker also runs with the bonus open, tests the riddle, and tests the card (first screen, bar hidden then shown, the button and one wheel step both paced at about 1.5s, the name landing within 1px, closing at the top, normal scrolling once open, returning visitors, replay, keyboard focus) and the dark default. It seeds each page's saved theme from its colour scheme so the light runs stay light.
- A Stop hook (`.claude/hooks/design-check-on-stop.js`) runs the checker when a Claude Code turn ends with changed site files.
- `.claude/agents/recruiter-critic.md` reviews the site as a hiring manager. Reports land in `reviews/`.

## Versions

One repo. Each version is an annotated tag on `main` plus a GitHub Release with notes. See [decisions/0001-one-repo-tagged-releases.md](decisions/0001-one-repo-tagged-releases.md).
