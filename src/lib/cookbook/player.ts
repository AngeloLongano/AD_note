import { scenarios } from "./scenarios";
import type { Trace, Frame, Vertex, Message } from "./engine";
const escape = (s: unknown) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const finite = (v: unknown): string => {
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "∞";
  if (Array.isArray(v)) return `[${v.map(finite).join(", ")}]`;
  if (v && typeof v === "object")
    return `{${Object.entries(v)
      .map(([k, x]) => `${k}: ${finite(x)}`)
      .join(", ")}}`;
  return v === null ? "—" : String(v);
};
const visibleKeys = [
  "known",
  "parent",
  "children",
  "counter",
  "minimum",
  "maximum",
  "size",
  "received",
  "aggregate",
  "result",
  "distance",
  "nextHop",
  "level",
  "round",
  "L",
  "stage",
  "backs",
  "waiting",
  "queue",
  "deadline",
  "bit",
  "trial",
  "value",
  "proposal",
  "decision",
  "accepted",
  "successor",
  "predecessor",
  "fingers",
  "keys",
  "lookupHops",
  "owner",
];
function memory(n: Vertex, frame: Frame) {
  const nodeKeys = ["parent", "successor", "predecessor"];
  const listKeys = ["children", "nextHop", "fingers", "backs"];
  return visibleKeys
    .filter((k) => n.data[k] !== undefined)
    .map((k) => {
      let value = n.data[k];
      if (nodeKeys.includes(k) && typeof value === "number")
        value = `N${frame.nodes[value]?.label}`;
      if (listKeys.includes(k) && Array.isArray(value) && k !== "backs")
        value = value.map((v) =>
          typeof v === "number" ? `N${frame.nodes[v]?.label}` : v,
        );
      return `<span><b>${escape(k)}</b> = ${escape(finite(value))}</span>`;
    })
    .join("");
}
function describe(m: Message, f: Frame) {
  return `${m.kind} N${f.nodes[m.from]!.label} → N${f.nodes[m.to]!.label} ${Object.keys(m.data).length ? finite(m.data) : ""}`;
}
class Player {
  private trace?: Trace;
  private index = 0;
  private running = false;
  private timer?: ReturnType<typeof setTimeout>;
  private loading?: Promise<void>;
  private scenarioList;
  private revision = 0;
  private reduced = matchMedia("(prefers-reduced-motion: reduce)");
  private compact = matchMedia("(max-width: 560px)");
  constructor(private host: HTMLElement) {
    this.scenarioList = scenarios(host.dataset.protocol!);
    this.select<HTMLSelectElement>("[data-scenario]").innerHTML =
      this.scenarioList
        .map(
          (s) => `<option value="${escape(s.id)}">${escape(s.title)}</option>`,
        )
        .join("");
    this.select<HTMLSelectElement>("[data-scenario]").addEventListener(
      "change",
      () => {
        this.pause();
        this.load(true);
      },
    );
    this.select("[data-play]").addEventListener("click", async () => {
      await this.load();
      if (this.running) this.pause();
      else {
        if (this.index === this.trace!.frames.length - 1) this.index = 0;
        this.running = true;
        this.select("[data-play]").textContent = "Pausa";
        this.tick();
      }
    });
    this.select("[data-step]").addEventListener("click", async () => {
      this.pause();
      await this.load();
      this.next();
    });
    this.select("[data-reset]").addEventListener("click", async () => {
      this.pause();
      await this.load();
      this.index = 0;
      this.render();
    });
    this.select("[data-speed]").addEventListener("change", () => {
      if (this.running) {
        clearTimeout(this.timer);
        this.tick();
      }
    });
    host.closest("details.protocol-card")?.addEventListener("toggle", () => {
      if ((host.closest("details") as HTMLDetailsElement).open) this.load();
      else this.pause();
    });
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) this.pause();
      },
      { threshold: 0 },
    );
    observer.observe(host);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.pause();
    });
    this.reduced.addEventListener("change", () => this.render());
    this.compact.addEventListener("change", () => this.render());
    if ((host.closest("details") as HTMLDetailsElement)?.open) this.load();
  }
  private select<T extends HTMLElement = HTMLElement>(selector: string) {
    return this.host.querySelector<T>(selector)!;
  }
  private async load(reset = false) {
    if (this.trace && !reset) return;
    if (this.loading && !reset) return this.loading;
    const version = ++this.revision;
    const chosen = this.select<HTMLSelectElement>("[data-scenario]").value;
    this.select("[data-current]").textContent = "Caricamento dell’esecuzione…";
    this.loading = import("./protocols")
      .then(({ simulate }) => {
        const trace = simulate(
          this.host.dataset.protocol!,
          this.scenarioList.find((s) => s.id === chosen)!,
        );
        if (version !== this.revision) return;
        this.trace = trace;
        this.index = 0;
        this.render();
      })
      .catch((error) => {
        this.select("[data-current]").textContent =
          `Simulazione non disponibile: ${error.message}`;
      })
      .finally(() => {
        if (version === this.revision) this.loading = undefined;
      });
    return this.loading;
  }
  private pause() {
    clearTimeout(this.timer);
    this.running = false;
    this.select("[data-play]").textContent = "Avvia";
  }
  private next() {
    if (!this.trace) return;
    if (this.index < this.trace.frames.length - 1) {
      this.index++;
      this.render();
    } else this.pause();
  }
  private tick() {
    if (!this.running) return;
    this.next();
    if (this.trace && this.index === this.trace.frames.length - 1) {
      this.pause();
      return;
    }
    this.timer = setTimeout(
      () => this.tick(),
      Number(this.select<HTMLSelectElement>("[data-speed]").value),
    );
  }
  private render() {
    if (!this.trace) return;
    const f = this.trace.frames[this.index]!;
    this.host.dataset.frame = String(this.index);
    this.host.dataset.frames = String(this.trace.frames.length);
    this.host.dataset.complete = String(this.trace.complete);
    this.select("[data-note]").textContent = this.trace.note;
    this.select("[data-count]").textContent =
      `Invii: ${f.sends} · elementi: ${f.elements}`;
    this.select("[data-time]").textContent =
      `${this.trace.measure}: ${f.time} · catena causale: ${f.causal}`;
    this.select("[data-step-count]").textContent =
      `Passo ${this.index + 1}/${this.trace.frames.length}`;
    this.select("[data-phase]").textContent = f.phase;
    const important = f.events.filter(
      (x) => x.type === "update" || x.type === "discard" || x.type === "loss",
    );
    this.select("[data-current]").textContent = important.length
      ? important
          .slice(0, 3)
          .map((x) => x.text)
          .join(" · ")
      : f.events.length
        ? `${f.events.length} eventi allo stesso istante: invii e consegne indipendenti sono concorrenti.`
        : "Stato iniziale: il protocollo non è ancora partito.";
    this.select("[data-result]").textContent = f.result;
    this.select("[data-nodes]").innerHTML = f.nodes
      .map(
        (n) =>
          `<tr><th scope="row">N${escape(n.label)}</th><td>${escape(n.state)}</td><td>${memory(n, f)}</td></tr>`,
      )
      .join("");
    this.select("[data-events]").innerHTML =
      f.events
        .map(
          (event) =>
            `<li><b>${escape(event.type === "send" ? "INVIO" : event.type === "deliver" ? "CONSEGNA" : event.type === "discard" ? "SCARTO" : event.type === "loss" ? "OMISSIONE" : "STATO")}</b> ${escape(event.message ? describe(event.message, f) : event.text)}${event.type === "discard" ? ` — ${escape(event.text)}` : ""}</li>`,
        )
        .join("") || "<li>Nessun evento: stato iniziale.</li>";
    this.select("[data-pending-count]").textContent = `(${f.pending.length})`;
    this.select("[data-pending]").innerHTML =
      f.pending
        .map(
          (m) =>
            `<li>${escape(describe(m, f))} · inviato t=${m.sent}, ${m.lost ? "omesso dal guasto" : "consegna prevista"} t=${m.due}</li>`,
        )
        .join("") || "<li>Nessun messaggio in viaggio.</li>";
    this.network(f);
    this.select<HTMLButtonElement>("[data-step]").disabled =
      this.index === this.trace.frames.length - 1;
  }
  private network(f: Frame) {
    const svg = this.host.querySelector<SVGSVGElement>("[data-network]")!;
    svg.setAttribute(
      "viewBox",
      this.compact.matches ? "120 0 360 360" : "0 0 600 360",
    );
    const points = f.nodes.map((_, i) => {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / f.nodes.length;
      return { x: 300 + 125 * Math.cos(a), y: 180 + 125 * Math.sin(a) };
    });
    const chord = this.host.dataset.protocol!.startsWith("chord");
    const edges = chord
      ? f.nodes
          .filter((n) => typeof n.data.successor === "number")
          .map((n) => ({
            a: n.id,
            b: n.data.successor as number,
            directed: true,
          }))
      : f.edges;
    const arrow = `arrow-${this.host.dataset.protocol}`;
    const lines = edges
      .map((edge) => {
        const a = points[edge.a]!,
          b = points[edge.b]!;
        const dx = b.x - a.x,
          dy = b.y - a.y,
          len = Math.hypot(dx, dy) || 1;
        const tree =
          f.nodes[edge.a]!.data.parent === edge.b ||
          f.nodes[edge.b]!.data.parent === edge.a;
        return `<line x1="${a.x + (dx / len) * 24}" y1="${a.y + (dy / len) * 24}" x2="${b.x - (dx / len) * 25}" y2="${b.y - (dy / len) * 25}" class="${tree ? "tree-edge" : "network-edge"}" ${edge.directed ? `marker-end="url(#${arrow})"` : ""}/>${"weight" in edge && edge.weight !== undefined && !["min-hop", "shout", "shout-plus", "dft", "dft-ack", "flooding", "wflood"].includes(this.host.dataset.protocol!) ? `<text class="edge-weight" x="${(a.x + b.x) / 2}" y="${(a.y + b.y) / 2 - 6}">${edge.weight}</text>` : ""}`;
      })
      .join("");
    // All in-flight messages are drawn. New sends share animation start time;
    // visual duration is playback speed, not protocol communication time.
    const moving = f.pending
      .filter((m) => m.from !== m.to)
      .map((m) => {
        const a = points[m.from]!,
          b = points[m.to]!;
        const dx = b.x - a.x,
          dy = b.y - a.y,
          l = Math.hypot(dx, dy) || 1;
        const start = { x: a.x + (dx / l) * 26, y: a.y + (dy / l) * 26 },
          end = { x: b.x - (dx / l) * 26, y: b.y - (dy / l) * 26 };
        const progress = (f.time - m.sent) / Math.max(1, m.due - m.sent);
        const x = start.x + (end.x - start.x) * Math.max(0.18, progress),
          y = start.y + (end.y - start.y) * Math.max(0.18, progress);
        const animate =
          this.reduced.matches || m.lost
            ? ""
            : `<animate attributeName="cx" from="${start.x}" to="${end.x}" dur="${Number(this.select<HTMLSelectElement>("[data-speed]").value) / 1000}s" fill="freeze"/><animate attributeName="cy" from="${start.y}" to="${end.y}" dur="${Number(this.select<HTMLSelectElement>("[data-speed]").value) / 1000}s" fill="freeze"/>`;
        return `<g><title>${escape(describe(m, f))}</title><circle cx="${x}" cy="${y}" r="4" class="${m.lost ? "lost-message" : "message-dot"}">${animate}</circle></g>`;
      })
      .join("");
    const nodes = f.nodes
      .map((n, i) => {
        const p = points[i]!;
        const leader = n.state === "LEADER",
          fault = /CRASH|BYZANTINE/.test(n.state);
        const symbol = leader
          ? "L"
          : fault
            ? "×"
            : n.state === "FOLLOWER"
              ? "F"
              : /DONE|STOPPED|STABLE|ACCEPTED|DECIDED/.test(n.state)
                ? "✓"
                : "…";
        return `<g><title>N${escape(n.label)}: ${escape(n.state)}</title><circle cx="${p.x}" cy="${p.y}" r="23" class="${leader ? "leader-node" : fault ? "faulty-node" : "network-node"}"/><text x="${p.x}" y="${p.y + 5}" class="node-id">${escape(n.label)}</text><text x="${p.x}" y="${p.y + 42}" class="node-status">${symbol} ${escape(n.state.split(" / ")[0])}</text></g>`;
      })
      .join("");
    const labels = [...new Set(f.pending.map((m) => m.kind))];
    const grouped = new Map<string, Message[]>();
    for (const m of f.pending)
      if (m.from !== m.to) {
        const key = `${m.from}:${m.to}`;
        grouped.set(key, [...(grouped.get(key) ?? []), m]);
      }
    const captions = [...grouped.values()]
      .map((messages) => {
        const m = messages[0]!,
          a = points[m.from]!,
          b = points[m.to]!;
        const dx = b.x - a.x,
          dy = b.y - a.y,
          l = Math.hypot(dx, dy) || 1;
        const x = (a.x + b.x) / 2 - (dy / l) * 13,
          y = (a.y + b.y) / 2 + (dx / l) * 13;
        const text = messages.map(
          (v) =>
            `${v.kind}${v.data.v !== undefined ? ` ${v.data.v}` : v.data.key !== undefined ? ` ${v.data.key}` : ""}`,
        );
        return `<text class="edge-message-label" x="${x}" y="${y}">${escape([...new Set(text)].join(" · "))}</text>`;
      })
      .join("");
    svg.innerHTML = `<defs><marker id="${arrow}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#849991"/></marker></defs>${lines}${moving}${captions}${nodes}<text class="message-label" x="300" y="180">${escape(labels.slice(0, 3).join(" · ") || "Nessun messaggio in viaggio")}</text>`;
  }
}
export function mountPlayers() {
  document
    .querySelectorAll<HTMLElement>(".protocol-player")
    .forEach((host) => new Player(host));
}
