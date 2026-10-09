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

  /* ---------- Hero building: one storey per section ---------- */
  // Top to bottom, matching the order you reach them going up.
  const storeys = [
    { id: "contact",    level: "R",  file: "contact.ttl",   x: 52, w: 120, h: 46, cols: 4, rows: 1 },
    { id: "fun",        level: "L5", file: "fun-facts.md",  x: 34, w: 156, h: 54, cols: 5, rows: 2 },
    { id: "education",  level: "L4", file: "education.md",  x: 34, w: 156, h: 54, cols: 5, rows: 2 },
    { id: "projects",   level: "L3", file: "projects/",     x: 34, w: 156, h: 54, cols: 5, rows: 2 },
    { id: "experience", level: "L2", file: "experience/",   x: 34, w: 156, h: 54, cols: 5, rows: 2 },
    { id: "skills",     level: "L1", file: "skills.ttl",    x: 34, w: 156, h: 54, cols: 5, rows: 2 },
    { id: "about",      level: "G",  file: "about.ttl",     x: 26, w: 172, h: 76, cols: 6, rows: 1, door: true },
  ];
  // The cat sits in one window on the fun-facts floor (row 2, column 4).
  const CAT = { id: "fun", row: 1, col: 3 };

  const floorsGroup = document.querySelector(".tower__floors");
  const windows = [];   // { el, extra? } bottom-to-top order is built below
  if (floorsGroup) {
    let y = 46;
    for (const s of storeys) {
      const a = svgEl("a", { href: `#${s.id}`, class: "storey", "aria-label": `Go to ${s.id}` });
      a.appendChild(svgEl("rect", { x: s.x, y, width: s.w, height: s.h, class: "storey__body" }));

      const padX = 14, padTop = 10, winW = 16, winH = 13;
      const gapX = (s.w - padX * 2 - winW * s.cols) / (s.cols - 1);
      const gapY = s.rows > 1 ? (s.h - padTop * 2 - winH * s.rows) / (s.rows - 1) : 0;
      for (let r = 0; r < s.rows; r++) {
        for (let c = 0; c < s.cols; c++) {
          // Ground floor: leave the middle two bays for the door.
          if (s.door && (c === 2 || c === 3)) continue;
          const wx = s.x + padX + c * (winW + gapX);
          const wy = s.door ? y + 14 : y + padTop + r * (winH + gapY);
          const win = svgEl("rect", { x: wx, y: wy, width: winW, height: winH, class: "storey__win" });
          a.appendChild(win);
          const entry = { el: win };
          if (s.id === CAT.id && r === CAT.row && c === CAT.col) {
            // A small sitting cat silhouette: ears, head, body, curled tail.
            const cat = svgEl("path", {
              class: "storey__cat",
              d: `M${wx + 5} ${wy + 13} V${wy + 7.5} L${wx + 5.4} ${wy + 4} L${wx + 6.8} ${wy + 5.6} H${wx + 8.6} L${wx + 10} ${wy + 4} L${wx + 10.4} ${wy + 7.5} Q${wx + 12} ${wy + 10} ${wx + 11} ${wy + 13} Z M${wx + 11} ${wy + 12.6} q${2.6} 0 ${2.4} -3 l-.9 .1 q.1 2 -1.5 2 Z`,
            });
            a.appendChild(cat);
            entry.extra = cat;
          }
          windows.push(entry);
        }
      }
      if (s.door) {
        const door = svgEl("rect", { x: s.x + s.w / 2 - 14, y: y + s.h - 40, width: 28, height: 40, class: "storey__win" });
        a.appendChild(door);
        windows.push({ el: door });
      }

      const tag = svgEl("text", { x: 8, y: y + s.h / 2 + 3, class: "storey__tag" });
      tag.textContent = s.level;
      a.appendChild(tag);
      const label = svgEl("text", { x: 208, y: y + s.h / 2 + 3, class: "storey__label" });
      label.textContent = s.file;
      a.appendChild(label);

      floorsGroup.appendChild(a);
      y += s.h;
    }
  }

  const setWindow = (w, on) => {
    w.el.classList.toggle("is-on", on);
    w.extra?.classList.toggle("is-on", on);
  };

  // Lights switch on from the ground up (windows were collected top-down),
  // and off from the roof down. A little jitter keeps it from looking mechanical.
  let lightTimers = [];
  const setLights = (on, animate) => {
    lightTimers.forEach(clearTimeout);
    lightTimers = [];
    if (!animate || reduceMotion) { windows.forEach(w => setWindow(w, on)); return; }
    const n = windows.length;
    windows
      .map((w, i) => ({ w, order: (on ? n - i : i) + Math.random() * 8 }))
      .sort((a, b) => a.order - b.order)
      .forEach(({ w }, i) => lightTimers.push(setTimeout(() => setWindow(w, on), 250 + i * 22)));
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
  const toggleText = document.querySelector(".theme-toggle__text");
  const syncToggle = () => {
    const night = isNight();
    toggleBtn?.setAttribute("aria-pressed", String(!night));
    if (toggleText) toggleText.textContent = night ? "Switch to day" : "Switch to night";
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
    // Every floor up to the one you are on is lit.
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
  links.forEach(l => l.addEventListener("click", () => {
    explorer.classList.remove("is-open");
    filesToggle?.setAttribute("aria-expanded", "false");
  }));

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

  /* ---------- 330 records, 100 per request (like the MSW mocks) ---------- */
  const pages = document.querySelector(".pages");
  if (pages && !reduceMotion) {
    pages.classList.add("is-armed");
    const rows = [...pages.querySelectorAll(".pages__log li")];
    const segs = [...pages.querySelectorAll(".pages__bar span")];
    const play = () => {
      rows.forEach((row, i) => {
        const start = 200 + i * 900;          // each request waits on simulated latency
        setTimeout(() => row.classList.add("is-loading"), start);
        setTimeout(() => {
          row.classList.replace("is-loading", "is-done");
          segs[i].classList.add("is-done");
        }, start + 600);
      });
    };
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

  // Placeholder links stay inert until real URLs are added.
  document.querySelectorAll(".is-placeholder").forEach(a => a.addEventListener("click", e => e.preventDefault()));
})();
