// Focused re-capture of the location detail sheet for both tenants,
// after the map-dashboard stacking-context fix.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3000";
const PASSWORD = "AtlasDemo2026!";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "screenshots", "phase-g");

async function login(page, email) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', PASSWORD);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20000 }),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForLoadState("networkidle");
}

async function capture(browser, prefix, email) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await login(page, email);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  // Click the pin with the highest count (HQ for TAV; HQ for Turkcell).
  const pins = page.locator(".atlas-pin-body");
  const n = await pins.count();
  let bestIdx = 0;
  let bestCount = -1;
  for (let i = 0; i < n; i++) {
    const txt = await pins.nth(i).innerText();
    const m = txt.match(/(\d+)/);
    const c = m ? parseInt(m[1]) : 0;
    if (c > bestCount) { bestCount = c; bestIdx = i; }
  }
  // Pins can overlap in dense regions; force-click bypasses the pointer-events
  // interception check (this is only a screenshot harness, not a UX assertion).
  await pins.nth(bestIdx).click({ force: true });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: join(OUT, `${prefix}-location-sheet.png`) });
  console.log(`  ✓ ${prefix}-location-sheet.png (pin count ${bestCount})`);
  await ctx.close();
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  await capture(browser, "tav", "tav.manager@demo.com");
  await capture(browser, "turkcell", "turkcell.manager@demo.com");
  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
