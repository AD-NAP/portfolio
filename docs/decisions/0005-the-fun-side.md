# 0005: The fun side, a 3D room behind the riddle

- Status: accepted
- Date: 2026-11-19
- Release: v1.3.0
- Builds on: the Bonus from [0004](0004-card-into-portfolio.md). Its cake is replaced by a way into the room.

## Context

The card and the drawing sheet are the business side of the site. Shafik wanted a third state that shows his creative, fun side: a 3D room where each object opens something. He sketched it in his vault note `ideas/back-of-the-sheet-idea.md`, and a Three.js demo was built there on 19-11-2026. His decisions that day:

- The fun side has its own look. It isn't bound by the drawing sheet's fonts, colours or two themes.
- Clean, detailed models, not low poly.
- Desktop first. Phones don't need the 3D room for now.
- Content: hobbies, a museum of past versions, a monthly learning log, and future goals. Squash the bugs stays as a temporary mini game.
- The way in: the Bonus shows the room where the cake was. "Take me to the fun zone", beside "Reset the riddle", zooms into the room.

## Decision

- **Its own page, `back/`,** in the same repo and release history. Only `back/` loads Three.js and the models, and only when it shows the 3D room, so the main page and phones stay light.
- **Three.js 0.187.0, self-hosted** in `assets/vendor/three/` as the official ES modules (the core build and three addons: GLTFLoader, OrbitControls, RoomEnvironment), loaded with an import map. There's no build step.
- **Poly Haven models (CC0), not Kenney.** Kenney's site refused downloads from the cloud machine. Poly Haven's 1k glTF models are more detailed, which fits "not low poly" better. Nine models, about 18 MB in total. The room shell, the window, the floor lamp, the arcade cabinet, the panda and the books are built in code.
- **A still preview, not a live scene, in the Bonus.** The Bonus shows `assets/fun-preview.webp`, a render of the room at its resting view. The button grows that image to fill the screen (0.6s, transforms only), then opens `back/`. There the camera starts a little closer and settles back to the same view, so the two read as one move.
- **The camera** rests at a fixed angle. It can be turned a little by dragging (limited orbit, no pan). Choosing a thing glides the camera to it with GSAP and opens a panel beside it.
- **The plain list.** All the content is real HTML in the page: one section per thing, plus a row of real buttons that mirror clicking in the room. `?view=list`, phones, reduced motion and browsers without WebGL get the same content as a plain list, with a note and (where it can work) a button into the 3D room.
- **Achievements** from the demo are left out of v1.3.0, to keep the first version small.

## Revised in v1.3.2 (2026-11-19)

Shafik found the wait after "Take me to the fun zone" too long, and asked for the room to load in the background so the zoom feels smooth.

- **Lighter.** The models' textures are WebP instead of JPEG, 14.9 MB down to 2.2 MB. The models folder went from about 18 MB to 5.9 MB, with no visible difference in side-by-side screenshots.
- **Prefetched.** `back/manifest.json` lists every file the room needs. Once the riddle is solved and the Bonus is near the screen, on a desktop (not with reduced motion or Data Saver), `main.js` adds a `<link rel="prefetch">` for each. Hovering or focusing the link starts it too. Before the riddle, nothing from the fun side loads.
- **Seamless.** The room page opens on the same picture the zoom ended on (`.stage__poster`), with fonts not blocking the first paint. The room compiles its shaders and draws hidden frames, then crossfades in (0.4s). The camera's view is fitted to the picture's `object-fit: cover` crop, so they line up at every screen shape (under 0.6% of pixels differ). The camera pull-back on arrival is gone.
- **Measured** in headless Chromium on a 20 Mbit/s connection: from the click to the live room took 13.9s before, 10.0s cold after the change, and 8.4s with the prefetch done, of which about 6.8s is software rendering in the cloud machine. After the prefetch, only 2 requests (the web font) went to the network.

## Consequences

- `back/` is exempt from the Design rules in `CLAUDE.md` and from DESIGN.md. The Impeccable detector's design-system rules are ignored for `back/**`, with this decision as the reason. Content, accessibility and git rules still apply.
- The checker launches Chromium with software WebGL (SwiftShader). It tests that the main page loads no Three.js, the zoom, the phone note, that the room draws, the dock, Escape, the list view and reduced motion, and runs axe on all of them.
- Hobbies, the learning log and goals are visible `PLACEHOLDER`s until Shafik writes them.
