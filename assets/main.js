(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SVG = "http://www.w3.org/2000/svg";
  const root = document.documentElement;
  const isNight = () => root.dataset.theme !== "light";

  const svgEl = (tag, attrs) => {
    const el = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };

  /* ---------- Hero building: one storey per section, drawn isometric ---------- */
  // Top to bottom, the same order as the page: roof first, level 1 last.
  const storeys = [
    { id: "about",        title: "About",      where: "roof",    level: "R",  file: "about.ttl",     h: 28, roof: true },
    { id: "skills",       title: "Skills",     where: "level 6", level: "L6", file: "skills.ttl",    h: 44 },
    { id: "experience",   title: "Experience", where: "level 5", level: "L5", file: "experience/",   h: 44 },
    { id: "projects",     title: "Projects",   where: "level 4", level: "L4", file: "projects/",     h: 44 },
    { id: "education",    title: "Education",  where: "level 3", level: "L3", file: "education.md",  h: 44 },
    { id: "fun",          title: "Fun facts",  where: "level 2", level: "L2", file: "fun-facts.md",  h: 44 },
    { id: "contact",      title: "Contact",    where: "level 1", level: "L1", file: "contact.ttl",   h: 56, door: true },
  ];
  // The cat sits in one window on the fun-facts floor (front face, row 2, column 4).
  const CAT = { id: "fun", row: 1, col: 3 };

  // Footprint: u runs back along the shaded side face, v along the front face
  // (the one that catches the sun and moon). z is height.
  const SIDE = 70, FRONT = 120;
  const COS = Math.cos(Math.PI / 6), SIN = 0.5;
  const NEAR = { x: 92, y: 410 };   // the corner nearest the viewer, at street level
  const iso = (u, v, z) => [NEAR.x + (v - u) * COS, NEAR.y - (u + v) * SIN - z];
  const points = (...pts) => pts.map(p => p.map(n => n.toFixed(1)).join(",")).join(" ");

  const floorsGroup = document.querySelector(".tower__floors");
  const windows = [];   // { el, extra? } collected top-down
  if (floorsGroup) {
    // A wall is drawn flat (plain rects) inside a group that is skewed onto its face.
    const wall = (parent, s, front, origin, width, cols, rows) => {
      const g = svgEl("g", { transform: `matrix(${COS} ${front ? -SIN : SIN} 0 1 ${origin[0].toFixed(1)} ${origin[1].toFixed(1)})` });
      g.appendChild(svgEl("rect", { x: 0, y: 0, width, height: s.h, class: "storey__body" + (front ? "" : " storey__body--side") }));
      const winW = front ? 14 : 12, winH = s.door ? 16 : s.roof ? 12 : 11;
      const padX = (width - winW * cols) / (cols + 1) * 1.2;
      const gapX = cols > 1 ? (width - padX * 2 - winW * cols) / (cols - 1) : 0;
      const padTop = s.door ? 12 : s.roof ? 10 : 8;
      const gapY = rows > 1 ? (s.h - padTop * 2 - winH * rows) / (rows - 1) : 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Level 1: the middle bay of the front face is the door.
          if (s.door && front && c === 2) continue;
          const wx = padX + c * (winW + gapX), wy = padTop + r * (winH + gapY);
          const win = svgEl("rect", { x: wx, y: wy, width: winW, height: winH, class: "storey__win" });
          g.appendChild(win);
          const entry = { el: win };
          if (front && s.id === CAT.id && r === CAT.row && c === CAT.col) {
            // A small sitting cat silhouette: ears, head, body, curled tail.
            const cat = svgEl("path", {
              class: "storey__cat",
              transform: `translate(${wx} ${wy - 0.4}) scale(.86)`,
              d: "M5 13 V7.5 L5.4 4 L6.8 5.6 H8.6 L10 4 L10.4 7.5 Q12 10 11 13 Z M11 12.6 q2.6 0 2.4 -3 l-.9 .1 q.1 2 -1.5 2 Z",
            });
            g.appendChild(cat);
            entry.extra = cat;
          }
          windows.push(entry);
        }
      }
      if (s.door && front) {
        const door = svgEl("rect", { x: width / 2 - 11, y: s.h - 36, width: 22, height: 36, class: "storey__win" });
        g.appendChild(door);
        windows.push({ el: door });
      }
      parent.appendChild(g);
    };

    const total = storeys.reduce((sum, s) => sum + (s.roof ? 0 : s.h), 0);

    // Street level: a paved plot a little wider than the building.
    const M = 9;
    floorsGroup.before(svgEl("polygon", {
      class: "tower__ground", "aria-hidden": "true",
      points: points(iso(-M, -M, 0), iso(SIDE + M, -M, 0), iso(SIDE + M, FRONT + M, 0), iso(-M, FRONT + M, 0)),
    }));

    let top = total;
    for (const s of storeys) {
      const a = svgEl("a", { href: `#${s.id}`, class: "storey", "aria-label": `Go to ${s.title}, ${s.where}` });
      let mid;
      if (s.roof) {
        // The roof: the deck on top of level 6, and a smaller room set back on it.
        const u0 = 12, u1 = 46, v0 = 14, v1 = 74, z = total + s.h;
        a.appendChild(svgEl("polygon", { class: "storey__top", points: points(iso(0, 0, total), iso(SIDE, 0, total), iso(SIDE, FRONT, total), iso(0, FRONT, total)) }));
        wall(a, s, false, iso(u1, v0, z), u1 - u0, 2, 1);
        wall(a, s, true, iso(u0, v0, z), v1 - v0, 3, 1);
        a.appendChild(svgEl("polygon", { class: "storey__top", points: points(iso(u0, v0, z), iso(u1, v0, z), iso(u1, v1, z), iso(u0, v1, z)) }));
        // Mast and beacon stand on the room.
        const [mx, my] = iso((u0 + u1) / 2, (v0 + v1) / 2, z);
        a.appendChild(svgEl("line", { class: "tower__line", x1: mx, y1: my, x2: mx, y2: my - 34 }));
        a.appendChild(svgEl("circle", { class: "tower__beacon", cx: mx, cy: my - 36, r: 3.5 }));
        mid = total + s.h / 2;
      } else {
        wall(a, s, false, iso(SIDE, 0, top), SIDE, 3, s.door ? 1 : 2);
        wall(a, s, true, iso(0, 0, top), FRONT, 5, s.door ? 1 : 2);
        mid = top - s.h / 2;
        top -= s.h;
      }

      const [tx, ty] = iso(SIDE, 0, mid);
      const tag = svgEl("text", { x: tx - 8, y: ty + 3, class: "storey__tag", "text-anchor": "end", "aria-hidden": "true" });
      tag.textContent = s.level;
      a.appendChild(tag);
      const [lx, ly] = iso(0, FRONT, mid);
      const label = svgEl("text", { x: lx + 10, y: ly + 3, class: "storey__label", "aria-hidden": "true" });
      label.textContent = s.file;
      a.appendChild(label);

      floorsGroup.appendChild(a);
    }
  }

  // Phones hide the floor labels and tags, so crop to just the building.
  const towerSvg = document.querySelector(".tower svg");
  const phone = window.matchMedia("(max-width: 900px)");
  const fitTower = () => towerSvg?.setAttribute("viewBox", phone.matches ? "14 28 200 396" : "0 28 300 396");
  fitTower();
  phone.addEventListener("change", fitTower);

  // Desktop with a mouse: the building leans a few degrees toward the pointer.
  const hero = document.querySelector(".hero");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (hero && towerSvg && !reduceMotion) {
    let frame = 0, tx = 0, ty = 0;
    const apply = () => {
      frame = 0;
      towerSvg.style.setProperty("--tilt-x", tx.toFixed(3));
      towerSvg.style.setProperty("--tilt-y", ty.toFixed(3));
    };
    const tilt = (x, y) => { tx = x; ty = y; if (!frame) frame = requestAnimationFrame(apply); };
    const clamp = n => Math.max(-1, Math.min(1, n));
    hero.addEventListener("pointermove", e => {
      if (phone.matches || !finePointer.matches) return;
      const r = towerSvg.getBoundingClientRect();
      tilt(clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)),
           clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
    });
    hero.addEventListener("pointerleave", () => tilt(0, 0));
  }

  const setWindow = (w, on) => {
    w.el.classList.toggle("is-on", on);
    w.extra?.classList.toggle("is-on", on);
  };

  // Lights switch on from the roof down (windows were collected top-down), the way
  // the page reads, and off from level 1 up. A little jitter keeps it from looking mechanical.
  let lightTimers = [];
  const setLights = (on, animate) => {
    lightTimers.forEach(clearTimeout);
    lightTimers = [];
    if (!animate || reduceMotion) { windows.forEach(w => setWindow(w, on)); return; }
    const n = windows.length;
    windows
      .map((w, i) => ({ w, order: (on ? i : n - i) + Math.random() * 8 }))
      .sort((a, b) => a.order - b.order)
      .forEach(({ w }, i) => lightTimers.push(setTimeout(() => setWindow(w, on), 250 + i * 14)));
  };

  // First paint: the one orchestrated load moment, only at night.
  setLights(isNight(), true);

  /* ---------- Stars (night sky) ---------- */
  const stars = document.querySelector(".sky__stars");
  if (stars) {
    // Deterministic scatter so the sky looks the same on every visit.
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 70; i++) {
      const s = document.createElement("span");
      s.className = "star" + (rand() > .85 ? " star--big" : "") + (rand() > .8 ? " star--twinkle" : "");
      s.style.left = `${rand() * 100}%`;
      s.style.top = `${Math.pow(rand(), 1.6) * 100}%`;   // denser near the top
      s.style.animationDelay = `${-rand() * 4}s`;
      stars.appendChild(s);
    }
  }

  /* ---------- Day / night toggle ---------- */
  const toggleBtn = document.querySelector(".theme-toggle");
  const syncToggle = () => {
    const night = isNight();
    // Fixed name "Night mode"; pressed means night is on.
    toggleBtn?.setAttribute("aria-pressed", String(night));
    toggleBtn?.setAttribute("title", night ? "Switch to day" : "Switch to night");
  };
  syncToggle();

  let switchTimer;
  toggleBtn?.addEventListener("click", () => {
    const next = isNight() ? "light" : "dark";
    if (!reduceMotion) {
      root.classList.add("is-switching");
      clearTimeout(switchTimer);
      switchTimer = setTimeout(() => root.classList.remove("is-switching"), 1300);
    }
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncToggle();
    setLights(next === "dark", true);
  });

  /* ---------- Explorer: active file + mini building ---------- */
  const links = [...document.querySelectorAll(".files a")];
  const minis = [...document.querySelectorAll(".mini__floor")];
  const sections = [...document.querySelectorAll("[data-section]")];
  const order = ["about", "skills", "experience", "projects", "education", "fun", "contact"];

  const setActive = (id) => {
    links.forEach(l => l.classList.toggle("is-active", l.dataset.target === id && l.closest(".dir > ul") === null));
    // Every floor from the roof down to the one you are on is lit.
    const reached = order.indexOf(id);
    minis.forEach(m => m.classList.toggle("is-lit", order.indexOf(m.dataset.floor) <= reached));
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.dataset.section); });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => io.observe(s));

  // Phone: the explorer collapses into a top bar.
  const explorer = document.querySelector(".explorer");
  const filesToggle = document.querySelector(".explorer__toggle");
  filesToggle?.addEventListener("click", () => {
    const open = explorer.classList.toggle("is-open");
    filesToggle.setAttribute("aria-expanded", String(open));
  });
  const closeFiles = (returnFocus) => {
    if (!explorer.classList.contains("is-open")) return;
    explorer.classList.remove("is-open");
    filesToggle?.setAttribute("aria-expanded", "false");
    if (returnFocus) filesToggle?.focus();
  };
  links.forEach(l => l.addEventListener("click", () => closeFiles(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeFiles(true); });
  document.addEventListener("click", e => { if (!explorer.contains(e.target)) closeFiles(false); });

  /* ---------- Experience timeline: the line fills as you scroll ---------- */
  const timeline = document.querySelector(".timeline");
  const roles = [...document.querySelectorAll(".role")];
  const onScroll = () => {
    if (!timeline) return;
    const r = timeline.getBoundingClientRect();
    const mark = window.innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, (mark - r.top) / r.height));
    timeline.style.setProperty("--progress", reduceMotion ? 1 : p.toFixed(3));
    roles.forEach(role => role.classList.toggle("is-reached", reduceMotion || role.getBoundingClientRect().top < mark));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 330 mocked records, 100 per request: small segmented bar ---------- */
  const pages = document.querySelector(".pages");
  if (pages && !reduceMotion) {
    pages.classList.add("is-armed");
    const segs = [...pages.querySelectorAll(".pages__bar span")];
    const play = () => segs.forEach((seg, i) => setTimeout(() => seg.classList.add("is-done"), 200 + i * 350));
    new IntersectionObserver((entries, obs) => {
      if (entries.some(e => e.isIntersecting)) { play(); obs.disconnect(); }
    }, { threshold: 0.6 }).observe(pages);
  }

  /* ---------- Fun fact: ad-nap, read backwards ---------- */
  const word = "ad-nap";
  const flip = document.querySelector(".flip__word");
  if (flip) {
    [...word].forEach((ch, i) => {
      const s = document.createElement("span");
      s.textContent = ch;
      s.style.setProperty("--i", i);
      s.style.setProperty("--d", word.length - 1 - 2 * i);          // distance to its mirrored slot
      s.style.setProperty("--y", i % 2 ? "0.7em" : "-0.7em");       // alternate over and under
      flip.appendChild(s);
    });
  }
  const riddleBtn = document.querySelector(".riddle__btn");
  const answer = document.getElementById("riddle-answer");
  riddleBtn?.addEventListener("click", () => {
    const open = answer.hidden;
    answer.hidden = !open;
    riddleBtn.setAttribute("aria-expanded", String(open));
    riddleBtn.textContent = open ? "Hide answer" : "Show me";
    flip?.classList.remove("is-flipped");
    if (open) requestAnimationFrame(() => requestAnimationFrame(() => flip?.classList.add("is-flipped")));
  });

  /* ---------- Building: hovering a floor previews it ---------- */
  const tower = document.querySelector(".tower");
  document.querySelectorAll(".storey").forEach(st => {
    const on = () => { tower.classList.add("is-previewing"); st.classList.add("is-hover"); };
    const off = () => { tower.classList.remove("is-previewing"); st.classList.remove("is-hover"); };
    st.addEventListener("pointerenter", on);
    st.addEventListener("pointerleave", off);
    st.addEventListener("focus", on);
    st.addEventListener("blur", off);
  });

  /* ---------- A rare shooting star (night only) ---------- */
  const shooter = document.querySelector(".shooting-star");
  if (shooter && !reduceMotion) {
    const launch = () => {
      if (isNight() && !document.hidden) {
        shooter.style.setProperty("--sx", `${40 + Math.random() * 55}%`);
        shooter.style.setProperty("--sy", `${4 + Math.random() * 30}%`);
        shooter.classList.remove("is-falling");
        void shooter.offsetWidth;               // restart the animation
        shooter.classList.add("is-falling");
      }
      setTimeout(launch, 20000 + Math.random() * 20000);   // 20 to 40 seconds apart
    };
    setTimeout(launch, 6000 + Math.random() * 6000);
  }

  /* ---------- The perched cat flicks its tail once ---------- */
  const perchCat = document.querySelector(".perch-cat");
  if (perchCat && !reduceMotion) {
    new IntersectionObserver((entries, obs) => {
      if (entries.some(e => e.isIntersecting)) {
        setTimeout(() => perchCat.classList.add("is-flicking"), 400);
        obs.disconnect();
      }
    }, { threshold: 0.6 }).observe(perchCat);
  }

  // Placeholder links stay inert until real URLs are added.
  document.querySelectorAll(".is-placeholder").forEach(a => a.addEventListener("click", e => e.preventDefault()));
})();
