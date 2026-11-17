# Product

<!-- impeccable:product-schema 1 -->

> CLAUDE.md wins wherever this file disagrees with it. Facts here come only from `content/resume.md` and CLAUDE.md. Lines marked *(inferred)* were drawn from those files without a separate interview; Shafik can correct them.

## Platform

web

## Users
- **Primary:** recruiters and hiring managers screening for backend software engineering and AI engineering roles in Singapore (Shafik is open to both). They arrive from a CV, LinkedIn or GitHub link, often on a phone, and want three answers fast: what he has shipped, the proof (numbers), and how to reach him.
- **Secondary** *(inferred)*: engineers and interviewers who click through to the project repos to judge the code and the thinking behind it.

## Product Purpose
A single-page portfolio for Shafik Adam, a software engineer in Singapore (Azbil, NUS Computer Science). Success: a recruiter finds the proof and a contact link within the first screen, and remembers the site afterwards.

## Positioning
The page is an isometric building and each floor is a section. It reads top to bottom, the same way you scroll: R About, L6 Skills, L5 Experience, L4 Projects, L3 Education, L2 Fun facts, L1 Contact. Shafik builds software for building-management systems, so the metaphor is his actual domain, not decoration. There's no ground floor (Singapore buildings start at level 1). A hidden basement, B1, opens when a visitor solves the riddle on L2. The sidebar is a file explorer (`about.ttl`, `experience/`, …), a nod to the Brick Schema TTL files he works with.

## Operating Context
- Hosted on GitHub Pages from `main`. Plain HTML, CSS and JS, with no build step and no framework (`index.html`, `assets/styles.css`, `assets/main.js`). Keep it that way.
- Two required themes: Night (navy sky, amber window lights, moon and stars) and Day (bright sky, lights off, sun and clouds).
- Checks: `npm run -s check` (the design-review skill) must pass before any change is done. It screenshots both themes at 390px and 1280px and runs axe.

## Capabilities and Constraints
- Contact links (Email, GitHub, LinkedIn, Resume PDF) appear in the hero and again in Contact (L1).
- Floors are real links ("Go to Experience, level 5") with a visible focus state.
- Personality to keep: the riddle on L2, the hidden B1 (it holds a cake), the perched cat, and the window cat that only appears at night.
- B1 is a reward, not content: nothing a recruiter needs may live only there.
- Motion rules (from CLAUDE.md): automatic motion is limited to the windows lighting up on load, a rare shooting star at night, and sky motion that settles within ~10s. All other motion answers the user. `prefers-reduced-motion` shows the final states.
- Open decisions: where SQL and React were used (no evidence on the page yet).

## Brand Commitments
- Name "Shafik Adam". Email shafik.adam98@gmail.com. No phone number, no photo.
- Fonts: Bricolage Grotesque (display and body) and Martian Mono (code and file names).
- Colours only from the tokens in `assets/styles.css`.
- The light comes from the right, where the sun and moon sit: the front face is lit, the side face is in shade.
- Voice *(inferred from the site copy)*: plain, short, specific sentences; numbers over adjectives; light humour kept to L2 and B1.

## Evidence on Hand
- Production results: config preparation cut from ~3 days to under 5 minutes; Cloud BMS MVP (9 months, 3 developers) approved by Azbil Japan leadership; Event Log feature owned end to end; onboarding guide let a new junior engineer set up and start on the same day.
- Projects: `edge-energy-optimizer` (forecast MAE 34.5 vs 45.7 kWh baseline; heating cost cut 14% to 20% with MPC) and `cumulus-coach` (RAG agent with a measured refusal cutoff, 18 tests in CI).
- Test data (330 mocked records) stays small next to production results.
- Absent, never to invent: production usage numbers for Cloud BMS, testimonials, a photo, a phone number.

## Product Principles
1. Proof first: production results get the visual weight, and they're readable at a glance, honest and drawn to scale.
2. The building is the interface: every new idea fits the floors-and-sky story or it doesn't ship.
3. Fast path for recruiters: contact links and the headline proof are on the first screen at every width.
4. Personality is earned: the riddle, cats and B1 delight, but they never stand between a visitor and the facts.

## Accessibility & Inclusion
WCAG 2.1 AA with 0 axe violations, in both themes: text contrast ≥ 4.5:1, focus indicators ≥ 3:1, touch targets ≥ 44px on phones, decorative graphics `aria-hidden`, and reduced motion fully supported.
