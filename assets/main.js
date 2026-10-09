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
  // Top to bottom, the same order as the page: roof first, level 1 last.
  const storeys = [
    { id: "about",        title: "About",      where: "roof",    level: "R",  file: "about.ttl",     x: 52, w: 120, h: 46, cols: 4, rows: 1 },
    { id: "skills",       title: "Skills",     where: "level 6", level: "L6", file: "skills.ttl",    x: 34, w: 156, h: 54, cols: 5, rows: 2 },
    { id: "experience",   title: "Experience", where: "level 5", level: "L5", file: "experience/",   x: 34, w: 156, h: 54, cols: 5, rows: 2 },
    { id: "projects",     title: "Projects",   where: "level 4", level: "L4", file: "projects/",     x: 34, w: 156, h: 54, cols: 5, rows: 2 },
    { id: "education",    title: "Education",  where: "level 3", level: "L3", file: "education.md",  x: 34, w: 156, h: 54, cols: 5, rows: 2 },
    { id: "fun",          title: "Fun facts",  where: "level 2", level: "L2", file: "fun-facts.md",  x: 34, w: 156, h: 54, cols: 5, rows: 2 },
    { id: "contact",      title: "Contact",    where: "level 1", level: "L1", file: "contact.ttl",   x: 26, w: 172, h: 76, cols: 6, rows: 1, door: true },
  ];
  // The cat sits in one window on the fun-facts floor (row 2, column 4).
  const CAT = { id: "fun", row: 1, col: 3 };

  const floorsGroup = document.querySelector(".tower__floors");
  const windows = [];   // { el, extra? } bottom-to-top order is built below
  if (floorsGroup) {
    let y = 46;
    for (const s of storeys) {
      const a = svgEl("a", { href: `#${s.id}`, class: "storey", "aria-label": `Go to ${s.title}, ${s.where}` });
      a.appendChild(svgEl("rect", { x: s.x, y, width: s.w, height: s.h, class: "storey__body" }));

      const padX = 14, padTop = 10, winW = 16, winH = 13;
      const gapX = (s.w - padX * 2 - winW * s.cols) / (s.cols - 1);
      const gapY = s.rows > 1 ? (s.h - padTop * 2 - winH * s.rows) / (s.rows - 1) : 0;
      for (let r = 0; r < s.rows; r++) {
        for (let c = 0; c < s.cols; c++) {
          // Level 1: leave the middle two bays for the door.
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

      const tag = svgEl("text", { x: 8, y: y + s.h / 2 + 3, class: "storey__tag", "aria-hidden": "true" });
      tag.textContent = s.level;
      a.appendChild(tag);
      const label = svgEl("text", { x: 208, y: y + s.h / 2 + 3, class: "storey__label", "aria-hidden": "true" });
      label.textContent = s.file;
      a.appendChild(label);

      floorsGroup.appendChild(a);
      y += s.h;
    }
  }

  // Phones hide the floor labels and tags, so crop to just the building.
  const towerSvg = document.querySelector(".tower svg");
  const phone = window.matchMedia("(max-width: 900px)");
  const fitTower = () => towerSvg?.setAttribute("viewBox", phone.matches ? "20 0 184 470" : "0 0 300 470");
  fitTower();
  phone.addEventListener("change", fitTower);

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
