#!/usr/bin/env node
// Design-review checker for this static site.
// Serves the repo, opens every theme × width in Chromium, and records:
//   - screenshots (first screen + every screen down the page)
//   - horizontal overflow, console/page errors
//   - axe-core WCAG 2.1 AA violations
//   - token contrast (text ≥ 4.5:1, focus ≥ 3:1) per theme
//   - touch targets under 44px at phone widths
//   - the same checks again with the hidden basement (B1) open
//   - the riddle: wrong guesses keep B1 shut, "panda" opens it, a reload keeps it open
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
  ["--text", "--bg", 4.5], ["--body", "--bg", 4.5], ["--muted", "--bg", 4.5], ["--muted", "--bg-deep", 4.5],
  ["--accent-text", "--bg", 4.5], ["--code-c", "--bg-deep", 4.5], ["--placeholder", "--bg-deep", 4.5],
  ["--focus", "--bg", 3], ["--focus", "--facade", 3],
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
      .filter(el => !el.closest(".storey"))              // floors: equivalent links exist in the Files menu
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
  const browser = await chromium.launch();
  const results = [];
  const b1Results = [];

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
    // (request log, cat flick, timeline) runs to its final state before screenshots.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const vh = page.viewportSize().height;
    for (let y = 0; y < height; y += vh / 2) {
      await page.evaluate(top => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(4500);

    // Screens: scroll one viewport at a time so fixed UI renders as a visitor sees it.
    const screens = [];
    for (let i = 0, y = 0; y < height && i < MAX_SCREENS; i++, y += vh) {
      await page.evaluate(top => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(300);                      // timeline fill follows scroll position
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

    // Same theme and width with the basement already open (as on a return visit).
    const b1Page = await browser.newPage({
      viewport: { width, height: phone ? 844 : 800 },
      deviceScaleFactor: phone ? 2 : 1,
      colorScheme: theme === "light" ? "light" : "dark",
    });
    const b1Errors = [];
    b1Page.on("pageerror", e => b1Errors.push(e.message));
    b1Page.on("console", m => { if (m.type() === "error") b1Errors.push(m.text()); });
    await b1Page.addInitScript(() => { try { localStorage.setItem("b1", "open"); } catch (e) {} });
    await b1Page.goto(url, { waitUntil: "networkidle" });
    await b1Page.waitForTimeout(2500);
    const b1Screens = [];
    for (const [name, sel] of [["hero", "#top"], ["fun", "#fun"], ["basement", "#b1"]]) {
      await b1Page.evaluate(s => document.querySelector(s).scrollIntoView({ behavior: "instant", block: "start" }), sel);
      await b1Page.waitForTimeout(700);
      const file = path.join(OUT, `${tag}-b1-${name}.png`);
      await b1Page.screenshot({ path: file });
      b1Screens.push(path.relative(ROOT, file));
    }
    await b1Page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const b1Visible = await b1Page.evaluate(() => !document.getElementById("b1").hidden && !!document.querySelector(".storey--b1")?.getBoundingClientRect().width);
    b1Results.push({ theme, width, screens: b1Screens, errors: b1Errors, visible: b1Visible, ...(await audit(b1Page, phone)) });
    await b1Page.close();
  }

  // The riddle itself: wrong guesses keep the basement shut, the right one opens it for good.
  const rp = await browser.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: "dark" });
  await rp.goto(url, { waitUntil: "networkidle" });
  const b1Shown = () => rp.evaluate(() => !document.getElementById("b1").hidden);
  const tryGuess = async word => { await rp.fill("#guess", word); await rp.click(".riddle__btn"); await rp.waitForTimeout(200); };
  const riddle = { hiddenAtStart: !(await b1Shown()) };
  await tryGuess("cat");
  riddle.hintAfterWrong = await rp.textContent(".riddle__status");
  riddle.hiddenAfterWrong = !(await b1Shown());
  await tryGuess(" Panda ");
  riddle.openAfterRight = await b1Shown();
  riddle.floorLinkShown = await rp.evaluate(() => !!document.querySelector(".storey--b1")?.getBoundingClientRect().width);
  await rp.reload({ waitUntil: "networkidle" });
  riddle.openAfterReload = await b1Shown();
  await rp.close();

  // Reduced motion: windows must be in their final state immediately, with nothing animating.
  const rm = await browser.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: "dark", reducedMotion: "reduce" });
  await rm.goto(url, { waitUntil: "networkidle" });
  await rm.waitForTimeout(300);
  const reducedMotion = await rm.evaluate(() => ({
    windowsLit: document.querySelectorAll(".storey__win.is-on").length,
    windowsTotal: document.querySelectorAll(".storey__win").length,
    running: document.getAnimations().filter(a => a.playState === "running").length,
  }));
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
  for (const r of b1Results) {
    const t = `${r.theme} @ ${r.width}px, B1 open`;
    if (!r.visible) fails.push(`${t}: the basement is not shown`);
    if (r.overflow > 0) fails.push(`${t}: horizontal overflow ${r.overflow}px`);
    r.errors.forEach(e => fails.push(`${t}: JS error: ${e}`));
    r.axe.forEach(v => fails.push(`${t}: axe ${v.impact} ${v.id} (${v.help}) at ${v.targets.join(", ")}`));
    r.smallTargets.forEach(s => fails.push(`${t}: touch target "${s.name}" is ${s.w}×${s.h}px (needs 44×44)`));
  }
  if (!riddle.hiddenAtStart) fails.push("riddle: the basement is visible before the riddle is solved");
  if (!riddle.hiddenAfterWrong || !riddle.hintAfterWrong) fails.push("riddle: a wrong guess should show a hint and keep the basement shut");
  if (!riddle.openAfterRight || !riddle.floorLinkShown) fails.push('riddle: "panda" should open the basement and add its floor to the building');
  if (!riddle.openAfterReload) fails.push("riddle: the basement should stay open after a reload");
  if (reducedMotion.windowsLit !== reducedMotion.windowsTotal || reducedMotion.running > 0)
    fails.push(`reduced motion: ${reducedMotion.windowsLit}/${reducedMotion.windowsTotal} windows lit, ${reducedMotion.running} animations running`);

  const report = { url: "local", when: new Date().toISOString(), pass: fails.length === 0, fails, reducedMotion, riddle, results, b1Results };
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));

  console.log(`Design check: ${report.pass ? "PASS" : `FAIL (${fails.length})`}`);
  fails.forEach(f => console.log(`  ✗ ${f}`));
  for (const r of results) console.log(`  ${r.theme} @ ${r.width}px: ${r.screens.length} screens, contact sheet ${r.sheet}`);
  console.log(`  B1 open: ${b1Results.length} passes, screenshots .review${path.sep}<theme>-<width>-b1-{hero,fun,basement}.png`);
  console.log(`  report: ${path.relative(ROOT, path.join(OUT, "report.json"))}`);
  process.exit(report.pass ? 0 : 1);
})().catch(e => { console.error(e); server.close(); process.exit(2); });
