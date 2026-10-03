import assert from "node:assert/strict";
import { Engine, type Trace } from "../src/lib/cookbook/engine";
import {
  allTheWay,
  lcr,
  controlledDistance,
  floodmax,
  waiting,
  randomElection,
} from "../src/lib/cookbook/election";
import { scenarios, ring, type Scenario } from "../src/lib/cookbook/scenarios";

const protocols = [
  "all-the-way",
  "lcr",
  "controlled-distance",
  "floodmax",
  "speeding",
  "waiting",
  "universal-waiting",
  "random-election",
];
function simulate(protocol: string, s: Scenario): Trace {
  const e = new Engine(s.ids, s.edges);
  if (s.delayed) e.delay = (a, b) => 1 + ((a * 3 + b * 2) % 3);
  switch (protocol) {
    case "all-the-way":
      allTheWay(e, s);
      break;
    case "lcr":
      lcr(e, s);
      break;
    case "controlled-distance":
      controlledDistance(e, s);
      break;
    case "floodmax":
      floodmax(e);
      break;
    case "speeding":
      lcr(e, s, true);
      break;
    case "waiting":
      waiting(e, s);
      break;
    case "universal-waiting":
      waiting(e, s, true);
      break;
    case "random-election":
      randomElection(e, s);
      break;
    default:
      throw new Error(protocol);
  }
  return e.run("test", "test");
}
function validate(protocol: string, s: Scenario) {
  const t = simulate(protocol, s);
  const final = t.frames.at(-1)!;
  assert.equal(t.complete, true, `${protocol}/${s.id}: terminated`);
  assert.ok(t.result, `${protocol}/${s.id}: result`);
  assert.equal(
    final.pending.length,
    0,
    `${protocol}/${s.id}: drained messages`,
  );
  const leaders = final.nodes.filter((v) => v.state === "LEADER");
  assert.equal(leaders.length, 1, `${protocol}/${s.id}: exactly one leader`);
  assert.ok(
    final.nodes.every((v) => ["LEADER", "FOLLOWER"].includes(v.state)),
    `${protocol}/${s.id}: all know their outcome`,
  );
  if (protocol !== "random-election")
    assert.equal(
      leaders[0]!.data.own,
      protocol === "floodmax" ? Math.max(...s.ids) : Math.min(...s.ids),
      `${protocol}/${s.id}: correct extremum`,
    );
  if (protocol === "all-the-way") {
    assert.equal(final.sends, s.ids.length ** 2, "ATW: n² messages");
    for (const v of final.nodes) {
      assert.equal(v.data.size, s.ids.length);
      assert.equal(v.data.received.length, s.ids.length);
    }
    if (!s.delayed)
      assert.equal(
        final.time,
        s.initiators.length === s.ids.length
          ? s.ids.length
          : 2 * s.ids.length - 1,
        "ATW parallel time",
      );
  }
  if (protocol === "floodmax") {
    assert.equal(
      final.sends,
      2 * s.edges.length * (s.ids.length - 1),
      "FloodMax: 2mL",
    );
    assert.equal(final.time, s.ids.length - 1, "FloodMax: L rounds");
    for (const v of final.nodes)
      assert.equal(v.data.maximum, Math.max(...s.ids));
    for (const frame of t.frames)
      for (const node of frame.nodes) {
        if (node.data.round === undefined) continue;
        let within = new Set([node.id]);
        for (let r = 0; r < node.data.round; r++) {
          const expanded = new Set(within);
          for (const edge of s.edges) {
            if (within.has(edge.a)) expanded.add(edge.b);
            if (within.has(edge.b)) expanded.add(edge.a);
          }
          within = expanded;
        }
        assert.equal(
          node.data.maximum,
          Math.max(...[...within].map((id) => s.ids[id]!)),
          "FloodMax: local radius-r invariant",
        );
      }
  }
  if (protocol === "waiting")
    assert.equal(
      final.sends,
      (s.progressive ? 2 : 1) * s.ids.length,
      "Waiting: notification and optional wake-up",
    );
  if (protocol === "random-election") {
    assert.equal(leaders[0]!.data.bit, 0, "unique successful minimum");
    assert.equal(final.nodes.filter((v) => v.data.bit === 0).length, 1);
    assert.equal(
      JSON.stringify(simulate(protocol, s)),
      JSON.stringify(t),
      "random trace reproducible",
    );
  }
  return t;
}
let offered = 0;
for (const p of protocols)
  for (const s of scenarios(p)) {
    validate(p, s);
    offered++;
  }
const lcrWorst = validate("lcr", scenarios("lcr")[0]!);
assert.equal(lcrWorst.frames.at(-1)!.sends, 20, "LCR worst case n(n+1)/2+n");
assert.equal(
  validate("lcr", scenarios("lcr")[1]!).frames.at(-1)!.sends,
  10,
  "LCR minimum initiator 2n",
);
const atw = validate("all-the-way", scenarios("all-the-way")[1]!);
assert.ok(
  atw.frames.some((f) => {
    const sends = f.events.filter((x) => x.type === "send");
    return sends.some((a) =>
      sends.some((b) => a !== b && a.message!.from === b.message!.from),
    );
  }),
  "ATW: local concurrent forwarding plus own token",
);
const singleton: Scenario = {
  id: "singleton",
  title: "singleton",
  ids: [1],
  edges: [],
  initiators: [0],
};
const one = simulate("floodmax", singleton);
assert.equal(
  one.frames.at(-1)!.nodes[0]!.state,
  "LEADER",
  "FloodMax: isolated singleton terminates with L=0",
);
assert.equal(one.frames.at(-1)!.sends, 0);
assert.equal(one.frames.at(-1)!.time, 0);

// A defeated HS relay forwards an arriving larger candidate as prescribed
// on p. 172; it cannot re-elect itself when an old Forth returns.
const hsS: Scenario = {
  id: "passive-relay",
  title: "passive-relay",
  ids: [3, 1, 2, 4, 5],
  edges: ring(5, false),
  initiators: [0, 1, 2, 3, 4],
};
const hs = simulate("controlled-distance", hsS);
const states = Array(hsS.ids.length).fill("SLEEPING");
let passiveChecks = 0;
for (const frame of hs.frames)
  for (let i = 0; i < frame.events.length; i++) {
    const ev = frame.events[i]!;
    if (ev.type === "update") {
      const label = ev.text.split(":")[0];
      const id = hsS.ids.indexOf(Number(label));
      states[id] = ev.text.split(": ")[1]!.split(" ")[0];
    }
    if (ev.type === "deliver" && ev.message!.kind === "Forth") {
      const m = ev.message!;
      if (
        states[m.to] === "DEFEATED" &&
        m.to !== m.data.origin &&
        hsS.ids[m.to]! < m.data.v
      ) {
        const nextEvent = frame.events[i + 1]!;
        assert.equal(
          nextEvent.type,
          "send",
          "HS: defeated node forwards a larger ID",
        );
        assert.equal(nextEvent.message!.data.v, m.data.v);
        passiveChecks++;
      }
    }
  }
assert.ok(
  passiveChecks > 0,
  "HS regression actually exercises passive relay of a larger ID",
);
// Delayed HS waves must never resurrect a defeated origin or elect twice.
for (let seed = 1; seed <= 25; seed++) {
  const ids = [1, 2, 3, 4, 5, 6];
  let value = seed;
  for (let i = ids.length - 1; i > 0; i--) {
    value = (value * 1664525 + 1013904223) >>> 0;
    const j = value % (i + 1);
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
  }
  const trace = validate("controlled-distance", {
    id: `permutation-${seed}`,
    title: "delayed permutation",
    ids,
    edges: ring(ids.length, false),
    initiators: [seed % ids.length],
    delayed: true,
  });
  assert.ok(
    trace.frames.every(
      (f) => f.nodes.filter((v) => v.state === "LEADER").length <= 1,
    ),
    "HS: election safety throughout trace",
  );
}
for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  validate("random-election", {
    ...scenarios("random-election")[0]!,
    seed,
    id: `seed-${seed}`,
  });
console.log(
  `Election audit: ${offered} offered scenarios + 35 varied HS/random runs; counts, ATW parallelism, round invariants, singleton and HS passive relay regression passed.`,
);
