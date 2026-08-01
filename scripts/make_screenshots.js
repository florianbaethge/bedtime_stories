#!/usr/bin/env node
/*
 * Regenerate the Bedtime Stories card screenshots in ../screenshots.
 *
 * Renders the "BTS Shots" demo dashboard headless (system Chrome via
 * puppeteer-core), authenticated with a Home Assistant long-lived access token,
 * and writes tight, 2x element screenshots of the card in a few configurations
 * plus the card editor dialog.
 *
 * Prerequisites:
 *   - A sandbox HA reachable at HA_URL with:
 *       * a Bedtime Stories config entry holding a "Fairy Tales" category with a
 *         handful of stories that have cover images, and
 *       * a storage dashboard at url_path "bts-shots" whose views ("grid",
 *         "stats", "list") each hold one custom:bedtime-stories-card pinned to
 *         that entry, configured to show different features (plain grid;
 *         grid with play statistics + sort chips; compact list with controls).
 *   - Google Chrome installed (override with CHROME_PATH).
 *   - npm i puppeteer-core
 *
 * Usage:
 *   HA_URL=http://localhost:8123 \
 *   HA_TOKEN=<long-lived-access-token> \
 *   node scripts/make_screenshots.js [outDir]
 */
const path = require("path");
const puppeteer = require("puppeteer-core");

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.HA_URL || "http://localhost:8123";
const TOKEN = process.env.HA_TOKEN;
const OUT = process.argv[2] || path.join(__dirname, "..", "screenshots");

if (!TOKEN) {
  console.error("Set HA_TOKEN (see header comment).");
  process.exit(1);
}

const walkSrc = `function* walk(root){const els=root.querySelectorAll('*');for(const e of els){yield e;if(e.shadowRoot)yield* walk(e.shadowRoot);}}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Bounding box (CSS px) of the bedtime-stories-card's ha-card. */
async function cardBox(page) {
  return page.evaluate((ws) => {
    eval(ws);
    for (const e of walk(document)) {
      const host = e.getRootNode && e.getRootNode().host;
      if (
        e.tagName === "HA-CARD" &&
        host &&
        host.tagName === "BEDTIME-STORIES-CARD"
      ) {
        const r = e.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      }
    }
    return null;
  }, walkSrc);
}

/** True once every tile's cover background image has finished decoding. */
async function coversReady(page) {
  return page.evaluate((ws) => {
    eval(ws);
    const urls = [];
    for (const e of walk(document)) {
      const cls = "" + (e.className || "");
      if (/\btile\b|\bnp-cover\b|\bthumb\b/.test(cls)) {
        const bg = getComputedStyle(e).backgroundImage;
        const m = bg && bg.match(/url\("?(.+?)"?\)/);
        if (m) urls.push(m[1]);
      }
    }
    if (!urls.length) return false;
    return Promise.all(
      urls.map(
        (u) =>
          new Promise((res) => {
            const img = new Image();
            img.onload = img.onerror = () => res(true);
            img.src = u;
          })
      )
    ).then(() => true);
  }, walkSrc);
}

async function shootCard(page, view, file) {
  await page.goto(`${BASE}/bts-shots/${view}`, { waitUntil: "networkidle0" });
  let box = null;
  for (let i = 0; i < 40 && !box; i++) {
    box = await cardBox(page);
    if (!box) await sleep(250);
  }
  if (!box) throw new Error(`card not found on view ${view}`);
  await coversReady(page);
  await sleep(500);
  box = await cardBox(page);
  await page.screenshot({
    path: path.join(OUT, file),
    clip: { x: box.x, y: box.y, width: box.width, height: box.height },
  });
  console.log("wrote", file);
}

/**
 * Capture the card configuration dialog (with its live preview). Best-effort:
 * the Lovelace edit flow is a little flaky headless, so a failure here only
 * logs and leaves the other screenshots intact.
 */
async function shootEditor(page, file) {
  // ?edit=1 drops the dashboard straight into edit mode (no menu clicks).
  await page.goto(`${BASE}/bts-shots/grid?edit=1`, { waitUntil: "networkidle0" });
  await sleep(1800);
  // Click the card footer's "Edit" (bottom-most on-screen) via .click() — a
  // synthetic mouse click gets swallowed by the card's edit overlay.
  const clicked = await page.evaluate((ws) => {
    eval(ws);
    const vh = window.innerHeight;
    let best = null;
    for (const e of walk(document)) {
      if (!/HA-BUTTON|MWC-BUTTON|BUTTON/.test(e.tagName)) continue;
      if ((e.textContent || "").trim().toLowerCase() !== "edit") continue;
      const r = e.getBoundingClientRect();
      if (!r.width || r.y < 0 || r.y > vh) continue;
      if (!best || r.y > best.y) best = { y: r.y, el: e };
    }
    if (!best) return false;
    best.el.click();
    return true;
  }, walkSrc);
  if (!clicked) throw new Error("card Edit button not found");
  let ok = false;
  for (let i = 0; i < 30 && !ok; i++) {
    await sleep(400);
    ok = await page.evaluate((ws) => {
      eval(ws);
      for (const e of walk(document))
        if (e.tagName === "BEDTIME-STORIES-CARD-EDITOR") return true;
      return false;
    }, walkSrc);
  }
  if (!ok) throw new Error("card editor did not mount");
  await sleep(800);
  // The edit-card dialog is a near-fullscreen panel with small margins.
  await page.screenshot({
    path: path.join(OUT, file),
    clip: { x: 36, y: 42, width: 1028, height: 1350 },
  });
  console.log("wrote", file);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--hide-scrollbars"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 940, height: 1100, deviceScaleFactor: 2 });
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    (base, token) => {
      localStorage.setItem(
        "hassTokens",
        JSON.stringify({
          access_token: token,
          token_type: "Bearer",
          expires_in: 315360000,
          hassUrl: base,
          clientId: null,
          expires: 4102444800000,
          refresh_token: null,
        })
      );
      localStorage.setItem("dockedSidebar", '"always_hidden"');
      localStorage.setItem("selectedLanguage", '"en"');
    },
    BASE,
    TOKEN
  );

  await page.setViewport({ width: 940, height: 1100, deviceScaleFactor: 2 });
  await shootCard(page, "grid", "card_grid.png");
  await shootCard(page, "stats", "card_stats.png");
  await shootCard(page, "list", "card_list.png");

  // The dialog is captured at a taller viewport with a fixed clip.
  await page.setViewport({ width: 1100, height: 1400, deviceScaleFactor: 2 });
  try {
    await shootEditor(page, "card_editor.png");
  } catch (e) {
    console.warn("editor screenshot skipped:", e.message);
  }

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
