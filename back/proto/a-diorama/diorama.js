// Prototype A (explore/fun-side): the room as a 2.5D diorama. No Three.js: four pictures rendered once from
// back/room.js (tools/capture-diorama.js), stacked by depth. The mouse pans them like a head turn, nearer layers
// moving a little more; choosing a thing zooms toward it and crossfades to a close-up rendered from the same
// spot the live room walks you to. Same interface as room.js, so back/fun.js runs the page unchanged.

const ZOOM = { arcade: 2.6, desk: 2.1, shelf: 1.8, board: 2.2, chair: 1.8, panda: 2.4 };   // how close each thing feels
const PAN = { x: 0.13, y: 0.1 };      // head turn, as a share of the view (the pictures are 30% larger to allow it)
const DEPTH_SHIFT = 0.022;            // extra shift for the nearest layer, as a share of the view
const GLIDE = 1.1;                    // seconds, as in room.js

export async function startRoom({ canvas, tag, labels, reduceMotion, onPick, onProgress }) {
  const gsap = window.gsap;
  const base = new URL(".", import.meta.url);
  const sceneData = await (await fetch(new URL("scene.json", base))).json();
  const src = p => new URL(p, base).href;

  /* ---------- Build the stack inside the stage, where the canvas was ---------- */
  const stage = canvas.parentElement;
  canvas.hidden = true;
  const dio = document.createElement("div");
  dio.className = "dio";
  dio.innerHTML = `<div class="dio__world">${sceneData.layers.map((l, i) =>
    `<img class="dio__layer" data-i="${i}" alt="" decoding="async" src="${src(l.src)}">`).join("")}</div>
    <img class="dio__close" alt="" decoding="async">`;
  stage.insertBefore(dio, tag);
  const world = dio.querySelector(".dio__world");
  const layers = [...dio.querySelectorAll(".dio__layer")];
  const close = dio.querySelector(".dio__close");

  // Wait for the room's layers (close-ups load later, one at a time, when asked for).
  let done = 0;
  await Promise.all(layers.map(img => img.decode().then(() => onProgress?.(++done / layers.length))));

  // How much each layer shifts: by inverse depth, 0 for the back wall, 1 for the nearest layer.
  const inv = sceneData.layers.map(l => 1 / l.depth);
  const k = inv.map(v => (v - inv[0]) / (inv[inv.length - 1] - inv[0]));

  /* ---------- Fit: the middle 1/overscan of each picture covers the stage like the poster (16:10, cover) ---------- */
  const fit = { w: 0, h: 0, vw: 0, vh: 0 };
  const resize = () => {
    fit.w = stage.clientWidth; fit.h = stage.clientHeight;
    fit.vw = Math.max(fit.w, fit.h * 1.6); fit.vh = fit.vw / 1.6;
    const pw = fit.vw * sceneData.overscan, ph = fit.vh * sceneData.overscan;
    dio.style.setProperty("--pw", `${pw}px`);
    dio.style.setProperty("--ph", `${ph}px`);
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  /* ---------- Look around: eased toward the pointer, time-based like room.js ---------- */
  const look = { x: 0, y: 0, toX: 0, toY: 0, scale: 1 };
  const aim = (x, y) => {
    if (reduceMotion) return;
    look.toX = Math.max(-1, Math.min(1, x)) * look.scale;
    look.toY = Math.max(-1, Math.min(1, y)) * look.scale;
  };
  window.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    aim((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1));
  });
  document.documentElement.addEventListener("pointerleave", () => aim(0, 0));

  let running = true, last = performance.now(), raf = 0;
  const frame = now => {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    const e = 1 - Math.exp(-Math.min(now - last, 100) / 1000 * 5);
    last = now;
    look.x += (look.toX - look.x) * e;
    look.y += (look.toY - look.y) * e;
    // Turning right moves the room left; nearer layers a touch further, which is what gives the depth.
    world.style.setProperty("--lx", `${-look.x * PAN.x * fit.vw}px`);
    world.style.setProperty("--ly", `${look.y * PAN.y * fit.vh}px`);
    layers.forEach((l, i) => l.style.setProperty("--dx", `${-look.x * k[i] * DEPTH_SHIFT * fit.vw}px`));
    close.style.setProperty("--lx", `${-look.x * PAN.x * 0.3 * fit.vw}px`);
    close.style.setProperty("--ly", `${look.y * PAN.y * 0.3 * fit.vh}px`);
  };
  raf = requestAnimationFrame(frame);

  /* ---------- Hover and click: hit-test the layers' own pixels, front to back ---------- */
  const HIT_W = 360;
  const masks = layers.map(img => {
    const c = document.createElement("canvas");
    c.width = HIT_W; c.height = Math.round(HIT_W * img.naturalHeight / img.naturalWidth);
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0, c.width, c.height);
    return { c, data: g.getImageData(0, 0, c.width, c.height).data };
  });
  const things = Object.entries(sceneData.hotspots);
  const hitAt = e => {
    if (focused) return null;
    const out = [];
    for (let i = layers.length - 1; i >= 1; i--) {
      const r = layers[i].getBoundingClientRect();
      const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
      if (u < 0 || u > 1 || v < 0 || v > 1) continue;
      const m = masks[i], x = Math.floor(u * m.c.width), y = Math.floor(v * m.c.height);
      if (m.data[(y * m.c.width + x) * 4 + 3] < 40) continue;
      // The nearest thing on this layer owns the pixel.
      let best = null, bd = Infinity;
      things.forEach(([name, h]) => {
        if (h.layer !== i) return;
        const d = Math.hypot(h.x / 100 - u, (h.y / 100 - v) / 1.6);
        if (d < bd) { bd = d; best = name; }
      });
      if (best) return best;
    }
    return null;
  };
  let hovered = null, down = null;
  const placeTag = name => {
    const h = sceneData.hotspots[name], r = layers[h.layer].getBoundingClientRect(), s = stage.getBoundingClientRect();
    tag.style.left = `${r.left - s.left + h.x / 100 * r.width}px`;
    tag.style.top = `${r.top - s.top + (h.y - 12) / 100 * r.height}px`;
  };
  const setHover = name => {
    if (name === hovered) { if (name) placeTag(name); return; }
    hovered = name;
    if (name) { tag.textContent = labels[name]; placeTag(name); }
    tag.classList.toggle("is-on", !!name);
    dio.classList.toggle("is-hot", !!name);
  };
  dio.addEventListener("pointermove", e => { if (e.pointerType === "mouse" && !down) setHover(hitAt(e)); });
  dio.addEventListener("pointerleave", () => setHover(null));
  dio.addEventListener("pointerdown", e => { down = { x: e.clientX, y: e.clientY }; });
  dio.addEventListener("pointerup", e => {
    const moved = down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6;
    down = null;
    if (!moved) onPick(hitAt(e));
  });

  /* ---------- Walking up to a thing: zoom toward it, then the close-up takes over ---------- */
  let focused = null, tl = null;
  const closeups = {};
  const loadClose = name => closeups[name] ??= new Promise(res => {
    const img = new Image(); img.decoding = "async"; img.src = src(sceneData.closeups[name]);
    img.decode().then(() => res(img.src), () => res(img.src));
  });
  // Start fetching the close-ups once the room is up and the browser is idle.
  (window.requestIdleCallback || setTimeout)(() => Object.keys(sceneData.closeups).forEach(loadClose));

  const zoomTo = name => {
    const h = sceneData.hotspots[name];
    const s = ZOOM[name];
    // Put the thing a third of the way in from the left: the panel covers the right third.
    const pw = fit.vw * sceneData.overscan, ph = fit.vh * sceneData.overscan;
    const px = (h.x / 100 - 0.5) * pw, py = (h.y / 100 - 0.5) * ph;
    return { s, x: (fit.w * 0.34 - fit.w / 2) - px * s, y: -py * s };
  };

  const focus = async name => {
    if (!sceneData.closeups[name]) return;
    setHover(null);
    focused = name;
    look.scale = 0.3;                                  // up close, the head turns much less (±8° in room.js)
    aim(look.toX / 0.3 || 0, 0);
    const z = zoomTo(name);
    const url = await loadClose(name);
    if (focused !== name) return;
    close.src = url;
    tl?.kill();
    if (reduceMotion || !gsap) {
      world.style.setProperty("--zs", z.s); world.style.setProperty("--zx", `${z.x}px`); world.style.setProperty("--zy", `${z.y}px`);
      close.style.setProperty("--co", 1); close.style.setProperty("--cs", 1);
      return;
    }
    tl = gsap.timeline({ defaults: { ease: "power3.inOut" } })
      .to(world, { "--zs": z.s, "--zx": `${z.x}px`, "--zy": `${z.y}px`, duration: GLIDE }, 0)
      .fromTo(close, { "--co": 0, "--cs": 0.88 }, { "--co": 1, "--cs": 1, duration: 0.55, ease: "power2.out" }, GLIDE * 0.55);
  };

  const reset = () => {
    focused = null;
    look.scale = 1;
    tl?.kill();
    if (reduceMotion || !gsap) {
      world.style.setProperty("--zs", 1); world.style.setProperty("--zx", "0px"); world.style.setProperty("--zy", "0px");
      close.style.setProperty("--co", 0);
      return;
    }
    tl = gsap.timeline({ defaults: { ease: "power3.inOut" } })
      .to(close, { "--co": 0, "--cs": 0.9, duration: 0.3, ease: "power2.in" }, 0)
      .to(world, { "--zs": 1, "--zx": "0px", "--zy": "0px", duration: GLIDE }, 0.05);
  };

  return {
    focus,
    reset,
    look: (dx, dy) => aim(look.toX / look.scale + dx, look.toY / look.scale + dy),
    hop: () => {
      if (reduceMotion || !gsap || focused !== "panda") return;
      gsap.timeline()
        .to(close, { "--hop": "-3%", duration: 0.22, ease: "power2.out" })
        .to(close, { "--hop": "0%", duration: 0.36, ease: "bounce.out" });
    },
    pause: () => { running = false; },
    resume: () => { running = true; last = performance.now(); },
    stats: () => ({ engine: "diorama", things: things.map(([n]) => n).filter(n => n !== "exit"), exit: "exit" in sceneData.hotspots }),
  };
}
