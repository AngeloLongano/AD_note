export interface CostSummary {
  messages: string;
  time: string;
  note?: string;
}

// Sintesi dei conteggi già verificati nelle schede; non introduce nuovi bound.
export const costSummary: Record<string, CostSummary> = {
  flooding: {
    messages: "2m−n+1; albero: n−1; completo: (n−1)²",
    time: "Ideale: r(s), fino all’ultima prima ricezione",
    note: "Le copie residue possono restare in viaggio.",
  },
  "simple-broadcast": {
    messages: "n−1",
    time: "Ideale: 1, per n≥2; 0 per n=1",
  },
  wflood: {
    messages: "2m−n+k",
    time: "Ideale: maxᵥ minₛ∈S d(s,v) ≤ D",
    note: "S è l’insieme degli iniziatori simultanei; k conta i risvegli spontanei effettivi.",
  },
  shout: { messages: "4m−2n+2", time: "Ideale: fra r(s)+1 e r(s)+2, per n≥2" },
  "shout-plus": { messages: "2m", time: "Ideale: r(s)+1, per n≥2; 0 per n=1" },
  dft: { messages: "2m", time: "Ideale e causale: 2m" },
  "dft-ack": {
    messages: "≤4m",
    time: "Ideale: ≤4n−2",
    note: "Upper bound; il migliore esatto non è specificato.",
  },
  saturation: {
    messages: "≤4n−4, inclusa attivazione",
    time: "Bound numerico non riportato nel cookbook",
    note: "Per n=1 nessun invio; tempo fisico asincrono senza bound uniforme.",
  },
  "tree-election": {
    messages: "≤4n−4, inclusa attivazione",
    time: "Bound numerico non riportato nel cookbook",
    note: "O(n+log MaxID) bit riguarda la variante ottimizzata, non l’animazione.",
  },
  "all-the-way": {
    messages: "n²",
    time: "Ideale: n simultaneo; ≤2n−1 progressivo",
  },
  lcr: {
    messages: "Best: 2n; worst: n(n+1)/2+n",
    time: "Ideale: ≤3n−1 con risveglio progressivo e notifica",
    note: "Il best ha soltanto il minimo come iniziatore.",
  },
  "controlled-distance": {
    messages: "O(n log n)",
    time: "Ideale: O(n), con avvii simultanei e senza code",
  },
  floodmax: {
    messages: "2mL",
    time: "L round",
    note: "L è il limite noto sul diametro; nessun arresto anticipato.",
  },
  yoyo: {
    messages: "Facoltativo: non approfondita",
    time: "Facoltativo: non approfondita",
  },
  speeding: {
    messages: "O(n) invii logici",
    time: "O(2ᵅn) unità sincrone",
    note: "α è l’ID minimo; i pacchetti dipendono dalla frammentazione.",
  },
  waiting: {
    messages: "n simultaneo; 2n progressivo",
    time: "O((α+1)n) unità sincrone",
    note: "α è l’ID minimo; include il giro di notifica.",
  },
  "universal-waiting": {
    messages: "O(m), con due flooding",
    time: "O((α+1)n) nel modello dichiarato",
    note: "α è l’ID minimo.",
  },
  "random-election": {
    messages: "O(n) bit e invii di un bit attesi",
    time: "O(n) atteso; nessun massimo deterministico",
    note: "Per tentativo: O(n); restart coordinato come dichiarato nella scheda.",
  },
  gossiping: {
    messages: "O(m+n²) invii di liste; O(mn) elementi",
    time: "Bound numerico non riportato nel cookbook",
    note: "Setup SHOUT+ e scambio vicini; n liste su n−1 archi ciascuna. Calcolo locale separato.",
  },
  iterating: {
    messages: "2m(n−1) vettori; 2mn(n−1) elementi",
    time: "n−1 round coordinati",
  },
  "min-hop": {
    messages: "≤2(n−1)D+2m+O(n); O(n²) su grafo semplice",
    time: "Ideale: O((r+1)²)",
    note: "r è il numero di livelli; inclusi verifica finale e stop.",
  },
  dijkstra: {
    messages: "O(n²+m) per sorgente; O(n³) per n sorgenti su grafo semplice",
    time: "Ideale: O(n²) per sorgente",
  },
  "two-steps": {
    messages: "≤(F+1)(n−1)",
    time: "Ideale: ≤2",
    note: "F conta qui i guasti dei collegamenti.",
  },
  tellall: {
    messages: "≤n(n−1)(F+1)",
    time: "F+1 round",
    note: "Conteggio esatto senza crash, a F fissato.",
  },
  "tellzero-crash": {
    messages: "Da 0 a n(n−1)",
    time: "F+1 round, anche con zero invii",
  },
  "ben-or": {
    messages: "O(n²) per round logico",
    time: "O(2ⁿ) round attesi nel ragionamento del corso",
    note: "Nessun massimo deterministico né bound fisico; i nodi continuano a partecipare dopo la decisione.",
  },
  "registered-mail": {
    messages: "O(n²) invii dei corretti per proposta",
    time: "2 unità per accettare un’origine corretta",
    note: "Traffico faulty da limitare separatamente; status d’esame da confermare.",
  },
  "tellzero-byz": {
    messages: "O(n³)",
    time: "2(F+2) unità sincrone",
    note: "Con limiti al traffico faulty delle slide; status d’esame da confermare.",
  },
  "byz-random": {
    messages: "Facoltativo: non approfondita",
    time: "Facoltativo: non approfondita",
  },
  "chord-successor": {
    messages: "O(n) hop dell’overlay",
    time: "O(n) hop sequenziali",
    note: "Hop, non secondi: il tempo fisico dipende dai ritardi.",
  },
  "chord-finger": {
    messages: "O(log n) hop medi dell’overlay",
    time: "O(log n) hop sequenziali medi",
    note: "Con le ipotesi di distribuzione degli ID di Chord; b record per nodo.",
  },
  "chord-join": {
    messages: "Dipende da manutenzione e trasferimento dei dati",
    time: "Join esplicito: O(log²n) medio",
    note: "Il bound è del join con aggiornamento esplicito delle finger; la manutenzione animata è periodica. Nessun bound generale per join concorrenti.",
  },
};
