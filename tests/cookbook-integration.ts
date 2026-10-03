import assert from "node:assert/strict";
import { Engine } from "../src/lib/cookbook/engine";
import { cards, groups } from "../src/lib/cookbook/content";
import { scenarios } from "../src/lib/cookbook/scenarios";
import { simulate } from "../src/lib/cookbook/protocols";
const identities = new Set<string>();
let count = 0;
for (const card of cards) {
  assert.ok(!identities.has(card.id), `Unique stable anchor ${card.id}`);
  identities.add(card.id);
  assert.ok(groups.some((g) => g.id === card.group));
  if (card.optional) {
    assert.ok(card.overview);
    assert.equal(card.rules.length, 0);
    continue;
  }
  for (const field of [
    "objective",
    "topology",
    "model",
    "states",
    "idea",
  ] as const)
    assert.ok(card[field]);
  assert.ok(card.rules.length);
  assert.ok(card.costs.length);
  assert.ok(card.properties.length);
  for (const scenario of scenarios(card.id)) {
    const trace = simulate(card.id, scenario),
      last = trace.frames.at(-1)!;
    assert.ok(
      trace.complete,
      `${card.id}/${scenario.id}: completed observation`,
    );
    assert.ok(trace.result, `${card.id}/${scenario.id}: result supplied`);
    assert.ok(last.time >= 0);
    const sends = trace.frames
      .flatMap((f) => f.events)
      .filter(
        (ev) => ev.type === "send" && ev.message!.from !== ev.message!.to,
      );
    assert.equal(
      last.sends,
      sends.length,
      `${card.id}: sends derive from events`,
    );
    assert.equal(
      last.elements,
      sends.reduce((a, ev) => a + ev.message!.elements, 0),
    );
    assert.deepEqual(
      simulate(card.id, scenario),
      trace,
      `${card.id}: restart reproducible, no module state leaks`,
    );
    count++;
  }
}
assert.deepEqual(
  cards.filter((c) => c.optional).map((c) => c.id),
  ["yoyo", "byz-random"],
);
assert.equal(cards.length, 32);
// Independent Engine instances, separate send and delivery, and concurrent
// messages from the same sender: no hidden one-message-per-node restriction.
const a = new Engine(
    [1, 2, 3],
    [
      { a: 0, b: 1 },
      { a: 0, b: 2 },
    ],
  ),
  b = new Engine([1], []);
a.at(0, () => {
  a.send(0, 1, "A");
  a.send(0, 2, "B");
});
const trace = a.run("time", "note");
assert.equal(b.sends, 0);
assert.equal(trace.frames[1]!.pending.length, 2);
assert.equal(
  trace.frames[1]!.events.filter((v) => v.type === "send").length,
  2,
);
assert.equal(
  trace.frames[2]!.events.filter((v) => v.type === "deliver").length,
  2,
);
assert.equal(trace.frames[1]!.time, 0);
assert.equal(trace.frames[2]!.time, 1);
console.log(
  `Integration: ${cards.length} cards, ${count} published scenarios; independent state, event-derived counters and deterministic restart passed.`,
);

// A synchronized barrier depends on received messages, even when its timer
// was scheduled before them: causal depth must survive the round boundary.
const maxTrace = simulate("floodmax", scenarios("floodmax")[0]!);
assert.equal(
  maxTrace.frames.at(-1)!.causal,
  4,
  "four dependent FloodMax rounds",
);
const atwTrace = simulate("all-the-way", scenarios("all-the-way")[1]!);
assert.equal(atwTrace.frames.at(-1)!.causal, 9, "progressive ATW chain 2n−1");
