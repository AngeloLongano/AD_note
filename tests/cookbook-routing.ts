import assert from "node:assert/strict";
import { Engine, type Edge } from "../src/lib/cookbook/engine";
import { configure } from "../src/lib/cookbook/diffusion";
import {
  gossiping,
  iterating,
  minHop,
  dijkstra,
} from "../src/lib/cookbook/routing";
import {
  scenarios,
  random,
  type Scenario,
} from "../src/lib/cookbook/scenarios";

const protocols = {
  gossiping,
  iterating: (e: Engine, _s: Scenario) => iterating(e),
  "min-hop": minHop,
  dijkstra,
};
const cost = (s: Scenario, a: number, b: number) =>
  s.edges.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))
    ?.weight ?? 1;
function distances(s: Scenario, weighted: boolean) {
  const n = s.ids.length,
    d = Array.from({ length: n }, (_, a) =>
      Array.from({ length: n }, (_, b) => (a === b ? 0 : Infinity)),
    );
  for (const edge of s.edges)
    d[edge.a]![edge.b] = d[edge.b]![edge.a] = weighted ? (edge.weight ?? 1) : 1;
  for (let k = 0; k < n; k++)
    for (let a = 0; a < n; a++)
      for (let b = 0; b < n; b++)
        d[a]![b] = Math.min(d[a]![b]!, d[a]![k]! + d[k]![b]!);
  return d;
}
let runs = 0;
function verify(
  protocol: keyof typeof protocols,
  s: Scenario,
  nonFIFO = false,
) {
  const e = configure(s),
    rng = random(s.seed ?? 91);
  if (nonFIFO && protocol !== "iterating")
    e.delay = () => 1 + Math.floor(rng() * 7);
  // Iterating requires synchronized rounds; no asynchronous scheduler here.
  if (protocol === "iterating") e.delay = () => 1;
  protocols[protocol](e, s);
  const trace = e.run("test", "");
  const tag = `${protocol}/${s.id}/${nonFIFO ? "nonFIFO" : "configured"}`,
    n = s.ids.length,
    m = s.edges.length;
  assert.ok(trace.complete, tag);
  assert.ok(trace.result, `${tag}: declared result`);
  assert.ok(
    e.nodes.every((v) => v.state === "DONE"),
    `${tag}: every node finishes`,
  );
  assert.equal(e.pending.length, 0, tag);
  const sends = trace.frames.flatMap((f) =>
    f.events.filter((v) => v.type === "send").map((v) => v.message!),
  );
  const expected = distances(s, protocol !== "min-hop");
  if (protocol === "gossiping" || protocol === "iterating") {
    for (const source of e.nodes) {
      assert.deepEqual(
        source.data.distance,
        expected[source.id],
        `${tag}: distances from ${source.id}`,
      );
      for (let dest = 0; dest < n; dest++) {
        let current = source.id,
          pathCost = 0;
        const visited = new Set<number>();
        while (current !== dest) {
          assert.ok(!visited.has(current), `${tag}: loop to ${dest}`);
          visited.add(current);
          const hop = e.node(current).data.nextHop[dest];
          assert.ok(
            e.neighbours(current).includes(hop),
            `${tag}: incident next hop`,
          );
          pathCost += cost(s, current, hop);
          current = hop;
        }
        assert.equal(
          pathCost,
          expected[source.id]![dest],
          `${tag}: forwarded path cost`,
        );
      }
    }
    if (protocol === "iterating") {
      assert.equal(e.sends, 2 * m * (n - 1), `${tag}: distance vector sends`);
      assert.equal(e.elements, 2 * m * n * (n - 1), `${tag}: vector elements`);
      for (const msg of sends)
        assert.equal(msg.data.vector.length, n, `${tag}: n vector entries`);
    } else {
      assert.equal(
        sends.filter((v) => v.kind === "Q" || v.kind === "YES").length,
        2 * m,
        `${tag}: SHOUT+ setup`,
      );
      assert.equal(
        sends.filter((v) => v.kind === "NeighbourInfo").length,
        2 * m,
        `${tag}: local information exchange`,
      );
      assert.equal(
        sends.filter((v) => v.kind === "List").length,
        n * (n - 1),
        `${tag}: one list on each tree edge`,
      );
      assert.equal(
        sends
          .filter((v) => v.kind === "List")
          .reduce((a, v) => a + v.elements, 0),
        2 * m * (n - 1),
        `${tag}: list elements`,
      );
      for (const v of e.nodes)
        assert.equal(Object.keys(v.data.map).length, n, `${tag}: complete map`);
    }
  } else {
    const root = s.initiators[0]!;
    for (const frame of trace.frames)
      for (const v of frame.nodes)
        if (v.data.distance !== null)
          assert.equal(
            v.data.distance,
            expected[root]![v.id],
            `${tag}: definitive distance at every step`,
          );
    for (const v of e.nodes) {
      assert.equal(
        v.data.distance,
        expected[root]![v.id],
        `${tag}: root distance`,
      );
      if (v.id === root) {
        assert.equal(v.data.parent, null, tag);
        continue;
      }
      const parent = v.data.parent;
      assert.ok(
        e.neighbours(v.id).includes(parent),
        `${tag}: parent is neighbour`,
      );
      assert.ok(
        e.node(parent).data.children.includes(v.id),
        `${tag}: parent records child`,
      );
      assert.equal(
        v.data.distance,
        e.node(parent).data.distance +
          (protocol === "min-hop" ? 1 : cost(s, parent, v.id)),
        `${tag}: parent path`,
      );
      const visited = new Set<number>();
      let x = v.id;
      while (x !== root) {
        assert.ok(!visited.has(x), `${tag}: acyclic tree`);
        visited.add(x);
        x = e.node(x).data.parent;
      }
    }
    assert.equal(
      e.nodes.reduce((a, v) => a + v.data.children.length, 0),
      n - 1,
      `${tag}: spanning tree edges`,
    );
    assert.equal(
      sends.filter((v) => v.kind === "stop").length,
      n - 1,
      `${tag}: final stop`,
    );
    if (protocol === "min-hop")
      assert.equal(
        sends.filter((v) => ["explore", "YES", "NO"].includes(v.kind)).length,
        2 * m,
        `${tag}: explore 2m`,
      );
    else {
      assert.equal(
        sends.filter((v) => v.kind === "Add").length,
        n - 1,
        `${tag}: one new node per iteration`,
      );
      assert.equal(
        sends.filter((v) => v.kind === "InTree").length,
        2 * m - (n - 1),
        `${tag}: local inclusion notifications`,
      );
      assert.equal(
        sends.filter((v) => v.kind === "Ack").length,
        2 * m - (n - 1),
        `${tag}: inclusion replies`,
      );
      assert.equal(
        sends.filter((v) => v.kind === "TreeAck").length,
        0,
        `${tag}: no invented acknowledgement`,
      );
    }
  }
  runs++;
}
for (const protocol of Object.keys(protocols) as (keyof typeof protocols)[]) {
  for (const s of scenarios(protocol)) verify(protocol, s);
  verify(protocol, {
    id: "singleton",
    title: "one node",
    ids: [1],
    edges: [],
    initiators: [0],
  });
}
// Small connected graphs include cross explorations, multiple shortest paths,
// singleton frontier branches, and varying delivery orders without FIFO.
for (let seed = 1; seed <= 35; seed++) {
  const rng = random(seed),
    n = 2 + (seed % 6),
    edges: Edge[] = [];
  for (let b = 1; b < n; b++)
    edges.push({
      a: Math.floor(rng() * b),
      b,
      weight: 1 + Math.floor(rng() * 8),
    });
  for (let a = 0; a < n; a++)
    for (let b = a + 1; b < n; b++)
      if (!edges.some((e) => e.a === a && e.b === b) && rng() < 0.35)
        edges.push({ a, b, weight: 1 + Math.floor(rng() * 8) });
  const s: Scenario = {
    id: `generated-${seed}`,
    title: "generated",
    ids: Array.from({ length: n }, (_, i) => i + 1),
    edges,
    initiators: [seed % n],
    seed,
  };
  for (const protocol of Object.keys(protocols) as (keyof typeof protocols)[])
    verify(protocol, s, true);
}
// Nonnegative weights are permitted by the two all-pairs algorithms.
for (const protocol of ["gossiping", "iterating"] as const)
  verify(
    protocol,
    {
      id: "zero-edge",
      title: "zero-cost edge",
      ids: [1, 2, 3, 4],
      edges: [
        { a: 0, b: 1, weight: 0 },
        { a: 1, b: 2, weight: 0 },
        { a: 2, b: 3, weight: 2 },
        { a: 0, b: 3, weight: 5 },
      ],
      initiators: [0],
    },
    true,
  );
for (let seed = 40; seed < 65; seed++) {
  const rng = random(seed),
    n = 6,
    edges: Edge[] = [];
  for (let a = 0; a < n; a++)
    for (let b = a + 1; b < n; b++)
      if (b === a + 1 || rng() < 0.35)
        edges.push({ a, b, weight: Math.floor(rng() * 4) });
  const s: Scenario = {
    id: `nonnegative-${seed}`,
    title: "nonnegative costs",
    ids: [1, 2, 3, 4, 5, 6],
    edges,
    initiators: [seed % n],
    seed,
  };
  for (const protocol of ["gossiping", "iterating"] as const)
    verify(protocol, s, true);
}
console.log(
  `Routing: ${runs} complete executions passed, including displayed scenarios, singleton, generated non-FIFO graphs, distance/next-hop/tree invariants and exact counts.`,
);
