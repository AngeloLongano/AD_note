export interface DemoNode {
  id: string;
  x: number;
  y: number;
}
export interface DemoEdge {
  a: string;
  b: string;
  label?: string;
  tone?: "chosen" | "added" | "muted";
  dashed?: boolean;
}
export interface DemoFrame {
  title: string;
  text: string;
  formula: string;
  edges: DemoEdge[];
  selected?: string[];
  labels?: Record<string, string>;
}
export interface DemoScenario {
  name: string;
  nodes: DemoNode[];
  frames: DemoFrame[];
}
export interface ProofDemo {
  title: string;
  scenarios: DemoScenario[];
}
const square: DemoNode[] = [
  { id: "a", x: 65, y: 65 },
  { id: "b", x: 295, y: 65 },
  { id: "c", x: 295, y: 230 },
  { id: "d", x: 65, y: 230 },
];
const line: DemoNode[] = [
  { id: "a", x: 45, y: 145 },
  { id: "b", x: 135, y: 145 },
  { id: "c", x: 225, y: 145 },
  { id: "d", x: 315, y: 145 },
];
const edge = (
  a: string,
  b: string,
  label?: string,
  tone?: DemoEdge["tone"],
): DemoEdge => ({ a, b, label, tone });
const cycle = [edge("a", "b"), edge("b", "c"), edge("c", "d"), edge("d", "a")];
const path = [edge("a", "b"), edge("b", "c"), edge("c", "d")];
function reduction(gap: boolean): ProofDemo {
  return {
    title: gap
      ? "Separare i casi con una soglia"
      : "Dalla presenza degli archi al costo del tour",
    scenarios: [true, false].map((yes) => {
      const original = yes ? cycle : path;
      const pairs = [...cycle, edge("a", "c"), edge("b", "d")];
      const present = (e: DemoEdge) =>
        original.some((o) => o.a === e.a && o.b === e.b);
      const lo = gap ? "1" : "0",
        hi = gap ? "9" : "1";
      const weighted = pairs.map((e) => ({
        ...e,
        label: present(e) ? lo : hi,
        tone: present(e) ? ("chosen" as const) : ("added" as const),
        dashed: !present(e),
      }));
      return {
        name: yes
          ? "Istanza SÌ: ciclo presente"
          : "Istanza NO: cammino senza ciclo",
        nodes: square,
        frames: [
          {
            title: "1. Istanza HC",
            text: yes
              ? "Gli archi del quadrato formano un ciclo hamiltoniano."
              : "Il grafo è un cammino: a e d hanno grado uno, quindi non esiste un ciclo hamiltoniano.",
            formula: gap ? "|V|=4,\\quad r=2,\\quad r|V|=8" : "|V|=4",
            edges: original,
          },
          {
            title: "2. Completa e assegna i costi",
            text: gap
              ? "Esempio con fattore ipotetico r=2: gli archi originali costano 1, gli aggiunti 2·4+1=9."
              : "Ogni arco originale costa 0; ogni arco aggiunto costa 1. Gli archi tratteggiati erano assenti.",
            formula: gap
              ? "c(e)=1\\text{ oppure }9"
              : "c(e)=0\\text{ oppure }1",
            edges: weighted,
          },
          {
            title: "3. Il divario che decide HC",
            text: gap
              ? yes
                ? "L’ottimo vale 4. Qualunque algoritmo con garanzia 2 deve restituire un tour di costo al più 8; il tour disegnato è un esempio, non il risultato obbligatorio dell’algoritmo."
                : "Ogni tour deve usare un arco aggiunto di costo 9 e altri tre archi di costo almeno 1: costa almeno 12, oltre la soglia 8."
              : yes
                ? "Il tour disegnato usa solo archi originali, quindi costa 0 ed è ottimo."
                : "Qualunque tour deve chiudere il cammino con almeno un arco aggiunto: l’ottimo è almeno 1. Il tour disegnato costa 1 e raggiunge quel limite.",
            formula: gap
              ? yes
                ? "OPT=4,\\quad ALG\\leq8"
                : "ALG\\geq9+3=12>8"
              : yes
                ? "K=0\\Rightarrow\\text{SÌ}"
                : "K=1\\Rightarrow\\text{NO}",
            edges: weighted.filter((e) =>
              cycle.some((c) => c.a === e.a && c.b === e.b),
            ),
          },
        ],
      };
    }),
  };
}
export const proofDemos: Record<string, ProofDemo> = {
  "tsp-zero": reduction(false),
  "tsp-gap": reduction(true),
  shortcut: {
    title: "Accorciare lo stesso cammino",
    scenarios: [
      {
        name: "Quattro archi, metrica sulla retta",
        nodes: [
          { id: "v₁", x: 30, y: 150 },
          { id: "v₂", x: 105, y: 150 },
          { id: "v₃", x: 175, y: 150 },
          { id: "v₄", x: 245, y: 150 },
          { id: "v₅", x: 330, y: 150 },
        ],
        frames: [
          {
            title: "1. Cammino originale",
            text: "I vertici sono a coordinate 0, 2, 5, 7, 10 sulla retta. Il costo è la distanza assoluta; gli altri archi del grafo completo sono omessi.",
            formula: "2+3+2+3=10",
            edges: [
              edge("v₁", "v₂", "2"),
              edge("v₂", "v₃", "3"),
              edge("v₃", "v₄", "2"),
              edge("v₄", "v₅", "3"),
            ],
          },
          {
            title: "2. Ipotesi induttiva e triangolare",
            text: "Il prefisso v₁–v₂–v₃ si accorcia in v₁–v₃; gli ultimi due archi in v₃–v₅. Le due disuguaglianze possono anche essere uguaglianze.",
            formula: "c(v_1,v_3)+c(v_3,v_5)=5+5=10",
            edges: [
              edge("v₁", "v₃", "5", "chosen"),
              edge("v₃", "v₅", "5", "chosen"),
            ],
          },
          {
            title: "3. Ultima applicazione della triangolare",
            text: "Si sostituisce il percorso residuo con l’arco diretto. Il costo non aumenta. La prova generale vale anche quando le disuguaglianze sono strette.",
            formula: "c(v_1,v_5)=10\\leq5+5\\leq10",
            edges: [edge("v₁", "v₅", "10", "chosen")],
          },
        ],
      },
    ],
  },
  "double-tree": {
    title: "MST → raddoppio → Euler → shortcut",
    scenarios: [
      {
        name: "Quadrato con distanze Manhattan",
        nodes: square,
        frames: [
          {
            title: "1. MST",
            text: "I lati costano 1, le diagonali 2. Il cammino a–b–c–d è un MST: tre archi di costo 1.",
            formula: "cost(T^*)=3\\leq OPT=4",
            edges: path.map((e) => ({ ...e, label: "1", tone: "chosen" })),
          },
          {
            title: "2. Raddoppia ogni arco",
            text: "Ogni arco è presente in due copie. I gradi diventano 2, 4, 4, 2: tutti pari, connettività conservata.",
            formula: "2(n-1)=6\\text{ copie di archi}",
            edges: path.map((e) => ({ ...e, label: "1 × 2", tone: "chosen" })),
          },
          {
            title: "3. Percorso euleriano",
            text: "a → b → c → d → c → b → a. Ogni copia è attraversata esattamente una volta.",
            formula: "cost(E)=6=2cost(T^*)",
            edges: path.map((e) => ({
              ...e,
              label: "due passaggi",
              tone: "chosen",
            })),
          },
          {
            title: "4. Salta le visite ripetute",
            text: "Conservare a, b, c, d e chiudere direttamente in a: d–c–b–a costa 3, ma d–a costa 1. Il tour finale costa 4. Questo esempio non raggiunge il fattore 2.",
            formula: "cost(H)=4\\leq6\\leq2OPT=8",
            edges: cycle.map((e) => ({ ...e, label: "1", tone: "chosen" })),
          },
        ],
      },
    ],
  },
  christofides: {
    title: "Perché il matching costa al più metà",
    scenarios: [
      {
        name: "Metrica di una stella: quattro vertici dispari",
        nodes: [
          { id: "a", x: 180, y: 65 },
          { id: "b", x: 45, y: 235 },
          { id: "c", x: 180, y: 235 },
          { id: "d", x: 315, y: 235 },
        ],
        frames: [
          {
            title: "1. MST e vertici dispari",
            text: "Distanze della stella: centro–foglia costa 1, foglia–foglia costa 2. L’MST ha tre archi, gradi 3, 1, 1, 1. V_d contiene tutti i vertici.",
            formula: "cost(T^*)=3,\\quad |V_d|=4",
            edges: [
              edge("a", "b", "1"),
              edge("a", "c", "1"),
              edge("a", "d", "1"),
            ],
            selected: ["a", "b", "c", "d"],
          },
          {
            title: "2. Il ciclo Γ della prova",
            text: "Il tour ottimo a–b–c–d–a costa 6; qui Γ coincide con esso, perché tutti i vertici sono in V_d. L’algoritmo non conosce questo tour.",
            formula: "cost(\\Gamma)=1+2+2+1=6=OPT",
            edges: [
              edge("a", "b", "1"),
              edge("b", "c", "2"),
              edge("c", "d", "2"),
              edge("d", "a", "1"),
            ],
          },
          {
            title: "3. Due perfect matching alternati",
            text: "M₁={ab,cd} costa 1+2=3; M₂={bc,da} costa 2+1=3. Entrambi coprono ogni vertice una volta; insieme suddividono Γ.",
            formula: "cost(M^*)\\leq\\min(3,3)=3=OPT/2",
            edges: [
              edge("a", "b", "1", "chosen"),
              edge("c", "d", "2", "chosen"),
              edge("b", "c", "2", "added"),
              edge("d", "a", "1", "added"),
            ],
          },
          {
            title: "4. Unione come multigrafo",
            text: "Scegliere M*={ab,cd}. In T*∪M*, ab ha due copie; a e b diventano di grado 4 e 2, c e d di grado 2. Un Euler è a–b–a–c–d–a.",
            formula: "cost(E)=3+3=6",
            edges: [
              edge("a", "b", "1 × 2"),
              edge("a", "c", "1"),
              edge("a", "d", "1"),
              edge("c", "d", "2", "chosen"),
            ],
          },
          {
            title: "5. Shortcut e garanzia",
            text: "Saltando la seconda visita di a, si ottiene a–b–c–d–a. Qui il costo resta 6 ed è ottimo; il fattore 3/2 è una garanzia generale, non il rapporto obbligatorio di ogni istanza.",
            formula: "cost(H)=6\\leq\\tfrac32OPT=9",
            edges: [
              edge("a", "b", "1"),
              edge("b", "c", "2"),
              edge("c", "d", "2"),
              edge("d", "a", "1"),
            ],
          },
        ],
      },
    ],
  },
  "self-vc": {
    title: "Un NO conserva il grafo, un SÌ impegna una scelta",
    scenarios: [
      {
        name: "Cammino a–b–c–d",
        nodes: line,
        frames: [
          {
            title: "1. Trova la cardinalità",
            text: "A(G,1)=NO perché ab e cd sono disgiunti; A(G,2)=SÌ perché {b,c} copre tutto. La ricerca binaria trova k*=2.",
            formula: "k=2,\\quad C=\\varnothing",
            edges: path,
          },
          {
            title: "2. Prova a includere a",
            text: "G−a è il cammino b–c–d, copribile con {c}. A(G−a,1)=SÌ: includere a è possibile, anche se non indispensabile. Si eliminano ab e a definitivamente.",
            formula: "C=\\{a\\},\\quad k=1",
            edges: [edge("b", "c"), edge("c", "d")],
            selected: ["a"],
          },
          {
            title: "3. Prova a includere b: NO",
            text: "G_c−b conserva l’arco cd. Con budget zero non è copribile: NO. b viene solo marcato; il grafo corrente conserva entrambi gli archi bc e cd.",
            formula: "C=\\{a\\},\\quad k=1\\text{ invariato}",
            edges: [edge("b", "c"), edge("c", "d")],
            selected: ["a"],
          },
          {
            title: "4. Prova a includere c: SÌ",
            text: "G_c−c non ha archi, quindi è copribile con zero vertici. Si sceglie c, il budget diventa zero e non restano archi. {a,c} è una copertura ottima.",
            formula: "C=\\{a,c\\},\\quad |C|=k^*=2",
            edges: path.map((e) => ({ ...e, tone: "muted" })),
            selected: ["a", "c"],
          },
        ],
      },
    ],
  },
  "matching-vc": {
    title: "Due scelte lecite sullo stesso cammino",
    scenarios: [
      {
        name: "Prima bc: matching massimale di un arco",
        nodes: line,
        frames: [
          {
            title: "1. Tre archi scoperti",
            text: "Si può scegliere qualsiasi arco residuo. Il grafo è il cammino a–b–c–d.",
            formula: "C=\\varnothing,\\quad E’=\\varnothing",
            edges: path,
          },
          {
            title: "2. Scegli bc e i due estremi",
            text: "Inserire b e c copre bc, ab e cd. Tutti gli archi vengono eliminati.",
            formula: "E’=\\{bc\\},\\quad C=\\{b,c\\}",
            edges: path.map((e) => ({
              ...e,
              tone: e.a === "b" ? "chosen" : "muted",
            })),
            selected: ["b", "c"],
          },
          {
            title: "3. Massimale non significa massimo",
            text: "Non si può aggiungere ab o cd al matching {bc}. Tuttavia {ab,cd} ha due archi, quindi {bc} non è massimo. La copertura restituita è ottima, con due vertici.",
            formula: "|C|=2|E’|=2\\leq2|OPT|=4",
            edges: [edge("b", "c", undefined, "chosen")],
            selected: ["b", "c"],
          },
        ],
      },
      {
        name: "Prima ab, poi cd: rapporto esattamente 2",
        nodes: line,
        frames: [
          {
            title: "1. Scegli ab",
            text: "Si selezionano a e b e si eliminano ab e bc. L’arco cd resta scoperto.",
            formula: "E’=\\{ab\\},\\quad C=\\{a,b\\}",
            edges: [
              edge("a", "b", undefined, "chosen"),
              edge("b", "c", undefined, "muted"),
              edge("c", "d"),
            ],
            selected: ["a", "b"],
          },
          {
            title: "2. Scegli cd",
            text: "Si selezionano anche c e d. I due archi scelti sono disgiunti, quindi ogni copertura richiede almeno due vertici.",
            formula: "|E’|=2,\\quad |C|=4,\\quad |OPT|\\geq2",
            edges: [
              edge("a", "b", undefined, "chosen"),
              edge("c", "d", undefined, "chosen"),
            ],
            selected: ["a", "b", "c", "d"],
          },
          {
            title: "3. Confronta con l’ottimo",
            text: "{b,c} copre tutti gli archi e ha due vertici: OPT=2. Questa esecuzione restituisce quattro vertici e realizza rapporto 2.",
            formula: "|C|/|OPT|=4/2=2",
            edges: path,
            selected: ["b", "c"],
          },
        ],
      },
    ],
  },
  "round-vc": {
    title: "La soglia 1/2 e il caso di uguaglianza",
    scenarios: [
      {
        name: "Ciclo pari di quattro vertici",
        nodes: square,
        frames: [
          {
            title: "1. Ottimo frazionario",
            text: "Porre x*=1/2 su ogni vertice soddisfa ogni vincolo con uguaglianza. Sommando i quattro vincoli, ogni variabile compare due volte: il costo LP è almeno 2. Questa soluzione raggiunge 2.",
            formula: "2\\sum_vx_v^*\\geq4,\\quad Cost(X^*)=2",
            edges: cycle,
            labels: { a: "½", b: "½", c: "½", d: "½" },
          },
          {
            title: "2. Arrotonda includendo l’uguaglianza",
            text: "Tutti i valori sono ≥1/2, quindi tutti i vertici vengono scelti. Se si usasse >1/2, nessuno sarebbe scelto e tutti gli archi resterebbero scoperti.",
            formula: "Cost(APPROX)=4\\leq2Cost(X^*)=4",
            edges: cycle,
            selected: ["a", "b", "c", "d"],
            labels: { a: "1", b: "1", c: "1", d: "1" },
          },
          {
            title: "3. Ottimo intero e rapporto",
            text: "{a,c} è una copertura con due vertici; gli archi disgiunti ab e cd impongono almeno due vertici. L’ottimo intero vale 2. Il rapporto è 2 per l’ottimo frazionario mostrato; un LP solver può anche restituire un ottimo intero.",
            formula: "Cost(APPROX)/Cost(OPT)=4/2=2",
            edges: cycle,
            selected: ["a", "c"],
            labels: { a: "1", b: "0", c: "1", d: "0" },
          },
        ],
      },
    ],
  },
};
