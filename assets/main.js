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

    // Solved on an earlier visit: the centrefold stays open.
    let solved = false;
    try { solved = localStorage.getItem("centrefold") === "open"; } catch (e) {}
    if (solved) openCentrefold(false);
  }

  /* ---------- The perched cat flicks its tail once you start scrolling ---------- */
  const perchCat = document.querySelector(".perch-cat");
  if (perchCat && !reduceMotion) {
    const flick = () => {
      perchCat.classList.add("is-flicking");
      window.removeEventListener("scroll", flick);
    };
    window.addEventListener("scroll", flick, { passive: true });
  }
})();
