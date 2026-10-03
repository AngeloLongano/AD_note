import { type Trace } from "./engine";
import { type Scenario } from "./scenarios";
import {
  configure,
  flooding,
  shout,
  dft,
  saturation,
  twoSteps,
} from "./diffusion";
import {
  allTheWay,
  lcr,
  controlledDistance,
  floodmax,
  waiting,
  randomElection,
} from "./election";
import { gossiping, iterating, minHop, dijkstra } from "./routing";
import { crashConsensus, benOr, registeredMail } from "./consensus";
import { chord } from "./chord";
export function simulate(protocol: string, s: Scenario): Trace {
  const e = configure(s);
  let finish: (() => void) | undefined;
  switch (protocol) {
    case "flooding":
      flooding(e, s);
      break;
    case "simple-broadcast":
      e.at(0, () => {
        e.phase = "Broadcast diretto sul completo noto";
        e.update(s.initiators[0]!, "DONE", { known: "I" });
        if (e.nodes.length === 1)
          e.result = "Unico nodo già informato; nessun invio.";
        for (const to of e.neighbours(s.initiators[0]!))
          e.send(s.initiators[0]!, to, "I");
      });
      for (const node of e.nodes)
        e.on(node.id, () => {
          e.update(node.id, "DONE", { known: "I" });
          if (e.nodes.every((v) => v.state === "DONE"))
            e.result = "Tutti informati con n−1 invii diretti.";
        });
      break;
    case "wflood":
      flooding(e, s, "W");
      break;
    case "shout":
      shout(e, s, false);
      break;
    case "shout-plus":
      shout(e, s, true);
      break;
    case "dft":
      dft(e, s, false);
      break;
    case "dft-ack":
      dft(e, s, true);
      break;
    case "saturation":
      saturation(e, s, false);
      break;
    case "tree-election":
      saturation(e, s, true);
      break;
    case "all-the-way":
      allTheWay(e, s);
      break;
    case "lcr":
      lcr(e, s);
      break;
    case "controlled-distance":
      controlledDistance(e, s);
      break;
    case "floodmax":
      floodmax(e);
      break;
    case "speeding":
      lcr(e, s, true);
      break;
    case "waiting":
      waiting(e, s);
      break;
    case "universal-waiting":
      waiting(e, s, true);
      break;
    case "random-election":
      randomElection(e, s);
      break;
    case "gossiping":
      gossiping(e, s);
      break;
    case "iterating":
      iterating(e);
      break;
    case "min-hop":
      minHop(e, s);
      break;
    case "dijkstra":
      dijkstra(e, s);
      break;
    case "two-steps":
      twoSteps(e, s);
      break;
    case "tellall":
      crashConsensus(e, s, false);
      break;
    case "tellzero-crash":
      crashConsensus(e, s, true);
      break;
    case "ben-or":
      benOr(e, s);
      break;
    case "registered-mail":
      registeredMail(e, s, false);
      break;
    case "tellzero-byz":
      registeredMail(e, s, true);
      break;
    case "chord-successor":
      finish = chord(e, s, "successor");
      break;
    case "chord-finger":
      finish = chord(e, s, "finger");
      break;
    case "chord-join":
      finish = chord(e, s, "join");
      break;
    default:
      throw new Error(`Protocollo sconosciuto: ${protocol}`);
  }
  const synchronous = [
    "floodmax",
    "speeding",
    "waiting",
    "universal-waiting",
    "random-election",
    "iterating",
    "tellall",
    "tellzero-crash",
    "registered-mail",
    "tellzero-byz",
  ].includes(protocol);
  const note =
    protocol === "random-election"
      ? `Monete riproducibili: seme ${s.seed}. Le onde restart sono unite; il nuovo tentativo parte al confine sincrono comune 3n. È una scelta esplicita di coordinamento della simulazione.`
      : protocol === "tree-election"
        ? "Qui Saturation trasporta anche l’ID del mittente per confrontare la coppia; questo esempio non implementa l’ottimizzazione in bit che trasmette ID solo nella coppia finale."
        : synchronous
          ? "Consegne per link in una unità; confini dei round dopo le consegne. Invii indipendenti simultanei."
          : s.delayed
            ? "Asincrono: ritardi di 1–3 unità scelti dalla simulazione, costanti per link (FIFO). Queste unità non sono un bound al tempo fisico."
            : "Asincrono: consegne unitarie scelte per illustrare il tempo ideale; nessun limite di un solo messaggio per nodo. Non sono round del protocollo.";
  const trace = e.run(
    synchronous ? "Tick sincroni" : "Tempo della simulazione",
    note,
  );
  finish?.();
  trace.result = e.result;
  return trace;
}
