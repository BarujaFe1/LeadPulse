import { chromium } from "playwright";
import fs from "node:fs";

const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.env.LEADPULSE_URL || "https://leadpulse-two.vercel.app", {
  waitUntil: "networkidle",
});
await p.waitForSelector(".kpi-grid");
const heading = p.locator("#weekly-title");
const panel = heading.locator("xpath=ancestor::*[contains(@class,'panel')][1]");
await panel.scrollIntoViewIfNeeded();
await p.waitForTimeout(400);
await panel.screenshot({ path: "assets/screenshots/08-weekly-report.png" });
console.log("weekly", fs.statSync("assets/screenshots/08-weekly-report.png").size);
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(200);
await p.screenshot({
  path: "assets/social-preview.png",
  clip: { x: 0, y: 0, width: 1280, height: 640 },
});
console.log("social", fs.statSync("assets/social-preview.png").size);
await b.close();
