// Run with Playwright CLI: run-code --filename tests/cookbook-browser.js
// Tests use the real buttons and their shared manual/automatic handlers.
async (page) => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const params=new URL(page.url()).searchParams;
  const family=params.get('verify')||'diffusione';
  const base=params.get('base')||'';
  const origin=new URL(page.url()).origin;
  await page.goto(`${origin}${base}/cookbook#${family}`);
  await page.waitForSelector('.protocol-player',{state:'attached'});
  const ids=await page.locator(`#${family} .protocol-player`).evaluateAll(hosts=>hosts.map(h=>h.dataset.protocol));
  let scenarios=0;
  for(const id of ids) {
    const card=page.locator(`details#${id}`);
    if(await card.getAttribute('open')===null)await card.locator(':scope > summary').click();
    const host=card.locator('.protocol-player');
    await host.waitFor({state:'visible'});
    await page.waitForFunction(id=>!!document.querySelector(`#${id} .protocol-player`)?.dataset.frames,id);
    const settings=host.locator('[data-scenario]');
    const options=await settings.locator('option').evaluateAll(list=>list.map(o=>o.value));
    for(let i=0;i<options.length;i++) {
      if(i){await settings.selectOption(options[i]);await page.waitForFunction(({id,value})=>{const host=document.querySelector(`#${id} .protocol-player`);return host?.dataset.frame==='0'&&host.querySelector('[data-scenario]').value===value&&!host.querySelector('[data-current]').textContent.includes('Caricamento');},{id,value:options[i]});}
      await host.locator('[data-reset]').click();
      assert(await host.getAttribute('data-frame')==='0',`${id}: reset frame`);
      const initial=await host.locator('[data-count]').textContent();
      await host.locator('[data-step]').click();
      assert(await host.getAttribute('data-frame')==='1',`${id}: first manual step`);
      if(i===0){
        await host.locator('[data-reset]').click();
        await host.locator('[data-play]').click();
        assert(await host.locator('[data-play]').textContent()==='Pausa',`${id}: playback starts`);
        await host.locator('[data-play]').click();
        const paused=await host.getAttribute('data-frame');
        await page.waitForTimeout(100);
        assert(await host.getAttribute('data-frame')===paused,`${id}: pause freezes step`);
        await host.locator('[data-play]').click();
        assert(Number(await host.getAttribute('data-frame'))>Number(paused),`${id}: resume advances same execution`);
        if(await host.locator('[data-play]').textContent()==='Pausa')await host.locator('[data-play]').click();
      }
      // Fast manual stepping dispatches the same visible button click. Let
      // each async click handler settle before advancing again.
      await host.evaluate(async h=>{const button=h.querySelector('[data-step]');for(let k=0;k<3000&&!button.disabled;k++){button.click();await new Promise(r=>setTimeout(r,0));}});
      assert(Number(await host.getAttribute('data-frame'))===Number(await host.getAttribute('data-frames'))-1,`${id}: reaches final frame`);
      assert((await host.locator('[data-result]').textContent()).length>0,`${id}: final result visible`);
      assert(await host.getAttribute('data-complete')==='true',`${id}: complete observation`);
      await host.locator('[data-reset]').click();
      assert(await host.locator('[data-count]').textContent()===initial,`${id}: counters reset`);
      scenarios++;
    }
    await host.locator('[data-step]').click();
    await host.locator('[data-play]').click();
    await card.locator(':scope > summary').click();
    await page.waitForTimeout(25);
    assert(await host.locator('[data-play]').textContent()==='Avvia',`${id}: closing pauses`);
  }
  assert(errors.length===0,errors.join('\n'));
  return {family,players:ids.length,scenarios,errors};
}
