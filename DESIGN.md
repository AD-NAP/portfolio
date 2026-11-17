---
name: Shafik Adam portfolio
description: A software engineer's portfolio drawn as an isometric building, one floor per section, by night and by day.
colors:
  window-amber: "#FFB84D"
  night-navy: "#0F1E33"
  night-deep: "#0A1626"
  blueprint-line: "#2E4D73"
  blueprint-line-soft: "#1C3352"
  sensor-teal: "#5ED0C0"
  night-text: "#E6EDF5"
  night-body: "#CBD7E5"
  night-muted: "#9DB0C7"
  sunshine: "#F2A922"
  sunshine-text: "#8C5300"
  day-sky: "#DCEDFA"
  day-deep: "#F3F8FD"
  day-text: "#0F2440"
  day-body: "#22395A"
  day-muted: "#4D6584"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(4rem, 9vw, 8rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 75"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    fontVariation: "'wdth' 80"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 2.2vw, 1.6rem)"
    fontWeight: 650
    lineHeight: 1.25
  body:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    fontVariation: "'wdth' 87.5"
rounded:
  panel: "6px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  floor: "clamp(48px, 7vw, 80px)"
  measure: "60ch"
components:
  link-pill:
    backgroundColor: "{colors.night-deep}"
    textColor: "{colors.night-text}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  panel:
    backgroundColor: "{colors.night-deep}"
    textColor: "{colors.night-body}"
    rounded: "{rounded.panel}"
    padding: "28px"
---

# Design System: Shafik Adam portfolio

> CLAUDE.md wins wherever this file disagrees with it. The tokens live in `assets/styles.css` (`:root` and `[data-theme]`). The values above are the Night theme unless named `day-` or `sunshine`.

## Overview

**Creative North Star: "The Lit Building at Night"**

The page is one building against the sky. A visitor scrolls down it floor by floor, and the sidebar is the building's file listing, like the Brick Schema TTL files Shafik writes at work. At night the windows glow amber and the moon sits to the right. By day the same building stands in clean light with the sun in the same place. The look is a technical drawing come to life: blueprint lines, flat faces and one warm light source, not glossy product marketing.

Restraint carries the content. The facts sit on calm navy (or pale sky) in one grotesque typeface. Amber is light: windows, progress and results, never decoration. The few playful touches (two cats, a riddle, a hidden basement with a cake) are small, and a visitor finds them rather than being shown them.

**Key Characteristics:**
- One light source, on the right: lit front face (`--facade`), shaded side face (`--wall-side`).
- Amber means "light" or "result": windows, the timeline fill, result bars, the active file.
- Blueprint lines (1px and 1.5px strokes in `--line`) instead of shadows.
- Narrow, heavy display type against mono labels.

## Colors

A night palette of navy and amber, and a day palette of pale sky and deep ink, swapped by `data-theme`.

### Primary
- **Window Amber** (night `#FFB84D`, day `#F2A922` with `#8C5300` for text): lit windows, the timeline progress, result bars, focus at night, the active file. As text, always `--accent-text`.

### Secondary
- **Sensor Teal** (night `#5ED0C0`, day `#0F7F71`): the "online" status dot and code keywords only.

### Neutral
- **Night Navy / Day Sky** (`#0F1E33` / `#DCEDFA`): page background and the lit facade at night.
- **Night Deep / Day Deep** (`#0A1626` / `#F3F8FD`): sidebar, code blocks, project panels.
- **Blueprint Line** (`#2E4D73` / `#7F9FC2`) and **Soft Line** (`#1C3352` / `#BBD2E8`): building strokes, borders, dividers.
- **Text / Body / Muted** (night `#E6EDF5` / `#CBD7E5` / `#9DB0C7`, day `#0F2440` / `#22395A` / `#4D6584`): headings, paragraphs, labels. All pass 4.5:1 on their background.

### Named Rules
**The Light-Only Amber Rule.** Amber marks light, progress or a production result. Labels, tags and decoration use `--muted` or `--line`.

**The Token-Only Rule.** Components take colours from tokens. Sky gradients, the sun and the moon are the only literal colours, and they live in the sky layer.

## Typography

**Display and Body Font:** Bricolage Grotesque (fallback system-ui). Its width axis does the work: 75 for the name and project names, 80 for floor titles, normal width for body.
**Label/Mono Font:** Martian Mono (fallback ui-monospace), at width 87.5 for file names, dates, floor tags and chart values.

**Character:** a condensed, heavy grotesque for the shouting parts and a technical mono for the labelling parts, like a building plan with a big title block.

### Hierarchy
- **Display** (800, clamp 4–8rem, line-height 0.88, width 75): the name only.
- **Headline** (700, clamp 2–3rem, width 80): floor titles, with a mono level tag (`L5`) beside them.
- **Title** (650, clamp 1.3–1.6rem): role titles; the role headline result at 600, 1.125–1.25rem.
- **Body** (400, 1.0625rem, line-height 1.6, max 60ch, about 75 letters): paragraphs and bullet points in `--body`.
- **Label** (mono 400, 0.75rem): dates, file names, chart values, skill group names, in `--muted`.

## Layout

A fixed 260px file-explorer sidebar on the left, with content in a 1040px frame, text held to 60ch (`--gutter` sides). The hero fills the first screen: name, role, proof line, status and links on the left, the building on the right. Floors stack with `clamp(48px, 7vw, 80px)` padding and a soft line between them. Under 900px the sidebar becomes a top bar with a "Files" menu, and the building shrinks to 112px beside the name so content starts on the first screen. Under 520px, charts and skills go to one column.

## Elevation & Depth

Flat. Depth comes from the isometric building itself (front face lit, side face shaded, roof decks in `--roof`) and from tonal layers (`--bg` → `--bg-deep` → `--card`). There are no drop shadows on panels. The only glows are light sources: the sun's halo, the moon's glow and the faint glow on a result bar.

**The Light-Source Glow Rule.** A glow means something emits light. Nothing else casts or receives a shadow.

## Shapes

Two radii: 6px for panels, code blocks and the Files button; fully round (999px) for link pills, the riddle input and its button. Floor tags are square boxes. The building uses mitred 1.5px strokes that don't scale. The basement is dashed because it's underground.

## Components

### Link pills
Mono 0.75rem in a 44px-tall pill with a 1px `--line` border on `--card`. The border turns amber on hover. Used for Email, GitHub, LinkedIn, Resume PDF and project links.

### Panels
Project cards (6px, `--bg-deep`, 1px `--line`, 28px padding), the riddle card (`--card`), and charts (`.compare`, 18px padding, `--line-soft`).

### Navigation
The file explorer: mono file names in `--muted`. Hover gives `--text` on a faint line tint. The active file gets an amber tint and a 2px amber inner bar on the left. On phones it's a top bar with a 44px "Files" toggle and a 44px theme toggle.

### Press and hover
Pills and buttons squeeze to `scale(.97)` on press (160ms, `--ease-out`). Hover colour changes only apply on devices that hover, so nothing stays highlighted after a tap. Text selection and the input caret use the amber tokens.

### The building (signature)
An SVG isometric tower in the hero. Each floor is a link: hover or focus lights that floor's windows and dims the rest, and focus draws a 3px `--focus` stroke. Windows light up one by one on load. With a mouse, the tower leans up to 7° toward the pointer.

### Stat charts (signature)
Horizontal bars drawn to scale on a faint `--track`. On their own they sit in a light panel; inside a project card they drop the panel and keep a rule above, so there's never a card inside a card. The baseline is `--muted` and the result is `--bar-result`, with the value in mono beside it. The range chart marks the cutoff with a single `--text` line.

## Do's and Don'ts

### Do:
- **Do** take every colour from the tokens, and check both themes.
- **Do** keep amber for light, progress and results.
- **Do** draw numbers to scale and label them in mono.
- **Do** keep touch targets at 44px or more on phones.
- **Do** keep the light on the right: lit front face, shaded side.

- **Do** use the motion tokens: `--ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`) for responses to a click or tap, `--ease-in-out` (`cubic-bezier(0.77, 0, 0.175, 1)`) for things crossing the screen. UI responses stay under 300ms; the 1.1s day/night switch is the one deliberate long moment.

### Don't:
- **Don't** add drop shadows or glassy cards; depth comes from the building and tonal layers.
- **Don't** add automatic motion beyond the windows on load, the rare shooting star and sky motion that settles within ~10s.
- **Don't** add a third radius or a third typeface.
- **Don't** let the test-data chart (330 records) outweigh production results.
