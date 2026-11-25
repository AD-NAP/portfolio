// Bakes the live 3D room into flat surfaces and cut-outs for prototype C, the CSS 3D room (explore/fun-side).
// Usage: node tools/capture-css3d.js
// Writes back/proto/c-css3d/img/*.webp and back/proto/c-css3d/room.json.
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "back/proto/c-css3d");
const PORT = 8797;

(async () => {
  const server = spawn(process.execPath, [path.join(__dirname, "serve.js"), ROOT, String(PORT)], { stdio: "ignore" });
  await new Promise(r => setTimeout(r, 600));
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    page.on("pageerror", e => console.error("[page error]", e.message));
    await page.goto(`http://localhost:${PORT}/back/proto/c-css3d/capture.html`);
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
    const plane = (prefix, { data, ...p }) => ({ ...p, src: save(`${prefix}-${p.name}`, data) });
    const room = {
      about: "Made by tools/capture-css3d.js from back/room.js. Metres, room axes (y up). Each plane: centre, right and up directions, width and height.",
      room: out.room, home: out.home,
      poster: save("poster", out.poster),
      surfaces: out.surfaces.map(s => plane("surface", s)),
      sprites: out.sprites.map(s => plane("thing", s)),
      exit: out.exit,
    };
    fs.writeFileSync(path.join(OUT, "room.json"), JSON.stringify(room, null, 1) + "\n");
    console.log("room.json written");
  } finally {
    await browser.close();
    server.kill();
  }
})().catch(e => { console.error(e); process.exit(1); });
