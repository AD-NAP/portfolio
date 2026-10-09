#!/usr/bin/env node
// Stop hook: when Claude is about to finish a turn, run the design-review checker
// if any site file changed since the last passing check. On failure, block the stop
// and hand the failures back to Claude so it fixes them before saying it's done.
//
// - Skips instantly when the site files are unchanged since the last PASS.
// - Gives up blocking after MAX_BLOCKS consecutive failures (warns the user instead),
//   so an unfixable problem can't trap Claude in a loop.

const { spawnSync } = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ROOT = process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, "../..");
// Kept outside .review/, which the checker clears on every run.
const STATE_DIR = path.join(ROOT, ".claude", "hooks", ".state");
const PASS_FILE = path.join(STATE_DIR, ".last-pass");
const BLOCKS_FILE = path.join(STATE_DIR, ".stop-blocks");
const MAX_BLOCKS = 3;
const SITE_FILES = ["index.html", "assets"];

const out = obj => { process.stdout.write(JSON.stringify(obj)); process.exit(0); };
const read = f => { try { return fs.readFileSync(f, "utf8").trim(); } catch { return ""; } };

// Fingerprint of everything that ships to visitors.
const files = SITE_FILES.flatMap(p => {
  const full = path.join(ROOT, p);
  if (!fs.existsSync(full)) return [];
  return fs.statSync(full).isDirectory()
    ? fs.readdirSync(full, { recursive: true }).map(f => path.join(full, f)).filter(f => fs.statSync(f).isFile())
    : [full];
}).sort();
const hash = crypto.createHash("sha256");
files.forEach(f => hash.update(path.relative(ROOT, f)).update(fs.readFileSync(f)));
const fingerprint = hash.digest("hex");

if (read(PASS_FILE) === fingerprint) process.exit(0);          // nothing changed since last pass

fs.mkdirSync(STATE_DIR, { recursive: true });
if (!fs.existsSync(path.join(ROOT, "node_modules", "axe-core"))) {
  spawnSync("npm", ["install", "--silent", "--no-audit", "--no-fund"], { cwd: ROOT, stdio: "ignore" });
}

const run = spawnSync("node", [path.join(ROOT, ".claude/skills/design-review/scripts/check.js")], { cwd: ROOT, encoding: "utf8" });
const report = `${run.stdout || ""}${run.stderr || ""}`.trim();

if (run.status === 0) {
  fs.writeFileSync(PASS_FILE, fingerprint);
  fs.rmSync(BLOCKS_FILE, { force: true });
  out({ systemMessage: "Design check passed (both themes, 390px and 1280px)." });
}

const blocks = Number(read(BLOCKS_FILE) || 0) + 1;
if (blocks > MAX_BLOCKS) {
  fs.rmSync(BLOCKS_FILE, { force: true });
  out({ systemMessage: `Design check still failing after ${MAX_BLOCKS} attempts; not blocking again. Run \`npm run -s check\` to see the failures.\n${report}` });
}
fs.writeFileSync(BLOCKS_FILE, String(blocks));
out({
  decision: "block",
  reason: `The design check failed after your site changes (attempt ${blocks} of ${MAX_BLOCKS}). Fix these before finishing, following the design-review skill, then stop again to re-check:\n${report}`,
});
