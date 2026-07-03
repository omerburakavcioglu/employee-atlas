// Phase G visual QA — Playwright screenshot pass (Chromium only).
// Logs in through the real UI for each tenant and captures each page.
// Usage: node scripts/phase-g-screenshots.mjs [baseURL]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3000";
const PASSWORD = "AtlasDemo2026!";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "screenshots", "phase-g");

const VIEWPORT = { width: 1440, height: 900 };

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

async function shot(page, name) {
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: false });
  console.log(`  ✓ ${name}.png`);
}

async function captureTenant(browser, prefix, email) {
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  console.log(`\n[${prefix}] logging in as ${email}`);
  await login(page, email);

  // Map dashboard (home) — let Leaflet tiles settle.
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await shot(page, `${prefix}-map`);

  // Open a location pin's detail sheet if a pin is present.
  try {
    const pin = page.locator(".atlas-pin-body").first();
    await pin.click({ timeout: 4000 });
    await page.waitForTimeout(1500);
    await shot(page, `${prefix}-location-sheet`);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  } catch {
    console.log(`  (no map pin clickable for ${prefix})`);
  }

  // Directory (cards view).
  await page.goto(`${BASE}/directory`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await shot(page, `${prefix}-directory`);

  // Directory with an active filter, to capture filter chips.
  await page.goto(`${BASE}/directory?minYears=3`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot(page, `${prefix}-directory-filtered`);

  // First employee profile from the directory.
  await page.goto(`${BASE}/directory`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const firstProfile = page.locator('a[href^="/employees/"]').first();
  const href = await firstProfile.getAttribute("href");
  if (href) {
    await page.goto(`${BASE}${href}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await shot(page, `${prefix}-profile`);
  }

  // Analytics.
  await page.goto(`${BASE}/analytics`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await shot(page, `${prefix}-analytics`);

  // Shortlists list.
  await page.goto(`${BASE}/shortlists`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot(page, `${prefix}-shortlists`);

  // Narrow-width directory to catch responsive overflow.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/directory`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot(page, `${prefix}-directory-mobile`);

  await ctx.close();
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  // Neutral login page (no tenant).
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await shot(page, "login");
  await ctx.close();

  await captureTenant(browser, "tav", "tav.manager@demo.com");
  await captureTenant(browser, "turkcell", "turkcell.manager@demo.com");

  await browser.close();
  console.log(`\nAll screenshots saved to ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
