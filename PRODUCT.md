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
Since v1.2.0 (2026-11-18) the page is **a business card that opens into a drawing sheet**, from Shafik's idea note (`vault/ideas/business-card-idea.md`). The card answers "who are you?"; the sheet answers "what have you done?". The visitor journey is identity, curiosity, reveal, evidence. Scrolling, or "Open the portfolio", grows the card into a technical drawing sheet; the name moves to the top bar and the links arrive, so the portfolio feels as if it was inside the card all along. The sheet then reads About (with Highlights linking to the proof), Experience, Projects, Lessons learned, Skills and Education, and Contact with the riddle. The drawing-sheet look (warm grey, almost-black ink, hairline grid, one red) fits an engineer who shows his work: minimal, technical and editorial, not the typical flashy developer portfolio. It replaced The build log zine (v1.0.0 to v1.1.0), whose 3D card flip blurred and stuttered; the isometric building (v0.2.0 to v0.5.0) came before that.

## Operating Context
- Hosted on GitHub Pages from `main`. Plain HTML, CSS and JS, with no build step and no framework (`index.html`, `assets/styles.css`, `assets/main.js`). Keep it that way.
- Two required themes: light (warm-grey sheet, almost-black ink, red) and dark (graphite sheet, chalk-white ink, a brighter red).
- Checks: `npm run -s check` (the design-review skill) must pass before any change is done. It screenshots both themes at 390px and 1280px and runs axe.

## Capabilities and Constraints
- Contact links (Email, GitHub, LinkedIn, Resume PDF) appear under the card, in About, and again in Contact.
- The bar's links and the Highlights are real links with a visible focus state.
- Personality to keep: the riddle in Contact and the hidden Bonus it opens (it holds a cake), with a reset. The cats were retired in v1.2.0.
- The Bonus is a reward, not content: nothing a recruiter needs may live only there.
- Motion rules (from CLAUDE.md): the only automatic motion is the card settling onto the desk on load (under 1s). The card-to-sheet transition follows the scroll and snaps to an end. All other motion answers the user. `prefers-reduced-motion` shows the final states.
- Open decisions: where SQL and React were used (no evidence on the page yet). Projects as engineering stories (Problem, Constraints, Architecture, Decisions, Implementation, Result) is planned for a later release.

## Brand Commitments
- Name "Shafik Adam". Email shafik.adam98@gmail.com. No phone number, no photo.
- Font: Archivo (variable width and weight) throughout.
- Colours only from the tokens in `assets/styles.css`: warm grey and almost-black (graphite and chalk at night), plus one Azbil-like red.
- Azbil appears as text on the card, never as its logo.
- Voice *(inferred from the site copy)*: plain, short, specific sentences; numbers over adjectives; light humour kept to the riddle and the Bonus.

## Evidence on Hand
- Production results: config preparation cut from ~3 days to under 5 minutes; Cloud BMS MVP (9 months, 3 developers) approved by Azbil Japan leadership; Event Log feature owned end to end; onboarding guide let a new junior engineer set up and start on the same day.
- Projects: `edge-energy-optimizer` (forecast MAE 34.5 vs 45.7 kWh baseline; heating cost cut 14% to 20% with MPC) and `cumulus-coach` (RAG agent with a measured refusal cutoff, 18 tests in CI).
- Test data (330 mocked records) stays small next to production results.
- Absent, never to invent: production usage numbers for Cloud BMS, testimonials, a photo, a phone number.

## Product Principles
1. Proof first: production results get the visual weight, and they're readable at a glance, honest and drawn to scale.
2. The sheet is the interface: every new idea fits the drawing-sheet story (card, sheet, rules, title block) or it doesn't ship.
3. Fast path for recruiters: contact links are on the first screen at every width, and the headline proof is on the first screen after the card opens.
4. Personality is earned: the riddle and its Bonus delight, but they never stand between a visitor and the facts.

## Accessibility & Inclusion
WCAG 2.1 AA with 0 axe violations, in both themes: text contrast ≥ 4.5:1, focus indicators ≥ 3:1, touch targets ≥ 44px on phones, decorative graphics `aria-hidden`, and reduced motion fully supported.
