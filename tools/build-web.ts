// Bundles the browser client into one self-contained HTML file: dist/mythic-mayhem.html.
// Usage: node tools/build-web.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { build } from "esbuild";

const root = new URL("../", import.meta.url).pathname;
const result = await build({
  entryPoints: [`${root}web/main.ts`],
  bundle: true,
  format: "iife",
  target: "es2022",
  minify: true,
  write: false,
  legalComments: "none",
});
const js = result.outputFiles[0]!.text.replaceAll("</script", "<\\/script");
const html = readFileSync(`${root}web/index.html`, "utf8").replace("/*__BUNDLE__*/", () => js);
mkdirSync(`${root}dist`, { recursive: true });
writeFileSync(`${root}dist/mythic-mayhem.html`, html);
// Artifact version: the host adds doctype, html, head (charset, viewport) and body itself.
const fragment = html
  .replace(/<!doctype html>\s*/i, "")
  .replace(/<\/?html[^>]*>\s*/gi, "")
  .replace(/<\/?head>\s*/gi, "")
  .replace(/<meta charset[^>]*>\s*/i, "")
  .replace(/<meta name="viewport"[^>]*>\s*/i, "")
  .replace(/<\/?body>\s*/gi, "");
writeFileSync(`${root}dist/artifact.html`, fragment);
console.log(`dist/mythic-mayhem.html (${Math.round(html.length / 1024)} Ko), dist/artifact.html`);
