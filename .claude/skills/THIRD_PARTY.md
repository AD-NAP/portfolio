# Third-party skills

Copied into the repo (not installed globally) so every cloud session has them. Update by re-copying from the source repo at a newer commit, then re-reading the files before committing.

| Skills | Source | Commit | Licence |
|---|---|---|---|
| `impeccable` (plus the `impeccable-*` agents in `.claude/agents/` and its hooks in `.claude/settings.json`) | [pbakaus/impeccable](https://github.com/pbakaus/impeccable), `.claude/` build | `d41d986` (engine 0.1.25) | Apache 2.0 (`impeccable/LICENSE`, `impeccable/NOTICE.md`) |
| `emil-design-eng`, `animate`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `remove-animations`, `choreograph`, `animation-performance`, `mobile-native`, `break-ui`, `learn-taste`, `ask-emil` | [emilkowalski/skills](https://github.com/emilkowalski/skills) | `64eb3de` | MIT (`LICENSE` in each folder) |

Notes:
- Impeccable's installer (`npx impeccable install`) downloads from impeccable.style, which cloud sessions can't reach, so the committed `.claude/` build was copied by hand.
- Impeccable's engine binary downloads from GitHub releases on first use into `~/.impeccable/bin` and is checked against `impeccable/scripts/engine-checksums.txt`.
- Telemetry is off for the project (`.impeccable/config.json`).
- Emil skills left out: `animate-expo`, `gestures`, `ask-sonner`, `pick-ui-library` (React and React Native), `apple-design`, `prototype`, `animation-vocabulary`, `write-swift` (off-topic for this site).
- CLAUDE.md wins over anything these skills say.
