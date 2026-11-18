---
name: The build log
description: Shafik Adam's portfolio as a self-published two-ink riso zine, handed over as a name card, one issue per release, in a day print and a night print.
colors:
  day-paper: "#FAFAF8"
  day-paper-deep: "#ECEDEE"
  graphite-ink: "#2A2C30"
  day-text: "#33363B"
  day-muted: "#5D6168"
  day-rule: "#C4C7CC"
  day-halftone: "#6B6F76"
  day-desk: "#E4E5E7"
  meishi-red: "#C8202B"
  day-on-accent: "#FFFFFF"
  night-paper: "#232528"
  night-paper-deep: "#2E3135"
  night-ink: "#ECEDEF"
  night-text: "#D9DBDE"
  night-muted: "#A5A9AF"
  night-rule: "#4A4E54"
  night-halftone: "#8A8F96"
  night-desk: "#18191B"
  night-red: "#F05A5F"
  night-on-accent: "#16171A"
typography:
  display:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 7.4vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 140"
  card-name:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(1.6rem, 6vw, 2.6rem)"
    fontWeight: 850
    lineHeight: 1
    fontVariation: "'wdth' 115"
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
  card: "min(580px, 100%)"
  spread: "clamp(56px, 8vw, 104px)"
  page-gutter: "clamp(40px, 6vw, 88px)"
  target: "44px"
components:
  print-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "44px"
  print-toggle-pressed:
    backgroundColor: "{colors.graphite-ink}"
    textColor: "{colors.day-paper}"
  button-solid:
    backgroundColor: "{colors.graphite-ink}"
    textColor: "{colors.day-paper}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "44px"
  card-open:
    backgroundColor: "{colors.graphite-ink}"
    textColor: "{colors.day-paper}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  card-open-hover:
    backgroundColor: "{colors.meishi-red}"
    textColor: "{colors.day-on-accent}"
  input:
    backgroundColor: "{colors.day-paper-deep}"
    textColor: "{colors.day-text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
    height: "44px"
  headline-panel:
    backgroundColor: "{colors.meishi-red}"
    textColor: "{colors.day-on-accent}"
    rounded: "{rounded.none}"
    padding: "14px 18px"
  meishi:
    backgroundColor: "{colors.day-paper}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.none}"
    width: "min(580px, 100%)"
---

# Design System: The build log

> CLAUDE.md and PRODUCT.md win wherever this file disagrees with them. The tokens live in `assets/styles.css` (`:root`, `[data-theme="light"]`, `[data-theme="dark"]`). Keep Impeccable telemetry off. Values above are the day print unless named `night-`.

## Overview

**Creative North Star: "The Build Log"**

The page is a self-published zine, printed on a riso in two inks, and it is handed to you as a name card first. Each release is an issue (v1.0.0 was Issue 1, v1.1.0 is Issue 2; a patch is a reprint). The opening is a meishi (91 × 55) lying on a desk: it rises into your hand on load, and as you scroll it turns over, its back grows across the screen and becomes the zine's cover. From there the zine reads as before: a masthead with the title, the contents and which print you hold; a cover that sells the issue with cover lines and page numbers; spreads of two pages split by a hairline gutter and numbered with folios; a back page with contact and the riddle; and a hidden centrefold that opens when the riddle is solved.

Two inks do all the work: a dark graphite grey (pale grey in the night print) and a red. The red pass never lines up perfectly with the grey, so headings carry a few pixels of misregistration. A lighter grey is the third tone, for fields, rules, halftones and the desk. The stock is near white by day and dark grey by night, with one static layer of grain so it reads as printed rather than rendered. Nothing is distressed. Type is wide and heavy for headings and a bookish serif for reading.

Provenance: the zine world replaced the seeded isometric-building world at v1.0.0 (2026-11-18; see `docs/decisions/0002-riso-zine-redesign.md`). It came from direction roll `seed:e4c83ff7a6b64abf`, which ran degraded (the style catalog was unreachable from the cloud session, so there were no challengers). Issue 2 (v1.1.0) extended that world rather than replacing it: it added the name card opening and changed the inks from riso blue and sunflower to graphite and red (see `docs/decisions/0003-name-card-and-new-inks.md`). It is a code-led build with no comps, so this file is the record of what shipped. Because the world replaced the seeded one, no `world:` provenance is carried.

**Key Characteristics:**
- Two inks only: graphite (pale grey at night) and red, plus a lighter grey and the paper.
- Misregistration on titles and the card name, done as a `text-shadow`, one copy of the text.
- Square everything: no radius anywhere, the name card included.
- Print furniture as structure: a name card, masthead, cover lines with page numbers, folios, a dashed trim line between spreads, staples on the centrefold.
- One automatic motion: the card handed over on load. The card flip and the section titles follow the scroll.

## Colors

A two-ink riso palette, graphite and red, with a lighter grey third tone, swapped between a day print and a night print by `[data-theme]`.

### Primary
- **Graphite Ink** (`--ink`, day): headings, links, the masthead and cover-line rules, solid buttons, list markers, chart outlines, the cats. In the night print the same role is printed in **Pale Grey Ink** (`night-ink`).

### Secondary
- **Meishi Red** (`--accent`, day) and **Bright Red** (`night-red`): the second drum. Misregistration offsets, the rule beside "Azbil ASPO, Singapore" on the card, the contact labels on the card's back, chart result bars, the headline result panel, the lead cover line, highlighter underlines on links, `mark`, text selection, the riddle's folded corner, the night cat's eyes, the cake. Also the focus colour (`--focus`) in both prints. The night red is brighter so it still reads on dark stock.
- **On Accent** (`--on-accent`: white by day, near-black `night-on-accent` by night): text on any red fill.

### Neutral
- **White Stock / Dark Grey Stock** (`--paper`): the page, the masthead background and the card's faces.
- **Pale Grey Stock** (`--paper-deep`): the riddle input and the cake plate.
- **Desk Grey** (`--desk`): the surface the card lies on, behind the opening only. It fades out the moment the card's back becomes the cover.
- **Graphite Body / Pale Body** (`--text`): body copy, a step softer than the ink.
- **Faded Graphite** (`--muted`): meta lines, folios, page numbers, captions, ledes, the colophon, the "or just scroll" aside.
- **Trim Line** (`--rule`): dashed trim between spreads, the hairline gutter between pages, list dividers, column rules, the rules inside the card.
- **Halftone Grey** (`--halftone`): the dotted fill for baselines and test data.
- `--blend` (`multiply` by day, `screen` by night) and `--grain-opacity` (.18 / .14) set how the grain sits on the stock.

### Named Rules
**The Two Drums Rule.** Every colour is one of the two inks, a tint of the grey (halftone, rule, muted, desk), or the paper. A third hue breaks the print.

**The Red Text Rule.** Red is text only where it reaches 4.5:1 on its ground (the card's contact labels on paper). Everywhere else red is a fill, an underline or a shadow, and any text on a red fill uses `--on-accent`.

**The Token-Only Rule.** Components take colours from the tokens. The grain's neutral grey inside its SVG filter is the only literal colour, and it is blended, not seen.

## Typography

**Display Font:** Anybody (fallback Arial Narrow, sans-serif), a variable width face set wide and heavy.
**Body Font:** Literata (fallback Georgia, serif), with optical sizing on.
**Code:** the system monospace (`ui-monospace`, SF Mono, Menlo), at 0.86em, only inside `code`.

**Character:** a stretched, poster-weight grotesque for the shouting parts, against a warm book serif for reading. The width axis carries the hierarchy as much as size does.

### Hierarchy
- **Display** (900, width 140, line-height 0.95): the cover title, "The build log", with "Issue 2" under it in Literata italic `--muted`. On phones it drops to width 110 and clamp(2.4rem, 12.5vw, 3.6rem). Misregistered 6px 4px (4px 3px on phones).
- **Card name** (850, width 115, line-height 1): the name on the card's front, which is the page's `h1`. Misregistered 2px 2px, the smallest offset, since the card is the smallest sheet.
- **Headline** (850, width 125, line-height 0.95): spread titles ("Experience", "Projects"). Always `.ink`, so they carry the misregistration.
- **Title** (750, width 105, line-height 1.15): article titles on a page. A section-sized variant (850, width 125, clamp 1.9–2.6rem) heads page-level sections.
- **Body** (Literata 400, line-height 1.65, held to 65ch): paragraphs and points. Ledes, meta lines, captions and the colophon are Literata italic in `--muted`.
- **Label** (Anybody 600–800, about 0.85–1.1rem): masthead contents, the print toggle, folios, chart values (tabular numbers), cover lines, contact links, the card's organisation line and contact labels.

### Named Rules
**The Wide Not Tall Rule.** Hierarchy comes from Anybody's width and weight axes first. Headings are set wide (105 to 140), never condensed.

**The Mono Is Code Rule.** Monospace appears only for code. Labels, dates, values and file names use Anybody.

## Layout

The page opens on a full-bleed stage: the desk, with the card centred at min(580px, 100%) wide and an aspect ratio of 91 / 55. Under the card sit a one-line intro, GitHub, LinkedIn and Resume (PDF) as highlighter links, and "Open the build log" with an "or just scroll" aside. With motion on, the stage is laid over the cover at a full screen's height (100svh) and both are pinned together for one screen of scroll, so the grown card back lands on a cover that is already in place.

Below that, a single column of sheets, centred at 1200px with a `--gutter` of clamp(16px, 4vw, 56px). The masthead sticks to the top with a 2px ink rule under it. The cover sets the title full width, then a two-column body: the intro line, contact links and "See my card again" on the left, "In this issue" cover lines on the right. Each spread has generous vertical padding (clamp(56px, 8vw, 104px)), a dashed trim line on top, a headline title, and two pages in a grid split by a 1px rule down the middle (gap clamp(40px, 6vw, 88px)). Reading text holds to 65ch. A folio sits at the bottom outer corner of each page. A full-width article (the day job lead) can run across the spread with its points in two ruled columns.

At 900px and below the spread becomes one page per row, the gutter rule and columns drop, and the masthead wraps its contents to a second row. At 600px and below the masthead stops sticking, the issue line hides, the card sits near the top of the stage (padding max(24px, 9svh)) so the card, intro, links and button fit the first screen, the cover tightens, and chart labels move above their bars. Every touch target is at least 44px tall.

## Elevation & Depth

Flat, as paper is, with one object lifted off the desk. Depth on the page comes from overprinting, not lifting: the misregistered red pass, the grain blended over the sheet, and the riddle's dog-eared corner. The name card is the one physical object, so it is the one thing with a cast shadow and real 3D (perspective 1600px on its holder, `rotateY` on the card, hidden back faces).

### Shadow Vocabulary
- **Misregistration** (`text-shadow: var(--mis-x) var(--mis-y) 0 var(--accent)`, 3px 2px; cover title 6px 4px, phone 4px 3px; card name 2px 2px): the red pass on `.ink` headings. Snaps to `0 0 0` when in register.
- **Card shadow** (`--card-shadow`; day `0 1px 2px rgb(20 21 24 / .14), 0 22px 44px -14px rgb(20 21 24 / .32)`, night the same shape in black at .4 and .7): a contact shadow and a soft drop under the card faces on the desk. Only the meishi uses it.
- **Ink outline** (`box-shadow: inset 0 0 0 2px var(--ink)`): the outline on chart result bars. Halftone baselines use a 1px `--halftone` outline.
- **Fold edge** (`box-shadow: -1px 1px 0 var(--ink)`): the crease on the riddle's folded corner.

### Named Rules
**The Overprint Rule.** Depth on the page is ink on ink. Shadows there only exist as the second ink pass, an inset outline, or a paper fold.

**The One Object Rule.** Only the name card lifts off its surface. Spreads, panels, the riddle card and the masthead stay flat on the sheet.

**The One Copy Rule.** Effects never duplicate text. Find-in-page and copy see one copy.

## Shapes

Square. Radius is 0 on the card, buttons, inputs, panels and bars. Borders are 2px solid ink for frames (masthead rule, print toggle, riddle card, input, cover lines rule) and 1px `--rule` for dividers, including the rules inside the card. The trim line between spreads is 2px dashed. The range chart's cutoff is a 2px dashed ink line. The card's front carries a 4px red rule beside the organisation name. The riddle has a folded corner drawn as a diagonal two-colour gradient. The centrefold has two 3px staples down its middle. Small SVGs (the cat on the riddle card, the night cat on the colophon rule, the cake, the moon in the toggle) are flat ink fills with 2px ink strokes where outlined.

## Components

### Name card (signature)
A meishi, 91 × 55, on the desk. Front: "Azbil ASPO, Singapore" in Anybody 650 beside a 4px red rule (text only, never a logo), the name as the misregistered card name, the job title in Literata, and the email under a 1px rule. Back: the name again and a ruled list of Email, GitHub and LinkedIn with red Anybody labels; the back is a picture (`aria-hidden`, `inert`), and the real links are on the stage and the cover. Both faces are paper with the card shadow.

### The hand-over (signature)
On load the card rises into place with a slight bow: from 44px down and tipped back 20deg, through a small overshoot (-6px, -5deg), to rest, in 0.8s on `--ease-out` (`cubic-bezier(.16, 1, .3, 1)`). It is the only automatic motion. Returning visitors (`data-card="seen"`) get no hand-over and open on the cover, with "See my card again" to scroll back up.

### The flip (signature)
GSAP ScrollTrigger pins `.opening` (the stage and the cover) for one screen, scrubbed at 0.5. One progress value, 0 to 1, is rendered into CSS variables on the stage, so the same scroll position always draws the same picture in both directions. From 0 to 0.12 the lines under the card step aside (fade and drop 12px). From 0 to 0.42 the card turns over (`--card-turn` to 180deg, power1.inOut) and swells to 1.12. From 0.45 to 0.75 its back grows until it covers the screen (power2.in) while its contact details fade. At 0.75 the card and desk vanish and the cover underneath is already in place, with no faded in-between. From 0.76 to 0.96 the cover title prints in: `--print` rolls a clip-path from the left and `--mis-x` slides the red pass from -18px into register offset. "Open the build log" scrolls through the same motion and then focuses the cover title. Without GSAP or with reduced motion, the card and the cover are plain sections, front side up.

### Masthead
The zine's title bar. "Shafik Adam" in Anybody 800 at width 120, then "The build log, issue 2, November 2026" in Literata italic `--muted`. Contents links on the right in Anybody 600; hover and the current section get a thick red underline (0.3em). Sticky on desktop, static on phones.

### Buttons
- **Open the build log:** a solid ink block, 48px tall, 24px side padding, Anybody 750 in paper. Hover fills it red with `--on-accent` text. Presses to `scale(.97)`.
- **Print toggle:** a square 2px ink-outlined button, 44px tall, with a small moon icon and "Night print". Pressed, it fills with ink and the label turns paper. Switching prints fades background and text colours for .35s.
- **Check (riddle):** a solid ink block, 44px, square. **Reset the riddle** is the outlined twin that fills with ink on hover.

### Cover lines
The cover's contents: a 2px ink rule, "In this issue", then a list of links with page numbers (tabular, `--muted`) aligned right and a 1px rule under each. The lead line (the production result) sits on a red fill in `--on-accent`. Hover gives a red underline.

### Links
Inline links are ink, 1px underline thickening to 2px on hover. Contact and call-to-action links are Anybody words with a thick red underline like a highlighter pass (0.22–0.32em, skip-ink off). Hover fills them red with `--on-accent` text and drops the underline.

### Headline panel
A red block (14px 18px padding) with `--on-accent` Anybody 650 text: the one result an article leads with.

### Charts
Two inks, drawn to scale. Each row is label, track and value. The result is a red bar with a 2px inset ink outline. Baselines and test data print as a grey halftone dot (5px grid; 4px for the small test-data strip), quieter than the result. A tiny result prints as a solid ink sliver (min 3px). A range chart adds a 1px rule track, a dashed ink cutoff and an axis with end values. Captions are Literata italic `--muted`. The headline chart is taller (30px) with a larger value.

### Riddle
A card framed in 2px ink on paper, with a red dog-ear that shrinks away when solved and a cat sitting on its top edge. Input on `--paper-deep` at 16px (so phones don't zoom), a solid ink "Check" button, both square and 44px. Solving it makes the letters of `ad-nap` hop into `pan-da` with a 70ms stagger.

### Focus
Every interactive element gets a 3px solid `--focus` outline (red) at a 3px offset.

### Misregistered titles
Section titles, the cover title and the card name are one text copy with the red pass as a `text-shadow`. A section title snaps into register (shadow to 0) over .45s when it is hovered, when its spread is the URL `:target`, or when focus is anywhere inside its spread.

### Scroll print
As a section title crosses the band from 90% to 72% down the viewport, it prints, scrubbed to the scroll by GSAP ScrollTrigger (`scrub: 0.4`): `--print` rolls a clip-path from the left, then `--mis-x` slides the red pass from -18px into its 3px offset. Scrolling back un-prints it. Only CSS variables move; the `.is-scroll-print` class is added by script, so without GSAP or with reduced motion the titles simply show printed.

## Do's and Don'ts

### Do:
- **Do** take every colour from the tokens and check both prints.
- **Do** keep to two inks: graphite (pale grey at night) and red, plus the lighter grey tints and the paper.
- **Do** put red behind text, under text or beside it, and set any text on a red fill in `--on-accent`.
- **Do** make misregistration with `text-shadow` on one copy of the text, offset by `--mis-x` and `--mis-y`.
- **Do** use print furniture for structure: the name card, cover lines with page numbers, folios, trim lines, page gutters.
- **Do** draw numbers to scale, with the production result in red and baselines or test data in halftone.
- **Do** keep every corner square and every touch target at 44px or more.
- **Do** drive scroll motion with one value rendered into CSS variables, so hover, focus, `:target` and reduced motion keep working and the page looks finished without GSAP.
- **Do** let motion answer the user, apart from the hand-over on load, and show final states under `prefers-reduced-motion`.

### Don't:
- **Don't** set red text on paper below 4.5:1.
- **Don't** duplicate text to fake a second ink pass.
- **Don't** add a third hue, a gradient sky, or a glow.
- **Don't** distress the paper: one static grain layer, no torn edges or fake grunge.
- **Don't** round corners, and don't give any container but the name card a drop shadow.
- **Don't** show the Azbil logo; the organisation is text.
- **Don't** use monospace for labels, dates or values; it is for code only.
- **Don't** add automatic motion beyond the hand-over.
- **Don't** let the test-data strip outweigh production results.
