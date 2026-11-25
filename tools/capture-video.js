// Renders a camera tour through the live 3D room and encodes it as a video, for prototype B (explore/fun-side).
// Usage: node tools/capture-video.js   (needs ffmpeg on the PATH)
// Writes back/proto/b-video/tour.mp4, poster.webp and tour.json.
const { chromium } = require("playwright");
const { spawn, execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "back/proto/b-video");
const PORT = 8798;
const FPS = 30;

(async () => {
  let tour;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "tour-"));
  const server = spawn(process.execPath, [path.join(__dirname, "serve.js"), ROOT, String(PORT)], { stdio: "ignore" });
  await new Promise(r => setTimeout(r, 600));
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
    page.on("pageerror", e => console.error("[page error]", e.message));
    await page.goto(`http://localhost:${PORT}/back/proto/b-video/capture.html`);
    await page.waitForSelector("body[data-ready]", { state: "attached", timeout: 180000 });
    tour = await page.evaluate(() => window.tour);
    console.log(`${tour.frames} frames, stops: ${tour.order.join(", ")}`);
    for (let i = 0; i < tour.frames; i++) {
      const url = await page.evaluate(i => window.frame(i), i);
      fs.writeFileSync(path.join(tmp, `f${String(i).padStart(4, "0")}.png`), Buffer.from(url.split(",")[1], "base64"));
      if (i % 20 === 0) console.log(`frame ${i}`);
    }
  } finally {
    await browser.close();
    server.kill();
  }

  fs.mkdirSync(OUT, { recursive: true });
  // Short keyframe interval so seeking (scrubbing) lands quickly in both directions.
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", path.join(tmp, "f%04d.png"),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "25", "-preset", "slow", "-g", "6", "-movflags", "+faststart", "-an",
    path.join(OUT, "tour.mp4")]);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", path.join(tmp, "f0000.png"), "-quality", "82", path.join(OUT, "poster.webp")]);
  fs.writeFileSync(path.join(OUT, "tour.json"), JSON.stringify({
    about: "Made by tools/capture-video.js from back/room.js. Stops are frame numbers; hotspots are boxes in % of the first frame.",
    fps: FPS, frames: tour.frames, video: "tour.mp4", poster: "poster.webp", order: tour.order, stops: tour.stopAt, hotspots: tour.hotspots,
  }, null, 1) + "\n");
  console.log(`tour.mp4  ${(fs.statSync(path.join(OUT, "tour.mp4")).size / 1024).toFixed(0)} KB`);
  fs.rmSync(tmp, { recursive: true, force: true });
})().catch(e => { console.error(e); process.exit(1); });
