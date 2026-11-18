---
name: The build log
description: Shafik Adam's portfolio as a self-published two-ink riso zine, one issue per release, in a day print and a night print.
colors:
  day-paper: "#F2F3EF"
  day-paper-deep: "#E4E8E1"
  riso-blue: "#3255A4"
  day-text: "#1E2F5C"
  day-muted: "#4B5A7E"
  day-rule: "#9FAACB"
  sunflower: "#FFB511"
  night-paper: "#17203A"
  night-paper-deep: "#202B4A"
  night-ink: "#E8ECF4"
  night-text: "#DCE2EE"
  night-muted: "#A9B4CC"
  night-rule: "#3F4C70"
  night-halftone: "#8EA6DA"
typography:
  display:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(3.4rem, 10.5vw, 9.5rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 150"
  headline:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 6vw, 4.5rem)"
    fontWeight: 850
    lineHeight: 0.95
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(1.45rem, 2.4vw, 1.85rem)"
    fontWeight: 750
    lineHeight: 1.15
    fontVariation: "'wdth' 105"
  body:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.86em"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  measure: "65ch"
  sheet: "1200px"
  spread: "clamp(56px, 8vw, 104px)"
  page-gutter: "clamp(40px, 6vw, 88px)"
  target: "44px"
components:
  print-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.riso-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "44px"
  print-toggle-pressed:
    backgroundColor: "{colors.riso-blue}"
    textColor: "{colors.day-paper}"
  button-solid:
    backgroundColor: "{colors.riso-blue}"
    textColor: "{colors.day-paper}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "44px"
  input:
    backgroundColor: "{colors.day-paper-deep}"
    textColor: "{colors.day-text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
    height: "44px"
  sunflower-panel:
    backgroundColor: "{colors.sunflower}"
    textColor: "{colors.day-text}"
    rounded: "{rounded.none}"
    padding: "14px 18px"
---

# Design System: The build log

> CLAUDE.md and PRODUCT.md win wherever this file disagrees with them. The tokens live in `assets/styles.css` (`:root`, `[data-theme="light"]`, `[data-theme="dark"]`). Keep Impeccable telemetry off. Values above are the day print unless named `night-`; sunflower is the same in both prints.

## Overview

**Creative North Star: "The Build Log"**

The page is a self-published zine, printed on a riso in two inks. Each release is an issue (v1.0.0 is Issue 1; a patch is a reprint). The masthead carries the title, the contents and which print you hold. The cover sells the issue with cover lines and page numbers. Spreads follow, each with two pages split by a hairline gutter and numbered with folios. A back page holds contact and the riddle, and a hidden centrefold opens when the riddle is solved.

Two inks do all the work: a riso blue (pale ink in the night print) and a sunflower yellow. The sunflower pass never lines up perfectly with the blue, so headings carry a few pixels of misregistration. The stock is a cool white by day and a dark blue by night, with one static layer of grain so it reads as printed rather than rendered. Nothing is distressed. Type is wide and heavy for headings and a bookish serif for reading.

Provenance: this world replaced the seeded isometric-building world at v1.0.0 (2026-11-18; see `docs/decisions/0002-riso-zine-redesign.md`). It came from direction roll `seed:e4c83ff7a6b64abf`, which ran degraded (the style catalog was unreachable from the cloud session, so there were no challengers). It is a code-led build with no comps, so this file is the record of what shipped. Because the world replaced the seeded one, no `world:` provenance is carried.

**Key Characteristics:**
- Two inks only: blue (or pale) and sunflower, on paper stock. No third hue.
- Misregistration on section titles, done as a `text-shadow`, one copy of the text.
- Square everything: no radius anywhere.
- Print furniture as structure: masthead, cover lines with page numbers, folios, a dashed trim line between spreads, staples on the centrefold.
- One automatic motion: the print run on load.

## Colors

A two-ink riso palette: one blue family and one sunflower, swapped between a day print and a night print by `[data-theme]`.

### Primary
- **Riso Blue** (`--ink`, day): headings, links, rules under the masthead and cover lines, solid buttons, list markers, chart outlines. In the night print the same role is printed in **Pale Ink**.
- **Pale Ink** (`--ink`, night): the night print's blue pass, a near-white with a blue cast.

### Secondary
- **Sunflower** (`--yellow`, both prints): the second drum. Misregistration offsets, chart result bars, the headline result panel, highlighter underlines on links, `mark`, text selection, the riddle's folded corner, the cake. In the night print it is also the focus colour.

### Neutral
- **White Stock / Dark Blue Stock** (`--paper`): the page. Also the masthead background so it reads as part of the sheet.
- **Deep Stock** (`--paper-deep`): the riddle input and the cake plate.
- **Heavy Blue / Pale Body** (`--text`): body copy. In the day print it is blue printed heavy, not black.
- **Faded Ink** (`--muted`): meta lines, folios, page numbers, captions, ledes, the colophon.
- **Trim Line** (`--rule`): dashed trim between spreads, hairline gutter between pages, list dividers, column rules.
- **Halftone** (`--halftone`): the dotted fill for baselines and test data. Day uses Riso Blue; night uses a lighter blue.
- `--on-yellow` is the text colour on any sunflower fill (Heavy Blue by day, Dark Blue Stock by night). `--focus` is Heavy Blue by day and Sunflower by night.
- `--blend` (`multiply` by day, `screen` by night) and `--grain-opacity` (.22 / .16) set how the grain sits on the stock.

### Named Rules
**The Two Drums Rule.** Every colour is one of the two inks, a tint of one (halftone, rule, muted), or the paper. A third hue breaks the print.

**The No Sunflower Text Rule.** Sunflower is a fill, never text on paper. Text on a sunflower fill uses `--on-yellow`.

**The Token-Only Rule.** Components take colours from the tokens. The grain's neutral grey inside its SVG filter is the only literal colour, and it is blended, not seen.

## Typography

**Display Font:** Anybody (fallback Arial Narrow, sans-serif), a variable width face set wide and heavy.
**Body Font:** Literata (fallback Georgia, serif), with optical sizing on.
**Code:** the system monospace (`ui-monospace`, SF Mono, Menlo), at 0.86em, only inside `code`.

**Character:** a stretched, poster-weight grotesque for the shouting parts, against a warm book serif for reading. The width axis carries the hierarchy as much as size does.

### Hierarchy
- **Display** (900, width 150, line-height 0.9): the cover name only. On phones it drops to width 125.
- **Headline** (850, width 125, line-height 0.95): spread titles ("Experience", "Projects"). Always `.ink`, so they carry the misregistration.
- **Title** (750, width 105, line-height 1.15): article titles on a page. A section-sized variant (850, width 125, clamp 1.9–2.6rem) heads page-level sections.
- **Body** (Literata 400, line-height 1.65, held to 65ch): paragraphs and points. Ledes, meta lines, captions and the colophon are Literata italic in `--muted`.
- **Label** (Anybody 600–800, about 0.85–1.1rem): masthead contents, the print toggle, folios, chart values (tabular numbers), cover lines, contact links.

### Named Rules
**The Wide Not Tall Rule.** Hierarchy comes from Anybody's width and weight axes first. Headings are set wide (105 to 150), never condensed.

**The Mono Is Code Rule.** Monospace appears only for code. Labels, dates, values and file names use Anybody.

## Layout

A single column of sheets, centred at 1200px with a `--gutter` of clamp(16px, 4vw, 56px). The masthead sticks to the top with a 2px ink rule under it. The cover sets the name full width, then a two-column body: the intro line and contact links on the left, "In this issue" cover lines on the right. Each spread has generous vertical padding (clamp(56px, 8vw, 104px)), a dashed trim line on top, a headline title, and two pages in a grid split by a 1px rule down the middle (gap clamp(40px, 6vw, 88px)). Reading text holds to 65ch. A folio sits at the bottom outer corner of each page. A full-width article (the day job lead) can run across the spread with its points in two ruled columns.

At 900px and below the spread becomes one page per row, the gutter rule and columns drop, and the masthead wraps its contents to a second row. At 600px and below the masthead stops sticking, the issue line hides, the cover tightens so the name, line, contact links and lead cover line fit the first screen, and chart labels move above their bars. Every touch target is at least 44px tall.

## Elevation & Depth

Flat, as paper is. Depth comes from overprinting, not lifting: the misregistered sunflower pass, the grain blended over the sheet, and the riddle's dog-eared corner. There are no drop shadows on containers.

### Shadow Vocabulary
- **Misregistration** (`text-shadow: var(--mis-x) var(--mis-y) 0 var(--yellow)`, 3px 2px; cover name 7px 5px, phone 4px 3px): the sunflower pass on `.ink` headings. Snaps to `0 0 0` when in register.
- **Ink outline** (`box-shadow: inset 0 0 0 2px var(--ink)`): the outline on chart result bars. Halftone baselines use a 1px `--halftone` outline.
- **Fold edge** (`box-shadow: -1px 1px 0 var(--ink)`): the crease on the riddle's folded corner.

### Named Rules
**The Overprint Rule.** Depth is ink on ink. Shadows only exist as the second ink pass, an inset outline, or a paper fold.

**The One Copy Rule.** Effects never duplicate text. Find-in-page and copy see one copy.

## Shapes

Square. Radius is 0 on buttons, inputs, panels and bars. Borders are 2px solid ink for frames (masthead rule, print toggle, riddle card, input, cover lines rule) and 1px `--rule` for dividers. The trim line between spreads is 2px dashed. The range chart's cutoff is a 2px dashed ink line. The riddle has a folded corner drawn as a diagonal two-colour gradient. The centrefold has two 3px staples down its middle. Small SVGs (the cat on the riddle card, the night cat on the colophon rule, the cake, the moon in the toggle) are flat ink fills with 2px ink strokes where outlined.

## Components

### Masthead
The zine's title bar. "Shafik Adam" in Anybody 800 at width 120, then the issue line in Literata italic `--muted`. Contents links on the right in Anybody 600; hover and the current section get a thick sunflower underline (0.3em). Sticky on desktop, static on phones.

### Print toggle
A square 2px ink-outlined button, 44px tall, with a small moon icon and "Night print". Pressed, it fills with ink and the label turns paper. Presses to `scale(.97)`. Switching prints fades background and text colours for .35s.

### Cover lines
The cover's contents: a 2px ink rule, "In this issue", then a list of links with page numbers (tabular, `--muted`) aligned right and a 1px rule under each. The lead line (the production result) sits on a sunflower fill. Hover gives a sunflower underline.

### Links
Inline links are ink, 1px underline thickening to 2px on hover. Contact and call-to-action links are Anybody words with a thick sunflower underline like a highlighter pass (0.22–0.32em, skip-ink off). Hover fills them with sunflower and drops the underline.

### Headline panel
A sunflower block (14px 18px padding) with `--on-yellow` Anybody 650 text: the one result an article leads with.

### Charts
Two inks, drawn to scale. Each row is label, track and value. The result is a sunflower bar with a 2px inset ink outline. Baselines and test data print as a blue halftone dot (5px grid; 4px for the small test-data strip), quieter than the result. A range chart adds a 1px rule track, a dashed ink cutoff and an axis with end values. Captions are Literata italic `--muted`. The headline chart is taller (30px) with a larger value.

### Riddle
A card framed in 2px ink on paper, with a sunflower dog-ear that shrinks away when solved. Input on `--paper-deep` at 16px (so phones don't zoom), a solid ink "Check" button, both square and 44px. Solving it makes the letters of `ad-nap` hop into `pan-da` with a 70ms stagger.

### Focus
Every interactive element gets a 3px solid `--focus` outline at a 3px offset.

### Misregistered titles (signature)
Section titles and the cover name are one text copy with the sunflower pass as a `text-shadow`. A title snaps into register (shadow to 0) over .45s when it is hovered, when its spread is the URL `:target`, or when focus is anywhere inside its spread.

### The print run (signature)
On load, the cover name prints: the sunflower pass rolls in from the left (clip-path), then the blue ink comes in on top. 0.9s on `--ease-out` (`cubic-bezier(.16, 1, .3, 1)`). It is the only automatic motion.

## Do's and Don'ts

### Do:
- **Do** take every colour from the tokens and check both prints.
- **Do** keep to two inks: blue (pale at night) and sunflower, plus their tints and the paper.
- **Do** put sunflower behind text, under text or beside it, and set any text on it in `--on-yellow`.
- **Do** make misregistration with `text-shadow` on one copy of the text, offset by `--mis-x` and `--mis-y`.
- **Do** use print furniture for structure: cover lines with page numbers, folios, trim lines, page gutters.
- **Do** draw numbers to scale, with the production result in sunflower and baselines or test data in halftone.
- **Do** keep every corner square and every touch target at 44px or more.
- **Do** let motion answer the user, apart from the print run on load, and show final states under `prefers-reduced-motion`.

### Don't:
- **Don't** set sunflower text on paper.
- **Don't** duplicate text to fake a second ink pass.
- **Don't** add a third hue, a gradient sky, or a glow.
- **Don't** distress the paper: one static grain layer, no torn edges or fake grunge.
- **Don't** round corners or add drop shadows to cards.
- **Don't** use monospace for labels, dates or values; it is for code only.
- **Don't** add automatic motion beyond the print run.
- **Don't** let the test-data strip outweigh production results.
