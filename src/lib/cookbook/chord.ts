import { Engine, type Message } from "./engine";
import type { Scenario } from "./scenarios";
const space = 64;
export function between(x: number, a: number, b: number, inclusive = false) {
  const d = (x - a + space) % space,
    span = (b - a + space) % space;
  return (inclusive && x === b) || (d > 0 && (span === 0 || d < span));
}
/** Only fixture setup reads the initial complete ring. At runtime a node knows
 * the identifiers attached to its own pointers and learnt in delivered messages. */
export function chord(
  e: Engine,
  s: Scenario,
  mode: "successor" | "finger" | "join",
) {
  const oldN = e.nodes.length;
  const initial = [...e.nodes].sort((a, b) => a.data.own - b.data.own);
  const initialOwner = (key: number) =>
    initial.find((v) => v.data.own >= key) ?? initial[0]!;
  for (const [i, node] of initial.entries()) {
    const successor = initial[(i + 1) % oldN]!,
      predecessor = initial[(i + oldN - 1) % oldN]!;
    const fingers = Array.from({ length: 6 }, (_, j) =>
      initialOwner((node.data.own + 2 ** j) % space),
    );
    const contacts = Object.fromEntries(
      [node, successor, predecessor, ...fingers].map((v) => [v.id, v.data.own]),
    );
    Object.assign(node.data, {
      successor: successor.id,
      predecessor: predecessor.id,
      fingers: fingers.map((v) => v.id),
      contacts,
      keys: [],
    });
    node.state = "STABLE";
  }
  const fixtureKeys = [2, 12, 36, 37, 40, 59];
  for (const key of fixtureKeys) initialOwner(key).data.keys.push(key);
  let request = 0;
  const callbacks = new Map<number, (owner: number) => void>();
  const address = (id: number, to: number): number =>
    e.node(id).data.contacts[to];
  function send(
    from: number,
    to: number,
    kind: string,
    data: Record<string, unknown> = {},
    elements = 1,
  ) {
    e.send(
      from,
      to,
      kind,
      { ...data, senderId: e.node(from).data.own },
      elements,
    );
  }
  function query(
    from: number,
    at: number,
    key: number,
    callback: (owner: number) => void,
    fast: boolean,
  ) {
    const ticket = request++;
    callbacks.set(ticket, callback);
    send(from, at, "lookup", {
      key,
      requester: from,
      requesterId: e.node(from).data.own,
      ticket,
      fast,
      hops: 0,
    });
  }
  function found(
    id: number,
    requester: number,
    ticket: number,
    owner: number,
    hops: number,
  ) {
    send(id, requester, "found", {
      owner,
      ownerId: address(id, owner),
      ticket,
      hops,
    });
  }
  function process(id: number, m: Message) {
    const node = e.node(id),
      d = node.data;
    d.contacts[m.from] = m.data.senderId;
    if (m.kind === "lookup") {
      const { key, requester, ticket, fast } = m.data;
      d.contacts[requester] = m.data.requesterId;
      const hops = m.data.hops + (m.from === id ? 0 : 1),
        succ = d.successor;
      e.update(
        id,
        "LOOKUP",
        { key, lookupHops: hops },
        `chiave ${key}; successore N${address(id, succ)}`,
      );
      // A successor lookup resolves key responsibility even when no value with
      // that hash exists. It must not depend on the sample keys in the fixture.
      if (key === d.own || m.data.responsible || succ === id) {
        found(id, requester, ticket, id, hops);
        return;
      }
      if (between(key, d.own, address(id, succ), true)) {
        if (fast) found(id, requester, ticket, succ, hops);
        else send(id, succ, "lookup", { ...m.data, hops, responsible: true });
        return;
      }
      let to = succ;
      if (fast)
        for (const finger of [...d.fingers].reverse())
          if (between(address(id, finger), d.own, key)) {
            to = finger;
            break;
          }
      send(id, to, "lookup", { ...m.data, hops });
    } else if (m.kind === "found") {
      d.contacts[m.data.owner] = m.data.ownerId;
      e.update(id, "LOOKUP_RESULT", {
        lookupHops: m.data.hops,
        owner: m.data.ownerId,
        ownerIndex: m.data.owner,
      });
      callbacks.get(m.data.ticket)?.(m.data.owner);
      callbacks.delete(m.data.ticket);
    } else if (m.kind === "stabilize") {
      send(id, m.from, "pred", {
        predecessor: d.predecessor,
        predecessorId:
          d.predecessor === null ? null : address(id, d.predecessor),
      });
    } else if (m.kind === "pred") {
      const candidate = m.data.predecessor;
      if (candidate !== null) {
        d.contacts[candidate] = m.data.predecessorId;
        if (between(address(id, candidate), d.own, address(id, d.successor)))
          d.successor = candidate;
      }
      e.update(id, "STABILIZING", {}, `succ=N${address(id, d.successor)}`);
      send(id, d.successor, "notify");
    } else if (m.kind === "notify") {
      if (
        d.predecessor === null ||
        between(address(id, m.from), address(id, d.predecessor), d.own)
      ) {
        d.predecessor = m.from;
        e.update(id, "STABILIZING", {}, `pred=N${address(id, m.from)}`);
      }
    } else if (m.kind === "transfer request") {
      const keys = d.keys.filter((key: number) =>
        between(key, m.data.previous, address(id, m.from), true),
      );
      send(id, m.from, "keys", { keys }, keys.length);
    } else if (m.kind === "keys") {
      d.keys.push(...m.data.keys);
      e.update(id, "JOINED", {}, `riceve chiavi ${m.data.keys.join(", ")}`);
      // The former owner removes its copy only after confirmed delivery.
      send(id, m.from, "keys received", { keys: m.data.keys });
    } else if (m.kind === "keys received") {
      d.keys = d.keys.filter((key: number) => !m.data.keys.includes(key));
      e.update(
        id,
        node.state,
        {},
        "trasferimento confermato: elimina la vecchia copia",
      );
    } else if (m.kind === "join pred query") {
      send(id, m.from, "join pred", {
        pred: d.predecessor,
        predId: address(id, d.predecessor),
      });
    } else if (m.kind === "join pred") {
      d.contacts[m.data.pred] = m.data.predId;
      send(id, d.successor, "transfer request", { previous: m.data.predId });
      send(id, d.successor, "notify");
    }
  }
  for (const node of e.nodes) e.on(node.id, (m) => process(node.id, m));
  function stabilize(id: number) {
    send(id, e.node(id).data.successor, "stabilize");
  }
  function refresh(id: number, j = 0) {
    if (j >= 6) {
      e.update(id, "STABLE");
      return;
    }
    const node = e.node(id),
      key = (node.data.own + 2 ** j) % space;
    query(
      id,
      id,
      key,
      (owner) => {
        node.data.fingers[j] = owner;
        e.update(id, "REFRESH", {}, `finger[${j + 1}]=N${address(id, owner)}`);
        refresh(id, j + 1);
      },
      true,
    );
  }
  if (mode !== "join")
    e.at(0, () => {
      e.phase =
        mode === "finger"
          ? "Lookup con finger valide"
          : "Lookup con solo successore";
      const origin = s.origin ?? 0;
      query(
        origin,
        origin,
        s.key!,
        (owner) => {
          e.result = `successor(${s.key}) = N${address(origin, owner)}; risposta restituita al richiedente.`;
        },
        mode === "finger",
      );
    });
  else
    e.at(0, () => {
      e.phase = "Join di N37: lookup, dati e stabilizzazione";
      const id = oldN,
        bootstrap = s.origin ?? 0;
      // Knowing one contact is the new node's specified initial information.
      e.nodes.push({
        id,
        label: "37",
        state: "JOINING",
        data: {
          own: 37,
          predecessor: null,
          successor: null,
          fingers: [],
          keys: [],
          contacts: { [id]: 37, [bootstrap]: s.ids[bootstrap] },
        },
      });
      e.on(id, (m) => process(id, m));
      query(
        id,
        bootstrap,
        37,
        (owner) => {
          const node = e.node(id);
          node.data.successor = owner;
          node.data.fingers = Array(6).fill(owner);
          e.update(
            id,
            "JOINING",
            {},
            `successore trovato N${address(id, owner)}`,
          );
          send(id, owner, "join pred query");
          // This is the fixed illustrative schedule for one insertion. No protocol
          // node checks global stability; only the observer validates the final state.
          for (const v of e.nodes) {
            e.after(4, () => stabilize(v.id));
            e.after(8, () => stabilize(v.id));
            e.after(12, () => refresh(v.id));
          }
        },
        true,
      );
    });
  return () => {
    if (mode === "join") {
      const ordered = [...e.nodes].sort((a, b) => a.data.own - b.data.own),
        owner = (key: number) =>
          ordered.find((v) => v.data.own >= key) ?? ordered[0]!;
      const stable =
        ordered.every(
          (v, i) =>
            v.data.successor === ordered[(i + 1) % ordered.length]!.id &&
            v.data.predecessor ===
              ordered[(i + ordered.length - 1) % ordered.length]!.id &&
            v.data.fingers.length === 6 &&
            v.data.fingers.every(
              (finger: number, j: number) =>
                finger === owner((v.data.own + 2 ** j) % space).id,
            ),
        ) &&
        fixtureKeys.every(
          (key) =>
            ordered.filter((v) => v.data.keys.includes(key)).length === 1 &&
            owner(key).data.keys.includes(key),
        );
      if (stable)
        for (const node of e.nodes)
          e.update(
            node.id,
            "STABLE",
            {},
            "osservatore: configurazione finale verificata",
          );
      e.result = stable
        ? "Configurazione stabile dopo un solo join: successori, predecessori, finger e chiavi aggiornati. La manutenzione periodica continua."
        : "Le procedure mostrate non hanno ancora riparato tutti i puntatori, le finger o le assegnazioni dei dati.";
      e.events.push({ type: "update", text: e.result });
      e.capture();
    }
  };
}
