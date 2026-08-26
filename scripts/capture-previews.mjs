import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "projects");

const sites = [
  { id: "realm", url: "https://therealm.in" },
  { id: "climaty", url: "https://climaty.ai" },
  { id: "kai", url: "https://kai.ken42.com" },
  { id: "auditee", url: "https://auditee.ai" },
  { id: "finnulate", url: "https://finnulate.ai" },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});

for (const site of sites) {
  const page = await context.newPage();
  const dest = path.join(outDir, `${site.id}.jpg`);
  try {
    console.log(`Capturing ${site.url}...`);
    await page.goto(site.url, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForTimeout(3500);
    await page.screenshot({
      path: dest,
      type: "jpeg",
      quality: 82,
      fullPage: false,
    });
    console.log(`Saved ${dest}`);
  } catch (err) {
    console.error(`Failed ${site.id}:`, err.message);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log("Done.");
