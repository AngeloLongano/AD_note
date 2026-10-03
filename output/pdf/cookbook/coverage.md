# Cookbook di Algoritmi Distribuiti — copertura e fonti

Prima versione completa, 30 settembre 2026. **16 pagine A4 orizzontali**, dopo l'autorizzazione a superare le dieci pagine. Tutte le **7 voci sequenziali e 23 distribuite** della checklist «Algoritmi e protocolli» del documento canonico sono presenti. I numeri nelle due tabelle seguono quella checklist; i link aprono gli SVG modificabili.

## Fonti e convenzioni

Le pagine citate sono le **pagine fisiche del PDF, numerate da 1**.

- **I**: `teacher_slides/0_intro_algorithm.pdf`.
- **C**: `teacher_slides/1_complexity theory.pdf`.
- **D**: `teacher_slides/2_distributed algorithms.pdf`.
- **A**: `Algoritmi Distribuiti.md`, sezioni omonime agli algoritmi e relativi block ID `algorithm-1`–`algorithm-7`.
- **Mxx/Cxx** nei piè di pagina: verifiche in `archived/ROADMAP.md`; **Bxx**: blocchi di `archived/REVISIONE-SEMANTICA-ESITO.md`. Sono riferimenti storici, non attività riaperte.
- **Originale**: `Algoritmi_Distribuiti_originale.pdf`; testo, figure e annotazioni consultati anche attraverso il bundle omonimo. Per il distribuito: pp. 37–98; controlli visivi mirati su pp. 38, 42, 47, 50, 55, 60, 64, 67, 71, 76, 85, 89–90, 92, 94, 96–98; annotazioni pertinenti lette direttamente dal PDF.
- **Santoro**: `teacher_slides/based_by/DESIGN AND ANALYSIS.pdf`, §7.4.2, pp. PDF 459–462 (stampate 445–448), per chiarire la prova probabilistica e la partecipazione dopo la decisione. Le soglie operative restano quelle delle slide del corso.

La legenda cromatica è a p. 1: blu specifiche/ipotesi, arancio passi, verde prove, viola costi, rosso limiti/status. `M` conta invii salvo indicazione diversa; `Tᵢ` è tempo ideale; bit, elementi di vettore, hop overlay e round sono distinti. I simboli ulteriori sono definiti localmente. Le formulazioni sono sintesi per il ripasso, non citazioni letterali.

## Fondamenti

| Contenuto | Pagina | Fonte principale |
| --- | --- | --- |
| Problema/istanza, decisione/ricerca/ottimizzazione, dimensione, costo, asintotica | [1](pagina-01.svg) | I pp. 2–20; A §1 |
| P/NP, certificati, riduzioni Karp/Turing, NP-completo/NP-hard | [1](pagina-01.svg) | C pp. 2–23, in particolare 8, 11, 17–21; A §2.1 |
| Approssimazione, garanzie di minimo/massimo, lower bound | [1](pagina-01.svg) | C p. 23; A §2.2; revisione B03 |
| TSP generale: NP-hardness e inapprossimabilità; TSP metrico | [2](pagina-02.svg), [3](pagina-03.svg) | C pp. 24–26, 68–74; M04–M05, B04–B05 |
| Vertex Cover decisionale e ottimizzazione | [4](pagina-04.svg) | C pp. 55–60; A «Vertex Cover»; B07 |

## Algoritmi sequenziali

| # | Voce e varianti incluse | Pagina | Fonte principale |
| --- | --- | --- | --- |
| 1 | Risoluzione Ciclo Hamiltoniano con TSP, costi 0/1; soglia per inapprossimabilità; richiamo metrico con costi 1 e 2 | [2](pagina-02.svg), [3](pagina-03.svg) | C pp. 24–26, 68–74; A `algorithm-1`, «TSP metrico» |
| 2 | 2-approssimazione di TSP: MST, raddoppio, Euler, shortcut | [3](pagina-03.svg) | C pp. 70–72; A `algorithm-2` |
| 3 | Christofides: matching perfetto minimo, parità, prova 3/2 | [3](pagina-03.svg) | C pp. 72–74; A `algorithm-3` |
| 4 | B&B ricorsivo generico; applicazione TSP con 1-tree, branching e arresto anticipato | [2](pagina-02.svg) | C pp. 97–104; A `algorithm-4`; C02, B06 |
| 5 | Self-reduction del Vertex Cover, ricerca del budget e ricostruzione | [4](pagina-04.svg) | C pp. 56–57; A `algorithm-5`; B07 |
| 6 | Greedy VC: vertice arbitrario, grado massimo, estremi di un arco | [4](pagina-04.svg) | C pp. 58–60; A `algorithm-6` |
| 7 | Relax & Round VC; richiamo all'estensione pesata | [4](pagina-04.svg) | C pp. 63, 65–67; A `algorithm-7` |

## Protocolli distribuiti

| # | Voce e varianti incluse | Pagina | Fonte principale |
| --- | --- | --- | --- |
| 1 | Flooding/Broadcast; completo noto, albero e lower bound generico | [5](pagina-05.svg) | D pp. 37–63, conteggio p. 53; A «Broadcast» |
| 2 | WFlood/Wake-up, k iniziatori | [5](pagina-05.svg) | D pp. 64–68, conteggio pp. 66–67 |
| 3 | SHOUT e SHOUT+; classificazione locale, FIFO e fine globale | [6](pagina-06.svg) | D pp. 71–84; A «Protocollo Shout»; M09, B10 |
| 4 | DFT semplice e variante Visited/Ack; limite del caso multi-iniziatore | [6](pagina-06.svg) | D pp. 85–104, 109; B10 |
| 5 | Saturazione; raccolta radicata/non radicata, elezione della coppia finale | [7](pagina-07.svg) | D pp. 110–138, in particolare 125, 130, 138; B11 |
| 6 | All The Way; contatore hop e alternative per riconoscere la fine | [7](pagina-07.svg) | D pp. 145–154, in particolare 151, 153; B12 |
| 7 | As Far As It Can/LCR; risveglio spontaneo/su messaggio, best/worst case | [8](pagina-08.svg) | D pp. 155–168; B12 |
| 8 | Controlled Distance/Hirschberg–Sinclair; Forth/Back, raddoppio, spaziatura | [8](pagina-08.svg) | D pp. 169–195, in particolare 170, 190, 193 |
| 9 | FloodMax, diametro o upper bound noto | [9](pagina-09.svg) | D pp. 198–203 |
| 10 | YO-YO: setup, YO, −YO, flip, pruning e notifica | [9](pagina-09.svg) | D pp. 204–258; pruning 239–249, analisi 250–258 |
| 11 | Speeding; messaggi logici, bit e pacchetti | [10](pagina-10.svg) | D pp. 267, 269–278; B13 |
| 12 | Waiting: avvio simultaneo/progressivo; Universal Waiting su grafo | [10](pagina-10.svg) | D pp. 279–288; A sezioni omonime; B13 |
| 13 | Leader election randomizzata; pareggi, restart, costo atteso | [10](pagina-10.svg) | D pp. 289–296 |
| 14 | Gossiping: mappa globale e tabelle locali | [11](pagina-11.svg) | D pp. 299–307, memoria 304, costo 307; B14 |
| 15 | Iterating/distance-vector/Bellman–Ford distribuito | [11](pagina-11.svg) | D pp. 309–315; A «Iterating»; B14 |
| 16 | Min-Hop routing, barriere fra livelli e rilevazione della fine | [12](pagina-12.svg) | D pp. 321–335, invariante 323, costi 333; B14 |
| 17 | Dijkstra distribuito; una sorgente e ripetizione per tutte | [12](pagina-12.svg) | D pp. 338–351, passi 341, costi 349–351 |
| 18 | Flooding tollerante a link failure: TwoSteps su completo, grafo residuo | [13](pagina-13.svg) | D pp. 377–382; A §5.1; B15 |
| 19 | Consensus sincrono con crash: TellAll_Crash e variante «solo zero» | [13](pagina-13.svg) | D pp. 387–411, prova 405, variante 409; B16 |
| 20 | Ben-Or randomizzato; FLP e variante solo enunciata nelle slide | [14](pagina-14.svg) | D pp. 385, 412–431; Santoro §7.4.2; B16 |
| 21 | RegisteredMail e TellZero-Byz; propagazione e soglie per stage | [15](pagina-15.svg) | D pp. 432–464, regole 438–451, costi 463; B16 |
| 22 | Consensus randomizzato bizantino F<n/9; variante solo enunciata F<n/500 | [14](pagina-14.svg) | D pp. 465–474, protocollo 467, prove 469–473 |
| 23 | Chord: lookup base/finger, join, stabilize, refresh, leave, failure, replica | [16](pagina-16.svg) | D pp. 494–511, lookup 501–504, join 506–507, guasti 511; B17 |

Le impossibilità di elezione anonima e dei due generali compaiono rispettivamente a pp. 7 e 13 (D pp. 136–137 e 371–376). FLP e la soglia bizantina senza firme sono enunciati con le ipotesi: le fonti non vi sviluppano una prova completa da riprodurre.

## Status e precisazioni verificate

- **Facoltativi:** 2-approssimazione TSP (C p. 70: non svolta AA 25/26), B&B/1-tree (indicazione utente registrata nel canonico), self-reduction VC (C p. 56). **VC pesato non d'esame AA 25/26** (C p. 63). Nessuna estensione automatica di queste indicazioni ad altri anni.
- Correzioni conservate: verso HC→TSP; matching di peso minimo in Christofides; LP con soglia 1/2; `|OPT|≥|E′|`; self-reduction che modifica grafo e budget solo sul ramo sì; pruning B&B `LB≥UB`; bound di guasto stretti; termini `F+1` che coprono F=0.
- Costi ricontati: Flooding `2m−n+1`, WFlood `2m−n+k`, saturazione `4n−4`, notifica in LCR/HS; Iterating distingue vettori ed elementi; Min-Hop e Dijkstra distinguono iterazioni, invii e tempo ideale. I costi dipendenti da un'implementazione o derivati (Prim, Universal Waiting) sono dichiarati come tali.
- Ben-Or: l'unicità del valore proposto non implica che ogni quorum lo contenga. L'adozione comune dopo una **decisione** usa invece l'intersezione fra F+1 e n−F mittenti. Sono necessari gli invii successivi alla decisione. Per il bizantino randomizzato, la validità sottrae sia i mittenti mancanti sia quelli faulty. Queste precisazioni sono circoscritte al cookbook: le fonti non sono state modificate.

## Incertezze residue e limiti del corpus

1. **Status d'esame del consenso bizantino deterministico da confermare**: D pp. 432–464, Originale p. 90, revisione B16. Il cookbook include entrambi i protocolli con etichetta esplicita.
2. **Guasti di aggiunta/corruzione dei link:** D pp. 378–379 non specificano un protocollo generale che giustifichi l'estensione delle garanzie di flooding. Si mantiene la garanzia per omissioni, come B15.
3. **Chord:** join arbitrariamente concorrenti e partizioni non hanno una garanzia generale dimostrata nel corpus (D pp. 507–511; B17). Nessun bound globale di convergenza è inventato.
4. **Consenso randomizzato:** `O(2ⁿ)` è il bound atteso in round logici del ragionamento del corso, con monete indipendenti e consegna affidabile eventuale. Le slide non formalizzano una garanzia uniforme su scheduler/adversari arbitrari: non lo si estende a tempo fisico o a modelli più forti. Le varianti citate a D pp. 431 e 474 restano enunciati, senza protocollo inventato né attribuzione di status d'esame.

## File e controllo finale

- `cookbook-algoritmi-distribuiti.pdf`: documento unico; stampa A4 orizzontale al **100%**, una pagina per foglio.
- `pagina-01.svg`–`pagina-16.svg`: testo nativo modificabile e diagrammi vettoriali; font DejaVu incorporato. `svg-modificabili.zip` raccoglie le pagine, i font installabili in `fonts/` e la loro licenza.
- `source/generate.py`: sorgente riproducibile comune per SVG e PDF; `source/layout-check.json`: controlli geometrici. Per rigenerare occorre Python con ReportLab; i font necessari sono inclusi.
- Ogni pagina renderizzata è stata ispezionata con dimensioni fisiche A4 e corpo principale di 10,15 pt. Corretti glifi mancanti, vicinanza dei nodi Chord, frecce di saturazione e disegno dei quorum. Controllati margini, card, footer, estrazione del testo, dimensioni PDF e struttura SVG.
- Nessun riassunto, slide, PDF sorgente o file del sito è stato modificato. I controlli del sito non sono pertinenti a questi soli artefatti.
