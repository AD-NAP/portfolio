# Product

<!-- impeccable:product-schema 1 -->

> CLAUDE.md wins wherever this file disagrees with it. Facts here come only from `content/resume.md` and CLAUDE.md. Lines marked *(inferred)* were drawn from those files without a separate interview; Shafik can correct them.

## Platform

web

## Users
- **Primary:** recruiters and hiring managers screening for backend software engineering and AI engineering roles in Singapore (Shafik is open to both). They arrive from a CV, LinkedIn or GitHub link, often on a phone, and want three answers fast: what he has shipped, the proof (numbers), and how to reach him. Shafik presents himself as a builder and learner, not as a building-management specialist (2026-11-18).
- **Secondary** *(inferred)*: engineers and interviewers who click through to the project repos to judge the code and the thinking behind it.

## Product Purpose
A single-page portfolio for Shafik Adam, a software engineer in Singapore (Azbil, NUS Computer Science). Success: a recruiter finds the proof and a contact link within the first screen, and remembers the site afterwards.

## Positioning
Since v1.0.0 (2026-11-18) the page is **The build log**, a self-published two-ink riso zine. Each release is an issue. The cover sells the issue with cover lines that link to the proof, and the spreads follow with plain names: Experience, Projects, Lessons learned (from the dev log), Skills and Education, and a back page, Contact, with the riddle. A hidden centrefold opens when a visitor solves the riddle. The zine fits a builder and learner: people make zines to share what they built and what they learned, which is what Shafik's dev log already does. It replaced the isometric building (v0.2.0 to v0.5.0) because that tied him to building-management systems.

Since v1.1.0 (Issue 2) the page opens on a meishi-style name card naming his role at Azbil (as text, no logo). Scrolling, or "Open the build log", flips the card and grows its back into the zine cover. The card is the polite first meeting; the zine is the conversation after it.

## Operating Context
- Hosted on GitHub Pages from `main`. Plain HTML, CSS and JS, with no build step and no framework (`index.html`, `assets/styles.css`, `assets/main.js`). Keep it that way.
- Two required prints: Day (dark grey and red ink on white stock) and Night (light grey and red ink on dark grey stock), with a lighter grey as the third tone.
- Checks: `npm run -s check` (the design-review skill) must pass before any change is done. It screenshots both themes at 390px and 1280px and runs axe.

## Capabilities and Constraints
- Contact links (Email, GitHub, LinkedIn, Resume PDF) appear on the cover and again on the back page.
- The masthead contents and the cover lines are real links with a visible focus state.
- Personality to keep: the riddle on the back page, the hidden centrefold (it holds a cake), the cat on the riddle card, and the cat that only appears in the night print (on the colophon). Visitors can reset the riddle from the centrefold.
- The centrefold is a reward, not content: nothing a recruiter needs may live only there.
- Motion rules (from CLAUDE.md): the only automatic motion is the name card being handed over on load (under 1s). The card flip and the section-title print follow the scroll. All other motion answers the user. `prefers-reduced-motion` shows the final states.
- Open decisions: where SQL and React were used (no evidence on the page yet).

## Brand Commitments
- Name "Shafik Adam". Email shafik.adam98@gmail.com. No phone number, no photo.
- Fonts: Anybody (display) and Literata (body).
- Colours only from the tokens in `assets/styles.css`. Two inks: dark grey (light grey at night) and red, plus a lighter grey.
- Voice *(inferred from the site copy)*: plain, short, specific sentences; numbers over adjectives; light humour kept to the back page and the centrefold.

## Evidence on Hand
- Production results: config preparation cut from ~3 days to under 5 minutes; Cloud BMS MVP (9 months, 3 developers) approved by Azbil Japan leadership; Event Log feature owned end to end; onboarding guide let a new junior engineer set up and start on the same day.
- Projects: `edge-energy-optimizer` (forecast MAE 34.5 vs 45.7 kWh baseline; heating cost cut 14% to 20% with MPC) and `cumulus-coach` (RAG agent with a measured refusal cutoff, 18 tests in CI).
- Test data (330 mocked records) stays small next to production results.
- Absent, never to invent: production usage numbers for Cloud BMS, testimonials, a photo, a phone number.

## Product Principles
1. Proof first: production results get the visual weight, and they're readable at a glance, honest and drawn to scale.
2. The zine is the interface: every new idea fits the printed-zine story (pages, inks, issues) or it doesn't ship.
3. Fast path for recruiters: contact links and the headline proof are on the first screen at every width.
4. Personality is earned: the riddle, cats and centrefold delight, but they never stand between a visitor and the facts.

## Accessibility & Inclusion
WCAG 2.1 AA with 0 axe violations, in both themes: text contrast ≥ 4.5:1, focus indicators ≥ 3:1, touch targets ≥ 44px on phones, decorative graphics `aria-hidden`, and reduced motion fully supported.
