// The build log: print toggle, contents highlight, the riddle and its centrefold, the cat.
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Day print / night print ---------- */
  const toggle = document.querySelector(".print-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const isNight = () => root.dataset.theme === "dark";
  const sync = () => {
    toggle?.setAttribute("aria-pressed", String(isNight()));
    if (themeMeta) themeMeta.content = getComputedStyle(root).getPropertyValue("--paper").trim();
  };
  sync();

  let switchTimer;
  toggle?.addEventListener("click", () => {
    const next = isNight() ? "light" : "dark";
    if (!reduceMotion) {
      root.classList.add("is-switching");
      clearTimeout(switchTimer);
      switchTimer = setTimeout(() => root.classList.remove("is-switching"), 400);
    }
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    sync();
  });

  /* ---------- Contents: mark the page you are reading ---------- */
  const navLinks = [...document.querySelectorAll(".mast__nav a")];
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

  /* ---------- Guess the animal to open the centrefold ---------- */
  const riddle = document.querySelector(".riddle");
  const riddleForm = document.querySelector(".riddle__form");
  const guess = document.getElementById("guess");
  const riddleStatus = document.querySelector(".riddle__status");
  const answer = document.getElementById("riddle-answer");
  const centrefold = document.getElementById("centrefold");

  const openCentrefold = animate => {
    riddleForm.hidden = true;
    answer.hidden = false;
    riddle?.classList.add("is-open");
    if (animate && !reduceMotion) requestAnimationFrame(() => requestAnimationFrame(() => flip?.classList.add("is-flipped")));
    else flip?.classList.add("is-static");
    centrefold.hidden = false;
    document.querySelectorAll(".centrefold-entry").forEach(el => { el.hidden = false; });
    window.ScrollTrigger?.refresh();   // the page got taller: re-measure the scroll prints
  };

  // Put everything back the way a first-time visitor sees it.
  const closeCentrefold = () => {
    try { localStorage.removeItem("centrefold"); localStorage.removeItem("b1"); } catch (e) {}
    centrefold.hidden = true;
    document.querySelectorAll(".centrefold-entry").forEach(el => { el.hidden = true; });
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

  if (riddleForm && guess && answer && centrefold) {
    let misses = 0;
    riddleForm.addEventListener("submit", e => {
      e.preventDefault();
      const said = guess.value.toLowerCase().replace(/[^a-z]/g, "").replace(/^(a|the)(?=.)/, "");
      if (!said) { riddleStatus.textContent = "Type an animal first."; return; }
      if (/^(giant)?pandas?$/.test(said)) {
        try { localStorage.setItem("centrefold", "open"); } catch (e) {}
        riddleStatus.textContent = "Correct. The centrefold is open.";
        openCentrefold(true);
        answer.querySelector(".riddle__reward a")?.focus({ preventScroll: true });
        return;
      }
      if (/^(cats?|octocat|kittens?)$/.test(said)) { riddleStatus.textContent = "Close. That is GitHub's logo. Look at my username instead."; return; }
      misses += 1;
      riddleStatus.textContent = misses === 1 ? "Not quite. Look at my GitHub username." : "Not quite. Try reading it backwards.";
    });

    document.querySelector(".riddle-reset")?.addEventListener("click", closeCentrefold);

    // Solved on an earlier visit: the centrefold stays open. "b1" is the key the
    // building version (before v1.0.0) used for its basement, so those visitors keep their reward.
    let solved = false;
    try { solved = localStorage.getItem("centrefold") === "open" || localStorage.getItem("b1") === "open"; } catch (e) {}
    if (solved) openCentrefold(false);
  }

  /* ---------- The name card ----------
     First visit: the card is handed over (CSS), then scrolling, or "Open the build log", flips it
     and grows its back into the cover. GSAP ScrollTrigger pins the card over the page and scrubs
     the flip to the scroll, so scrolling back up plays it in reverse. Returning visitors open on
     the cover, and "See my card again" scrolls back up to it. */
  const stage = document.getElementById("card");
  const meishi = document.querySelector(".meishi");
  const cover = document.getElementById("top");
  const coverTitle = document.getElementById("cover-title");
  let cardTrigger = null;
  const cardSeen = () => { try { return localStorage.getItem("card") === "seen"; } catch (e) { return false; } };
  const markCardSeen = () => { try { localStorage.setItem("card", "seen"); } catch (e) {} };
  const afterScroll = fn => {
    let done = false;
    const go = () => { if (!done) { done = true; fn(); } };
    window.addEventListener("scrollend", go, { once: true });
    setTimeout(go, 1400);   // no scroll needed, or no scrollend support
  };
  const coverTop = () => cardTrigger ? cardTrigger.end : cover.getBoundingClientRect().top + window.scrollY;

  document.querySelector(".card-open")?.addEventListener("click", e => {
    e.preventDefault();
    markCardSeen();
    window.scrollTo({ top: coverTop(), behavior: reduceMotion ? "auto" : "smooth" });
    afterScroll(() => coverTitle?.focus({ preventScroll: true }));
  });
  document.querySelector(".card-replay")?.addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    afterScroll(() => document.querySelector(".card-open")?.focus({ preventScroll: true }));
  });

  if (window.gsap && window.ScrollTrigger && stage && meishi) {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      root.classList.add("has-card-motion");
      // How far the card must grow, from where it sits in the pinned stage, for its back to cover the screen.
      const hand = document.querySelector(".meishi-hand");
      const fillScale = () => {
        const w = meishi.offsetWidth, h = meishi.offsetHeight;
        const hr = hand.getBoundingClientRect(), sr = stage.getBoundingClientRect();
        const cx = hr.left - sr.left + w / 2, cy = hr.top - sr.top + h / 2;   // card centre within the stage
        const sx = 2 * Math.max(cx, innerWidth - cx) / w;
        const sy = 2 * Math.max(cy, innerHeight - cy) / h;
        return Math.max(sx, sy) * 1.08;
      };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage, start: "top top", end: "+=100%",
          pin: true, pinSpacing: false, scrub: 0.5, invalidateOnRefresh: true,
          onLeave: markCardSeen,
        },
      });
      tl.to(".card-stage__cta", { autoAlpha: 0, y: 12, duration: 0.12, ease: "none" }, 0)
        .to(meishi, { rotationY: 180, scale: 1.12, duration: 0.42, ease: "power1.inOut" }, 0)
        .to(".meishi__back > *", { autoAlpha: 0, duration: 0.12, ease: "none" }, 0.5)
        .to(meishi, { scale: fillScale, duration: 0.3, ease: "power2.in" }, 0.45)
        .set(".card-stage__desk", { autoAlpha: 0 }, 0.72)
        // Once the cover shows through, let clicks reach it instead of the (fading) card stage.
        .set(stage, { pointerEvents: "none" }, 0.72)
        // Fade the faces, not the card: opacity on the card itself would flatten its 3D and show the front mirrored.
        .to(".meishi__face", { autoAlpha: 0, duration: 0.28, ease: "none" }, 0.72);
      cardTrigger = tl.scrollTrigger;
      return () => { root.classList.remove("has-card-motion"); cardTrigger = null; };
    });

    /* ---------- Section titles print as they scroll into view ----------
       Scrubbed: the print follows the scrollbar, so scrolling back un-prints it.
       Only CSS variables move (see .is-scroll-print in styles.css). Skipped under reduced motion. */
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray(".spread__title").forEach(title => {   // top to bottom, as ScrollTrigger expects
        title.classList.add("is-scroll-print");
        gsap.timeline({ scrollTrigger: { trigger: title, start: "top 90%", end: "top 60%", scrub: 0.4 } })
          .fromTo(title, { "--print": "0%" }, { "--print": "100%", ease: "none", duration: 0.55 })
          .fromTo(title, { "--mis-x": "-18px" }, { "--mis-x": "3px", ease: "power2.out", duration: 0.45 }, 0.3);
      });
      return () => document.querySelectorAll(".is-scroll-print").forEach(t => t.classList.remove("is-scroll-print"));
    });
  }
  // Returning visitors (with no #link to follow) open straight on the cover. Wait for "load":
  // a jump made earlier is undone when the browser settles the page's scroll position.
  if (stage && cardSeen() && !location.hash) {
    const jump = () => requestAnimationFrame(() => window.scrollTo(0, coverTop()));
    if (document.readyState === "complete") jump();
    else window.addEventListener("load", jump, { once: true });
  }

  /* ---------- The cat on the riddle card flicks its tail when the card comes into view ---------- */
  const perchCat = document.querySelector(".perch-cat");
  if (perchCat && !reduceMotion) {
    new IntersectionObserver((entries, obs) => {
      if (entries.some(e => e.isIntersecting)) {
        setTimeout(() => perchCat.classList.add("is-flicking"), 300);
        obs.disconnect();
      }
    }, { threshold: 0.6 }).observe(riddle || perchCat);
  }
})();
