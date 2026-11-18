# 0002: Replace the building with a riso zine

- Status: accepted
- Date: 2026-11-18

## Context

From v0.2.0 to v0.5.0 the site was an isometric building, one floor per section. It fit Shafik's day job (software for building-management systems), but that was the problem: it tied him to one domain while he aims at backend and AI engineering roles more broadly. He wanted to be remembered as a builder and learner.

The direction came from a brainstorm with the frontend-design and Impeccable `shape` skills. Seven candidate worlds were drawn from his own world (lab notebook, MRT map, NUSMods-style module catalogue, school exercise book, research poster, personal changelog, riso zine). Impeccable's concept roll (seed `seed:e4c83ff7a6b64abf`, run degraded because impeccable.style is blocked in cloud sessions) picked the riso zine, and Shafik chose it.

## Decision

The site becomes **The build log**, a self-published two-ink riso zine.

- Each minor or major release is a new issue: v1.0.0 is Issue 1, v1.1.0 will be Issue 2. A patch release is a reprint of the same issue.
- Two prints replace the night and day skies. Day: riso blue and sunflower on cool white stock. Night: pale ink and sunflower on dark blue stock.
- The cover carries the proof through cover lines that link to the articles with page numbers.
- A new spread, Notes I took, shows the learning, using facts already in `content/resume.md`.
- The personality carries over in zine form: the riddle on the back page opens a hidden centrefold (still a cake), the cat perches on the cover name, and a second cat appears only in the night print.
- Fonts change to Anybody (display) and Literata (body).
- The only automatic motion is the print run on load.

## Consequences

- This is a new visual world, so it is a major version, v1.0.0.
- CLAUDE.md, PRODUCT.md and DESIGN.md were rewritten. The building, sky, file-explorer sidebar, shooting star and Turtle block are gone.
- The design checker tests the centrefold instead of B1, and the finished print instead of lit windows.
- Visitors who solved the riddle before will see it shut again: the storage key changed from `b1` to `centrefold`.
- The masthead and colophon name the issue, so the Releases page and the zine tell the same story. Update both with each minor or major release.

## Follow-ups before release (2026-11-18)

Shafik reviewed the build before v1.0.0 was published and decided:

- Experience comes before Projects, as the recruiter critic suggested for backend roles.
- Section names are plain (Experience, Projects, Lessons learned, Skills, Education, Contact). The zine voice stays in the look, the masthead and the cover lines.
- The cat moved from the cover name, where it looked out of place, onto the riddle card. The night cat sits on the colophon rule.
- Visitors can reset the riddle from the centrefold. Visitors who solved the old basement riddle (`b1`) keep their reward.

