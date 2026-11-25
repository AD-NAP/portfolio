// Renders the live 3D room once, in depth layers, for the diorama prototype (explore/fun-side).
// Usage: node tools/capture-diorama.js
// Writes back/proto/a-diorama/img/*.webp and back/proto/a-diorama/scene.json.
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "back/proto/a-diorama");
const PORT = 8799;

(async () => {
  const server = spawn(process.execPath, [path.join(__dirname, "serve.js"), ROOT, String(PORT)], { stdio: "ignore" });
  await new Promise(r => setTimeout(r, 600));
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  try {
    // 1872 x 1170 CSS px is 1.3 x the 1440 x 900 view; at 1.5x that is a 2808 x 1755 picture per layer.
    const page = await browser.newPage({ viewport: { width: 1872, height: 1170 }, deviceScaleFactor: 1.5 });
    page.on("console", m => console.log("[page]", m.text()));
    page.on("pageerror", e => console.error("[page error]", e.message));
    await page.goto(`http://localhost:${PORT}/back/proto/a-diorama/capture.html`);
    await page.waitForSelector("body[data-ready]", { state: "attached", timeout: 180000 });
    const out = await page.evaluate(() => window.capture());

    fs.mkdirSync(path.join(OUT, "img"), { recursive: true });
    const save = (name, dataUrl) => {
      const file = `img/${name}.webp`;
      const buf = Buffer.from(dataUrl.split(",")[1], "base64");
      fs.writeFileSync(path.join(OUT, file), buf);
      console.log(`${file}  ${(buf.length / 1024).toFixed(0)} KB`);
      return file;
    };
    const scene = {
      about: "Made by tools/capture-diorama.js from back/room.js. Depth is metres from where you stand; hotspots are % of the picture.",
      overscan: out.overscan,
      layers: out.layers.map(l => ({ name: l.name, depth: l.depth, src: save(`layer-${l.name}`, l.data) })),
      poster: save("poster", out.poster),
      beauty: save("beauty", out.beauty),
      closeups: Object.fromEntries(Object.entries(out.closeups).map(([n, d]) => [n, save(`closeup-${n}`, d)])),
      hotspots: out.hotspots,
    };
    fs.writeFileSync(path.join(OUT, "scene.json"), JSON.stringify(scene, null, 1) + "\n");
    console.log("scene.json written");
  } finally {
    await browser.close();
    server.kill();
  }
})().catch(e => { console.error(e); process.exit(1); });
