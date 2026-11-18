# 0004: The business card opens into a drawing sheet

- Status: accepted
- Date: 2026-11-18
- Release: v1.2.0 (Shafik kept the new look on v1 as an iteration, not a v2)
- Replaces: the zine world of [0002](0002-riso-zine-redesign.md) and the flip of [0003](0003-name-card-and-new-inks.md). The card itself, Azbil as text, and returning visitors skipping it all carry over from 0003.

## Context

In v1.1.0 the meishi turned over in 3D and then scaled up until its back covered the screen and became the zine cover. Scaling the card blurred its text, the scrub felt jumpy on phones, and nothing stopped a visitor from leaving it half-turned.

Shafik's vault note `ideas/business-card-idea.md` described a better idea: a minimal business card that *turns into* the portfolio. The name moves to the top-left, the navigation appears, and the content was hidden inside the card all along. The note also set a new look: off-white or warm grey, almost-black type, one subtle accent, thin grid lines, an engineering and architecture feel, restrained motion. Shafik chose a new look built for this idea over a new zine issue (18-11-2026).

## Decision

- **A new visual world: the drawing sheet.** Light warm-grey sheet (graphite in the dark theme), almost-black ink, a twelve-column hairline grid, section titles standing on full-width rules, and a drawing title block as the footer. One typeface, Archivo, with its width axis. The zine (issues, masthead, spreads, folios, two-ink misregistration, grain, scroll-printed titles) is retired.
- **The red stays** as the one accent: the card's rule, the key result, focus.
- **Card to sheet.** It is pinned and scrubbed with GSAP ScrollTrigger and uses only transforms and opacity. The card's lines step aside. A text-free paper layer scales into the full sheet. The name moves (it doesn't scale up) to the bar's name slot and swaps with it in the same frame. The links arrive from the right. The About section, already laid out under the card, fades in. Scrolling back reverses it.
- **Snap.** If the visitor lets go mid-way, it settles to the card or the portfolio, in the direction they were scrolling.
- **Personality: the riddle only.** The riddle and its cake reward (now "Bonus", with its reset) stay. Both cats go.
- **Order.** About, Experience, Projects, Lessons learned, Skills and Education, Contact. Experience still comes before Projects (Shafik's rule), although the idea note listed Projects first.

## Consequences

- Text never scales up during the transition, so it stays crisp. The name's landing spot is measured and corrected against the bar's text box, and the checker fails if it is more than 1px off.
- The checker now tests: bar hidden on the card and shown after, landing within 1px, snap resting at an end, plus the button, returning visitors, replay and keyboard focus, as before.
- Under reduced motion or without GSAP, the card and About are plain sections and the bar is always shown.
- `localStorage` key `bonus` replaces `centrefold`; the older `centrefold` and `b1` keys still open the reward.
- Projects as engineering stories (Problem, Constraints, Architecture, Decisions, Implementation, Result), also from the idea note, is left for a later release, after the facts are pulled from the vault.
