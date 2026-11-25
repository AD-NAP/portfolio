// Tiny static server for previewing the portfolio: node serve.js <root> <port>
const http = require("http"), fs = require("fs"), path = require("path");
const root = path.resolve(process.argv[2]), port = +process.argv[3] || 8765;
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".webp": "image/webp", ".gltf": "model/gltf+json", ".bin": "application/octet-stream", ".glb": "model/gltf-binary", ".woff2": "font/woff2", ".pdf": "application/pdf" };
http.createServer((req, res) => {
  let p = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!p.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); return res.end("not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(data);
  });
}).listen(port, () => console.log(`serving ${root} on http://localhost:${port}`));
