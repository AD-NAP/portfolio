# Shafik Adam portfolio

Single-page portfolio, drawn as a building where each floor is a section. Plain HTML, CSS and JavaScript with no build step.

Live site: https://ad-nap.github.io/portfolio/

This repo is also a project in its own right: it shows how the site evolved. Every version is a tagged release, so the [Releases page](https://github.com/AD-NAP/portfolio/releases) reads as the changelog.

## Run it locally

Open `index.html` in a browser. Nothing to install for the site itself.

## Check a change

```bash
npm install
npm run -s check
```

Playwright is not in `package.json`. If the checker reports it missing, it prints the install command.

The checker serves the site, screenshots both themes at phone and desktop width, and fails on overflow, JS errors, axe violations, low contrast, small touch targets or broken reduced motion.

## Versions

| Version | Date | Summary |
|---|---|---|
| [v0.2.0](https://github.com/AD-NAP/portfolio/releases/tag/v0.2.0) | 2026-10-09 | Isometric building that leans toward the mouse, floors read top to bottom, a hidden basement behind a riddle |
| [v0.1.1](https://github.com/AD-NAP/portfolio/releases/tag/v0.1.1) | 2026-10-09 | Recruiter fixes: proof line in the hero, edge-energy-optimizer project, clearer charts, tighter timeline facts |
| [v0.1.0](https://github.com/AD-NAP/portfolio/releases/tag/v0.1.0) | 2026-10-09 | First public version: building concept, day and night themes, WCAG 2.1 AA |

To see an old version, check out its tag:

```bash
git switch --detach v0.2.0
```

## Docs

- [docs/architecture.md](docs/architecture.md): how the site is put together.
- [docs/decisions/](docs/decisions/): choices that are hard to reverse.
- [BACKLOG.md](BACKLOG.md): open items.
