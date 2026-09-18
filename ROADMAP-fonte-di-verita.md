# Roadmap — AD_note come fonte di verità

## Obiettivo

Portare `AD_note/Algoritmi Distribuiti.md` a essere la fonte principale di studio per il modulo teorico di Algoritmi Distribuiti, mantenendola:

- coerente con i materiali ufficiali correnti;
- completa rispetto agli argomenti del modulo Montangero;
- tecnicamente corretta;
- autosufficiente anche senza consultare continuamente le slide;
- organizzata in modo da poter assorbire, a blocchi, i contenuti migliori di `algoritmi_distribuiti_notes`.

Il lavoro deve essere incrementale. Prima si verifica ogni possibile errore contro le fonti, poi lo si corregge; solo dopo si uniscono o riscrivono le sezioni.

> Stato di questo documento: roadmap eseguita e registro delle verifiche. Le segnalazioni tecniche sono state confrontate con le fonti ufficiali prima delle correzioni.

## Fonti e perimetro

Il corso nella repo comprende due componenti:

1. **Modulo Montangero, 6 CFU**
   - elementi di teoria della complessità;
   - teoria e algoritmi distribuiti.
2. **Modulo Cabri, 3 CFU**
   - sistemi distribuiti ed esercitazioni/progetto.

Fonti di riferimento, in ordine indicativo di autorità:

1. slide e dispense ufficiali dell'anno accademico corrente in `materials/slides/` e relative estrazioni in `materials/files/pdf_text/`;
2. `materials/files/pdf_text/IntroCorso.md` e `00-CourseIntroductionAD.md` per perimetro e struttura del corso;
3. `scripts/sync/materials_links.json` come inventario dei materiali Moodle;
4. `algoritmi_distribuiti_notes/Gemini scaletta.md` come checklist di studio, non come programma ufficiale;
5. `AD_note/Algoritmi Distribuiti.md` e `algoritmi_distribuiti_notes/docs/` come appunti da consolidare.

### Nota sull'anno accademico

`AD_note/Algoritmi Distribuiti.md` è datato 23/09/2024–20/12/2024. I materiali correnti presenti nella repo sono dell'AA 2025/26. Prima di importare o rimuovere contenuti bisogna quindi distinguere:

- argomenti ancora richiesti;
- argomenti diventati facoltativi;
- argomenti non svolti nell'AA corrente ma utili come prerequisito;
- nuovi argomenti introdotti nel 2025/26.

Esempio: le dispense correnti dichiarano che la 2-approssimazione per TSP metrico non è stata svolta nell'AA 2025/26, ma la sua analisi resta utile per comprendere Christofides.

## Valutazione sintetica delle due dispense

### `AD_note/Algoritmi Distribuiti.md`

- Circa 1.926 righe e 22.000 parole.
- È una trascrizione ragionata delle lezioni più che un riassunto breve.
- Copre quasi tutto il vecchio modulo Montangero: complessità, approssimazione, modello distribuito, broadcast, spanning tree, leader election, sincronismo, routing, guasti/consenso e DHT.
- È attualmente la base migliore per la copertura globale.
- Le parti finali, soprattutto routing, consensus e Chord, contengono formule o descrizioni da verificare con particolare attenzione.
- L'indice iniziale degli algoritmi elenca ora sette algoritmi di complessità, ma non ancora i protocolli distribuiti.
- Non copre in modo sostanziale il modulo Cabri da 3 CFU.

### `algoritmi_distribuiti_notes`

- Circa 15.500 parole nei quattro capitoli pubblicati.
- Capitoli presenti: ripasso, teoria della complessità, fondamenti distribuiti, spanning tree.
- Stile più didattico, espansivo e orientato all'orale.
- Contiene spiegazioni più dettagliate, pseudocodice, controesempi e checklist.
- La copertura è però molto incompleta e sbilanciata sulla teoria della complessità.
- Leader election, routing, fault tolerance, consenso e DHT sono assenti.
- Sono rimasti marcatori di bozza, note editoriali e `TODO`.

### Strategia di consolidamento

- Usare **AD_note come scheletro globale**.
- Importare da `algoritmi_distribuiti_notes` le spiegazioni che risultano più chiare e corrette.
- Non copiare automaticamente: ogni blocco deve essere confrontato con le fonti ufficiali correnti.
- Conservare in AD_note la distinzione tra contenuti d'esame, approfondimenti e materiale storico/facoltativo.

## Matrice di copertura

| Area | AD_note | algoritmi_distribuiti_notes | Azione prevista |
|---|---|---|---|
| Problemi, algoritmi, modello RAM, asintotica | Presente | Presente, RAM quasi assente | Verificare terminologia e consolidare |
| P, NP, NP-hard, NP-completo, riduzioni | Presente | Presente e più esteso | Correggere definizioni e fondere |
| Vertex Cover greedy e LP rounding | Consolidato sulle dispense 2025/26 | Molto approfondito | Completato; escluso dal nucleo il Vertex Cover pesato |
| Self-reduction di Vertex Cover | Presente, marcata facoltativa | Presente | Completato |
| Inapprossimabilità del TSP generale | Presente con prova | Presente con prova | Completato |
| TSP metrico e Christofides | Consolidato; pseudocodice corretto | Presente | Completato per il blocco corrente |
| Branch and Bound per TSP | Presente | Assente | Verificare status d'esame e mantenere |
| Modello distribuito, broadcast, wake-up | Corretto sulle slide | Corretto sulle slide | Completato |
| SHOUT, SHOUT+, DFT, Visited/Ack | Corretto sulle slide | Corretto sulle slide | Completato |
| Iniziatori multipli | Presente | Solo cenno | Conservare AD_note e controllare con slide |
| Computazione su alberi e saturazione | Corretto e completato | Assente | Completato |
| Leader election in alberi e anelli | Verificato sulle slide | Assente | Completato |
| FloodMax su grafi generici | Verificato e mantenuto | Assente | Completato |
| YO-YO | Integrato dalle slide | Assente | Completato |
| Sistemi sincroni e Waiting | Formule corrette | Assente | Completato |
| Routing | Formule corrette | Assente | Completato |
| Guasti e consenso | Corretto; parte deterministica bizantina marcata approfondimento | Assente | Completato |
| DHT e Chord | Corretto e completato con leave/failure/replica | Assente | Completato |
| Modulo Cabri | Assente | Assente | Tenere separato finché non si decide il perimetro |

## Lacune da colmare in AD_note

### Priorità alta

- [x] Protocollo **YO-YO** per leader election su grafi generici:
  - orientamento DAG;
  - setup;
  - fasi YO e -YO;
  - pruning;
  - correttezza e terminazione;
  - complessità/limiti noti.
- [x] Completamento di **Chord**:
  - uscita pulita;
  - fallimento di un nodo;
  - successor list;
  - fallback dei finger;
  - replicazione delle chiavi.
- [x] Allineamento della sezione **Vertex Cover** alle dispense 2025/26:
  - self-reduction integrata e marcata facoltativa;
  - euristiche greedy fallimentari distinte dall'algoritmo basato su maximal matching;
  - Vertex Cover pesato marcato come non materiale d'esame.
- [x] Trattazione esplicita dell'**inapprossimabilità del TSP generale**.

### Priorità media o da chiarire col programma

- Consenso bizantino deterministico, se non più soltanto facoltativo.
- Ricorrenze e Master Theorem, presenti nella scaletta ma non nei capitoli pubblicati.
- Sincronizzazione degli orologi: chiarire se debba stare in AD_note o soltanto nel modulo Cabri.
- Separazione esplicita tra programma corrente e approfondimenti storici/di anni precedenti.

### Modulo Cabri

AD_note non copre:

- architetture distribuite, trasparenza, openness e scalabilità;
- middleware e architetture client-server;
- socket Java/Python, MPI e RPC;
- clock fisici, Cristian/Berkeley, Lamport e vector timestamp;
- Bully/ring election e mutua esclusione;
- NFS, Coda, Plan 9 e xFS;
- oggetti remoti/distribuiti;
- Java RMI, registry, stub, serializzazione, codebase e sicurezza;
- esercitazioni socket/RMI.

Decisione da prendere in seguito: mantenere questo materiale in una dispensa separata oppure estendere AD_note fino a coprire l'intero corso da 9 CFU.

## Registro degli errori candidati — AD_note

Ogni voce parte con stato `DA VERIFICARE`. La correzione deve riportare la fonte ufficiale usata e, quando possibile, un piccolo test matematico o controesempio.

| ID | Sezione/riga indicativa | Segnalazione | Stato |
|---|---|---|---|
| AD-01 | 138 | La categoria “presumibilmente trattabili” dice prima che non esiste un algoritmo polinomiale e poi che non è stato dimostrato. Dovrebbe dire “non è noto”. | CORRETTO |
| AD-02 | 144 | Lo slowdown polinomiale appartiene alla Extended Church–Turing Thesis, non alla formulazione ordinaria. | CORRETTO |
| AD-03 | 156–163 | Il ciclo Hamiltoniano è introdotto sotto “Problemi P”, ma l'esempio riguarda NP/verifica polinomiale. | CORRETTO |
| AD-04 | 199 | Ridurre un NP-completo ad A dimostra NP-hardness; per NP-completezza serve anche A in NP. | CORRETTO |
| AD-05 | 270, 287–288 | Nella riduzione HC→TSP compare `(u,v) in V` invece di `V x V`; si parla di nodi anziché archi; l'assunzione P≠NP non serve a dimostrare NP-hardness. | CORRETTO |
| AD-06 | 333–341 | Nella 2-approssimazione TSP sono invertite le giustificazioni di `cost(T*) <= cost(T)` e `cost(T) <= cost(H*)`. | CORRETTO |
| AD-07 | 378–385 | Christofides richiede un minimum-weight perfect matching e un circuito euleriano; `perfectMatching` e `DFSPreorder` sono insufficienti/imprecisi. | CORRETTO |
| AD-08 | 460–469 | Nel B&B la variabile `LB` sembra usata come costo dell'incumbent, quindi come upper bound globale per un problema di minimo. | CORRETTO |
| AD-09 | 650, 662 | “Nessuna memoria condivisa” e “stesso codice” sono assunzioni del modello del corso, non proprietà universali di ogni sistema distribuito. | CORRETTO |
| AD-10 | 691 | Definizioni di affidabilità parziale e totale da confrontare con le slide. | CORRETTO |
| AD-11 | 750 | La somma dei gradi è `2m`, non “il numero totale di archi”. La formula è corretta, la frase no. | CORRETTO |
| AD-12 | 754, 758 | Il testo oscilla fra bound asincrono `n-1` e `D(G)`; distinguere tempo reale, ideal time e catena causale. | CORRETTO |
| AD-13 | 761–766 | Lower bound `Omega(m)` e simple broadcast sul completo usano assunzioni di conoscenza differenti che non sono esplicitate. | CORRETTO |
| AD-14 | 766 | Sul completo il conteggio esatto di Flooding è `(n-1)^2`, non `n^2`; `Theta(n^2)` resta corretto. | CORRETTO |
| AD-15 | 780 | Wake-up con un iniziatore: `2m-1` dovrebbe essere `2m-n+1`. | CORRETTO |
| AD-16 | 804 | In SHOUT sia YES sia NO sono descritti come non-tree; gli archi YES sono tree-edge. | CORRETTO |
| AD-17 | 861 | La definizione dei figli in DFT tramite assenza di back-edge può includere il parent. | CORRETTO |
| AD-18 | 943, 952 | Saturazione: non è garantito che entrambi i nodi saturati siano interni; inoltre `2n = 2(n-1)` è falso. | CORRETTO |
| AD-19 | 1043–1047 | `n+(n-1)+...+1 = n(n+1)/2`, non `n(n-1)/2`. | CORRETTO |
| AD-20 | 1093, 1109 | Controlled Distance contiene una catena algebrica e indici di sommatoria da ricontrollare. | CORRETTO |
| AD-21 | 1216, 1247–1248 | Waiting: il bound `O(n)` richiede `min` costante; nelle sostituzioni sono confusi `i` e `x`. | CORRETTO |
| AD-22 | 1280, 1283–1289 | Elezione randomizzata: manca il fattore `n` nella probabilità di un unico zero; distinguere dimensione del messaggio e bit-complexity totale. | CORRETTO |
| AD-23 | 1404 | `sum_(i=0)^r 2i = r(r+1)`, non `r(r-1)`. | CORRETTO |
| AD-24 | 1442–1498 | Dijkstra distribuito: uso incoerente di `i/n`, `-2m` al posto di `-2n` e fattori mancanti nei totali. | CORRETTO |
| AD-25 | 1636 circa | FLP non implica l'impossibilità generale del software fault-tolerant, ma del consenso deterministico garantito nel modello asincrono con crash. | CORRETTO |
| AD-26 | 1712 circa | `n(n-1)` è `O(n^2)`, non `O(n)`. | CORRETTO |
| AD-27 | 1809 | `{0,1}` sono valori proposti, non identificativi unici. | CORRETTO |
| AD-28 | 1854 | Una funzione hash mappa chiavi su bucket/indici, non direttamente su valori. | CORRETTO |
| AD-29 | 1895 | Il lookup tramite successori attraversa al massimo i nodi presenti: `O(n)`, non necessariamente `2^m`. | CORRETTO |
| AD-30 | 1896 | Con `m` entry gli offset della finger table arrivano a `2^(m-1)`, non `2^m`. | CORRETTO |
| AD-31 | 1919 | `stabilize` deve essere ricostruito dalle slide/paper: il successore restituisce il proprio predecessore, non necessariamente l'ID del chiamante. | CORRETTO |
| AD-32 | 24–30 | L'indice degli algoritmi omette tutti i protocolli distribuiti. | CORRETTO |

## Registro degli errori candidati — algoritmi_distribuiti_notes

| ID | File/riga indicativa | Segnalazione | Stato |
|---|---|---|---|
| AN-01 | `00-ripasso`, 94–99 | Lo slowdown polinomiale è Extended Church–Turing Thesis. | CORRETTO |
| AN-02 | `00-ripasso`, 63–78 | “Non polinomiale” non significa automaticamente “esponenziale”. | CORRETTO |
| AN-03 | `01`, 49–55 | Dire che TSP di ottimizzazione “non è in NP” è categorialmente impreciso: NP è definita sui problemi decisionali. | CORRETTO |
| AN-04 | `01`, 61–66 | La tabella dichiara non polinomiali gli NP-completi; ciò è ancora ignoto salvo assumere P≠NP. | CORRETTO |
| AN-05 | `01`, 69–75, 177–183, 447–463 | La riduzione di Karp è definita per problemi decisionali e poi usata direttamente con problemi di ottimizzazione; distinguere many-one e riduzioni con oracolo/Turing. | CORRETTO |
| AN-06 | `01`, 328–333 | Per massimizzazione la formula corretta è `A >= OPT/rho`, non `A >= rho*OPT`. | CORRETTO |
| AN-07 | `01`, 903 | “Nessun algoritmo migliore di 2 per Vertex Cover” è troppo assoluto; precisare il risultato effettivamente richiesto dal corso. | CORRETTO |
| AN-08 | `01`, 990–996 | Il criterio euleriano deve includere la connettività dei vertici di grado non nullo. | CORRETTO |
| AN-09 | `04`, 366–381 | Nel caso asincrono la prima ricezione può seguire un cammino fino a `n-1`, non necessariamente la distanza minima `D(G)`. | CORRETTO |
| AN-10 | `04`, 384–401 | La dimostrazione proposta del lower bound `Omega(m)` non esplicita tutte le assunzioni di conoscenza/uniformità. | CORRETTO |
| AN-11 | `04`, 419–421 | Un grafo connesso ha al massimo `n(n-1)/2` archi; l'uguaglianza vale solo per il completo. | CORRETTO |
| AN-12 | `04`, 423–429 | SimpleBroadcast da `n-1` messaggi e tempo 1 deve essere limitato al completo/star con opportuna conoscenza, non al modello generale. | CORRETTO |
| AN-13 | `04`, 512–517 | Il bound Wake-up `Theta(D)` richiede worst case sulla configurazione degli iniziatori. | CORRETTO |
| AN-14 | `05`, 134–157 | Contraddizione nel numero di NO di SHOUT: il valore corretto sembra `2[m-(n-1)]`. | CORRETTO |
| AN-15 | `05`, 234–239 | “Children = vicini non back-edge” comprende anche il parent. | CORRETTO |
| AN-16 | `05`, 265–310 | Un nodo DFT in DONE potrebbe dover ancora rispondere BackEdgeToken; la macchina a stati descritta può bloccarsi. | FALSO POSITIVO |
| AN-17 | `05`, 369–439 | La variante Visited/Ack non ha una specifica completa e si interrompe con un TODO; i bound non sono verificabili dal solo testo. | CORRETTO |

### Log di verifica — primo blocco (17/09/2026)

| ID | Fonti usate | Esito e controllo minimo |
|---|---|---|
| AD-01, AN-02 | `ProblemiEAlgoritmi-handout.md`, righe 262–272 e 321–328 | Confermati. “Non noto polinomiale” non significa “dimostrato non polinomiale”; inoltre superpolinomiale non è sinonimo di esponenziale. |
| AD-02, AN-01 | `ProblemiEAlgoritmi-handout.md`, righe 333–339; terminologia standard della tesi di Church–Turing estesa | Confermati. Le slide chiamano “Church–Turing” una formulazione con slowdown polinomiale; nei testi è ora esplicitato che questa è la variante estesa. |
| AD-03, AN-03, AN-04 | `TeoriaComplessita.md`, righe 48–82 e 335–387 | Confermati. Il ciclo Hamiltoniano è usato come esempio di certificato verificabile; NP è una classe decisionale e non è noto se gli NP-completi siano risolvibili in tempo polinomiale. |
| AD-04, AN-05 | `TeoriaComplessita.md`, righe 193–215 e 335–438; `TeoriaComp_review.md`, righe 144–168 | Confermati. Una riduzione da un NP-completo prova NP-hardness; per NP-completezza serve anche l'appartenenza a NP. Distinte le riduzioni di Karp tra problemi decisionali dalle riduzioni con oracolo verso problemi di ottimizzazione. |
| AD-05 | `TeoriaComplessita.md`, righe 473–550 | Confermato. Per un grafo non diretto completo si costruiscono $n(n-1)/2$ archi in $O(n^2)$; la riduzione HC→TSP prova NP-hardness senza assumere $P\ne NP$. Test: l'ottimo vale 0 se e solo se esiste un ciclo Hamiltoniano composto da archi originari. |
| AD-06 | `DispenseAlgortimiApprox2526.md`, righe 963–979 | Confermato. Per definizione di MST, $cost(T^*)\le cost(T)$; rimuovendo un arco non negativo dal tour ottimo, $cost(T)\le cost(H^*)$. |
| AD-07, AN-08 | `DispenseAlgortimiApprox2526.md`, righe 1016–1104; `algoritmo_christofides.md`, righe 98–112 | Confermati. Christofides richiede un minimum-weight perfect matching, l'unione multinsieme con l'MST e un vero ciclo euleriano. Il criterio euleriano include la connettività dei vertici di grado non nullo. |
| AD-08 | `B_B_TSP.md`, righe 28–42 e 76–89 | Confermato. Nel problema di minimo il costo dell'incumbent è un upper bound globale; un nodo si pota quando il suo lower bound è almeno tale upper bound. |
| AN-06 | Definizione del rapporto di approssimazione; controllo algebrico | Confermato. Per massimizzazione $OPT/A\le\rho$ equivale ad $A\ge OPT/\rho$, non ad $A\ge\rho OPT$. |
| AN-07 | `DispenseAlgortimiApprox2526.md`, righe 738–782; [G. Karakostas, *A better approximation ratio for the Vertex Cover problem*](https://www.cas.mcmaster.ca/~gk/papers/vc.pdf) | Confermato come formulazione troppo assoluta. Il risultato del corso è ora separato dal quadro generale: non è noto un rapporto costante $2-\varepsilon$, mentre sono noti miglioramenti subcostanti dipendenti da $n$. |

### Log di consolidamento — Vertex Cover e TSP (17/09/2026)

| Blocco | Fonte ufficiale | Decisioni e controlli |
|---|---|---|
| Self-reduction di Vertex Cover | `DispenseAlgortimiApprox2526.md`, sez. 1.1 | Integrata in AD_note e marcata **facoltativa**. Esplicitate ricerca binaria, ricostruzione e $O(|V|+\log|V|)$ chiamate all'oracolo. Nel caso `NO` la rimozione di $v$ resta temporanea: sul cammino $v-a-b$, eliminare definitivamente prima $v$ e poi scegliere $b$ potrebbe restituire $\{b\}$, che non copre $(v,a)$. Test esaustivo superato su 124.469 coppie grafo/ordine con $n\leq5$. |
| Greedy Vertex Cover | `DispenseAlgortimiApprox2526.md`, sez. 1.2 | Conservate le due scelte fallimentari e la 2-approssimazione tramite maximal matching. Corretto il riferimento da “nodi disgiunti” ad “archi disgiunti” e aggiunto il `return C` mancante. |
| Relax & Round | `DispenseAlgortimiApprox2526.md`, sez. 2–2.1 | Aggiunto pseudocodice compatto; verificata la catena $Cost(APPROX)\le 2Cost(X^*)\le 2Cost(OPT)$. La variante pesata è esplicitamente esclusa dal materiale d'esame corrente. |
| TSP generale | `DispenseAlgortimiApprox2526.md`, Teorema 11 | Integrata la prova completa di inapprossimabilità. Con $M=\lceil\rho n\rceil+1$, caso sì: $OPT=n$ e $A\le\rho n$; caso no: ogni tour costa almeno $M+n-1>\rho n$. Costruzione verificata esaustivamente su 4.384 coppie grafo/fattore con $3\leq n\leq5$. |
| TSP metrico | `DispenseAlgortimiApprox2526.md`, sez. 3.1 | Separato dal TSP generale. La 2-approssimazione è marcata “non svolta nell'AA 2025/26”, ma la sua analisi è mantenuta come prerequisito di Christofides. |

### Log di verifica — algoritmi distribuiti (18/09/2026)

| ID | Fonti usate | Esito e controllo minimo |
|---|---|---|
| AD-09–AD-15, AN-09–AN-13 | `1-model-broadcast.md` | Confermati. Separati ideal time $D(G)$, tempo fisico asincrono illimitato e causal time fino a $n-1$; esplicitate le ipotesi del lower bound $\Omega(m)$ e del simple broadcast. Conteggi controllati con $2m-(n-1)$ e, sul completo, $(n-1)^2$. |
| AD-16–AD-18, AN-14–AN-17 | `2_SpanningTree.md` | Corretti YES/NO, parent/children, Visited/Ack e saturazione. AN-16 è falso positivo: con un solo token, un nodo entra in `DONE` soltanto dopo che ogni arco incidente è stato classificato, quindi non riceve successivamente un token inatteso. |
| AD-19–AD-22 | `3-LeaderElection.md`, `4-Synchronous.md` | Corrette la somma triangolare, l'algebra di Controlled Distance, gli indici della sommatoria e le formule di Waiting. Nella leader election randomizzata aggiunto il fattore $n$ delle possibili entità che scelgono l'unico zero. |
| AD-23–AD-24 | `5-routing.md` | Corrette le sommatorie Min-Hop e i conteggi di Dijkstra: $2(n-1)^2+4m-2(n-1)$ messaggi e $2n^2-n-1$ causal time incluso setup/termine. |
| AD-25–AD-27 | `6-WithFaults.md` | Limitata correttamente la portata di FLP; corretto $n(n-1)\in O(n^2)$; distinti identificativi e valori booleani. Integrati RegisteredMail e TellZero-Byz come approfondimento, con soglia $F<n/3$. |
| AD-28–AD-31 | `7-DHT.md`; `chord_sigcomm.md` | Corrette funzione hash, lookup lineare sui nodi presenti, offset finali $2^{m-1}$ e `stabilize`. Completati leave pulita, successor list, fallback dei finger e replica delle chiavi. |
| AD-32 | Indice della dispensa e protocolli verificati | Aggiunto l'indice dei 23 protocolli/algoritmi distribuiti principali. |

### Log di consolidamento — lacune ad alta priorità (18/09/2026)

| Blocco | Fonte ufficiale | Decisioni e controlli |
|---|---|---|
| YO-YO | `3-LeaderElection.md` | Integrati setup DAG, YO, -YO, flip, pruning, terminazione, correttezza e upper bound $O(m\log n)$. |
| Consenso bizantino deterministico | `6-WithFaults.md` | Le slide lo trattano per esteso, ma il programma obbligatorio non è esplicitato nei file disponibili: integrato e marcato “approfondimento/status da confermare”. |
| Chord dinamico | `7-DHT.md`; `chord_sigcomm.md` | Separate continuità del routing (successor list e fallback) e durabilità dei valori (replica sui successori). |
| Ricorrenze/Master Theorem | inventario materiali Montangero; due capitoli sorgente ammessi per la fase 4 | Non risultano nei materiali ufficiali disponibili né nei due capitoli sorgente. La sezione è marcata fuori dal nucleo documentato invece di introdurre contenuto non supportato. |

## Incoerenze dirette tra le due dispense

- **Tempo asincrono di Flooding — risolta il 18/09/2026**: entrambe le dispense distinguono ora ideal time $D(G)$ da causal time asincrono, che può arrivare a $n-1$.
- **Wake-up con un solo iniziatore — risolta il 18/09/2026**: entrambe riportano $2m-n+1$.
- **TSP generale — risolta il 17/09/2026**: AD_note e appunti MkDocs presentano ora lo stesso teorema, la riduzione da HC e la separazione dal TSP metrico.
- **Vertex Cover — risolta il 17/09/2026**: AD_note segue ora le dispense 2025/26 per self-reduction, greedy, Relax & Round e status della variante pesata.
- **SHOUT — risolta il 18/09/2026**: gli archi `YES` sono tree-edge e i `NO` sono $2[m-(n-1)]$.

## Roadmap operativa

### Fase 0 — Congelamento e tracciamento

- Non correggere direttamente grandi blocchi senza una verifica puntuale.
- Usare questo documento come issue registry.
- Per ogni voce registrare:
  - fonte ufficiale;
  - risultato della verifica;
  - correzione proposta;
  - test o esempio minimo;
  - commit o patch in cui è stata applicata.

Stati suggeriti:

- `DA VERIFICARE`
- `CONFERMATO`
- `FALSO POSITIVO`
- `CORREZIONE PREPARATA`
- `CORRETTO`

### Fase 1 — Verifica degli errori

Ordine consigliato:

1. formule aritmetiche e probabilistiche;
2. pseudocodice e macchine a stati;
3. definizioni di complessità;
4. bound di messaggi/tempo;
5. consenso e modelli di guasto;
6. Chord e protocolli finali.

Per ogni errore:

1. leggere la pagina/sezione completa degli appunti;
2. confrontare le slide ufficiali corrispondenti;
3. consultare eventuale dispensa primaria collegata dalle slide;
4. costruire un controesempio o rifare il calcolo;
5. aggiornare lo stato nel registro;
6. non modificare ancora altre sezioni non necessarie.

### Fase 2 — Correzione locale delle due dispense

- Applicare patch piccole e tematiche.
- Correggere prima gli errori sostanziali, poi refusi e stile.
- Mantenere allineati i due testi finché entrambi sono usati.
- Aggiungere note “AA 2025/26”, “facoltativo” o “approfondimento” quando necessario.
- Dopo ogni blocco:
  - controllare formule;
  - controllare link alle immagini;
  - verificare la resa Markdown/MkDocs;
  - verificare che indice e titoli siano aggiornati.

### Fase 3 — Consolidamento in AD_note

Usare `AD_note/Algoritmi Distribuiti.md` come documento destinazione.

Ordine di merge suggerito:

1. ripasso e teoria della complessità;
2. Vertex Cover e TSP;
3. modello distribuito e Flooding;
4. spanning tree e saturazione;
5. leader election;
6. sistemi sincroni;
7. routing;
8. guasti e consenso;
9. DHT/Chord;
10. eventuale modulo Cabri.

Per ogni blocco:

- verificare le fonti;
- scegliere una terminologia uniforme;
- importare soltanto il contenuto utile;
- eliminare duplicazioni;
- mantenere esempi e prove che aiutano l'orale;
- aggiungere una checklist finale;
- aggiornare l'indice generale e l'indice degli algoritmi.

### Fase 4 — Uso futuro di `/merge-note`

La skill `/merge-note` non è disponibile nella sessione in cui è stata creata questa roadmap. Quando sarà disponibile, usarla a blocchi piccoli, non sull'intera dispensa in una sola operazione.

Per ogni utilizzo fornire:

- sezione sorgente in `algoritmi_distribuiti_notes`;
- sezione destinazione in AD_note;
- slide/dispense ufficiali di controllo;
- elenco degli errori già confermati;
- indicazione di cosa è materiale d'esame, facoltativo o approfondimento;
- richiesta di preservare immagini, formule e riferimenti utili.

Output atteso da ogni merge:

1. proposta di struttura;
2. tabella delle differenze;
3. testo consolidato;
4. elenco delle decisioni prese;
5. verifica finale contro le fonti.

### Fase 5 — AD_note come fonte di studio

Per dichiarare AD_note “quasi unica fonte di verità” devono essere soddisfatte almeno queste condizioni:

- tutti gli argomenti del modulo Montangero corrente sono coperti;
- ogni algoritmo contiene assunzioni, obiettivo, pseudocodice, correttezza e complessità;
- gli errori confermati in questa roadmap sono corretti;
- approfondimenti e contenuti non d'esame sono marcati;
- l'indice degli algoritmi è completo;
- le immagini sono tutte disponibili e comprensibili;
- le sezioni non dipendono da informazioni presenti soltanto nelle slide;
- esiste una checklist finale per l'orale;
- una revisione conclusiva confronta il documento con l'inventario Moodle corrente.

## Priorità immediata consigliata

Primo blocco di lavoro:

1. verificare AD-01–AD-08 e AN-01–AN-08;
2. correggere teoria della complessità, TSP e Vertex Cover in entrambe le dispense;
3. consolidare quel blocco in AD_note;
4. passare a Flooding/SHOUT/DFT;
5. affrontare in seguito routing, consensus e Chord, dove il rischio di errori è maggiore.

Questa sequenza permette di ottenere rapidamente una prima porzione affidabile e già utilizzabile per lo studio, senza propagare errori nelle fusioni successive.
