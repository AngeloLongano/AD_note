import { Engine, type Message } from "./engine";
import type { Scenario } from "./scenarios";
import { shout } from "./diffusion";
const cost = (e: Engine, a: number, b: number) =>
  e.edges.find(
    (edge) => (edge.a === a && edge.b === b) || (edge.b === a && edge.a === b),
  )!.weight ?? 1;
export function iterating(e: Engine) {
  const n = e.nodes.length;
  for (const node of e.nodes) {
    const distance = Array.from({ length: n }, (_, i) =>
        i === node.id ? 0 : Infinity,
      ),
      nextHop = Array(n).fill(null);
    // The lecture's initial table already includes incident edge costs.
    for (const to of e.neighbours(node.id)) {
      distance[to] = cost(e, node.id, to);
      nextHop[to] = to;
    }
    e.update(node.id, "ACTIVE", { distance, nextHop, vectors: {} });
    e.on(node.id, (m) => {
      node.data.vectors[m.from] = m.data.vector;
    });
  }
  if (n === 1) {
    e.at(0, () => {
      e.update(0, "DONE", { round: 0 });
      e.result =
        "Tabella locale completa: nessun round di comunicazione necessario.";
    });
    return;
  }
  function round(r: number) {
    e.phase = `Iterating: round ${r}/${n - 1}`;
    for (const node of e.nodes) {
      node.data.vectors = {};
      for (const to of e.neighbours(node.id))
        e.send(
          node.id,
          to,
          "DistanceVector",
          { vector: node.data.distance, r },
          n,
        );
    }
    e.after(1, () => {
      for (const node of e.nodes) {
        const distance = [...node.data.distance],
          hop = [...node.data.nextHop];
        for (const to of e.neighbours(node.id)) {
          const c = cost(e, node.id, to);
          for (let z = 0; z < n; z++) {
            const d = c + node.data.vectors[to][z];
            if (d < distance[z]) {
              distance[z] = d;
              hop[z] = to;
            }
          }
        }
        e.update(node.id, r === n - 1 ? "DONE" : "ACTIVE", {
          distance,
          nextHop: hop,
          round: r,
        });
      }
      if (r < n - 1) round(r + 1);
      else
        e.result =
          "n−1 round: distance vector e next hop corretti per tutte le destinazioni.";
    });
  }
  e.at(0, () => round(1));
}
export function gossiping(e: Engine, s: Scenario) {
  // Each phase starts after local completion only. Early messages wait until
  // this endpoint has both classified its tree links and learnt its neighbours.
  const setup = new Set<number>(),
    ready = new Set<number>();
  const oldHandlers = new Map<number, (m: Message) => void>();
  const originalOn = e.on.bind(e);
  e.on = (id, handler) => {
    oldHandlers.set(id, handler);
    originalOn(id, handler);
  };
  shout(e, s, true);
  e.on = originalOn;
  for (const node of e.nodes) {
    node.data.map = {};
    node.data.buffer = [];
    node.data.neighbourInfo = {};
    originalOn(node.id, (m) => {
      if (m.kind === "NeighbourInfo") {
        node.data.neighbourInfo[m.from] = {
          to: m.from,
          cost: m.data.cost,
          name: m.data.name,
        };
        if (setup.has(node.id)) tryLaunch(node.id);
      } else if (m.kind === "List") {
        if (!ready.has(node.id)) node.data.buffer.push(m);
        else list(node.id, m);
      } else {
        oldHandlers.get(node.id)!(m);
        if (node.state === "DONE" && !setup.has(node.id)) exchange(node.id);
      }
    });
  }
  function finish(id: number) {
    const node = e.node(id),
      n = e.nodes.length;
    if (Object.keys(node.data.map).length !== n) return;
    // Only now may this node compute centrally from its own complete map.
    const d = Array(n).fill(Infinity),
      hop = Array(n).fill(null);
    d[id] = 0;
    for (let r = 0; r < n - 1; r++)
      for (const [x, entries] of Object.entries(node.data.map))
        for (const rec of entries as { to: number; cost: number }[]) {
          const a = Number(x);
          if (d[a] + rec.cost < d[rec.to]) {
            d[rec.to] = d[a] + rec.cost;
            hop[rec.to] = a === id ? rec.to : hop[a];
          }
        }
    e.update(id, "DONE", { distance: d, nextHop: hop });
    if (e.nodes.every((v) => v.state === "DONE" && ready.has(v.id)))
      e.result =
        "Ogni nodo ha la mappa completa e ha calcolato localmente la tabella di routing.";
  }
  function list(id: number, m: Message) {
    const node = e.node(id);
    if (node.data.map[m.data.origin]) {
      e.discard(m, "lista già nota");
      return;
    }
    node.data.map[m.data.origin] = m.data.list;
    for (const to of [node.data.parent, ...node.data.children].filter(
      (v) => v !== null && v !== m.from,
    ))
      e.send(id, to, "List", m.data, m.data.list.length);
    e.update(
      id,
      "DISSEMINATING",
      {},
      `liste note ${Object.keys(node.data.map).length}/${e.nodes.length}`,
    );
    finish(id);
  }
  function tryLaunch(id: number) {
    const node = e.node(id);
    if (
      ready.has(id) ||
      Object.keys(node.data.neighbourInfo).length !== e.neighbours(id).length
    )
      return;
    ready.add(id);
    e.phase = "Gossiping: liste sull’albero dopo lo scambio del vicinato";
    const local = Object.values(node.data.neighbourInfo).map((rec) => ({
      to: (rec as { to: number }).to,
      cost: (rec as { cost: number }).cost,
    }));
    node.data.map[id] = local;
    e.update(id, "DISSEMINATING");
    for (const to of [node.data.parent, ...node.data.children].filter(
      (v) => v !== null,
    ))
      e.send(id, to, "List", { origin: id, list: local }, local.length);
    for (const m of node.data.buffer) list(id, m);
    node.data.buffer = [];
    finish(id);
  }
  function exchange(id: number) {
    setup.add(id);
    e.phase = "Gossiping: scambio delle informazioni sul vicinato";
    e.update(id, "LEARNING_NEIGHBOURS");
    for (const to of e.neighbours(id))
      e.send(id, to, "NeighbourInfo", {
        name: e.node(id).data.own,
        cost: cost(e, id, to),
      });
    tryLaunch(id);
  }
  // Covers the isolated one-node graph, whose SHOUT+ finishes in its startup.
  e.at(0, () => {
    for (const node of e.nodes)
      if (node.state === "DONE" && !setup.has(node.id)) exchange(node.id);
  });
}
export function minHop(e: Engine, s: Scenario) {
  const root = s.initiators[0]!;
  let level = 1;
  for (const node of e.nodes)
    Object.assign(node.data, {
      distance: null,
      parent: null,
      children: [],
      tested: [],
      waiting: [],
      roundChildren: [],
      reports: {},
      added: 0,
    });
  function end(id: number) {
    const node = e.node(id);
    if (
      node.data.waiting.length ||
      Object.keys(node.data.reports).length < node.data.roundChildren.length
    )
      return;
    const added =
      node.data.added +
      Object.values(node.data.reports).reduce(
        (a: number, v) => a + Number(v),
        0,
      );
    e.update(
      id,
      "IN_TREE",
      { added },
      "tutte le risposte del livello ricevute",
    );
    if (id === root) {
      if (!added) {
        e.phase = "Stop sull’albero";
        stop(root);
        e.result = "Livello senza nuove scoperte: BFS completo e stop diffuso.";
      } else {
        level++;
        begin(root);
      }
    } else e.send(id, node.data.parent, "Report", { added });
  }
  function begin(id: number) {
    const node = e.node(id);
    e.phase = `Min-Hop: livello ${level}`;
    e.update(id, "EXPLORING", {
      roundChildren: [...node.data.children],
      waiting: [],
      reports: {},
      added: 0,
      level,
    });
    for (const child of node.data.roundChildren)
      e.send(id, child, "start", { level });
    if (node.data.distance === level - 1) {
      node.data.waiting = e
        .neighbours(id)
        .filter((v) => !node.data.tested.includes(v));
      for (const to of node.data.waiting) {
        node.data.tested.push(to);
        e.send(id, to, "explore", { level });
      }
    }
    end(id);
  }
  function stop(id: number) {
    const node = e.node(id);
    e.update(id, "DONE");
    for (const child of node.data.children) e.send(id, child, "stop");
  }
  for (const node of e.nodes)
    e.on(node.id, (m) => {
      if (m.kind === "stop") {
        stop(node.id);
        return;
      }
      if (m.kind === "start") {
        begin(node.id);
        return;
      }
      if (m.kind === "Report") {
        node.data.reports[m.from] = m.data.added;
        end(node.id);
        return;
      }
      if (m.kind === "explore") {
        if (!node.data.tested.includes(m.from)) node.data.tested.push(m.from);
        if (node.data.distance === null) {
          e.update(node.id, "IN_TREE", {
            distance: m.data.level,
            parent: m.from,
          });
          e.send(node.id, m.from, "YES", { level: m.data.level });
        } else if (node.data.waiting.includes(m.from)) {
          node.data.waiting = node.data.waiting.filter(
            (v: number) => v !== m.from,
          );
          e.discard(m, "esplorazione incrociata: risposta implicita");
          end(node.id);
        } else e.send(node.id, m.from, "NO");
        return;
      }
      node.data.waiting = node.data.waiting.filter((v: number) => v !== m.from);
      if (m.kind === "YES") {
        node.data.children.push(m.from);
        node.data.added++;
      }
      end(node.id);
    });
  e.at(0, () => {
    e.update(root, "IN_TREE", { distance: 0 });
    begin(root);
  });
}
interface Offer {
  cost: number;
  via?: number;
  to?: number;
  child?: number;
}
export function dijkstra(e: Engine, s: Scenario) {
  const root = s.initiators[0]!;
  let iteration = 0;
  for (const node of e.nodes)
    Object.assign(node.data, {
      distance: null,
      parent: null,
      children: [],
      outside: e.neighbours(node.id),
      acks: [],
      offers: {},
    });
  function stop(id: number) {
    const node = e.node(id);
    e.update(id, "DONE");
    for (const child of node.data.children) e.send(id, child, "stop");
  }
  function offer(id: number) {
    const node = e.node(id);
    if (Object.keys(node.data.offers).length < node.data.children.length)
      return;
    let best: Offer = { cost: Infinity };
    for (const to of node.data.outside) {
      const c =
        e.edges.find(
          (edge) =>
            (edge.a === id && edge.b === to) ||
            (edge.b === id && edge.a === to),
        )!.weight ?? 1;
      if (node.data.distance + c < best.cost)
        best = { cost: node.data.distance + c, via: id, to };
    }
    for (const [child, o] of Object.entries(node.data.offers))
      if ((o as Offer).cost < best.cost)
        best = { ...(o as Offer), child: Number(child) };
    node.data.best = best;
    e.update(
      id,
      "IN_TREE",
      {},
      `offerta ${best.cost === Infinity ? "nessun candidato" : best.cost}`,
    );
    if (id !== root) e.send(id, node.data.parent, "Offer", best);
    else if (best.cost === Infinity) {
      e.phase = "Nessun candidato: stop";
      e.result = "Convergecast vuoto: distanze definitive e stop finale.";
      stop(root);
    } else select(id, best);
  }
  function begin(id: number) {
    const node = e.node(id);
    e.update(id, "SELECTING", { offers: {} });
    for (const child of node.data.children)
      e.send(id, child, "start iteration");
    offer(id);
  }
  function select(id: number, o: Offer) {
    const node = e.node(id);
    e.phase = `Dijkstra: aggiunta ${iteration}`;
    if (o.via === id) {
      node.data.children.push(o.to!);
      node.data.outside = node.data.outside.filter((v: number) => v !== o.to);
      e.send(id, o.to!, "Add", { distance: o.cost });
    } else e.send(id, node.data.best.child, "Select", o);
  }
  function signalEnd(id: number) {
    const node = e.node(id);
    if (id === root) {
      iteration++;
      begin(root);
    } else e.send(id, node.data.parent, "end iteration");
  }
  function announce(id: number, parent?: number) {
    const node = e.node(id);
    node.data.acks = e.neighbours(id).filter((v) => v !== parent);
    for (const to of node.data.acks) e.send(id, to, "InTree");
    if (!node.data.acks.length) signalEnd(id);
  }
  for (const node of e.nodes)
    e.on(node.id, (m) => {
      if (m.kind === "InTree") {
        node.data.outside = node.data.outside.filter(
          (v: number) => v !== m.from,
        );
        e.send(node.id, m.from, "Ack");
        return;
      }
      if (m.kind === "Ack") {
        node.data.acks = node.data.acks.filter((v: number) => v !== m.from);
        e.update(
          node.id,
          "IN_TREE",
          {},
          `Ack mancanti ${node.data.acks.length}`,
        );
        if (!node.data.acks.length) signalEnd(node.id);
        return;
      }
      if (m.kind === "start iteration") {
        begin(node.id);
        return;
      }
      if (m.kind === "Offer") {
        node.data.offers[m.from] = m.data;
        offer(node.id);
        return;
      }
      if (m.kind === "Select") {
        select(node.id, m.data as Offer);
        return;
      }
      if (m.kind === "Add") {
        e.update(node.id, "IN_TREE", {
          distance: m.data.distance,
          parent: m.from,
        });
        node.data.outside = node.data.outside.filter(
          (v: number) => v !== m.from,
        );
        announce(node.id, m.from);
        return;
      }
      if (m.kind === "end iteration") {
        signalEnd(node.id);
        return;
      }
      if (m.kind === "stop") stop(node.id);
    });
  e.at(0, () => {
    e.phase = "Dijkstra: inizializzazione e Ack della sorgente";
    e.update(root, "IN_TREE", { distance: 0 });
    announce(root);
  });
}
