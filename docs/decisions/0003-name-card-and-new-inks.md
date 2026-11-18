# 0003: Open on a name card, and change the inks to grey and red

- Status: accepted
- Date: 2026-11-18

## Context

v1.0.0 opened straight on the zine cover. For v1.1.0 (Issue 2) Shafik wanted visitors to meet him the way people meet at work: with a business card, naming his current job at Azbil, before they open the zine. He also wanted the inks to move from riso blue and sunflower to dark grey with an Azbil-like red.

## Decision

- **A meishi first.** The page opens on a Japanese-style business card (91 × 55). Front: "Azbil ASPO, Singapore" as text with a red rule, the name (the page's `h1`), the title and the email. Back: the contact details.
- **The card becomes the cover.** Scrolling, or "Open the build log", pins the card for one screen (GSAP ScrollTrigger), turns it over, grows its back across the screen and dissolves it into the zine cover below. It is scrubbed to the scroll, so it reverses on the way back up. No snapping or scroll-jacking.
- **Handed over properly.** On load the card rises into place with a slight bow. This replaces the cover's print run as the only automatic motion.
- **Returning visitors** (`card = seen` in localStorage) open on the cover, with "See my card again" to replay.
- **Grey and red inks across the whole site.** Day print: white stock, dark grey ink, red `#C8202B`. Night print: dark grey stock, light grey ink, red `#F05A5F`. A lighter grey is the third tone. The red pass is still a misregistered `text-shadow`.
- **Azbil as text, never the logo.** The logo would be a trademark issue and would make the site look like an official Azbil page.

## Consequences

- The first screen shows the card front, then a one-line intro, GitHub, LinkedIn, Resume (PDF) and "Open the build log" under the card. The recruiter critic warned that a bare card hides the positioning and links, so they sit with the card rather than only on the cover. The cover lines come right after the flip.
- The card and the cover are pinned together, so the grown back swaps for a cover that is already in place: no faded or blank moment (from the Impeccable finish review).
- The card's back is a picture (`aria-hidden`, `inert`); the real links live on the cover, so screen readers and keyboards never meet hidden or mirrored links.
- Reduced motion, or GSAP failing to load, shows the card and the cover as plain sections.
- The token names changed from `--yellow`/`--on-yellow` to `--accent`/`--on-accent`.
- The design checker tests the card: first screen, the button, returning visitors and the replay link.
