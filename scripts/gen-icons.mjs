// One-off: rasterize the branded Veloz SVG (public/veloz-icon.svg) into the PNG
// sizes iOS and Android need. iOS uses the apple-touch-icon PNG for the Home
// Screen (it ignores SVG manifest icons), so a branded PNG is required.
// Run: node scripts/gen-icons.mjs
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const svg = readFileSync("public/veloz-icon.svg", "utf8");

const targets = [
  ["public/apple-touch-icon.png", 180],
  ["public/logo192.png", 192],
  ["public/logo512.png", 512],
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const [out, size] of targets) {
  const html = `<!doctype html><html><head><style>
    *{margin:0;padding:0}
    html,body{width:${size}px;height:${size}px;overflow:hidden}
    svg{display:block;width:${size}px;height:${size}px}
  </style></head><body>${svg}</body></html>`;

  await page.setViewportSize({ width: size, height: size });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: size, height: size } });
  console.log("wrote", out, `${size}x${size}`);
}

await browser.close();
