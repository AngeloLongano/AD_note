# Cookbook web — copertura e verifica corrente

Data: 3 ottobre 2026. Registro nuovo; la roadmap archiviata non viene riaperta.

## Perimetro e stato

Pagina autonoma `src/pages/cookbook.astro`, navigazione principale, 32 schede: 30 simulazioni e due richiami facoltativi. Il riassunto canonico e il corpus della docente non sono modificati. Fonte editoriale: cookbook PDF, `coverage.md`, `MANUTENZIONE.md` e composizione finale di `source/generate.py`; modelli/regole verificati nelle sezioni omonime del canonico e nelle pagine sotto.

L’utente ha escluso dall’approfondimento YO-YO e il consenso asincrono con guasti bizantini: restano spiegazioni ad alto livello, marcate facoltative, senza simulazioni. Il consenso deterministico bizantino conserva lo **status d’esame da confermare**.

## Copertura delle 23 famiglie

D = `teacher_slides/2_distributed algorithms.pdf`, pagine fisiche da 1; verifiche su `knowledge_parsed/2_distributed algorithms/pages/page-NNN.md`, testo continuo e immagini pertinenti. Le fonti locali non sono pubblicate.

| # | Famiglia / varianti | Fonti | Validazione principale |
|---|---|---|---|
| 1 | Flooding, broadcast diretto su completo noto | D 37–63, 46, 53 | Copertura, copie scartate, 2m−n+1; diretto n−1 |
| 2 | WFlood, uno/più/tutti iniziatori | D 64–68 | Attivazione, k effettivo, 2m−n+k |
| 3 | SHOUT, SHOUT+ separate | D 74–84; roadmap M09/B10 | Albero coerente/aciclico, 4m−2n+2 e 2m; FIFO per NO |
| 4 | DFT, DFT Visited/Ack separate | D 94, 100–104; M09/B10 | Token unico, handshake paralleli, ritorno finale, 2m e ≤4m |
| 5 | Saturazione minimo, elezione coppia separate; radicato come richiamo | D 121–138; C04/B11 | Risultato, coppia dipendente dai ritardi, n=1, ≤4n−4 |
| 6 | All The Way | D 145–154 | n² invii, token concorrenti anche dallo stesso nodo, n e 2n−1 tempo ideale |
| 7 | As Far As It Can / LCR | D 155–168 | Attivazione su ID, minimo unico, notifica, worst/best n5: 20/10 |
| 8 | Controlled Distance / HS | D 170–172, 190–195 | Forth/Back, stage, relay DEFEATED passivi, notifica, nessuna rielezione |
| 9 | FloodMax | D 198–203 | Invariante palla r-hop, L=n−1 noto, 2mL e L round, singleton |
| 10 | YO-YO | D 204–258; cookbook p9 | Solo richiamo facoltativo, su richiesta |
| 11 | Speeding | D 269–278 | Attese/queue, unicità, annullamento dopo Notify, costi logici/bit distinti |
| 12 | Waiting simultaneo/progressivo; Universal Waiting separato | D 280–288 | Deadline, n/2n invii su anello, flooding start/stop, ID zero |
| 13 | Elezione randomizzata | D 290–296 | Minimo unico/pareggio, ritorno in n o meno tick, restart, semi riproducibili |
| 14 | Gossiping | D 306–307 | SHOUT+ + scambio NeighbourInfo + tutte le liste; routing locale corretto |
| 15 | Iterating / Bellman–Ford | D 310–314 | Vettori, distanze/next hop, 2m(n−1) invii e 2mn(n−1) elementi |
| 16 | Min-Hop | D 324–334 | Barriere, BFS, esplorazioni 2m, verifica stagnazione e stop |
| 17 | Dijkstra distribuito | D 339–350 | Confine locale, offerte/convergecast, Select/Add, InTree/Ack, end, stop |
| 18 | TwoSteps | D 381–382 | Tutte le omissioni ammesse su K3–K5, invii persi contati, copertura |
| 19 | TellAll_Crash e solo zero separate | D 387–411, 409 | Crash durante broadcast, AND, agreement/validità, F+1 round |
| 20 | Ben-Or crash | D 414–425; cookbook p14; Santoro §7.4.2 (PDF459–462), roadmap B16 | Quorum distinti nell’ordine d’arrivo, buffer futuri, safety, decisione e partecipazione continua |
| 21 | RegisteredMail, TellZero_Byz separate | D 438–445, 451–463 | Identità/tempo/soglie, duplicati, stage ai confini, decisione a 2(F+2) |
| 22 | Consenso asincrono bizantino | D 465–474; cookbook p14 | Solo richiamo facoltativo, su richiesta |
| 23 | Chord lookup successore/finger/join+stabilizzazione separate; leave/failure/replica conservati | D 499–510, 511; roadmap C08/B17 | Tutte le chiavi/origini, wrap, finger obsolete, singleton, join/dati/puntatori |

I sei blocchi statici della teoria coincidono con la pagina 1 del PDF: problema/costo, asintotica, P/NP/certificati, crescita, riduzioni/NP-completezza/hardness e approssimazione. Le sei formule sono renderizzate con KaTeX già usato dal sito. Gli algoritmi sequenziali delle altre pagine restano fuori dal progetto attuale. `booklet.json` e `complexity.json` sono snapshot dei contenuti della composizione finale del generatore PDF, senza percorsi del corpus; `content.ts` adatta le sole schede distribuite allo schema richiesto.

## Architettura e misura

- `engine.ts`: eventi discreti di invio, consegna, aggiornamento, scarto e perdita. Invii con stesso istante sono concorrenti; nessun limite implicito di un messaggio per nodo. Contatori derivati dagli eventi. Copie a se stessi non contano come invii di link.
- `diffusion.ts`, `election.ts`, `routing.ts`, `consensus.ts`, `chord.ts`: regole e memoria locali. L’accesso globale è limitato a fixture iniziali, scheduler e osservatore della visualizzazione; non fornisce risultati ai nodi.
- `scenarios.ts`: fixture piccole e selezioni predefinite; ritardi e monete dichiarati. Min-Hop usa pesi uniformi.
- `player.ts` e componenti Astro/SVG: stessa traccia per playback e passo manuale; reset riproducibile. Import dinamico delle regole all’apertura, stato indipendente, pausa per schede chiuse/offscreen e documento nascosto, controlli accessibili e movimento ridotto.
- `cookbook.pdf.ts`: endpoint statico che legge l’originale durante la build. Non serve una copia manuale; PDF conservato nel percorso originale. Link e asset rispettano BASE_URL.

I tempi unitari nei protocolli asincroni sono scelte illustrative, non clock del protocollo e non bound del tempo fisico. La profondità causale conta trasmissioni dipendenti; i messaggi accodati non diventano implicitamente round. Lo svuotamento dei canali può seguire l’ultima prima ricezione di Flooding.

## Test riproducibili

`npm run test:cookbook` compila temporaneamente i test con esbuild e li esegue senza lasciare output nella repository.

- `cookbook-diffusion.ts`: 4112 verifiche, tutti grafi connessi n≤4, iniziatori, ritardi FIFO/nonFIFO ove ammessi, alberi, omissioni e singleton.
- `cookbook-election.ts`: 24 scenari pubblicati più 35 esecuzioni HS/random, singleton, ID zero, conteggi e parallelismo All The Way, invarianti FloodMax.
- `cookbook-routing.ts`: 208 esecuzioni complete; oracolo indipendente Floyd–Warshall, next hop e alberi senza cicli, pesi zero dove ammessi, conteggi di ogni fase.
- `cookbook-consensus.ts`: 2527 verifiche, agreement/validità, crash, quorum, attacchi mirati, tempi e stage. Audit aggiuntivo Ben-Or: 1000 scheduler casuali con ritardi 1–30.
- `cookbook-chord.ts`: 1040 esecuzioni complete, 64 chiavi da ogni origine, join e refresh, finger obsolete, singleton; verifica esaustiva degli intervalli circolari.
- `cookbook-integration.ts`: tutte le 32 schede e gli 81 scenari, eventi/contatori, isolamento, reset deterministico e copertura. Regressioni della catena causale attraverso barriere di round (FloodMax L=4) e attivazione progressiva (All The Way n=5).
- `cookbook-browser.js`: harness Playwright CLI per famiglie (`?verify=elezione`, ecc.; `&base=/AD_note` per preview Pages), controlla passi/avvio/pausa/ripresa/chiusura/reset e completa ogni scenario attraverso gli stessi pulsanti.

## Limiti espliciti e discrepanze da tenere separate

1. **Ben-Or:** l’arresto semplice un round dopo la decisione può lasciare altri nodi in attesa del quorum (regressione n5/F1, bit 00111, scheduler seme3). Le slide414/415 implementano `while true` e dicono che può essere modificato per uscire un round dopo, senza sviluppare la modifica. Qui si anima il ciclo continuo ufficiale e si ferma soltanto l’osservazione dopo decisione e round aggiuntivo di tutti; restano messaggi in viaggio. Non si inventa un protocollo di arresto. Il canonico conserva una precisazione sulla partecipazione successiva, ma l’eventuale arresto richiede verifica distinta.
2. **Ben-Or, prova:** una singola maggioranza osservata non assicura che ogni quorum la osservi o contenga un Propose definito. Conservata la correzione del cookbook rispetto alla formulazione ancora presente nel canonico; non si modifica il canonico in questo intervento.
3. **Iterating:** l’animazione parte dai costi dei vicini, come slide310; il canonico/cookbook usano la variante equivalente D₀ solo diagonale. Entrambe convergono entro n−1 round; l’invariante dell’animazione è ≤k+1 archi dopo round k. La distinzione è esplicitata nella scheda.
4. **Elezione coppia:** messaggi Saturation portano l’ID locale per il confronto finale. Il numero di invii segue la saturazione, ma l’ottimizzazione in bit con soli due ID della slide138 non è implementata. È dichiarato nella scheda e nel player.
5. **Random election:** le slide291–292 descrivono ritorno del probe e restart ma non un protocollo completo di unione delle onde/avvio successivo. L’esempio aggiunge esplicitamente unione per tentativo e confine sincrono comune 3n. Non presenta questa convenzione come pseudocodice ufficiale.
6. **RegisteredMail/TellZero_Byz:** esempi di avversario selettivo/omissivo e attacchi mirati, non enumerazione di tutti i comportamenti bizantini. Il costo O(n³) delle slide limita a parte il traffico faulty; gli echo dell’animazione contano singole proposte per destinatario, senza imporre un pacchetto aggregato per link/tick.
7. **Chord:** singolo inserimento in anello stabile, due cicli locali illustrativi e un refresh completo. Il costo medio del join esplicito non è il conteggio di questa manutenzione periodica. Leave/failure/replica restano richiami alle procedure disponibili; nessuna animazione completa di recovery arbitrario, partizioni o join simultanei, non specificati dalle fonti.
8. Le varianti crash e bizantine soltanto enunciate nelle slide431/474 restano richiami, senza regole inventate. La variante bizantina asincrona è inoltre esclusa su richiesta dell’utente.

## Controlli di consegna

- Test dei protocolli e integrazione: superati.
- `just check`: 0 errori, 0 warning, 0 hint. `just build` e `just pages`: superati.
- Browser sulla build finale `/AD_note`: completati tutti gli 81 scenari delle cinque famiglie, con passo manuale, avvio/pausa/ripresa, chiusura e reset; nessun errore di esecuzione.
- Desktop 1440×1000 e telefono 390×844: navigazione, hash che apre la scheda, caricamento differito, tastiera, movimento ridotto, pausa fuori schermo, sei formule e PDF verificati. Grafico mobile interamente visibile senza scorrimento orizzontale. Screenshot controllati in `output/playwright/cookbook/`.
- PDF generato per il sito identico byte per byte all’originale. Nessun file del corpus della docente incluso fra gli asset pubblici.
- Audit rimanenti svolti da tre subagent, con responsabilità separate per famiglia; integrazione e verifiche finali nel root. Le analisi completate non sono state ripetute.
- Le modifiche preesistenti dell’utente sono conservate. Nel Markdown canonico era già presente uno spazio finale segnalato dal controllo del diff; non è stato modificato.
- Nessun deploy effettuato.
