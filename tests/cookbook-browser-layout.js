async (page) => {
  const assert = (value, text) => {
    if (!value) throw new Error(text);
  };
  const origin = new URL(page.url()).origin;
  const base = "/AD_note";
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${origin}${base}/cookbook`);
  await page.reload();
  assert((await page.locator(".protocol-card").count()) === 32, "32 cards");
  assert(
    (await page.locator(".protocol-player[data-frames]").count()) === 0,
    "Rules load only on opening",
  );
  assert(
    (await page.locator(".complexity-section .katex").count()) === 6,
    "six formulas render",
  );
  assert((await page.locator(".katex-error").count()) === 0, "no math errors");
  assert(
    (await page.locator(".optional-card .protocol-player").count()) === 0,
    "optional protocols have no simulation",
  );
  const pdf = await page.request.get(`${origin}${base}/cookbook.pdf`);
  assert(pdf.ok(), "PDF accessible with base");
  assert(pdf.headers()["content-type"].includes("application/pdf"), "PDF type");
  assert(
    (await pdf.body()).subarray(0, 4).toString() === "%PDF",
    "original PDF bytes",
  );
  await page.screenshot({
    path: "output/playwright/cookbook/desktop-index.png",
  });
  await page.goto(`${origin}${base}/cookbook#all-the-way`);
  const card = page.locator("#all-the-way");
  const host = card.locator(".protocol-player");
  await host.waitFor({ state: "visible" });
  assert((await card.getAttribute("open")) !== null, "deep link opens card");
  await page.waitForFunction(
    () =>
      !!document.querySelector("#all-the-way .protocol-player")?.dataset.frames,
  );
  await host.locator("[data-step]").click();
  assert(
    (await host.locator("[data-network] .message-dot").count()) === 5,
    "five simultaneous ID tokens",
  );
  await host.screenshot({
    path: "output/playwright/cookbook/desktop-all-the-way.png",
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await host.locator("[data-reset]").click();
  await host.locator("[data-step]").click();
  assert(
    (await host.locator("animate").count()) === 0,
    "reduced motion has no SVG animation",
  );
  await host.locator("[data-play]").click();
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await page.waitForTimeout(150);
  assert(
    (await host.locator("[data-play]").textContent()) === "Avvia",
    "offscreen pauses",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}${base}/cookbook`);
  await page.reload();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  assert(!overflow, "mobile page has no horizontal overflow");
  assert(
    await page.getByRole("link", { name: "Cookbook", exact: true }).isVisible(),
    "mobile Cookbook navigation visible",
  );
  await page.screenshot({
    path: "output/playwright/cookbook/mobile-index.png",
  });
  const summary = page.locator("#all-the-way > summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  assert(
    (await page.locator("#all-the-way").getAttribute("open")) !== null,
    "summary opens with keyboard",
  );
  await page.locator("#all-the-way [data-step]").focus();
  await page.keyboard.press("Space");
  assert(
    (await page
      .locator("#all-the-way [data-network]")
      .getAttribute("viewBox")) === "120 0 360 360",
    "mobile graph fits compact view",
  );
  assert(
    await page
      .locator("#all-the-way .network-scroll")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
    "mobile graph needs no horizontal scrolling",
  );
  await page
    .locator("#all-the-way .protocol-player")
    .screenshot({ path: "output/playwright/cookbook/mobile-all-the-way.png" });
  assert(
    !(await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    )),
    "open player does not overflow page",
  );
  await page.goto(`${origin}${base}/`);
  await page.getByRole("link", { name: "Cookbook", exact: true }).click();
  assert(
    page.url().includes(`${base}/cookbook`),
    "main navigation respects base",
  );
  return {
    desktop: true,
    mobile: true,
    keyboard: true,
    reducedMotion: true,
    offscreenPause: true,
    lazy: true,
    deepLinks: true,
    pdf: true,
    base: true,
    formulas: 6,
  };
}
