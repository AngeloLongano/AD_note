import { Engine, type Message } from "./engine";
import { random, type Scenario } from "./scenarios";
const next = (id: number, n: number, d = 1) => (id + d + n) % n;
export function allTheWay(e: Engine, s: Scenario) {
  const n = e.nodes.length;
  function activate(id: number) {
    const v = e.node(id);
    if (v.state !== "SLEEPING") return;
    e.update(id, "ACTIVE", { minimum: v.data.own, received: [], size: null });
    e.send(id, next(id, n), "ID", { v: v.data.own, hops: 1 });
  }
  for (const v of e.nodes)
    e.on(v.id, (m) => {
      activate(v.id);
      v.data.minimum = Math.min(v.data.minimum, m.data.v);
      if (!v.data.received.includes(m.data.v)) v.data.received.push(m.data.v);
      if (m.data.v === v.data.own) v.data.size = m.data.hops;
      else
        e.send(v.id, next(v.id, n), "ID", {
          v: m.data.v,
          hops: m.data.hops + 1,
        });
      e.update(
        v.id,
        "ACTIVE",
        { counter: v.data.received.length },
        `min=${v.data.minimum}; n=${v.data.size ?? "?"}`,
      );
      if (v.data.size !== null && v.data.received.length === v.data.size)
        e.update(v.id, v.data.minimum === v.data.own ? "LEADER" : "FOLLOWER");
      if (e.nodes.every((x) => ["LEADER", "FOLLOWER"].includes(x.state)))
        e.result =
          "Tutti hanno ricevuto n ID; un leader, senza notifica aggiuntiva.";
    });
  e.at(0, () => {
    e.phase = "Token concorrenti: ogni ID compie un giro";
    s.initiators.forEach(activate);
  });
}
export function lcr(e: Engine, s: Scenario, speed = false) {
  const n = e.nodes.length;
  function forward(id: number, v: number) {
    if (!speed) {
      e.send(id, next(id, n), "ID", { v });
      return;
    }
    const node = e.node(id);
    const due = e.time + 2 ** v;
    node.data.queue ??= [];
    node.data.queue.push({ v, due });
    e.update(id, node.state, {}, `ID ${v} in attesa fino a t=${due}`);
    e.at(due, () => {
      node.data.queue = node.data.queue.filter(
        (q: { v: number; due: number }) => q.v !== v || q.due !== due,
      );
      if (["LEADER", "FOLLOWER"].includes(node.state)) return;
      // Synchronous model: reserve at most one transmission per outgoing link
      // per tick. Multiple locally queued IDs remain explicit.
      const sendAt = Math.max(e.time, node.data.nextSlot ?? 0);
      node.data.nextSlot = sendAt + 1;
      e.at(sendAt, () => {
        if (!["LEADER", "FOLLOWER"].includes(node.state))
          e.send(id, next(id, n), "ID", { v });
      });
    });
  }
  function activate(id: number, v?: number) {
    const node = e.node(id);
    if (node.state !== "SLEEPING") return;
    e.update(id, "ACTIVE", { minimum: node.data.own });
    if (v === undefined || v > node.data.own) forward(id, node.data.own);
  }
  for (const node of e.nodes)
    e.on(node.id, (m) => {
      if (m.kind === "Notify") {
        if (node.state === "LEADER") {
          e.result =
            "Notifica tornata al leader: tutti follower, tranne il minimo.";
          return;
        }
        e.update(node.id, "FOLLOWER", { leader: m.data.v, queue: [] });
        e.send(node.id, next(node.id, n), "Notify", m.data);
        return;
      }
      if (["LEADER", "FOLLOWER"].includes(node.state)) {
        e.discard(m, "elezione conclusa");
        return;
      }
      activate(node.id, m.data.v);
      if (m.data.v === node.data.own) {
        e.update(node.id, "LEADER", { leader: m.data.v, queue: [] });
        e.phase = "Notifica finale";
        e.send(node.id, next(node.id, n), "Notify", m.data);
      } else if (m.data.v < node.data.minimum) {
        node.data.minimum = m.data.v;
        forward(node.id, m.data.v);
        e.update(node.id, "ACTIVE", {}, `minimo visto ${m.data.v}`);
      } else e.discard(m, "ID non minore del minimo visto");
    });
  e.at(0, () => {
    e.phase = speed
      ? "Speeding: attese 2^ID e scarti"
      : "LCR: candidati fermati dai minimi";
    s.initiators.forEach((id) => activate(id));
  });
}
export function controlledDistance(e: Engine, s: Scenario) {
  const n = e.nodes.length;
  function launch(id: number) {
    const node = e.node(id);
    const stage = node.data.stage ?? 0;
    node.data.backs = [];
    e.update(id, "CANDIDATE", { stage }, `raggio ${2 ** stage}`);
    for (const dir of [-1, 1])
      e.send(id, next(id, n, dir), "Forth", {
        v: node.data.own,
        origin: id,
        dir,
        stage,
        hops: 1,
        radius: 2 ** stage,
      });
  }
  function notify(id: number, v: number) {
    e.phase = "Notifica finale";
    e.update(id, "LEADER", { leader: v });
    e.send(id, next(id, n), "Notify", { v, origin: id });
  }
  for (const node of e.nodes)
    e.on(node.id, (m) => {
      const d = m.data;
      if (m.kind === "Notify") {
        if (node.id === d.origin) {
          e.result = "Il minimo ha completato il giro e notificato tutti.";
          return;
        }
        e.update(node.id, "FOLLOWER", { leader: d.v });
        e.send(node.id, next(node.id, n), "Notify", d);
        return;
      }
      if (["LEADER", "FOLLOWER"].includes(node.state)) {
        e.discard(m, "notifica già ricevuta");
        return;
      }
      if (m.kind === "Back") {
        if (node.id !== d.origin)
          e.send(node.id, next(node.id, n, -d.dir), "Back", d);
        else if (node.state === "CANDIDATE" && node.data.stage === d.stage) {
          node.data.backs.push(d.dir);
          e.update(
            node.id,
            "CANDIDATE",
            {},
            `Back ${node.data.backs.length}/2`,
          );
          if (node.data.backs.length === 2) {
            node.data.stage++;
            launch(node.id);
          }
        } else e.discard(m, "candidato sconfitto o stage passato");
        return;
      }
      if (node.state === "SLEEPING") {
        if (node.data.own < d.v) {
          node.data.stage = 0;
          launch(node.id);
        } else e.update(node.id, "DEFEATED", { stage: 0 });
      }
      if (d.origin === node.id) {
        if (node.state === "CANDIDATE") notify(node.id, d.v);
        else e.discard(m, "Forth del candidato ormai sconfitto");
        return;
      }
      // The comparison belongs to a candidate. A defeated relay no longer
      // stops others using its former candidacy (teacher slide p. 172).
      if (node.state === "CANDIDATE" && node.data.own < d.v) {
        e.discard(m, "incontra un candidato con ID minore");
        return;
      }
      if (node.state === "CANDIDATE")
        e.update(node.id, "DEFEATED", {}, "Forth con ID minore");
      if (d.hops === d.radius)
        e.send(node.id, next(node.id, n, -d.dir), "Back", d);
      else
        e.send(node.id, next(node.id, n, d.dir), "Forth", {
          ...d,
          hops: d.hops + 1,
        });
    });
  e.at(0, () => {
    e.phase = "Stage indipendenti: Forth / Back";
    for (const id of s.initiators) {
      e.node(id).data.stage = 0;
      launch(id);
    }
  });
}
export function floodmax(e: Engine) {
  const L = e.nodes.length - 1; // A known upper bound, not a globally supplied maximum.
  if (L === 0) {
    e.at(0, () => {
      e.update(0, "LEADER", { maximum: e.node(0).data.own, round: 0, L });
      e.result = "Un solo nodo: massimo locale, nessun round necessario.";
    });
    return;
  }
  for (const node of e.nodes) {
    e.update(node.id, "ACTIVE", {
      maximum: node.data.own,
      round: 0,
      received: {},
      L,
    });
    e.on(node.id, (m) => {
      node.data.received[m.from] = m.data.v;
    });
  }
  function round(r: number) {
    e.phase = `FloodMax: round ${r}/${L}`;
    for (const node of e.nodes) {
      node.data.received = {};
      for (const to of e.neighbours(node.id))
        e.send(node.id, to, "Max", { v: node.data.maximum, r });
    }
    e.after(1, () => {
      for (const node of e.nodes) {
        const maximum = Math.max(
          node.data.maximum,
          ...(Object.values(node.data.received) as number[]),
        );
        e.update(
          node.id,
          r === L
            ? maximum === node.data.own
              ? "LEADER"
              : "FOLLOWER"
            : "ACTIVE",
          { maximum, round: r },
        );
      }
      if (r < L) round(r + 1);
      else e.result = "L round conclusi: tutti conoscono il massimo globale.";
    });
  }
  e.at(0, () => round(1));
}
export function waiting(e: Engine, s: Scenario, universal = false) {
  const n = e.nodes.length;
  const progressive = !!s.progressive || universal;
  function stop(id: number, leader: number, from?: number) {
    const node = e.node(id);
    if (node.data.stopped) return;
    node.data.stopped = true;
    e.update(id, node.data.own === leader ? "LEADER" : "FOLLOWER", { leader });
    const dest = universal
      ? e.neighbours(id).filter((to) => to !== from)
      : [next(id, n)];
    for (const to of dest)
      e.send(id, to, universal ? "stop" : "Notify", { v: leader });
    if (e.nodes.every((v) => v.data.stopped))
      e.result =
        "La notifica ha preceduto tutte le scadenze rivali; un leader.";
  }
  function awake(id: number, from?: number) {
    const node = e.node(id);
    if (node.state !== "SLEEPING") return;
    const deadline = e.time + (progressive ? 2 : 1) * n * node.data.own;
    e.update(id, "WAITING", { deadline });
    if (progressive) {
      const dest = universal
        ? e.neighbours(id).filter((to) => to !== from)
        : [next(id, n)];
      for (const to of dest) e.send(id, to, universal ? "start" : "W");
    }
    e.at(deadline, () => {
      if (node.state === "WAITING") {
        e.phase = "Scadenza del minimo e notifica";
        stop(id, node.data.own);
      }
    });
  }
  for (const node of e.nodes)
    e.on(node.id, (m) => {
      if (m.kind === "W" || m.kind === "start") {
        if (node.state === "SLEEPING") awake(node.id, m.from);
        else e.discard(m, "già sveglio");
      } else if (node.data.stopped) e.discard(m, "notifica già ricevuta");
      else stop(node.id, m.data.v, m.from);
    });
  e.at(0, () => {
    e.phase = progressive ? "Wake-up e attese 2n·ID" : "Attese simultanee n·ID";
    (progressive ? s.initiators : e.nodes.map((v) => v.id)).forEach((id) =>
      awake(id),
    );
  });
}
/** Waiting with equal minima: a minimum consumes an arriving probe. Return
 * before n ticks detects a tie locally. Restart waves are merged by epoch;
 * the next trial starts at the shared 3n boundary (synchronous known n). */
export function randomElection(e: Engine, s: Scenario) {
  const n = e.nodes.length;
  const rng = random(s.seed ?? 17);
  let trial = 1;
  let settled = false;
  function start() {
    e.phase = `Tentativo ${trial}: Waiting con bit casuali`;
    for (const node of e.nodes) {
      const bit = rng() < 1 / n ? 0 : 1;
      e.update(node.id, "WAITING", {
        bit,
        trial,
        minimum: null,
        restart: false,
        sentAt: null,
      });
    }
    for (const node of e.nodes) {
      const epoch = trial;
      e.after(n * node.data.bit, () => {
        if (epoch !== trial || settled || node.state !== "WAITING") return;
        node.data.minimum = node.data.bit;
        node.data.sentAt = e.time;
        e.update(node.id, "CANDIDATE");
        e.send(node.id, next(node.id, n), "Probe", { v: node.data.bit, epoch });
      });
    }
    e.after(3 * n, () => {
      if (!settled) {
        trial++;
        start();
      }
    });
  }
  for (const node of e.nodes)
    e.on(node.id, (m: Message) => {
      const d = m.data;
      if (d.epoch !== trial) {
        e.discard(m, "tentativo precedente");
        return;
      }
      if (m.kind === "Notify") {
        if (node.state === "LEADER") {
          e.result = `Leader unico dopo ${trial} tentativi; una sola esecuzione riproducibile.`;
          return;
        }
        e.update(node.id, "FOLLOWER");
        e.send(node.id, next(node.id, n), "Notify", d);
        return;
      }
      if (m.kind === "restart") {
        if (node.data.restart) {
          e.discard(m, "restart già inoltrato");
          return;
        }
        node.data.restart = true;
        e.update(node.id, "RESTART");
        e.send(node.id, next(node.id, n), "restart", d);
        return;
      }
      if (node.data.restart) {
        e.discard(m, "tentativo in riavvio");
        return;
      }
      if (node.state === "CANDIDATE" && node.data.bit === d.v) {
        const elapsed = e.time - node.data.sentAt;
        if (elapsed === n) {
          settled = true;
          e.update(node.id, "LEADER", {}, "ritorno esattamente dopo n tick");
          e.phase = "Notifica";
          e.send(node.id, next(node.id, n), "Notify", d);
        } else {
          node.data.restart = true;
          e.update(
            node.id,
            "RESTART",
            {},
            `ritorno dopo ${elapsed}<n: minimo non unico`,
          );
          e.send(node.id, next(node.id, n), "restart", d);
        }
      } else if (node.data.minimum === null || d.v < node.data.minimum) {
        node.data.minimum = d.v;
        e.update(node.id, "PASSIVE");
        e.send(node.id, next(node.id, n), "Probe", d);
      } else if (node.state === "PASSIVE" && d.v === node.data.minimum)
        e.send(node.id, next(node.id, n), "Probe", d);
      else e.discard(m, "valore maggiore del minimo");
    });
  e.at(0, start);
}
