# 0001: One repo, versions as tagged releases

- Status: accepted
- Date: 2026-10-09

## Context

The portfolio is meant to show its own progression. The repo was first named `portfolio-v0.1`, which raised the question of how to keep later versions: a new repo per version, a branch per version, or tags in one repo.

## Decision

Keep one repo, `AD-NAP/portfolio`. Mark each version with an annotated tag on `main` (`v0.1.0`, `v0.2.0`, ...) and publish a GitHub Release for it with notes and screenshots.

- New minor version (`v0.2.0`): a visible milestone, such as a redesign or a new section.
- New patch version (`v0.1.1`): fixes to a released version.

## Consequences

- The commit history stays in one place and is itself the proof of progression.
- The Releases page is the changelog. Any two versions can be diffed with GitHub's compare view.
- Only the latest version is live. Older versions are viewed by checking out their tag or from release screenshots.
- The rename moved the live site from `/portfolio-v0.1/` to `/portfolio/`. The old Pages URL no longer works.
- Version branches and per-version repos are not used.
