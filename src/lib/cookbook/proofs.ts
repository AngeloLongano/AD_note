export interface ProofProblem {
  name: string;
  input: string;
  output: string;
  properties: string;
}
export interface ProofCard {
  id: string;
  group: string;
  title: string;
  theorem: string;
  status?: string;
  problems: ProofProblem[];
  reduction: string;
  strategy: string;
  proof: string[];
  costs: string[];
  factor?: string[];
  note?: string;
  source: string;
  section: string;
  demo?: string;
}
export const proofGroups = [
  { id: "fondamenti", title: "Classi e riduzioni" },
  { id: "tsp-prove", title: "TSP: difficoltà e approssimazioni" },
  { id: "vc-prove", title: "Vertex Cover: riduzioni e approssimazioni" },
];
const hc: ProofProblem = {
  name: "Ciclo Hamiltoniano (HC)",
  input: "Grafo semplice non orientato $G=(V,E)$, con almeno tre vertici.",
  output:
    "SÌ se esiste un ciclo che visita ogni vertice esattamente una volta; NO altrimenti.",
  properties:
    "Decisionale; NP-completo è un risultato noto del corso. La verifica di un ciclo prova soltanto l’appartenenza a NP.",
};
const tsp: ProofProblem = {
  name: "TSP esatto",
  input: "Grafo completo non orientato con costi sugli archi.",
  output: "Un ciclo hamiltoniano $H^*$ di costo minimo.",
  properties:
    "Ottimizzazione. Nella riduzione di NP-hardness sono ammessi costi zero. Un oracolo esatto non è assunto polinomiale.",
};
const metric: ProofProblem = {
  name: "TSP metrico",
  input:
    "Grafo completo non orientato, costi positivi e $c(u,w)\\leq c(u,v)+c(v,w)$.",
  output: "Un tour hamiltoniano $H$; l’obiettivo è minimizzarne il costo.",
  properties:
    "La completezza rende disponibili gli shortcut; la triangolare garantisce che non aumentino il costo. $H^*$ indica un tour ottimo.",
};
const vcd: ProofProblem = {
  name: "Vertex Cover decisionale (VCD)",
  input: "Grafo semplice non orientato $G=(V,E)$ e intero $0\\leq k\\leq |V|$.",
  output:
    "SÌ se esiste una copertura di cardinalità al più $k$; NO altrimenti.",
  properties:
    "NP-completo: la NP-hardness è usata come risultato noto, non dimostrata da una nuova riduzione in queste schede.",
};
const vc: ProofProblem = {
  name: "Vertex Cover (VC)",
  input: "Grafo semplice non orientato $G=(V,E)$.",
  output: "Copertura $V’\\subseteq V$ di cardinalità minima.",
  properties:
    "Una copertura contiene almeno un estremo di ogni arco. Restituire tutti i vertici è facile; minimizzare la cardinalità è NP-hard.",
};
const noReduction =
  "Non si usa una riduzione di Karp o di Turing: la prova confronta direttamente le proprietà o il costo delle soluzioni.";
export const proofs: ProofCard[] = [
  {
    id: "p-in-np",
    group: "fondamenti",
    title: "P ⊆ NP",
    theorem: "$P\\subseteq NP$.",
    problems: [
      {
        name: "Decisore $A$",
        input: "Istanza $i$ di un problema $\\Pi\\in P$.",
        output: "SÌ o NO, correttamente per ogni istanza.",
        properties: "Deterministico, tempo $p(|i|)$ per un polinomio $p$.",
      },
      {
        name: "Verificatore $V$",
        input: "Istanza $i$ e certificato candidato $c$.",
        output: "La risposta di $A(i)$.",
        properties:
          "Ignora $c$; il certificato vuoto basta per ogni istanza positiva.",
      },
    ],
    reduction: noReduction,
    strategy: "Usare l’algoritmo che già decide il problema come verificatore.",
    proof: [
      "Sia $\\Pi\\in P$: esiste un decisore polinomiale $A$. Definiamo $V(i,c)=A(i)$.",
      "Se $i$ è positiva, $V(i,\\varepsilon)$ accetta: esiste un certificato valido di lunghezza zero.",
      "Se $i$ è negativa, $V(i,c)$ rifiuta per ogni $c$, perché $A$ è corretto.",
      "Il verificatore è polinomiale e i certificati sono di lunghezza polinomiale, quindi $\\Pi\\in NP$.",
    ],
    costs: [
      "Il verificatore esegue $A$ una volta: $T_V(|i|)=p(|i|)+O(1)$. Il certificato ignorato non deve essere letto.",
      "La lunghezza del certificato scelto è $0$. Non si ricercano né si enumerano certificati.",
    ],
    source: "Slide p. 9",
    section: "Relazione tra P e NP",
  },
  {
    id: "hc-in-np",
    group: "fondamenti",
    title: "Il ciclo hamiltoniano appartiene a NP",
    theorem: "$HC\\in NP$.",
    problems: [
      hc,
      {
        name: "Verificatore del ciclo",
        input: "$G$ e una sequenza candidata $(v_1,\\ldots,v_n)$, con $n=|V|$.",
        output: "SÌ solo se la sequenza descrive un ciclo hamiltoniano di $G$.",
        properties:
          "Verifica la proposta; non cerca una sequenza e non decide HC da solo.",
      },
    ],
    reduction: noReduction,
    strategy: "Usare l’ordine dei vertici del ciclo come certificato.",
    proof: [
      "Controllare che la sequenza abbia lunghezza $n$, contenga solo vertici del grafo e non abbia duplicati: allora contiene ogni vertice una volta.",
      "Controllare i $n-1$ archi consecutivi e l’arco di chiusura $(v_n,v_1)$.",
      "Se HC è SÌ, la sequenza di un ciclo esistente passa tutti i controlli. Se HC è NO, nessuna sequenza può passarli.",
      "L’esistenza di un certificato polinomiale e di questa verifica polinomiale prova $HC\\in NP$. Non prova da sola la NP-completezza.",
    ],
    costs: [
      "Con ID dei vertici da $1$ a $n$, il certificato occupa $O(n\\log n)$ bit.",
      "Con matrice di adiacenza e array di marcature: $O(n)$ controlli, ciascuno a costo costante nel modello RAM. Da liste, preparare la matrice costa $O(n^2+m)$ e spazio $O(n^2)$, con $m=|E|$.",
      "L’eventuale enumerazione di $n!$ ordini è ricerca esaustiva, non il costo del verificatore né una prova di impossibilità.",
    ],
    source: "Slide pp. 4, 7–8",
    section: "Esempio: ciclo hamiltoniano",
  },
  {
    id: "karp-composizione",
    group: "fondamenti",
    title: "Riduzione di Karp: algoritmo composto e transitività",
    theorem:
      "Se $A\\leq_p B$ e $B\\in P$, allora $A\\in P$. Se $A\\leq_p B$ e $B\\leq_p C$, allora $A\\leq_p C$.",
    problems: [
      {
        name: "Problema decisionale $A$",
        input: "Istanza $x$.",
        output: "SÌ/NO.",
        properties: "La trasformazione $f$ preserva esattamente la risposta.",
      },
      {
        name: "Problema decisionale $B$",
        input: "Istanza $f(x)$.",
        output: "SÌ/NO; stessa risposta dell’istanza di partenza.",
        properties:
          "Per il primo risultato, dispone di un decisore polinomiale $D_B$.",
      },
    ],
    reduction:
      "Karp: $x \\xrightarrow{f} f(x) \\xrightarrow{D_B} \\text{SÌ/NO}$. Per la transitività: $x\\xrightarrow{f}f(x)\\xrightarrow{g}g(f(x))$.",
    strategy:
      "Trasformare prima l’istanza e poi eseguire l’algoritmo disponibile; comporre le trasformazioni per concatenare riduzioni.",
    proof: [
      "Per definizione, $x\\in A\\iff f(x)\\in B$. Il decisore $D_B(f(x))$ restituisce quindi la risposta corretta per $A$.",
      "Una trasformazione polinomiale può scrivere solo un numero polinomiale di simboli: anche $|f(x)|$ è polinomiale in $|x|$. L’algoritmo composto resta polinomiale.",
      "Se $y\\in B\\iff g(y)\\in C$, allora $x\\in A\\iff g(f(x))\\in C$. La funzione $g\\circ f$ è la riduzione cercata.",
    ],
    costs: [
      "Poni $N=|x|$, $T_f(N)=O(N^a)$ e $T_{D_B}(M)=O(M^b)$. Poiché $|f(x)|=O(N^a)$, il totale è $O(N^a+N^{ab})$: ancora un polinomio.",
      "Analogamente, se $T_g(M)=O(M^d)$, comporre le trasformazioni costa $O(N^a+N^{ad})$. Gli esponenti sono costanti indipendenti dall’istanza.",
    ],
    source: "Slide p. 11; passaggi esplicitati nel riassunto",
    section: "Riduzione di Karp",
  },
  {
    id: "criterio-npc",
    group: "fondamenti",
    title: "Come dimostrare la NP-completezza",
    theorem:
      "Se $B$ è NP-completo, $B\\leq_p A$ e $A\\in NP$, allora $A$ è NP-completo.",
    problems: [
      {
        name: "Problema noto $B$",
        input: "Istanza $x$ di $B$.",
        output: "SÌ/NO.",
        properties: "NP-completo: ogni problema in NP si riduce a $B$.",
      },
      {
        name: "Problema da classificare $A$",
        input: "Istanza $f(x)$ di $A$.",
        output: "SÌ/NO.",
        properties:
          "Occorre anche un verificatore polinomiale per $A$: la sola riduzione prova NP-hardness.",
      },
    ],
    reduction:
      "$C\\leq_p B\\leq_p A$ per ogni $C\\in NP$. Il problema noto va a sinistra, quello da dimostrare difficile a destra.",
    strategy:
      "Separare appartenenza a NP e NP-hardness; usare la transitività per non costruire una riduzione da ogni problema di NP.",
    proof: [
      "Il verificatore e i certificati polinomiali dimostrano $A\\in NP$.",
      "Per ogni $C\\in NP$, dalla NP-completezza di $B$ segue $C\\leq_p B$. Componendo con $B\\leq_p A$ si ottiene $C\\leq_p A$.",
      "Le due condizioni della definizione di NP-completo sono soddisfatte.",
      "Se $A$ fosse decidibile in tempo polinomiale, ogni $C\\in NP$ lo sarebbe tramite la riduzione: $NP\\subseteq P$. Con $P\\subseteq NP$, seguirebbe $P=NP$.",
    ],
    costs: [
      "La composizione ha il costo polinomiale calcolato nella scheda precedente. Va dimostrata anche la dimensione polinomiale dell’istanza prodotta.",
      "Non si ottiene un algoritmo polinomiale concreto senza un decisore polinomiale per $A$: questa è la conseguenza ipotetica della classificazione.",
    ],
    source: "Slide p. 17; argomento nel riassunto",
    section: "Problemi NP-completi",
  },
  {
    id: "tsp-np-hard",
    group: "tsp-prove",
    title: "Il TSP è NP-hard: costi 0/1",
    theorem: "Il problema del commesso viaggiatore è NP-hard.",
    problems: [hc, tsp],
    reduction:
      "Turing: $G\\xrightarrow{\\text{completa e pesa }0/1}G’\\xrightarrow{TSP_{opt}}H^*\\xrightarrow{K=cost(H^*)} (K=0?)$. Una chiamata esatta. La stessa trasformazione è di Karp verso TSP decisionale con soglia zero.",
    strategy:
      "Far contare al costo del tour gli archi che mancavano nel grafo originale.",
    proof: [
      "Costruire $G’$ completo sugli stessi vertici. Porre $c(e)=0$ per $e\\in E$ e $c(e)=1$ per gli archi aggiunti.",
      "Se $G$ contiene un ciclo hamiltoniano, quel ciclo costa zero in $G’$. Per non negatività dei pesi, l’ottimo $K$ vale zero.",
      "Se $K=0$, nessun arco del tour ottimo può avere costo uno. Tutti i suoi archi appartengono a $G$: il tour è un ciclo hamiltoniano di $G$.",
      "Dunque $G\\in HC\\iff K=0$. Il risolutore esatto del TSP decide HC con lavoro esterno polinomiale: $HC\\leq_T^p TSP_{opt}$.",
    ],
    costs: [
      "Il grafo completo ha $n(n-1)/2$ archi: si considera una volta ogni coppia non ordinata. Con una matrice di adiacenza, costruzione e pesi costano $O(n^2)$.",
      "Sommare i $n$ pesi del tour costa $O(n)$; memoria $O(n^2)$. I pesi 0/1 occupano un numero costante di bit.",
      "Il totale esterno è $O(n^2)$, più una chiamata al TSP esatto. Non attribuiamo tempo polinomiale all’oracolo.",
    ],
    note: "La costruzione non garantisce la triangolare. La NP-hardness non richiede l’ipotesi P ≠ NP.",
    source: "Slide pp. 24–26",
    section: "TSP è un problema NP-hard",
    demo: "tsp-zero",
  },
  {
    id: "tsp-inapprossimabile",
    group: "tsp-prove",
    title: "Il TSP generale non ammette un fattore costante",
    theorem:
      "Non esiste un algoritmo di approssimazione polinomiale per il problema del commesso viaggiatore che abbia fattore di approssimazione costante, a meno che $P=NP$.",
    problems: [
      hc,
      {
        name: "Algoritmo ipotetico $A$",
        input: "Grafo completo con costi positivi, senza ipotesi triangolare.",
        output:
          "Tour ammissibile di costo al più $r\\,OPT$, per una costante $r\\geq1$.",
        properties:
          "Supposto polinomiale per arrivare all’assurdo; non è un algoritmo disponibile.",
      },
    ],
    reduction:
      "Uso di una chiamata ad $A$: $G\\to G’\\to H=A(G’)\\to (cost(H)\\leq r|V|?)$. È un argomento con oracolo di approssimazione, non una riduzione di Karp tra due problemi decisionali.",
    strategy:
      "Creare un divario di costi che rimanga distinguibile anche dopo un errore moltiplicativo di fattore $r$.",
    proof: [
      "Supporre l’esistenza di $A$. Completare $G$ e assegnare costo $1$ agli archi originali e $r|V|+1$ agli archi aggiunti.",
      "Caso SÌ: un ciclo originale costa $|V|$ ed è ottimo, perché ciascuno dei suoi $|V|$ archi costa almeno uno. Quindi $cost(A(G’))\\leq r|V|$.",
      "Caso NO: ogni tour usa almeno un arco aggiunto. Il costo è almeno $(r|V|+1)+(|V|-1)=r|V|+|V|>r|V|$. Anche il tour approssimato supera la soglia.",
      "La soglia decide correttamente HC in tempo polinomiale. Poiché HC è NP-completo, seguirebbe $P=NP$. Se $P\\neq NP$, $A$ non esiste.",
    ],
    costs: [
      "Si scrivono $|V|(|V|-1)/2$ pesi. Per $r$ costante fissata, il peso grande ha $O(\\log |V|)$ bit: l’istanza ha dimensione polinomiale. Si può assumere un fattore intero arrotondando verso l’alto la costante garantita.",
      "Costruzione $O(|V|^2)$ operazioni sui pesi, una esecuzione polinomiale di $A$ e somma di $|V|$ costi. Anche contando i bit, il totale resta polinomiale.",
    ],
    factor: [
      "La garanzia $cost(H)\\leq r\\,OPT$ si usa solo nel caso SÌ. Nel caso NO basta l’ammissibilità: qualunque tour costa più della soglia.",
      "Il risultato riguarda ogni costante fissata $r$, per il TSP generale; non si applica al TSP metrico.",
    ],
    source: "Slide pp. 68–69",
    section: "Inapprossimabilità del TSP generale",
    demo: "tsp-gap",
  },
  {
    id: "shortcut",
    group: "tsp-prove",
    title: "La scorciatoia non aumenta il costo",
    theorem:
      "Sia $G$ un grafo con archi pesati tale che la funzione costo soddisfi la proprietà triangolare. Per un cammino semplice $C=\\langle v_1,\\ldots,v_{k+1}\\rangle$, si ha $c(v_1,v_{k+1})\\leq\\sum_{i=1}^k c(v_i,v_{i+1})$.",
    problems: [
      {
        name: "Cammino e arco diretto",
        input: "Cammino semplice con $k$ archi in un grafo completo metrico.",
        output: "Arco tra gli stessi estremi.",
        properties:
          "Completezza: l’arco esiste. Triangolare: l’arco non costa più del cammino.",
      },
    ],
    reduction: noReduction,
    strategy:
      "Induzione sul numero di archi, usando la triangolare per unire i segmenti.",
    proof: [
      "Per $k=1$ è uguaglianza; per $k=2$ è la disuguaglianza triangolare.",
      "Per $k>2$, l’ipotesi induttiva sul prefisso dà $\\sum_{i=1}^{k-2}c(v_i,v_{i+1})\\geq c(v_1,v_{k-1})$.",
      "La triangolare sugli ultimi due archi dà $c(v_{k-1},v_k)+c(v_k,v_{k+1})\\geq c(v_{k-1},v_{k+1})$.",
      "Sommando e applicando ancora la triangolare: il costo del cammino è almeno $c(v_1,v_{k-1})+c(v_{k-1},v_{k+1})\\geq c(v_1,v_{k+1})$.",
      "Per saltare visite ripetute in un percorso euleriano, eventuali sottocammini chiusi si eliminano prima senza aumentare il costo. Il cammino rimasto ammette lo shortcut.",
    ],
    costs: [
      "La dimostrazione è un’induzione, non un algoritmo di ottimizzazione. Sommare i $k$ costi richiede $O(k)$ operazioni; leggere il costo diretto dalla matrice richiede $O(1)$.",
      "Scansionare un tour euleriano di lunghezza $L$ e conservare la prima visita di ciascun vertice costa $O(L+n)$ con marcature; nei due algoritmi TSP qui trattati $L=O(n)$.",
    ],
    source: "Slide p. 70",
    section: "Lo shortcut di un cammino semplice",
    demo: "shortcut",
  },
  {
    id: "tsp-due",
    group: "tsp-prove",
    title: "TSP metrico: 2-approssimazione",
    status: "Facoltativo · AA 2025/26",
    theorem: "L’algoritmo è una due approssimazione.",
    problems: [
      metric,
      {
        name: "MST e raddoppio",
        input: "Lo stesso grafo metrico.",
        output:
          "MST $T^*$, multigrafo con archi raddoppiati, tour euleriano $E$, poi tour $H$.",
        properties:
          "Un MST minimizza il costo tra gli alberi di copertura; raddoppiare rende ogni grado pari.",
      },
    ],
    reduction: noReduction,
    strategy:
      "Usare l’MST come lower bound dell’ottimo, poi raddoppiarlo per ottenere un percorso chiuso.",
    proof: [
      "Calcolare $T^*$ e raddoppiarne gli $n-1$ archi. Il multigrafo è connesso e tutti i gradi sono pari: esiste un ciclo euleriano $E$.",
      "Gli shortcut eliminano le visite ripetute senza aumentare il costo: $cost(H)\\leq cost(E)=2cost(T^*)$.",
      "Togliendo un arco da $H^*$ si ottiene un albero di copertura $T$, con $cost(T)\\leq cost(H^*)$. Per minimalità $cost(T^*)\\leq cost(T)$.",
      "Combinare: $cost(H)\\leq2cost(T^*)\\leq2cost(H^*)$. Il tour restituito è ammissibile e il costo è entro il doppio dell’ottimo.",
    ],
    costs: [
      "Su grafo completo, Prim con matrice costa $O(n^2)$: per ciascuno dei $n$ inserimenti si scandiscono fino a $n$ vertici.",
      "Raddoppio: $2(n-1)$ copie di archi, quindi $O(n)$. Hierholzer visita ogni copia una volta, e gli shortcut scandiscono il percorso: entrambi $O(n)$.",
      "Totale $O(n^2)$ operazioni; spazio $O(n^2)$ per l’input, più $O(n)$ per albero, percorso e marcature. I costi numerici si assumono codificati con un numero finito di bit.",
    ],
    factor: [
      "Il 2 viene dal raddoppio, non dagli shortcut. L’MST costa al più l’ottimo; non serve conoscere il tour ottimo per eseguire l’algoritmo.",
      "Il bound è asintoticamente tight: nella famiglia del riassunto un tour sfavorevole costa $2n-2$ contro $OPT=n$, con rapporto $2-2/n\\to2$. Non ogni esecuzione raggiunge il bound.",
    ],
    source: "Slide p. 71; tightness nel riassunto",
    section: "Algoritmo di 2-approssimazione (facoltativo)",
    demo: "double-tree",
  },
  {
    id: "christofides-prova",
    group: "tsp-prove",
    title: "Christofides: fattore 3/2",
    theorem:
      "L’algoritmo di Christofides ha un fattore di approssimazione uguale a $3/2$.",
    problems: [
      metric,
      {
        name: "Christofides",
        input: "Grafo completo metrico.",
        output:
          "Tour $H$ ottenuto da MST $T^*$ e perfect matching minimo $M^*$ sui vertici dispari $V_d$.",
        properties:
          "$G_d=G[V_d]$ è completo; il matching deve essere perfetto e di peso minimo, non soltanto massimale.",
      },
    ],
    reduction: noReduction,
    strategy:
      "Rendere pari i gradi aggiungendo solo un matching che costa al più metà dell’ottimo.",
    proof: [
      "Il numero dei vertici dispari dell’MST è pari: la somma dei gradi è $2(n-1)$. Su $G_d$ completo esiste un perfect matching. Aggiungerlo all’MST rende tutti i gradi pari e conserva la connettività.",
      "Togliendo un arco da $H^*$ e usando la minimalità dell’MST, $cost(T^*)\\leq cost(H^*)$.",
      "Da $H^*$ saltare con shortcut i vertici fuori da $V_d$ e ottenere un ciclo $\\Gamma$ sui vertici dispari: $cost(\\Gamma)\\leq cost(H^*)$.",
      "Gli archi alternati di $\\Gamma$ formano due perfect matching $M_1,M_2$. Almeno uno costa al più $cost(\\Gamma)/2$. Per minimalità, $cost(M^*)\\leq\\min(cost(M_1),cost(M_2))\\leq cost(H^*)/2$. Se $|V_d|=2$, $\\Gamma$ percorre due volte l’unico arco e i due matching sono una copia ciascuno.",
      "Il multigrafo $G’=T^*\\cup M^*$ ha un ciclo euleriano $E$. Gli shortcut danno $H$ con $cost(H)\\leq cost(E)=cost(T^*)+cost(M^*)\\leq\\frac32cost(H^*)$.",
    ],
    costs: [
      "Prim: $O(n^2)$. Trovare i gradi e $V_d$ costa $O(n)$ sull’albero; costruire $G_d$ costa $O(|V_d|^2)$.",
      "Indichiamo con $T_{PM}(q,B)$ il costo di un algoritmo polinomiale per perfect matching pesato su $q=|V_d|$ vertici e pesi di $B$ bit: le fonti richiedono la polinomialità, senza fissare qui un’implementazione.",
      "$G’$ ha $n-1+|V_d|/2=O(n)$ copie di archi: Euler e shortcut costano $O(n)$. Totale $O(n^2)+T_{PM}(|V_d|,B)$, polinomiale nella codifica dell’input.",
    ],
    factor: [
      "Il fattore $3/2=1+1/2$ somma il bound dell’MST e quello del matching. La triangolare serve sia per costruire $\\Gamma$ sia per ottenere $H$.",
      "$H^*$ e $\\Gamma$ sono strumenti della prova; l’algoritmo non li calcola.",
    ],
    source: "Slide pp. 73–74",
    section: "Algoritmo di Christofides",
    demo: "christofides",
  },
  {
    id: "vc-np-hard",
    group: "vc-prove",
    title: "Vertex Cover è NP-hard",
    theorem: "Il problema del Vertex Cover è NP-Hard.",
    problems: [vcd, vc],
    reduction:
      "Turing: $(G,k)\\to G\\xrightarrow{VC}V’\\to (|V’|\\leq k?)$. Una chiamata al risolutore di ottimizzazione.",
    strategy:
      "La soluzione ottima risponde a tutte le domande di soglia sulla sua cardinalità.",
    proof: [
      "Chiamare l’oracolo VC su $G$ e ottenere una copertura minima $V’$.",
      "Se $|V’|\\leq k$, quella copertura prova che VCD è SÌ.",
      "Se $|V’|>k$, per minimalità non può esistere una copertura più piccola con cardinalità al più $k$: VCD è NO.",
      "Il confronto decide VCD con una chiamata e lavoro esterno polinomiale. Poiché VCD è NP-completo, VC è NP-hard.",
    ],
    costs: [
      "Il grafo viene passato invariato. Copiarne la rappresentazione, se necessario, costa $O(n+m)$.",
      "Contare la cardinalità di $V’$ costa $O(n)$, o $O(1)$ se già disponibile; confrontarla con $k$ è polinomiale nella codifica.",
      "Una chiamata esatta. Il costo dell’oracolo non è incluso nel lavoro esterno.",
    ],
    source: "Slide pp. 55–56",
    section: "Vertex Cover Problem",
  },
  {
    id: "vc-self-reduction",
    group: "vc-prove",
    title: "Self-reduction: ricostruire VC usando VCD",
    status: "Facoltativo · AA 2025/26",
    theorem: "$VC\\leq_P VCD$.",
    problems: [vc, vcd],
    reduction:
      "Turing polinomiale: ricerca binaria su $A(G,k)$, poi chiamate adattive $A(G_c-v,k-1)$. La notazione delle slide $\\leq_P$ indica qui una riduzione con più interrogazioni, non Karp.",
    strategy:
      "Trovare prima la dimensione ottima; poi includere un vertice solo quando l’oracolo conferma che rimane un completamento possibile.",
    proof: [
      "La risposta $A(G,k)$ è monotona in $k$. La ricerca binaria su $[0,n]$ trova il minimo $k^*$ con risposta SÌ.",
      "Inizializzare $G_c=G$, $C=\\varnothing$, $k=k^*$. Invariante: $C$ copre gli archi già rimossi, $G_c$ ha una copertura di dimensione al più $k$ e $|C|+k=k^*$.",
      "Per un vertice non esaminato $v$, chiedere se $G_c-v$ ha una copertura di dimensione al più $k-1$. Se SÌ, aggiungere $v$ a $C$, rimuoverlo definitivamente con i suoi archi, decrementare $k$. L’invariante è preservato.",
      "Se NO, nessuna copertura compatibile col budget corrente può contenere $v$: marcarlo come esaminato, senza modificare né $G_c$ né $k$. Un insieme di scelte compatibili più ristretto non può rendere possibile un vertice già escluso.",
      "Finché resta un arco, una copertura residua contiene almeno un suo estremo ancora selezionabile. Si termina dopo al più $n$ tentativi. Alla fine $C$ copre il grafo originale e ha dimensione al più $k^*$; per minimalità di $k^*$ è ottima.",
    ],
    costs: [
      "Ricerca binaria: a ogni interrogazione si dimezza un intervallo di $n+1$ valori, quindi $O(\\log(n+1))$ chiamate.",
      "Ricostruzione: ogni vertice viene provato una sola volta, al più $n$ chiamate. Totale $O(n+\\log(n+1))$ chiamate adattive.",
      "Con una semplice copia del grafo per ogni tentativo, il lavoro esterno è $O(n(n+m))$, spazio $O(n+m)$. È un bound di un’implementazione semplice, non un costo imposto dalle slide; i tempi delle chiamate vanno aggiunti separatamente.",
    ],
    note: "Un SÌ significa che v può appartenere a una soluzione ottima compatibile, non che debba appartenere a tutte. Nel caso NO la rimozione è solo temporanea.",
    source: "Slide pp. 56–57; correzioni verificate nel riassunto",
    section: "Self-reduction del Vertex Cover",
    demo: "self-vc",
  },
  {
    id: "vc-vertice-arbitrario",
    group: "vc-prove",
    title: "Greedy su vertice arbitrario: nessun fattore costante",
    theorem:
      "La scelta di un vertice arbitrario di grado positivo non garantisce un fattore di approssimazione costante.",
    problems: [
      vc,
      {
        name: "Greedy su vertici",
        input: "Grafo residuo degli archi non ancora coperti.",
        output:
          "Copertura $C$ ottenuta scegliendo vertici ed eliminando gli archi incidenti.",
        properties:
          "Termina ed è ammissibile; scegliere un vertice arbitrario non significa scegliere un arco e prenderne entrambi gli estremi.",
      },
    ],
    reduction: noReduction,
    strategy:
      "Costruire una famiglia di istanze e scelte ammesse in cui il rapporto cresce senza limite.",
    proof: [
      "Considerare la stella $S_k$ con centro $c$ e $k$ foglie. Il centro da solo copre tutti gli archi: $|OPT|=1$ per $k\\geq1$.",
      "Finché resta un arco, una foglia incidenta a quell’arco ha grado positivo ed è una scelta lecita. Scegliendo sempre una foglia si ottiene $|C|=k$.",
      "Il rapporto è $|C|/|OPT|=k$. Per qualunque costante proposta $r$, basta scegliere $k>r$: la garanzia viene violata.",
    ],
    costs: [
      "Con liste e marcature ogni arco eliminato viene trattato un numero costante di volte: $O(n+m)$ tempo e $O(n+m)$ spazio.",
      "Sulla stella $n=k+1$, $m=k$: costo lineare e rapporto $k=n-1$. Essere veloce e ammissibile non implica una buona approssimazione.",
    ],
    factor: [
      "Il controesempio riguarda una famiglia crescente e scelte ammesse sfavorevoli. Una sola stella di dimensione fissata non escluderebbe ogni costante.",
    ],
    source: "Slide p. 58; famiglia esplicitata nel riassunto",
    section: "Prima scelta: un vertice arbitrario",
  },
  {
    id: "vc-grado-massimo",
    group: "vc-prove",
    title: "Greedy sul grado massimo: famiglia senza fattore costante",
    status: "Approfondimento · prova esterna al corpus delle slide",
    theorem:
      "La scelta del grado massimo nel grafo residuo non garantisce un fattore costante, con risoluzione sfavorevole dei pareggi.",
    problems: [
      vc,
      {
        name: "Greedy sul grado massimo",
        input: "Grafo degli archi ancora scoperti.",
        output:
          "Copertura ottenuta scegliendo un vertice di grado residuo massimo per volta.",
        properties:
          "L’euristica è citata nelle slide; la famiglia seguente è un approfondimento già presente nel riassunto.",
      },
    ],
    reduction: noReduction,
    strategy:
      "Preparare livelli di vertici che il greedy possa consumare in ordine decrescente, mentre una sola partizione copre tutto.",
    proof: [
      "Creare un grafo bipartito: $L$ contiene $r$ vertici; $R_i$ contiene $\\lfloor r/i\\rfloor$ vertici di grado $i$, per $i=1,\\ldots,r$. Nello stesso livello i loro vicini in $L$ sono disgiunti.",
      "Quando restano i livelli $R_1,\\ldots,R_i$, ogni vertice di $L$ ha grado al più $i$, mentre quelli di $R_i$ hanno grado $i$. Nei pareggi, il greedy può scegliere tutti i vertici di $R_i$.",
      "Ripetendo per $i=r,r-1,\\ldots,1$, l’algoritmo sceglie tutto $R$. Invece $L$ copre tutti gli archi; i $r$ archi disgiunti di $R_1$ obbligano ogni copertura ad almeno $r$ vertici: $|OPT|=r$.",
      "Quindi $|C|/|OPT|=(\\sum_{i=1}^r\\lfloor r/i\\rfloor)/r$. Usando $r/i-1\\leq\\lfloor r/i\\rfloor\\leq r/i$, il rapporto è tra $H_r-1$ e $H_r$, dove $H_r=\\sum_{i=1}^r1/i=\\Theta(\\log r)$. Cresce senza limite.",
    ],
    costs: [
      "Una semplice implementazione ricalcola tutti i gradi residui e ne cerca il massimo in $O(n+m)$ a iterazione. Al più $n$ selezioni: $O(n(n+m))$, quindi polinomiale.",
      "Per la famiglia, $n=r+\\sum_i\\lfloor r/i\\rfloor=\\Theta(r\\log r)$. Il rapporto è anche $\\Omega(\\log n)$. Questi calcoli riguardano la qualità della soluzione, non il tempo dell’euristica.",
    ],
    factor: [
      "L’esempio piccolo con rapporto $3/2$ non basta: la famiglia logaritmica esclude ogni fattore costante. La prova usa esplicitamente pareggi risolti verso $R$.",
    ],
    source:
      "Riassunto, approfondimento con riferimento Zito, Vertex Cover, pp. 5–8",
    section: "Seconda scelta: un vertice di grado massimo",
  },
  {
    id: "vc-matching",
    group: "vc-prove",
    title: "Greedy su archi: fattore 2",
    theorem: "Il fattore di approssimazione dell’algoritmo è 2.",
    problems: [
      vc,
      {
        name: "Approx-Vertex-Cover",
        input: "Grafo non orientato non pesato.",
        output:
          "Copertura $C$: per ogni arco scelto, prende entrambi gli estremi.",
        properties:
          "Gli archi scelti $E’$ formano un matching massimale; non occorre un matching massimo.",
      },
    ],
    reduction: noReduction,
    strategy:
      "Usare gli archi disgiunti selezionati come lower bound: qualunque copertura deve pagare almeno un vertice per ciascuno.",
    proof: [
      "Scegliere un arco $(u,v)$ ancora scoperto, aggiungere entrambi gli estremi a $C$, eliminare tutti gli archi incidenti a $u$ o $v$. Ripetere finché non restano archi.",
      "Ogni arco eliminato è coperto; ogni iterazione elimina almeno un arco. Quindi l’algoritmo termina e la soluzione è ammissibile.",
      "Gli archi scelti non condividono estremi, perché gli archi incidenti vengono eliminati subito. Quindi $E’$ è un matching e $|C|=2|E’|$.",
      "Ogni copertura ottima deve coprire gli archi di $E’$. Essendo disgiunti, richiedono almeno $|E’|$ vertici distinti: $|OPT|\\geq|E’|$.",
      "Combinando: $|C|=2|E’|\\leq2|OPT|$.",
    ],
    costs: [
      "Con liste di adiacenza e marcature, scorrere gli archi e ignorare quelli già eliminati. Ogni vertice selezionato ha la propria lista esaminata una sola volta; la somma delle lunghezze delle liste è $2m$.",
      "Tempo $O(n+m)$, spazio $O(n+m)$ incluso il grafo. Riscegliere da zero un arco scandendo tutto il grafo a ogni passo non darebbe questo bound.",
    ],
    factor: [
      "Il 2 confronta due estremi scelti con almeno un estremo obbligatorio per ogni arco disgiunto. Il lower bound corretto è $|OPT|\\geq|E’|$.",
      "Tightness: su $K_{q,q}$ un matching perfetto ha $q$ archi; il greedy prende $2q$ vertici, mentre una partizione di $q$ vertici è ottima. Il rapporto vale esattamente 2. Se non ci sono archi, entrambi i costi sono zero e vale direttamente la disuguaglianza.",
    ],
    source: "Slide pp. 59–60; refuso del lower bound corretto nel riassunto",
    section: "Terza scelta: un arco arbitrario",
    demo: "matching-vc",
  },
  {
    id: "vc-relax-round",
    group: "vc-prove",
    title: "Relax & Round: ammissibilità e fattore 2",
    theorem:
      "Relax & Round restituisce un vertex cover ammissibile con $\\mathrm{Cost}(APPROX)\\leq2\\mathrm{Cost}(OPT)$.",
    problems: [
      vc,
      {
        name: "ILP esatto e LP rilassato",
        input:
          "Una variabile $x_v$ per vertice, vincoli $x_u+x_v\\geq1$ per ogni arco; obiettivo $\\min\\sum_v x_v$.",
        output: "ILP: soluzione ottima binaria; LP: ottimo frazionario $X^*$.",
        properties:
          "ILP impone $x_v\\in\\{0,1\\}$ ed è NP-hard. LP impone $0\\leq x_v\\leq1$ ed è polinomiale.",
      },
      {
        name: "Rounding",
        input: "Soluzione LP ottima $X^*$.",
        output: "$X=APPROX$: $x_v=1$ se $x_v^*\\geq1/2$, zero altrimenti.",
        properties:
          "La soglia include l’uguaglianza. Si tratta della variante non pesata.",
      },
    ],
    reduction: noReduction,
    strategy:
      "Il rilassamento fornisce un lower bound; il rounding aumenta ogni contributo al costo di al più un fattore due.",
    proof: [
      "Per ogni arco, $x_u^*+x_v^*\\geq1$: almeno un valore è $\\geq1/2$. Arrotondando, almeno un estremo viene scelto. La soluzione è un vertex cover.",
      "Ogni soluzione intera ammissibile è anche ammissibile per LP. Minimizzando su un insieme più grande, $\\mathrm{Cost}(X^*)\\leq\\mathrm{Cost}(OPT)$.",
      "Per ogni $v$, se $x_v=0$ allora $x_v\\leq2x_v^*$. Se $x_v=1$, la regola implica $x_v^*\\geq1/2$, quindi ancora $x_v\\leq2x_v^*$.",
      "Sommare: $\\mathrm{Cost}(APPROX)=\\sum_vx_v\\leq2\\sum_vx_v^*=2\\mathrm{Cost}(X^*)\\leq2\\mathrm{Cost}(OPT)$.",
    ],
    costs: [
      "La formulazione ha $n$ variabili, $m$ vincoli sugli archi e $2n$ limiti sulle variabili. I coefficienti sono 0/1: la codifica ha dimensione polinomiale.",
      "Costruire il modello costa $O(n+m)$ in forma sparsa. Il tempo LP è polinomiale nella lunghezza in bit della sua codifica: non assegniamo un bound numerico senza scegliere un risolutore.",
      "Rounding: $n$ confronti con $1/2$, quindi $O(n)$ operazioni. Totale $T_{LP}+O(n+m)$; non si risolve il programma intero.",
    ],
    factor: [
      "Il 2 deriva dal bound per variabile $x_v\\leq2x_v^*$. L’ammissibilità e il confronto dei costi sono due passaggi distinti, entrambi necessari.",
      "Su un ciclo pari di $n$ vertici, $x_v^*=1/2$ è una soluzione LP ottima: sommando i vincoli si ottiene $2\\sum_vx_v^*\\geq n$. Il rounding prende tutti i vertici, contro $OPT=n/2$. Rapporto 2 se il risolutore restituisce quell’ottimo frazionario; esistono anche ottimi LP interi.",
    ],
    note: "La variante pesata è indicata come fuori dal programma AA 2025/26 e non è inclusa in questa scheda.",
    source: "Slide pp. 64–67; soglia corretta rispetto al refuso di p. 66",
    section: "Relax & Round per Vertex Cover",
    demo: "round-vc",
  },
];
