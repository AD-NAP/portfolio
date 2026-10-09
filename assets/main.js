(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SVG = "http://www.w3.org/2000/svg";

  /* ---------- Hero building: one storey per section ---------- */
  // Top to bottom, matching the order you reach them going up.
  const storeys = [
    { id: "contact",    level: "R",  file: "contact.ttl",   x: 52, w: 120, h: 50, cols: 4, rows: 1 },
    { id: "education",  level: "L4", file: "education.md",  x: 34, w: 156, h: 62, cols: 5, rows: 2 },
    { id: "projects",   level: "L3", file: "projects/",     x: 34, w: 156, h: 62, cols: 5, rows: 2 },
    { id: "experience", level: "L2", file: "experience/",   x: 34, w: 156, h: 62, cols: 5, rows: 2 },
    { id: "skills",     level: "L1", file: "skills.ttl",    x: 34, w: 156, h: 62, cols: 5, rows: 2 },
    { id: "about",      level: "G",  file: "about.ttl",     x: 26, w: 172, h: 82, cols: 6, rows: 1, door: true },
  ];

  const floorsGroup = document.querySelector(".tower__floors");
  const windows = [];
  if (floorsGroup) {
    let y = 46;
    for (const s of storeys) {
      const a = document.createElementNS(SVG, "a");
      a.setAttribute("href", `#${s.id}`);
      a.setAttribute("class", "storey");
      a.setAttribute("aria-label", `Go to ${s.id}`);

      const body = document.createElementNS(SVG, "rect");
      Object.entries({ x: s.x, y, width: s.w, height: s.h, class: "storey__body" })
        .forEach(([k, v]) => body.setAttribute(k, v));
      a.appendChild(body);

      const padX = 14, padTop = 12, winW = 16, winH = s.door ? 14 : 13;
      const gapX = (s.w - padX * 2 - winW * s.cols) / (s.cols - 1);
      const gapY = s.rows > 1 ? (s.h - padTop * 2 - winH * s.rows) / (s.rows - 1) : 0;
      for (let r = 0; r < s.rows; r++) {
        for (let c = 0; c < s.cols; c++) {
          // Ground floor: leave the middle two bays for the door.
          if (s.door && (c === 2 || c === 3)) continue;
          const win = document.createElementNS(SVG, "rect");
          Object.entries({
            x: s.x + padX + c * (winW + gapX),
            y: y + padTop + r * (winH + gapY),
            width: winW, height: winH, class: "storey__win",
          }).forEach(([k, v]) => win.setAttribute(k, v));
          a.appendChild(win);
          windows.push(win);
        }
      }
      if (s.door) {
        const door = document.createElementNS(SVG, "rect");
        Object.entries({ x: s.x + s.w / 2 - 14, y: y + s.h - 40, width: 28, height: 40, class: "storey__win is-on" })
          .forEach(([k, v]) => door.setAttribute(k, v));
        a.appendChild(door);
      }

      const tag = document.createElementNS(SVG, "text");
      tag.setAttribute("x", 8); tag.setAttribute("y", y + s.h / 2 + 3);
      tag.setAttribute("class", "storey__tag");
      tag.textContent = s.level;
      a.appendChild(tag);

      const label = document.createElementNS(SVG, "text");
      label.setAttribute("x", 208); label.setAttribute("y", y + s.h / 2 + 3);
      
      label.setAttribute("class", "storey__label");
      label.textContent = s.file;
      a.appendChild(label);

      floorsGroup.appendChild(a);
      y += s.h;
    }
  }

  // The one orchestrated moment: windows switch on from the ground up.
  if (reduceMotion) {
    windows.forEach(w => w.classList.add("is-on"));
  } else {
    windows
      .map((w, i) => ({ w, order: (windows.length - i) + Math.random() * 8 }))
      .sort((a, b) => a.order - b.order)
      .forEach(({ w }, i) => setTimeout(() => w.classList.add("is-on"), 300 + i * 28));
  }

  /* ---------- Explorer: active file + mini building ---------- */
  const links = [...document.querySelectorAll(".files a")];
  const minis = [...document.querySelectorAll(".mini__floor")];
  const sections = [...document.querySelectorAll("[data-section]")];

  const setActive = (id) => {
    links.forEach(l => l.classList.toggle("is-active", l.dataset.target === id && l.closest(".dir > ul") === null));
    // Every floor up to the one you are on is lit.
    const order = ["about", "skills", "experience", "projects", "education", "contact"];
    const reached = order.indexOf(id);
    minis.forEach(m => m.classList.toggle("is-lit", order.indexOf(m.dataset.floor) <= reached));
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.dataset.section); });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => io.observe(s));

  // Phone: the explorer collapses into a top bar.
  const explorer = document.querySelector(".explorer");
  const toggle = document.querySelector(".explorer__toggle");
  toggle?.addEventListener("click", () => {
    const open = explorer.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.forEach(l => l.addEventListener("click", () => {
    explorer.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
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
    roles.forEach(role => {
      const top = role.getBoundingClientRect().top;
      role.classList.toggle("is-reached", reduceMotion || top < mark);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 330 mocked records, fetched 100 at a time ---------- */
  const grid = document.querySelector(".batches__grid");
  if (grid) {
    const cells = Array.from({ length: 330 }, (_, i) => {
      const cell = document.createElement("i");
      cell.dataset.batch = String(Math.floor(i / 100));
      grid.appendChild(cell);
      return cell;
    });
    const fill = () => {
      if (reduceMotion) { cells.forEach(c => c.classList.add("is-on")); return; }
      // Each batch arrives after a simulated network delay, like the MSW mocks.
      [0, 1, 2, 3].forEach(b => setTimeout(() => {
        cells.filter(c => c.dataset.batch === String(b)).forEach(c => c.classList.add("is-on"));
      }, 250 + b * 550));
    };
    const gio = new IntersectionObserver((entries, obs) => {
      if (entries.some(e => e.isIntersecting)) { fill(); obs.disconnect(); }
    }, { threshold: 0.6 });
    gio.observe(grid);
  }

  // Placeholder links stay inert until real URLs are added.
  document.querySelectorAll(".is-placeholder").forEach(a => a.addEventListener("click", e => e.preventDefault()));
})();
