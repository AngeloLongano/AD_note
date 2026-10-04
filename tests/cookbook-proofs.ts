import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "katex";
import { proofs, proofGroups } from "../src/lib/cookbook/proofs";
import { proofDemos } from "../src/lib/cookbook/proof-demos";
import { proofText, noteAnchor } from "../src/lib/cookbook/proof-format";

// Independent enumeration checks the examples' numerical claims; it is not a solver used by the page.
function covers(n: number, edges: number[][]) {
  const feasible = [];
  for (let mask = 0; mask < 1 << n; mask++) {
    if (edges.every(([a, b]) => mask & (1 << a!) || mask & (1 << b!))) {
      feasible.push({
        mask,
        size: mask.toString(2).replaceAll("0", "").length,
      });
    }
  }
  return feasible;
}
function tours(n: number, cost: (a: number, b: number) => number) {
  const totals: number[] = [];
  function walk(order: number[]) {
    if (order.length === n) {
      totals.push(
        order.reduce((sum, a, i) => sum + cost(a, order[(i + 1) % n]!), 0),
      );
      return;
    }
    for (let v = 1; v < n; v++) if (!order.includes(v)) walk([...order, v]);
  }
  walk([0]);
  return totals;
}
export function testProofs() {
  const source = readFileSync("Algoritmi Distribuiti.md", "utf8");
  const anchors = new Set(
    [...source.matchAll(/^#{2,6} (.+)$/gm)].map((match) =>
      noteAnchor(match[1]!),
    ),
  );
  assert.equal(proofs.length, 15);
  assert.equal(new Set(proofs.map((p) => p.id)).size, proofs.length);
  for (const proof of proofs) {
    assert(proofGroups.some((g) => g.id === proof.group));
    assert(
      anchors.has(noteAnchor(proof.section)),
      `Missing source anchor: ${proof.section}`,
    );
    for (const text of [
      proof.theorem,
      proof.reduction,
      proof.strategy,
      ...proof.proof,
      ...proof.costs,
      ...(proof.factor ?? []),
      ...(proof.note ? [proof.note] : []),
      ...proof.problems.flatMap((p) => [
        p.name,
        p.input,
        p.output,
        p.properties,
      ]),
    ])
      assert(!proofText(text).includes("katex-error"));
    if (proof.demo) assert(proofDemos[proof.demo]);
  }
  let frames = 0;
  for (const demo of Object.values(proofDemos))
    for (const scenario of demo.scenarios) {
      const ids = new Set(scenario.nodes.map((n) => n.id));
      for (const frame of scenario.frames) {
        frames++;
        katex.renderToString(frame.formula.replaceAll("’", "'"), {
          throwOnError: true,
          strict: "error",
        });
        for (const e of frame.edges) assert(ids.has(e.a) && ids.has(e.b));
        for (const id of frame.selected ?? []) assert(ids.has(id));
      }
    }
  const path = [
    [0, 1],
    [1, 2],
    [2, 3],
  ];
  const pathCovers = covers(4, path);
  assert.equal(Math.min(...pathCovers.map((c) => c.size)), 2);
  assert(pathCovers.some((c) => c.mask === 0b0101)); // self-reduction returns {a,c}
  assert(pathCovers.some((c) => c.mask === 0b0110)); // matching {bc} returns {b,c}
  const original = (a: number, b: number) =>
    path.some(([u, v]) => (a === u && b === v) || (b === u && a === v));
  assert.equal(Math.min(...tours(4, (a, b) => (original(a, b) ? 0 : 1))), 1);
  assert.equal(Math.min(...tours(4, (a, b) => (original(a, b) ? 1 : 9))), 12);
  const square = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const distance = (a: number, b: number) =>
    Math.abs(square[a]![0]! - square[b]![0]!) +
    Math.abs(square[a]![1]! - square[b]![1]!);
  assert.equal(Math.min(...tours(4, distance)), 4);
  assert.equal(
    Math.min(...tours(4, (a, b) => (a === 0 || b === 0 ? 1 : 2))),
    6,
  );
  const cycle = [...path, [3, 0]];
  assert.equal(Math.min(...covers(4, cycle).map((c) => c.size)), 2);
  assert.equal(4 * (0.5 >= 0.5 ? 1 : 0), 4); // equality must round upwards
  // All triplets satisfy the triangle inequality in both metric illustrations.
  for (const cost of [
    distance,
    (a: number, b: number) => (a === b ? 0 : a === 0 || b === 0 ? 1 : 2),
  ])
    for (let a = 0; a < 4; a++)
      for (let b = 0; b < 4; b++)
        for (let c = 0; c < 4; c++)
          assert(cost(a, c) <= cost(a, b) + cost(b, c));
  return {
    cards: proofs.length,
    demos: Object.keys(proofDemos).length,
    frames,
    formulae: true,
    sourceAnchors: true,
    enumeratedExamples: true,
  };
}
