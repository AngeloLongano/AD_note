import assert from "node:assert/strict";
import type { Engine, Trace } from "../src/lib/cookbook/engine";
import { configure } from "../src/lib/cookbook/diffusion";
import {
  crashConsensus,
  benOr,
  registeredMail,
} from "../src/lib/cookbook/consensus";
import {
  complete,
  random,
  scenarios,
  type Scenario,
} from "../src/lib/cookbook/scenarios";

function run(p: string, s: Scenario, extra?: (e: Engine) => void): Trace {
  const e = configure(s);
  extra?.(e);
  if (p === "ben-or") benOr(e, s);
  else if (p.startsWith("tellzero-byz") || p === "registered-mail")
    registeredMail(e, s, p !== "registered-mail");
  else crashConsensus(e, s, p === "tellzero-crash");
  return e.run("test", "", 3000);
}
function validate(p: string, s: Scenario, extra?: (e: Engine) => void) {
  const t = run(p, s, extra),
    f = t.frames.at(-1)!,
    n = s.ids.length,
    F = s.F ?? 1;
  const correct = f.nodes.filter((v) => !s.faulty?.includes(v.id));
  assert(t.complete, `${p}: finite demonstrated execution`);
  assert(t.result, `${p}: explicit result`);
  if (p !== "ben-or") assert.equal(f.pending.length, 0);
  const messages = t.frames.flatMap((frame) =>
    frame.events
      .filter((event) => event.type === "send")
      .map((event) => event.message!),
  );
  if (p === "registered-mail") {
    const accepted = correct.map((v) => v.data.accepted.length > 0);
    assert(
      accepted.every((v) => v === accepted[0]),
      "registered-mail acceptance agreement",
    );
    if (!s.faulty?.includes(s.initiators[0]!) && s.id !== "allones") {
      assert(accepted.every(Boolean));
      assert(
        t.frames.find((frame) =>
          frame.nodes
            .filter((v) => !s.faulty?.includes(v.id))
            .every((v) => v.data.accepted.length),
        )!.time <= 2,
      );
    }
    return t;
  }
  assert(
    correct.every((v) => [0, 1].includes(v.data.decision)),
    `${p}: every correct node decides`,
  );
  assert(
    correct.every((v) => v.data.decision === correct[0]!.data.decision),
    `${p}: agreement`,
  );
  if (s.bits!.every((v) => v === s.bits![0]))
    assert(
      correct.every((v) => v.data.decision === s.bits![0]),
      `${p}: unanimous validity`,
    );
  if (p === "ben-or") {
    assert(correct.every((v) => v.state === "DECIDED / PARTICIPATING"));
    assert(
      correct.every((v) => v.data.completedRound > v.data.decisionRound),
      "extra round after decision is observed",
    );
    assert(
      f.pending.length > 0,
      "while-true protocol continues after observation",
    );
    assert(/osservazione/.test(t.result));
    for (const v of correct)
      for (const box of Object.values(v.data.mail) as {
        order: number[];
        values: Record<number, number>;
      }[]) {
        assert.equal(
          new Set(box.order).size,
          box.order.length,
          "distinct quorum senders",
        );
        assert.equal(Object.keys(box.values).length, box.order.length);
      }
    const definiteByRound = new Map<number, Set<number>>();
    for (const m of messages.filter(
      (m) => m.kind === "Propose" && m.data.v !== "?",
    )) {
      if (!definiteByRound.has(m.data.r))
        definiteByRound.set(m.data.r, new Set());
      definiteByRound.get(m.data.r)!.add(m.data.v);
    }
    assert(
      [...definiteByRound.values()].every((v) => v.size === 1),
      "no opposing definite Propose values in a round",
    );
  } else if (p === "tellzero-byz") {
    assert(correct.every((v) => v.state === "DECIDED"));
    assert.equal(f.time, 2 * (F + 2));
    const orig = messages.filter(
      (m) =>
        m.kind === "init" && m.from !== m.to && !s.faulty?.includes(m.from),
    );
    for (const id of correct.map((v) => v.id)) {
      const times = new Set(
        orig.filter((m) => m.from === id).map((m) => m.data.t),
      );
      assert(times.size <= 1, "one origin per correct identity");
      for (const time of times) assert(time % 2 === 0 && time <= 2 * (F + 1));
    }
    assert(
      f.sends <= n * (n - 1) * (n + 1),
      "nonfaulty origins and omission adversary stay within cubic sends",
    );
  } else {
    assert(correct.every((v) => v.state === "DECIDED"));
    assert.equal(f.time, F + 1);
    assert(
      f.nodes
        .filter((v) => s.faulty?.includes(v.id))
        .every((v) => v.state === "CRASHED"),
    );
    if (p === "tellall") {
      assert(f.sends <= n * (n - 1) * (F + 1));
      if (!s.faulty?.length) assert.equal(f.sends, n * (n - 1) * (F + 1));
    } else {
      assert(f.sends <= n * (n - 1));
      assert(messages.every((m) => m.data.v === 0));
      for (let id = 0; id < n; id++)
        assert(messages.filter((m) => m.from === id).length <= n - 1);
      if (s.bits!.every((v) => v === 1)) assert.equal(f.sends, 0);
    }
  }
  return t;
}
function* subsets(
  values: number[],
  k: number,
  offset = 0,
  prefix: number[] = [],
): Generator<number[]> {
  if (!k) {
    yield prefix;
    return;
  }
  for (let i = offset; i <= values.length - k; i++)
    yield* subsets(values, k - 1, i + 1, [...prefix, values[i]!]);
}
const scenario = (
  n: number,
  F: number,
  mask: number,
  faulty: number[],
  seed = 17,
): Scenario => ({
  id: "exhaustive",
  title: "",
  ids: Array.from({ length: n }, (_, i) => i + 1),
  edges: complete(n),
  initiators: [0],
  F,
  bits: Array.from({ length: n }, (_, i) => (mask >> i) & 1),
  faulty,
  seed,
});

export function testConsensus() {
  let checks = 0;
  const check = (p: string, s: Scenario, extra?: (e: Engine) => void) => {
    checks++;
    return validate(p, s, extra);
  };
  for (const p of [
    "tellall",
    "tellzero-crash",
    "ben-or",
    "registered-mail",
    "tellzero-byz",
  ])
    for (const s of scenarios(p)) check(p, s);
  // Every bit vector, crash budget and first-round crash subset on K1..K4.
  for (let n = 1; n <= 4; n++)
    for (let F = 0; F < n; F++)
      for (let count = 0; count <= F; count++) {
        for (const faulty of subsets(
          Array.from({ length: n }, (_, i) => i),
          count,
        ))
          for (let mask = 0; mask < 2 ** n; mask++)
            for (const p of ["tellall", "tellzero-crash"])
              check(p, scenario(n, F, mask, faulty));
      }
  // Mixed bits, silence at crash, multiple seeds and asynchronous reorderings.
  let buffered = false,
    stale = false,
    arrivalOrder = false;
  for (let n = 1; n <= 5; n++)
    for (let F = 0; F < n / 2; F++)
      for (const faulty of [[], Array.from({ length: F }, (_, i) => i)]) {
        for (let mask = 0; mask < 2 ** n; mask++)
          for (const seed of [3, 17, 91]) {
            const t = check(
              "ben-or",
              scenario(n, F, mask, faulty, seed),
              (e) => {
                const rng = random(seed);
                e.delay = () => 1 + Math.floor(rng() * 30);
              },
            );
            buffered ||= t.frames.some((f) =>
              f.events.some((v) => v.text.includes("round futuro")),
            );
            stale ||= t.frames.some((f) =>
              f.events.some(
                (v) => v.type === "discard" && v.text.includes("round vecchio"),
              ),
            );
            arrivalOrder ||= t.frames
              .at(-1)!
              .nodes.some((v) =>
                Object.values(v.data.mail).some((b: any) =>
                  b.order.some(
                    (sender: number, i: number) =>
                      i > 0 && sender < b.order[i - 1],
                  ),
                ),
              );
          }
      }
  assert(
    buffered && stale && arrivalOrder,
    "future buffering, arrival order and stale-round rejection actually exercised",
  );
  // Regression: two early deciders previously stopped before three late nodes
  // could complete their additional round (seed 3 random 1..30 delays).
  check(
    "ben-or",
    { ...scenario(5, 1, 28, [], 3), bits: [0, 0, 1, 1, 1] },
    (e) => {
      const rng = random(3);
      e.delay = () => 1 + Math.floor(rng() * 30);
    },
  );
  for (const n of [1, 4, 5, 7]) {
    const F = Math.floor((n - 1) / 3);
    for (const faulty of [[], Array.from({ length: F }, (_, i) => n - 1 - i)])
      for (let mask = 0; mask < 2 ** n; mask++)
        check("tellzero-byz", scenario(n, F, mask, faulty));
  }
  // Acceptance at t=2 must be consumed by the stage at t=2 itself.
  const boundary = check("tellzero-byz", scenario(4, 1, 12, [3]));
  assert(
    boundary.frames
      .flatMap((f) => f.events)
      .some(
        (v) =>
          v.type === "send" &&
          v.message!.kind === "init" &&
          v.message!.from === 2 &&
          v.message!.sent === 2,
      ),
  );
  assert(
    boundary.frames
      .at(-1)!
      .nodes.slice(0, 3)
      .every((v) => v.data.decision === 0),
  );
  // A Byzantine channel cannot forge init origin, use invalid timestamps,
  // count repeated echo as distinct senders, or introduce arbitrary types.
  const adversarial = { ...scenario(4, 1, 15, [3]), id: "allones" };
  const attacks = check("registered-mail", adversarial, (e) =>
    e.at(0, () => {
      e.send(3, 0, "init", { origin: 1, t: 0 });
      e.send(3, 0, "init", { origin: 3, t: 2 });
      e.send(3, 0, "echo", { origin: 3, t: 0 });
      e.send(3, 0, "garbage", { origin: 3, t: 0 });
      e.at(1, () => {
        for (let i = 0; i < 4; i++) e.send(3, 0, "echo", { origin: 3, t: 0 });
      });
    }),
  );
  const discards = attacks.frames
    .flatMap((f) => f.events)
    .filter((v) => v.type === "discard")
    .map((v) => v.text)
    .join("\n");
  for (const reason of [
    "init non diretto o fuori tempo",
    "echo troppo presto",
    "echo duplicato",
    "tipo di messaggio incoerente",
  ])
    assert(discards.includes(reason));
  assert(
    attacks.frames
      .at(-1)!
      .nodes.slice(0, 3)
      .every((v) => !v.data.accepted.length),
  );
  const repeated = check("registered-mail", adversarial, (e) =>
    e.at(0, () => {
      e.send(3, 0, "init", { origin: 3, t: 0 });
      e.at(2, () => e.send(3, 0, "init", { origin: 3, t: 2 }));
    }),
  );
  assert(
    repeated.frames.some((f) =>
      f.events.some(
        (v) =>
          v.type === "discard" &&
          v.text.includes("nuova origine della stessa identità"),
      ),
    ),
  );
  // A real message delivered twice still contributes one crash-only sender.
  const duplicate = check("ben-or", scenario(5, 1, 31, []), (e) =>
    e.at(0, () => {
      for (let i = 0; i < 5; i++) e.send(0, 1, "MyValue", { r: 1, v: 1 });
    }),
  );
  assert(
    duplicate.frames.some((f) =>
      f.events.some(
        (v) => v.type === "discard" && v.text.includes("mittente già contato"),
      ),
    ),
  );
  return { suite: "consensus", checks };
}
