/** Discrete events: the scheduler knows topology; protocol handlers see only
 * their local memory and delivered messages. Equal-time sends share a frame. */
export type Memory = Record<string, any>;
export interface Vertex {
  id: number;
  label: string;
  state: string;
  data: Memory;
}
export interface Edge {
  a: number;
  b: number;
  weight?: number;
  directed?: boolean;
  active?: boolean;
}
export interface Message {
  serial: number;
  from: number;
  to: number;
  kind: string;
  data: Memory;
  sent: number;
  due: number;
  depth: number;
  lost: boolean;
  elements: number;
}
export interface Event {
  type: "send" | "deliver" | "update" | "discard" | "timer" | "loss";
  text: string;
  message?: Message;
}
export interface Frame {
  time: number;
  phase: string;
  nodes: Vertex[];
  edges: Edge[];
  events: Event[];
  pending: Message[];
  sends: number;
  elements: number;
  causal: number;
  result: string;
}
export interface Trace {
  frames: Frame[];
  measure: string;
  note: string;
  result: string;
  complete: boolean;
}
interface Task {
  due: number;
  order: number;
  depth: number;
  run: () => void;
}
export class Engine {
  nodes: Vertex[];
  edges: Edge[];
  time = 0;
  phase = "Inizializzazione";
  result = "";
  // Observer-only stop for ongoing protocols: local rules never see this.
  stopWhen?: () => boolean;
  sends = 0;
  elements = 0;
  causal = 0;
  frames: Frame[] = [];
  events: Event[] = [];
  pending: Message[] = [];
  private tasks: Task[] = [];
  private sequence = 0;
  private depth = 0;
  private localDepth = new Map<number, number>();
  private handlers = new Map<number, (m: Message) => void>();
  selfDelay = 0;
  delay: (from: number, to: number, kind: string) => number = () => 1;
  fails: (from: number, to: number) => boolean = () => false;
  constructor(ids: number[], edges: Edge[]) {
    this.nodes = ids.map((id, i) => ({
      id: i,
      label: String(id),
      state: "SLEEPING",
      data: { own: id },
    }));
    this.edges = structuredClone(edges);
  }
  node(id: number) {
    return this.nodes[id]!;
  }
  neighbours(id: number) {
    return this.edges.flatMap((e) =>
      e.a === id ? [e.b] : e.b === id ? [e.a] : [],
    );
  }
  on(id: number, handler: (m: Message) => void) {
    this.handlers.set(id, handler);
  }
  update(id: number, state: string, data: Memory = {}, reason = "") {
    const n = this.node(id);
    n.state = state;
    Object.assign(n.data, data);
    this.events.push({
      type: "update",
      text: `${n.label}: ${state}${reason ? ` — ${reason}` : ""}`,
    });
  }
  discard(m: Message, reason: string) {
    this.events.push({
      type: "discard",
      message: m,
      text: `${m.kind} ${this.node(m.from).label} → ${this.node(m.to).label}: scartato (${reason})`,
    });
  }
  at(due: number, run: () => void, depth = this.depth) {
    this.tasks.push({ due, run, order: this.sequence++, depth });
  }
  after(delay: number, run: () => void) {
    this.at(this.time + delay, run);
  }
  send(
    from: number,
    to: number,
    kind: string,
    data: Memory = {},
    elements = 1,
  ) {
    // Self delivery participates in quorums, but is not an edge transmission.
    const local = from === to;
    const m: Message = {
      serial: this.sequence++,
      from,
      to,
      kind,
      data: structuredClone(data),
      sent: this.time,
      due: this.time + (local ? this.selfDelay : this.delay(from, to, kind)),
      depth:
        Math.max(this.depth, this.localDepth.get(from) ?? 0) + (local ? 0 : 1),
      lost: !local && this.fails(from, to),
      elements,
    };
    if (!local) {
      this.sends++;
      this.elements += elements;
      this.causal = Math.max(this.causal, m.depth);
    }
    this.events.push({
      type: "send",
      message: m,
      text: `${local ? "Copia locale" : "Invio"} ${kind}: ${this.node(from).label} → ${this.node(to).label}`,
    });
    this.pending.push(m);
    this.at(
      m.due,
      () => {
        this.pending = this.pending.filter((p) => p.serial !== m.serial);
        this.events.push({
          type: m.lost ? "loss" : "deliver",
          message: m,
          text: `${m.lost ? "Perso" : "Consegna"} ${kind}: ${this.node(from).label} → ${this.node(to).label}`,
        });
        if (!m.lost) {
          this.localDepth.set(
            to,
            Math.max(this.localDepth.get(to) ?? 0, m.depth),
          );
          this.handlers.get(to)?.(m);
        }
      },
      m.depth,
    );
  }
  broadcast(from: number, kind: string, data: Memory, self = false) {
    for (const n of this.nodes)
      if (self || n.id !== from) this.send(from, n.id, kind, data);
  }
  capture() {
    this.frames.push(
      structuredClone({
        time: this.time,
        phase: this.phase,
        nodes: this.nodes,
        edges: this.edges,
        events: this.events,
        pending: this.pending,
        sends: this.sends,
        elements: this.elements,
        causal: this.causal,
        result: this.result,
      }),
    );
    this.events = [];
  }
  run(measure: string, note: string, limit = 15000): Trace {
    this.capture();
    let steps = 0;
    let observed = false;
    while (this.tasks.length && steps++ < limit) {
      this.tasks.sort((a, b) => a.due - b.due || a.order - b.order);
      this.time = this.tasks[0]!.due;
      // Freeze the arrivals at this time. New zero-delay local events form a
      // separate causal microstep; other same-time events remain concurrent.
      const batch = this.tasks.filter((t) => t.due === this.time);
      this.tasks = this.tasks.filter((t) => t.due !== this.time);
      for (const task of batch) {
        this.depth = task.depth;
        task.run();
      }
      if (this.events.length || this.result !== this.frames.at(-1)?.result)
        this.capture();
      if (this.stopWhen?.()) {
        observed = true;
        if (this.result !== this.frames.at(-1)?.result) this.capture();
        break;
      }
    }
    const complete = observed || !this.tasks.length;
    if (!complete) {
      this.result =
        "Limite di visualizzazione raggiunto: questa esecuzione continua.";
      this.capture();
    }
    return {
      frames: this.frames,
      measure,
      note,
      result: this.result,
      complete,
    };
  }
}
