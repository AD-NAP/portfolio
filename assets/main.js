// Shafik Adam: theme toggle, section highlight, the card that opens into the portfolio, the riddle.
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Light and dark ---------- */
  const toggle = document.querySelector(".theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const isDark = () => root.dataset.theme === "dark";
  const sync = () => {
    toggle?.setAttribute("aria-pressed", String(isDark()));
    if (themeMeta) themeMeta.content = getComputedStyle(root).getPropertyValue("--paper").trim();
  };
  sync();

  let switchTimer;
  toggle?.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    if (!reduceMotion) {
      root.classList.add("is-switching");
      clearTimeout(switchTimer);
      switchTimer = setTimeout(() => root.classList.remove("is-switching"), 350);
    }
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    sync();
  });

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

    let solved = false;
    try { solved = ["bonus", ...OLD_KEYS].some(k => localStorage.getItem(k) === "open"); } catch (e) {}
    if (solved) openBonus(false);
  }

  /* ---------- The card opens into the portfolio ----------
     The card lies over About; both are pinned for a screen. One number, p (0 to 1), follows the
     scroll and render(p) turns it into CSS variables: the card's paper grows into the sheet, its
     name walks to the bar, the nav arrives, and About, already laid out underneath, fades in.
     Scrolling back plays it in reverse; letting go mid-way snaps to the card or the portfolio.
     Only transforms and opacity move, so no text is ever scaled up or repainted. */
  const stage = document.getElementById("card");
  const opening = document.querySelector(".opening");
  const about = document.getElementById("about");
  const aboutTitle = document.getElementById("about-title");
  const bar = document.querySelector(".bar");
  const name = document.getElementById("card-name");
  const card = document.querySelector(".card");
  const lift = document.querySelector(".card-lift");
  let cardTrigger = null;
  const cardSeen = () => { try { return localStorage.getItem("card") === "seen"; } catch (e) { return false; } };
  const markCardSeen = () => { try { localStorage.setItem("card", "seen"); } catch (e) {} };
  const afterScroll = fn => {
    let done = false;
    const go = () => { if (!done) { done = true; fn(); } };
    window.addEventListener("scrollend", go, { once: true });
    setTimeout(go, 1400);   // no scroll needed, or no scrollend support
  };
  const openTop = () => cardTrigger ? cardTrigger.end : about.getBoundingClientRect().top + window.scrollY - bar.offsetHeight;
  const finish = () => {     // jump to the open state without easing into it
    if (!cardTrigger || window.scrollY >= cardTrigger.end - 1) return;
    window.scrollTo({ top: cardTrigger.end, behavior: "instant" });
    cardTrigger.getTween()?.progress(1);
  };

  document.querySelector(".card-open")?.addEventListener("click", e => {
    e.preventDefault();
    markCardSeen();
    window.scrollTo({ top: openTop(), behavior: reduceMotion ? "auto" : "smooth" });
    afterScroll(() => aboutTitle?.focus({ preventScroll: true }));
  });
  // Keyboard: if focus moves past the card while it is still closed, open it at once,
  // so the focused link is never hidden under the card.
  document.addEventListener("focusin", e => {
    if (!cardTrigger || stage.contains(e.target) || e.target.matches?.(".skip")) return;
    requestAnimationFrame(finish);             // after the browser's own scroll-to-focus
  });
  document.querySelector(".card-replay")?.addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    afterScroll(() => document.querySelector(".card-open")?.focus({ preventScroll: true }));
  });

  if (window.gsap && window.ScrollTrigger && stage && card && name && about && bar) {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      root.classList.add("has-card-motion");
      // The nav arrives from the right in uneven steps, the theme button last.
      const arrivals = [...bar.querySelectorAll(".bar__nav li"), bar.querySelector(".theme-toggle")];
      const steps = [0, .09, .16, .21, .25, .28, .30, .31];
      arrivals.forEach((el, i) => el.style.setProperty("--d", steps[Math.min(i, steps.length - 1)]));

      // Layout position within the stage, ignoring transforms (the card's lift may still be running).
      const offsetIn = (el, ancestor) => {
        let x = 0, y = 0;
        for (let n = el; n && n !== ancestor; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
        return { x, y };
      };
      let m = null;   // measurements, refreshed with ScrollTrigger
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
        // The stage sits at the window's top-left while pinned; it may be scrolled elsewhere right now.
        // The card may also still be lifting into place on load: take its current offset out.
        const t = getComputedStyle(lift).transform, liftY = t && t !== "none" ? new DOMMatrixReadOnly(t).m42 : 0;
        m.nx += target.left - (landed.left - s.left); m.ny += target.top - (landed.top - s.top - liftY);
        keep.forEach(([k, v]) => stage.style.setProperty(k, v));
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
          "--stage-vis": p >= .9 ? "hidden" : "visible", "--stage-events": front > .5 ? "auto" : "none",
        });
        set(about, { "--about-alpha": fade, "--about-y": px(10 * (1 - fade)), "--about-events": fade > .5 ? "auto" : "none" });
        set(bar, {
          "--nav-p": span(p, .44, .7), "--bar-vis": p > .4 ? "visible" : "hidden",
          "--bar-bg": landed ? 1 : 0, "--brand-alpha": landed ? 1 : 0,
        });
      };

      const progress = { p: 0 };
      const tween = gsap.to(progress, {
        p: 1, ease: "none", onUpdate: () => render(progress.p),
        scrollTrigger: {
          trigger: opening, start: "top top", end: "+=110%",
          pin: true, scrub: .8, invalidateOnRefresh: true,
          // Let go mid-way and it settles, in the direction you were scrolling: the card or the portfolio.
          snap: { snapTo: [0, 1], duration: { min: .25, max: .6 }, delay: .06, ease: "power2.inOut" },
          onRefresh: () => { measure(); render(progress.p); },
          onLeave: markCardSeen,
        },
      });
      measure();
      render(0);
      cardTrigger = tween.scrollTrigger;
      document.fonts?.ready.then(() => ScrollTrigger.refresh());   // Archivo changes the name's size
      lift.addEventListener("animationend", () => { measure(); render(progress.p); }, { once: true });
      return () => {
        root.classList.remove("has-card-motion");
        [stage, about, bar].forEach(el => el.removeAttribute("style"));
        arrivals.forEach(el => el.style.removeProperty("--d"));
        cardTrigger = null;
      };
    });
  }
  // Returning visitors (with no #link to follow) open straight on the portfolio. Wait for "load":
  // a jump made earlier is undone when the browser settles the page's scroll position.
  if (stage && cardSeen() && !location.hash) {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const jump = () => requestAnimationFrame(() => window.scrollTo({ top: openTop(), behavior: "instant" }));
    if (document.readyState === "complete") jump();
    else window.addEventListener("load", jump, { once: true });
  }
})();
