#!/usr/bin/env node
// Design-review checker for this static site.
// Serves the repo, opens every theme × width in Chromium, and records:
//   - screenshots (first screen + every screen down the page)
//   - horizontal overflow, console/page errors
//   - axe-core WCAG 2.1 AA violations
//   - token contrast (text ≥ 4.5:1, focus ≥ 3:1) per theme
//   - touch targets under 44px at phone widths
//   - scroll print: section titles are fully printed once scrolled past
//   - the name card: on the first screen, the button opens the cover, returning visitors open on the cover, the replay link
//   - the same checks again with the hidden centrefold open
//   - the riddle: wrong guesses keep the centrefold shut, "panda" opens it, a reload keeps it open, the reset shuts it again
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
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json" };
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
];

// Checks that read the page as it stands: overflow, axe, small touch targets.
const audit = async (page, phone) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await page.addScriptTag({ content: axeSrc });
  const axe = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } });
    return r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help,
      targets: v.nodes.slice(0, 5).map(n => n.target.join(" ")) }));
  });
  const smallTargets = phone ? await page.evaluate(() =>
    [...document.querySelectorAll("a[href], button, input")]
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
  const browser = await chromium.launch(fs.existsSync(CLOUD_CHROMIUM) ? { executablePath: CLOUD_CHROMIUM } : {});
  const results = [];
  const cfResults = [];

  for (const theme of THEMES) for (const width of WIDTHS) {
    const tag = `${theme}-${width}`;
    const phone = width < 600;
    const page = await browser.newPage({
      viewport: { width, height: phone ? 844 : 800 },
      deviceScaleFactor: phone ? 2 : 1,
      colorScheme: theme === "light" ? "light" : "dark",
    });
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);                      // let the load animation finish

    // Warm-up pass: scroll the whole page once so every scroll-triggered animation
    // (cat flick) runs to its final state before screenshots.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const vh = page.viewportSize().height;
    for (let y = 0; y < height; y += vh / 2) {
      await page.evaluate(top => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(4500);

    // Scroll print: at the bottom of the page, every section title that has passed the
    // print band (top above 60% of the viewport) must be fully printed.
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await page.waitForTimeout(1200);
    const unprinted = await page.evaluate(() => [...document.querySelectorAll(".spread__title.is-scroll-print")]
      .filter(t => t.offsetParent && t.getBoundingClientRect().top < innerHeight * 0.6)
      .filter(t => parseFloat(getComputedStyle(t).getPropertyValue("--print")) < 100)
      .map(t => `${t.textContent.trim()} (${getComputedStyle(t).getPropertyValue("--print").trim()})`));

    // Screens: scroll one viewport at a time so fixed UI renders as a visitor sees it.
    const screens = [];
    for (let i = 0, y = 0; y < height && i < MAX_SCREENS; i++, y += vh) {
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

    results.push({ theme, width, sheet: path.relative(ROOT, sheet), screens, overflow, errors, axe, contrast, smallTargets, unprinted });
    await page.close();

    // Same theme and width with the centrefold already open (as on a return visit).
    const cfPage = await browser.newPage({
      viewport: { width, height: phone ? 844 : 800 },
      deviceScaleFactor: phone ? 2 : 1,
      colorScheme: theme === "light" ? "light" : "dark",
    });
    const cfErrors = [];
    cfPage.on("pageerror", e => cfErrors.push(e.message));
    cfPage.on("console", m => { if (m.type() === "error") cfErrors.push(m.text()); });
    await cfPage.addInitScript(() => { try { localStorage.setItem("centrefold", "open"); } catch (e) {} });
    await cfPage.goto(url, { waitUntil: "networkidle" });
    await cfPage.waitForTimeout(2500);
    const cfScreens = [];
    for (const [name, sel] of [["cover", "#top"], ["contact", "#contact"], ["centrefold", "#centrefold"]]) {
      await cfPage.evaluate(s => document.querySelector(s).scrollIntoView({ behavior: "instant", block: "start" }), sel);
      await cfPage.waitForTimeout(700);
      const file = path.join(OUT, `${tag}-cf-${name}.png`);
      await cfPage.screenshot({ path: file });
      cfScreens.push(path.relative(ROOT, file));
    }
    await cfPage.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const cfVisible = await cfPage.evaluate(() => !document.getElementById("centrefold").hidden && !!document.querySelector(".centrefold-entry a")?.getBoundingClientRect().width);
    cfResults.push({ theme, width, screens: cfScreens, errors: cfErrors, visible: cfVisible, ...(await audit(cfPage, phone)) });
    await cfPage.close();
  }

  // The riddle itself: wrong guesses keep the centrefold shut, the right one opens it for good.
  const rp = await browser.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: "dark" });
  await rp.goto(url, { waitUntil: "networkidle" });
  const cfShown = () => rp.evaluate(() => !document.getElementById("centrefold").hidden);
  const tryGuess = async word => { await rp.fill("#guess", word); await rp.click(".riddle__btn"); await rp.waitForTimeout(200); };
  const riddle = { hiddenAtStart: !(await cfShown()) };
  await tryGuess("cat");
  riddle.hintAfterWrong = await rp.textContent(".riddle__status");
  riddle.hiddenAfterWrong = !(await cfShown());
  await tryGuess(" Panda ");
  riddle.openAfterRight = await cfShown();
  riddle.contentsLinkShown = await rp.evaluate(() => !!document.querySelector(".centrefold-entry a")?.getBoundingClientRect().width);
  await rp.reload({ waitUntil: "networkidle" });
  riddle.openAfterReload = await cfShown();
  await rp.click(".riddle-reset");
  await rp.waitForTimeout(200);
  riddle.shutAfterReset = !(await cfShown()) && await rp.evaluate(() => !document.querySelector(".riddle__form").hidden && document.activeElement?.id === "guess");
  await rp.reload({ waitUntil: "networkidle" });
  riddle.shutAfterResetReload = !(await cfShown());
  await rp.close();

  // Reduced motion: the cover must show the finished print immediately, with nothing animating.
  const rm = await browser.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: "dark", reducedMotion: "reduce" });
  await rm.goto(url, { waitUntil: "networkidle" });
  await rm.waitForTimeout(300);
  const reducedMotion = await rm.evaluate(() => ({
    inkLayers: document.querySelectorAll(".ink").length,
    inkPrinted: [...document.querySelectorAll(".ink")].filter(el => { const cs = getComputedStyle(el); return cs.clipPath === "none" && cs.color !== "rgba(0, 0, 0, 0)"; }).length,
    running: document.getAnimations().filter(a => a.playState === "running").length,
    cardPinned: document.documentElement.classList.contains("has-card-motion"),
    cardAndCoverShown: !!document.querySelector("#card-name")?.getBoundingClientRect().height && !!document.querySelector("#cover-title")?.getBoundingClientRect().height,
  }));

  // The name card, at phone and desktop width: first visit, the button, a returning visitor, the replay link.
  const card = [];
  for (const [width, height] of [[390, 844], [1280, 800]]) {
    const r = { width };
    const cp = await browser.newPage({ viewport: { width, height }, colorScheme: "light" });
    await cp.goto(url, { waitUntil: "networkidle" });
    await cp.waitForTimeout(1200);
    r.frontOnFirstScreen = await cp.evaluate(() => {
      const inView = el => { const b = el?.getBoundingClientRect(); return !!b && b.height > 0 && b.top >= 0 && b.bottom <= innerHeight; };
      return inView(document.getElementById("card-name")) && inView(document.querySelector(".meishi__email a")) && inView(document.querySelector(".card-open"));
    });
    await cp.click(".card-open");
    await cp.waitForTimeout(2200);
    r.buttonOpensCover = await cp.evaluate(() => document.activeElement?.id === "cover-title" && document.getElementById("cover-title").getBoundingClientRect().top < innerHeight / 2);
    await cp.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await cp.waitForTimeout(600);
    // Keyboard: tabbing from the card into the cover must never leave focus hidden under the card.
    await cp.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await cp.waitForTimeout(600);
    await cp.evaluate(() => document.querySelector(".card-open").focus());
    await cp.keyboard.press("Tab");
    await cp.waitForTimeout(400);
    r.tabIntoCoverVisible = await cp.evaluate(() => {
      const a = document.activeElement, b = a.getBoundingClientRect();
      const top = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      return !!a.closest("#top") && (top === a || a.contains(top));
    });
    const mid = await cp.evaluate(() => { const t = window.ScrollTrigger?.getAll()[0]; return t ? t.start + (t.end - t.start) / 2 : 0; });
    await cp.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), mid);
    await cp.waitForTimeout(1100);
    const midShot = path.join(OUT, `light-${width}-card-mid.png`);
    await cp.screenshot({ path: midShot });
    r.midFlipScreenshot = path.relative(ROOT, midShot);
    await cp.close();

    const rv = await browser.newPage({ viewport: { width, height }, colorScheme: "light" });
    await rv.addInitScript(() => { try { localStorage.setItem("card", "seen"); } catch (e) {} });
    await rv.goto(url, { waitUntil: "networkidle" });
    await rv.waitForTimeout(1200);
    r.returningOpensOnCover = await rv.evaluate(() => { const b = document.getElementById("cover-title").getBoundingClientRect(); return b.top >= 0 && b.top < innerHeight / 2; });
    await rv.click(".card-replay");
    await rv.waitForTimeout(2200);
    r.replayShowsCard = await rv.evaluate(() => window.scrollY < 5);
    await rv.close();
    card.push(r);
  }
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
    r.unprinted.forEach(u => fails.push(`${t}: section title not fully printed after scrolling past it: ${u}`));
  }
  for (const r of cfResults) {
    const t = `${r.theme} @ ${r.width}px, centrefold open`;
    if (!r.visible) fails.push(`${t}: the centrefold is not shown`);
    if (r.overflow > 0) fails.push(`${t}: horizontal overflow ${r.overflow}px`);
    r.errors.forEach(e => fails.push(`${t}: JS error: ${e}`));
    r.axe.forEach(v => fails.push(`${t}: axe ${v.impact} ${v.id} (${v.help}) at ${v.targets.join(", ")}`));
    r.smallTargets.forEach(s => fails.push(`${t}: touch target "${s.name}" is ${s.w}×${s.h}px (needs 44×44)`));
  }
  if (!riddle.hiddenAtStart) fails.push("riddle: the centrefold is visible before the riddle is solved");
  if (!riddle.hiddenAfterWrong || !riddle.hintAfterWrong) fails.push("riddle: a wrong guess should show a hint and keep the centrefold shut");
  if (!riddle.openAfterRight || !riddle.contentsLinkShown) fails.push('riddle: "panda" should open the centrefold and add it to the contents');
  if (!riddle.openAfterReload) fails.push("riddle: the centrefold should stay open after a reload");
  if (!riddle.shutAfterReset) fails.push('riddle: "Reset the riddle" should hide the centrefold, show the form again and focus the input');
  if (!riddle.shutAfterResetReload) fails.push("riddle: after a reset the centrefold should stay shut on reload");
  if (reducedMotion.cardPinned || !reducedMotion.cardAndCoverShown) fails.push("reduced motion: the card should not be pinned, and the card and cover should both show as normal sections");
  for (const r of card) {
    const t = `name card @ ${r.width}px`;
    if (!r.frontOnFirstScreen) fails.push(`${t}: the name, email and "Open the build log" should all be on the first screen`);
    if (!r.buttonOpensCover) fails.push(`${t}: "Open the build log" should bring the cover into view and focus its heading`);
    if (!r.returningOpensOnCover) fails.push(`${t}: a returning visitor should open on the cover`);
    if (!r.replayShowsCard) fails.push(`${t}: "See my card again" should scroll back to the card`);
    if (!r.tabIntoCoverVisible) fails.push(`${t}: tabbing from the card into the cover should show the focused link, not leave it under the card`);
  }
  if (reducedMotion.inkPrinted !== reducedMotion.inkLayers || reducedMotion.running > 0)
    fails.push(`reduced motion: ${reducedMotion.inkPrinted}/${reducedMotion.inkLayers} ink layers printed, ${reducedMotion.running} animations running`);

  const report = { url: "local", when: new Date().toISOString(), pass: fails.length === 0, fails, reducedMotion, riddle, card, results, cfResults };
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));

  console.log(`Design check: ${report.pass ? "PASS" : `FAIL (${fails.length})`}`);
  fails.forEach(f => console.log(`  ✗ ${f}`));
  for (const r of results) console.log(`  ${r.theme} @ ${r.width}px: ${r.screens.length} screens, contact sheet ${r.sheet}`);
  console.log(`  Centrefold open: ${cfResults.length} passes, screenshots .review${path.sep}<theme>-<width>-cf-{cover,contact,centrefold}.png`);
  console.log(`  report: ${path.relative(ROOT, path.join(OUT, "report.json"))}`);
  process.exit(report.pass ? 0 : 1);
})().catch(e => { console.error(e); server.close(); process.exit(2); });
