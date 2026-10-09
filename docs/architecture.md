# Architecture

High-level view only. Choices that are hard to reverse are recorded in [decisions/](decisions/).

## Goal

A portfolio a recruiter can read in under a minute, with enough personality to be remembered, and a visible history of how it improved.

## The site

One page, three files, no build step:

| File | Job |
|---|---|
| `index.html` | All content and structure. Each section is a floor of the building, in page order: roof first, level 1 last, then a hidden basement. |
| `assets/styles.css` | Layout, both themes, motion. Colours come from tokens in `:root` and `[data-theme]`. |
| `assets/main.js` | Behaviour: draws the building, theme toggle, floor navigation, sky motion, scroll effects, the riddle. |

`content/resume.md` is the only source of facts. Nothing appears on the site unless it is in that file first.

## The building

`main.js` draws the hero building as SVG from one list, `storeys`. A helper, `iso(u, v, z)`, turns a point on the building into screen coordinates (30 degree isometric). Each wall is drawn flat, as plain rectangles, inside a group that is skewed onto its face, so windows, the door and the cat need no special maths.

Each storey is one link, so the building is keyboard navigation as well as a picture.

## The basement

B1 is in the page from the start but `hidden`: the section, its explorer entry and its storey. Solving the riddle on L2 shows all three and saves `b1 = open` in `localStorage`, so it stays open on later visits. Nothing a recruiter needs lives there.

## Hosting

GitHub Pages serves `main` at https://ad-nap.github.io/portfolio/. `_config.yml` keeps project files (docs, backlog, reviews, tooling) out of the published site, so only `index.html` and `assets/` are public pages.

## Quality gate

```
edit site file ──► npm run -s check ──► pass ──► done
                        │
                        └── fail ──► fix ──► re-check
```

- `.claude/skills/design-review/` holds the checker (`scripts/check.js`) and the review steps. The checker also runs with B1 open, and tests that only the right answer opens it.
- A Stop hook (`.claude/hooks/design-check-on-stop.js`) runs the checker when a Claude Code turn ends with changed site files.
- `.claude/agents/recruiter-critic.md` reviews the site as a hiring manager. Reports land in `reviews/`.

## Versions

One repo. Each version is an annotated tag on `main` plus a GitHub Release with notes. See [decisions/0001-one-repo-tagged-releases.md](decisions/0001-one-repo-tagged-releases.md).
