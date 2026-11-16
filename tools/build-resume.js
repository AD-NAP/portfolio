// Builds the one-page resume PDF from the vault master CV (phone number removed).
const fs = require("fs"), path = require("path");
const { chromium } = require(path.resolve("node_modules/playwright"));
const [src, out] = process.argv.slice(2);
const md = fs.readFileSync(src, "utf8").replace(/\r\n/g, "\n").split("\n---\n")[1]
  .replace(/\[([^\]]+)\]\(https?:[^)]+\)/g, "$1");   // [text](url) -> text; linkify adds the link back
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const linkify = s => s.replace(/(github\.com\/[\w\/-]+|linkedin\.com\/in\/[\w-]+)/g, m => `<a href="https://${m}">${m}</a>`)
                     .replace(/([\w.]+@[\w.]+\.\w+)/, m => `<a href="mailto:${m}">${m}</a>`);
let html = "", inList = false;
const closeList = () => { if (inList) { html += "</ul>"; inList = false; } };
for (const sec of md.split(/\n## /).slice(1)) {
  const [title, ...lines] = sec.split("\n");
  if (title === "Contact") {
    const [name, contact] = lines.filter(Boolean);
    const clean = contact.split(" | ").filter(p => !/\+\d|\d{4} \d{4}/.test(p)).join(" | ");
    if (clean === contact) throw new Error("phone number not found to remove");
    html += `<h1>${esc(name)}</h1><p class="contact">${linkify(esc(clean))}</p>`;
    continue;
  }
  html += `<h2>${esc(title)}</h2>`;
  let sawItem = false;
  for (const line of lines) {
    if (line.startsWith("### ")) {
      closeList(); sawItem = true;
      let t = line.slice(4), link = "";
      const bar = t.indexOf(" | "); if (bar > -1) { link = t.slice(bar + 3); t = t.slice(0, bar); }
      const m = t.match(/^(.*) \(([^)]*)\)$/);
      const left = esc(m ? m[1] : t) + (link ? ` <span class="link">| ${linkify(esc(link))}</span>` : "");
      html += `<div class="item"><span class="what">${left}</span><span class="when">${m ? esc(m[2]) : ""}</span></div>`;
    } else if (line.startsWith("- ")) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${esc(line.slice(2))}</li>`;
    } else if (line.trim() && !sawItem) {
      closeList(); html += `<p>${esc(line)}</p>`;   // e.g. the summary; notes under ### are skipped
    }
  }
  closeList();
}
const page = `<!doctype html><meta charset="utf-8"><style>
@page { size: A4; margin: 11mm 14mm; }
body { font-family: Calibri, Carlito, "Segoe UI", sans-serif; font-size: 10pt; line-height: 1.23; color: #000; margin: 0; }
h1 { text-align: center; font-size: 19pt; margin: 0 0 2px; }
.contact { text-align: center; margin: 0 0 8px; }
a { color: inherit; }
h2 { font-size: 10.6pt; text-transform: uppercase; letter-spacing: .03em; margin: 8px 0 3px; padding-bottom: 1px; border-bottom: 1.2px solid #000; }
p { margin: 0 0 2px; }
.item { display: flex; justify-content: space-between; gap: 12px; font-weight: 700; margin-top: 4px; }
.item .when { font-weight: 400; white-space: nowrap; }
.item .link { font-weight: 400; white-space: nowrap; }
ul { margin: 1px 0 0; padding-left: 16px; }
li { margin: 0 0 1px; }
</style>${html}`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setContent(page);
  await p.pdf({ path: out, format: "A4", preferCSSPageSize: true });
  console.log("wrote", out);
  await b.close();
})();
