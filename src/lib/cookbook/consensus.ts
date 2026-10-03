import { Engine } from "./engine";
import { random, type Scenario } from "./scenarios";
export function crashConsensus(e: Engine, s: Scenario, onlyZero: boolean) {
  const F = s.F ?? 1;
  const faulty = new Set(s.faulty ?? []);
  for (const node of e.nodes) {
    e.update(node.id, "ACTIVE", {
      value: s.bits![node.id],
      received: [],
      sentZero: false,
    });
    e.on(node.id, (m) => {
      if (node.state !== "CRASHED") node.data.received.push(m.data.v);
      else e.discard(m, "destinatario già in crash");
    });
  }
  function round(r: number) {
    e.phase = `${onlyZero ? "Solo zero" : "TellAll_Crash"}: round ${r}/${F + 1}`;
    for (const node of e.nodes) {
      node.data.received = [];
      if (node.state === "CRASHED") continue;
      if (onlyZero && (node.data.value !== 0 || node.data.sentZero)) {
        if (faulty.has(node.id) && r === 1)
          e.update(node.id, "CRASHED", {}, "crash prima di qualsiasi invio");
        continue;
      }
      node.data.sentZero = node.data.value === 0;
      if (faulty.has(node.id) && r === 1) {
        const to = e.nodes.find((v) => v.id !== node.id);
        if (to) e.send(node.id, to.id, "Report", { v: node.data.value, r });
        e.update(node.id, "CRASHED", {}, "crash dopo un invio parziale");
      } else e.broadcast(node.id, "Report", { v: node.data.value, r });
    }
    e.after(1, () => {
      for (const node of e.nodes)
        if (node.state !== "CRASHED") {
          const v = Math.min(node.data.value, ...node.data.received);
          e.update(
            node.id,
            r === F + 1 ? "DECIDED" : "ACTIVE",
            { value: v, round: r, ...(r === F + 1 ? { decision: v } : {}) },
            "assenza entro fine round vale 1",
          );
        }
      if (r <= F) round(r + 1);
      else
        e.result =
          "F+1 round conclusi: agreement fra tutti i nodi non in crash.";
    });
  }
  e.at(0, () => round(1));
}
export function benOr(e: Engine, s: Scenario) {
  const n = e.nodes.length,
    F = s.F ?? 1;
  const rng = random(s.seed ?? 17);
  const faulty = new Set(s.faulty ?? []);
  for (const node of e.nodes)
    Object.assign(node.data, {
      value: s.bits![node.id],
      round: 1,
      phase: "MyValue",
      mail: {},
      decision: null,
      decisionRound: null,
      completedRound: 0,
    });
  // This is a visualization stop condition, never a predicate used by a node.
  // The official while-true protocol keeps participating after deciding.
  e.stopWhen = () => {
    const observed = e.nodes
      .filter((v) => !faulty.has(v.id))
      .every(
        (v) =>
          v.data.decision !== null &&
          v.data.completedRound > v.data.decisionRound,
      );
    if (observed)
      e.result =
        "Tutti i corretti hanno deciso e completato un round ulteriore. Si chiude l’osservazione; il protocollo continua a partecipare dopo la decisione.";
    return observed;
  };
  function sendValue(id: number) {
    const node = e.node(id);
    e.update(
      id,
      node.data.decision === null ? "PROPOSE" : "DECIDED / PARTICIPATING",
      {},
      `round ${node.data.round}`,
    );
    e.broadcast(
      id,
      "MyValue",
      { r: node.data.round, v: node.data.value },
      true,
    );
    consume(id);
  }
  function consume(id: number) {
    const node = e.node(id);
    if (node.state === "CRASHED") return;
    const d = node.data;
    const key = `${d.round}:${d.phase}`;
    const box = d.mail[key];
    const entries: (number | "?")[] = box
      ? box.order.map((sender: number) => box.values[sender])
      : [];
    if (entries.length < n - F) {
      e.update(id, node.state, {
        waiting: `${entries.length}/${n - F} ${d.phase}`,
      });
      return;
    }
    // First n−F distinct senders define this local quorum. Later arrivals
    // cannot retroactively alter the value chosen in that phase.
    const q = entries.slice(0, n - F);
    if (d.phase === "MyValue") {
      const zeros = q.filter((v) => v === 0).length,
        ones = q.filter((v) => v === 1).length;
      const v = zeros > n / 2 ? 0 : ones > n / 2 ? 1 : "?";
      d.phase = "Propose";
      e.update(id, d.decision === null ? "ADAPT" : "DECIDED / PARTICIPATING", {
        proposal: v,
        waiting: `0/${n - F} Propose`,
      });
      e.broadcast(id, "Propose", { r: d.round, v }, true);
      consume(id);
    } else {
      const definite = q.filter((v) => v === 0 || v === 1);
      const v = definite[0] ?? Math.floor(rng() * 2);
      d.value = v;
      const count = definite.filter((x: number) => x === v).length;
      if (count >= F + 1 && d.decision === null) {
        d.decision = v;
        d.decisionRound = d.round;
      }
      e.update(
        id,
        d.decision === null ? "ACTIVE" : "DECIDED / PARTICIPATING",
        { value: v, decision: d.decision, waiting: null },
        definite.length
          ? `adozione ${v}; ${count} Propose definiti`
          : `moneta → ${v}`,
      );
      d.completedRound = d.round;
      d.round++;
      d.phase = "MyValue";
      sendValue(id);
    }
  }
  for (const node of e.nodes)
    e.on(node.id, (m) => {
      const d = node.data;
      if (node.state === "CRASHED") {
        e.discard(m, "nodo in crash");
        return;
      }
      if (
        !["MyValue", "Propose"].includes(m.kind) ||
        !Number.isInteger(m.data.r) ||
        m.data.r < 1 ||
        ![0, 1, ...(m.kind === "Propose" ? ["?"] : [])].includes(m.data.v)
      ) {
        e.discard(m, "tipo, round o valore incoerente");
        return;
      }
      if (m.data.r < d.round) {
        e.discard(m, "round vecchio");
        return;
      }
      const key = `${m.data.r}:${m.kind}`;
      d.mail[key] ??= { order: [], values: {} };
      const box = d.mail[key];
      if (box.values[m.from] !== undefined) {
        e.discard(m, "mittente già contato");
        return;
      }
      box.values[m.from] = m.data.v;
      box.order.push(m.from);
      if (m.data.r > d.round)
        e.events.push({
          type: "update",
          text: `${node.label}: conserva ${m.kind} per il round futuro ${m.data.r}`,
        });
      consume(node.id);
    });
  e.at(0, () => {
    e.phase = "Ben-Or: round locali, quorum e monete";
    for (const node of e.nodes) {
      if (faulty.has(node.id)) e.update(node.id, "CRASHED");
      else sendValue(node.id);
    }
  });
}
/** RegisteredMail tracks distinct senders per (origin,time). Identity checks
 * use channel provenance, never a global count of correct nodes. */
export function registeredMail(e: Engine, s: Scenario, tellZero: boolean) {
  const n = e.nodes.length,
    F = s.F ?? 1;
  const faulty = new Set(s.faulty ?? []);
  e.selfDelay = 1;
  for (const node of e.nodes)
    Object.assign(node.data, { accepted: [], mail: {}, originated: false });
  function echo(id: number, origin: number, t: number) {
    const node = e.node(id),
      key = `${origin}:${t}`;
    const rec = node.data.mail[key];
    if (rec.echoed) return;
    rec.echoed = true;
    e.update(
      id,
      "ECHO",
      { accepted: node.data.accepted },
      `echo origine ${e.node(origin).label}`,
    );
    e.broadcast(id, "echo", { origin, t }, true);
  }
  function originate(id: number, t: number) {
    const node = e.node(id);
    if (node.data.originated) return;
    node.data.originated = true;
    if (faulty.has(id)) {
      // Explicit adversarial scenario: authenticated Byzantine origin sends
      // a valid init to only one correct recipient, and no echoes.
      if (s.id === "equivocation") e.send(id, 0, "init", { origin: id, t });
      e.update(id, "BYZANTINE", {}, "init parziale / omissioni degli echo");
    } else {
      e.update(id, "ORIGIN");
      e.broadcast(id, "init", { origin: id, t }, true);
    }
  }
  for (const node of e.nodes)
    e.on(node.id, (m) => {
      if (faulty.has(node.id)) {
        e.discard(m, "il bizantino omette la risposta");
        return;
      }
      if (tellZero && node.state === "DECIDED") {
        e.discard(m, "decisione finale già presa");
        return;
      }
      if (m.kind !== "init" && m.kind !== "echo") {
        e.discard(m, "tipo di messaggio incoerente");
        return;
      }
      const { origin, t } = m.data;
      const key = `${origin}:${t}`;
      if (
        !Number.isInteger(origin) ||
        origin < 0 ||
        origin >= n ||
        !Number.isInteger(t) ||
        t < 0 ||
        (tellZero && t % 2 !== 0)
      ) {
        e.discard(m, "origine o tempo incoerente");
        return;
      }
      node.data.mail[key] ??= { echoed: false, senders: [] };
      const rec = node.data.mail[key];
      if (m.kind === "init") {
        if (m.from !== origin || e.time !== t + 1) {
          e.discard(m, "init non diretto o fuori tempo");
          return;
        }
        // Ignore repeated origins (each identity may start at most once).
        if (
          node.data.originTime?.[origin] !== undefined &&
          node.data.originTime[origin] !== t
        ) {
          e.discard(m, "nuova origine della stessa identità");
          return;
        }
        node.data.originTime ??= {};
        node.data.originTime[origin] = t;
        echo(node.id, origin, t);
      } else {
        if (e.time < t + 2) {
          e.discard(m, "echo troppo presto");
          return;
        }
        if (rec.senders.includes(m.from)) {
          e.discard(m, "echo duplicato");
          return;
        }
        rec.senders.push(m.from);
        if (rec.senders.length >= F + 1) echo(node.id, origin, t);
        if (
          rec.senders.length >= n - F &&
          !node.data.accepted.includes(origin)
        ) {
          node.data.accepted.push(origin);
          e.update(
            node.id,
            "ACCEPTED",
            {},
            `${n - F} echo: accetta origine ${e.node(origin).label}`,
          );
        }
      }
      if (
        !tellZero &&
        e.nodes
          .filter((v) => !faulty.has(v.id))
          .every((v) => v.data.accepted.length)
      )
        e.result =
          "Proposta accettata da tutti i corretti; echo da mittenti distinti.";
    });
  e.at(0, () => {
    e.phase = tellZero
      ? "TellZero_Byz: origini iniziali e stage"
      : "RegisteredMail: init → echo → accettazione";
    for (const node of e.nodes) {
      if (faulty.has(node.id)) e.update(node.id, "BYZANTINE");
      else e.update(node.id, "WAITING");
    }
    if (tellZero) {
      for (const node of e.nodes)
        if (s.bits![node.id] === 0) originate(node.id, 0);
      for (let i = 1; i <= F + 1; i++)
        e.at(2 * i, () =>
          e.at(e.time, () => {
            e.phase = `Stage ${i}: soglia >${F + i - 1}`;
            for (const node of e.nodes)
              if (
                !faulty.has(node.id) &&
                !node.data.originated &&
                node.data.accepted.length > F + i - 1
              )
                originate(node.id, 2 * i);
          }),
        );
      e.at(2 * (F + 2), () => {
        // Deliveries at the boundary must be processed before testing it.
        e.at(e.time, () => {
          e.phase = "Decisione finale";
          for (const node of e.nodes)
            if (!faulty.has(node.id))
              e.update(
                node.id,
                "DECIDED",
                { decision: node.data.accepted.length >= 2 * F + 1 ? 0 : 1 },
                `${node.data.accepted.length} origini accettate; soglia ${2 * F + 1}`,
              );
          e.result = "Decisione a 2(F+2); agreement fra nodi corretti.";
        });
      });
    } else {
      if (s.id !== "allones") originate(s.initiators[0]!, 0);
      e.at(4, () => {
        if (!e.result)
          e.result =
            "Nessun corretto accetta: gli echo insufficienti non creano una proposta.";
      });
    }
  });
}
