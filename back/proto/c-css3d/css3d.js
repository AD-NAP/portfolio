// Prototype C (explore/fun-side): the room in CSS 3D. No WebGL: tools/capture-css3d.js bakes the walls, floor and
// ceiling (lighting and shadows included) and one cut-out per thing from back/room.js. Here they are <img> planes
// placed in real room coordinates with matrix3d, seen through a CSS perspective that matches the room's camera.
// Turning your head is a pure rotation, so the flat cut-outs stay exact; walking up to a thing moves along your
// line of sight to it, so its cut-out stays face on. Same interface as room.js, so back/fun.js runs unchanged.

const FOV = 55, POSTER_ASPECT = 1.6, K = 100;   // as room.js; K: CSS px per metre inside the scene
const LOOK = { room: { yaw: 30, pitch: 10 }, close: { yaw: 8, pitch: 5 } };   // degrees
const GLIDE = 1.1;
const rad = d => d * Math.PI / 180;

// Tiny vector helpers (arrays of 3).
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = a => mul(a, 1 / Math.hypot(...a));
const yawPitchOf = d => ({ yaw: Math.atan2(d[0], -d[2]), pitch: Math.asin(norm(d)[1]) });

export async function startRoom({ canvas, tag, labels, reduceMotion, onPick, onProgress }) {
  const gsap = window.gsap;
  const base = new URL(".", import.meta.url);
  const data = await (await fetch(new URL("room.json", base))).json();
  const home = data.home.pos;

  /* ---------- Build the scene: one plane per surface and per thing ---------- */
  const stage = canvas.parentElement;
  canvas.hidden = true;
  const root = document.createElement("div");
  root.className = "c3d";
  root.innerHTML = `<div class="c3d__cam"></div>`;
  stage.insertBefore(root, tag);
  const camEl = root.firstChild;
  const planes = [...data.surfaces.map(p => ({ ...p, kind: "surface" })), ...data.sprites.map(p => ({ ...p, kind: "thing", lift: 0 }))];
  planes.forEach(p => {
    p.el = document.createElement("img");
    p.el.className = `c3d__plane c3d__${p.kind}`;
    p.el.alt = ""; p.el.decoding = "async"; p.el.draggable = false;
    p.el.src = new URL(p.src, base).href;
    camEl.appendChild(p.el);
  });
  let done = 0;
  await Promise.all(planes.map(p => p.el.decode().then(() => onProgress?.(++done / planes.length))));

  // Element px (1000 x 1000 box) to room metres: the plane's own axes, centred on its centre (lifted for the hop).
  const placePlane = p => {
    const c = add(p.centre, [0, p.lift || 0, 0]), n = cross(p.right, p.up);
    const o = add(sub(c, mul(p.right, p.w / 2)), mul(p.up, p.h / 2));
    const cx = mul(p.right, p.w / 1000), cy = mul(p.up, -p.h / 1000);
    p.el.style.transform = `matrix3d(${[...cx, 0, ...cy, 0, ...n, 0, ...o, 1].map(v => +v.toFixed(6)).join(",")})`;
  };
  planes.forEach(placePlane);
  const things = planes.filter(p => p.kind === "thing");

  /* ---------- The camera: where you stand (base) plus the head turn (look) ---------- */
  const start = yawPitchOf(sub(data.home.target, home));
  const cam = { x: home[0], y: home[1], z: home[2], yaw: start.yaw, pitch: start.pitch };
  const look = { yaw: 0, pitch: 0, toYaw: 0, toPitch: 0, limits: LOOK.room };
  const view = { w: 0, h: 0, P: 0, tanX: 0, tanY: 0 };
  const resize = () => {
    view.w = stage.clientWidth; view.h = stage.clientHeight;
    const aspect = view.w / view.h;
    // Frame the room like the poster (object-fit: cover of 16:10), as room.js does.
    view.tanY = Math.tan(rad(FOV / 2)) * (aspect > POSTER_ASPECT ? POSTER_ASPECT / aspect : 1);
    view.tanX = view.tanY * aspect;
    view.P = view.h / 2 / view.tanY;
    root.style.perspective = `${view.P}px`;
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  const basis = () => {
    const yaw = cam.yaw + look.yaw, pitch = cam.pitch + look.pitch;
    const f = [Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)];
    const right = norm(cross(f, [0, 1, 0]));
    return { f, right, up: cross(right, f), pos: [cam.x, cam.y, cam.z] };
  };
  // Room metres to CSS: into camera space, y flipped (CSS y runs down), scaled, and pushed to the perspective plane.
  const placeCamera = () => {
    const { f, right, up, pos } = basis();
    const r0 = [...mul(right, K), -K * dot(right, pos)];
    const r1 = [...mul(up, -K), K * dot(up, pos)];
    const r2 = [...mul(f, -K), K * dot(f, pos) + view.P];
    const m = [r0[0], r1[0], r2[0], 0, r0[1], r1[1], r2[1], 0, r0[2], r1[2], r2[2], 0, r0[3], r1[3], r2[3], 1];
    camEl.style.transform = `matrix3d(${m.map(v => +v.toFixed(5)).join(",")})`;
  };

  const aim = (x, y) => {
    if (reduceMotion) return;
    look.toYaw = Math.max(-1, Math.min(1, x)) * rad(look.limits.yaw);
    look.toPitch = Math.max(-1, Math.min(1, y)) * rad(look.limits.pitch);
  };
  window.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    aim((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1));
  });
  document.documentElement.addEventListener("pointerleave", () => aim(0, 0));

  let running = true, prev = performance.now();
  const frame = now => {
    requestAnimationFrame(frame);
    if (!running) return;
    const k = 1 - Math.exp(-Math.min(now - prev, 100) / 1000 * 5);
    prev = now;
    look.yaw += (look.toYaw - look.yaw) * k;
    look.pitch += (look.toPitch - look.pitch) * k;
    placeCamera();
    if (hovered) placeTag(hovered);
  };
  placeCamera();
  requestAnimationFrame(frame);

  /* ---------- Hover and click: a ray from the camera against each cut-out (and its alpha), then the door ---------- */
  const masks = new Map(things.map(p => {
    const c = document.createElement("canvas");
    c.width = 200; c.height = Math.max(1, Math.round(200 * p.el.naturalHeight / p.el.naturalWidth));
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(p.el, 0, 0, c.width, c.height);
    return [p, { w: c.width, h: c.height, a: g.getImageData(0, 0, c.width, c.height).data }];
  }));
  const exit = data.exit;
  const hitAt = e => {
    if (focused) return null;
    const r = root.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width * 2 - 1, ny = -((e.clientY - r.top) / r.height * 2 - 1);
    const { f, right, up, pos } = basis();
    const d = add(f, add(mul(right, nx * view.tanX), mul(up, ny * view.tanY)));
    let best = null, bt = Infinity;
    [...things, exit].forEach(p => {
      const n = cross(p.right, p.up), den = dot(d, n);
      if (Math.abs(den) < 1e-6) return;
      const c = add(p.centre, [0, p.lift || 0, 0]);
      const t = dot(sub(c, pos), n) / den;
      if (t <= 0.05 || t >= bt) return;
      const q = sub(add(pos, mul(d, t)), c);
      const u = dot(q, p.right) / p.w + 0.5, v = 0.5 - dot(q, p.up) / p.h;
      if (u < 0 || u > 1 || v < 0 || v > 1) return;
      const m = masks.get(p);
      if (m && m.a[(Math.floor(v * (m.h - 1)) * m.w + Math.floor(u * (m.w - 1))) * 4 + 3] < 40) return;
      bt = t; best = p.name;
    });
    return best;
  };
  const project = w => {
    const { f, right, up, pos } = basis(), q = sub(w, pos), z = dot(q, f);
    return [view.w / 2 + dot(q, right) / z * view.P, view.h / 2 - dot(q, up) / z * view.P];
  };
  let hovered = null, down = null;
  const planeOf = name => name === "exit" ? exit : things.find(p => p.name === name);
  function placeTag(name) {
    const p = planeOf(name);
    const [x, y] = project(add(p.centre, mul(p.up, p.h * 0.36)));
    tag.style.left = `${x}px`; tag.style.top = `${y}px`;
  }
  const setHover = name => {
    if (name === hovered) return;
    things.forEach(p => p.el.classList.toggle("is-hot", p.name === name));
    hovered = name;
    if (name) { tag.textContent = labels[name]; placeTag(name); }
    tag.classList.toggle("is-on", !!name);
    root.classList.toggle("is-hot", !!name);
  };
  root.addEventListener("pointermove", e => { if (e.pointerType === "mouse" && !down) setHover(hitAt(e)); });
  root.addEventListener("pointerleave", () => setHover(null));
  root.addEventListener("pointerdown", e => { down = { x: e.clientX, y: e.clientY }; });
  root.addEventListener("pointerup", e => {
    const moved = down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6;
    down = null;
    if (!moved) onPick(hitAt(e));
  });

  /* ---------- Walking up to a thing, along your line of sight to it ---------- */
  let focused = null, move = null;
  const glide = (to, limits) => {
    move?.kill();
    look.limits = limits;
    look.toYaw = Math.max(-rad(limits.yaw), Math.min(rad(limits.yaw), look.toYaw));
    look.toPitch = Math.max(-rad(limits.pitch), Math.min(rad(limits.pitch), look.toPitch));
    if (reduceMotion || !gsap) { Object.assign(cam, to); return; }
    move = gsap.to(cam, { ...to, duration: GLIDE, ease: "power3.inOut" });
  };
  const spotFor = p => {
    const toward = sub(p.centre, home), dir = norm(toward);
    // Close enough that it fills most of the view, never further back than where you stand.
    const dist = Math.min(Math.hypot(...toward), Math.max(p.h / (1.25 * view.tanY), p.w / (1.1 * view.tanX)));
    const pos = sub(p.centre, mul(dir, dist));
    const a = yawPitchOf(dir);
    // The panel covers the right third: turn a little right so the thing sits in what's left.
    return { x: pos[0], y: pos[1], z: pos[2], yaw: a.yaw + Math.atan(0.3 * view.tanX), pitch: a.pitch };
  };

  return {
    focus: name => {
      const p = planeOf(name);
      if (!p || name === "exit") return;
      focused = name;
      setHover(null);
      glide(spotFor(p), LOOK.close);
    },
    reset: () => {
      focused = null;
      glide({ x: home[0], y: home[1], z: home[2], yaw: start.yaw, pitch: start.pitch }, LOOK.room);
    },
    look: (dx, dy) => aim(look.toYaw / rad(look.limits.yaw) + dx, look.toPitch / rad(look.limits.pitch) + dy),
    hop: () => {
      const p = planeOf("panda");
      if (!p || reduceMotion || !gsap) return;
      gsap.timeline({ onUpdate: () => placePlane(p) })
        .to(p, { lift: 0.2, duration: 0.22, ease: "power2.out" })
        .to(p, { lift: 0, duration: 0.36, ease: "bounce.out" });
    },
    pause: () => { running = false; },
    resume: () => { running = true; prev = performance.now(); },
    stats: () => ({ engine: "css3d", things: things.map(p => p.name), exit: !!exit, camera: [cam.x, cam.y, cam.z].map(v => +v.toFixed(2)), focused }),
  };
}
