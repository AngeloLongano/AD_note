import assert from "node:assert/strict";
import type { Trace, Vertex } from "../src/lib/cookbook/engine";
import {
  configure,
  flooding,
  shout,
  dft,
  saturation,
  twoSteps,
} from "../src/lib/cookbook/diffusion";
import {
  complete,
  scenarios,
  type Scenario,
} from "../src/lib/cookbook/scenarios";
import { simulate } from "../src/lib/cookbook/protocols";

const protocols = [
  "flooding",
  "wflood",
  "shout",
  "shout-plus",
  "dft",
  "dft-ack",
  "saturation",
  "tree-election",
  "two-steps",
  "simple-broadcast",
];
function run(protocol: string, s: Scenario, nonFIFO = false): Trace {
  if (protocol === "simple-broadcast") return simulate(protocol, s);
  const e = configure(s);
  if (nonFIFO) {
    let sends = 0;
    e.delay = () => 1 + ((++sends * 7) % 5);
  }
  switch (protocol) {
    case "flooding":
      flooding(e, s);
      break;
    case "wflood":
      flooding(e, s, "W");
      break;
    case "shout":
      shout(e, s, false);
      break;
    case "shout-plus":
      shout(e, s, true);
      break;
    case "dft":
      dft(e, s, false);
      break;
    case "dft-ack":
      dft(e, s, true);
      break;
    case "saturation":
      saturation(e, s, false);
      break;
    case "tree-election":
      saturation(e, s, true);
      break;
    case "two-steps":
      twoSteps(e, s);
      break;
    default:
      throw new Error(protocol);
  }
  return e.run("test", "");
}
function distances(s: Scenario) {
  const d = s.ids.map(() => Infinity);
  d[s.initiators[0]!] = 0;
  for (let i = 0; i < s.ids.length; i++)
    for (const { a, b } of s.edges) {
      d[a] = Math.min(d[a]!, d[b]! + 1);
      d[b] = Math.min(d[b]!, d[a]! + 1);
    }
  return d;
}
function tree(nodes: Vertex[], root: number) {
  assert.equal(nodes.filter((n) => n.data.parent === null).length, 1);
  for (const n of nodes) {
    if (n.id === root) continue;
    assert(
      nodes[n.data.parent]!.data.children.includes(n.id),
      "parent and child agree",
    );
    const seen = new Set<number>();
    let x = n.id;
    while (x !== root) {
      assert(!seen.has(x), "acyclic parents");
      seen.add(x);
      x = nodes[x]!.data.parent;
    }
  }
  assert.equal(
    nodes.reduce((n, v) => n + v.data.children.length, 0),
    nodes.length - 1,
  );
}
function validate(protocol: string, s: Scenario, nonFIFO = false) {
  const t = run(protocol, s, nonFIFO),
    f = t.frames.at(-1)!;
  const n = s.ids.length,
    m = s.edges.length;
  assert(
    t.complete && !f.pending.length,
    `${protocol}: every delivery completed`,
  );
  assert(t.result, `${protocol}: result reported`);
  const expected =
    protocol === "wflood"
      ? "AWAKE"
      : protocol === "tree-election"
        ? null
        : "DONE";
  if (expected)
    assert(
      f.nodes.every((v) => v.state === expected),
      `${protocol}: every node terminal`,
    );
  const sent = t.frames.flatMap((frame) =>
    frame.events.filter((v) => v.type === "send").map((v) => v.message!),
  );
  if (["flooding", "wflood"].includes(protocol))
    assert.equal(
      f.sends,
      2 * m - n + (protocol === "wflood" ? s.initiators.length : 1),
    );
  if (protocol === "simple-broadcast") assert.equal(f.sends, n - 1);
  if (protocol === "shout") assert.equal(f.sends, 4 * m - 2 * n + 2);
  if (["shout-plus", "dft"].includes(protocol)) assert.equal(f.sends, 2 * m);
  if (["shout", "shout-plus", "dft", "dft-ack"].includes(protocol))
    tree(f.nodes, s.initiators[0]!);
  if (protocol === "dft-ack") {
    assert(f.sends <= 4 * m);
    assert.equal(
      sent.filter((v) => v.kind.endsWith("Token")).length,
      2 * (n - 1),
    );
    assert(
      !sent.some((v) => v.kind === "BackEdgeToken"),
      "handshakes avoid back-edge token attempts",
    );
  }
  if (["saturation", "tree-election"].includes(protocol)) {
    if (n === 1) assert.equal(f.sends, 0);
    else {
      assert.equal(
        sent.filter((v) => v.kind === "W").length,
        n + s.initiators.length - 2,
      );
      assert.equal(sent.filter((v) => v.kind === "Saturation").length, n);
      assert.equal(sent.filter((v) => v.kind === "Resolution").length, n - 2);
      assert(f.sends <= 4 * n - 4);
      const sat = sent.filter((v) => v.kind === "Saturation");
      const pair = sat.filter((a) =>
        sat.some((b) => a.from === b.to && a.to === b.from),
      );
      assert.equal(pair.length, 2, "exactly one adjacent saturated pair");
      if (protocol === "tree-election")
        assert.equal(
          f.nodes.find((v) => v.state === "LEADER")!.data.own,
          Math.min(...pair.map((v) => s.ids[v.from]!)),
        );
    }
    if (protocol === "saturation")
      assert(f.nodes.every((v) => v.data.result === Math.min(...s.ids)));
    else {
      assert.equal(f.nodes.filter((v) => v.state === "LEADER").length, 1);
      assert(f.nodes.every((v) => ["LEADER", "FOLLOWER"].includes(v.state)));
    }
  }
  if (protocol === "two-steps") {
    assert(f.sends <= ((s.F ?? 0) + 1) * (n - 1));
    for (const msg of sent.filter((v) => v.from !== s.initiators[0])) {
      assert(
        sent.some(
          (v) => v.from === s.initiators[0] && v.to === msg.from && !v.lost,
        ),
        "only direct recipients forward",
      );
      assert.notEqual(msg.to, s.initiators[0]);
    }
  }
  if (expected && !s.delayed && !nonFIFO) {
    const done = t.frames.find((frame) =>
      frame.nodes.every((v) => v.state === expected),
    )!.time;
    const r = Math.max(...distances(s));
    if (protocol === "flooding") assert.equal(done, r);
    if (protocol === "shout" && n > 1) assert(done >= r + 1 && done <= r + 2);
    if (protocol === "shout-plus" && n > 1) assert.equal(done, r + 1);
    if (protocol === "dft") assert.equal(done, 2 * m);
    if (protocol === "dft-ack") assert(done <= 4 * n - 2);
    if (protocol === "two-steps") assert(done <= 2);
  }
}
function* subsets<T>(
  values: T[],
  k: number,
  offset = 0,
  prefix: T[] = [],
): Generator<T[]> {
  if (!k) {
    yield prefix;
    return;
  }
  for (let i = offset; i <= values.length - k; i++)
    yield* subsets(values, k - 1, i + 1, [...prefix, values[i]!]);
}

export function testDiffusion() {
  let checks = 0;
  const check = (p: string, s: Scenario, nonFIFO = false) => {
    validate(p, s, nonFIFO);
    checks++;
  };
  for (const p of protocols) for (const s of scenarios(p)) check(p, s);
  for (let n = 1; n <= 4; n++) {
    const edges = complete(n);
    for (let mask = 0; mask < 2 ** edges.length; mask++) {
      const s: Scenario = {
        id: `exhaustive-${n}-${mask}`,
        title: "",
        ids: Array.from({ length: n }, (_, i) => n - i),
        edges: edges.filter((_, i) => (mask & (2 ** i)) !== 0),
        initiators: [0],
      };
      if (distances(s).includes(Infinity)) continue;
      for (let root = 0; root < n; root++)
        for (const delayed of [false, true]) {
          const sample = { ...s, initiators: [root], delayed };
          for (const p of ["flooding", "shout", "shout-plus", "dft", "dft-ack"])
            check(p, sample);
          for (const p of ["shout-plus", "dft", "dft-ack"])
            check(p, sample, true);
        }
      for (let count = 1; count <= n; count++)
        for (const initiators of subsets(
          s.ids.map((_, i) => i),
          count,
        )) {
          check("wflood", { ...s, initiators, delayed: true });
          if (s.edges.length === n - 1)
            for (const p of ["saturation", "tree-election"])
              check(p, { ...s, initiators, delayed: true });
        }
    }
  }
  // Every omission set of size <=F on K3..K5, including F=n-2.
  for (let n = 3; n <= 5; n++)
    for (let F = 0; F <= n - 2; F++)
      for (let count = 0; count <= F; count++) {
        for (const omitted of subsets(complete(n), count))
          check("two-steps", {
            id: "omissions",
            title: "",
            ids: Array.from({ length: n }, (_, i) => i),
            edges: complete(n),
            initiators: [0],
            F,
            failed: omitted.map((e) => [e.a, e.b]),
            delayed: true,
          });
      }
  for (const p of ["saturation", "tree-election"])
    check(p, {
      id: "singleton",
      title: "",
      ids: [42],
      edges: [],
      initiators: [0],
    });
  check("saturation", {
    id: "equal-values",
    title: "",
    ids: [2, 2, 2],
    edges: [
      { a: 0, b: 1 },
      { a: 1, b: 2 },
    ],
    initiators: [0, 2],
    delayed: true,
  });
  // In this tree the selected pair excludes the global minimum ID.
  const localPair: Scenario = {
    id: "local-pair",
    title: "",
    ids: [1, 7, 8, 9, 10],
    edges: [
      { a: 0, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 3 },
      { a: 3, b: 4 },
    ],
    initiators: [0],
  };
  check("tree-election", localPair);
  assert.notEqual(
    run("tree-election", localPair)
      .frames.at(-1)!
      .nodes.find((v) => v.state === "LEADER")!.data.own,
    1,
  );
  return { suite: "diffusion", checks };
}
