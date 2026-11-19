// Shafik Adam: theme toggle, section highlight, the card that opens into the portfolio, the riddle.
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Light and dark ---------- */
  // Two switches, the bar's and the card's. Each shows the theme it switches to (CSS swaps sun and moon).
  const switches = document.querySelectorAll(".theme-switch");
  const toggleText = document.querySelector(".theme-toggle__text");
  const cardSwitch = document.querySelector(".card-theme");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const isDark = () => root.dataset.theme === "dark";
  const sync = () => {
    const other = isDark() ? "Light" : "Dark";
    if (toggleText) toggleText.textContent = `${other} mode`;
    cardSwitch?.setAttribute("aria-label", `Switch to ${other.toLowerCase()} mode`);
    if (themeMeta) themeMeta.content = getComputedStyle(root).getPropertyValue("--paper").trim();
  };
  sync();

  let switchTimer;
  switches.forEach(button => button.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    if (!reduceMotion) {
      root.classList.add("is-switching");
      clearTimeout(switchTimer);
      switchTimer = setTimeout(() => root.classList.remove("is-switching"), 350);
    }
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    sync();
  }));

  /* ---------- The bar: mark the section you are reading ---------- */
  const navLinks = [...document.querySelectorAll(".bar__nav a")];
  const byId = new Map(navLinks.map(a => [a.hash.slice(1), a]));
  const watched = [...byId.keys()].map(id => document.getElementById(id)).filter(Boolean);
  const setCurrent = id => navLinks.forEach(a => {
    if (a.hash === `#${id}`) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
  const visible = new Set();
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id));
    const first = watched.find(s => visible.has(s.id));
    setCurrent(first ? first.id : "");
  }, { rootMargin: "-30% 0px -60% 0px" });
  watched.forEach(s => spy.observe(s));
  // Phones: fade the links at the edge only when they actually run past it.
  const barNav = document.querySelector(".bar__nav");
  const markClipped = () => barNav?.classList.toggle("is-clipped", barNav.scrollWidth > barNav.clientWidth + 1);
  window.addEventListener("resize", markClipped);
  document.fonts?.ready.then(markClipped);
  markClipped();

  /* ---------- ad-nap, read backwards ---------- */
  const word = "ad-nap";
  const flip = document.querySelector(".flip__word");
  if (flip) {
    [...word].forEach((ch, i) => {
      const s = document.createElement("span");
      s.textContent = ch;
      s.style.setProperty("--i", i);
      s.style.setProperty("--d", word.length - 1 - 2 * i);          // distance to its mirrored slot
      s.style.setProperty("--y", i % 2 ? "0.6em" : "-0.6em");       // alternate over and under
      flip.appendChild(s);
    });
  }

  /* ---------- Guess the animal to open the bonus ---------- */
  const riddle = document.querySelector(".riddle");
  const riddleForm = document.querySelector(".riddle__form");
  const guess = document.getElementById("guess");
  const riddleStatus = document.querySelector(".riddle__status");
  const answer = document.getElementById("riddle-answer");
  const bonus = document.getElementById("bonus");
  // "centrefold" (v1.x zine) and "b1" (the building, before v1.0.0) are older names for the same reward.
  const OLD_KEYS = ["centrefold", "b1"];

  const openBonus = animate => {
    riddleForm.hidden = true;
    answer.hidden = false;
    riddle?.classList.add("is-open");
    if (animate && !reduceMotion) requestAnimationFrame(() => requestAnimationFrame(() => flip?.classList.add("is-flipped")));
    else flip?.classList.add("is-static");
    bonus.hidden = false;
    document.querySelectorAll(".bonus-entry").forEach(el => { el.hidden = false; });
    markClipped();
    window.ScrollTrigger?.refresh();   // the page got taller
  };

  // Put everything back the way a first-time visitor sees it.
  const closeBonus = () => {
    try { ["bonus", ...OLD_KEYS].forEach(k => localStorage.removeItem(k)); } catch (e) {}
    bonus.hidden = true;
    document.querySelectorAll(".bonus-entry").forEach(el => { el.hidden = true; });
    markClipped();
    answer.hidden = true;
    riddle?.classList.remove("is-open");
    flip?.classList.remove("is-flipped", "is-static");
    riddleForm.hidden = false;
    guess.value = "";
    riddleStatus.textContent = "";
    window.ScrollTrigger?.refresh();
    riddle?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    guess.focus({ preventScroll: true });
  };

  if (riddleForm && guess && answer && bonus) {
    let misses = 0;
    riddleForm.addEventListener("submit", e => {
      e.preventDefault();
      const said = guess.value.toLowerCase().replace(/[^a-z]/g, "").replace(/^(a|the)(?=.)/, "");
      if (!said) { riddleStatus.textContent = "Type an animal first."; return; }
      if (/^(giant)?pandas?$/.test(said)) {
        try { localStorage.setItem("bonus", "open"); } catch (e) {}
        riddleStatus.textContent = "Correct. The bonus is open.";
        openBonus(true);
        answer.querySelector(".riddle__reward a")?.focus({ preventScroll: true });
        return;
      }
      if (/^(cats?|octocat|kittens?)$/.test(said)) { riddleStatus.textContent = "Close. That is GitHub's logo. Look at my username instead."; return; }
      misses += 1;
      riddleStatus.textContent = misses === 1 ? "Not quite. Look at my GitHub username." : "Not quite. Try reading it backwards.";
    });

    document.querySelector(".riddle-reset")?.addEventListener("click", closeBonus);

    // "Take me to the fun zone": the preview grows until the room fills the screen, then the room page opens.
    // Phones get a note first (the room is built for a computer); reduced motion goes straight there.
    const funZone = document.querySelector(".fun-zone");
    const funNote = document.querySelector(".bonus__phone");
    const preview = document.querySelector(".bonus__room img");
    const isPhone = window.matchMedia("(max-width: 820px), (hover: none) and (pointer: coarse)").matches;
    let warned = false;
    funZone?.addEventListener("click", e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (isPhone && !warned) {
        e.preventDefault();
        warned = true;
        funNote.textContent = "The 3D room is built for a computer. On a phone it opens as a simple list.";
        funZone.textContent = "Open the list";
        return;
      }
      if (reduceMotion || !preview || !preview.complete || !preview.animate) return;
      e.preventDefault();
      const r = preview.getBoundingClientRect();
      const vw = window.innerWidth, vh = window.innerHeight;
      const s = Math.max(vw / r.width, vh / r.height);
      const zoom = preview.cloneNode();
      zoom.className = "room-zoom";
      Object.assign(zoom.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
      document.body.appendChild(zoom);
      const go = () => { window.location.href = funZone.href; };
      zoom.animate(
        [{ transform: "none" }, { transform: `translate(${(vw - r.width * s) / 2 - r.left}px, ${(vh - r.height * s) / 2 - r.top}px) scale(${s})` }],
        { duration: 600, easing: "cubic-bezier(.65, 0, .35, 1)", fill: "forwards" }
      ).finished.then(go, go);
    });
    // Coming back with the browser's Back button: take the zoomed copy away.
    window.addEventListener("pageshow", () => document.querySelectorAll(".room-zoom").forEach(el => el.remove()));

    let solved = false;
    try { solved = ["bonus", ...OLD_KEYS].some(k => localStorage.getItem(k) === "open"); } catch (e) {}
    if (solved) openBonus(false);
    // A link to #bonus (from the fun side's "Back to the portfolio") arrives while the section is still hidden,
    // so the browser can't land on it. Scroll there once the page has loaded (an earlier jump gets reset).
    if (solved && location.hash === "#bonus") {
      window.addEventListener("load", () => requestAnimationFrame(() => bonus.scrollIntoView({ behavior: "instant", block: "start" })), { once: true });
    }
  }

  /* ---------- The card opens into the portfolio ----------
     Two states: the card (1) and the portfolio (2). Any scroll, swipe or key that moves down,
     or "Open the portfolio", plays one 1.5s transition from 1 to 2; at the very top of the page,
     moving up plays it back. One number, p (0 to 1), drives render(p), which turns it into CSS
     variables: the card's paper grows into the sheet, its name walks to the bar, the nav arrives,
     and About, already laid out underneath, fades in. Only transforms and opacity move, so no
     text is ever scaled up or repainted. The page does not scroll while the card is closed or moving. */
  const stage = document.getElementById("card");
  const about = document.getElementById("about");
  const aboutTitle = document.getElementById("about-title");
  const bar = document.querySelector(".bar");
  const name = document.getElementById("card-name");
  const card = document.querySelector(".card");
  const lift = document.querySelector(".card-lift");
  const openButton = document.querySelector(".card-open");
  const DURATION = 1.5;   // seconds, the same for every way of opening or closing
  let ctl = null;         // the two-state controller, while motion is on
  // Every visit opens on the card. Before v1.2.2 the page remembered a visit ("card" = "seen"): forget it.
  try { localStorage.removeItem("card"); } catch (e) {}
  const afterScroll = fn => {
    let done = false;
    const go = () => { if (!done) { done = true; fn(); } };
    window.addEventListener("scrollend", go, { once: true });
    setTimeout(go, 1400);   // no scroll needed, or no scrollend support
  };

  openButton?.addEventListener("click", e => {
    e.preventDefault();
    if (ctl) return ctl.open(true);
    about.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    aboutTitle?.focus({ preventScroll: true });
  });
  document.querySelector(".card-replay")?.addEventListener("click", e => {
    e.preventDefault();
    const back = () => ctl ? ctl.close(true) : openButton?.focus({ preventScroll: true });
    if (window.scrollY <= 0) return back();
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    afterScroll(back);
  });
  // Keyboard: if focus moves past the card while it is still closed, open it at once,
  // so the focused link is never hidden under the card.
  document.addEventListener("focusin", e => {
    if (!ctl || ctl.isOpen() || stage.contains(e.target) || e.target.matches?.(".skip")) return;
    ctl.finish();
  });
  document.querySelector(".skip")?.addEventListener("click", () => ctl?.finish());

  if (window.gsap && window.ScrollTrigger && stage && card && name && about && bar) {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      root.classList.add("has-card-motion");
      // The nav arrives from the right in uneven steps. The theme button comes early, so its frame
      // is in place before the card's sun or moon lands in it.
      const links = [...bar.querySelectorAll(".bar__nav li")];
      const barSwitch = bar.querySelector(".theme-toggle");
      const steps = [0, .09, .16, .21, .25, .28, .30, .31];
      links.forEach((el, i) => el.style.setProperty("--d", steps[Math.min(i, steps.length - 1)]));
      barSwitch.style.setProperty("--d", .12);
      const arrivals = [...links, barSwitch];
      const cardIcon = cardSwitch?.querySelector(".theme-icon");
      const barIcon = barSwitch.querySelector(".theme-icon");

      // Layout position within the stage, ignoring transforms (the card's lift may still be running).
      const offsetIn = (el, ancestor) => {
        let x = 0, y = 0;
        for (let n = el; n && n !== ancestor; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
        return { x, y };
      };
      let m = null;   // measurements, refreshed on resize, font load and the end of the lift
      const measure = () => {
        const W = stage.clientWidth, H = stage.clientHeight;
        const c = offsetIn(card, stage), w = card.offsetWidth, h = card.offsetHeight;
        const n = offsetIn(name, stage);
        const brand = bar.querySelector(".bar__name");
        const b = brand.getBoundingClientRect();
        // Line height is 1 on both, so the boxes' heights are the type sizes.
        const bText = { x: b.left + parseFloat(getComputedStyle(brand).paddingLeft), y: b.top + (b.height - parseFloat(getComputedStyle(brand).fontSize)) / 2 };
        m = {
          sx: W / w * 1.02, sy: H / h * 1.02,
          tx: W / 2 - (c.x + w / 2), ty: H / 2 - (c.y + h / 2),
          nx: bText.x - n.x, ny: bText.y - n.y,
          ns: parseFloat(getComputedStyle(brand).fontSize) / parseFloat(getComputedStyle(name).fontSize),
        };
        // Correct for rounding: put the name at its landing spot, compare the two lines of text, nudge.
        const textBox = el => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect(); };
        const keep = ["--name-x", "--name-y", "--name-s"].map(k => [k, stage.style.getPropertyValue(k)]);
        stage.style.setProperty("--name-x", `${m.nx}px`); stage.style.setProperty("--name-y", `${m.ny}px`); stage.style.setProperty("--name-s", m.ns);
        const landed = textBox(name), target = textBox(brand), s = stage.getBoundingClientRect();
        // The card may still be lifting into place on load: take its current offset out.
        const t = getComputedStyle(lift).transform, liftY = t && t !== "none" ? new DOMMatrixReadOnly(t).m42 : 0;
        m.nx += target.left - (landed.left - s.left); m.ny += target.top - (landed.top - s.top - liftY);
        keep.forEach(([k, v]) => stage.style.setProperty(k, v));
        // The theme icon walks the same way, from the card's corner into the bar's button.
        // Measure both at rest: the card's icon untranslated, the bar's button fully arrived.
        m.ix = m.iy = 0;
        if (cardIcon) {
          const keepIcon = ["--icon-x", "--icon-y"].map(k => [k, stage.style.getPropertyValue(k)]);
          const keepNav = bar.style.getPropertyValue("--nav-p");
          stage.style.setProperty("--icon-x", "0px"); stage.style.setProperty("--icon-y", "0px"); bar.style.setProperty("--nav-p", 1);
          const from = cardIcon.getBoundingClientRect(), to = barIcon.getBoundingClientRect();
          m.ix = to.left - from.left; m.iy = to.top - (from.top - liftY);
          keepIcon.forEach(([k, v]) => stage.style.setProperty(k, v));
          bar.style.setProperty("--nav-p", keepNav);
        }
      };

      const span = (p, a, b) => gsap.utils.clamp(0, 1, (p - a) / (b - a));
      const growEase = gsap.parseEase("power2.inOut"), walkEase = gsap.parseEase("power3.inOut"), inEase = gsap.parseEase("power2.out");
      const set = (el, vars) => { for (const k in vars) el.style.setProperty(k, vars[k]); };
      const px = v => `${v.toFixed(2)}px`;
      const render = p => {
        if (!m) measure();
        const front = 1 - span(p, 0, .16);            // card lines, dimensions and the links under it step aside
        const grow = growEase(span(p, .05, .6));      // the paper grows into the sheet
        const walk = walkEase(span(p, .1, .64));      // the name walks to the bar
        const landed = p >= .64;                      // the bar's name takes over in the same frame
        const fade = inEase(span(p, .58, .86));       // About, already in place, fades in as the name lands
        set(stage, {
          "--front-alpha": front, "--after-alpha": front, "--after-vis": front > 0 ? "visible" : "hidden",
          "--shadow-alpha": 1 - span(p, .05, .4),
          "--paper-sx": 1 + (m.sx - 1) * grow, "--paper-sy": 1 + (m.sy - 1) * grow,
          "--paper-x": px(m.tx * grow), "--paper-y": px(m.ty * grow),
          "--paper-alpha": 1 - span(p, .6, .8),      // the sheet's grid shows through as it lands
          "--desk-alpha": p < .6 ? 1 : 0,            // hidden under the grown paper by then
          "--name-x": px(m.nx * walk), "--name-y": px(m.ny * walk), "--name-s": 1 + (m.ns - 1) * walk,
          "--name-alpha": landed ? 0 : 1,
          "--icon-x": px(m.ix * walk), "--icon-y": px(m.iy * walk), "--icon-alpha": landed ? 0 : 1,
          "--stage-vis": p >= .9 ? "hidden" : "visible", "--stage-events": front > .5 ? "auto" : "none",
        });
        set(about, { "--about-alpha": fade, "--about-y": px(10 * (1 - fade)), "--about-events": fade > .5 ? "auto" : "none" });
        set(bar, {
          "--nav-p": span(p, .44, .7), "--bar-vis": p > .4 ? "visible" : "hidden",
          "--bar-bg": landed ? 1 : 0, "--brand-alpha": landed ? 1 : 0,
        });
      };

      /* The two states. "card" and "open" rest; "opening" and "closing" move. */
      let state = "card", focusAfter = null, topSince = 0;
      const lock = on => root.classList.toggle("is-card-locked", on);
      const progress = { p: 0 };
      const opened = () => {
        state = "open"; lock(false); topSince = performance.now();
        focusAfter?.focus({ preventScroll: true }); focusAfter = null;
      };
      const closed = () => {
        state = "card";
        focusAfter?.focus({ preventScroll: true }); focusAfter = null;
      };
      const tween = gsap.to(progress, {
        p: 1, duration: DURATION, ease: "sine.inOut", paused: true,
        onUpdate: () => render(progress.p), onComplete: opened, onReverseComplete: closed,
      });
      const open = focus => {
        if (state === "open" || state === "opening") return;
        window.scrollTo({ top: 0, behavior: "instant" });
        lock(true); state = "opening"; focusAfter = focus ? aboutTitle : null;
        tween.play();
      };
      const close = focus => {
        if (state === "card" || state === "closing") return;
        window.scrollTo({ top: 0, behavior: "instant" });
        lock(true); state = "closing"; focusAfter = focus ? openButton : null;
        tween.reverse().paused(false);   // reverse() alone leaves a paused tween paused (after finish())
      };
      // Jump straight to the open state. Let the tween set p itself: setting it by hand before the tween
      // first runs would make GSAP record 1 as the start value, and closing would then animate 1 to 1.
      const finish = () => { tween.pause(); tween.progress(1, true); render(progress.p); opened(); };
      ctl = { open, close, finish, isOpen: () => state === "open" };

      // At the top, an upward move closes the card again. Not straight after arriving there by
      // scrolling, though: the tail of a flick up the page should stop at About, not keep going.
      const atTop = () => window.scrollY <= 0 && performance.now() - topSince > 400;
      const onScroll = () => { if (window.scrollY > 0) topSince = 0; else if (!topSince) topSince = performance.now(); };
      window.addEventListener("scroll", onScroll, { passive: true });

      // Wheel, trackpad and touch. With wheelSpeed -1, scrolling down and swiping up both call onUp.
      const watcher = ScrollTrigger.observe({
        target: window, type: "wheel,touch", wheelSpeed: -1, tolerance: 10,
        onUp: () => { if (state === "card" || state === "closing") open(false); },
        onDown: () => { if (state === "opening" || (state === "open" && atTop())) close(false); },
      });
      // Keys that scroll the page do the same. Typing in the riddle, or Space on a button, is left alone.
      const onKey = e => {
        if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
        if (e.target.closest?.("input, textarea, select, button, a, [contenteditable]") && e.key === " ") return;
        if (e.target.closest?.("input, textarea, select, [contenteditable]")) return;
        const down = ["PageDown", "ArrowDown", "End"].includes(e.key) || (e.key === " " && !e.shiftKey);
        const up = ["PageUp", "ArrowUp", "Home"].includes(e.key) || (e.key === " " && e.shiftKey);
        if (down && (state === "card" || state === "closing")) { e.preventDefault(); open(false); }
        else if (up && (state === "opening" || (state === "open" && window.scrollY <= 0))) { e.preventDefault(); close(false); }
      };
      document.addEventListener("keydown", onKey);

      const remeasure = () => { measure(); render(progress.p); };
      window.addEventListener("resize", remeasure);
      document.fonts?.ready.then(remeasure);                     // Archivo changes the name's size
      lift.addEventListener("animationend", remeasure, { once: true });

      // Visitors following a #link start on the portfolio; everyone else on the card.
      if (location.hash) finish();
      else { lock(true); measure(); render(0); }

      return () => {
        watcher.kill();
        document.removeEventListener("keydown", onKey);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", remeasure);
        tween.kill(); lock(false);
        root.classList.remove("has-card-motion");
        [stage, about, bar].forEach(el => el.removeAttribute("style"));
        arrivals.forEach(el => el.style.removeProperty("--d"));
        ctl = null;
      };
    });
  }
})();
