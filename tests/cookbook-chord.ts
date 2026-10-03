import assert from "node:assert/strict";
import { configure } from "../src/lib/cookbook/diffusion";
import { between, chord } from "../src/lib/cookbook/chord";
import { scenarios, type Scenario } from "../src/lib/cookbook/scenarios";
const keys = [2, 12, 36, 37, 40, 59];
const owner = (ids: number[], key: number) =>
  ids.findIndex((id) => id >= key) < 0 ? 0 : ids.findIndex((id) => id >= key);
export function testChord() {
  let runs = 0;
  // Exhaust all ring intervals, including endpoints and crossing zero.
  for (let a = 0; a < 64; a++)
    for (let b = 0; b < 64; b++)
      for (let x = 0; x < 64; x++) {
        const distance = (x - a + 64) % 64,
          span = (b - a + 64) % 64;
        assert.equal(
          between(x, a, b),
          distance > 0 && (a === b || distance < span),
        );
        assert.equal(
          between(x, a, b, true),
          x === b || (distance > 0 && (a === b || distance < span)),
        );
      }
  function run(
    s: Scenario,
    mode: "successor" | "finger" | "join",
    stale = false,
  ) {
    const e = configure(s),
      finish = chord(e, s, mode);
    // Old fingers remain usable when successors are correct; they may cause
    // additional hops, but cannot skip responsibility in the successor check.
    if (stale && mode === "finger")
      for (const node of e.nodes)
        node.data.fingers = Array(6).fill(node.data.successor);
    const trace = e.run("test", "");
    finish();
    const tag = `${mode}/${s.id}/${stale ? "stale" : "valid"}`;
    assert.ok(trace.complete, tag);
    assert.equal(e.pending.length, 0, tag);
    assert.ok(e.result, tag);
    if (mode !== "join") {
      const result = e.node(s.origin ?? 0);
      const sorted = [...e.nodes].sort((a, b) => a.data.own - b.data.own),
        expected = sorted.find((v) => v.data.own >= s.key!) ?? sorted[0]!;
      assert.equal(result.data.ownerIndex, expected.id, tag);
      assert.equal(result.data.owner, expected.data.own, tag);
      const deliveries = trace.frames.flatMap((f) =>
        f.events
          .filter(
            (ev) => ev.type === "deliver" && ev.message?.kind === "lookup",
          )
          .map((ev) => ev.message!),
      );
      assert.ok(
        deliveries.length <= e.nodes.length + 1,
        `${tag}: no ring loop`,
      );
      assert.equal(
        result.data.lookupHops,
        deliveries.filter((m) => m.from !== m.to).length,
        `${tag}: request hops`,
      );
      if (mode === "successor")
        assert.equal(
          deliveries.at(-1)!.to,
          expected.id,
          `${tag}: request reaches actual responsible node`,
        );
    } else {
      const ordered = [...e.nodes].sort((a, b) => a.data.own - b.data.own),
        ids = ordered.map((v) => v.data.own);
      assert.equal(e.nodes.length, s.ids.length + 1, tag);
      assert.ok(e.result.startsWith("Configurazione stabile"), tag);
      for (const [i, node] of ordered.entries()) {
        assert.equal(
          node.data.successor,
          ordered[(i + 1) % ordered.length]!.id,
          `${tag}: successor`,
        );
        assert.equal(
          node.data.predecessor,
          ordered[(i + ordered.length - 1) % ordered.length]!.id,
          `${tag}: predecessor`,
        );
        assert.equal(node.state, "STABLE", tag);
        assert.equal(node.data.fingers.length, 6, tag);
        for (let j = 0; j < 6; j++)
          assert.equal(
            node.data.fingers[j],
            ordered[owner(ids, (node.data.own + 2 ** j) % 64)]!.id,
            `${tag}: finger ${j}`,
          );
      }
      for (const key of keys) {
        const expected = ordered[owner(ids, key)]!;
        const holders = ordered.filter((v) => v.data.keys.includes(key));
        assert.deepEqual(
          holders.map((v) => v.id),
          [expected.id],
          `${tag}: unique key ${key}`,
        );
      }
      const added = e.nodes.at(-1)!;
      assert.deepEqual(added.data.keys, [36, 37], `${tag}: new ownership`);
      assert.equal(added.data.own, 37, tag);
      const keyFrame = e.frames.find((f) =>
        f.events.some(
          (ev) => ev.type === "send" && ev.message?.kind === "keys",
        ),
      )!;
      const source = keyFrame.events.find(
        (ev) => ev.type === "send" && ev.message?.kind === "keys",
      )!.message!.from;
      assert.ok(
        keyFrame.nodes[source]!.data.keys.includes(36),
        `${tag}: retain value during transfer`,
      );
      assert.ok(
        keyFrame.nodes[source]!.data.keys.includes(37),
        `${tag}: retain value during transfer`,
      );
      assert.equal(
        e.frames
          .flatMap((f) => f.events)
          .filter(
            (ev) => ev.type === "send" && ev.message?.kind === "stabilize",
          ).length,
        e.nodes.length * 2,
        `${tag}: two local maintenance cycles`,
      );
      // Every forwarding choice is reachable through the sender's local pointer
      // table. No scan of the complete ring appears in the protocol path.
      for (const frame of e.frames)
        for (const ev of frame.events)
          if (ev.type === "send" && ev.message?.kind === "lookup") {
            const m = ev.message,
              local = frame.nodes[m.from]!.data;
            assert.ok(
              m.from === m.to ||
                local.successor === m.to ||
                local.fingers.includes(m.to) ||
                local.contacts[m.to] !== undefined,
              `${tag}: known lookup contact`,
            );
          }
    }
    runs++;
    return e;
  }
  for (const protocol of [
    "chord-successor",
    "chord-finger",
    "chord-join",
  ] as const) {
    const mode = protocol.slice(6) as "successor" | "finger" | "join";
    for (const s of scenarios(protocol)) run(s, mode);
  }
  // All 64 key hashes from every origin: includes absent values, exact node IDs,
  // sparse gaps, zero, maximum hash, and the wrap around 54→4.
  const base = scenarios("chord-successor")[0]!;
  for (const mode of ["successor", "finger"] as const)
    for (let key = 0; key < 64; key++)
      for (let origin = 0; origin < base.ids.length; origin++)
        run({ ...base, id: `key-${key}-from-${origin}`, key, origin }, mode);
  for (const s of scenarios("chord-finger")) run(s, "finger", true);
  for (const mode of ["successor", "finger"] as const)
    for (const key of [0, 2, 17, 63])
      run(
        {
          id: `singleton-${key}`,
          title: "singleton ring",
          ids: [17],
          edges: [],
          initiators: [0],
          origin: 0,
          key,
        },
        mode,
      );
  console.log(
    `Chord: ${runs} complete executions passed; exhaustive circular intervals, displayed lookup/join scenarios, all keys/origins, stale fingers, singleton, stable pointers/fingers and transferred ownership.`,
  );
}
