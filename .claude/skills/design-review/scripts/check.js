#!/usr/bin/env node
// Design-review checker for this static site.
// Serves the repo, opens every theme × width in Chromium, and records:
//   - screenshots (first screen + every screen down the page)
//   - horizontal overflow, console/page errors
//   - axe-core WCAG 2.1 AA violations
//   - token contrast (text ≥ 4.5:1, focus ≥ 3:1) per theme
//   - touch targets under 44px at phone widths
//   - the card: on the first screen with no bar, the button opens the portfolio, the name lands on the bar's name,
//     the theme icon lands on the bar's, every visit opens on the card, the replay link, keyboard focus, the theme switches
//   - the same checks again with the hidden bonus open and every project story unfolded
//   - the project stories: folded at first, Enter and a click open them, focus ring, Highlights still land
//   - the riddle: wrong guesses keep the bonus shut, "panda" opens it, a reload keeps it open, the reset shuts it again
//   - the fun zone: nothing from it loads before the riddle; after it, a desktop prefetches every file in back/manifest.json
//     (and the manifest lists everything the room loads), phones never do; the button zooms into the room and opens back/,
//     which opens on the room's picture until the live room is ready; phones get a note first;
//     back/ draws the room, opens a thing from the dock, shows everything as a list (also under reduced motion), axe 0
// Usage: node .claude/skills/design-review/scripts/check.js [--out DIR] [--widths 390,1280] [--themes dark,light]
// Exit code 1 when any check fails, so it can gate hooks and CI.

const http = require("http");
const fs = require("fs");
const path = require("path");

let chromium;
try { ({ chromium } = require("playwright")); }
catch { console.error("Playwright not found. Run: npm i -D playwright && npx playwright install chromium"); process.exit(2); }

const ROOT = path.resolve(__dirname, "../../../..");
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => {
  if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1]]);
  return acc;
}, []));
const OUT = path.resolve(args.out || path.join(ROOT, ".review"));
const WIDTHS = (args.widths || "390,1280").split(",").map(Number);
const THEMES = (args.themes || "dark,light").split(",");
const MAX_SCREENS = 12;

let axeSrc;
try { axeSrc = fs.readFileSync(require.resolve("axe-core/axe.min.js", { paths: [ROOT] }), "utf8"); }
catch { console.error("axe-core not found. Run: npm install"); process.exit(2); }

// Minimal static server so the check doesn't depend on anything else running.
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json",
  ".webp": "image/webp", ".jpg": "image/jpeg", ".gltf": "model/gltf+json", ".bin": "application/octet-stream" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

// WCAG relative-luminance contrast.
const lum = hex => {
  const c = hex.replace("#", "").match(/../g).map(h => parseInt(h, 16) / 255)
    .map(x => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
// Token pairs that must pass in every theme: [foreground, background, minimum].
const TOKEN_PAIRS = [
  ["--text", "--paper", 4.5], ["--ink", "--paper", 4.5], ["--muted", "--paper", 4.5],
  ["--text", "--paper-deep", 4.5], ["--muted", "--paper-deep", 4.5], ["--on-accent", "--accent", 4.5],
  ["--paper", "--ink", 4.5], ["--focus", "--paper", 3], ["--focus", "--paper-deep", 3],
  ["--ink", "--card", 4.5], ["--text", "--card", 4.5], ["--muted", "--card", 4.5], ["--focus", "--card", 3],
];

// Checks that read the page as it stands: overflow, axe, small touch targets.
const audit = async (page, phone) => {
  await page.waitForTimeout(1500);   // let the scrubbed card transition catch up with the last scroll
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await page.addScriptTag({ content: axeSrc });
  const axe = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } });
    return r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help,
      targets: v.nodes.slice(0, 5).map(n => n.target.join(" ")) }));
  });
  const smallTargets = phone ? await page.evaluate(() =>
    [...document.querySelectorAll("a[href], button, input, summary")]
      .map(el => { const r = el.getBoundingClientRect(); return { el, r }; })
      .filter(({ el, r }) => r.width > 0 && getComputedStyle(el).visibility !== "hidden" && !el.classList.contains("skip"))
      .filter(({ r }) => r.width < 44 || r.height < 44)
      .map(({ el, r }) => ({ name: (el.getAttribute("aria-label") || el.textContent || el.id).trim().replace(/\s+/g, " ").slice(0, 40), w: Math.round(r.width), h: Math.round(r.height) }))
  ) : [];
  return { overflow, axe, smallTargets };
};

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise(r => server.listen(0, r));
  const url = `http://localhost:${server.address().port}/`;
  // Cloud sessions ship one Chromium at this path; Playwright's own download may not match the pinned version.
  const CLOUD_CHROMIUM = "/opt/pw-browsers/chromium";
  // Software WebGL (SwiftShader), so the fun zone's 3D room draws on machines without a GPU.
  const GL_ARGS = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];
  const browser = await chromium.launch(fs.existsSync(CLOUD_CHROMIUM) ? { executablePath: CLOUD_CHROMIUM, args: GL_ARGS } : { args: GL_ARGS });
  // Dark is the site's default theme. Seed each page's saved theme from its colour scheme,
  // so the light runs really are light.
  const newPage = async opts => {
    const p = await browser.newPage(opts);
    await p.addInitScript(t => { try { if (!localStorage.getItem("theme")) localStorage.setItem("theme", t); } catch (e) {} },
      opts.colorScheme === "light" ? "light" : "dark");
    return p;
  };
  // Read one of the card transition's CSS variables.
  const cardVar = (page, el, name) => page.evaluate(([el, name]) => parseFloat(getComputedStyle(document.querySelector(el)).getPropertyValue(name)), [el, name]);
  const results = [];
  const cfResults = [];

  for (const theme of THEMES) for (const width of WIDTHS) {
    const tag = `${theme}-${width}`;
    const phone = width < 600;
    const page = await newPage({
      viewport: { width, height: phone ? 844 : 800 },
      deviceScaleFactor: phone ? 2 : 1,
      colorScheme: theme === "light" ? "light" : "dark",
    });
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);                      // let the load animation finish

    // Screen 1 is the card. One wheel step opens it (the 1.5s transition); then the page scrolls normally.
    const screens = [];
    const cardShot = path.join(OUT, `${tag}-01.png`);
    await page.screenshot({ path: cardShot });
    screens.push(path.relative(ROOT, cardShot));
    await page.mouse.move(width / 2, 300);
    await page.mouse.wheel(0, 40);
    await page.waitForTimeout(2200);

    // Warm-up pass: scroll the whole page once so every scroll-triggered animation
    // runs to its final state before screenshots.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const vh = page.viewportSize().height;
    for (let y = 0; y < height; y += vh / 2) {
      await page.evaluate(top => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(4500);

    // Screens: scroll one viewport at a time so fixed UI renders as a visitor sees it.
    for (let i = 1, y = 0; y < height && i < MAX_SCREENS; i++, y += vh) {
      await page.evaluate(top => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(300);
      const file = path.join(OUT, `${tag}-${String(i + 1).padStart(2, "0")}.png`);
      await page.screenshot({ path: file });
      screens.push(path.relative(ROOT, file));
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));

    const { overflow, axe, smallTargets } = await audit(page, phone);

    const tokens = await page.evaluate(names => {
      const cs = getComputedStyle(document.documentElement);
      return Object.fromEntries(names.map(n => [n, cs.getPropertyValue(n).trim()]));
    }, [...new Set(TOKEN_PAIRS.flatMap(([f, b]) => [f, b]))]);
    const contrast = TOKEN_PAIRS.map(([f, b, min]) => {
      const fg = tokens[f], bg = tokens[b];
      if (!/^#[0-9a-f]{6}$/i.test(fg) || !/^#[0-9a-f]{6}$/i.test(bg)) return { pair: `${f} on ${b}`, skipped: `${fg} / ${bg}` };
      const r = ratio(fg, bg);
      return { pair: `${f} on ${b}`, fg, bg, ratio: +r.toFixed(2), min, pass: r >= min };
    });

    // Contact sheet: every screen side by side in one image, for a quick visual pass.
    const sheet = path.join(OUT, `${tag}-sheet.png`);
    const thumbs = screens.map(s => `data:image/png;base64,${fs.readFileSync(path.join(ROOT, s)).toString("base64")}`);
    const cols = phone ? 6 : 3;
    const sheetPage = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    await sheetPage.setContent(`<body style="margin:0;padding:12px;background:#777;display:grid;grid-template-columns:repeat(${cols},1fr);gap:12px;font:14px sans-serif">
      ${thumbs.map((t, i) => `<figure style="margin:0"><img src="${t}" style="width:100%;display:block"><figcaption style="color:#fff">${tag} #${i + 1}</figcaption></figure>`).join("")}</body>`);
    await sheetPage.screenshot({ path: sheet, fullPage: true });
    await sheetPage.close();

    results.push({ theme, width, sheet: path.relative(ROOT, sheet), screens, overflow, errors, axe, contrast, smallTargets });
    await page.close();

    // Same theme and width with the bonus already open (as on a return visit).
    const cfPage = await newPage({
      viewport: { width, height: phone ? 844 : 800 },
      deviceScaleFactor: phone ? 2 : 1,
      colorScheme: theme === "light" ? "light" : "dark",
    });
    const cfErrors = [];
    cfPage.on("pageerror", e => cfErrors.push(e.message));
    cfPage.on("console", m => { if (m.type() === "error") cfErrors.push(m.text()); });
    await cfPage.addInitScript(() => { try { localStorage.setItem("bonus", "open"); } catch (e) {} });
    await cfPage.goto(url + "#about", { waitUntil: "networkidle" });
    await cfPage.waitForTimeout(2500);
    // This pass also opens every project story, so axe, overflow and the screenshots cover them open.
    await cfPage.evaluate(() => document.querySelectorAll(".story__more").forEach(d => { d.open = true; }));
    const cfScreens = [];
    for (const [name, sel] of [["about", "#about"], ["projects", "#projects"], ["contact", "#contact"], ["bonus", "#bonus"]]) {
      await cfPage.evaluate(s => document.querySelector(s).scrollIntoView({ behavior: "instant", block: "start" }), sel);
      await cfPage.waitForTimeout(700);
      const file = path.join(OUT, `${tag}-cf-${name}.png`);
      await cfPage.screenshot({ path: file });
      cfScreens.push(path.relative(ROOT, file));
    }
    await cfPage.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const cfVisible = await cfPage.evaluate(() => !document.getElementById("bonus").hidden && !!document.querySelector(".bonus-entry a")?.getBoundingClientRect().width);
    cfResults.push({ theme, width, screens: cfScreens, errors: cfErrors, visible: cfVisible, ...(await audit(cfPage, phone)) });
    await cfPage.close();
  }

  // The riddle itself: wrong guesses keep the bonus shut, the right one opens it for good.
  const rp = await newPage({ viewport: { width: 1280, height: 800 }, colorScheme: "dark" });
  await rp.goto(url, { waitUntil: "networkidle" });
  const cfShown = () => rp.evaluate(() => !document.getElementById("bonus").hidden);
  const tryGuess = async word => { await rp.fill("#guess", word); await rp.click(".riddle__btn"); await rp.waitForTimeout(200); };
  const riddle = { hiddenAtStart: !(await cfShown()) };
  await tryGuess("cat");
  riddle.hintAfterWrong = await rp.textContent(".riddle__status");
  riddle.hiddenAfterWrong = !(await cfShown());
  await tryGuess(" Panda ");
  riddle.openAfterRight = await cfShown();
  riddle.contentsLinkShown = await rp.evaluate(() => !!document.querySelector(".bonus-entry a")?.getBoundingClientRect().width);
  await rp.goto(url + "#contact", { waitUntil: "networkidle" });   // a reload, landing past the card
  riddle.openAfterReload = await cfShown();
  await rp.click(".riddle-reset");
  await rp.waitForTimeout(200);
  riddle.shutAfterReset = !(await cfShown()) && await rp.evaluate(() => !document.querySelector(".riddle__form").hidden && document.activeElement?.id === "guess");
  await rp.goto(url + "#contact", { waitUntil: "networkidle" });   // a reload, landing past the card
  riddle.shutAfterResetReload = !(await cfShown());
  await rp.close();

  // Project stories: shut at first, Enter and a click open them, a click shuts them, the focus ring shows,
  // and the Highlights still land on each project.
  const stories = {};
  const sp = await newPage({ viewport: { width: 1280, height: 800 }, colorScheme: "dark" });
  await sp.goto(url + "#projects", { waitUntil: "networkidle" });
  await sp.waitForTimeout(1500);
  const storyOpen = () => sp.evaluate(() => [...document.querySelectorAll(".story__more")].map(d => d.open));
  stories.count = (await storyOpen()).length;
  stories.shutAtStart = (await storyOpen()).every(o => !o);
  await sp.focus("#cumulus-coach .story__more > summary");
  await sp.keyboard.press("Enter");
  stories.enterOpens = (await storyOpen())[0] === true;
  stories.focusRing = await sp.evaluate(() => { const s = document.activeElement; const cs = getComputedStyle(s);
    return s.matches("summary:focus-visible") && cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2; });
  await sp.click("#edge-energy-optimizer .story__more > summary");
  stories.clickOpens = (await storyOpen())[1] === true;
  await sp.click("#edge-energy-optimizer .story__more > summary");
  stories.clickShuts = (await storyOpen())[1] === false;
  await sp.goto(url + "#about", { waitUntil: "networkidle" });
  await sp.waitForTimeout(1500);
  stories.highlightsLand = true;
  for (const id of ["cumulus-coach", "edge-energy-optimizer"]) {
    await sp.click(`.highlights a[href="#${id}"]`);
    await sp.waitForTimeout(1200);
    const top = await sp.evaluate(i => document.getElementById(i).getBoundingClientRect().top, id);
    if (!(top >= -2 && top < 400)) stories.highlightsLand = false;
    await sp.evaluate(() => document.getElementById("about").scrollIntoView({ behavior: "instant" }));
    await sp.waitForTimeout(300);
  }
  await sp.close();

  // The fun zone. From the main page: no three.js there; the button zooms into the room, then opens back/.
  const funZone = {};
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "back/manifest.json"), "utf8")).files;
  const local = u => { const p = new URL(u); return p.origin === new URL(url).origin ? p.pathname.slice(1) : null; };
  const isRoomFile = u => /vendor\/three|\/back\//.test(u);

  // While the card is closed, nothing from the fun side downloads. Once it opens (and the browser is idle),
  // a desktop prefetches every file in the manifest.
  const fn = await newPage({ viewport: { width: 1280, height: 800 }, colorScheme: "dark" });
  const fnRequests = [];
  fn.context().on("request", r => fnRequests.push(r.url()));
  await fn.goto(url, { waitUntil: "networkidle" });
  await fn.waitForTimeout(2000);
  funZone.mainLoadsNoThree = !fnRequests.some(isRoomFile);
  await fn.click(".card-open, [data-open-portfolio], a[href='#about'].card__open").catch(() => fn.keyboard.press("PageDown"));
  await fn.waitForTimeout(4000);
  const openedPaths = new Set(fnRequests.map(local).filter(Boolean));
  funZone.prefetchAfterOpenMissing = manifest.filter(f => !openedPaths.has(f) && !(f === "back/" && openedPaths.has("back/index.html")));
  await fn.close();

  // After the riddle, on a desktop: once the Bonus is near, every file the room needs is prefetched.
  const fz = await newPage({ viewport: { width: 1280, height: 800 }, colorScheme: "dark" });
  const fzRequests = [];
  fz.context().on("request", r => fzRequests.push(r.url()));
  await fz.addInitScript(() => { try { localStorage.setItem("bonus", "open"); } catch (e) {} });
  await fz.goto(url + "#bonus", { waitUntil: "networkidle" });
  await fz.waitForTimeout(2000);
  const fetchedPaths = new Set(fzRequests.map(local).filter(Boolean));
  funZone.prefetchMissing = manifest.filter(f => !fetchedPaths.has(f) && !(f === "back/" && fetchedPaths.has("back/index.html")));
  funZone.linkShown = await fz.evaluate(() => !!document.querySelector(".fun-zone")?.getBoundingClientRect().height);
  await fz.click(".fun-zone");
  await fz.waitForTimeout(150);
  funZone.zooms = await fz.evaluate(() => !!document.querySelector(".room-zoom") && location.pathname === "/");
  try { await fz.waitForURL(/\/back\/$/, { timeout: 5000 }); funZone.opensRoom = true; } catch (e) { funZone.opensRoom = false; }
  await fz.close();

  // Phones: a note first, then the room page as a list.
  const fp = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const fpRequests = [];
  fp.context().on("request", r => fpRequests.push(r.url()));
  await fp.addInitScript(() => { try { localStorage.setItem("bonus", "open"); } catch (e) {} });
  await fp.goto(url + "#bonus", { waitUntil: "networkidle" });
  await fp.waitForTimeout(1500);
  funZone.phoneNoPrefetch = !fpRequests.some(isRoomFile);
  await fp.click(".fun-zone");
  await fp.waitForTimeout(200);
  funZone.phoneNote = await fp.evaluate(() => location.pathname === "/" && !!document.querySelector(".bonus__phone").textContent.trim());
  await fp.click(".fun-zone");
  try { await fp.waitForURL(/\/back\/$/, { timeout: 5000 }); } catch (e) {}
  await fp.waitForTimeout(800);
  funZone.phoneList = await fp.evaluate(() => document.body.classList.contains("mode-list") && !document.querySelector(".note").hidden
    && [...document.querySelectorAll(".thing")].every(t => t.getBoundingClientRect().height > 0));
  const phoneShot = path.join(OUT, "fun-390-list.png");
  await fp.screenshot({ path: phoneShot, fullPage: true });
  funZone.phoneAudit = await audit(fp, true);
  await fp.close();

  // The room itself, on a desktop.
  const fr = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const frErrors = [];
  fr.on("pageerror", e => frErrors.push(e.message));
  fr.on("console", m => { if (m.type() === "error") frErrors.push(m.text()); });
  const frRequests = [];
  fr.context().on("request", r => frRequests.push(r.url()));
  await fr.goto(url + "back/", { waitUntil: "domcontentloaded" });
  // The room's picture holds the screen first; the live room stays hidden until it has a finished frame.
  funZone.posterFirst = await fr.evaluate(() => {
    const poster = document.querySelector(".stage__poster");
    return !!poster && getComputedStyle(poster).opacity === "1" && getComputedStyle(document.querySelector(".stage__canvas")).opacity === "0";
  });
  try { await fr.waitForFunction(() => document.body.dataset.room, null, { timeout: 90000 }); } catch (e) {}
  // Software rendering is slow, so give the crossfade time to finish rather than checking at a fixed moment.
  funZone.liveReplacesPoster = await fr.waitForFunction(() => getComputedStyle(document.querySelector(".stage__canvas")).opacity === "1"
    && getComputedStyle(document.querySelector(".stage__poster")).opacity === "0", null, { timeout: 5000 }).then(() => true, () => false);
  funZone.unlisted = [...new Set(frRequests.map(local).filter(Boolean))]
    .map(p => (p === "back/index.html" ? "back/" : p)).filter(p => !manifest.includes(p));
  funZone.roomState = await fr.evaluate(() => document.body.dataset.room || "timed out");
  // Software rendering is slow; without this GSAP stretches the camera moves to keep up.
  await fr.evaluate(() => window.gsap?.ticker.lagSmoothing(0));
  await fr.waitForTimeout(2500);
  const stats = await fr.evaluate(() => window.__fun?.room?.stats());
  funZone.drawn = stats?.drawn ?? 0;
  funZone.things = stats?.things ?? [];
  await fr.screenshot({ path: path.join(OUT, "fun-1280-room.png") });
  // Immersed on arrival: only "Menu" shows.
  const shown = sel => fr.evaluate(s => getComputedStyle(document.querySelector(s)).opacity === "1", sel);
  funZone.immersed = !(await shown(".brand")) && !(await shown(".dock")) && await fr.evaluate(() => !document.querySelector(".menu-btn").hidden);
  // Looking around: the mouse at the right edge turns the head right, by no more than 30°; the middle brings it back.
  // Software rendering is slow, so wait for the turn to settle rather than a fixed time.
  const yaw = () => fr.evaluate(() => window.__fun.room.stats().yaw);
  await fr.mouse.move(1279, 400);
  await fr.waitForFunction(() => window.__fun.room.stats().yaw < -28, null, { timeout: 10000 }).catch(() => {});
  await fr.waitForTimeout(500);
  const turned = await yaw();
  await fr.mouse.move(640, 400);
  await fr.waitForFunction(() => Math.abs(window.__fun.room.stats().yaw) < 2, null, { timeout: 10000 }).catch(() => {});
  const back = await yaw();
  funZone.look = { turned, back };
  funZone.looksAround = turned < -20 && turned >= -30.5 && Math.abs(back) < 3;
  // Menu brings the rest back; then a button in the row opens the desk, walks up to it and focuses its heading.
  await fr.click(".menu-btn");
  await fr.waitForTimeout(400);
  funZone.menuShows = await shown(".dock") && await shown(".brand");
  await fr.click('.dock button[data-thing="desk"]');
  await fr.waitForTimeout(1600);
  funZone.dockOpens = await fr.evaluate(() => document.querySelector(".panel").classList.contains("is-open")
    && document.querySelector('.dock button[data-thing="desk"]').getAttribute("aria-expanded") === "true"
    && document.activeElement?.id === "h-desk"
    && window.__fun.room.stats().distanceTo.desk <= 1.6);
  funZone.uiHiddenUpClose = !(await shown(".dock"));
  await fr.screenshot({ path: path.join(OUT, "fun-1280-desk.png") });
  await fr.keyboard.press("Escape");
  await fr.waitForTimeout(400);
  funZone.escapeCloses = await fr.evaluate(() => !document.querySelector(".panel").classList.contains("is-open")
    && document.activeElement?.dataset.thing === "desk");
  // With no panel open, Esc toggles the menu.
  const uiOpen = () => fr.evaluate(() => document.body.classList.contains("ui-open"));
  const before = await uiOpen();
  await fr.keyboard.press("Escape");
  await fr.waitForTimeout(200);
  funZone.escapeTogglesMenu = (await uiOpen()) !== before;
  // Tab into a hidden control shows the UI.
  await fr.evaluate(() => { document.activeElement?.blur(); document.body.classList.remove("ui-open"); });
  for (let i = 0; i < 4 && !(await uiOpen()); i++) await fr.keyboard.press("Tab");
  funZone.tabShowsUi = await uiOpen();
  // Walking up to each thing ends close to it.
  funZone.closeUps = {};
  for (const t of ["desk", "shelf", "board", "chair", "arcade", "panda"]) {
    await fr.evaluate(t => window.__fun.open(t), t);
    await fr.waitForTimeout(1500);
    funZone.closeUps[t] = await fr.evaluate(t => window.__fun.room.stats().distanceTo[t], t);
    if (t === "arcade") await fr.screenshot({ path: path.join(OUT, "fun-1280-arcade.png") });
    await fr.evaluate(() => window.__fun.close());
    await fr.waitForTimeout(1300);
  }
  // The door: aim at it (the head turns as the mouse moves), then click it, and the portfolio opens.
  await fr.evaluate(() => document.body.classList.remove("ui-open"));
  funZone.exitInRoom = await fr.evaluate(() => window.__fun.room.stats().exit);
  for (let i = 0; i < 4; i++) {
    const [x, y] = await fr.evaluate(() => window.__fun.room.stats().exitAt);
    await fr.mouse.move(Math.min(Math.max(x, 1), 1279), Math.min(Math.max(y, 1), 799));
    await fr.waitForTimeout(1500);
  }
  await fr.screenshot({ path: path.join(OUT, "fun-1280-door.png") });
  funZone.roomAudit = await audit(fr, false);
  funZone.roomErrors = frErrors;
  const [ex, ey] = await fr.evaluate(() => window.__fun.room.stats().exitAt);
  await fr.mouse.click(ex, ey);
  funZone.doorLeads = await fr.waitForURL(/\/#bonus$/, { timeout: 5000 }).then(() => true, () => false);
  await fr.goto(url + "back/?view=list", { waitUntil: "networkidle" });
  funZone.listShowsAll = await fr.evaluate(() => [...document.querySelectorAll(".thing")].every(t => t.getBoundingClientRect().height > 0)
    && !document.querySelector(".stage").getBoundingClientRect().height);
  funZone.listAudit = await audit(fr, false);
  await fr.screenshot({ path: path.join(OUT, "fun-1280-list.png"), fullPage: true });
  await fr.close();

  // Reduced motion on back/: the list, with a way into the room.
  const frm = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  await frm.goto(url + "back/", { waitUntil: "networkidle" });
  funZone.reducedMotionList = await frm.evaluate(() => document.body.classList.contains("mode-list") && !document.querySelector(".note__open").hidden);
  await frm.close();

  // Reduced motion: the card, the bar and About show as plain sections, with nothing animating.
  const rm = await newPage({ viewport: { width: 1280, height: 800 }, colorScheme: "dark", reducedMotion: "reduce" });
  await rm.goto(url, { waitUntil: "networkidle" });
  await rm.waitForTimeout(300);
  const reducedMotion = await rm.evaluate(() => ({
    running: document.getAnimations().filter(a => a.playState === "running").length,
    cardPinned: document.documentElement.classList.contains("has-card-motion"),
    cardAndAboutShown: !!document.querySelector("#card-name")?.getBoundingClientRect().height && !!document.querySelector("#about-title")?.getBoundingClientRect().height
      && getComputedStyle(document.querySelector("#about")).opacity === "1",
    barShown: getComputedStyle(document.querySelector(".bar")).visibility === "visible" && getComputedStyle(document.querySelector(".bar__nav li")).opacity === "1",
  }));

  // The card, at phone and desktop width: first visit, the button and the wheel (paced), landing, closing at the top,
  // keyboard, a returning visitor, the replay link.
  const card = [];
  for (const [width, height] of [[390, 844], [1280, 800]]) {
    const r = { width };
    const cp = await newPage({ viewport: { width, height }, colorScheme: "light" });
    await cp.goto(url, { waitUntil: "networkidle" });
    await cp.waitForTimeout(1200);
    r.frontOnFirstScreen = await cp.evaluate(() => {
      const inView = el => { const b = el?.getBoundingClientRect(); return !!b && b.height > 0 && b.top >= 0 && b.bottom <= innerHeight; };
      return inView(document.getElementById("card-name")) && inView(document.querySelector(".card__email a")) && inView(document.querySelector(".card-open"));
    });
    r.barHiddenOnCard = await cp.evaluate(() => getComputedStyle(document.querySelector(".bar")).visibility === "hidden");
    // "Open the portfolio" plays the transition over about 1.5s: still under way at 0.5s, done by 2.2s.
    await cp.click(".card-open");
    await cp.waitForTimeout(500);
    r.buttonPaced = await cardVar(cp, "#about", "--about-alpha") < .5 && await cardVar(cp, "#card", "--paper-sx") > 1.01;
    await cp.waitForTimeout(1700);
    r.buttonOpensPortfolio = await cp.evaluate(() => document.activeElement?.id === "about-title" && document.getElementById("about-title").getBoundingClientRect().top < innerHeight / 2);
    r.barShownAfter = await cp.evaluate(() => getComputedStyle(document.querySelector(".bar")).visibility === "visible" && getComputedStyle(document.querySelector(".bar__nav li:last-child")).opacity === "1");
    // The card's name, at its landing spot, must sit exactly on the bar's name (they swap in one frame).
    r.landingOffset = await cp.evaluate(() => {
      const box = el => { const g = document.createRange(); g.selectNodeContents(el); return g.getBoundingClientRect(); };
      const a = box(document.getElementById("card-name")), b = box(document.querySelector(".bar__name"));
      return Math.max(Math.abs(a.left - b.left), Math.abs(a.top - b.top), Math.abs(a.width - b.width));
    });
    // The card's sun or moon, at its landing spot, must sit on the bar's.
    r.iconOffset = await cp.evaluate(() => {
      const a = document.querySelector(".card-theme .theme-icon").getBoundingClientRect(), b = document.querySelector(".theme-toggle .theme-icon").getBoundingClientRect();
      return Math.max(Math.abs(a.left - b.left), Math.abs(a.top - b.top));
    });
    // At the top of the page, one wheel step up plays it back to the card, at the same pace.
    await cp.mouse.move(width / 2, height / 2);
    await cp.waitForTimeout(500);
    await cp.mouse.wheel(0, -40);
    await cp.waitForTimeout(2200);
    r.wheelUpCloses = await cp.evaluate(() => getComputedStyle(document.querySelector(".bar")).visibility === "hidden" && document.getElementById("card-name").getBoundingClientRect().top > 60);
    await cp.close();

    // Any scroll opens it: one small wheel step plays the whole transition, at the button's pace.
    const wp = await newPage({ viewport: { width, height }, colorScheme: "light" });
    await wp.goto(url, { waitUntil: "networkidle" });
    await wp.waitForTimeout(1200);
    await wp.mouse.move(width / 2, height / 2);
    await wp.mouse.wheel(0, 40);
    await wp.waitForTimeout(500);
    r.wheelPaced = await cardVar(wp, "#about", "--about-alpha") < .5 && await cardVar(wp, "#card", "--paper-sx") > 1.01;
    const midShot = path.join(OUT, `light-${width}-card-mid.png`);
    await wp.screenshot({ path: midShot });
    r.midFlipScreenshot = path.relative(ROOT, midShot);
    await wp.waitForTimeout(1700);
    r.wheelOpens = await wp.evaluate(() => window.scrollY === 0 && getComputedStyle(document.querySelector(".bar")).visibility === "visible"
      && getComputedStyle(document.getElementById("about")).opacity === "1" && !document.documentElement.classList.contains("is-card-locked"));
    // Below the top, the page scrolls normally.
    await wp.mouse.wheel(0, 400);
    await wp.waitForTimeout(800);
    r.scrollsAfterOpen = await wp.evaluate(() => window.scrollY > 100);
    await wp.close();

    // Keyboard: tabbing past the card must never leave focus hidden under it.
    const kp = await newPage({ viewport: { width, height }, colorScheme: "light" });
    await kp.goto(url, { waitUntil: "networkidle" });
    await kp.waitForTimeout(1200);
    await kp.evaluate(() => document.querySelector(".card-open").focus());
    await kp.keyboard.press("Tab");
    await kp.waitForTimeout(400);
    r.tabPastCardVisible = await kp.evaluate(() => {
      const a = document.activeElement, b = a.getBoundingClientRect();
      const top = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      return !a.closest("#card") && (top === a || a.contains(top));
    });
    await kp.close();

    // Every visit opens on the card, even for a visitor the page used to remember ("card" = "seen" before v1.2.2).
    const rv = await browser.newPage({ viewport: { width, height }, colorScheme: "light" });   // no saved theme: dark by default
    await rv.addInitScript(() => { try { localStorage.setItem("card", "seen"); } catch (e) {} });
    await rv.goto(url, { waitUntil: "networkidle" });
    await rv.waitForTimeout(1200);
    r.returningOpensOnCard = await rv.evaluate(() => getComputedStyle(document.querySelector(".bar")).visibility === "hidden" && document.getElementById("card-name").getBoundingClientRect().top > 60);
    // The card's switch: dark (the default) shows the sun and offers light; one press switches and swaps both buttons.
    const themeState = () => rv.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      text: document.querySelector(".theme-toggle__text").textContent.trim(),
      label: document.querySelector(".card-theme").getAttribute("aria-label"),
      sun: getComputedStyle(document.querySelector(".card-theme .theme-icon__sun")).display !== "none",
      moon: getComputedStyle(document.querySelector(".card-theme .theme-icon__moon")).display !== "none",
    }));
    const before = await themeState();
    await rv.click(".card-theme");
    const after = await themeState();
    r.themeSwitch = before.theme === "dark" && before.text === "Light mode" && before.label === "Switch to light mode" && before.sun && !before.moon
      && after.theme === "light" && after.text === "Dark mode" && after.label === "Switch to dark mode" && !after.sun && after.moon;
    await rv.click(".card-open");
    await rv.waitForTimeout(2200);
    await rv.click(".card-replay");
    await rv.waitForTimeout(3600);
    r.replayShowsCard = await rv.evaluate(() => getComputedStyle(document.querySelector(".bar")).visibility === "hidden" && document.activeElement?.classList.contains("card-open"));
    await rv.close();
    card.push(r);
  }
  // Dark by default: a first-time visitor whose system is set to light still gets the dark theme.
  const dp = await browser.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: "light" });
  await dp.goto(url, { waitUntil: "networkidle" });
  const darkByDefault = await dp.evaluate(() => document.documentElement.dataset.theme === "dark");
  await dp.close();
  await browser.close();
  server.close();

  // Summary
  const fails = [];
  for (const r of results) {
    const t = `${r.theme} @ ${r.width}px`;
    if (r.overflow > 0) fails.push(`${t}: horizontal overflow ${r.overflow}px`);
    r.errors.forEach(e => fails.push(`${t}: JS error: ${e}`));
    r.axe.forEach(v => fails.push(`${t}: axe ${v.impact} ${v.id} (${v.help}) at ${v.targets.join(", ")}`));
    r.contrast.filter(c => c.pass === false).forEach(c => fails.push(`${t}: contrast ${c.pair} = ${c.ratio}:1 (needs ${c.min}:1)`));
    r.smallTargets.forEach(s => fails.push(`${t}: touch target "${s.name}" is ${s.w}×${s.h}px (needs 44×44)`));
  }
  for (const r of cfResults) {
    const t = `${r.theme} @ ${r.width}px, bonus open`;
    if (!r.visible) fails.push(`${t}: the bonus is not shown`);
    if (r.overflow > 0) fails.push(`${t}: horizontal overflow ${r.overflow}px`);
    r.errors.forEach(e => fails.push(`${t}: JS error: ${e}`));
    r.axe.forEach(v => fails.push(`${t}: axe ${v.impact} ${v.id} (${v.help}) at ${v.targets.join(", ")}`));
    r.smallTargets.forEach(s => fails.push(`${t}: touch target "${s.name}" is ${s.w}×${s.h}px (needs 44×44)`));
  }
  if (!riddle.hiddenAtStart) fails.push("riddle: the bonus is visible before the riddle is solved");
  if (!riddle.hiddenAfterWrong || !riddle.hintAfterWrong) fails.push("riddle: a wrong guess should show a hint and keep the bonus shut");
  if (!riddle.openAfterRight || !riddle.contentsLinkShown) fails.push('riddle: "panda" should open the bonus and add it to the bar');
  if (!riddle.openAfterReload) fails.push("riddle: the bonus should stay open after a reload");
  if (!riddle.shutAfterReset) fails.push('riddle: "Reset the riddle" should hide the bonus, show the form again and focus the input');
  if (!riddle.shutAfterResetReload) fails.push("riddle: after a reset the bonus should stay shut on reload");
  if (stories.count !== 2) fails.push(`stories: expected 2 "Read the full story" toggles, found ${stories.count}`);
  if (!stories.shutAtStart) fails.push("stories: the full stories should start folded");
  if (!stories.enterOpens) fails.push('stories: Enter on "Read the full story" should open it');
  if (!stories.focusRing) fails.push('stories: "Read the full story" should show a 2px focus ring from the keyboard');
  if (!stories.clickOpens || !stories.clickShuts) fails.push('stories: a click on "Read the full story" should open it, and another should fold it');
  if (!stories.highlightsLand) fails.push("stories: the Highlights links should land on cumulus-coach and edge-energy-optimizer");
  if (reducedMotion.cardPinned || !reducedMotion.cardAndAboutShown || !reducedMotion.barShown) fails.push("reduced motion: the card should not be pinned; the card, the bar and About should all show as plain sections");
  for (const r of card) {
    const t = `card @ ${r.width}px`;
    if (!r.frontOnFirstScreen) fails.push(`${t}: the name, email and "Open the portfolio" should all be on the first screen`);
    if (!r.barHiddenOnCard) fails.push(`${t}: the bar should be hidden while the card is closed`);
    if (!r.buttonOpensPortfolio) fails.push(`${t}: "Open the portfolio" should bring About into view and focus its heading`);
    if (!r.barShownAfter) fails.push(`${t}: the bar and all its links should be shown once the card has opened`);
    if (!(r.landingOffset <= 1)) fails.push(`${t}: the card's name lands ${r.landingOffset?.toFixed(1)}px away from the bar's name (needs 1px or less)`);
    if (!r.buttonPaced) fails.push(`${t}: "Open the portfolio" should play the transition over about 1.5s (it was not under way at 0.5s)`);
    if (!r.wheelPaced || !r.wheelOpens) fails.push(`${t}: one small wheel step should play the whole transition, at the button's pace`);
    if (!r.scrollsAfterOpen) fails.push(`${t}: once open, the page should scroll normally`);
    if (!r.wheelUpCloses) fails.push(`${t}: scrolling up at the top of the page should play back to the card`);
    if (!r.returningOpensOnCard) fails.push(`${t}: every visit should open on the card, even for a visitor who has seen it before`);
    if (!(r.iconOffset <= 1)) fails.push(`${t}: the card's theme icon lands ${r.iconOffset?.toFixed(1)}px away from the bar's (needs 1px or less)`);
    if (!r.themeSwitch) fails.push(`${t}: the card's theme switch should change the theme, swap sun and moon, and change the bar's text and its label`);
    if (!r.replayShowsCard) fails.push(`${t}: "See my card again" should play back to the card and focus its button`);
    if (!r.tabPastCardVisible) fails.push(`${t}: tabbing past the card should show the focused link, not leave it under the card`);
  }
  if (!funZone.mainLoadsNoThree) fails.push("fun zone: while the card is closed, the main page should not load three.js or anything from back/");
  if (funZone.prefetchMissing?.length) fails.push(`fun zone: with the Bonus in view on a desktop, these room files were not prefetched: ${funZone.prefetchMissing.slice(0, 5).join(", ")}${funZone.prefetchMissing.length > 5 ? "…" : ""}`);
  if (!funZone.phoneNoPrefetch) fails.push("fun zone: a phone should never prefetch the 3D room");
  if (funZone.unlisted?.length) fails.push(`fun zone: back/manifest.json is missing files the room loads: ${funZone.unlisted.join(", ")}`);
  if (funZone.prefetchAfterOpenMissing?.length) fails.push(`fun zone: after the card opens on a desktop, these room files were not prefetched: ${funZone.prefetchAfterOpenMissing.slice(0, 5).join(", ")}${funZone.prefetchAfterOpenMissing.length > 5 ? "…" : ""}`);
  if (!funZone.immersed) fails.push('fun zone: in the room only "Menu" should show at first; the title and the row of things stay hidden');
  if (!funZone.looksAround) fails.push(`fun zone: the mouse should turn the view, up to 30° (turned ${funZone.look?.turned}°, back ${funZone.look?.back}°)`);
  if (!funZone.menuShows) fails.push('fun zone: "Menu" should bring the title and the row of things back');
  if (!funZone.uiHiddenUpClose) fails.push("fun zone: up close to a thing, the room's UI should stay hidden");
  if (!funZone.escapeTogglesMenu) fails.push("fun zone: with no panel open, Esc should open or close the menu");
  if (!funZone.tabShowsUi) fails.push("fun zone: tabbing into the hidden UI should show it");
  for (const [t, d] of Object.entries(funZone.closeUps || {})) if (!(d <= 2.1)) fails.push(`fun zone: walking up to "${t}" should end close to it (${d} m away)`);
  if (!funZone.exitInRoom || !funZone.doorLeads) fails.push("fun zone: the room should have a door, and clicking it should go back to the portfolio's Bonus");
  if (!funZone.posterFirst) fails.push("fun zone: the room page should open on the room's picture, with the live room hidden until it is ready");
  if (!funZone.liveReplacesPoster) fails.push("fun zone: once ready, the live room should replace the picture");
  if (!funZone.linkShown) fails.push('fun zone: "Take me to the fun zone" should be in the open bonus');
  if (!funZone.zooms) fails.push("fun zone: the button should zoom the room preview before leaving the page");
  if (!funZone.opensRoom) fails.push("fun zone: the button should open back/");
  if (!funZone.phoneNote) fails.push("fun zone: on a phone the first tap should show the note and stay on the page");
  if (!funZone.phoneList) fails.push("fun zone: on a phone back/ should show the note and every thing as a list");
  if (funZone.roomState !== "ready") fails.push(`fun zone: the 3D room did not load (${funZone.roomState})`);
  if (!(funZone.drawn > 0.5)) fails.push(`fun zone: the room is not drawn (${Math.round(funZone.drawn * 100)}% of the centre)`);
  if (funZone.things.length !== 6) fails.push(`fun zone: the room should have 6 things to click, found ${funZone.things.length}`);
  if (!funZone.dockOpens) fails.push("fun zone: a button in the row should open its panel, walk up to the thing and focus the heading");
  if (!funZone.escapeCloses) fails.push("fun zone: Escape should close the panel and return focus to the dock button");
  if (!funZone.listShowsAll) fails.push("fun zone: ?view=list should show every thing and no room");
  if (!funZone.reducedMotionList) fails.push("fun zone: reduced motion should open on the list, with a button into the room");
  (funZone.roomErrors || []).forEach(e => fails.push(`fun zone: JS error: ${e}`));
  for (const [name, a] of [["room", funZone.roomAudit], ["list", funZone.listAudit], ["phone list", funZone.phoneAudit]]) {
    if (!a) continue;
    if (a.overflow > 0) fails.push(`fun zone ${name}: horizontal overflow ${a.overflow}px`);
    a.axe.forEach(v => fails.push(`fun zone ${name}: axe ${v.impact} ${v.id} (${v.help}) at ${v.targets.join(", ")}`));
    a.smallTargets.forEach(t => fails.push(`fun zone ${name}: touch target "${t.name}" is ${t.w}×${t.h}px (needs 44×44)`));
  }
  if (!darkByDefault) fails.push("theme: a first-time visitor should get the dark theme, whatever their system setting");
  if (reducedMotion.running > 0) fails.push(`reduced motion: ${reducedMotion.running} animations running`);

  const report = { url: "local", when: new Date().toISOString(), pass: fails.length === 0, fails, darkByDefault, reducedMotion, riddle, stories, funZone, card, results, cfResults };
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));

  console.log(`Design check: ${report.pass ? "PASS" : `FAIL (${fails.length})`}`);
  fails.forEach(f => console.log(`  ✗ ${f}`));
  for (const r of results) console.log(`  ${r.theme} @ ${r.width}px: ${r.screens.length} screens, contact sheet ${r.sheet}`);
  console.log(`  Bonus open: ${cfResults.length} passes, screenshots .review${path.sep}<theme>-<width>-cf-{about,projects,contact,bonus}.png (stories open)`);
  console.log(`  Fun zone: screenshots .review${path.sep}fun-{1280-room,1280-desk,1280-list,390-list}.png`);
  console.log(`  report: ${path.relative(ROOT, path.join(OUT, "report.json"))}`);
  process.exit(report.pass ? 0 : 1);
})().catch(e => { console.error(e); server.close(); process.exit(2); });
