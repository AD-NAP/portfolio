---
name: The drawing sheet
description: Shafik Adam's portfolio as a business card that opens into a technical drawing sheet, in a light and a dark theme.
colors:
  sheet: "#F4F4F1"
  sheet-deep: "#E8E8E4"
  drafting-desk: "#DADAD5"
  drafting-ink: "#16171A"
  body-ink: "#2A2C30"
  pencil: "#595C62"
  hairline: "#C6C6C1"
  rule-red: "#C8202B"
  on-red: "#FFFFFF"
  graphite-sheet: "#1C1D1F"
  graphite-deep: "#26282B"
  night-desk: "#121314"
  chalk-ink: "#EDEDEA"
  chalk-text: "#D6D7D4"
  night-pencil: "#A3A6AB"
  night-hairline: "#3B3E42"
  night-red: "#F05A5F"
  on-night-red: "#16171A"
typography:
  card-name:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2rem, 7vw, 3.3rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2rem, 4.4vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 108"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.35rem, 2.2vw, 1.7rem)"
    fontWeight: 700
    lineHeight: 1.3
    fontVariation: "'wdth' 104"
  lede:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 2.2vw, 1.6rem)"
    fontWeight: 450
    lineHeight: 1.4
  emphasis:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontVariation: "'wdth' 100"
  small:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 550
    lineHeight: 1.35
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 550
    lineHeight: 1.3
  code:
    fontFamily: "ui-monospace, Menlo, monospace"
    fontSize: "0.86em"
rounded:
  edge: "2px"
  card: "3px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  section: "clamp(40px, 5.5vw, 72px)"
  bar: "64px"
components:
  button-primary:
    backgroundColor: "{colors.drafting-ink}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.edge}"
    padding: "0 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.rule-red}"
    textColor: "{colors.on-red}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.drafting-ink}"
    rounded: "{rounded.edge}"
    padding: "0 20px"
    height: "44px"
  input-field:
    backgroundColor: "{colors.sheet-deep}"
    textColor: "{colors.body-ink}"
    rounded: "{rounded.edge}"
    padding: "8px 12px"
    height: "44px"
  business-card:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.drafting-ink}"
    rounded: "{rounded.card}"
---

# Design System: The drawing sheet

## Overview

**Creative North Star: "The Drawing Sheet"**

The page is a technical drawing sheet, and the visitor first meets it folded into a business card. The card lies on a drafting desk with faint dimension lines that mark it as 91 by 55. When it opens, the card's stock grows into the sheet, the name walks up to the top-left title slot, and the navigation arrives. The portfolio was printed on the card all along.

The sheet is calm, precise and editorial. It is light warm grey with almost-black ink and a faint twelve-column grid ruled in hairlines. Section titles stand on full-width rules, and the footer is a drawing title block. Restraint carries the personality. One typeface, set wide and heavy for the name and plain for reading. One red, kept for the single mark that matters in each region. There is no texture, no gradient and no decoration that a draughtsman wouldn't draw.

The dark theme is the same sheet in graphite, with chalk-white ink and a brighter red.

**Key Characteristics:**
- A drafting desk, a business card and a drawing sheet: three surfaces, one material.
- A hairline grid of twelve columns across the content width, fixed to the window.
- Archivo throughout, its width axis doing the work of a second face.
- Red appears only for the key result, focus, and the card's rule.
- Hatching marks the quieter comparison in a chart, the way a section cut does.

## Colors

A restrained palette: tinted neutrals, one red, nothing else.

### Primary
- **Rule Red** (`rule-red`): the card's short rule, the production result's bar and headline rule, the lead highlight's marker, link underlines on hover, focus rings and the caret. Night: **Night Red** (`night-red`), brighter so it still reads on graphite. Red is text only where it reaches 4.5:1; otherwise it is a fill under **On Red** text.

### Neutral
- **Sheet** (`sheet`): the page and the card's stock. Night: **Graphite Sheet**.
- **Sheet Deep** (`sheet-deep`): fields and inputs. Night: **Graphite Deep**.
- **Drafting Desk** (`drafting-desk`): the table under the closed card, ruled in a 24px grid. Night: **Night Desk**.
- **Drafting Ink** (`drafting-ink`): headings, links, rules, the solid button. Night: **Chalk Ink**.
- **Body Ink** (`body-ink`): running text. Night: **Chalk Text**.
- **Pencil** (`pencil`): meta lines, captions, dimension marks, hatching. Night: **Night Pencil**.
- **Hairline** (`hairline`): dividers between list rows and columns. Night: **Night Hairline**.
- The grid is the ink at 7.5% (night: 6%), `--grid`.

### Named Rules
**The One Mark Rule.** Each region gets at most one red mark: the thing a recruiter should see first. If two things are red, neither is.

**The Token Rule.** Every colour comes from the custom properties on `:root` and `[data-theme]`. No literal colours in components.

## Typography

**Display Font:** Archivo (with Helvetica Neue, Arial)
**Body Font:** Archivo
**Label/Mono Font:** the system monospace, for code only

**Character:** One grotesque with a width axis. Wide and heavy (`wdth` 108 to 112, weight 800) it becomes the nameplate and section titles. At normal width it's an even, workmanlike reading face. Numbers use tabular figures.

### Hierarchy
- **Card name** (800, clamp(2rem, 7vw, 3.3rem), 1): the name on the card. The bar's name uses the same lettering at the Emphasis size, so the two can swap mid-transition.
- **Headline** (800, clamp(2rem, 4.4vw, 3.25rem), 1): section titles, standing on a 1px ink rule.
- **Title** (700, clamp(1.35rem, 2.2vw, 1.7rem), 1.3): roles and projects.
- **Lede** (450, clamp(1.25rem, 2.2vw, 1.6rem), 1.4): the About statement and the contact line, in ink.
- **Body** (400, 1.0625rem, 1.6): running text, max 68ch.
- **Emphasis** (700, 1.2rem, 1.3): list leads, skill and school names, the bar's name.
- **Small** (550, 0.95rem): the bar's links, the card's lines, chart labels and captions.
- **Label** (550, 0.85rem): title block labels, dimension figures, chart ends. Sentence case, never tracked capitals.

### Named Rules
**The Ramp Rule.** Every font size is one of the eight ramp tokens (`--fs-label` to `--fs-name`). No one-off sizes.

**The Same Lettering Rule.** The card's name and the bar's name share family, weight and width, and differ only in size. The transition depends on it.

## Layout

The sheet is a centred column, min(1200px, 100% minus two gutters), with the twelve-column hairline grid fixed behind it. Gutters run clamp(16px, 4vw, 56px). Sections are separated by clamp(40px, 5.5vw, 72px) of space above and below, with more space above a title than below its rule. Content pairs sit in two equal columns that collapse to one below 900px. The full-time role's points run in two columns divided by a hairline.

The bar is fixed at the top: 64px, or 104px below 900px, where the links move to a second row that scrolls sideways and fades at the edge. On phones the About link drops out, because the name already leads there.

The first screen is the card, centred on the desk at every width, with the intro line, links and "Open the portfolio" under it.

## Elevation & Depth

The sheet is flat. Depth exists only on the drafting desk, where the card casts a soft lifted shadow. The shadow fades out as the card opens, because the card becomes the sheet.

### Shadow Vocabulary
- **Card on the desk** (`box-shadow: 0 1px 2px rgb(22 23 26 / .12), 0 24px 48px -18px rgb(22 23 26 / .34)`): the closed card only. At night it adds a 1px cut edge at 7% chalk, so graphite stands off the dark desk.

### Named Rules
**The Flat Sheet Rule.** Nothing on the open sheet casts a shadow. Separation comes from hairlines and space.

## Shapes

Edges are drawn, not rounded: 2px on buttons and inputs, 3px on the card. Frames are 1px ink lines: the riddle box, the title block cells, the outline button. Chart bars are square. Hatching runs at 135°, 1px lines 6px apart.

## Components

### Buttons
- **Shape:** drawn edge (2px).
- **Primary:** solid Drafting Ink with Sheet text, 48px tall ("Open the portfolio", "Check").
- **Hover / Focus:** turns Rule Red with On Red text; presses to 97% on click; the focus ring is 2px Rule Red, offset 3px.
- **Outline:** 1px ink frame, transparent fill; fills with ink on hover ("Dark mode", "Reset the riddle").

### Cards / Containers
- **Business card:** 91:55, Sheet stock, card shadow on the desk, 3px corners. It holds the org line with its short red rule, the name, the title, and the email under a hairline. Drafting dimension lines and figures sit outside the top and left edges on wider screens.
- **Riddle box:** 1px ink frame on Sheet, 26px inset.

### Inputs / Fields
- **Style:** Sheet Deep fill, 1px ink stroke, 2px corners, 16px text (no zoom on iPhone).
- **Focus:** the 2px red focus ring.

### Navigation
- **The bar:** name on the left in the card's lettering, section links on the right in 550 weight, and the outline theme button. The current section and hover get a 2px red underline, offset .45em.

### Card to sheet (signature)
One scrubbed, pinned, snapped motion (GSAP ScrollTrigger), using transforms and opacity only. The card's lines and the links under it step aside. The card's stock scales into the full sheet. The name walks to the bar and swaps with the bar's name in the same frame. The links arrive from the right in uneven steps. About, already laid out underneath, fades in. Letting go mid-way settles to whichever end you were heading for. Under reduced motion or without GSAP, the card and About are plain sections and the bar is always shown.

### Charts
Drawn to scale. The result is a solid Rule Red bar, the baseline is hatched in Pencil, other ranges are outlined in ink, and a sliver too small to see is drawn as an ink line.

### Title block
The footer is a framed grid of cells (drawn by, built with, revision, date), with labels in Pencil and values in ink.

## Do's and Don'ts

### Do:
- **Do** keep red to one mark per region (The One Mark Rule).
- **Do** draw separation with 1px hairlines and space, not boxes and shadows.
- **Do** keep the card's name and the bar's name in the same lettering (The Same Lettering Rule).
- **Do** mark a baseline or test data with hatching and keep it smaller than the result.
- **Do** drive motion through CSS variables, so hover, focus and reduced motion keep working when the script is absent.

### Don't:
- **Don't** add texture, grain, gradients or glow: the sheet is clean stock.
- **Don't** use monospace except for code.
- **Don't** put a shadow on anything but the closed card.
- **Don't** add tracked all-caps labels or eyebrows above headings.
- **Don't** scale text up in a transition: move it, fade it, or scale the paper behind it.
