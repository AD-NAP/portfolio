// Prototype B (explore/fun-side): the room as a pre-rendered video. No Three.js: tools/capture-video.js renders a
// camera tour from back/room.js (from where you stand, past every thing, left to right) into tour.mp4. Scrolling
// scrubs along the tour and settles on the nearest stop; choosing a thing glides the playhead to its stop.
// Same interface as room.js, so back/fun.js runs the page unchanged.

const WHEEL = 0.07;      // frames per pixel of wheel
const SETTLE = 160;      // ms after the last wheel step before snapping to the nearest stop
const PAN = 0.025;       // the fake head turn, as a share of the view (the video is 6% larger to allow it)

export async function startRoom({ canvas, tag, labels, reduceMotion, onPick, onProgress }) {
  const gsap = window.gsap;
  const base = new URL(".", import.meta.url);
  const tour = await (await fetch(new URL("tour.json", base))).json();
  const last = tour.frames - 1;
  const stops = [["", 0], ...tour.order.map(n => [n, tour.stops[n]])];   // "" is where you stand

  /* ---------- The video, downloaded whole so every frame can be sought ---------- */
  const res = await fetch(new URL(tour.video, base));
  const total = +res.headers.get("content-length") || 0;
  const reader = res.body.getReader(), parts = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value); got += value.length;
    if (total) onProgress?.(Math.min(got / total, 1) * 0.95);
  }
  const stage = canvas.parentElement;
  canvas.hidden = true;
  const box = document.createElement("div");
  box.className = "vid";
  box.innerHTML = `<video class="vid__video" muted playsinline preload="auto" disablepictureinpicture></video>`;
  stage.insertBefore(box, tag);
  const video = box.querySelector("video");
  video.src = URL.createObjectURL(new Blob(parts, { type: "video/mp4" }));
  await new Promise((ok, fail) => { video.addEventListener("loadeddata", ok, { once: true }); video.addEventListener("error", fail, { once: true }); });
  onProgress?.(1);

  /* ---------- The playhead: f (shown), eased toward target ---------- */
  const play = { f: 0, target: 0 };
  let tween = null, driver = "api", wheelTimer = 0, running = true, prev = performance.now();
  let shown = -1;
  const show = () => {
    const want = Math.round(play.f);
    if (want === shown || video.seeking) return;
    shown = want;
    video.currentTime = (want + 0.5) / tour.fps;
  };

  // The head: a small pan of the enlarged video toward the pointer.
  const head = { x: 0, y: 0, toX: 0, toY: 0 };
  window.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse" || reduceMotion) return;
    head.toX = (e.clientX / innerWidth) * 2 - 1;
    head.toY = (e.clientY / innerHeight) * 2 - 1;
  });
  document.documentElement.addEventListener("pointerleave", () => { head.toX = head.toY = 0; });

  const loop = now => {
    requestAnimationFrame(loop);
    if (!running) return;
    const k = 1 - Math.exp(-Math.min(now - prev, 100) / 1000 * 6);
    prev = now;
    if (!tween) play.f += (play.target - play.f) * k;
    head.x += (head.toX - head.x) * k; head.y += (head.toY - head.y) * k;
    box.style.setProperty("--px", `${-head.x * PAN * 100}%`);
    box.style.setProperty("--py", `${-head.y * PAN * 100}%`);
    show();
    arrive();
  };
  requestAnimationFrame(loop);

  /* ---------- Stops: the panel follows where the scroll leaves you ---------- */
  let focused = null, at = "", quiet = false;
  const stopNear = f => stops.reduce((b, s) => Math.abs(s[1] - f) < Math.abs(b[1] - f) ? s : b);
  function arrive() {
    if (driver !== "wheel" || tween || wheelTimer) return;
    if (Math.abs(play.f - play.target) > 0.4) return;
    const [name] = stopNear(play.f);
    if (name === at) return;
    at = name;
    if (focused && focused !== name) { quiet = true; onPick(focused); quiet = false; }   // closes the panel
    if (name && focused !== name) onPick(name);                                          // opens this one
  }

  const glideTo = f => {
    driver = "api";
    tween?.kill();
    play.target = f;
    if (reduceMotion || !gsap) { play.f = f; return; }
    const d = Math.abs(f - play.f);
    tween = gsap.to(play, { f, duration: Math.min(0.7 + d / 45, 2.2), ease: "power2.inOut", onComplete: () => { tween = null; } });
  };

  box.addEventListener("wheel", e => {
    e.preventDefault();
    tween?.kill(); tween = null;
    driver = "wheel";
    setHover(null);
    play.target = Math.max(0, Math.min(last, play.target + e.deltaY * WHEEL));
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelTimer = 0; play.target = stopNear(play.target)[1]; }, SETTLE);
  }, { passive: false });

  /* ---------- Hover and click: boxes on the first frame, only while you stand at the start ---------- */
  const hitAt = e => {
    if (play.f > 0.5) return null;
    const r = video.getBoundingClientRect();
    const s = Math.max(r.width / video.videoWidth, r.height / video.videoHeight);
    const dw = video.videoWidth * s, dh = video.videoHeight * s;
    const u = (e.clientX - r.left - (r.width - dw) / 2) / dw * 100, v = (e.clientY - r.top - (r.height - dh) / 2) / dh * 100;
    let best = null, area = Infinity;
    Object.entries(tour.hotspots).forEach(([name, h]) => {
      if (u < h.x0 || u > h.x1 || v < h.y0 || v > h.y1) return;
      const a = (h.x1 - h.x0) * (h.y1 - h.y0);
      if (a < area) { area = a; best = name; }
    });
    return best;
  };
  let hovered = null, down = null;
  const placeTag = name => {
    const h = tour.hotspots[name], r = video.getBoundingClientRect(), st = stage.getBoundingClientRect();
    const s = Math.max(r.width / video.videoWidth, r.height / video.videoHeight);
    const dw = video.videoWidth * s, dh = video.videoHeight * s;
    tag.style.left = `${r.left - st.left + (r.width - dw) / 2 + (h.x0 + h.x1) / 200 * dw}px`;
    tag.style.top = `${r.top - st.top + (r.height - dh) / 2 + h.y0 / 100 * dh}px`;
  };
  function setHover(name) {
    if (name === hovered) { if (name) placeTag(name); return; }
    hovered = name;
    if (name) { tag.textContent = labels[name]; placeTag(name); }
    tag.classList.toggle("is-on", !!name);
    box.classList.toggle("is-hot", !!name);
  }
  box.addEventListener("pointermove", e => { if (e.pointerType === "mouse" && !down) setHover(hitAt(e)); });
  box.addEventListener("pointerleave", () => setHover(null));
  box.addEventListener("pointerdown", e => { down = { x: e.clientX, y: e.clientY }; });
  box.addEventListener("pointerup", e => {
    const moved = down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6;
    down = null;
    if (!moved) onPick(hitAt(e));
  });

  const step = dir => {
    const i = stops.indexOf(stopNear(play.target));
    const next = stops[Math.max(0, Math.min(stops.length - 1, i + dir))];
    tween?.kill(); tween = null;
    driver = "wheel";
    play.target = next[1];
  };

  return {
    focus: name => {
      if (!(name in tour.stops)) return;
      focused = at = name;
      setHover(null);
      glideTo(tour.stops[name]);
    },
    reset: () => {
      focused = null;
      if (quiet) return;              // the scroll closed the panel: stay where the scroll put you
      at = "";
      glideTo(0);
    },
    look: dx => { if (dx) step(Math.sign(dx)); },
    hop: () => {},
    pause: () => { running = false; video.pause(); },
    resume: () => { running = true; prev = performance.now(); },
    stats: () => ({ engine: "video", things: tour.order, exit: "exit" in tour.hotspots, frame: Math.round(play.f), at }),
  };
}
