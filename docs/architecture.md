# Architecture

High-level view only. Choices that are hard to reverse are recorded in [decisions/](decisions/).

## Goal

A portfolio a recruiter can read in under a minute, with enough personality to be remembered, and a visible history of how it improved.

## The site

One page, three files, no build step:

| File | Job |
|---|---|
| `index.html` | All content and structure, in zine order: masthead, cover, spreads (Experience, Projects, the hidden centrefold, Lessons learned, Skills and Education), back page (Contact), colophon. |
| `assets/styles.css` | Layout, both prints, the two-ink effect and the print run. Colours come from tokens in `:root` and `[data-theme]`. |
| `assets/main.js` | Behaviour: print toggle, contents highlight, the riddle and centrefold, the `ad-nap` flip, the cat's tail. |

Also in `assets/`: `favicon.svg` (a two-ink "SA" stamp) and `og.png`, the 1200x630 link preview. `og.png` is a screenshot of the cover in the day print with the masthead hidden; re-render it with Playwright if the cover changes.

The resume download, `assets/Shafik-Adam-Resume.pdf`, is built from the vault master CV with `npm run -s resume` (`tools/build-resume.js`: drops the phone number, prints one A4 page with Playwright). Rebuild it whenever `vault/career/resume-master.md` changes.

`content/resume.md` is the only source of facts. Nothing appears on the site unless it is in that file first.

## The zine

Since v1.0.0 the site is "The build log", a two-ink riso zine ([decisions/0002-riso-zine-redesign.md](decisions/0002-riso-zine-redesign.md)).

- **Two inks.** Headings with the class `ink` get the sunflower pass as a `text-shadow`, offset a few pixels (`--mis-x`, `--mis-y`). There is only one copy of the text. Hovering or focusing a section brings its title into register.
- **The print run.** On load, the cover name animates once (`@keyframes print-run`): the sunflower pass rolls across, then the blue ink comes in. Reduced motion shows the finished print.
- **Paper.** One static SVG noise layer (`body::after`) blends into both prints.
- **Charts.** Bars are drawn to scale with CSS custom properties (`--from`, `--to`). Results print in solid sunflower; baselines print as a blue halftone.

## Phones

Below 900px each spread becomes one column and the masthead contents become a horizontal strip. Below 600px the masthead stops being sticky, so the cover (name, line, contact links, lead cover line) fills the first screen.

## The centrefold

The centrefold section is in the page from the start but `hidden`, with its contents entry. Solving the riddle on the back page shows both and saves `centrefold = open` in `localStorage`, so it stays open on later visits. Nothing a recruiter needs lives there.

## Hosting

GitHub Pages serves `main` at https://ad-nap.github.io/portfolio/. `_config.yml` keeps project files (docs, backlog, reviews, tooling) out of the published site, so only `index.html` and `assets/` are public pages.

## Quality gate

```
edit site file ──► npm run -s check ──► pass ──► done
                        │
                        └── fail ──► fix ──► re-check
```

- `.claude/skills/design-review/` holds the checker (`scripts/check.js`) and the review steps. The checker also runs with the centrefold open, and tests that only the right answer opens it.
- A Stop hook (`.claude/hooks/design-check-on-stop.js`) runs the checker when a Claude Code turn ends with changed site files.
- `.claude/agents/recruiter-critic.md` reviews the site as a hiring manager. Reports land in `reviews/`.

## Versions

One repo. Each version is an annotated tag on `main` plus a GitHub Release with notes. See [decisions/0001-one-repo-tagged-releases.md](decisions/0001-one-repo-tagged-releases.md).
