/**
 * Capture differentiated portfolio screenshots from the live LeadPulse demo.
 * Usage: node scripts/capture_screenshots.mjs
 */
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "assets", "screenshots");
const url = process.env.LEADPULSE_URL || "https://leadpulse-two.vercel.app";

fs.mkdirSync(outDir, { recursive: true });

async function shotPanel(page, file, headingSelector) {
  const target = path.join(outDir, file);
  const heading = page.locator(headingSelector).first();
  await heading.waitFor({ state: "visible", timeout: 20000 });
  const panel = heading.locator("xpath=ancestor::*[contains(@class,'panel')][1]");
  await panel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await panel.screenshot({ path: target });
  console.log("wrote", file, fs.statSync(target).size);
}

async function shotViewport(page, file) {
  const target = path.join(outDir, file);
  await page.screenshot({ path: target, fullPage: false });
  console.log("wrote", file, fs.statSync(target).size);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForSelector(".kpi-grid", { timeout: 30000 });
await page.waitForTimeout(1000);

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(250);
await shotViewport(page, "03-response-dashboard.png");
await page.screenshot({
  path: path.join(root, "assets", "hero-cover.png"),
  fullPage: false,
});
console.log("wrote hero-cover.png", fs.statSync(path.join(root, "assets", "hero-cover.png")).size);

await shotPanel(page, "01-followup-radar.png", "#followup-title");
await shotPanel(page, "04-simple-funnel.png", "#funnel-title");
await shotPanel(page, "02-leads-inbox.png", "#risk-title");
await shotPanel(page, "06-lost-reasons.png", "#lost-title");
await shotPanel(page, "07-return-calendar.png", "#followup-title");
await shotPanel(page, "08-weekly-report.png", "#weekly-title");

const btn = page.getByRole("button", { name: /Priorizar mensagem/i });
await btn.click();
await page.waitForTimeout(1000);
await shotPanel(page, "05-opportunity-score.png", "#classify-title");

// Also capture methodology as social-friendly panel shot into weekly duplicate? keep weekly as report.
await shotPanel(page, "08-weekly-report.png", "#scoring-title");

await browser.close();
