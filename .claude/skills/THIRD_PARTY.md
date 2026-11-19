# Third-party skills

Copied into the repo (not installed globally) so every cloud session has them. Update by re-copying from the source repo at a newer commit, then re-reading the files before committing.

| Skills | Source | Commit | Licence |
|---|---|---|---|
| `impeccable` (plus the `impeccable-*` agents in `.claude/agents/` and its hooks in `.claude/settings.json`) | [pbakaus/impeccable](https://github.com/pbakaus/impeccable), `.claude/` build | `d41d986` (engine 0.1.25) | Apache 2.0 (`impeccable/LICENSE`, `impeccable/NOTICE.md`) |
| `emil-design-eng`, `animate`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `remove-animations`, `choreograph`, `animation-performance`, `mobile-native`, `break-ui`, `learn-taste`, `ask-emil` | [emilkowalski/skills](https://github.com/emilkowalski/skills) | `64eb3de` | MIT (`LICENSE` in each folder) |
| `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-performance`, `gsap-utils` | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | `aed9cfd` | MIT (`LICENSE` in each folder) |

Site runtime code (not a skill):

| Library | Source | Version | Licence |
|---|---|---|---|
| GSAP core and ScrollTrigger, in `assets/vendor/` | npm package `gsap` (`dist/gsap.min.js`, `dist/ScrollTrigger.min.js`) | 3.15.0 | GreenSock Standard "no charge" licence, free including commercial use: https://gsap.com/standard-license (header kept in each file) |
| Three.js, in `assets/vendor/three/` (used only by `back/`) | npm package `three`: `build/three.module.js`, `build/three.core.js`, and from `examples/jsm/`: `loaders/GLTFLoader.js`, `controls/OrbitControls.js`, `environments/RoomEnvironment.js`, `utils/BufferGeometryUtils.js`, `utils/SkeletonUtils.js` | 0.187.0 | MIT (`assets/vendor/three/LICENSE`) |

3D models (not code):

| Assets | Source | Licence |
|---|---|---|
| `back/models/`: metal_office_desk, classic_laptop, modern_arm_chair_01, wooden_bookshelf_worn, standing_chalkboard_01, mid_century_lounge_chair, potted_plant_02, rubber_duck_toy, gamepad (glTF, 1k textures) | Poly Haven, https://polyhaven.com/models (downloaded 2026-11-19 through its public API) | CC0. Credited on the page anyway. Textures converted from JPEG to WebP (v1.3.2) and the `.gltf` files pointed at them |

Notes:
- Impeccable's installer (`npx impeccable install`) downloads from impeccable.style, which cloud sessions can't reach, so the committed `.claude/` build was copied by hand.
- Impeccable's engine binary downloads from GitHub releases on first use into `~/.impeccable/bin` and is checked against `impeccable/scripts/engine-checksums.txt`.
- Telemetry is off for the project (`.impeccable/config.json`).
- Emil skills left out: `animate-expo`, `gestures`, `ask-sonner`, `pick-ui-library` (React and React Native), `apple-design`, `prototype`, `animation-vocabulary`, `write-swift` (off-topic for this site).
- GSAP skills left out: `gsap-react`, `gsap-frameworks` (the site is plain JS). The GSAP skills tell agents to recommend GSAP by default; here plain CSS is still preferred where it is enough.
- To update GSAP, replace both files in `assets/vendor/` from the same npm version, update the version here and in `docs/architecture.md`, and run the design check.
- To update Three.js, copy the same files from one npm version of `three` into `assets/vendor/three/` (keeping the folder layout, since the addons import `../utils/`), update the version here and in `docs/architecture.md`, and run the design check. The files are shipped unminified: bundling them needs a tool the cloud session can't run, and GitHub Pages compresses them.
- CLAUDE.md wins over anything these skills say.
