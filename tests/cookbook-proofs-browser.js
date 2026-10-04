async (page) => {
  const assert = (value, message) => {
    if (!value) throw new Error(message);
  };
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const origin = new URL(page.url()).origin;
  const base = "/AD_note";
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${origin}${base}/cookbook-complessita`);
  assert(
    (await page.locator(".class-schema").count()) === 4,
    "four class schemas",
  );
  assert((await page.locator(".proof-card").count()) === 15, "15 proof cards");
  assert((await page.locator(".proof-player").count()) === 8, "eight examples");
  assert((await page.locator(".katex-error").count()) === 0, "maths render");
  await page.screenshot({
    path: "output/playwright/cookbook-proofs/desktop.png",
  });
  let frames = 0;
  const ids = await page
    .locator(".proof-card")
    .evaluateAll((cards) => cards.map((card) => card.id));
  for (const id of ids) {
    await page.goto(`${origin}${base}/cookbook-complessita#${id}`);
    const card = page.locator(`#${id}`);
    assert((await card.getAttribute("open")) !== null, `deep link opens ${id}`);
    for (let number = 1; number <= 6; number++)
      assert(
        (await card.locator("h3").allTextContents()).some((t) =>
          t.startsWith(`${number}.`),
        ),
        `card ${id}: section ${number}`,
      );
    const player = card.locator(".proof-player");
    if (await player.count()) {
      const options = player.locator("[data-scenario] option");
      const scenarioCount = (await options.count()) || 1;
      for (let s = 0; s < scenarioCount; s++) {
        if (scenarioCount > 1)
          await player.locator("[data-scenario]").selectOption(String(s));
        else await player.locator("[data-reset]").click();
        let guard = 0;
        while (true) {
          frames++;
          assert(
            (await player.locator("[data-frame-title]").textContent()).length >
              0,
            "frame title",
          );
          assert(
            (await player.locator("svg circle").count()) > 0,
            "graph drawn",
          );
          assert(
            (await player.locator("[data-frame-formula] .katex").count()) === 1,
            "frame formula rendered",
          );
          if (await player.locator("[data-next]").isDisabled()) break;
          await player.locator("[data-next]").click();
          assert(++guard < 10, "finite playback");
        }
        await player.locator("[data-reset]").click();
        assert(
          (await player.locator("[data-progress]").textContent()).startsWith(
            "1 /",
          ),
          "reset",
        );
      }
    }
  }
  assert(frames === 37, "all 37 frames checked");
  await page.goto(`${origin}${base}/cookbook-complessita#christofides-prova`);
  const christ = page.locator("#christofides-prova .proof-player");
  await christ.locator("[data-next]").click();
  await christ.locator("[data-next]").click();
  await christ.screenshot({
    path: "output/playwright/cookbook-proofs/christofides.png",
  });
  await christ.locator("[data-reset]").click();
  await christ.locator("[data-play]").click();
  assert(
    (await christ.locator("[data-play]").textContent()) === "Pausa",
    "playback starts",
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  assert(
    (await christ.locator("[data-play]").textContent()) === "Avvia",
    "offscreen playback pauses",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await christ.scrollIntoViewIfNeeded();
  assert(
    await christ.locator("[data-play]").isDisabled(),
    "reduced motion: manual steps only",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}${base}/cookbook-complessita`);
  assert(
    !(await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    )),
    "closed mobile layout fits",
  );
  await page.screenshot({
    path: "output/playwright/cookbook-proofs/mobile.png",
  });
  for (const id of ids) {
    await page.goto(`${origin}${base}/cookbook-complessita#${id}`);
    assert(
      !(await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )),
      `mobile ${id} fits`,
    );
  }
  const round = page.locator("#vc-relax-round .proof-player");
  await round.locator("[data-next]").click();
  await round.screenshot({
    path: "output/playwright/cookbook-proofs/mobile-rounding.png",
  });
  await page.goto(`${origin}${base}/cookbook-complessita`);
  const summary = page.locator("#p-in-np > summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  assert(
    (await page.locator("#p-in-np").getAttribute("open")) !== null,
    "keyboard opens card",
  );
  const summaryPage = await page.request.get(`${origin}${base}/`);
  const summaryHtml = await summaryPage.text();
  const anchors = await page
    .locator(".proof-source a")
    .evaluateAll((links) =>
      links.map((link) => decodeURIComponent(new URL(link.href).hash.slice(1))),
    );
  for (const anchor of anchors)
    assert(
      summaryHtml.includes(`id="${anchor}"`),
      `published source anchor ${anchor}`,
    );
  await page.goto(`${origin}${base}/cookbook`);
  await page
    .getByRole("link", { name: "Cookbook delle dimostrazioni ↗", exact: true })
    .click();
  assert(
    page.url().includes(`${base}/cookbook-complessita`),
    "link from original cookbook respects base",
  );
  assert(errors.length === 0, `browser errors: ${errors.join("; ")}`);
  return {
    cards: 15,
    players: 8,
    frames,
    desktop: true,
    mobile: true,
    keyboard: true,
    deepLinks: true,
    reducedMotion: true,
    offscreenPause: true,
    sourceLinks: true,
    base: true,
  };
};
