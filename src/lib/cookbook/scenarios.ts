import type { Edge } from "./engine";
export interface Scenario {
  id: string;
  title: string;
  ids: number[];
  edges: Edge[];
  initiators: number[];
  delayed?: boolean;
  F?: number;
  bits?: number[];
  failed?: [number, number][];
  faulty?: number[];
  seed?: number;
  key?: number;
  origin?: number;
  progressive?: boolean;
}
const graph: Edge[] = [
  { a: 0, b: 1, weight: 4 },
  { a: 0, b: 2, weight: 1 },
  { a: 1, b: 2, weight: 2 },
  { a: 1, b: 3, weight: 1 },
  { a: 2, b: 4, weight: 7 },
  { a: 3, b: 4, weight: 2 },
];
const tree: Edge[] = [
  { a: 0, b: 1 },
  { a: 1, b: 2 },
  { a: 1, b: 3 },
  { a: 3, b: 4 },
];
export const ring = (n: number, directed = true): Edge[] =>
  Array.from({ length: n }, (_, i) => ({ a: i, b: (i + 1) % n, directed }));
export const complete = (n: number): Edge[] =>
  Array.from({ length: n }, (_, i) =>
    Array.from({ length: n - i - 1 }, (_, j) => ({ a: i, b: i + j + 1 })),
  ).flat();
const base = (id: string, title: string, edges = graph): Scenario => ({
  id,
  title,
  ids: [3, 7, 1, 5, 9],
  edges,
  initiators: [0],
});
export function scenarios(protocol: string): Scenario[] {
  if (protocol.startsWith("chord"))
    return [
      {
        id: "key37",
        title: "Chiave 37 da N4",
        ids: [4, 8, 15, 20, 32, 35, 44, 54],
        edges: ring(8),
        initiators: [0],
        key: 37,
        origin: 0,
      },
      {
        id: "wrap",
        title: "Attraversamento dello zero: chiave 2 da N35",
        ids: [4, 8, 15, 20, 32, 35, 44, 54],
        edges: ring(8),
        initiators: [5],
        key: 2,
        origin: 5,
      },
    ];
  if (["tellall", "tellzero-crash"].includes(protocol))
    return [
      {
        id: "none",
        title: "Nessun crash (F=1)",
        ids: [1, 2, 3, 4, 5],
        edges: complete(5),
        initiators: [0],
        F: 1,
        bits: [1, 0, 1, 1, 1],
      },
      {
        id: "crash",
        title: "Crash durante il primo invio dello zero",
        ids: [1, 2, 3, 4, 5],
        edges: complete(5),
        initiators: [0],
        F: 1,
        bits: [0, 1, 1, 1, 1],
        faulty: [0],
      },
      {
        id: "ones",
        title: "Tutti uno, F=0",
        ids: [1, 2, 3, 4, 5],
        edges: complete(5),
        initiators: [0],
        F: 0,
        bits: [1, 1, 1, 1, 1],
      },
    ];
  if (["ben-or", "byz-random"].includes(protocol)) {
    const n = protocol === "byz-random" ? 10 : 5;
    return [
      {
        id: "mixed",
        title: "Valori misti e monete (seme 17)",
        ids: Array.from({ length: n }, (_, i) => i + 1),
        edges: complete(n),
        initiators: [0],
        F: 1,
        bits: Array.from({ length: n }, (_, i) => i % 2),
        seed: 17,
        delayed: true,
        faulty: protocol === "byz-random" ? [n - 1] : [],
      },
      {
        id: "unanimous",
        title: "Tutti i corretti iniziano da zero",
        ids: Array.from({ length: n }, (_, i) => i + 1),
        edges: complete(n),
        initiators: [0],
        F: 1,
        bits: Array(n).fill(0),
        seed: 91,
        faulty: [n - 1],
      },
    ];
  }
  if (["registered-mail", "tellzero-byz"].includes(protocol))
    return [
      {
        id: "honest",
        title: "Origine corretta / propagazione dello zero",
        ids: [1, 2, 3, 4],
        edges: complete(4),
        initiators: [0],
        F: 1,
        bits: [0, 0, 1, 1],
        faulty: [3],
      },
      {
        id: "equivocation",
        title: "Bizantino invia init soltanto ad alcuni",
        ids: [1, 2, 3, 4],
        edges: complete(4),
        initiators: [3],
        F: 1,
        bits: [1, 1, 1, 0],
        faulty: [3],
      },
      {
        id: "allones",
        title: "Tutti uno: nessuna origine corretta",
        ids: [1, 2, 3, 4],
        edges: complete(4),
        initiators: [3],
        F: 1,
        bits: [1, 1, 1, 1],
        faulty: [3],
      },
    ];
  if (protocol === "two-steps")
    return [
      {
        id: "intact",
        title: "Completo integro, F=1",
        ids: [1, 2, 3, 4, 5],
        edges: complete(5),
        initiators: [0],
        F: 1,
      },
      {
        id: "broken",
        title: "Collegamento 1–2 omesso",
        ids: [1, 2, 3, 4, 5],
        edges: complete(5),
        initiators: [0],
        F: 1,
        failed: [[0, 1]],
      },
    ];
  if (["saturation", "tree-election", "rooted-collection"].includes(protocol))
    return [
      base("tree", "Un iniziatore, albero a cinque nodi", tree),
      {
        ...base("multi", "Due iniziatori e ritardi diversi", tree),
        initiators: [0, 4],
        delayed: true,
      },
    ];
  if (
    [
      "all-the-way",
      "lcr",
      "controlled-distance",
      "speeding",
      "waiting",
      "random-election",
    ].includes(protocol)
  ) {
    const edges = ring(5, protocol !== "controlled-distance");
    return [
      {
        ...base("simultaneous", "Avvio simultaneo, ID crescenti", edges),
        ids: [1, 2, 3, 4, 5],
        initiators: [0, 1, 2, 3, 4],
        seed: 17,
      },
      {
        ...base("progressive", "Solo il minimo iniziatore", edges),
        ids: [1, 3, 5, 2, 4],
        initiators: [0],
        progressive: true,
        seed: 91,
      },
      {
        ...base("permuted", "ID permutati", edges),
        ids: [3, 5, 1, 4, 2],
        initiators: [0, 1, 2, 3, 4],
        delayed: ["all-the-way", "lcr", "controlled-distance"].includes(
          protocol,
        ),
        seed: 123,
      },
    ];
  }
  if (protocol === "wflood")
    return [
      base("single", "Un iniziatore"),
      { ...base("multi", "Due iniziatori simultanei"), initiators: [0, 4] },
      { ...base("all", "Tutti iniziatori"), initiators: [0, 1, 2, 3, 4] },
    ];
  if (protocol === "simple-broadcast")
    return [base("complete", "Completo noto", complete(5))];
  const localGraph =
    protocol === "min-hop"
      ? graph.map((edge) => ({ ...edge, weight: 1 }))
      : graph;
  return [
    base("unit", "Ritardi unitari", localGraph),
    {
      ...base(
        "delayed",
        ["floodmax", "iterating", "universal-waiting"].includes(protocol)
          ? "Stesso modello unitario, altra attivazione"
          : "Ritardi diversi (scelta della simulazione)",
        localGraph,
      ),
      delayed: !["floodmax", "iterating", "universal-waiting"].includes(
        protocol,
      ),
      initiators: protocol === "universal-waiting" ? [4] : [0],
    },
    base("tree", "Albero", tree),
  ];
}
export function random(seed: number) {
  let x = seed >>> 0;
  return () => {
    x = (Math.imul(1664525, x) + 1013904223) >>> 0;
    return x / 4294967296;
  };
}
