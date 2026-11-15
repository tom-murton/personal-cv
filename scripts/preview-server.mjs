#!/usr/bin/env node
/*
 * Serves dist/ the way Vercel does for this project: vercel.json redirects first (query strings kept),
 * then the file system, then rewrites, then the real 404 page with a 404 status. `vite preview` does
 * none of that, so use this to check redirects and routes locally.
 *
 *   node scripts/preview-server.mjs [port]      (default 4609)
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "dist");
const config = JSON.parse(await readFile(join(process.cwd(), "vercel.json"), "utf8"));
const port = Number(process.argv[2] || process.env.PORT || 4609);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".ttf": "font/ttf", ".ico": "image/x-icon" };

/* A Vercel source pattern: ":name" captures one segment, "(.*)" captures the rest. */
function compile(source) {
  const names = [];
  const re = source.split(/(\(\.\*\)|:[A-Za-z]+)/).map((part) => {
    if (part === "(.*)") { names.push(String(names.length + 1)); return "(.*)"; }
    if (/^:[A-Za-z]+$/.test(part)) { names.push(part.slice(1)); return "([^/]+)"; }
    return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("");
  return { re: new RegExp(`^${re}$`), names };
}
function apply(rule, path) {
  const { re, names } = rule.compiled ??= compile(rule.source);
  const m = re.exec(path); if (!m) return null;
  let dest = rule.destination;
  names.forEach((n, i) => { dest = dest.replace(new RegExp(`:${n}\\b|\\$${i + 1}`, "g"), m[i + 1]); });
  return dest;
}
async function file(path) {
  const full = normalize(join(root, decodeURIComponent(path)));
  if (!full.startsWith(root)) return null;
  try { const s = await stat(full); if (s.isFile()) return full; if (s.isDirectory()) { const idx = join(full, "index.html"); if ((await stat(idx).catch(() => null))?.isFile()) return idx; } } catch { /* not found */ }
  return null;
}
function headersFor(path) {
  const out = {};
  for (const h of config.headers ?? []) if (compile(h.source).re.test(path)) for (const { key, value } of h.headers) out[key] = value;
  return out;
}

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  let path = url.pathname;
  for (const rule of config.redirects ?? []) {
    const dest = apply(rule, path) ?? (path.length > 1 && path.endsWith("/") ? apply(rule, path.slice(0, -1)) : null);
    if (dest) {
      const target = new URL(dest, "http://localhost");
      for (const [k, v] of url.searchParams) if (!target.searchParams.has(k)) target.searchParams.append(k, v);
      const location = /^https?:/.test(dest) ? target.toString() : target.pathname + target.search + target.hash;
      res.writeHead(rule.permanent ? 308 : 307, { location }); res.end(); return;
    }
  }
  let found = path.endsWith("/") && path.length > 1 ? null : await file(path);
  if (!found) {
    const bare = path.length > 1 ? path.replace(/\/$/, "") : path;
    for (const rule of config.rewrites ?? []) { const dest = apply(rule, bare); if (dest) { found = await file(dest); if (found) break; } }
    if (!found) found = await file(path);
  }
  const status = found ? 200 : 404;
  found ??= join(root, "404.html");
  const body = await readFile(found);
  res.writeHead(status, { "content-type": types[extname(found)] ?? "application/octet-stream", "cache-control": "no-cache", ...headersFor(path) });
  res.end(req.method === "HEAD" ? undefined : body);
}).listen(port, () => console.log(`Preview of dist/ with vercel.json rules on http://localhost:${port}`));
