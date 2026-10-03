import booklet from "./booklet.json";
export const groups = [
  { id: "diffusione", title: "Diffusione e alberi" },
  { id: "elezione", title: "Elezione del leader" },
  { id: "routing", title: "Routing" },
  { id: "consenso", title: "Guasti e consenso" },
  { id: "chord", title: "Chord" },
];
export interface Card {
  id: string;
  title: string;
  group: string;
  source: string;
  objective: string;
  topology: string;
  model: string;
  states: string;
  idea: string;
  rules: string[];
  costs: string[];
  properties: string[];
  optional?: boolean;
  overview?: string;
  warning?: string;
}
type Book = { title: string; blocks: any[][]; tag: string | null };
function card(
  id: string,
  title: string,
  group: string,
  source: keyof typeof booklet,
  objective: string,
  topology: string,
  model: string,
  states: string,
  idea: string,
  rules: string[],
  extra: Partial<Card> = {},
): Card {
  const text = (booklet[source] as Book).blocks;
  return {
    id,
    title,
    group,
    source,
    objective,
    topology,
    model,
    states,
    idea,
    rules,
    costs: text
      .filter(
        (b) =>
          b[0] === "formula" ||
          (b[0] === "p" &&
            ["Costo", "Tempo", "Messaggi", "Spazio"].includes(b[1])),
      )
      .map((b) => (b[0] === "formula" ? b[1] : `${b[1]}: ${b[2]}`)),
    properties: text
      .filter(
        (b) =>
          b[0] === "p" &&
          [
            "Prova",
            "Invariante",
            "Termina",
            "Limite",
            "Attenzione",
            "Ricorda",
            "Nota",
          ].includes(b[1]),
      )
      .map((b) => `${b[1]}: ${b[2]}`),
    ...extra,
  };
}
const generic =
  "Asincrono; link bidirezionali affidabili, grafo connesso; vicini e porte locali noti. Nessuna mappa globale.";
const ringModel =
  "Asincrono; link affidabili, ID distinti e porte distinguibili. n non noto. Più iniziatori ammessi.";
const crashModel =
  "Completo affidabile, avvio simultaneo, round sincroni. n e F noti; al più F<n crash, anche durante un invio. Valori booleani.";
const byzModel =
  "Completo sincrono affidabile; n,F noti, F<n/3. Identità di mittente non falsificabili, senza firme digitali. Broadcast include il mittente.";
export const cards: Card[] = [
  card(
    "flooding",
    "Flooding / Broadcast",
    "diffusione",
    "Flooding / Broadcast",
    "Far conoscere I a tutti, partendo dall’unico nodo s che lo possiede.",
    "Grafo generico; casi albero e completo.",
    generic + " Un unico iniziatore. n e gli ID non necessari.",
    "Stati: INITIATOR, SLEEPING, DONE. Messaggio: I. Memoria: informazione appresa; DONE impedisce nuovi inoltri.",
    "Attraversa ogni frontiera tra chi conosce I e chi ancora dorme.",
    [
      "Impulso a s: invia I a tutti i vicini e passa a DONE.",
      "Prima I da p a un nodo SLEEPING: inoltra a N(x) escluso p, poi DONE.",
      "In DONE ignora tutte le copie. DONE segnala solo la fine locale.",
    ],
    {
      costs: [
        "M = 2m−n+1 invii esatti in ogni esecuzione: s invia deg(s), gli altri deg(x)−1. Su albero n−1; sul completo generico (n−1)².",
        "Tᵢ = r(s) fino all’ultima prima ricezione; migliore/peggiore sorgente minimizzano/massimizzano r(s), con massimo D. Svuotare le copie residue può richiedere ancora tempo.",
        "Tempo causale ≤n−1 per prime ricezioni, ≤n con copie residue. Tempo fisico asincrono senza bound uniforme. Non ci sono attivazione separata o notifica.",
      ],
    },
  ),
  card(
    "simple-broadcast",
    "Broadcast diretto sul completo noto",
    "diffusione",
    "Flooding / Broadcast",
    "Diffondere I con un solo invio per destinatario.",
    "Grafo completo noto all’iniziatore.",
    generic + " Unico s; s sa che tutti gli altri nodi sono vicini.",
    "Stati: SLEEPING, DONE. Messaggio: I; nessun inoltro.",
    "La conoscenza del completo permette a s di raggiungere tutti direttamente.",
    [
      "s invia I a ciascuno degli n−1 vicini.",
      "Chi riceve conserva I e passa a DONE. Non inoltra.",
    ],
    {
      costs: [
        "M=n−1 esatto; Tᵢ=1 per n≥2 (zero per n=1). Stesso costo migliore e peggiore nel modello ideale; nessuna notifica finale.",
      ],
      properties: [
        "La garanzia dipende dalla conoscenza della topologia completa. Il lower bound m per protocolli generici senza questa conoscenza non si applica.",
      ],
    },
  ),
  card(
    "wflood",
    "WFlood / Wake-up",
    "diffusione",
    "WFlood / Wake-up",
    "Risvegliare tutti a partire da almeno un impulso spontaneo.",
    "Grafo generico connesso.",
    generic + " Uno o più iniziatori, non noti agli altri.",
    "Stati: ASLEEP, AWAKE. Messaggio W. Memoria: stato di attivazione.",
    "Come Flooding, ma ogni nodo può svegliarsi spontaneamente.",
    [
      "ASLEEP + impulso: invia W a tutti e diventa AWAKE.",
      "ASLEEP + W da p: invia W a tutti tranne p e diventa AWAKE.",
      "AWAKE: ignora gli eventi successivi.",
    ],
    {
      costs: [
        "M=2m−n+k esatto, dove k conta i risvegli spontanei prima di W. A grafo fissato: minimo k=1, massimo k=n.",
        "Con S simultaneo: Tᵢ=maxᵥ minₛ∈S d(s,v), fino all’ultimo risveglio. Dal primo iniziatore ≤D; le copie residue sono separate. Nessuna notifica.",
      ],
    },
  ),
  card(
    "shout",
    "SHOUT",
    "diffusione",
    "SHOUT e SHOUT+",
    "Costruire uno spanning tree noto localmente ai due estremi di ogni arco.",
    "Grafo generico.",
    generic +
      " Unico iniziatore. FIFO richiesto per la variante NO con contatore.",
    "Stati: INITIATOR, IDLE, ACTIVE, DONE. Messaggi: Q richiede adesione, YES accetta, NO rifiuta. Variabili: parent, TreeNeighbours, counter.",
    "La prima Q sceglie il padre; le risposte fanno conoscere anche i figli.",
    [
      "s invia Q a tutti; counter=0. IDLE riceve Q da p: parent=p, invia YES a p, counter=1 e Q agli altri.",
      "ACTIVE riceve una Q successiva: risponde NO.",
      "YES aggiunge il mittente a TreeNeighbours; YES e NO incrementano counter.",
      "Quando counter=deg(x), passa a DONE. Per un nodo isolato è immediato.",
    ],
    {
      costs: [
        "M=4m−2n+2 esatto: 2 per arco dell’albero, 4 per gli altri. A grafo fissato non cambia con l’ordine di consegna.",
        "Tᵢ fino al DONE di tutti: r(s)+1 ≤ Tᵢ ≤ r(s)+2, n≥2. Il triangolo raggiunge r(s)+2. Nessuna notifica globale.",
      ],
    },
  ),
  card(
    "shout-plus",
    "SHOUT+",
    "diffusione",
    "SHOUT e SHOUT+",
    "Stesso spanning tree, eliminando le risposte NO.",
    "Grafo generico.",
    generic + " Unico iniziatore; non occorre FIFO per il rifiuto implicito.",
    "Stati: IDLE, ACTIVE, DONE. Q e YES; parent, figli e vicini classificati sono variabili.",
    "Una Q incrociata classifica l’arco come esterno all’albero.",
    [
      "s invia Q a tutti. Alla prima Q scegli parent, invia YES e Q agli altri vicini.",
      "Una Q successiva è un rifiuto implicito: classifica il mittente senza inviare NO.",
      "YES registra un figlio. Dopo aver classificato tutti i vicini passa a DONE.",
    ],
    {
      costs: [
        "M=2m esatto in ogni esecuzione: Q/YES o Q/Q per arco.",
        "Tᵢ=r(s)+1 per n≥2, fino al DONE di tutti; zero per n=1. Non include una rilevazione globale, che il protocollo non fornisce.",
      ],
    },
  ),
  card(
    "dft",
    "DFT semplice",
    "diffusione",
    "DFT: un token alla volta",
    "Visitare il grafo in profondità e costruire lo spanning tree della visita.",
    "Grafo generico.",
    generic + " Unico iniziatore; nessun FIFO richiesto.",
    "Stati: IDLE, VISITED, DONE. ForwardToken tenta una visita; ReturnToken chiude un sottoalbero; BackEdgeToken rifiuta una visita. Variabili: entry/parent, Unvisited, vicino atteso e figli.",
    "Chi invia il token attende il suo ritorno prima di provare un altro vicino.",
    [
      "Alla prima visita registra entry; Unvisited contiene i vicini tranne entry.",
      "VISIT: estrai un vicino da Unvisited, invia ForwardToken e attendi.",
      "ForwardToken a un già visitato: rimuovi il mittente da Unvisited e rispondi BackEdgeToken.",
      "ReturnToken registra un figlio; ReturnToken o BackEdgeToken riattiva VISIT.",
      "Unvisited vuoto: ReturnToken al padre e DONE. Alla radice, DONE rileva la fine globale.",
    ],
  ),
  card(
    "dft-ack",
    "DFT con Visited / Ack",
    "diffusione",
    "DFT con Visited / Ack",
    "Ridurre la catena sequenziale evitando i tentativi verso nodi già visitati.",
    "Grafo generico.",
    generic + " Unico iniziatore; nessun FIFO richiesto.",
    "Stati: IDLE, VISITED (attesa Ack o token), DONE. Messaggi token più Visited e Ack. Variabili: Unvisited, parent, figli, notifiche ricevute, Ack attesi.",
    "Prima di muovere il token, avvisa in parallelo il vicinato.",
    [
      "Prima visita, radice inclusa: invia Visited a tutti tranne parent e attendi ogni Ack.",
      "Ricevi Visited: rimuovi il mittente dai futuri Unvisited e rispondi Ack, anche se sei ancora IDLE.",
      "Dopo gli Ack esegui VISIT come DFT; il token percorre solo gli archi dell’albero.",
      "Esauriti i vicini restituisci ReturnToken; alla radice il ritorno finale rileva la fine globale.",
    ],
    {
      costs: [
        "M≤4m è un upper bound, non un conteggio esatto: token 2(n−1), handshake sugli archi dell’albero e sugli altri archi.",
        "Tᵢ≤4n−2: 2(n−1) token sequenziali e al più 2n unità di handshake sul cammino critico. Il migliore esatto non è specificato nelle fonti.",
        "Memoria O(deg(x)) record; nessuna notifica finale aggiuntiva.",
      ],
    },
  ),
  card(
    "saturation",
    "Saturazione: minimo globale",
    "diffusione",
    "Saturazione su alberi",
    "Raccogliere il minimo dei valori locali e renderlo noto a tutti.",
    "Albero non radicato; caso radicato con broadcast/convergecast.",
    generic +
      " FIFO; i nodi sanno che la rete è un albero. Almeno un iniziatore.",
    "Stati: SLEEPING, AWAKE, PROCESSING, SATURATED, DONE. W attiva; Saturation riassume una componente; Resolution diffonde il risultato. Variabili: contributi ricevuti, vicino rimasto, aggregato.",
    "Le foglie inviano verso l’interno; la coppia finale risolve e diffonde verso l’esterno.",
    [
      "Risveglio: W a tutti, o a tutti tranne chi ha attivato il nodo.",
      "Dopo contributi da tutti tranne un vicino, invia a quel vicino il minimo fra il tuo valore e i ricevuti.",
      "Se ricevi anche dal vicino cui hai inviato, sei SATURATED: combina tutte le componenti.",
      "I due saturati inviano Resolution agli altri vicini; ogni ricevente inoltra verso l’esterno e termina.",
    ],
    {
      properties: [
        "Ogni contributo rappresenta una componente separata dall’arco; la coppia saturata copre l’intero albero.",
        "M≤4n−4, n≥2, include wake-up ≤2(n−1), saturazione n, risoluzione n−2. Con WFlood qui k iniziatori: wake-up n+k−2.",
        "Su albero radicato si diffonde dalla radice, si aggrega dai figli e si restituisce il risultato. La radice è già un leader designato.",
        "Per n=1 nessun invio. La coppia dipende dai ritardi. Il tempo fisico asincrono non ha bound uniforme.",
      ],
    },
  ),
  card(
    "tree-election",
    "Elezione della coppia saturata",
    "elezione",
    "Elezione nell’albero",
    "Eleggere il minore dei due ID della coppia finale.",
    "Albero non radicato.",
    generic + " FIFO, ID distinti; rete nota come albero.",
    "Saturazione, poi LEADER e FOLLOWER. W, Saturation, Resolution. Memoria: vicino rimasto e ID della coppia.",
    "Scegli prima due vicini tramite saturazione, poi rompi la simmetria con i loro ID.",
    [
      "Attiva e satura l’albero: ogni nodo invia quando ha ricevuto da tutti tranne uno.",
      "I due saturati confrontano i propri ID e scelgono il minore della coppia.",
      "Diffondi la scelta verso l’esterno; solo il nodo scelto è LEADER.",
    ],
    {
      properties: [
        "Il leader è il minimo della coppia saturata; non va confuso con il minimo globale dell’albero.",
        "Nel disegno Saturation porta l’ID locale del mittente: il numero di invii segue la saturazione, ma non si illustra la variante ottimizzata in bit.",
        "La slide propone messaggi costanti per saturare e due soli ID nel confronto: O(n+log MaxID) bit. Le modalità di fusione del confronto con gli ultimi invii non sono sviluppate.",
      ],
    },
  ),
  card(
    "all-the-way",
    "All The Way",
    "elezione",
    "All The Way",
    "Eleggere l’ID minimo facendo conoscere a ogni nodo tutti gli ID.",
    "Anello unidirezionale o bidirezionale.",
    ringModel +
      " L’esempio usa un senso comune di inoltro e contatori di hop per scoprire n.",
    "Stati: SLEEPING, ACTIVE, LEADER, FOLLOWER. ID(v,hops) percorre un giro. Variabili: minimo, ID ricevuti, n appreso dal proprio ritorno.",
    "Ogni token completa il giro; più token avanzano insieme.",
    [
      "Al risveglio, anche su messaggio, avvia il tuo ID con hops=1.",
      "Ogni ID ricevuto aggiorna il minimo e il numero di ID ricevuti.",
      "ID altrui: inoltra all’altro vicino, incrementando hops. Il tuo ID di ritorno si ferma e rivela n.",
      "Quando hai ricevuto n ID, incluso il tuo, decidi LEADER se sei il minimo, altrimenti FOLLOWER. Nessuna notifica.",
    ],
    {
      costs: [
        "M=n² esatto: n ID × n archi, in ogni esecuzione. Include gli invii che attivano gli altri nodi; nessuna notifica.",
        "Avvio simultaneo e ritardo unitario: Tᵢ=n. Un solo iniziatore e risveglio progressivo: Tᵢ≤2n−1. Sono token concorrenti, senza un limite di un messaggio per nodo.",
        "Bit: ID più O(log n) bit di contatore per messaggio; il tempo fisico asincrono non ha bound uniforme.",
      ],
    },
  ),
  card(
    "lcr",
    "As Far As It Can / LCR",
    "elezione",
    "As Far As It Can / LCR",
    "Eleggere l’ID minimo fermando i candidati maggiori.",
    "Anello con un solo senso di inoltro.",
    ringModel,
    "Stati: SLEEPING, ACTIVE, LEADER, FOLLOWER. ID avanza; Notify conclude. Variabile: minimo osservato.",
    "Solo il minimo globale non incontra un ID che lo blocchi.",
    [
      "Impulso: invia il tuo ID. Risveglio su ID maggiore del tuo: scarta e avvia il tuo; su ID minore: inoltralo.",
      "Già attivo: inoltra soltanto ID minori del minimo visto e aggiorna il minimo. Gli altri si fermano.",
      "Il tuo ID torna: LEADER e invio Notify. Gli altri diventano FOLLOWER e inoltrano Notify fino al suo ritorno.",
    ],
  ),
  card(
    "controlled-distance",
    "Controlled Distance / HS",
    "elezione",
    "Controlled Distance / HS",
    "Eleggere il minimo usando esplorazioni con raggio crescente.",
    "Anello bidirezionale.",
    ringModel,
    "Stati: SLEEPING, CANDIDATE, DEFEATED, LEADER, FOLLOWER. Forth(v,stage,dir,hops) esplora; Back torna; Notify conclude. Variabili: stage e Back ricevuti.",
    "Sopravvive chi è minimo entro il raggio su entrambi i lati.",
    [
      "Stage i: invia Forth in entrambe le direzioni con raggio 2ⁱ.",
      "Un candidato con ID minore ferma Forth; un candidato raggiunto da ID minore è DEFEATED e inoltra passivamente i messaggi altrui.",
      "Al raggio previsto, Forth diventa Back e ritorna lungo la direzione opposta.",
      "Due Back del tuo stage consentono i+1. Un Forth di un candidato ancora attivo che compie il giro e ritorna lo elegge.",
      "Il leader notifica lungo l’anello; i follower inoltrano fino al ritorno della notifica.",
    ],
  ),
  card(
    "floodmax",
    "FloodMax",
    "elezione",
    "FloodMax su grafo generico",
    "Eleggere il nodo con ID massimo.",
    "Grafo generico connesso.",
    "Sincrono, link bidirezionali affidabili e FIFO; ID distinti. Ogni nodo conosce D o un upper bound L≥D. Avvio simultaneo.",
    "Stati: ACTIVE, LEADER, FOLLOWER. Max(v,r) è il massimo del round precedente. Variabili: massimo, round, messaggi dei vicini.",
    "Il massimo noto si propaga di un hop per round.",
    [
      "Inizializza il massimo al tuo ID.",
      "A ogni round invia il massimo a tutti i vicini; attendi tutti i loro messaggi del round e aggiorna.",
      "Dopo L round sei LEADER se il massimo è il tuo ID, altrimenti FOLLOWER. L’esempio usa L=n−1.",
    ],
    {
      costs: [
        "M=2mL e T=L round esatti, con avvio simultaneo. Nessuna notifica ulteriore.",
        "Non si ferma anticipatamente in un caso favorevole: con stesso L i costi restano gli stessi. Conoscere D anziché un upper bound più grande riduce i round.",
      ],
    },
  ),
  card(
    "yoyo",
    "YO-YO",
    "elezione",
    "YO-YO: senza diametro noto",
    "Eleggere l’ID minimo senza conoscere il diametro.",
    "Grafo generico.",
    "Link bidirezionali affidabili, ID distinti.",
    "Ruoli logici: source, internal, sink; ID, YES, NO.",
    "Orienta il grafo, propaga minimi e voti, poi riduci i candidati.",
    [],
    {
      optional: true,
      overview:
        "Dopo lo scambio degli ID, gli archi vanno dal minore al maggiore e formano un DAG. YO propaga il minimo verso i sink; −YO restituisce YES/NO. I NO invertono archi e sconfiggono source; il pruning elimina archi superflui. La source finale rimasta senza archi si elegge e notifica. Richiamo facoltativo, senza simulazione o approfondimento.",
      costs: [],
      properties: [],
    },
  ),
  card(
    "speeding",
    "Speeding",
    "elezione",
    "Speeding: ID piccoli più veloci",
    "Eleggere il minimo facendo viaggiare più lentamente gli ID maggiori.",
    "Anello unidirezionale.",
    "Sincrono affidabile, ID interi distinti non negativi, n non noto. α indica l’ID minimo. Analisi con avvio simultaneo; un ID entra in un messaggio logico.",
    "Stati: SLEEPING, ACTIVE, LEADER, FOLLOWER. ID e Notify. Variabili: minimo visto, attese e coda locale degli invii.",
    "Come LCR, con attesa 2ⁱ per un ID i.",
    [
      "Avvia l’ID con la propria attesa; a ogni inoltro ammissibile attendi 2ⁱ tick.",
      "Applica i confronti di LCR; invii allo stesso vicino nello stesso tick sono accodati esplicitamente.",
      "Ritorno del tuo ID: LEADER; Notify non attende 2ⁱ. La notifica fa annullare le attese residue.",
    ],
  ),
  card(
    "waiting",
    "Waiting",
    "elezione",
    "Waiting: scadenze separate",
    "Eleggere il minimo tramite scadenze abbastanza separate.",
    "Anello orientato.",
    "Sincrono affidabile; clock sincronizzati, n noto, ID interi distinti; α indica l’ID minimo. Variante simultanea o risveglio progressivo.",
    "Stati: SLEEPING, WAITING, LEADER, FOLLOWER. W attiva, Notify ferma i rivali. Variabili: istante di attivazione e scadenza.",
    "La notifica del minimo precede la scadenza di ogni rivale.",
    [
      "Avvio simultaneo: scadenza n·ID dall’avvio.",
      "Risveglio progressivo: inoltra W e imposta scadenza 2n·ID dall’attivazione.",
      "Alla scadenza, se stai ancora aspettando, eleggiti e invia Notify.",
      "Notify ricevuta prima della scadenza: diventa FOLLOWER e inoltra. Il leader ferma la notifica al ritorno.",
    ],
    {
      costs: [
        "Avvio simultaneo: M=n; risveglio progressivo: M=2n, contando W e notifica. Messaggi di un bit, per ogni disposizione di ID nel modello indicato.",
        "T=O((α+1)n), dove α è l’ID minimo. La notifica richiede un giro: il termine +1 copre α=0. Le scadenze dipendono dai valori degli ID; non c’è un worst case in funzione della sola n con ID illimitati.",
      ],
    },
  ),
  card(
    "universal-waiting",
    "Universal Waiting",
    "elezione",
    "Universal Waiting",
    "Estendere Waiting al grafo generico.",
    "Grafo generico.",
    "Sincrono affidabile, n noto, ID interi distinti, clock sincronizzati; α indica l’ID minimo; ogni link impiega al più una unità.",
    "Stati: SLEEPING, WAITING, LEADER, FOLLOWER. start attiva; stop diffonde l’elezione. Variabili: scadenza, stop già inoltrato.",
    "Due flooding: attivazione e stop; n limita entrambe le propagazioni.",
    [
      "Diffondi start. Prima attivazione: inoltra tranne al mittente e attendi 2n·ID.",
      "Scadenza senza stop: LEADER e flooding di stop.",
      "Prima ricezione di stop: FOLLOWER, inoltra tranne al mittente e annulla la scadenza. Ignora le copie.",
    ],
  ),
  card(
    "random-election",
    "Leader election randomizzata",
    "elezione",
    "Leader election randomizzata",
    "Rompere la simmetria in un anello anonimo ed eleggere un solo nodo.",
    "Anello anonimo orientato.",
    "Sincrono affidabile; n noto, n≥2. Tentativi indipendenti; nessun ID unico richiesto.",
    "Stati: WAITING, CANDIDATE, PASSIVE, RESTART, LEADER, FOLLOWER. Probe trasporta il minimo; restart ripete; Notify conclude. Variabili: bit scelto, tentativo e tempo di avvio del probe.",
    "Waiting cerca il minimo; il tempo di ritorno distingue un minimo unico da un pareggio.",
    [
      "Ogni tentativo: scegli 0 con probabilità 1/n, 1 altrimenti. Attendi n·bit; un minimo ricevuto prima rende passivo il nodo.",
      "Alla scadenza, invia Probe. I passivi inoltrano il minimo; un candidato dello stesso minimo consuma il probe.",
      "Ricezione dopo esattamente n tick: minimo unico, leader e Notify. Prima di n: pareggio e restart.",
      "Il simulatore unisce le onde restart dello stesso tentativo e riparte al confine comune 3n; questa coordinazione è esplicitata come scelta della simulazione, non come pseudocodice completo delle slide.",
    ],
    {
      warning:
        "Le slide descrivono rilevazione del pareggio e restart, ma non specificano le regole di unione delle onde e avvio del nuovo tentativo. L’animazione completa Waiting e i tentativi con la coordinazione sincrona dichiarata.",
      properties: [
        "Una singola esecuzione con seme dichiarato; non c’è massimo deterministico di tentativi.",
        "Probabilità di successo p=(1−1/n)ⁿ⁻¹; E[tentativi]=1/p≤e. O(n) tempo e bit attesi, contando ricerca e notifica/restart.",
      ],
    },
  ),
  card(
    "gossiping",
    "Gossiping",
    "routing",
    "Gossiping: ricostruire la mappa",
    "Costruire la mappa del grafo e una tabella di routing in ogni nodo.",
    "Grafo generico pesato stabile.",
    generic +
      " Costi locali non negativi; per la raccolta completa n noto nello scenario. Un iniziatore per SHOUT+; poi tutti diffondono la propria lista.",
    "Stati: SHOUT+, DISSEMINATING, DONE. Q/YES costruiscono l’albero; NeighbourInfo scambia le informazioni locali; List(origin,vicini,costi) diffonde la mappa. Variabili: liste note e tabella destinazione/next hop/costo.",
    "La comunicazione diffonde le liste; solo dopo la mappa completa si calcolano i cammini localmente.",
    [
      "Costruisci lo spanning tree tramite SHOUT+, includendo Q/YES e richieste incrociate.",
      "Ogni nodo, dopo la classificazione locale, scambia NeighbourInfo con tutti i vicini e attende tutte le loro informazioni. Poi invia la propria lista sui vicini dell’albero.",
      "Inoltra ogni lista sull’albero, tranne verso chi l’ha inviata; conserva le liste ricevute. I messaggi arrivati durante il setup sono conservati.",
      "Raccolte tutte le n liste, calcola localmente i cammini minimi e i next hop.",
    ],
  ),
  card(
    "iterating",
    "Iterating / Bellman–Ford distribuito",
    "routing",
    "Iterating / distance-vector",
    "Calcolare distanze e next hop per tutte le destinazioni senza una mappa globale.",
    "Grafo generico pesato.",
    "Round coordinati, link bidirezionali affidabili, n noto e costi non negativi noti agli estremi.",
    "Stati: ACTIVE, DONE. DistanceVector contiene n stime del round precedente. Variabili: vettore locale, next hop, vettori ricevuti.",
    "Partendo dai costi dei vicini, al round k costruisci cammini con al più k+1 archi. La variante del riassunto parte dalla sola diagonale e scopre i vicini nel primo round; converge ugualmente entro n−1 round.",
    [
      "D₀(x,x)=0; D₀(x,y)=c(x,y) per un vicino y; ∞ per le altre destinazioni, come nell’inizializzazione delle slide.",
      "Invia il vettore ai vicini; attendi i vettori del round.",
      "Per ogni z: Dₖ(x,z)=min(Dₖ₋₁(x,z), minᵧ[c(x,y)+Dₖ₋₁(y,z)]). Registra il vicino che migliora la stima.",
      "Dopo n−1 round hai i cammini minimi: con costi non negativi basta un cammino semplice.",
    ],
    {
      costs: [
        "n−1 round coordinati; 2m(n−1) invii di vettori, esatti per il numero di round fissato. Un vettore ha n costi: 2mn(n−1) elementi trasmessi.",
        "Il protocollo non termina prima in un caso favorevole. Memoria: n record propri, O(n·deg(x)) se conserva tutti i vettori dei vicini. I bit dipendono dalla codifica dei costi.",
      ],
    },
  ),
  card(
    "min-hop",
    "Min-Hop routing",
    "routing",
    "Min-Hop: un livello per volta",
    "Costruire un albero dei cammini con il minor numero di archi dalla sorgente.",
    "Grafo generico con archi di costo uguale.",
    generic +
      " Unica sorgente; lo scenario rileva la fine con un livello senza nuove scoperte.",
    "Stati: esterno, IN_TREE, EXPLORING, DONE. start, explore, YES/NO, Report, stop. Variabili: distanza, parent, figli, archi trattati e risposte attese.",
    "La barriera delle risposte rende corretti i livelli anche con ritardi diversi.",
    [
      "Inizio livello i: start sull’albero parziale; i nodi a distanza i−1 esplorano i collegamenti non trattati.",
      "Primo explore a un esterno: parent, distanza i e YES. Un già incluso risponde NO; explore incrociati valgono come risposte implicite.",
      "Attendi tutte le esplorazioni e i Report dei figli del vecchio albero; convergecast del numero di nuove scoperte.",
      "La radice avvia i+1 solo dopo il Report completo. Zero scoperte: stop su tutto l’albero.",
    ],
    {
      costs: [
        "Esplorazioni: 2m invii complessivi (explore/risposta o explore/explore). Start e Report: 2(nᵢ−1) per livello.",
        "M≤2(n−1)D+2m+O(n), includendo eventuale verifica finale e stop; O(n²) su grafo semplice. Nessun best case esatto generale dato nelle fonti.",
        "Tᵢ per livello i≤2i; per r livelli r(r+1), O((r+1)²) con verifica finale. Tempo fisico asincrono senza bound uniforme.",
      ],
    },
  ),
  card(
    "dijkstra",
    "Dijkstra distribuito",
    "routing",
    "Dijkstra distribuito",
    "Costruire l’albero dei cammini di costo minimo da una sorgente.",
    "Grafo generico con pesi strettamente positivi.",
    generic +
      " Pesi locali noti; unica sorgente. Lo scenario rileva la fine da un convergecast senza candidati.",
    "Stati: esterno, IN_TREE, SELECTING, DONE. InTree/Ack aggiornano il confine; start iteration, Offer, Select, Add, end iteration, stop. Variabili: Δ definitiva, parent, figli, archi outgoing e migliore offerta.",
    "L’offerta minima sul confine rende definitiva la distanza del nuovo nodo.",
    [
      "Sorgente: Δ(s)=0; avvisa i vicini e attendi ogni Ack.",
      "start iteration sull’albero; ciascun x offre il minimo Δ(x)+c(x,y) per i propri archi outgoing.",
      "Offer fa convergecast: ogni nodo ricorda il figlio dell’offerta minima. La radice invia Select solo sul percorso vincente.",
      "Il vincitore invia Add al nuovo y con la distanza definitiva; entrambi registrano l’arco nell’albero.",
      "y invia InTree ai vicini tranne il padre, attende gli Ack, poi end iteration lungo il cammino alla radice.",
      "La radice ripete. Un convergecast interamente vuoto certifica la fine; diffonde stop.",
    ],
  ),
  card(
    "two-steps",
    "TwoSteps: guasti dei collegamenti",
    "consenso",
    "Flooding tollerante / TwoSteps",
    "Diffondere I nonostante al più F omissioni di link. È broadcast, non ancora consenso.",
    "Grafo completo Kₙ.",
    "Nessun guasto dei nodi; al più F<n−1 link omettono messaggi. F noto alla sorgente; destinatari distinguibili.",
    "Stati: SLEEPING, DONE. I è l’informazione; memoria: ricezione diretta e inoltro già eseguito.",
    "F+1 vie disgiunte per archi non possono essere interrotte tutte da F guasti.",
    [
      "x invia I a F+1 vicini distinti.",
      "Solo chi riceve direttamente da x inoltra I a tutti gli altri, escluso x.",
      "Le copie da un intermediario fanno apprendere I ma non autorizzano un nuovo inoltro.",
    ],
  ),
  card(
    "tellall",
    "TellAll_Crash",
    "consenso",
    "TellAll_Crash",
    "Consenso booleano fra i nodi che non vanno in crash.",
    "Grafo completo.",
    crashModel,
    "Stati: ACTIVE, CRASHED, DECIDED. Report(r,v). Variabili: bit corrente e report del round.",
    "L’AND propaga lo zero; F+1 round impediscono che resti nascosto a parte dei corretti.",
    [
      "Report iniziale è il tuo bit. Per ciascuno dei F+1 round invialo a tutti gli altri.",
      "Al confine del round aggiorna con AND del tuo e dei report ricevuti. Una ricezione assente vale 1.",
      "Dopo F+1 round decidi il bit corrente. Un crash può interrompere una sequenza di invii.",
    ],
    {
      costs: [
        "M≤n(n−1)(F+1) invii; esatto senza crash per il dato F. T=F+1 round anche nel caso favorevole; nessuna notifica aggiuntiva.",
        "Il bound mantiene F+1 anche per F=0. I crash riducono gli invii effettivi, senza un best case esatto generale.",
      ],
    },
  ),
  card(
    "tellzero-crash",
    "TellAll_Crash: solo zero",
    "consenso",
    "TellAll_Crash",
    "Stesso consenso riducendo gli invii dei valori neutri.",
    "Grafo completo.",
    crashModel,
    "Stati: ACTIVE, CRASHED, DECIDED. Report(0); variabili: zero noto e zero già inviato.",
    "Non serve comunicare un 1: equivale al silenzio entro il round.",
    [
      "Chi conosce 0 all’inizio di un round lo invia a tutti una sola volta.",
      "Chi riceve 0 lo conserva; al round successivo lo diffonde, se non lo ha già fatto.",
      "Dopo F+1 round decidi. Chi non ha mai conosciuto 0 decide 1.",
    ],
    {
      costs: [
        "M≤n(n−1), anche con crash: ogni nodo invia zero una sola volta. Minimo 0 invii se tutti hanno 1; massimo n(n−1) se tutti inviano zero senza crash.",
        "T=F+1 round in entrambi i casi. Il silenzio non elimina l’attesa obbligatoria.",
      ],
    },
  ),
  card(
    "ben-or",
    "Ben-Or con crash",
    "consenso",
    "FLP e Ben-Or con crash",
    "Consenso booleano asincrono usando scelte casuali.",
    "Grafo completo.",
    "Asincrono affidabile, n,F noti, F<n/2 crash. Mittenti distinguibili; broadcast include il proprio messaggio. Round locali numerati.",
    "Stati: PROPOSE, ADAPT, DECIDED / PARTICIPATING, CRASHED. MyValue(r,v), Propose(r,v oppure ?). Variabili: bit, round, quorum, decisione e messaggi futuri.",
    "Maggioranze e quorum proteggono l’accordo; le monete sbloccano i casi indecisi.",
    [
      "Invia MyValue; attendi n−F mittenti distinti del tuo round.",
      "Maggioranza stretta >n/2 di v: invia Propose(v), altrimenti Propose(?).",
      "Attendi n−F Propose: almeno un definito fa adottare v; almeno F+1 definiti v fanno decidere. Tutti ?: bit uniforme.",
      "Scarta round vecchi e conserva i futuri. Incrementa round e invia ancora.",
      "Dopo la decisione continua il ciclo e gli invii, come nello pseudocodice while-true delle slide. La visualizzazione si chiude dopo aver osservato decisioni di tutti e un round ulteriore; i nodi continuano a partecipare.",
    ],
    {
      properties: [
        "FLP esclude consenso deterministico con terminazione garantita in ogni esecuzione asincrona ammessa, anche con un solo possibile crash.",
        "Gli eventuali Propose definiti hanno lo stesso valore: non significa che tutti osservino una maggioranza.",
        "Una decisione fondata su F+1 mittenti interseca ogni quorum n−F e obbliga tutti ad adottare quel valore.",
        "Le slide enunciano anche una variante con circa n/3 crash e round attesi costanti: nessun protocollo operativo disponibile, quindi solo questo richiamo.",
        "O(2ⁿ) è atteso nel ragionamento del corso, senza massimo deterministico di round e senza bound fisico asincrono. Monete indipendenti e consegna eventuale; non esteso a scheduler arbitrari più forti.",
      ],
    },
  ),
  card(
    "registered-mail",
    "RegisteredMail",
    "consenso",
    "RegisteredMail: proposta coerente",
    "Far accettare in modo coerente una proposta (0,y,t).",
    "Grafo completo.",
    byzModel + " Un’origine per identità; tempi sincroni verificati.",
    "Stati: WAITING, ORIGIN, ECHO, ACCEPTED, BYZANTINE. init(0,y,t), echo(0,y,t). Variabili: echo già inviato, mittenti distinti, origini accettate.",
    "Le soglie F+1 e n−F separano la propagazione dall’accettazione.",
    [
      "y invia init(0,y,t) a tutti, incluso se stesso.",
      "init diretto da y ricevuto a t+1: invia echo una sola volta. Scarta origini, tempi e nuove proposte della stessa identità incoerenti.",
      "Da t+2: F+1 echo distinti fanno ritrasmettere echo, se non già inviato.",
      "n−F echo distinti fanno accettare. Una proposta accettata da un corretto viene accettata da tutti entro il round seguente.",
    ],
    {
      warning:
        "Status d’esame da confermare: manteniamo la precisazione del cookbook.",
    },
  ),
  card(
    "tellzero-byz",
    "TellZero_Byz",
    "consenso",
    "TellZero-Byz",
    "Decidere un bit in presenza di bizantini, propagando solo prove per zero.",
    "Grafo completo.",
    byzModel +
      " Avvio simultaneo. Per il costo delle slide, i faulty hanno al più un messaggio per vicino per unità.",
    "Stati: WAITING, ORIGIN, ECHO, ACCEPTED, DECIDED, BYZANTINE. Messaggi di RegisteredMail; variabili: origini accettate e proposta già originata.",
    "La soglia per avviare nuove origini cresce a ogni stage.",
    [
      "t=0: chi ha bit 0 avvia la propria RegisteredMail una sola volta.",
      "t=2i, 1≤i≤F+1: se non hai originato e hai accettato >F+i−1 identità, avvia la tua proposta.",
      "Ogni RegisteredMail esegue tutte le fasi init/echo/soglie, anche mentre proseguono gli stage.",
      "t=2(F+2): decidi 0 con almeno 2F+1 origini accettate; altrimenti 1.",
    ],
    {
      warning:
        "Status d’esame da confermare. Il contatore degli invii usa un echo per proposta e destinatario; la simulazione non impone un unico pacchetto aggregato per link/tick. Il limite del traffico bizantino nel costo O(n³) resta quello delle slide.",
    },
  ),
  card(
    "byz-random",
    "Consenso asincrono con fault bizantini",
    "consenso",
    "Bizantino randomizzato: soglie e prova",
    "Raggiungere consenso fra i nodi corretti nonostante l’equivocazione dei faulty.",
    "Grafo completo.",
    "Asincrono affidabile; ID non falsificabili; F<n/9 nel protocollo del corso.",
    "Propose numerati per round; valori e decisioni locali.",
    "Quorum, soglie di adozione e monete rendono possibile l’accordo.",
    [],
    {
      optional: true,
      overview:
        "Ogni nodo raccoglie proposte da n−F mittenti del round. Un sostegno molto forte consente di decidere, uno più debole fa adottare un valore; altrimenti si lancia una moneta. I bizantini possono inviare valori diversi ai destinatari. La terminazione è quasi certa, senza un massimo deterministico di round. Richiamo facoltativo, senza animazione o approfondimento delle soglie.",
      costs: [],
      properties: [],
    },
  ),
  card(
    "chord-successor",
    "Chord: lookup con successore",
    "chord",
    "Assegnazione e lookup base",
    "Trovare successor(k), il nodo responsabile della chiave k.",
    "Anello logico overlay di una DHT.",
    "ID hash in 0,…,2ᵇ−1, nodi stabili e successori corretti; ogni nodo conosce il suo successore e le chiavi che ospita.",
    "Stati di visualizzazione: STABLE, LOOKUP, LOOKUP_RESULT. lookup(k) e found(owner); variabili: successore, chiavi locali e hop della richiesta.",
    "Inoltra sull’anello fino al responsabile dell’intervallo della chiave.",
    [
      "Se k coincide con il tuo ID o la richiesta arriva a te come responsabile dell’intervallo, restituisci la tua identità: il lookup trova il nodo anche se la chiave non ha un valore memorizzato.",
      "Altrimenti inoltra lookup al tuo successore. Dopo il massimo ID si riprende da zero.",
      "Il nodo trovato restituisce found. Il contatore hop conta solo il percorso della richiesta; gli invii includono anche la risposta.",
    ],
  ),
  card(
    "chord-finger",
    "Chord: lookup con finger table",
    "chord",
    "Finger table: saltare più lontano",
    "Accelerare il lookup senza superare la chiave cercata.",
    "Overlay Chord.",
    "ID ben distribuiti, anello stabile, finger valide e successori corretti. b voci locali; nessuna mappa globale al lookup.",
    "STABLE, LOOKUP, LOOKUP_RESULT sono etichette della visualizzazione. lookup e found; variabili: successore, finger e hop.",
    "Scegli il puntatore che precede k più da vicino.",
    [
      "finger[j]=successor((ID+2^(j−1)) mod 2ᵇ), j=1,…,b.",
      "Controlla prima il nodo e il suo successore: se k è in (ID,succ], il responsabile è succ.",
      "Altrimenti inoltra alla finger più vicina che precede k senza superarla; fallback sul successore.",
      "found restituisce l’identità al richiedente. O(log n) qualifica gli hop medi, non il tempo fisico.",
    ],
  ),
  card(
    "chord-join",
    "Chord: join, stabilizzazione e refresh",
    "chord",
    "Join: assegnare anche i dati",
    "Inserire un nodo, assegnargli le chiavi e mantenere i puntatori.",
    "Overlay Chord.",
    "Un singolo join in anello inizialmente stabile; nessun guasto o partizione. Nuovo nodo conosce un partecipante.",
    "JOINING, JOINED, STABILIZING, REFRESH, STABLE sono etichette illustrative. lookup/found, stabilize/pred, notify e trasferimento keys. Variabili: successore, predecessore, finger, dati.",
    "Il lookup trova il successore; le procedure periodiche riparano il vicinato e le finger.",
    [
      "Il nuovo N37 trova il successore tramite lookup da un partecipante; inizializza il successore e il predecessore ancora sconosciuto.",
      "Il successore trasferisce al nuovo nodo le chiavi del suo intervallo e riceve notify.",
      "stabilize: A chiede al suo successore B il predecessore B′; se B′∈(A,B), sceglie B′. Poi notifica il successore scelto, che aggiorna il predecessore se opportuno.",
      "refresh: ricalcola una finger per volta tramite lookup. Gli esempi mostrano due cicli locali di stabilizzazione e un refresh completo.",
      "Raggiunta una configurazione stabile si chiude la dimostrazione; Chord continua a eseguire manutenzione periodica.",
    ],
    {
      costs: [
        "Le slide danno O(log²n) tempo medio per il join con aggiornamento esplicito delle finger. Questa animazione mostra invece la manutenzione periodica con un refresh completo per un inserimento: i suoi invii non sono il conteggio dell’algoritmo di aggiornamento esplicito.",
        "Il trasferimento dei valori dipende dai dati. Per una chiamata stabilize ci sono scambi locali; nessun bound globale di convergenza per join concorrenti arbitrari è dato nelle fonti.",
      ],
      properties: [
        ...(booklet["Stabilize e refresh"] as Book).blocks
          .filter((b) => b[0] === "p")
          .map((b) => b[2]),
        ...(booklet["Leave, failure e replica"] as Book).blocks
          .filter((b) => b[0] === "p")
          .map((b) => String(b[2]).replace(": vedere coverage.md.", ".")),
      ],
      warning:
        "Leave, failure e replicazione sono conservati qui come richiami: le slide ne descrivono i meccanismi, senza un protocollo completo per guasti, partizioni o join arbitrariamente concorrenti. Nessuna animazione operativa di questi casi viene inventata.",
    },
  ),
];
