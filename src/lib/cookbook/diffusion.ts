import { Engine } from "./engine";
import type { Scenario } from "./scenarios";
export function configure(s: Scenario) {
  const e = new Engine(s.ids, s.edges);
  if (s.delayed) e.delay = (a, b) => 1 + ((a * 3 + b * 2) % 3);
  e.fails = (a, b) =>
    !!s.failed?.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  return e;
}
export function flooding(
  e: Engine,
  s: Scenario,
  kind = "I",
  done?: () => void,
) {
  const active = new Set<number>();
  function wake(id: number, parent?: number) {
    if (active.has(id)) return;
    active.add(id);
    e.update(id, kind === "W" ? "AWAKE" : "DONE", {
      parent: parent ?? null,
      known: kind,
    });
    for (const to of e.neighbours(id)) if (to !== parent) e.send(id, to, kind);
    if (active.size === e.nodes.length) {
      e.result =
        kind === "W"
          ? "Tutti AWAKE; nessun nodo rileva la fine globale."
          : "Tutti conoscono I; DONE è locale. Le copie residue vengono scartate.";
      done?.();
    }
  }
  for (const n of e.nodes)
    e.on(n.id, (m) =>
      active.has(n.id) ? e.discard(m, "già attivo") : wake(n.id, m.from),
    );
  e.at(0, () => {
    e.phase = "Attivazione e diffusione";
    for (const id of s.initiators) wake(id);
  });
}
export function shout(
  e: Engine,
  s: Scenario,
  plus: boolean,
  done?: () => void,
) {
  let finished = 0;
  function check(id: number) {
    const n = e.node(id);
    if (
      n.data.answered.length === e.neighbours(id).length &&
      n.state !== "DONE"
    ) {
      e.update(id, "DONE", {}, "tutti i vicini classificati");
      if (++finished === e.nodes.length) {
        e.result =
          "Spanning tree completo; DONE locale, senza rilevazione globale.";
        done?.();
      }
    }
  }
  function activate(id: number, parent?: number) {
    e.update(id, "ACTIVE", {
      parent: parent ?? null,
      children: [],
      answered: parent === undefined ? [] : [parent],
      counter: parent === undefined ? 0 : 1,
    });
    if (parent !== undefined) e.send(id, parent, "YES");
    for (const to of e.neighbours(id)) if (to !== parent) e.send(id, to, "Q");
    check(id);
  }
  for (const n of e.nodes)
    e.on(n.id, (m) => {
      if (m.kind === "Q" && n.state === "SLEEPING") {
        activate(n.id, m.from);
        return;
      }
      if (m.kind === "Q") {
        if (plus) {
          if (!n.data.answered.includes(m.from)) n.data.answered.push(m.from);
          e.discard(m, "Q incrociata: rifiuto implicito");
        } else e.send(n.id, m.from, "NO");
      } else {
        if (m.kind === "YES") n.data.children.push(m.from);
        if (!n.data.answered.includes(m.from)) n.data.answered.push(m.from);
      }
      e.update(n.id, n.state, { counter: n.data.answered.length });
      check(n.id);
    });
  e.at(0, () => {
    e.phase = plus
      ? "SHOUT+: classificazione Q/YES o Q/Q"
      : "SHOUT: richieste e risposte FIFO";
    activate(s.initiators[0]!);
  });
}
export function dft(e: Engine, s: Scenario, ack: boolean) {
  const root = s.initiators[0]!;
  for (const n of e.nodes)
    Object.assign(n.data, {
      unvisited: e.neighbours(n.id),
      seen: [],
      children: [],
      parent: null,
    });
  function visit(id: number) {
    const n = e.node(id);
    const to = n.data.unvisited.shift();
    if (to !== undefined) {
      e.update(id, "VISITED", { waiting: to });
      e.send(id, to, "ForwardToken");
    } else {
      e.update(id, "DONE", { waiting: null });
      if (id === root)
        e.result =
          "Il token è tornato: la radice rileva la fine globale della visita.";
      else e.send(id, n.data.parent, "ReturnToken");
    }
  }
  function first(id: number, parent?: number) {
    const n = e.node(id);
    n.data.unvisited = n.data.unvisited.filter(
      (v: number) => v !== parent && !n.data.seen.includes(v),
    );
    e.update(id, "VISITED", { parent: parent ?? null });
    if (ack) {
      const dest = e.neighbours(id).filter((v) => v !== parent);
      n.data.acks = dest;
      for (const v of dest) e.send(id, v, "Visited");
      if (!dest.length) visit(id);
    } else visit(id);
  }
  for (const n of e.nodes)
    e.on(n.id, (m) => {
      if (m.kind === "Visited") {
        n.data.seen.push(m.from);
        n.data.unvisited = n.data.unvisited.filter((v: number) => v !== m.from);
        e.send(n.id, m.from, "Ack");
        return;
      }
      if (m.kind === "Ack") {
        n.data.acks = n.data.acks.filter((v: number) => v !== m.from);
        e.update(n.id, "VISITED", {}, `attende ${n.data.acks.length} Ack`);
        if (!n.data.acks.length) visit(n.id);
        return;
      }
      if (m.kind === "ForwardToken") {
        if (n.state === "SLEEPING") first(n.id, m.from);
        else {
          n.data.unvisited = n.data.unvisited.filter(
            (v: number) => v !== m.from,
          );
          e.send(n.id, m.from, "BackEdgeToken");
        }
      } else {
        if (m.kind === "ReturnToken") n.data.children.push(m.from);
        visit(n.id);
      }
    });
  e.at(0, () => {
    e.phase = ack
      ? "DFT: handshake paralleli, token sequenziale"
      : "DFT: un token sequenziale";
    first(root);
  });
}
export function saturation(e: Engine, s: Scenario, pair: boolean) {
  function resolve(id: number, v: number, from: number) {
    const n = e.node(id);
    if (n.data.resolved) return;
    n.data.resolved = true;
    e.update(id, pair ? (n.data.own === v ? "LEADER" : "FOLLOWER") : "DONE", {
      result: v,
    });
    for (const to of e.neighbours(id))
      if (to !== from) e.send(id, to, "Resolution", { v });
  }
  function ready(id: number) {
    const n = e.node(id);
    const others = e
      .neighbours(id)
      .filter((v) => n.data.received[v] === undefined);
    // A singleton already knows the result; there is no saturated pair.
    if (!e.neighbours(id).length && !n.data.resolved) {
      resolve(id, n.data.own, -1);
      e.result = pair
        ? "Unico nodo: è leader senza scambi."
        : "Unico nodo: conosce già il minimo globale.";
      return;
    }
    if (others.length === 1 && n.data.out === undefined) {
      n.data.out = others[0];
      const v = pair
        ? n.data.own
        : Math.min(n.data.own, ...(Object.values(n.data.received) as number[]));
      e.update(
        id,
        "PROCESSING",
        { aggregate: v },
        "ricevuto da tutti tranne uno",
      );
      e.send(id, others[0]!, "Saturation", { v });
    }
    if (!others.length && n.data.out !== undefined && !n.data.resolved) {
      const v = pair
        ? Math.min(n.data.own, n.data.received[n.data.out])
        : Math.min(n.data.own, ...(Object.values(n.data.received) as number[]));
      e.update(id, "SATURATED", {}, "la coppia finale ha ricevuto da tutti");
      resolve(id, v, n.data.out);
    }
    if (e.nodes.every((v) => v.data.resolved))
      e.result = pair
        ? "Un leader: minimo della coppia saturata (non necessariamente minimo globale)."
        : "Minimo globale ricevuto da tutti.";
  }
  function wake(id: number, from?: number) {
    const n = e.node(id);
    if (n.state !== "SLEEPING") return;
    e.update(id, "AWAKE", { received: {}, resolved: false });
    for (const v of e.neighbours(id)) if (v !== from) e.send(id, v, "W");
    ready(id);
  }
  for (const n of e.nodes)
    e.on(n.id, (m) => {
      if (m.kind === "W") {
        if (n.state === "SLEEPING") wake(n.id, m.from);
        else e.discard(m, "già sveglio");
      } else if (m.kind === "Saturation") {
        if (n.state === "SLEEPING") wake(n.id, m.from);
        n.data.received[m.from] = m.data.v;
        ready(n.id);
      } else resolve(n.id, m.data.v, m.from);
      if (e.nodes.every((v) => v.data.resolved))
        e.result = pair
          ? "Un leader: minimo della coppia saturata."
          : "Minimo globale ricevuto da tutti.";
    });
  e.at(0, () => {
    e.phase = "Wake-up → saturazione → risoluzione";
    for (const id of s.initiators) wake(id);
  });
}
export function twoSteps(e: Engine, s: Scenario) {
  const root = s.initiators[0]!;
  for (const n of e.nodes)
    e.on(n.id, (m) => {
      if (n.state === "DONE") e.discard(m, "copia ridondante");
      else e.update(n.id, "DONE", { known: "I" });
      if (m.from === root && !n.data.forwarded) {
        n.data.forwarded = true;
        for (const to of e.neighbours(n.id))
          if (to !== root) e.send(n.id, to, "I");
      }
      if (e.nodes.every((v) => v.state === "DONE"))
        e.result = "Tutti ricevono I, nonostante le omissioni ammesse.";
    });
  e.at(0, () => {
    e.phase = "TwoSteps: solo gli intermediari diretti inoltrano";
    e.update(root, "DONE", { known: "I" });
    for (const to of e.neighbours(root).slice(0, (s.F ?? 0) + 1))
      e.send(root, to, "I");
  });
}
