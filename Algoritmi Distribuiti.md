# Algoritmi Distribuiti

## Indice

- [[#1 Introduzione|1 Introduzione]]
  - [[#1.1 Ricorrenze e Master Theorem (facoltativo)|1.1 Ricorrenze e Master Theorem (facoltativo)]]
- [[#2 Teoria della Complessità|2 Teoria della Complessità]]
  - [[#2.1 Classificazione dei problemi per complessità|2.1 Classificazione dei problemi per complessità]]
  - [[#2.2 Approssimazioni di problemi NP-hard|2.2 Approssimazioni di problemi NP-hard]]
    - [[#Self-reduction del Vertex Cover|Self-reduction del Vertex Cover]]
    - [[#Inapprossimabilità del TSP generale|Inapprossimabilità del TSP generale]]
- [[#3 Algoritmi distribuiti|3 Algoritmi distribuiti]]
  - [[#3.1 Teoria della computazione distribuita|3.1 Teoria della computazione distribuita]]
  - [[#3.2 Leader election in alberi|3.2 Leader election in alberi]]
  - [[#3.3 Leader election in anelli|3.3 Leader election in anelli]]
  - [[#3.4 Leader election in grafi generici|3.4 Leader election in grafi generici]]
    - [[#Protocollo YO-YO|Protocollo YO-YO]]
  - [[#3.5 Leader election in anelli sincroni|3.5 Leader election in anelli sincroni]]
- [[#4 Algoritmi di routing|4 Algoritmi di routing]]
- [[#5 Errori e fallimenti|5 Errori e fallimenti]]
  - [[#5.1 Consensus problem con fallimenti sui collegamenti|5.1 Consensus problem con fallimenti sui collegamenti]]
  - [[#5.2 Consensus problem con fallimenti sui nodi|5.2 Consensus problem con fallimenti sui nodi]]
    - [[#Consensus deterministico con fallimenti bizantini|Consensus deterministico con fallimenti bizantini]]
- [[#6 Strutture dati distribuite|6 Strutture dati distribuite]]
  - [[#Chord: leave, failure e replicazione|Chord: leave, failure e replicazione]]

## List of Algorithms

1. [[#^algorithm-1|Risoluzione Ciclo Hamiltoniano con TSP]]
2. [[#^algorithm-2|2-approssimazione di TSP]]
3. [[#^algorithm-3|Algoritmo di Christofides per TSP]]
4. [[#^algorithm-4|Algoritmo ricorsivo generico per B&B]]
5. [[#^algorithm-5|Self-reduction del Vertex Cover]]
6. [[#^algorithm-6|Algoritmo greedy per Vertex Cover]]
7. [[#^algorithm-7|Relax & Round per Vertex Cover]]

### Protocolli distribuiti

1. [[#Esempio di costruzione e valutazione di un algoritmo distribuito|Flooding / Broadcast]]
2. [[#Il wake-up problem|WFlood / Wake-up]]
3. [[#Protocollo Shout|SHOUT e SHOUT+]]
4. [[#Costruzione dello spanning tree tramite traversal|DFT e variante Visited/Ack]]
5. [[#Tecnica di saturazione|Saturazione su alberi]]
6. [[#All The Way|All The Way]]
7. [[#As Far As It Can|As Far As It Can]]
8. [[#Controlled Distance|Controlled Distance (Hirschberg–Sinclair)]]
9. [[#Flood|FloodMax su grafi generici]]
10. [[#Protocollo YO-YO|YO-YO]]
11. [[#Speeding|Speeding]]
12. [[#Waiting|Waiting e Universal Waiting]]
13. [[#Elezione casuale del leader|Leader election randomizzata]]
14. [[#Gossiping|Gossiping]]
15. [[#Iterating|Distance-vector / Bellman–Ford distribuito]]
16. [[#Min-Hop routing|Min-Hop routing]]
17. [[#Algoritmo di Dijkstra|Dijkstra distribuito]]
18. [[#Flooding in grafi completi con fallimenti nei collegamenti|Flooding tollerante a link failure]]
19. [[#Consensus in sistemi sincroni|Consensus sincrono con crash]]
20. [[#Consensus in sistemi asincroni|Ben-Or randomizzato]]
21. [[#Consensus deterministico con fallimenti bizantini|RegisteredMail / TellZero-Byz]]
22. [[#Consensus problem con fallimenti bizantini|Consensus randomizzato bizantino]]
23. [[#Chord|Chord: lookup, join, stabilize, leave e failure]]

## 1 Introduzione

###### Problema computazionale

Un **problema computazionale** $\Pi$ è una questione di carattere generale che dipende da parametri i cui valori non sono specificati. Si definisce tramite:

- **INPUT:** insieme $I$ dei possibili input;
- **OUTPUT:** insieme $S$ delle possibili soluzioni;
- **FUNZIONE:** $\Pi : I \to S$.

Un'**istanza** del problema si ottiene assegnando valori specifici ai parametri.
*Esempio: «ordinare una sequenza di numeri» è un problema; ordinare $\{5,2,9,1\}$ è una sua istanza.*

_La notazione funzionale descrive direttamente il caso in cui il risultato è determinato univocamente. Quando sono ammesse più soluzioni, la stessa notazione va intesa in senso più generale: un algoritmo corretto può restituire una qualunque soluzione ammissibile; in un problema di ottimizzazione deve restituirne una ottima._

###### Classificazione per tipo di soluzione

I problemi si classificano in base al tipo di soluzione cercata:

1. **Problemi Decisionali**: la risposta è binaria (**SÌ/NO**)
   - _Esempio:_ "Il numero $x$ è primo?" o "Esiste un cammino da A a B di lunghezza $\le K$?"

2. **Problemi di Ricerca**: cerchiamo una soluzione che soddisfi certe proprietà.
   - _Esempio:_ "Trovami un cammino da A a B".

3. **Problemi di Ottimizzazione**: Cerchiamo la soluzione **migliore** (minimo costo o massimo guadagno) tra tutte quelle ammissibili.
   - _Esempio:_ "Trovami il cammino _più breve_ da A a B".

###### Algoritmi

Un **algoritmo** è una procedura generale per risolvere un problema definita tramite una **sequenza di passi finita**, **ben ordinata**, **non ambigua**, effettivamente **realizzabile** e che **termina** in tempo finito.

Un algoritmo per il problema $\Pi$ è **corretto** se, per ogni istanza $i \in I$, termina e produce il risultato richiesto; nella notazione funzionale, $\Pi(i) \in S$.

Fra gli algoritmi corretti interessa poi l'**efficienza**, cioè il costo in termini di risorse di calcolo, misurato rispetto a un modello e non a una particolare macchina:

- **tempo:** numero di operazioni elementari;
- **spazio:** numero di celle di memoria.

###### Dimensione del problema

La **dimensione** misura la quantità di informazione necessaria per rappresentare un'istanza:

- **criterio di costo logaritmico:** numero di bit necessari per rappresentare l'input;
- **criterio di costo uniforme:** numero di elementi che compongono l'input.

###### Analisi asintotica

Il tempo non si misura in secondi, ma come **numero di operazioni elementari** in funzione della dimensione dell'input $n$.

- **Caso peggiore (worst case):** massimo tempo richiesto da un'istanza di dimensione $n$. Rappresenta la garanzia fornita dall'algoritmo.
- **$O(f(n))$:** limite superiore asintotico.
- **$\Omega(f(n))$:** limite inferiore asintotico.
- **$\Theta(f(n))$:** ordine di crescita asintotico esatto, a meno di fattori costanti.

L'upper bound di un algoritmo corretto è anche un **upper bound del problema**. Un **lower bound del problema** deve invece valere per ogni algoritmo che lo risolve.

![[assets/Ordini di crescita - O-grande.png|900]]

###### Classificazione per difficoltà

In base al costo computazionale, i problemi si classificano in:

1. **Problemi trattabili (facili):** esiste un algoritmo che li risolve in tempo **polinomiale**. In altre parole, esiste una costante $k \ge 0$ tale che
   $$T(n) \in O(n^k).$$
   Sono polinomiali, per esempio, i costi $O(n)$, $O(n\log n)$ e $O(n^2)$.
   Per i problemi decisionali, questa è la classe $P$, che sarà definita formalmente nel capitolo successivo.
   - _Esempi:_ ordinamento, cammino minimo, costruzione di uno spanning tree.

2. **Problemi presumibilmente intrattabili (difficili):** non conosciamo un algoritmo di costo polinomiale, ma non è stato dimostrato che non esista.
   - _Esempio:_ la versione esatta del problema del commesso viaggiatore.

3. **Problemi intrattabili:** si può dimostrare che non esiste un algoritmo di costo polinomiale. Il costo necessario è quindi **superpolinomiale**, ma non per forza esponenziale: “non polinomiale” ed “esponenziale” non sono sinonimi.
   - _Esempi:_ produrre esplicitamente tutti i sottoinsiemi o tutte le permutazioni; Torre di Hanoi, se l'output richiesto è la sequenza completa delle mosse.
   - Un costo superpolinomiale può crescere molto rapidamente con la dimensione dell'input; per esempio, nei costi esponenziali o fattoriali anche un piccolo aumento dell'input può produrre un grande aumento del tempo.

4. **Problemi irrisolvibili:** si può dimostrare che non esiste alcun algoritmo risolutivo, indipendentemente dal costo.
   - _Esempio:_ **problema della fermata** (dato un algoritmo $A$ con input $D$, l'esecuzione di $A$ con input $D$ termina in tempo finito?).

###### Perché il polinomiale è la soglia di trattabilità?

- Esistono pochi problemi trattabili per i quali si conoscono soltanto algoritmi polinomiali di grado alto.
- In molti problemi lo spazio delle soluzioni è esponenziale: trovare un algoritmo polinomiale significa “fare meglio” di un algoritmo di forza bruta.
- In molti problemi trattabili, le istanze worst case sono poche o si presentano con bassa probabilità; negli altri casi il costo è migliore.
- I costi superpolinomiali diventano rapidamente proibitivi al crescere della dimensione delle istanze.
- La distinzione tra costo polinomiale e superpolinomiale è stabile rispetto ai miglioramenti tecnologici.

La polinomialità è una nozione teorica di trattabilità: un algoritmo polinomiale di grado elevato o con costanti molto grandi può comunque essere poco pratico.

_DOMANDA: l’appartenenza dei problemi a queste classi di problemi, non potrebbe dipendere dal modello di calcolo?_

###### Tesi di Church-Turing estesa

Modelli di calcolo diversi, ma ragionevoli, si possono simulare a vicenda con uno **slowdown polinomiale**. Sono quindi **polinomialmente equivalenti** alla macchina di Turing.

Di conseguenza, le classi definite mediante costi polinomiali non cambiano passando da un modello ragionevole a un altro.

La tesi di Church-Turing **ordinaria** riguarda invece quali funzioni siano effettivamente calcolabili.

### 1.1 Ricorrenze e Master Theorem (facoltativo)

Una **ricorrenza** descrive il costo di un algoritmo ricorsivo in funzione del costo di istanze più piccole. Per molti algoritmi divide et impera ha la forma:

$$T(n) = aT(n/b) + f(n),$$

dove $a$ è il numero di sottoproblemi, $n/b$ la dimensione di ciascuno e $f(n)$ il lavoro svolto fuori dalle chiamate ricorsive; serve inoltre un caso base, per esempio $T(1)=\Theta(1)$.

Il **Master Theorem** consente di stimare direttamente l'ordine di crescita di questa forma di ricorrenza. Posto $p=\log_b a$, confrontiamo $f(n)$ con $n^p$:

1. se $f(n)=O(n^{p-\varepsilon})$, prevale il costo ricorsivo e $T(n)=\Theta(n^p)$;
2. se $f(n)=\Theta(n^p)$, i costi sono bilanciati e $T(n)=\Theta(n^p\log n)$;
3. se $f(n)=\Omega(n^{p+\varepsilon})$ e vale una condizione di regolarità, prevale il lavoro esterno e $T(n)=\Theta(f(n))$.

**Esempio — Merge Sort.** La ricorrenza è $T(n)=2T(n/2)+\Theta(n)$. Poiché $a=2$, $b=2$ e $n^{\log_2 2}=n$, si applica il secondo caso: $T(n)=\Theta(n\log n)$.

[Apri il laboratorio interattivo](http://localhost:4321/widgets/master-theorem)

Il teorema non si applica direttamente a ricorrenze con sottoproblemi di dimensioni diverse, come $T(n)=T(n/3)+T(2n/3)+n$, né a forme decrementali come $T(n)=T(n-1)+n$.

**Riferimenti nei materiali disponibili:** la ricorrenza di Merge Sort è riportata in `materials/files/pdf_text/Cap3_IntroductionToAlgorithms.md`, righe 292–295, e nel PDF sorgente `class_notes/0-pre/1_extra_Cap3_IntroductionToAlgorithms.pdf`, pagina 7. Il Master Theorem è qui aggiunto come ripasso, non come contenuto attestato dalle dispense.

## 2 Teoria della Complessità

### 2.1 Classificazione dei problemi per complessità

###### Da problemi generici a decisionali

La teoria della complessità formula le classi $P$, $NP$ e NP-complete in termini di **problemi decisionali**, cioè problemi la cui risposta è sì oppure no. Questa scelta rende più agevole la trattazione formale e permette comunque di ottenere conseguenze anche per problemi di ricerca e di ottimizzazione.

Un problema di altro tipo può spesso essere associato a una versione decisionale. Per esempio:

- ottimizzazione: «qual è la lunghezza del cammino minimo da $s$ a $v$?»;
- decisione: «esiste un cammino da $s$ a $v$ di lunghezza al più $k$?».

###### Problemi P

La classe $P$ contiene i problemi decisionali risolvibili da un algoritmo deterministico in tempo polinomiale nella dimensione dell'input. Per dimostrare che un problema appartiene a $P$ è sufficiente esibire un tale algoritmo.

###### Certificati, verificatori e classe NP

Per un problema decisionale distinguiamo le istanze positive, la cui risposta è sì, da quelle negative. Un **certificato** è un'informazione aggiuntiva che permette di dimostrare che un'istanza è positiva; la sua lunghezza deve essere al più polinomiale nella dimensione dell'istanza.

Un **verificatore** è un algoritmo deterministico $V$ che riceve un'istanza $x$ e un possibile certificato $c$. Un problema decisionale $\Pi$ appartiene a $NP$ se esiste un verificatore polinomiale e un polinomio $p$ tali che

$$
x\text{ è positiva per }\Pi
\iff
\exists c:\ |c|\leq p(|x|)\ \land\ V(x,c)=\text{sì}.
$$

La doppia implicazione esprime due requisiti:

- completezza: ogni istanza positiva possiede almeno un certificato accettato;
- correttezza: nessun certificato può far accettare un'istanza negativa.

La sigla $NP$ significa *nondeterministic polynomial time*: equivalentemente, sono i problemi decisionali risolvibili in tempo polinomiale da una macchina non deterministica. Non significa *non polinomiale*.

###### Esempio: ciclo hamiltoniano

Nel problema decisionale del **ciclo hamiltoniano** l'input è un grafo semplice non orientato $G=(V,E)$ e si chiede se esista un ciclo che visiti ogni vertice esattamente una volta e ritorni al vertice iniziale.

![[assets/ciclo-hamiltoniano.png|900]]

Un certificato per un'istanza positiva è la sequenza dei vertici nell'ordine in cui compaiono nel ciclo. Il verificatore controlla che:

1. la sequenza contenga tutti e soli i vertici di $G$, senza ripetizioni;
2. ogni coppia consecutiva sia collegata da un arco;
3. anche l'ultimo vertice sia collegato al primo.

Sono sufficienti un numero polinomiale di controlli, quindi il problema appartiene a $NP$. Non si conosce invece un algoritmo polinomiale che lo risolva. Provare tutte le permutazioni richiede tempo fattoriale, ma il costo di questo specifico algoritmo esaustivo non dimostra che ogni possibile algoritmo debba avere lo stesso costo.

###### Relazione tra P e NP

Vale $P\subseteq NP$: se un problema è risolvibile in tempo polinomiale, il suo algoritmo risolutore può essere usato come verificatore ignorando il certificato, oppure usando come certificato la stringa vuota.

Non sappiamo invece se $NP\subseteq P$. Stabilire se $P=NP$ oppure $P\neq NP$ è uno dei principali problemi aperti dell'informatica teorica.

###### Perché servono le riduzioni

Una **riduzione** mostra come risolvere un problema usando un algoritmo per un altro problema. Serve a:

- trasferire algoritmi: se $A$ si riduce a $B$ e sappiamo risolvere efficientemente $B$, otteniamo un algoritmo efficiente anche per $A$;
- trasferire difficoltà: se un problema già noto come difficile si riduce a $B$, allora $B$ è almeno altrettanto difficile.

La direzione è quindi essenziale: per dimostrare che $B$ è difficile bisogna ridurre un problema difficile noto **a $B$**, non il contrario.

###### Riduzione di Karp

Siano $A$ e $B$ due problemi decisionali. Una **riduzione di Karp**, o riduzione many-one in tempo polinomiale, da $A$ a $B$ è una funzione $f$ calcolabile in tempo polinomiale tale che, per ogni istanza $x$,

$$
x\text{ è positiva per }A
\iff
f(x)\text{ è positiva per }B.
$$

Si scrive $A\leq_p B$. La trasformazione preserva sia le risposte positive sia quelle negative e produce una sola istanza di $B$.

![[assets/riduzione-karp.png|1000]]

**Intuizione.** $A\leq_p B$ significa che un algoritmo per $B$, preceduto dalla trasformazione $f$, consente di risolvere anche $A$. Pertanto $A$ è al più difficile quanto $B$.

Da $A\leq_p B$ seguono queste conseguenze:

- se $B\in P$, allora $A\in P$;
- se $A\notin P$, allora $B\notin P$, per contrapposizione;
- se $A\in P$, non possiamo dedurre che $B\in P$;
- se $B\notin P$, non possiamo dedurre che $A\notin P$.

Se valgono sia $A\leq_p B$ sia $B\leq_p A$, i problemi sono polinomialmente equivalenti. Inoltre la riduzione di Karp è transitiva:

$$
A\leq_p B\ \land\ B\leq_p C
\implies
A\leq_p C.
$$

###### Problemi NP-completi

Un problema decisionale $A$ è **NP-completo** se:

1. $A\in NP$;
2. per ogni problema $B\in NP$, vale $B\leq_p A$.

Gli NP-completi sono dunque i problemi più difficili di $NP$ rispetto alle riduzioni polinomiali.
Il problema del ciclo hamiltoniano introdotto sopra è un esempio di problema NP-completo.

###### Conseguenza fondamentale

Per un qualunque problema NP-completo:

- trovare un algoritmo polinomiale implica $P=NP$;
- dimostrare che nessun algoritmo polinomiale può risolverlo implica $P\neq NP$.

Per dimostrare che un nuovo problema $A$ è NP-completo si procede normalmente così:

1. si dimostra che $A\in NP$;
2. si sceglie un problema $B$ già noto come NP-completo;
3. si costruisce una riduzione $B\leq_p A$.

La correttezza del metodo segue dalla transitività: per ogni $C\in NP$ sappiamo già che $C\leq_p B$; insieme a $B\leq_p A$ otteniamo $C\leq_p A$.

###### SAT e l'inizio della catena

Per avviare questo metodo serve almeno un problema già noto come NP-completo. I teoremi di Cook e Levin individuano questo punto di partenza nel problema **SAT** (*Boolean satisfiability problem*).

Nel corso SAT è presentato su formule in **forma normale congiuntiva** (FNC):

- un letterale è una variabile booleana oppure la sua negazione;
- una clausola è una disgiunzione di letterali;
- una formula in FNC è una congiunzione di clausole.

[Prova una formula in FNC](./widgets/sat-fnc)

Il problema chiede se esista un assegnamento di verità alle variabili che renda vera l'intera formula. Per esempio,

$$
(a\lor b\lor c)\land(\neg b\lor c)\land(\neg a\lor\neg b\lor c)
$$

è soddisfacibile: assegnando $c=\text{vero}$ tutte le clausole risultano vere. SAT appartiene a $NP$ perché un assegnamento costituisce un certificato verificabile valutando la formula in tempo polinomiale; il teorema di Cook–Levin dimostra inoltre che ogni problema in $NP$ si riduce a SAT.

###### Problemi NP-hard

Nel contesto dei problemi decisionali, un problema $A$ è **NP-hard** se

$$
\forall B\in NP:\ B\leq_p A.
$$

Questa è la seconda condizione della definizione di NP-completezza, senza richiedere $A\in NP$. Un problema NP-completo è quindi sia NP-hard sia appartenente a $NP$; un problema NP-hard può invece non appartenere a $NP$.

Per dimostrare che $A$ è NP-hard basta scegliere un problema NP-completo $B$ e mostrare $B\leq_p A$: la transitività estende la riduzione a ogni problema di $NP$.

###### Riduzione di Turing e problemi di ottimizzazione

La riduzione di Karp è formulata tra problemi decisionali perché $P$, $NP$ e NP-complete sono, nella teoria classica, classi di linguaggi o problemi con risposta sì/no. Per confrontare un problema decisionale con un problema di ricerca o di ottimizzazione si usa invece una riduzione con oracolo.

Si scrive $A\leq_T^p B$ quando esiste un algoritmo polinomiale per $A$ che può interrogare un **oracolo per $B$**, cioè un sottoprogramma che restituisce correttamente la soluzione di $B$. Le interrogazioni possono essere più di una e quelle successive possono dipendere dalle risposte precedenti.

Per dimostrare che un problema $A$, anche di ottimizzazione, è NP-hard si può scegliere un problema NP-completo $B$ e costruire $B\leq_T^p A$. Nel caso più semplice sono sufficienti una sola chiamata all'oracolo per $A$ e una trasformazione polinomiale del risultato:

![[assets/riduzione-turing.png|1000]]

Per esempio, distinguiamo:

- TSP decisionale: «esiste un tour di costo al più $k$?», un problema NP-completo;
- TSP di ottimizzazione: «trova un tour di costo minimo», un problema NP-hard.

Un oracolo per la versione di ottimizzazione permette di risolvere quella decisionale confrontando il costo ottimo restituito con $k$. Non si dice che il TSP di ottimizzazione “non è in $NP$”: nella definizione classica l'affermazione non è ben posta, perché $NP$ contiene problemi decisionali. La riduzione dal ciclo hamiltoniano al TSP di ottimizzazione sarà costruita esplicitamente nella sezione successiva.

I problemi NP-hard restano importanti nelle applicazioni. In base al contesto si usano algoritmi esatti su istanze piccole, euristiche, parallelizzazione oppure algoritmi di approssimazione; quest'ultimo approccio è l'oggetto della sezione successiva.

###### Riepilogo

| Classe | Caratterizzazione |
|---|---|
| $P$ | Problemi decisionali risolvibili in tempo polinomiale |
| $NP$ | Problemi decisionali con certificati positivi verificabili in tempo polinomiale |
| NP-completi | Problemi in $NP$ ai quali si riduce ogni problema di $NP$ |
| NP-hard | Problemi almeno difficili quanto ogni problema di $NP$; possono non essere decisionali o non appartenere a $NP$ |

### 2.2 Approssimazioni di problemi NP-hard

###### Algoritmi di approssimazione

Per un problema di ottimizzazione NP-hard, un **algoritmo di approssimazione** restituisce in tempo polinomiale una soluzione **ammissibile**, ma non necessariamente ottima. La sua qualità non si esprime dicendo quanto sbaglia su una certa istanza, bensì con una garanzia valida per ogni istanza di input.

Sia $\Pi$ un problema di ottimizzazione, sia $I$ una sua istanza di dimensione $n$, e indichiamo con:

- $OPT(I)$ il valore della soluzione ottima;
- $ALG(I)$ il valore della soluzione restituita dall'algoritmo $ALG$.

Il **fattore di approssimazione** $\rho(n) \geq 1$ (spesso indicato anche con $\alpha$) misura la qualità garantita nel caso peggiore. Assumendo valori di costo non negativi e $OPT(I)>0$, diciamo che $ALG$ è una **$\rho$-approssimazione** se, per ogni istanza $I$:

- per un problema di **minimizzazione**,

  $$
  ALG(I) \leq \rho(n) \cdot OPT(I),
  \qquad\text{equivalentemente}\qquad
  \frac{ALG(I)}{OPT(I)} \leq \rho(n);
  $$

- per un problema di **massimizzazione**,

  $$
  ALG(I) \geq \frac{OPT(I)}{\rho(n)},
  \qquad\text{equivalentemente}\qquad
  \frac{OPT(I)}{ALG(I)} \leq \rho(n).
  $$

In entrambi i casi il rapporto è scelto in modo da essere almeno $1$: $\rho(n)=1$ corrisponde a un algoritmo esatto e, a parità di problema, un fattore più vicino a $1$ è migliore. Se $\rho$ è una costante, la qualità non peggiora al crescere dell'istanza; il fattore può però anche dipendere da $n$.

La garanzia è di **worst-case**: non afferma che l'algoritmo ottenga sempre un rapporto uguale a $\rho$, ma che nessuna istanza può produrre un rapporto peggiore. Le istanze con ottimo nullo richiedono una convenzione separata, perché il rapporto non è definito; nei problemi studiati qui i costi sono positivi, oppure il caso $OPT(I)=0$ è banale da riconoscere e risolvere esattamente.

###### Dimostrare un fattore mediante un lower bound

Per provare una garanzia di approssimazione non occorre conoscere esplicitamente $OPT(I)$, che è proprio il valore difficile da calcolare. Per un problema di minimizzazione basta trovare un **lower bound** $LB(I)$ tale che

$$
LB(I) \leq OPT(I)
$$

e dimostrare che l'algoritmo produce una soluzione di costo al più $\rho(n)$ volte quel limite:

$$
ALG(I) \leq \rho(n) \cdot LB(I).
$$

Combinando le due disuguaglianze si ottiene

$$
ALG(I) \leq \rho(n) \cdot LB(I) \leq \rho(n) \cdot OPT(I),
$$

che è esattamente la definizione di $\rho$-approssimazione. Nei prossimi algoritmi il lower bound nascerà, per esempio, da un matching o da un rilassamento lineare; per la massimizzazione il ragionamento duale usa invece un upper bound su $OPT(I)$.

###### TSP è un problema NP-hard

Come da titolo, in questo paragrafo si dimostra che TSP è un problema NP-hard. Lo stesso TSP è un problema di enorme interesse nella nostra realtà di tutti i giorni, basti pensare ai servizi di consegna dei maggiori on-line sellers. Dunque introduciamo il presente teorema allo scopo di continuare a trattare TSP anche nei paragrafi successivi.

![[assets/Screenshot 2024-09-25 115533.png|900]]

Il ciclo Hamiltoniano è un problema decisionale NP-completo che prende in input un grafo $G = (V, E)$ e restituisce in output sì se in $G$ esiste un ciclo Hamiltoniano, no altrimenti. In qualche modo questo problema assomiglia a TSP. Si noti che non è richiesto di avere un grafo $G$ completo, né archi pesati. Nel caso di grafo completo, peraltro, la risposta sarebbe sempre sì.
Si prende dunque un'istanza qualsiasi di ciclo Hamiltoniano (il grafo $G$). L'istanza viene trasformata nell'input per un TSP (un grafo completo $G^\prime = (V, E^\prime)$), associando un costo agli archi. In particolare, agli archi nativi si assegna un peso nullo, mentre a quelli aggiunti un peso non nullo. Questo farà sì che la soluzione $H^*$ di TSP possa essere considerata accettabile per il ciclo Hamiltoniano solo qualora il costo complessivo risulti nullo (ovvero $H^*$ stesso sia composto da soli archi nativi). Una volta individuato $H^*$, si risponde alla domanda iniziale con un sì od un no.
Formalizziamo il tutto in pseudo-codice:

**Algorithm 1 Risoluzione Ciclo Hamiltoniano con TSP** ^algorithm-1

> 1. **function** HCtoTSP($G$)
> 2.  $E^\prime \gets \{\{u, v\} : u, v \in V, u \neq v\}$<br>
> 3.  **for all** $(u, v)$ in $E^\prime$ **do**
> 4.   **if** $(u, v) \in E$ **then**
> 5.    $C(u, v) \gets 0$
> 6.   **else**
> 7.    $C(u, v) \gets k, k > 0$
> 8.   **end if**
> 9.  **end for**
> 10.  $G^\prime = (V, E^\prime, C)$
> 11.  $H^* \gets TSP(G^\prime)$
> 12.  **if** $C(H^*) == 0$ **then**
> 13.   **return** sì
> 14.  **else**
> 15.   **return** no
> 16.  **end if**
> 17. **end function**

Abbiamo appena dimostrato che possiamo risolvere il ciclo Hamiltoniano usando un algoritmo per TSP. La trasformazione richiede tempo polinomiale: nel caso non diretto il grafo completo ha $\frac{n(n-1)}{2}$ archi, e la costruzione dei pesi richiede $O(n^2)$ operazioni.
Poiché il ciclo Hamiltoniano è NP-completo e si riduce in tempo polinomiale a TSP, la riduzione dimostra direttamente che TSP è NP-hard. Non occorre assumere $P \neq NP$ per questa conclusione; tale ipotesi serve soltanto per dedurre che TSP non possa avere un algoritmo polinomiale.

###### Inapprossimabilità del TSP generale

> **Teorema.** Se $P \neq NP$, per ogni costante $\rho \geq 1$ non esiste un algoritmo polinomiale di $\rho$-approssimazione per il TSP generale.

La dimostrazione è per assurdo. Supponiamo che esista un algoritmo polinomiale $A$ con fattore costante $\rho$ e usiamolo per decidere il problema NP-completo del ciclo Hamiltoniano. Data un'istanza $G=(V,E)$ di quest'ultimo problema, poniamo $n=|V|$ e costruiamo il grafo completo $G'=(V,E')$ con costi

$$

c(e)=
\begin{cases}
1 & \text{se } e\in E,\\
M=\lceil \rho n\rceil+1 & \text{se } e\notin E.
\end{cases}

$$

La costruzione richiede $O(n^2)$ operazioni e il valore $M$ ha una rappresentazione di lunghezza polinomiale. Consideriamo i due casi:

- Se $G$ contiene un ciclo Hamiltoniano, lo stesso ciclo esiste in $G'$ e ha costo $n$. Poiché tutti gli archi costano almeno 1, l'ottimo vale esattamente $OPT(G')=n$. La garanzia di approssimazione impone quindi $cost(A(G'))\leq \rho n$.
- Se $G$ non contiene un ciclo Hamiltoniano, ogni tour di $G'$ usa almeno un arco non appartenente a $E$. Il suo costo è dunque almeno

  $$M+(n-1)>\rho n.$$

  Una soluzione ammissibile non può costare meno dell'ottimo, quindi anche $cost(A(G'))>\rho n$.

Controllando se il costo restituito da $A$ è al più $\rho n$ potremmo pertanto decidere in tempo polinomiale se $G$ possiede un ciclo Hamiltoniano. Ne seguirebbe $P=NP$, contro l'ipotesi. Il risultato riguarda il **TSP generale**: i costi costruiti non soddisfano necessariamente la disuguaglianza triangolare e quindi non esclude approssimazioni costanti per il TSP metrico.

###### Approssimazioni di TSP

In input abbiamo un grafo completo $G = (V, E)$, pesato sugli archi (ovvero affiancato da una funzione $C : E \to \mathbb{R}$). L'output che desideriamo è il ciclo Hamiltoniano (cioè che passa una ed una sola volta per ogni nodo del grafo) di costo minimo.
Un approccio a forza bruta è fattoriale, anche se ciò non prova che il problema non possa essere approcciato in modo efficiente. L'approccio a forza bruta è tuttavia applicabile nel caso di grafi di dimensioni ridotte.
Come abbiamo già visto, TSP è NP-hard. Il fattore di approssimazione di TSP su tutti i possibili input cresce con la dimensione delle istanze. Questo è un fatto molto scomodo, per cui in modo da individuare un fattore di approssimazione costante dobbiamo restringere i possibili input. Consideriamo ad esempio le istanze per cui i costi siano non-negativi e valga la disuguaglianza triangolare:

- $C : E \to \mathbb{R}^+$

- $\forall u, v, z \in V : C(u, z) \leq C(u, v) + C(v, z)$

In questo contesto, verificare la disuguaglianza triangolare significa, in modo molto pratico, che passare direttamente da un nodo $u$ ad un nodo adiacente $z$ è meno costoso che effettuare un passaggio intermedio tramite un terzo nodo $v$ adiacente ad entrambi. Questa è una condizione tutto sommato naturale, soddisfatta in diverse applicazioni.
Ora vediamo nel dettaglio diversi algoritmi di approssimazione per TSP.

- **Algoritmo di 2-approssimazione**: si costruisce per prima cosa un minimum spanning tree $T^*$, poi se ne raddoppiano tutti gli archi. Nel multigrafo risultante ogni vertice ha grado pari, quindi si può calcolare un ciclo euleriano $E$, per esempio mediante una visita DFS che percorra anche i ritorni lungo gli archi duplicati. Il ciclo Hamiltoniano $H$ si ricava percorrendo $E$ e saltando ogni vertice già visitato.

  > **AA 2025/26.** Questo algoritmo non è stato svolto a lezione. Le dispense ufficiali richiedono comunque di conoscerne l'analisi nella misura necessaria a comprendere l'analisi di Christofides.

  Nell'immagine sotto sono riportate in sequenza le azioni appena spiegate. Del grafo, che naturalmente è supposto essere completo, si mostrano per semplicità solo gli archi di $T^*, E, H$.

  ![[assets/2-approx.jpg|1000]]

  In pseudo-codice:

  **Algorithm 2 2-approssimazione di TSP** ^algorithm-2

  > 1. **function** 2-approx($G$)
  > 2.  $T^* \gets MSTPrim(G)$
  > 3.  $G^\prime \gets doubleEdges(T^*)$
  > 4.  $E \gets EulerTour(G^\prime)$<br>
  > 5.  $H \gets removeShortcuts(E)$
  > 6.  **return** $H$
  > 7. **end function**

  Ora dobbiamo dimostrare che l'algoritmo appena definito ha $\alpha = 2$.
  Iniziamo notando che:

  - $cost(H) \leq cost(E)$, per via della disuguaglianza triangolare (i percorsi diretti hanno costi inferiori a quelli indiretti)

  - $cost(E) = 2 \cdot cost(T^*)$, perché abbiamo raddoppiato il numero di archi rispetto a $T^*$

  Mettiamo tutto insieme:

  $$\begin{aligned}
                          cost(H) \leq cost(E) = 2 \cdot cost(T^*)
  \end{aligned}$$

  Se prendiamo $H^*$ (il ciclo Hamiltoniano di costo minimo) e ne rimuoviamo un arco, otteniamo uno spanning tree $T$ (non necessariamente minimo). Abbiamo quindi che:

  $$\begin{aligned}
                          cost(T^*) \leq cost(T) \leq cost(H^*)
  \end{aligned}$$

  - La prima disuguaglianza vale perché $T^*$ è un minimum spanning tree, quindi non costa più di qualunque altro spanning tree $T$

  - La seconda disuguaglianza vale perché $T$ si ottiene rimuovendo un arco da $H^*$ e i pesi sono non-negativi, quindi $cost(T) \leq cost(H^*)$

  Collegando questa catena di disuguaglianze a quella impostata sopra, mettiamo in relazione $cost(H)$ e $cost(H^*)$, trovando infine che:

  $$\begin{aligned}
                          \frac{cost(H)}{cost(H^*)} \leq 2
  \end{aligned}$$

  Ora andiamo a vedere che questo algoritmo ha istanze per le quali esattamente $\alpha = 2$. Per questo motivo possiamo dire che l'analisi fatta è "tight" (cioè stretta, esatta).
  Lo dimostriamo considerando una particolare categoria di grafi.

  ![[assets/2-approx-Pagina-2.jpg|1000]]

  Nell'immagine vengono rappresentati solo gli archi con costo 1, considerando implicitamente tutti gli altri come aventi costo 2. Supponiamo che il minimum spanning tree $T^*$ abbia una forma radiale e che il cammino euleriano $E$ visiti i nodi secondo l'ordine definito (in questo caso, alfabetico). Facendo la visita ed applicando gli shortcuts, il cammino Hamiltoniano $H$ ha costo $2 + 2 \cdot (n - 2) = 2 \cdot n - 2$. Per contro, $H^*$ ha costo $n$. Per questo motivo:

  $$\begin{aligned}
                          \frac{cost(approx)}{cost(opt)} = \frac{2 \cdot n - 2}{n} \xrightarrow{n \to \infty} 2
  \end{aligned}$$

- **Algoritmo di Christofides**: questo algoritmo ha la grande importanza di garantire un fattore $\alpha = \frac{3}{2}$. Mentre la 2-approssimazione fa affidamento sullo sdoppiamento degli archi, che rende inevitabile un valore $\alpha = 2$, Christofides tentò di applicare il concetto di "matching".
  Sia $G = (V, E)$ un grafo qualsiasi. Un matching è un sottoinsieme di $E$ composto da soli archi disgiunti; un caso particolare di matching è il "perfect" matching, che copre tutti i nodi. La condizione necessaria per avere perfect matching è che $|V|$ sia pari (altrimenti non potremmo chiudere tutti i nodi a coppie).

  ![[assets/Screenshot 2024-10-01 111804.png|500]]

  Nel nostro procedimento algoritmico, ancora una volta andiamo a costruire il MST $T^*$. Troviamo quindi tutti i nodi con grado dispari, perché costituiscono il principale ostacolo ad applicare il perfect matching. Questi nodi (e gli archi incidenti) individuano un sottografo completo indotto $G^\prime \subseteq G$. Andiamo ora a cercare un perfect matching $E^*$ di costo minimo su $G^\prime$ (quello nell'immagine è solo un esempio).

  ![[assets/christof1.png|800]]

  Nell'esempio specifico c'è un perfect matching individuato da ogni possibile coppia di nodi, ma questo è comunque sempre possibile, a patto che $G^\prime$ abbia un numero pari di vertici e sia completo. Dimostreremo infatti che l'insieme $U$ dei vertici di grado dispari ha sempre cardinalità pari.
  Infine, uniamo come multinsieme gli archi di $T^*$ ed $E^*$, poi calcoliamo un ciclo euleriano $E$. Analogamente alla 2-approssimazione percorriamo $E$ e saltiamo i vertici già visitati (shortcut), ottenendo il ciclo Hamiltoniano $H$.

  ![[assets/christof2.png|700]]

  Riscriviamo tutto in pseudo-codice:

  **Algorithm 3 Algoritmo di Christofides per TSP** ^algorithm-3

  > 1. **function** Christofides-approx($G$)
  > 2.  $T^* \gets MSTPrim(G)$
  > 3.  $U \gets getOddDegreeNodes(T^*)$
  > 4.  $G^\prime \gets getInducedSubgraph(G, U)$
  > 5.  $E^* \gets minimumWeightPerfectMatching(G^\prime)$<br>
  > 6.  $F \gets multisetUnion(T^*, E^*)$<br>
  > 7.  $E \gets EulerTour(F)$<br>
  > 8.  $H \gets removeShortcuts(E)$
  > 9.  **return** $H$
  > 10. **end function**

  Facciamo un passo indietro. Ora dimostriamo che esistono sempre un numero pari di nodi di grado dispari nel nostro spanning tree. Nei grafi non diretti abbiamo che:

  $$\begin{aligned}
                          \sum_{v \in V} deg(v) = 2 \cdot |E|
  \end{aligned}$$

  Questo numero è per forza sempre pari, essendo $|E|$ moltiplicato per 2, che è pari. Proviamo ora a sommare tra loro i gradi dei nodi con grado pari e quelli con grado dispari. Abbiamo:

  $$\begin{aligned}
                          \sum_{v \in V : deg(v) \% 2 = 0} deg(v) + \sum_{v \in V : deg(v) \% 2 = 1} deg(v)
  \end{aligned}$$

  La prima sommatoria riguarda i gradi pari, percui è sempre pari. La seconda sommatoria riguarda i gradi dispari, percui è pari quando $|v \in V : deg(v) \% 2 = 1|$ è pari. In ogni modo, essendo $\sum_{v \in V} deg(v)$ pari, la seconda sommatoria è sempre pari, perché lo è anche la prima, dovendo entrambe sommare ad un numero pari. Quando andiamo a prendere i nodi di grado dispari in $T^*$, quindi, ne prendiamo sempre un numero pari. L'algoritmo è dunque applicabile per ogni istanza di $T^*$, inoltre ha un tempo di esecuzione polinomiale.
  Adesso cerchiamo di stimare l'upper bound dell'errore di approssimazione (cioè il valore di $\alpha$). Come per la 2-approssimazione, possiamo costruire una catena di disuguaglianze, che andremo poi a cercare di confrontare con l'ottimo.

  $$\begin{aligned}
                          cost(H) \leq cost(E) = cost(T^*) + cost(E^*)
  \end{aligned}$$

  Per quanto riguarda la prima disuguaglianza, è la stessa della 2-approssimazione. L'uguaglianza è banalmente vera per costruzione. Invece, riguardo all'ottimo, andiamo ancora una volta a rimuovere un arco da $H^*$, trovando l'albero di copertura $T$. Abbiamo:

  $$\begin{aligned}
                          cost(T^*) \leq cost(T) \leq cost(H^*)
  \end{aligned}$$

  proprio come per la 2-approssimazione.
  Ora, consideriamo nuovamente $H^*$. Il cammino Hamiltoniano ottimo passa sicuramente per tutti i nodi di grado dispari che avevamo trovato su $T^*$. Prendiamo un ciclo Hamiltoniano $\Gamma$ che collega quei nodi, nell'ordine in cui compaiono in $H^*$. Siccome questi nodi sono in numero pari, si può vedere $\Gamma$ come la composizione di esattamente due perfect matching ($M_1$ e $M_2$). In particolare, basta considerare sequenzialmente un arco sì ed uno no per ricavare uno dei perfect matching. Anche qui l'immagine è solo indicativa.

  ![[assets/christof3.png|1000]]

  Siccome $M_1 + M_2 = \Gamma$, possiamo scrivere:

  $$\begin{aligned}
                          cost(\Gamma) = cost(M_1) + cost(M_2)
  \end{aligned}$$

  Cerchiamo di mettere in relazione il costo di $H^*$ e quello di $\Gamma$:

  $$\begin{aligned}
                          cost(\Gamma) \leq cost(H^*)
  \end{aligned}$$

  Questo è vero per la disuguaglianza triangolare: $\Gamma$ è come un cammino di scorciatoie su $H^*$.
  Ora invece tentiamo di mettere in relazione il costo di $\Gamma$ e il costo di $E^*$. Siccome quest'ultimo è il perfect matching di costo minimo, mentre non abbiamo fatto alcuna ipotesi su $M_1$ e $M_2$, possiamo dire che:

  $$\begin{aligned}
                          2 \cdot cost(E^*) \leq cost(M_1) + cost(M_2) = cost(\Gamma) \leq cost(H^*) \Rightarrow cost(E^*) \leq \frac{cost(H^*)}{2}
  \end{aligned}$$

  Infine, colleghiamo le disuguaglianze sostituendo al membro a destra ciò che abbiamo appena trovato:

  $$\begin{aligned}
                          cost(H) \leq cost(H^*) + \frac{cost(H^*)}{2} = \frac{3}{2} \cdot cost(H^*)
  \end{aligned}$$

  Come per la 2-approssimazione, possiamo dimostrare che esistono classi di grafi per cui abbiamo esattamente $\alpha = \frac{3}{2}$.

La 2-approssimazione e l'algoritmo di Christofides sono due algoritmi ad hoc (dunque specificamente ideati) per la risoluzione di TSP. Un altro possibile metodo è quello di applicare tecniche risolutive standard (es. programmazione lineare, approccio greedy, ecc\...).

###### Branch and bound

Tecnica generale che ci consente di andare a provare le soluzioni raggruppandole in insiemi (branches), senza necessariamente doverle provare una alla volta.
Gli insiemi $S_i$ di soluzioni hanno devono possibilmente avere intersezioni nulle. Si tiene costantemente traccia della miglior soluzione individuata fino a quel punto, ricorrentemente chiamata "current best solution". Ad ogni sottoinsieme $S_i$ si tenta di dare un lower bound al costo delle soluzioni ivi contenute. Ogni volta che si trova un lower bound, questo viene confrontato con la current best solution per determinare se $S_i$ sia o meno di interesse per proseguire la ricerca della solzione ottima.

![[assets/Screenshot 2024-10-02 110633.png|900]]

Si va avanti in questo modo, ricorsivamente, partizionando a loro volta gli insiemi $S_i$, le loro partizioni e così via. Una volta che l'insieme considerato è sufficientemente piccolo, si può procedere per tentativi sulle singole soluzioni. Possiamo vedere insiemi, sottoinsiemi e soluzioni come un albero dentro al quale noi eseguiamo una discesa ricorsiva. Bisogna però dire che questo è uno solo degli approcci possibili. Valide alternative sono per esempio una ricerca in ampiezza o l'uso di euristiche.
Vediamo lo pseudo-codice del caso ricorsivo che abbiamo visto, riferendoci ad un ipotetico problema di minimo:

**Algorithm 4 Algoritmo ricorsivo generico per B&B** ^algorithm-4

> 1. $BCS \gets null$
> 2. $UB \gets \infty$<br>
> 3. **function** B&B(S)
> 4.  **if** $lowerBound(S) \geq UB$ **then**<br>
> 5.   **return**
> 6.  **end if**
> 7.  **if** $S$ represents a single feasible solution **then**<br>
> 8.   **if** $cost(S) < UB$ **then**<br>
> 9.    $BCS \gets S$
> 10.    $UB \gets cost(S)$<br>
> 11.   **end if**
> 12.  **else**
> 13.   **for all** $S_i$ in $branch(S)$ **do**
> 14.    $B\&B(S_i)$
> 15.   **end for**
> 16.  **end if**
> 17.  **return**
> 18. **end function**
> 19. **return** $BCS$

Nello pseudo-codice si suppone che la funzione di branching ritorni al chiamante qualora $|S_i| = 1$. Un'immagine può aiutarci a visualizzare la dinamica.

![[assets/Screenshot 2024-10-02 110148.png|600]]

Pur non trattandosi di un approccio a forza bruta vero e proprio, occorre ricordare che stiamo comunque muovendoci per tentativi. Inoltre, branch and bound non è polinomiale; è possibile che le soluzioni non vengano raccolte in sottoinsiemi sufficientemente grandi e dunque che si debbano valutare singolarmente molte soluzioni, ottenendo un costo complessivo molto alto. Per questo motivo, possiamo fermare un algoritmo di branch and bound dopo un certo tempo e misurare l'errore massimo possibile come il gap più ampio tra la best current solution ed il lower bound più piccolo, oppure fermare l'algoritmo solo quando l'entità del gap scende sotto una certa soglia considerata accettabile.

###### TSP in chiave branch and bound

Nel caso di TSP, tutte le possibili soluzioni corrispondono all'insieme di tutti i possibili cammini Hamiltoniani su di un grafo completo $G = (V, E)$. I sottoinsiemi di istanze $S_i$ corrispondono invece a diverse tipologie di grafi, costruiti con tutte le possibili combinazioni di archi tra i nodi del grafo completo $G$. Gli elementi ad esse appartenenti sono quindi tutti i possibili cicli Hamiltoniani che si possono trovare al loro interno.
Inizialmente, si sceglie una categoria di grafi, rimuovendo un nodo $v$. A questo punto si va a trovare minimum spanning tree $T^*$. Se $deg(v) = 0, 1$, non è possibile chiudere un eventuale ciclo Hamiltoniano, perciò si procede oltre. Se invece $deg(v) \geq 2$, si prendono i due archi con il peso minore che lo collegano al resto del grafo. Chiameremo questi archi $e_1, e_2$ rispettivamente.
Collegando $v$ al resto del grafo si genera un cosiddetto 1-Tree, con radice proprio in $v$.

![[assets/Screenshot 2024-10-01 150520.png|700]]

Possiamo scrivere il lower bound (**bounding**) come:

$$\begin{aligned}
                    LB = cost(T^*) + cost(e_1) + cost(e_2)
\end{aligned}$$

Ogni altro ciclo Hamiltoniano sul grafo ha un costo di almeno $LB$, dimostriamolo.
Il ciclo Hamiltoniano ottimo $H^*$ passa per $v$ e tutti gli altri nodi per definizione; rimuovendo $v$ si trova un cammino $P$ che è anche uno spanning tree su tutto il grafo meno $v$. Possiamo mettere $P$ e $T^*$ in relazione tra loro:

$$\begin{aligned}
                    cost(P) \geq cost(T^*)
\end{aligned}$$

Inoltre, se consideriamo due archi qualsiasi che collegano $v$ al resto del grafo, che chiamiamo $e^\prime, e^{\prime\prime}$ rispettivamente, abbiamo per ipotesi che:

$$\begin{aligned}
                    cost(e^\prime) + cost(e^{\prime\prime}) \geq cost(e_1) + cost(e_2)
\end{aligned}$$

Unendo il tutto, troviamo che:

$$\begin{aligned}
                    cost(H) &= cost(P) + cost(e^\prime) + cost(e^{\prime\prime})\\
                    &\geq cost(T^*) + cost(e_1) + cost(e_2) = LB = cost(1-Tree)
\end{aligned}$$

Nel caso in cui ci si accorga che lo 1-Tree trovato sia effettivamente un ciclo Hamiltoniano (come visto nell'esempio sopra, non è garantito che lo sia) e che perciò $S_i$ ammetta una soluzione completa, allora potremo dire di aver ottenuto il ciclo Hamiltoniano di costo minimo $H^*$ per quella categoria di grafi e sarà possibile confrontare $LB$ con la best current solution.

![[assets/Screenshot 2024-10-02 152221.png|700]]

Passiamo ora a vedere come eseguire il **branching**. Se un grafo non consiste di un ciclo unico, allora almeno un nodo $v$ ha grado $\geq 3$. In questa situazione, possiamo generare 3 diversi grafi da quello di partenza, mantenendo in ciascuno coppie diverse dei 3 o più archi incidenti sul nodo $v$.

![[assets/Screenshot 2024-10-02 152514.png|700]]

In questo modo, il branching è eseguito a costo polinomiale.

###### Vertex Cover Problem

Si tratta di un problema NP-hard di copertura: prende in ingresso un grafo $G = (V, E)$ non diretto e restituisce un vertex cover di costo minimo. Un vertex cover è un sottoinsieme $V^\prime \subseteq V$ tale che $\forall (u, v) \in E : u \in V^\prime \vee v \in V^\prime$. Ciò che rende Vertex Cover NP-hard è l'ipotesi di ottimalità imposta sul costo di $V^\prime$, in particolare:

$$\begin{aligned}
                    cost(OPT) = \min{|V^\prime|}
\end{aligned}$$

![[assets/vertex_covers.png|500]]

###### Self-reduction del Vertex Cover

> **AA 2025/26 — facoltativo.** Le dispense correnti presentano questa self-reduction come approfondimento facoltativo.

La versione decisionale del problema, indicata con $VCD$, riceve un grafo $G=(V,E)$ e un intero $k$ e domanda se esista un vertex cover di cardinalità al più $k$. Essa è NP-completa. Se disponessimo di un algoritmo per la versione di ottimizzazione $VC_{opt}$, basterebbe invocarlo una volta e confrontare la cardinalità della soluzione con $k$; dunque

$$VCD\leq_T^p VC_{opt},$$

e questo prova che $VC_{opt}$ è NP-hard.

Per Vertex Cover vale anche la riduzione nell'altra direzione: usando un oracolo decisionale $A(G,k)$ possiamo determinare sia la cardinalità sia i vertici di una soluzione ottima. Questa trasformazione è una riduzione di Turing in tempo polinomiale, perché effettua più chiamate adattive all'oracolo.

**Fase 1 — cardinalità ottima.** La proprietà interrogata è monotona: se $G$ ha un vertex cover di cardinalità al più $k$, allora ne ha uno di cardinalità al più $k'$ per ogni $k'\geq k$. Una ricerca binaria nell'intervallo $[0,|V|]$ trova quindi il minimo $k^*$ tale che $A(G,k^*)=\mathrm{YES}$ usando $O(\log |V|)$ chiamate.

**Fase 2 — ricostruzione.** Manteniamo un grafo corrente $G_c$, il budget residuo $k$ e un insieme $U$ di vertici non ancora esaminati. Per ogni vertice $v$ proviamo temporaneamente a rimuoverlo:

**Algorithm 5 Self-reduction del Vertex Cover** ^algorithm-5

> 1. **function** SelfReductionVC($G$)<br>
> 2.  $k \gets BinarySearchMinimum(\lambda j.\ A(G,j), 0, |V|)$<br>
> 3.  $C \gets \emptyset$; $G_c \gets G$; $U \gets V$<br>
> 4.  **while** $E(G_c)\neq\emptyset$ **do**<br>
> 5.   scegli $v\in U$; $U\gets U\setminus\{v\}$<br>
> 6.   $G'\gets G_c-v$<br>
> 7.   **if** $A(G',k-1)=\mathrm{YES}$ **then**<br>
> 8.    $C\gets C\cup\{v\}$; $G_c\gets G'$; $k\gets k-1$<br>
> 9.   **end if**<br>
> 10.  **end while**<br>
> 11.  **return** $C$<br>
> 12. **end function**

Se la risposta alla riga 7 è `YES`, esiste una copertura del grafo corrente che contiene $v$: si sceglie $v$ e restano da selezionare al più $k-1$ vertici in $G_c-v$. Se la risposta è `NO`, nessuna copertura ottima compatibile con le scelte già fatte contiene $v$; il vertice viene soltanto marcato come esaminato e **non** si modifica $G_c$. Questo ultimo dettaglio è essenziale: eliminare definitivamente anche nel caso `NO` potrebbe far dimenticare archi che la soluzione deve ancora coprire.

L'invariante è che il grafo corrente possiede un vertex cover di cardinalità al più al budget residuo $k$. Quando non restano archi, $C$ copre tutti gli archi eliminati dalle scelte effettuate. La ricostruzione usa al più $|V|$ chiamate all'oracolo; insieme alla ricerca binaria, il totale è $O(|V|+\log |V|)$, quindi polinomiale.

###### Approccio greedy al Vertex Cover Problem

Per questo tipo di problema, una possibile soluzione consiste in un insieme di vertici.
Un'idea per affrontare il Vertex Cover Problem potrebbe essere quella di coprire il grafo partendo da un nodo $v$ e percolandovi attraverso, però la scelta casuale del nodo di partenza $v$ potrebbe pregiudicare la bontà della soluzione. Un interessante esempio è quello di un grafo a stella: la copertura ottimale è rappresentata dal solo nodo centrale, ma iniziare la copertura da uno dei nodi ad esso adiacenti basta di per sé a rovinare l'ottimalità.
Nemmeno partire dai nodi con un numero più alto di archi incidenti è una buona strategia.
L'algoritmo greedy proposto per il Vertex Cover Problem è detto "Approx-Vertex-Problem". Di seguito è riportato lo pseudo-codice:

**Algorithm 6 Algoritmo greedy per Vertex Cover** ^algorithm-6

> 1. **function** Approx-Vertex-Cover($G$)
> 2.  $C \gets \emptyset$
> 3.  **while** $E \neq \emptyset$ **do**
> 4.   $(u, v) \gets getRandomEdge(E)$
> 5.   $C \gets C \cup \{u, v\}$
> 6.   $E \gets E \setminus incidentEdges(\{u, v\})$
> 7.  **end while**
> 8.  **return** $C$<br>
> 9. **end function**

Quello che si fa nella pratica è espandere la copertura partendo da archi casuali di $G$. L'algoritmo è greedy perché ad ogni passo va ad aggiungere un pezzo alla soluzione, che è sempre ammissibile perché vengono via via considerati tutti gli archi fino all'esaurimento di $E$.
Andiamo a vedere ora qual'è l'efficienza di questo approccio. Sia $E^\prime \subseteq E$ l'insieme degli archi selezionati durante l'esecuzione dell'algoritmo. La relazione tra $|E^\prime|$ e $|C|$ è:

$$\begin{aligned}
                    2 \cdot |E^\prime| = |C|
\end{aligned}$$

perché per ogni arco in $E^\prime$ andiamo ad aggiungere 2 nodi a $C$.
Inoltre, gli archi in $E^\prime$ sono tutti disgiunti, cioè formano un matching. Per questo motivo la soluzione ottima deve comprendere almeno un vertice per ogni arco di $E^\prime$. Possiamo quindi dire che:

$$\begin{aligned}
                    |E^\prime| \leq |OPT|
\end{aligned}$$

Infine, unendo le disuguaglianze, abbiamo che:

$$\begin{aligned}
                    |C| = 2 \cdot |E^\prime| \leq 2 \cdot |OPT| \iff \frac{|C|}{|OPT|} \leq 2
\end{aligned}$$

Dimostriamo la tightness di quest'analisi. Il nostro riferimento sono i grafi bipartiti bilanciati, ovvero grafi bipartiti nei quali la cardinalità dei due insiemi è la stessa. I nodi di ciascun insieme sono inoltre collegati a tutti quelli dell'altro (come un fully connected layer in una ANN).
Il vertex cover ottimo è un insieme di nodi che contiene tutti quelli di uno dei due sottoinsiemi di $V$, ed ha naturalmente un costo di $\frac{n}{2}$. La soluzione peggiore possibile è quella per cui ogni iterazione dell'algoritmo scelga l'arco che collega due nodi tra loro "frontali". In questo caso il costo associato è esattamente uguale ad $n$.

![[assets/Screenshot 2024-10-08 111957.png|800]]

###### Approccio ILP al Vertex Cover Problem

Come prima cosa, tentiamo di riscrivere il vertex cover problem come un problema di programmazione lineare intera (ILP). Creiamo le variabili intere $X_v$ che definiscono se includiamo il vertice $v \in V$ nella soluzione approssimata o meno.

$$\begin{aligned}
                    \forall v \in V: X_v = \begin{cases}
                        1 & \text{se } v \in C \\
                        0 & \text{altrimenti}
                    \end{cases}
\end{aligned}$$

Il vincolo è quello di avere un vertex cover, ma vogliamo anche che il numero di variabili $X_v$ sia il minore possibile per soddisfare l'ipotesi di ottimalità.

$$\begin{aligned}
                    \min &\sum_{v \in V} X_v\\
                    s.t. &X_v \in \{0, 1\}, \forall v \in V\\
                    &X_v + X_u \geq 1, \forall (u, v) \in E
\end{aligned}$$

Risolvere un problema di ILP diventa però NP-hard nel momento in cui introduciamo il vincolo delle variabili intere.
Per mettere una pezza, si può usare un approccio greedy e cercare di ottenere una soluzione approssimata. Riformuliamo il problema, rilassando il vincolo di interezza sulle variaibli $X_v$. Il nuovo problema è semplicemente di programmazione lineare (LP).

$$\begin{aligned}
                    \min &\sum_{v \in V} X_v\\
                    s.t. &X_v \in [0, 1], \forall v \in V\\
                    &X_v + X_u \geq 1, \forall (u, v) \in E
\end{aligned}$$

Ora non abbiamo garanzia che, per volta risolto il problema, gli $X_v$ siano interi. Più probabilmente avranno valori compresi tra 0 ed 1, che non si associano intuitivamente alla soluzione di vertex cover. Per ricondurci a quest'ultima mettiamo in atto un "rounding".

$$\begin{aligned}
                    X_v = \begin{cases}
                        1 & \text{se } X^*_v \geq \frac{1}{2}\\
                        0 & \text{se } X^*_v < \frac{1}{2}
                    \end{cases}
\end{aligned}$$

**Algorithm 7 Relax & Round per Vertex Cover** ^algorithm-7

> 1. **function** RelaxAndRoundVC($G$)<br>
> 2.  $X^*\gets solveFractionalVertexCoverLP(G)$<br>
> 3.  $C\gets\{v\in V:X_v^*\geq\frac{1}{2}\}$<br>
> 4.  **return** $C$<br>
> 5. **end function**

Se il segno di uguaglianza riguardasse il caso di non appartenenza, vi sarebbe la possibilità che non scegliere alcun nodo in $(u, v)$ nel caso particolare in cui $X_u = X_v = \frac{1}{2}$, soddisfi il vincolo $X_v + X_u \geq 1$, contraddicendo il suo stesso scopo. Ora andiamo ad ottenere il valore dell'errore di approssimazione $\alpha$ associato a questo metodo. L'insieme di tutte le soluzioni possibili per il problema di LP sono tutte le possibili combinazioni di valori in $[0, 1]$ degli $X_v$, delle quali le soluzioni possibili per il problema di PLI sono un sottoinsieme. Questo significa che risolvere il problema di ILP fornisce automaticamente una soluzione ammissibile di quello di LP. La soluzione di ILP è più formalmente un sottoinsieme proprio di quella di LP.
Nei due insiemi possono esistere due ottimi diversi, contestualmente al problema di riferimento. Non necessariamente questi coincidono, e lo fanno solo quando la soluzione di LP è intera. La soluzione di LP inoltre è quella con il costo minore (o uguale), peraltro questo fatto è deducibile dalla rappresentazione insiemistica appena data.

$$\begin{aligned}
                    OPT_{LP} \leq OPT_{ILP}
\end{aligned}$$

Osserviamo che per ogni nodo $v \in V$, la variabile arrotondata $X_v$ è al massimo il doppio del corrispondente valore $X_v^*$ nella soluzione ottima del rilassamento LP.

$$\begin{aligned}
                    X_v \leq 2 \cdot X_v^*
\end{aligned}$$

Ad esempio: $X_v = 1 \Rightarrow X_v^* \geq \frac{1}{2} \Rightarrow 2 \cdot X_v^* \geq 1$, che verifica la disuguaglianza sopra.
Sapendo che, per costruzione della funzione obiettivo, il costo dell'approssimazione è dato dalla somma degli $X_v$, possiamo unire il tutto e trovare:

$$\begin{aligned}
                    Approx = \sum_{v \in V} X_v \leq 2 \cdot \sum_{v \in V} X_v^* = 2 \cdot OPT_{LP} \leq 2 \cdot OPT_{ILP} \Rightarrow \frac{Approx}{OPT_{ILP}} \leq 2
\end{aligned}$$

Vediamo ora se l'analisi è tight. Prendiamo questa volta i grafi che sono cicli formati da un numero pari di nodi. Il vertex cover ottimale si ottiene prendendo un nodo sì ed uno no lungo la catena. L'ottimo di LP può assegnare $X_v = \frac{1}{2}, \forall v \in V$, percui quando si va a fare il rounding vengono scelti tutti i nodi.

![[assets/vertexcoverILP.png|500]]

> **Programma AA 2025/26.** La variante pesata del Vertex Cover è indicata dalle dispense ufficiali come non materiale d'esame. L'estensione pesata di Relax & Round è quindi un approfondimento e non viene inclusa in questa trattazione principale.

## 3 Algoritmi distribuiti

### 3.1 Teoria della computazione distribuita

###### Ambienti distribuiti

Un ambiente distribuito comprende più agenti (oppure nodi, entità, ecc\...), ognuno dei quali ha una capacità computazionale propria. Tutti questi agenti lavorano per assolvere a qualche tipo di compito, coordinandosi tra loro tramite uno scambio di messaggi ed eseguendo una computazione locale. Nel modello message-passing adottato dal corso non vi è memoria condivisa; non si tratta però di una proprietà universale di ogni possibile sistema distribuito.
Per risolvere problemi in questo contesto, dobbiamo andare a definire un algoritmo che specifichi cosa ciascun agente debba fare, prevedendo in questo modo anche il loro comportamento collettivo. I principi di correttezza ed efficienza di un algoritmo valgono anche in questo caso.
Mentre è facile trovare le differenze tra un sistema distribuito ed uno semplice, può risultare più complicato a prima vista trovarle con un sistema parallelo.

![[assets/Screenshot 2024-10-08 121302.png|400]]

###### Il modello

Per astrarre un sistema distribuito possiamo usare i grafi. I nodi rappresentano gli agenti e gli archi i canali di comunicazione tra di loro.

###### Entità

Ogni entità riceve in input una parte del problema e deve produrre un output compatibile a quello definito dall'algoritmo risolutivo, che in questo contesto si può dire anche "protocollo". Nel modello simmetrico del corso tutte le entità eseguono lo stesso codice; eventuali ruoli diversi dipendono dallo stato iniziale o dagli input locali.
Ad ogni entità è associato uno stato. Per ogni protocollo sono definiti un numero finito di stati che possono venire associati alle entità che lo eseguono. Mentre un'entità si trova in uno stato, possono essere innescati degli eventi, come la ricezione di messaggi, il clock interno od impulsi spontanei (come ad esempio quando un utente interagisce con un ATM che si trova in uno stato "idle", e questo reagisce di conseguenza). Questi eventi fanno sì che, a seconda dello stato in cui si trova, l'entità reagisca facendo qualcosa e spostandosi eventualmente verso un altro stato.
Un'azione è un insieme atomico di attività che seguono il protocollo, messo in atto dalle entità in relazione ad eventi. Queste attività possono essere ad esempio calcolo, invio di messaggi, cambio di stato, set/reset del clock, ecc\...
Le azioni che un'entità compie dipendono solo dallo stato in cui si trova e dall'evento che la interessa. Occorre definire in modo deterministico ogni possibile interazione stato/azione, anche qualora non vi sia nulla da fare.
Quando il protocollo è lo stesso per tutti gli agenti, diciamo che il sistema distribuito è simmetrico. Una differenza del comportamento di diverse entità come quella dell'esempio che segue può dipendere soltanto dal loro stato o input, pur eseguendo lo stesso codice.

![[assets/Screenshot 2024-10-08 122127.png|500]]

###### Comunicazione

Siccome i canali di comunicazione monodirezionali sono ormai poco usati (oggigiorno rimane utilizzata praticamente solo la radiotrasmissione), distinguiamo tra vicini in ingresso e vicini in uscita per la comunicazione dei nodi all'interno di un sistema distribuito.

###### Assiomi

Nel seguito questi principi verranno sempre considerati come validi per assicurarci il corretto funzionamento degli algoritmi.

- Il numero di bit che costituiscono un messaggio tra nodi è finito

- Il tempo necessario alla comunicazione tra nodi è finito, cioè un messaggio prima o poi arriva a destinazione

- Ogni nodo è in grado di distinguere tra i propri vicini in uscita ed in ingresso

###### Restrizioni

Imporre restrizioni limita l'applicazione del protocollo. Possiamo trovare restrizioni a livello di:

- Comunicazione: possiamo ad esempio imporre un invio di tipo FIFO (cioè nello stesso ordine di invio) od una precisa direzionalità dei collegamenti all'interno del modello

- Affidabilità: possiamo chiedere che il sistema sia in grado di accorgersi di eventuali fallimenti su collegamenti od entità (fault detection). Questa può sembrare una restrizione semplice, ma nella realtà non lo è per niente.
  Si possono anche imporre restrizioni sui tipi di fallimenti che possono accadere: consegna garantita dei messaggi, affidabilità parziale/totale, ecc\... Nella terminologia delle slide, affidabilità parziale significa che da ora in poi non avverranno guasti, anche se possono essercene stati in precedenza; affidabilità totale significa che non sono avvenuti guasti e non ne avverranno

- Connettività: possiamo richiedere che il grafo $G$ che rappresenta il modello sia fortemente connesso

- Conoscenza: possiamo imporre un certo numero di nodi, archi, diametro del grafo $G$, ecc\...

- Tempo: nel caso di "bounded communication delay" ad esempio si richiede che esista una costante $\Delta$ tale che, in assenza di guasti, il ritardo di comunicazione tra nodi sia al più $\Delta$. Richieste più forti sono "unitary communication delay" e "synchronized clocks"

###### Misure di efficienza per gli algoritmi distribuiti

Per gli algoritmi sequenziali andavamo a misurare complessità spaziale e temporale. Nel caso di algoritmi e sistemi distribuiti lo spazio perde la propria importanza, mentre emerge l'esigenza di conoscere la quantità di comunicazione prodotta dal protocollo. Questa è tendenzialmente molto più onerosa del calcolo locale fatto dai singoli nodi. Inoltre, spesso i nodi nei sistemi distribuiti risiedono in piccoli dispositivi, motivo per cui la comunicazione attiva costituisce una spesa non trascurabile di risorse. In generale non sappiamo quanto duri una comunicazione, perché i ritardi sono imprevedibili. Quello che si fa è costruire una misura temporale sulla base del numero massimo di messaggi che possono essere inviati in sequenza. All'invio di un messaggio facciamo corrispondere per convenzione un'unità di tempo.
Per quanto riguarda lo spazio, un messaggio sufficientemente breve può essere inviato tutto in una sola volta, mentre quando si supera una certa soglia l'invio deve essere spezzato in più tranches.
Il tempo è invece definito dal lasso che intercorre tra l'avvio della prima entità e la terminazione dell'ultima.
Distinguiamo tra sincronia totale ed asincronia a seconda che i clocks di tutti i nodi siano o meno sincronizzati tra loro.

###### Esempio di costruzione e valutazione di un algoritmo distribuito

In questo esempio ci troviamo a definire un algoritmo per il "flooding", ovvero un broadcasting che parte da un nodo sorgente e viene propagato dai propri vicini, e così via, fino a raggiungere l'intero sistema.

![[assets/Screenshot 2024-10-09 090924.png|400]]

La prima idea è quella di realizzare un broadcasting. Definiamo due stati per i ruoli di "initiator" e "sleeping". Un evento esterno attiva l'initiator, che manda il messaggio ai suoi vicini. Questi inoltrano il messaggio ai propri vicini.

![[assets/Screenshot 2024-10-09 091305.png|600]]

Il problema di questa specifica è che non abbiamo fissato una condizione di arresto per il protocollo.

![[assets/Screenshot 2024-10-09 091410.png|400]]

Ha perfettamente senso, come nell'immagine, supporre che un nodo $z$ riceva il messaggio prima di un altro nodo $y$ adiacente a quello di partenza, per l'imprevedibilità dei ritardi.
Aggiungiamo un nuovo stato per i nodi: $DONE$, che viene raggiunto una volta che essi hanno effettuato l'invio/reinvio, a seconda della loro natura.

![[assets/Screenshot 2024-10-09 091450.png|500]]

Una nuova miglioria che possiamo introdurre è il controllo dei destinatari, così da non andare a creare un traffico eccessivo.

![[assets/Screenshot 2024-10-09 091659.png|400]]

Tutti i nodi che non sono l'initiator fanno ora il reinvio verso tutti i propri vicini, meno quello dal quale hanno ricevuto il messaggio.
L'ultima specifica è quella nell'immagine:

![[assets/Screenshot 2024-10-09 091924.png|600]]

In un sistema sincrono la dinamica è prevedibile: l'invio dei messaggi si propaga "a macchia d'olio" nel sistema, viaggiando verso i vicini dell'initiator, poi ai vicini dei vicini, ecc\... Nel caso di sistema asincrono l'esecuzione del protocollo non è deterministica, per cui possono generarsi una moltitudine di dinamiche diverse a tempo di esecuzione.
Dall'algoritmo che abbiamo definito notiamo che, in primo luogo, non esiste un meccanismo di terminazione della computazione a livello globale. Ciascuna entità non è in grado di dire se le altre abbiano terminato l'esecuzione. La concezione di terminazione è quindi solo locale.
Per formalizzare correttamente un algoritmo distribuito è necessario dimostrare che esso prima o poi concluda globalmente, e che sia esatto (cioè assolva sempre al proprio scopo). Nel nostro esempio:

- L'algoritmo è corretto, perché ogni entità viene raggiunta dal messaggio e, qualora non lo fosse, dovrebbe per forza essere dovuto ad un guasto di rete

- L'algoritmo conclude sempre perché ad ogni reinvio i nodi passano allo stato $DONE$

Passiamo ora a misurare i costi:

- Messaggi inviati: possiamo dire in via generale che nel caso peggiore, in termini di topologia di $G$ e dinamica di esecuzione, passano 2 messaggi per ogni collegamento. Perciò il numero totale di messaggi è $2 \cdot m \in O(m)$. Più precisamente:

  $$\begin{aligned}
                          |N(s)| + \sum_{x \neq s} N(x) - 1 = \sum_{x} |N(x)| - \sum_{x \neq s} 1 = 2 \cdot m - (n - 1)
  \end{aligned}$$

  In particolare, sommiamo tutti i vicini dell'initiator e, per ogni altro nodo, tutti i loro vicini meno quello dal quale ricevono il messaggio. Per il lemma della stretta di mano, $\sum_x |N(x)|=2m$: è la somma dei gradi, nella quale ogni arco non diretto viene contato due volte

- Tempo di esecuzione: nel modello ideale sincrono, con una trasmissione per unità di tempo, un'esecuzione con iniziatore $s$ termina dopo la sua eccentricità $r(s)=\max_y d(s,y)$. Nel caso peggiore rispetto alla scelta dell'iniziatore, $\max_s r(s)=D(G)\leq n-1$.
  Nel modello asincrono il tempo fisico non è limitato senza un bound sui ritardi. Se si usa invece il **causal time**, cioè la lunghezza della catena causale di messaggi, la prima ricezione può seguire un cammino semplice non minimo: il bound superiore generale è $n-1$, che può essere maggiore di $D(G)$.

Possiamo ora stabilire se sia possibile ridurre il numero di messaggi inviati od il tempo ideale, ma per farlo è necessario trovare il lower bound del problema.

- Tempo di esecuzione: nel modello ideale e nel caso peggiore rispetto alla scelta dell'iniziatore, qualunque algoritmo deve raggiungere una coppia di nodi a distanza $D(G)$. Flooding raggiunge quindi il lower bound $D(G)$ ed è ottimale in ideal time. Questa conclusione non identifica $D(G)$ con il causal time di ogni esecuzione asincrona

- Messaggi inviati: il bound immediato è $n-1\in\Omega(n)$, perché ogni nodo diverso dall'iniziatore deve ricevere almeno un messaggio. Le slide dimostrano inoltre un lower bound worst-case $\Omega(m)$ per protocolli uniformi sulle topologie arbitrarie sotto le restrizioni standard, senza conoscenza globale sufficiente a evitare a priori determinati archi. Il bound non afferma che su ogni topologia nota servano $m$ messaggi: sul grafo completo conosciuto, per esempio, il simple broadcast ne usa soltanto $n-1$.
  Asintoticamente il costo di flooding raggiunge il lower bound, però si può tentare di chiudere un gap di fattore 2:

  - Nel caso in cui $G$ fosse un albero, avremmo che $m = n - 1$. Con questa specifica topologia possiamo toccare esattamente il lower bound. In questo modo abbiamo dimostrato che il lower bound non può essere alzato.

  - Con un grafo completo abbiamo $m = \frac{n(n-1)}{2}$. Flooding invia esattamente $2m-n+1=(n-1)^2$ messaggi, cioè $\Theta(n^2)$. Se almeno l'iniziatore sa che tutti gli altri nodi sono suoi vicini, basta invece un simple broadcast: $n-1$ messaggi e ideal time 1, pari al diametro

  - Per tutti quei grafi che non sono né alberi né grafi completi, tutto dipende dal valore di $m$: se il grafo è sparso ci si avvicina al lower bound, viceversa si inviano molti messaggi inutili

  Siccome abbiamo visto che flooding lavora bene su alberi, possiamo pensare di creare uno spanning tree (qualsiasi costo implichi) e di usarlo nel seguito per applicarvi flooding

###### Il wake-up problem

Il wake-up è un momento in cui la rete si mette in attività: uno o più agenti si svegliano spontaneamente e devono risvegliare anche gli altri, che si trovano in uno stato "idle". Il broadcast è quindi una sorta di wake-up con un solo initiator. Per risolvere wake-up si può cercare di usare la soluzione che abbiamo appena proposto per flooding.

![[assets/Screenshot 2024-10-11 160525.png|450]]

- Messaggi inviati:

  - Nel caso in cui ci sia un solo initiator, il problema coincide con flooding, quindi vengono inviati $2m-n+1$ messaggi

  - Nel caso migliore, cioè quello in cui tutti siano initiator, viaggiano 2 messaggi su ogni arco, quindi $2 \cdot m$

  - Nel caso in cui ci siano $k$ initiators, applicando nuovamente la formula dei messaggi vista per flooding, troviamo: $2 \cdot m - (n - k)$

- Per quanto riguarda il tempo, dobbiamo considerare ancora la condizione peggiore in termini di initiators e topologia. Troviamo $O(D(G))$ come per flooding

###### Spanning tree

Nel seguito ci riferiamo ad un generico spanning tree $T$ costruito su $G = (V, E)$. $T$ è un sottografo aciclico di $G$ tale che $T = (V, E^\prime)$ tale che $E^\prime \subseteq E$.
Le restrizioni che supponiamo sono:

- Iniziatiore singolo

- $G$ non diretto

- Affidabilità completa nell'invio dei messaggi

- $G$ connesso

###### Protocollo Shout

Dal punto di vista dei nodi, trovare lo spanning tree vuol dire arrivare ad un punto in cui si possa distinguere tra due tipi di vicini: quelli appartenenti e quelli non appartenenti allo spanning tree. Mettendo assieme tutte le singole conoscenze dei nodi, troviamo lo spanning tree $T$ su $G$.
L'idea di questo protocollo non è molto diversa dal flooding. L'initiator chiede ai propri vicini se intendono far parte dello spanning tree e si mette in attesa di risposte. Una volta ricevuta la richiesta dell'initiator, i suoi vicini, se non l'hanno già ricevuta rispondono "sì", oppure "no" altrimenti, poi procedono all'inoltro. La stessa dinamica si ripete per i vicini dei vicini, ecc\... Una volta ricevute tutte le risposte, gli archi associati a una risposta $YES$ appartengono allo spanning tree; quelli associati a $NO$ non vi appartengono.

![[assets/Screenshot 2024-10-11 161549.png|600]]

![[assets/Screenshot 2024-10-11 161643.png|1100]]

- Shout è corretto: il vicinato nello spanning tree è simmetrico ed implica una catena di collegamenti verso l'initiator. Siccome ogni nodo invia un solo sì a chi lo invita nel proprio vicinato, lo spanning tree definito dalle relazioni di vicinato contiene tutti i nodi

- Nel momento in cui un nodo diventa $DONE$ non ci sono più regole, dunque la computazione è completa, almeno localmente. Non esiste peraltro alcun nodo che secondo questo protocollo possa sapere se la computazione globale sia completa o meno

Ora vediamo i costi di Shout. Se ci pensiamo, Shout è in buona parte una replica dell'algoritmo di flooding, con l'aggiunta di un messaggio di risposta. Ci aspettiamo di avere dei costi analoghi a quel caso.

- Messaggi inviati: su ogni collegamento possono viaggiare 3 diversi tipi di messaggi: $Q, YES, NO$. Però solo alcune combinazioni di questi sono possibili su di un singolo link.

  ![[assets/Screenshot 2024-10-15 091649.png|500]]

  Le situazioni impossibili non sono proprio previste dal protocollo, mentre le altre sono ammesse in condizioni di comunicazione non ideale.
  Contiamo ora quanti messaggi di ogni tipo attraversano $G$.

  ![[assets/Screenshot 2024-10-15 092404.png|500]]

  Vengono essenzialmente inviati $(n - 1)$ messggi di tipo $Q$ sui collegamenti tra i nodi dello spanning tree. I rimanenti messaggi $Q$ sono 2 per ogni altro collegamento su $G$. I messaggi $YES$ sono lo stesso numero dei messaggi $Q$ tra nodi dello spanning tree. I messaggi $NO$ sono 1 per ogni messaggio $Q$ inviato ad un nodo che non risponde con $YES$, dunque lo stesso numero dei messaggi $Q$ sui collegamenti che non definiscono lo spanning tree.
  Se andiamo a sommare il numero di messaggi nel caso peggiore, troviamo:

  $$\begin{aligned}
                          countMessages(Shout) &= 2 \cdot m - n + 1 + 2 \cdot [m - (n - 1)] + (n - 1)\\
                          &= 4 \cdot m - 2 \cdot n + 2 = 2 \cdot (2 \cdot m - n + 1)\\
                          &= 2 \cdot countMessages(Flooding)
  \end{aligned}$$

  Ora possiamo chiederci se sia possibile ridurre il numero di messaggi. Ovvero: esistono messaggi ridondanti per l'attuale specifica dell'algoritmo? In realtà i $NO$ lo sono. Quando transitano due $Q$ in un arco, finiranno per transitare due $NO$, dunque l'arco non comparirà nello spanning tree. Si può quindi definire una nuova specifica per Shout, che chiamiamo Shout+.

  ![[assets/Screenshot 2024-10-15 114636.png|400]]

  In pratica, ricevere un messaggio $Q$ in stato $ACTIVE$ è considerato come ricevere un $NO$. Le due casistiche vengono accorpate.
  Abbiamo ora solo due possibili coppie di messaggi ($Q-YES, Q-Q$) e perdipiù è stata rimossa quella con il costo maggiore. Il costo di Shout+ è: $countMessages(Shout+) = 2 \cdot m$.

Cosa accade a Shout se introduciamo più iniziatori? Due nodi appartenenti ad altrettanti diversi spanning tree parziali non possono dare origine alla loro fusione, perché finiranno per rispondere $NO$ reciprocamente (appartenendo entrambi ad uno spanning tree, una volta ricevuta la domanda risponderanno per forza $NO$). L'esecuzione terminerà dunque con più spanning trees (uno per ogni iniziatore) parziali e tra loro disconnessi, ovvero una foresta. Shout non funziona nel caso di più iniziatori, occorre trovare un'alternativa.

###### Costruzione dello spanning tree tramite traversal

L'albero di copertura generato da Shout è, sotto condizioni ideali, esattamente lo stesso che viene costruito da una BFS. Un'idea diversa per la costruzione dello spanning tree è simulare una DFS, anche se questo implica una sequenzialità nell'esecuzione. Nei sistemi distribuiti, quando si vogliono indurre queste dinamiche, ci si serve di particolari messaggi detti "token". Le restrizioni imposte sono ancora una volta: initiator singolo, collegamenti non-diretti, grafo connesso ed affidabilità totale.
Abbiamo 3 tipi di token diversi:

- Forward: un nodo lo invia ad un vicino non ancora visitato e si mette in attesa del suo ritorno

- Return: ritorna da un vicino al quale si è chiesto di proseguire la visita. Una volta raccolto, si può delegare un altro vicino non ancora visitato perché sia esso a proseguire la visita. Se non ci sono più vicini da visitare, si restituisce un return token a chi ci aveva chiesto a sua volta di proseguire la visita

- Back-edge: quando arriva un forward token ad un nodo visitato, questo deve restituire un back-edge token per segnalare che non è possibile proseguire la visita di lì.
  Quando un nodo invia un forward token ad un vicino che è già nello spanning tree, ma senza che il primo lo sappia, si ripete la stessa dinamica ma a parti inverse

![[assets/Screenshot 2024-10-15 120009.png|600]]

Una volta completata la visita, la radice dello spanning tree è l'initiator e le rimanenti entità si discriminano in base ai token ricevuti.

- Il nodo genitore di un nodo $x$ è quel nodo dal quale $x$ ha ricevuto per primo il forward token e restituito il return token una volta terminata la propria parte

- I nodi figli di un nodo $x$ sono i vicini diversi dal parent che hanno ricevuto per la prima volta il forward token da $x$ e hanno poi restituito il return token. Equivalentemente, sono i vicini collegati a $x$ da archi dell'albero, escluso il parent

Ora valutiamo i costi dell'algoritmo, che chiameremo $DFT$:

- Numero di messaggi: dobbiamo vedere, come per Shout, quali messaggi possono viaggiare sui vari collegamenti. Le uniche combinazioni possibili sono forward/return e forward/back-edge.

  ![[assets/Screenshot 2024-10-15 121028.png|450]]

  Per ogni collegamento passano esattamente 2 messaggi, dunque il costo complessivo è: $countMessages(DFT) = 2 \cdot m = countMessages(Shout+)$.
  Possiamo ora chiederci se anche in questo caso sia possibile ridurre il numero di messaggi. La risposta è no: tutti i messaggi inviati dall'algoritmo sono necessari ed eliminarne qualcuno altererebbe la sua esattezza. Il costo dell'algoritmo è asintoticamente ottimo

- Tempo di esecuzione: siccome l'esplorazione è totalmente sequenziale, i $2 \cdot m$ messaggi della catena più lunga possibile (caso peggiore) sono anche il numero di istanti massimo che l'algoritmo impiega a terminare

È possibile migliorare le prestazioni di $DFT$? Sì, però non lo si può fare senza introdurre un minimo di parallelismo. Idealmente si potrebbe pensare di parallelizzare la visita dei back edge; il problema è che il livello di conoscenza locale dei nodi ci impedisce di sapere quando effettivamente si tratti di back edge.
Un nodo che inizia la visita potrebbe inviare un broadcast ai propri vicini per segnalarlo, in modo da non essere contattato in futuro e dover così restituire il back edge token.

![[assets/Screenshot 2024-10-15 121746.png|750]]

Il messaggio di ack viene sempre atteso, perché non si hanno garanzie sui tempi di invio dei messaggi.

![[assets/Screenshot 2024-10-15 121941.png|600]]

Ogni volta che viene scoperto un nuovo nodo, si manda il broadcast a tutti i vicini meno quello da cui si è ricevuto il token forward e si attende l'acknowledgement. Questo invio si frappone nella catena di messaggi $Forward$ e $Return$.

- Tempo di esecuzione: tutti i messaggi della catena $Forward$/$Return$ passano per gli archi dello spanning tree, percui sono $2 \cdot (n - 1)$ in totale. I messaggi $Visited$/$Ack$ sono una catena di 2 per ogni invio, dunque $2 \cdot n$ in totale.
  Considerando entrambe le catene, abbiamo un costo complessivo di $4 \cdot n - 2 \in O(n)$ istanti

- Messaggi inviati: per ogni collegamento dello spanning tree ($n - 1$ in totale) vengono inviati 2 messaggi contenenti token forward e return, rispettivamente. I messaggi $Visited$/$Ack$ sono 2 per ogni collegamento dello spanning tree e 4 per ogni collegamento non nello spanning tree. Abbiamo:

  $$\begin{aligned}
                          countMessages(DFT_{new}) &\leq 2 \cdot (n - 1) + 2 \cdot (n - 1) + 4 \cdot (m - (n - 1))\\
                          &= 4 \cdot m = 2 \cdot countMessages(DFT)
  \end{aligned}$$

  Non è possibile scendere sotto l'ordine di grandezza di $m$ per questo algoritmo.

Shout e DFT sono due tecniche costruttive differenti. Usando Shout è impossibile predire la forma dell'albero costruito dall'algoritmo. D'altra parte DFT tende a costruire alberi con un diametro molto grande ed idealmente vorremmo che il diametro fosse più piccolo possibile. Si pensi come esempio alla possibilità di applicare un broadcasting sullo spanning tree in un secondo momento.
Alla problematica del diametro di $G$ si può cercare di ovviare. Per esempio, si può cercare di determinare prima il centro di $G$ e poi applicare Shout usandolo come punto di partenza. Entrambi questi procedimento sono costosi.
Anche $DFT$ non può generare spanning tree partendo da più initiators. Serve cambiare completamente approccio.

![[assets/Screenshot 2024-10-16 092040.png|600]]

###### Spanning tree con iniziatori multipli

Tipicamente un nodo non conosce se vi sono altri iniziatori in $G$. Si può tentare di proporre un nuovo protocollo per affrontare i problemi. Alcune possibili soluzioni, supponendo che ai nodi siano associati degli identificatori univoci, sono:

- Multiple spanning tree: lanciare un algoritmo per la ricerca dello spanning tree da diversi iniziatori, usando i loro identificatori per discriminare tra le strutture. Il numero di messaggi cresce con il numero di iniziatori. Tipicamente questo metodo è costoso

- Costruzione selettiva: come sopra, ma aggiunge una dinamica relativa agli id per realizzare un solo spanning tree. Ogni nodo che riceve messaggi di più iniziatori confronta gli identificatori. Il nodo continua a lavorare solo per l'iniziatore con l'identificatore più basso, ignorando gli altri. Col passare del tempo, i nodi smettono di collaborare con gli spanning tree associati agli initiators con identificatori più alti.
  I rischi associati a questo approccio sono che i nodi potrebbero ri-eseguire il protocollo più volte. Inoltre, occorre in qualche modo notificare a tutto il sistema una volta che la costruzione del minimum spanning tree è stata terminata

L'alternativa alla generazione di nuovi protocolli è quella di tentare di stabilire un criterio per eleggere un unico iniziatore (detto "leader") tra i possibili candidati.

###### Computazione negli alberi

Negli alberi, le entità sono in qualche modo coscienti di appartenere ad una siffatta topologia di rete. Gli alberi possono essere rooted ed unrooted; nel primo caso la direzionalità degli archi ha un senso top-down.

![[assets/Screenshot 2024-10-16 093438.png|700]]

Le restrizioni più tipicamente applicate nel caso di alberi sono:

- Collegamenti bidirezionali

- Connettività

- Messaggi FIFO

- Affidabilità completa

- Conoscenza della topologia

###### Tecnica di saturazione

Tutti i nodi $x$ hanno un valore associato. Alla fine della computazione, ciascuno di essi deve conoscere se tale valore è il più basso o no.
Le foglie dell'albero avviano la computazione, mandando il proprio valore verso il proprio unico vicino, che può essere interno oppure, nel caso limite di un albero con due nodi, un'altra foglia. Un nodo attende che tutti i vicini tranne uno gli inviino il loro valore. Dopodiché calcola il minimo tra il proprio valore e quelli ricevuti e lo inoltra sul collegamento rimasto.
Ad un certo punto della computazione, da qualche parte nell'albero, due nodi adiacenti si scambieranno tra loro il valore minimo corrente ottenuto dalle due porzioni dell'albero.
La computazione procede propagando il minimo globale nuovamente verso la periferia dell'albero, così che alla fine tutti i nodi possano stabilire se il loro valore è corrisponde al minimo o no.

![[assets/Screenshot 2024-10-16 093901.png|1000]]

La saturazione può essere iniziata da un numero arbitrario di iniziatori, che attivano tutti i nodi e fanno partire l'algoritmo dalle foglie. L'algoritmo per risvegliare i nodi è Wake-up. Questa fase si dice "attivazione".
Le due fasi successive si dicono "saturazione" e "risoluzione". Nella prima viene inviato un peculiare messaggio detto "di saturazione". Quando i nodi ricevono i messaggi di saturazione provenienti dalla periferia, passano allo stato di "processing". Ogni nodo $x$ attende $|N(x)|-1$ messaggi di saturazione, poi calcola il minimo e lo inoltra sul collegamento mancante con un nuovo messaggio di saturazione.
È possibile dimostrare che, ad un certo punto della computazione, esattamente due nodi adiacenti si "saturano" scambiandosi il messaggio sul loro arco comune. Non è necessario che siano entrambi nodi interni: in un albero di due nodi sono entrambe foglie. Questi sono gli ultimi due nodi verso i quali fluiscono i messaggi di saturazione. Diverse esecuzioni possono portare a diverse coppie, ma la proprietà di adiacenza rimane valida.

![[assets/Screenshot 2024-10-16 094713.png|400]]

La resolution consiste dell'invio di una notifica da parte delle entità saturate, con inoltro, dall'interno verso l'esterno della struttura.
Vediamo i costi relativi alla saturazione:

- Messaggi inviati

  - Attivazione: se tutti gli $n$ nodi sono inizialmente iniziatori, Wake-up percorre ogni arco dell'albero in entrambe le direzioni, quindi usa $2(n-1)$ messaggi

  - Saturazione: $(n - 1) + 1 = n$ messaggi, dove i primi $n - 1$ coprono tutti gli archi dell'albero e quello tra i due nodi saturati è contato 2 volte

  - Risoluzione: $(n - 2)$ messaggi, perché quello tra i due nodi saturati non viene ripercorso

  ![[assets/Screenshot 2024-10-16 113456.png|700]]

  Il costo complessivo è di $4 \cdot n - 4$ messaggi, laddove il flooding sarebbe quadratico perché ogni nodo dovrebbe notificare a tutti gli altri il proprio valore.

La saturazione viene usata per risolvere problemi che richiedono di lavorare su formazioni conosciute localmente e che possono essere calcolate globalmente. Il minimo è solo un esempio di casi di questo genere.
Nel caso di un albero rooted, l'iniziatore naturale per diverse attività della rete è la radice. In questi casi tipicamente si fa partire un broadcasting dalla radice, le risposte vengono raccolte dal basso con la tecnica della saturazione e la radice attende i risultati dai propri vicini i risultati e dunque la fine della computazione.

### 3.2 Leader election in alberi

###### Introduzione

Data un'iniziale situazione di completa simmetria, in cui nessun nodo è leader né follower, andremo ad introdurre un protocollo che elegga un leader. Una volta completato il processo di elezione, il leader sarà uno solo e tutti gli altri nodi verranno considerati suoi followers. Ogni nodo avrà conoscenza relativa al proprio status.

![[assets/Screenshot 2024-10-25 111800.png|600]]

I risultati riguardo la leader election non sono particolarmente recenti. Il primo teorema che prendiamo in oggetto (risalente al 1980) afferma che, sotto ipotesi di collegamenti bidirezionali, grafo connesso e nessuna rottura (dunque, tutto sommato abbastanza favorevoli) non esiste un protocollo deterministico per la leader election a meno che non si abbiano identificativi univoci per le entità. L'identificativo unico è l'informazione che fa sì che si possa discriminare tra i nodi nel processo di elezione.

###### Leader election in alberi

Nel caso di alberi rooted il problema è particolarmente semplice: la radice si auto-elegge leader e tutti gli altri nodi follower. Non vengono scambiati messaggi nel processo di elezione e bastano $O(n)$ messaggi per la notifica.
Quando l'albero non è rooted il problema si può risolvere con l'algoritmo di saturazione: i nodi saturati decidono chi tra loro diventa il leader. Occorre però un elemento di confronto come l'identificativo unico su cui basarsi per prendere la decisione. Il numero di messaggi è naturalmente pari a $4 \cdot n - 4$. La dimensione dei messaggi è logaritmica rispetto al valore massimo dell'identificativo.

###### Leader election e spanning tree

Dato uno spanning tree rooted, la leader election può essere fatta nei modi visti al paragrafo sopra. Dato invece un grafo $G$, si può ricercare su di esso lo spanning tree usando il leader eletto come radice.

### 3.3 Leader election in anelli

###### Introduzione

In un anello abbiamo $n$ nodi e $m = n$ archi. Si tratta di una rete molto semplice, con l'unica complicazione di essere estremamente simmetrica (tutti i nodi vedono localmente la stessa cosa). Possiamo distinguere tra i due vicini di ciascun nodo supponendo vi sia una direzione dell'anello od un orientamento locale.

![[assets/Screenshot 2024-10-25 113100.png|400]]

Le reti ad anello furono effettivamente molto usate prima dell'avvento del WiFi, motivo per cui si tratta di un caso d'uso molto studiato. Anche oggigiorno può accadere che i nodi all'interno di una rete si riconfigurino formando un anello virtuale.
Vedremo generalmente algoritmi deterministici con identificativi unici associati a ciascun nodo. Il criterio di selezione si baserà sull'identificativo più piccolo. Verrà infine eletto un solo leader, proprio perché gli identificativi sono unici.

###### All The Way

Restrizioni:

- Collegamenti unidirezionali/bidirezionali

- Orientamento locale

- Identificatori distinti

- Affidabilità totale

Affinché ogni nodo sappia se il proprio identificativo è il più piccolo, per ogni nodo viene mandato un messaggio contente il relativo identificativo sull'anello. Il ritorno del messaggio avviene dalla parte opposta rispetto quella su cui lo si è inviato. Se due o più messaggi partono simultaneamente, non vi è alcun problema per l'esecuzione del protocollo.
All'atto dell'elezione del leader, il viaggio di tutti i messaggi lungo l'anello deve essersi concluso. Questo significa che la computazione è terminata.
L'unico problema è che, perché un nodo sappia di aver ricevuto tutti gli identificativi, dovrebbe:

- Poter conoscere il numero totale di nodi sull'anello

- Essere connesso ai propri vicini da un canale FIFO: in questo modo, il suo messaggio "starà dietro" a quelli di tutti gli altri

In entrambi i casi, è necessario aggiungere una nuova restrizione a quelle date.

![[assets/Screenshot 2024-10-25 114925.png|600]]

Possiamo dunque introdurre un contatore associato a ciascun identificativo ed allegarlo al messaggio. Quando il messaggio contenente l'identificativo ritorna al proprio nodo di partenza, il contatore associato sarà $n$. A quel punto, il nodo saprà il numero totale di nodi sull'anello, quindi anche quanto deve aspettare prima di terminare il protocollo. Il numero di nodi sull'anello in questo modo non viene posto tra le restrizioni, ma calcolato a tempo d'esecuzione.
Una volta terminato il protocollo, ogni nodo si auto-proclama leader o follower in autonomia. Non è necessario che siano inviati ulteriori messaggi sull'anello con questa informazione.

![[assets/Screenshot 2024-10-25 190012.png|800]]

- Numero di messaggi: un ogni messaggio attraversa $n$ link e vi sono in totale $n$ messaggi sull'anello durante l'esecuzione, per un costo complessivo di $O(n^2)$

- Tempo di esecuzione: ogni volta che viene ricevuto un messaggio nello stato $ASLEEP$, il corrispondente nodo viene attivato ed invia a sua volta. Nel caso peggiore, con un singolo nodo di partenza, tutti gli altri sono attivati al primo giro del messaggio sull'anello, e procedono a loro volta all'invio. Per questo motivo, la catena di messaggi più lunga è $2 \cdot n - 1 \in O(n)$ ($n$ per la catena del primo messaggio e $n - 1$ per quella di tutti gli altri)

###### As Far As It Can

Ora tentiamo di migliorare il protocollo All The Way: quando un nodo riceve un identificatore più piccolo del minimo che ha già osservato, sa automaticamente che inoltrarlo non avrà alcun rilievo.

![[assets/Screenshot 2024-10-25 124227.png|600]]

In questo modo solo il leader riceverà il proprio messaggio di ritorno e tutti gli altri andranno persi, da qualche parte, nel loro giro sull'anello.

![[assets/Screenshot 2024-10-25 190720.png|400]]

L'edge-case è quello in cui il leader stesso ferma tutti i messaggi contenenti identificatori più alti.
Il protocollo termina con una notifica del leader, perché non vi sono i presupposti perché i followers sappiano quando finisce la computazione sul sistema. As Far As It Can funziona anche nel caso in cui i collegamenti siano bidirezionali, ammesso che i messaggi viaggino in un solo dei due sensi.

![[assets/Screenshot 2024-10-29 113216.png|650]]

- Messaggi inviati: il caso peggiore è quello in cui i nodi sono disposti sull'anello con gli identificatori ordinati in senso crescente, e tutti i nodi si svegliano contemporaneamente. Il nodo con l'identificativo più alto è responsabile di una catena di un solo messaggio, quello con l'identificativo immediatamente più basso di due, e così via. Il numero complessivo di messaggi è:

  $$\begin{aligned}
                          n + (n - 1) + \dots + 2 + 1 = \frac{n \cdot (n + 1)}{2}
  \end{aligned}$$

  Il costo asintotico rimane $O(n^2)$, anche se lo abbiamo almeno dimezzato.
  Nel caso migliore invece, il messaggio del leader è l'unico nodo che si sveglia e tutti gli altri non vengono nemmeno spediti. In questo caso abbiamo $n$ messaggi più $n$ di notifica per un $O(n)$ complessivo

- Tempo di esecuzione: il caso peggiore è quello in cui l'iniziatore sia adiacente al nodo con l'identificatore più basso ed abbia un identificatore immediatamente più alto di quest'ultimo. La catena di messaggi deve partire nella direzione opposta rispetto al futuro leader, che viene svegliato dopo $n - 1$ messaggi. A questo punto, il messaggio del futuro leader attraversa tutto l'anello ed infine il leader invia la notifica. In totale abbiamo una catena di $3 \cdot n - 1 \in O(n)$ messaggi

###### Controlled Distance

In questo caso aggiungiamo la restrizione di bidirezionalità dei collegamenti. Questo algoritmo lavora per stages: in ciascuno stage ci sono candidati leader e leader sconfitti. I candidati leader tentano di sconfiggere prima i propri vicini, e se sopravvivono cercheranno, allo stage successivo, di sconfiggere quelli un po' più lontani, e così via. Alla fine della computazione rimane un solo leader eletto.
Al generico passo $i$-esimo, i candidati inviano i propri messaggi in entrambe le direzioni. Questi messaggi devono arrivare ad una distanza $2^i$ in cerca di identificatori più piccoli e tornano indietro solo nel caso in cui non ne abbiano trovati. Un candidato leader che vede ritornare entrambi i messaggi inviati ricomincerà come candidato leader anche al prossimo stage.
Ad un generico stage $i$, se un candidato leader riceve un messaggio con un identificativo più basso, passa automaticamente allo stato di leader sconfitto ed inoltra il messaggio. Un leader sconfitto rimane tale per tutto il resto dell'esecuzione del protocollo e continuerà passivamente a fare circolare i messaggi lungo l'anello. Un candidato leader che riceve un messaggio con un identificativo più alto, ferma la corsa del messaggio.

![[assets/Screenshot 2024-10-29 114205.png|700]]

Potenzialmente, allungando la distanza percorsa dei messaggi con la legge $2^i$, un candidato leader potrà ricevere in forward il proprio stesso messaggio. Questo significa banalmente che l'identificativo è il più basso di tutti, per cui il candidato può auto-proclamarsi leader.
Possiamo avere più iniziatori per questo protocollo.

![[assets/Screenshot 2024-10-29 114514.png|800]]

L'invio finale di una notifica è indispensabile, perché diversamente i nodi non possono sapere se la computazione sia terminata.

![[assets/Screenshot 2024-10-29 115446.png|1000]]

Controlled Distance termina sempre, perché prima o poi la distanza da percorrere per i messaggi supera senz'altro $n$, eleggendo leader il nodo con l'identificatore più basso.

- Numero di stages: un messaggio ritorna al candidato leader quando $2^d \geq n$, per cui il numero massimo di stages è quello che, dato come esponente a 2, ci permette di superare la lunghezza dell'intero anello. Abbiamo dunque:

  $$\begin{aligned}
                          d = ceil(\log_2{n})
  \end{aligned}$$

- Messaggi inviati: nel caso peggiore, per ogni candidato allo stage $i$-esimo, abbiamo $2^i$ messaggi verso entrambe le direzioni, andata e ritorno. Dunque, complessivamente: $4 \cdot 2^i$.
  Se un nodo è candidato leader allo stage $i$-esimo, significa che ha sconfitto tutti i vicini entro una distanza di $2^{i - 1}$ allo stage precedente. Un certo candidato leader al passo $i$-esimo si trova ad una distanza di almeno $2^{i - 1} + 1$ dal più vicino e non possono essercene altri nel mezzo.

  ![[assets/Screenshot 2024-10-29 120125.png|1000]]

  La regola è che il numero massimo di candidati leader allo stage $i$-esimo è:

  $$\begin{aligned}
                          \max{ \{ floor(\frac{n}{2^{i - 1} + 1}) \} }
  \end{aligned}$$

  Occorre prendere la parte intera inferiore perché un risultato che non sia intero viola gli assunti dell'algoritmo (in pratica ci dà uno spazio di lunghezza inferiore a $2^{i - 1}$ tra i candidati leader). Quindi, complessivamente, per il generico stage $i$-esimo abbiamo:

  $$\begin{aligned}
                          (4 \cdot 2^i ) \cdot floor(\frac{n}{2^{i - 1} + 1}) \leq 8 \cdot 2^{i-1} \cdot \frac{n}{2^{i - 1} + 1} = 8 \cdot n \cdot \underbrace{\frac{2^{i - 1}}{2^{i - 1} + 1}}_{< 1} < 8 \cdot n
  \end{aligned}$$

  Per calcolare il numero complessivo di messaggi, dobbiamo considerare la somma di quelli inviati ad ogni stage.

  - Al primo stage ($i = 0$) inviamo $4 \cdot n$ messaggi, perché ogni nodo ne manda uno ad ogni suo vicino, andata e ritorno

  - In tutti gli altri stages prima dell'ultimo ($0 < i < ceil(\log_2{n}))$ abbiamo un massimo di $8 \cdot n$ messaggi, come appena osservato

  - Nell'ultimo stage ($i = ceil(\log_2{n})$), abbiamo un numero di messaggi pari a $2 \cdot n$, perché entrambi i messaggi del futuro leader percorrono l'intero anello

  - In fase di notifica abbiamo $n$ messaggi

  Il totale è:

  $$\begin{aligned}
                          4 \cdot n + \sum_{i = 1}^{ceil(\log_2{n}) - 1} 8 \cdot n + 2 \cdot n + n = 7 \cdot n + 8 \cdot n \cdot (ceil(\log_2{n}) - 1) \in O(n \cdot \log_2{n})
  \end{aligned}$$

- Tempo di esecuzione: il tempo richesto allo stage $i$ dipende essenzialmente dalla distanza percorsa dal messaggio con l'identificativo più piccolo (che chiameremo $dist(i)$), andata e ritorno. In più va aggiunta la catena di $n$ messaggi per raggiungere il nodo con l'identificativo più piccolo all'avvio dell'algoritmo (caso peggiore) più gli $n$ messaggi di notifica. Complessivamente:

  $$\begin{aligned}
                          2 \cdot n + \sum_{i = 1}^{ceil(\log_2{n})} 2 \cdot dist(i) \in O(n)
  \end{aligned}$$

### 3.4 Leader election in grafi generici

###### Introduzione

Aggiorniamo le restrizioni usate nella sezione precedente con:

- Canali FIFO

- Conoscenza di proprietà del grafo, in particolare il suo diametro $d$, da parte dei nodi

In questa sezione viene considerato come riferimento l'identificativo dal valore più alto anziché quello più basso.

###### Flood

Possiamo pensare di aggiornare l'algoritmo di flooding sulla base delle nuove restrizioni, per un l'applicazione a grafi generici.
Ogni entità mantiene il massimo identificativo visto fino a quel momento. L'esecuzione è divisa in "rounds". A ciascun round ogni entità invia l'identificativo massimo visto fino a quel momento alle altre ed attende quello dei vicini. Dopo un certo numero $d$ di rounds (pari al diametro del grafo), se il valore massimo dell'identificativo è quello dell'entità $x$, essa diventa leader, altrimenti follower. Scegliere di attendere esattamente $d$ passi ci assicura che l'esecuzione sia terminata per tutti i nodi.

![[assets/Screenshot 2024-10-30 185342.png|600]]

- Messaggi inviati: ogni entità ad ogni round invia un messaggio ad ogni vicino, dunque abbiamo $2 \cdot m \cdot d$ messaggi totali

- Tempo di esecuzione: uguale all'algoritmo di flooding, è banalmente il diametro $d$ del grafo

###### Protocollo YO-YO

YO-YO è un protocollo deterministico universale per grafi connessi bidirezionali con identificativi distinti; elegge il nodo con identificativo minimo. Mantiene un orientamento logico aciclico del grafo e distingue:

- **source**, senza archi logici entranti e quindi ancora candidato;
- **sink**, senza archi logici uscenti;
- **internal**, con archi sia entranti sia uscenti.

**Setup.** Ogni coppia di vicini si scambia gli identificativi e orienta logicamente il proprio arco dal valore minore verso il maggiore. L'orientamento è un DAG: un ciclo diretto imporrebbe una catena strettamente crescente di identificativi che torna al valore iniziale. Lo scambio iniziale usa due messaggi per arco, quindi $2m$ messaggi.

**Iterazione.** Ogni iterazione ha due passi.

1. **YO, verso il basso.** Ogni source invia il proprio identificativo sugli archi uscenti. Un nodo interno attende un valore da ogni arco entrante, ne calcola il minimo e lo inoltra su tutti gli archi uscenti. Quando il minimo raggiunge i sink comincia il passo di ritorno.
2. **-YO, verso l'alto.** Un sink invia $YES$ sugli archi entranti dai quali ha ricevuto il minimo e $NO$ sugli altri. Un nodo interno attende un voto da ogni arco uscente: se sono tutti $YES$, propaga $YES$ solo sugli archi dai quali era arrivato il minimo e $NO$ sugli altri; se riceve almeno un $NO$, propaga $NO$ su tutti gli archi entranti. Una source che riceve soltanto $YES$ resta candidata; se riceve almeno un $NO$ è sconfitta.

Prima dell'iterazione successiva, ogni arco attraversato da un $NO$ viene invertito logicamente (**flip**): in questo modo una source sconfitta diventa sink o nodo interno. L'orientamento rimane aciclico.

**Pruning.** Durante il passo -YO si eliminano logicamente gli archi che non potranno influire sulle decisioni successive:

- un sink con un solo arco entrante elimina quell'arco, perché la sua decisione coincide con quella del predecessore;
- se un nodo riceve più copie dello stesso minimo, conserva un solo arco corrispondente ed elimina gli altri.

Il pruning non rimuove collegamenti fisici: impedisce soltanto di riutilizzarli nelle iterazioni successive. Quando rimane una sola source, al più un'ulteriore iterazione elimina tutti gli archi residui; la source rileva di essere isolata, si dichiara leader e notifica gli altri nodi seguendo gli ultimi archi potati.

**Correttezza e terminazione.** A ogni iterazione almeno una source viene sconfitta; dopo il flip né un nodo interno né un sink possono diventare source. Il minimo globale non riceve mai $NO$, quindi è l'unica source che può sopravvivere. Il grafo delle source dimezza la lunghezza dei cammini a ogni iterazione, da cui $O(\log n)$ iterazioni.

**Complessità.** Senza sfruttare il risparmio del pruning, setup e notifica costano rispettivamente $2m$ e $n-1$ messaggi; ogni iterazione usa al più due messaggi per arco attivo. Ne segue l'upper bound $O(m\log n)$. Le slide sottolineano che la complessità effettiva con il pruning dipende dagli archi rimasti ed è in genere inferiore, ma non è caratterizzata da una formula esatta unica.

### 3.5 Leader election in anelli sincroni

###### Introduzione

In un sistema sincrono tutti i clocks sono sincronizzati e battono nello stesso momento. Assumiamo che:

- Ogni entità, quando deve mandare un messaggio, lo fa al battito del clock

- Quando avviene il battito del clock, un'entità può inviare al massimo un solo messaggio allo stesso vicino

- Si conosce il bound superiore del ritardo di comunicazione sui canali

Si prende come riferimento il tempo $\delta$ che intercorre tra due battiti di clock. Essendo il tempo lo stesso per tutti i nodi, lo si può sfruttare per definire i protocolli.
È importante il fatto che, per i sistemi sincroni, esiste un limite $c$ alla dimensione dei messaggi per garantire il bound del ritardo di comunicazione. Messaggi più grandi di $c$ vengono spezzati in messaggi più piccoli, delle dimensioni proprio di $c$.

###### Speeding

Si ispira ad As Far As Possible, nel quale gli identificativi più grandi sono bloccati da quelli più piccoli. L'idea aggiuntiva è fare viaggiare più velocemente gli identificativi più piccoli, proprio per consentirgli di bloccare quelli più grandi. Il momento iniziale è lo stesso per ogni nodo.
Pur non potendo effettivamente aumentare la velocità di propagazione per i messaggi con identificativi più piccoli, si possono introdurre dei ritardi alla propagazione di quelli con identificativi più grandi. Il protocollo è specificato nell'immagine per semplicità.

![[assets/Screenshot 2024-10-30 185452.png|600]]

Una buone funzione da applicare all'identificativo è $f(i) = 2^i$.

- Tempo di esecuzione: l'identificativo più piccolo impiega $2^{min} \cdot n + n$ istanti per percorrere l'intero anello, dati da un ritardo di $2^{min}$ su ognuno degli $n$ nodi, più la notifica attraverso gli $n$ archi dell'anello.
  Il secondo identificativo più piccolo (come tutti gli altri) non riesce a completare il giro dell'intero anello. In particolare, il numero di collegamenti attraversati è pari a:

  $$\begin{aligned}
                          \frac{2^{min} \cdot n + n}{2^{min + 1}} \leq \frac{n}{2} + \frac{n}{2} = n
  \end{aligned}$$

  Questo significa che vengono attraversati al più $n$ collegamenti, ed in ogni caso non rimane tempo per la notifica.
  Se ripetiamo il calcolo per tutti gli identificativi più grandi, verifichiamo che a maggior ragione nessuno di essi completa il giro dell'anello.

  ![[assets/Screenshot 2024-11-05 111636.png|700]]

  Il tempo di esecuzione è dunque un $O(2^{min} \cdot n)$

- Messaggi inviati: ci basiamo sui calcoli fatti per il tempo di esecuzione. Il numero dei messaggi corrisponde essenzialmente ai collegamenti attraversati, percui dobbiamo eseguire la somma per tutti i nodi:

  $$\begin{aligned}
                          n + n + \frac{n}{2} + \dots + \frac{n}{2^{n - 2}} = n + n \cdot \sum_{i = 0}^{n - 2} \frac{1}{2^i} \in O(n)
  \end{aligned}$$

Il protocollo Speeding che abbiamo presentato non performa particolarmente bene, soprattutto per quanto riguarda il tempo di esecuzione. Possiamo pensare di usare il "silenzio" per risolvere questo problema. Ad esempio, se un nodo vuole comunicare un identificativo ad un altro, entrambi contano gli istanti di tempo decorsi tra invio e ricezione del messaggio, rispettivamente. Il mittente invia un secondo messaggio dopo un numero $x$ di istanti pari al proprio identificativo ed allora il ricevente è in grado di calcolarlo.

![[assets/Screenshot 2024-11-05 111823.png|700]]

Per attuare il protocollo in questo modo basta l'invio di 2 bits (uno per ogni fase). Il tempo di attesa è banalmente pari all'identificativo $x$.

###### Waiting

Aggiungiamo una ulteriore restrizione, cioè che tutti i nodi conoscano la dimensione $n$ dell'anello. Ogni entità attende un certo lasso di tempo, deciso da una funzione. Se non riceve alcuna notifica allo scadere del tempo si elegge leader e lo notifica agli altri, altrimenti diventa follower.
I requisiti di una funzione che stabilisce il tempo di attesa sono:

- L'entità $i$ attende $f(i, n)$ istanti, dove $f$ è crescente

- La notificazione dell'elezione a leader deve raggiungere tutti i nodi mentre questi sono ancora in stato di attesa

Nel caso in cui tutti i nodi si sveglino nello stesso momento, anche la loro attesa inizierà nello stesso istante. Il caso peggiore è quello in cui il secondo minimo sia il nodo più lontano sull'anello rispetto al minimo, e che abbia l'identificativo immediatamente successivo, cioè $y = x + 1$.

![[assets/Screenshot 2024-11-05 112934.png|700]]

Per questo motivo, dobbiamo per forza avere che:

$$\begin{aligned}
                    f(x + 1, n) - f(x, n) > n - 1
\end{aligned}$$

Un buon candidato è $f(i, n) = i \cdot n$. Questa è tra l'altro la funzione minore che realizza lo scopo. Come si vede nell'immagine, il secondo minimo viene fermato giusto in tempo prima che si elegga leader.

![[assets/Screenshot 2024-11-05 113015.png|700]]

- Numero di messaggi: vengono inviati semplicemente $n$ messaggi, da 1 bit ciascuno

- Tempo di esecuzione: dipende essenzialmente dalla funzione di attesa. In questo caso è pari a $min \cdot n + n \in O(min\cdot n)$; diventa $O(n)$ solo se il minimo identificativo è limitato da una costante

Cosa accade invece se non tutti i nodi partono assieme? Possiamo imporre che questi sveglino i loro vicini, mettendoli a loro volta in attesa. Nella pratica si tratta di una catena di messaggi di wake-up. Così facendo però, dobbiamo modificare la nostra funzione di attesa.
Sia $t(i)$ l'istante di risveglio dall'entità $i$, $x$ l'identificativo del leader ed $y$ quello di ogni altro nodo. La funzione deve soddisfare la disuguaglianza:

$$\begin{aligned}
                    t(x) + f(x, n) + d(x, y) < t(y) + f(y, n), \forall y
\end{aligned}$$

Cioè, l'istante di risveglio più il tempo di attesa e quello di notifica del leader devono essere minori dell'istante di risveglio più quello di attesa di ogni altro nodo. Questo ci assicura che la notifica del leader arrivi almeno un istante prima di quella di ogni altra entità.
Il caso peggiore è quello in cui il futuro leader si sveglia dopo un altro nodo. Anche in una situazione così sfavorevole abbiamo che: $t(x) - t(y) < n$, infatti il leader verrà svegliato in al più $n - 1$ istanti, perché $d(x, y) < n$. Sfruttando queste assunzioni, possiamo scrivere che:

$$\begin{aligned}
                    t(x) - t(y) + f(x, n) + d(x, y) < f(x, n) + 2 \cdot n
\end{aligned}$$

Per legare questa disuguaglianza alla prima, con la quale avevamo imposto i requisiti della funzione di attesa, introduciamo un'ulteriore ipotesi:

$$\begin{aligned}
                    f(x, n) + 2 \cdot n \leq f(y, n)
\end{aligned}$$

Il caso peggiore che questa disuguaglianza deve affrontare è quello in cui $y = 1 + x$, cioè deve valere che: $f(x, n) + 2 \cdot n \leq f(x + 1, n)$. La funzione che fa al caso nostro è:

$$\begin{aligned}
                    f(i, n) = 2 \cdot n \cdot i
\end{aligned}$$

Se andiamo a sostituire, verifica la seconda disuguaglianza ed in particolare il suo caso peggiore:

$$\begin{aligned}
                    f(x, n) + 2 \cdot n &= 2 \cdot n \cdot x + 2 \cdot n = 2 \cdot n \cdot (x + 1)\\
                    &\leq f(y, n), \qquad y\geq x+1
\end{aligned}$$

- Messaggi inviati: siccome ogni volta che si viene svegliati si tenta di svegliare il proprio vicino, sull'anello viaggiano $n$ messaggi di wake-up più $n$ notifiche, per un totale di $2 \cdot n \in O(n)$ messaggi

- Tempo di esecuzione: rispetto al caso in cui tutti i nodi si svegliano contemporaneamente, abbiamo raddoppiato il tempo di esecuzione mettendo il coefficiente moltiplicativo 2 nella funzione di attesa. Complessivamente: $2 \cdot n \cdot min + 2 \cdot n \in O(min \cdot n)$

Questo protocollo non è applicabile nel caso si ricerchi l'identificativo più alto piuttosto di quello più basso. In ogni caso, usare l'identificativo più piccolo offre dei vantaggi computazionali.

###### Universal waiting

Il Waiting si può usare su di ogni grafo connesso $G$.

![[assets/Screenshot 2024-11-06 100832.png|700]]

Per quanto riguarda i costi, sostituiamo il diametro del grafo $d$ al posto del numero di nodi sull'anello $n$. Possiamo applicare anche le stesse funzioni di attesa.

###### Elezione casuale del leader

Quando non abbiamo degli identificatori univoci, l'elezione del leader non può essere portata a termine con metodi deterministici. Possiamo però servirci di un protocollo randomizzato. Ne esistono tipicamente di due tipi:

- Monte Carlo: terminano sempre, ma non è detto che ogni volta che lo fanno diano un risultato corretto

- Las Vegas: possono non terminare, ma quando lo fanno danno sempre il risultato corretto

L'idea dietro all'uso di identificativi era quella di trovare, alla fine del procedimento, un solo leader. Nel caso probabilistico, ogni nodo sceglie casualmente un identificativo intero e nel caso di minimi uguali si ripete il processo.

![[assets/Screenshot 2024-11-06 102152.png|800]]

Possiamo ad esempio utilizzare Waiting combinato ad un approccio probabilistico. I minimi fanno partire la notifica per primi e, siccome ci troviamo in un sistema sincrono, la attendono di ritorno dopo $i$ istanti di tempo. Quando arriva una notifica dopo meno di $i$ istanti, chi riceve la notifica diventa follower, altrimenti diventerà leader alla fine del processo.
Per un singolo round abbiamo:

- Comunicazione per round: $O(n)$ trasmissioni di messaggi da un bit, quindi $O(n)$ bit complessivi includendo la notifica o il riavvio; la dimensione del singolo messaggio resta $O(1)$

- Tempo di esecuzione: come avevamo visto per Waiting, dipende dall'identificativo più piccolo possibile. Per minimizzarlo dobbiamo prendere almeno due identificativi diversi, più piccoli possibile. Ad esempio si può pescare da $\{0, 1\}$. In questo caso specifico il vantaggio è quello di poter condurre un round in una sola unità di tempo.
  Vogliamo però che lo 0 sia scelto con meno frequenza dell'1, per minimizzare il numero di rounds per una singola elezione. Più precisamente vogliamo ottimizzare le probabilità di successo nell'elezione del leader. Possiamo prevedere una probabilità $p = \frac{1}{n}$ per lo 0 e $p = \frac{n - 1}{n}$. Per considerare l'elezione conclusa in un solo round, un solo nodo deve scegliere 0 e tutti gli altri 1. Complessivamente abbiamo una probabilità che ciò accada di:

  $$\begin{aligned}
                          P = n\cdot\frac{1}{n} \cdot (\frac{n - 1}{n})^{n - 1} = (\frac{n - 1}{n})^{n - 1} \xrightarrow{n \to \infty} \frac{1}{e} \sim 0.37
  \end{aligned}$$

  Per una specifica entità si moltiplicano la probabilità che scelga 0 e quelle che tutte le altre scelgano 1; il fattore $n$ conta le possibili scelte dell'unica entità che estrae 0.
  In conclusione, ci aspettiamo di avere successo una volta ogni $e$ rounds, cioè circa ogni 3, arrotondando per eccesso. Il costo complessivo è di $O(n)$ unità di tempo, contando più rounds e tempo di notifica

## 4 Algoritmi di routing

###### Introduzione

Finora abbiamo principalmente parlato di broadcast per i casi in cui un nodo volesse contattarne un altro. Il broadcast in effetti è una possibile soluzione per questo caso d'uso, il problema è che tale approccio implica l'invio di troppi messaggi ed un'effettiva insicurezza della rete.
Tipicamente il routing consiste nel processo di determinare un cammino tra una sorgente $x$ ed una destinazione $y$. Un router è un nodo che ha la proprietà di determinare automaticamente il percorso per i messaggi che lo attraversano in base all'indirizzo specificato, prendendo come riferimento ad un'apposita routing table locale.
Le restrizioni imposte per questa tipologia di problemi sono le seguenti:

- Collegamenti bidirezionali: con possibili costi associati

- Connettività

- Affidabilità totale

- Orientamento locale: tutti i nodi sono in grado di discernere tra i propri vicini, dunque da chi ricevono i messaggi

- Identificativi unici

###### Routing table

Ciascun nodo ha una propria routing table che indica, per ogni possibile destinazione, su quale collegamento rimandare un messaggio in ingresso.
Sono di particolare interesse nella risoluzione di problemi di routing:

- La dimensione della tabella di routing, espresso in numero di bits

- Il tempo impiegato per scegliere il link da utilizzare

![[assets/Screenshot 2024-11-06 164323.png|700]]

Ogni nodo sa su quale collegamento inviare i pacchetti in base ai cammini minimi dal proprio punto di vista. Un nodo che si trova su uno di questi cammini minimi continua l'inoltro verso il collegamento opportuno, seguendo la stessa logica. Il cosiddetto principio di ottimalità afferma che, se il nodo $x$ si trova lungo il cammino minimo $P$ da $a$ verso $b$, allora $P$ è anche un frammento dell'albero dei cammini minimi di $x$.

###### Gossiping

Vogliamo costruire la tabella di routing. Ogni nodo deve essere in grado di acquisire informazioni circa il proprio intorno. Se tutti i nodi lo fanno, è possibile ricostruire tutto il grafo. L'operazione relativa all'invio a tutti gli altri delle informazioni circa il proprio vicinato è detta "gossip".
Essenzialmente, per fare gossiping si costruisce uno spanning tree, attraverso il quale le entità possono fare il broadcasting di tali informazioni. Una volta che ciascun nodo ha ottenuto il grafo, può costruire il proprio albero dei cammini minimi e generare la tabella di routing. Il grafo memorizzato può quindi essere cancellato. Un downside del gossiping può essere dato dalla dimensione del grafo.

![[assets/Screenshot 2024-11-06 165045.png|600]]

- Messaggi inviati: l'algoitmo consiste di una sequenza, vediamo il costo associato ad ogni fase.

  - Shout+ per generare lo spanning tree: $O(2 \cdot m)$

  - Ottenimento delle informazioni sul vicinato, per ogni nodo: 2 messaggi scambiati per ogni collegamento (uno per direzione), dunque ancora: $O(2 \cdot m)$

  - Broadcast delle informazioni di ciascun nodo circa i propri vicini ($deg(x)$ messaggi, uno per ciascun vicino) attraverso tutti gli $n - 1$ collegamenti dello spanning tree:

    $$\begin{aligned}
                                \sum_{x} (n - 1) \cdot deg(x) = (n - 1) \cdot \sum_{x} deg(x) = (n - 1) \cdot 2 \cdot m
    \end{aligned}$$

    Naturalmente, la somma dei gradi di tutti i nodi è uguale a $2 \cdot m$.

  Possiamo quindi dire che il numero di messaggi è $O(m \cdot n)$.

###### Iterating

Un'alternativa a Gossiping può essere quella di costruire la tabella per rivelazioni successive di informazioni. All'inizio, tutti i nodi conoscono solo i propri vicini. Poi, iterativamente, ogni nodo invia le proprie informazioni sui cammini minimi (dette "distance vector") ai vicini e le aggiorna ricevendo le loro.

![[assets/Screenshot 2024-11-08 170555.png|1000]]

Questo modo di procedere è lo stesso previsto dall'algoritmo di Bellman-Ford; nella fattispepcie stiamo usando un Bellman-Ford distribuito. Il protocollo converge in al più $n - 1$ iterazioni, perché tale è la lunghezza massima di un cammino minimo tra due nodi. Al termine della computazione, a differenza di Gossiping, i nodi non conoscono né la mappa del grafo né l'albero dei cammini minimi da ogni sorgente.

- Messaggi inviati: ad ogni iterazione (come abbiamo detto, $n - 1$ in totale nel caso peggiore), ogni nodo invia a tutti i suoi $N(x)$ vicini il proprio distance vector (che consiste di $n$ costi associati a tutti i nodi del grafo). Perciò, complessivamente abbiamo:

  $$\begin{aligned}
                      (n - 1 ) \cdot n \cdot \sum_x N(x) = (n - 1) \cdot n \cdot 2 \cdot m \in O(n^2 \cdot m)
  \end{aligned}$$

  Iterating invia molti più messaggi di Gossiping, però non richiede una grande quantità di memoria

Ci chiediamo a questo punto se sia possibile costruire tabelle di routing con una quantità di messaggi e memoria limitata. Possiamo farlo realizzando una versione distribuita degli algoritmi di Dijkstra o BFS, come vediamo nel seguito.

###### Min-Hop routing

Imponiamo per prima cosa che tutti i collegamenti abbiamo lo stesso costo, od alternativamente che non vi siano costi associati. In un caso sincrono, ci basta il protocollo Shout per calcolare l'albero dei cammini minimi (o l'albero BFS, che in questo caso è la stessa cosa).
Nel caso asincrono si deve in qualche modo inserire la sincronizzazione artificialmente. Cioè, tutti i nodi che ricevono un messaggio dalla sorgente devono notificare la ricezione prima di andare a ricercare i propri figli. In questo modo si risolvono le possibili incongruenze introdotte dai diversi tempi di arrivo dei messaggi. Il parallelismo è in qualche modo implicito, perché in fase di ricerca ogni nodo invia più messaggi contemporaneamente verso i propri figli.
Il protocollo è iterativo: ad ogni nuova iterazione si aggiunge un livello all'albero dei cammini minimi.

![[assets/Screenshot 2024-11-08 171837.png|600]]

All'inizio di una generica iterazione $i$, l'albero costruito fino a quel momento contiene nodi che vanno fino ad una distanza $i - 1$ dalla sorgente $s$. I nodi inclusi nell'albero parziale conoscono i propri padri, figli ed in particolare la loro distanza da $s$. Al termine dell'iterazione anche i nodi a distanza $i$ da $s$ saranno stati scoperti.
All'iterazione $i$-esima, la radice $s$ invia un flood nell'albero parziale. Una generica entità che riceve il messaggio lo inoltra se non è una foglia, altrimenti inizia la fase di esplorazione.
L'esplorazione consiste nell'invio di un broadcast di messaggi ai propri vicini, che ricevono diversi ack a seconda dello stato di questi ultimi.

![[assets/Screenshot 2024-11-08 172142.png|600]]

Quando un nodo che ha avviato la ricerca riceve gli ack da tutti i propri figli, invia un messaggio verso la radice con un convergecast. Una volta che $s$ ha ricevuto tutti i convergecast di ritorno, può fare partire una nuova iterazione.
Come terminare l'esecuzione del protocollo? In modo del tutto naive la radice sa che dopo al più $n - 1$ iterazioni la computazione sarà sicuramente finita. A quel punto verrà quindi inviato in flooding un messaggio di notifica verso gli altri nodi.
Altrimenti, possiamo fare sì che il messaggio di convergecast contenga il numero di nodi scoperti in fase di ricerca, e che i nodi interni che ne ricevono più di uno sommino tale numero, ripetendo questa procedura fino alla radice. In questo modo, una volta raggiunti tutti gli $n - 1$ nodi che non sono $s$, lo stesso $s$ lo saprà e potrà inviare la notifica per fermare la computazione.
Un ulteriore modo potrebbe essere quello di inviare un particolare messaggio di convergecast quando i nodi non trovano nuovi vicini. Nel momento in cui $s$ riceve solo messaggi di questo tipo, significa che l'albero di copertura ha raggiunto tutto $G$.

- Messaggi inviati: all'$i$-esima iterazione abbiamo un flooding sull'albero parziale (di profondità esattamente pari a $i - 1$), poi la fase di esplorazione ed infine il convergecast.
  Entrambi convergecast e flooding implicano l'invio di $n_i - 1$ messaggi (uno su ogni collegamento dell'albero parziale). Per questi, abbiamo complessivamente:

  $$\begin{aligned}
                      \sum_{i = 1}^{r(s)} 2 \cdot (n_i - 1) \leq 2 \cdot (n - 1) \sum_{i = 1}^{r(s)} 1 \leq 2 \cdot (n - 1) \cdot d(G)
  \end{aligned}$$

  dove $r(s)$ è il numero di iterazioni al quale il protocollo è concluso. $d(G)$ è l'upper bound naturale per il numero di iterazioni.
  Ogni nodo fa esplorazione una volta sola, inviando $N(x)$ messaggi e ricevendo $N(x)$ ack. L'invio di un messaggio da parte di ogni nodo verso i propri vicini, come abbiamo visto, produce $2 \cdot m$ messaggi. In questo caso, contando anche gli ack abbiamo in totale: $2 \cdot 2 \cdot m = 4 \cdot m$ messaggi.
  Sommando il tutto otteniamo:

  $$\begin{aligned}
                      2 \cdot (n - 1) \cdot d(G) + 4 \cdot m \leq 4 \cdot m + 2 \cdot (n - 1) \cdot (n - 1) \in O(n^2)
  \end{aligned}$$

  La scelta di $n - 1$ come upper bound a $d(G)$ è peraltro cosa già vista

- Tempo di esecuzione: anche in questo caso, possiamo distinguere tre diversi costi per la generica iterazione $i$-esima. Explore e convergecast sono catene di $i - 1$ messaggi, mentre la ricerca è una catena di $2$ messaggi. Sommando il tutto troviamo $2 \cdot i$ messaggi consecutivi per ogni iterazione.
  Per tutte le iterazioni abbiamo:

  $$\begin{aligned}
                      \sum_{i = 1}^{r(s)} 2 \cdot i = 2 \cdot \frac{r(s) \cdot (r(s) + 1)}{2} = r(s) \cdot (r(s) + 1) \in O(r(s)^2) \in O(n^2)
  \end{aligned}$$

  Ancora una volta usiamo $n - 1 \in O(n)$ come upper bound per $r(s)$

###### Algoritmo di Dijkstra

Questa volta non supponiamo più che i pesi dei collegamenti siano tutti uguali tra loro, bensì che siano tutti positivi.
Nella versione classica dell'algoritmo di Dijkstra, ad ogni iterazione alcuni nodi fanno parte dell'albero di copertura dei cammini minimi ed altri no. Collegamenti in uscita dai primi li connettono con i secondi, generando una vera e propria "zona di confine". Ad ogni iterazione viene aggiunto all'albero di copertura dei cammini minimi (SPST) il nodo che ancora non ne fa parte verso il quale la distanza da $s$ è minima.

![[assets/Screenshot 2024-11-12 095921.png|1000]]

L'algoritmo distribuito passa per prima cosa attraverso una fase di inizializzazione, che viene riassunta nell'immagine.

![[assets/Screenshot 2024-11-12 100018.png|550]]

Ogni nodo vede i collegamenti verso i vicini dal proprio punto di vista. Uno stesso collegamento può essere inteso in due modi diversi dai nodi che lo condividono.
Alla generica iterazione, la radice $s$ fa il flooding di un messaggio di inizio verso tutto l'albero.
Quando una generica entità $x$ lo riceve, va a proporre il proprio candidato $y_x$ per l'inserimento nell'albero. Per individuarlo minimizza su ogni collegamento "outgoing" la somma:

$$\begin{aligned}
                \Delta (x) + c(x, y)
\end{aligned}$$

La selezione del nuovo nodo da aggiungere all'albero è fatta attraverso un convergecast, che propaga verso $s$ l'aggregazione:

$$\begin{aligned}
                \hat{x} = argmin_x \{\Delta(x) + c(x, y_x)\}
\end{aligned}$$

Una volta che la radice riceve l'ultimo convergecast, determina quale sia il nuovo nodo (dunque il nuovo collegamento $(\hat{x}, y_{\hat{x}})$) da aggiungere all'albero. A questo punto, fa partire un nuovo messaggio di notifica verso $y_{\hat{x}}$. $\hat{x}$ manda a $y_{\hat{x}}$ il valore $\Delta (y_{\hat{x}})$ ed entrambi $\hat{x}$ e $y_{\hat{x}}$ marcano il collegamento tra loro come "tree". Questa notifica non deve avvenire necessariamente tramite flooding, infatti basta che ogni entità ricordi qual'era la distanza minima che aveva ricevuto in fase di convergecast per ricostruire il percorso esatto.
A questo punto, $y_{\hat{x}}$ notifica ai propri vicini (tranne $\hat{x}$) di essere stato aggiunto all'albero, in modo che questi possano marcare il collegamento verso $y_{\hat{x}}$ come "non-outgoing". $y_{\hat{x}}$ attende gli ack e quando li ha ricevuti tutti, invia verso $s$ un messaggio di "end iteration".

![[assets/Screenshot 2024-11-12 113900.png|1000]]

Solo la radice può decidere quando il protocollo è terminato. Per avvisare tutti i nodi dell'albero, invia una notifica.
Se supponiamo che la sorgente conosca il numero di nodi, invierà una notifica al termine delle $n - 1$ iterazioni. In alternativa, basta che $s$ veda quando non arrivano più notifiche di candidati in convergecast. Siccome non abbiamo alcuna certezza sui possibili ritardi, si può pensare di mandare un tipo particolare di messaggio attraverso il convergecast, ad esempio un "-1", qualora non si trovino più possibili candidati.

- Messaggi inviati: dobbiamo sommare le complessità delle diverse fasi in cui si articola il protocollo.

  - Flooding di inizio iterazione: $i - 1$ messaggi, uno per ogni arco dell'albero

  - Convergecast: $i - 1$ messaggi, sempre uno per ogni arco

  - Notifica al nodo aggiunto all'albero: nel caso peggiore, cioè quello in cui l'albero intero sia una catena, $(i - 1) + 1$ messaggi

  - Notifica di fine iterazione: uguale alla notifica precedente, quindi al più $(i - 1) + 1=i$ messaggi

  percui, in tutto $4 \cdot i - 2$. Sommando per tutte le iterazioni, abbiamo:

  $$\begin{aligned}
                          \sum_{i = 1}^{n - 1} (4 \cdot i - 2) &= 4 \cdot \sum_{i = 1}^{n - 1} i  - 2 \cdot \sum_{i = 1}^{n - 1} 1 = 4 \cdot \frac{(n - 1) \cdot n}{2} - 2 \cdot (n - 1)\\
                          &= 2 \cdot (n - 1)^2 \in O (n^2)
  \end{aligned}$$

  Dobbiamo poi aggiungere le notifiche inviate da $y_{\hat{x}}$ ai propri vicini e gli ack relativi, per ogni nodo scoperto:

  $$\begin{aligned}
                          2\left(\sum_{x\neq s}(deg(x)-1)+deg(s)\right)=4m-2(n-1)
  \end{aligned}$$

  Sommando il tutto abbiamo:

  $$\begin{aligned}
                          2 \cdot (n - 1)^2 + 4 \cdot m - 2 \cdot (n-1) \in O(n^2)
  \end{aligned}$$

- Tempo di esecuzione: ad ogni iterazione vengono inviate sequenze di al più $i - 1$ messaggi ciascuna per:

  - Start iteration

  - Convergecast

  - Notifica da $s$ verso $\hat{x}$

  - Notifica di fine iterazione verso $s$

  A questi aggiungiamo 4 catene di singoli messaggi necessari a:

  - Notifica di $\Delta (y_{\hat{x}})$ verso $y_{\hat{x}}$ da parte di $\hat{x}$

  - Notifica di essere entrato nell'albero da parte di $y_{\hat{x}}$ ai propri vicini

  - Ack dai vicini verso $y_{\hat{x}}$

  - Primo passo della notifica di fine iterazione da $y_{\hat{x}}$ verso $\hat{x}$

  Il totale complessivo è di $4 \cdot i$ messaggi in catena per iterazione.
  Complessivamente, per tutte le iterazioni:

  $$\begin{aligned}
                          4 \cdot \sum_{i = 1}^{n - 1} i = 4 \cdot \frac{n \cdot (n - 1)}{2} = 2 \cdot (n) \cdot (n - 1)
  \end{aligned}$$

  Aggiungendo la catena di inizializzazione lunga 2 e la notifica finale lunga al più $n-1$, il totale è $2+2n(n-1)+(n-1)=2n^2-n-1\in O(n^2)$

Se vogliamo ottenere le tabelle di routing su tutta la rete, tutti i nodi devono calcolare il proprio spanning tree. Il costo in termini di messaggi diventa di $n$ volte $O(n^2)$, cioè un algoritmo di Dijkstra distribuito con ogni nodo come sorgente, cioè $O(n^3)$ in tutto. Gli algoritmi di Dijkstra distribuiti si possono idealmente eseguire in parallelo, inviando messaggi opportunamente contrassegnati.
Confrontando Dijkstra distribuito con Gossiping ed Iterating, possiamo dire di avere un matching dei costi con il primo (anche se i requisiti di memoria sono molto inferiori in questo caso) ed un ordine di grandezza di meno rispetto al secondo.
L'algoritmo di Dijkstra distribuito è, in qualche modo, più semplice della versione sequenziale, perché non dobbiamo attingere ad una struttura dati aggiuntiva come la coda con priorità.

## 5 Errori e fallimenti

###### Introduzione

Finora abbiamo usato l'ipotesi di assenza di fallimenti nel sistema di comunicazione. Esistono contesti in cui considerare i fallimenti è di interesse ed influenza in modo incisivo la definizione di nuovi protocolli.
Esistono diverse classificazioni per i fallimenti:

![[assets/Screenshot 2024-11-12 121215.png|600]]

Solitamente si impongono restrizioni sul tipo di fallimento, per restringere il campo verso certi casi d'uso. Non è possibile progettare protocolli resistenti ad un numero arbitrario di fallimenti. Esistono poi protocolli che sono in grado di resistere fino ad un certo numero di fallimenti dello stesso tipo. Determinare tale numero è a carico di chi li definisce.

###### Tipi di fallimenti

I fallimenti possono riguardare:

- Nodi

  ![[assets/Screenshot 2024-11-12 121453.png|600]]

- Archi

  ![[assets/Screenshot 2024-11-12 121505.png|600]]

  Quando possono accadere tutti e tre, ci possiamo trovare in un caso di fallimento bizantino su uno dei nodi

- Entrambi

###### Fault-tolerance e topologie di rete

La definizione di un protocollo fault-tolerant dipende in maniera preponderante dalla topologia del sistema. Si può disconnettere un grafo rimuovendo nodi o collegamenti.

![[assets/Screenshot 2024-11-12 121743.png|600]]

Se $k$ nodi/collegamenti arbitrari possono crashare, è impossibile eseguire un flooding, a meno che la rete non sia $(k+1)$-node/edge-connected.

###### Problema di Agreement/Consensus

Ogni entità $x$ ha associato un valore $v(x)$, estratto da un insieme conosciuto di valori. Alla fine del protocollo, almeno $p$ entità devono accordarsi su di uno stesso valore $d(x)$, anch'esso appartenente all'insieme.
La risoluzione del problema è tipicamente vincolata dalla "non-trivialità": se tutte le entità hanno inizialmente associato lo stesso valore, la decisione deve convergere verso di esso.
Per un accordo tra $p$ entità si parla di "$p$-agreement", mentre quando $p = n$ si parla di "consenso".

### 5.1 Consensus problem con fallimenti sui collegamenti

###### Introduzione

Esaminiamo un problema di consenso in cui sono contemplati solo fallimenti dei collegamenti. Imponiamo i seguenti vincoli:

- Agreement: le entità devono decidere tutte lo stesso valore

- Non-trivialità

- Terminazione: tutte le entità alla fine decidono

###### Il problema dei due generali

Due generali, ciascuno a capo di un esercito, devono coordinare un attacco contro il nemico. I due eserciti sono posizionati su colline opposte e possono comunicare solo inviandosi messaggi tramite un messaggero appiedato, che deve attraversare la valle. Essendo la valle controllata dal nemico, c'è il rischio che i messaggeri vengano intercettati e non raggiungano l'altro generale.
Entrambi i generali sanno che per vincere la battaglia devono attaccare contemporaneamente, quindi è fondamentale la loro coordinazione. Il problema nasce dal fatto che, anche se uno dei generali invia un messaggio per confermare l'attacco, non può essere certo che l'altro generale abbia ricevuto il messaggio, e viceversa. Potrebbero continuare a inviarsi messaggi di conferma indefinitamente, però rimane sempre l'incertezza che l'ultimo messaggio non sia stato ricevuto dall'altro generale.
Il problema dei due generali dimostra che in un sistema con un canale di comunicazione inaffidabile non sia possibile garantire un consenso certo.

![[assets/0_elHKtsxKn5VMl8cZ.jpg|500]]

###### Teorema

Il problema dei due generali non si può risolvere, nemmeno se il sistema è completamente sincrono.

###### Lemma

In ogni esecuzione di ogni protocollo in cui i due generali decidono di attaccare, almeno un messaggio deve essere consegnato. Altrimenti, l'altro generale è incapace di stabilire se il primo ha deciso di non attaccare o se il messaggio è andato perso.
Dimostriamo per assurdo la validità del teorema visto sopra. Assumiamo che esista un protocollo per risolvere il problema e che il collegamento sia in grado di recapitare almeno un messaggio prima del proprio fallimento. Consideriamo due esecuzioni del protocollo che portano i due generali ad attaccare: $E$ ed $E^\prime$. Nella prima viene inviato il numero minimo ($k \geq 1$) di messaggi e nella seconda l'ultimo messaggio viene perso.

![[assets/Screenshot 2024-11-13 091232.png|800]]

Per il generale A le due esecuzioni sono indistinguibili e decide di attaccare in entrambe. Inoltre, siccome si è supposto che il protocollo risolva il problema (dunque che sia corretto), il anche il generale B attaccherà in entrambe.
In entrambe le esecuzioni vengono mandati $k \geq 1 \iff k - 1 \geq 0$ messaggi. Dividiamo i casi:

- Se $k - 1 > 0$ non viene inviato il numero minimo possibile di messaggi per stabilire il consenso tra i due generali

- Se $k - 1 = 0$ non viene inviato nessun messaggio, in contraddizione con l'ipotesi

La possibilità del fallimento dell'unico collegamento tra i due generali, non l'effettivo fallimento di esso, è il fattore chiave che ci dà l'insolubilità del problema.

###### Teorema

Se $F > 0$ collegamenti possono fallire, il consenso non si può raggiungere se il sistema non è $(F + 1)$-connesso, anche nelle condizioni di sincronicità.
In un sistema con le proprietà appena descritte si può fare flooding, perché la rete non può essere disconnessa. Usando il flooding, ciascun nodo può diffondere il proprio valore, calcolare il valore di convergenza come funzione di quelli ricevuti e trovare l'agreement con gli altri. Diventa quindi possibile raggiungere il consenso.

###### Flooding in grafi completi con fallimenti nei collegamenti

Nei grafi completi il flooding è essenzialmente un broadcast, e può raggiungere i vicini di un dato nodo con soli $n - 1$ messaggi nel caso in cui non siano ammessi fallimenti. Possiamo rilassare l'assunzione ammettendo al massimo $F < n - 1$ fallimenti, ed imponendo che $F$ sia conosciuto dal nodo $x$ che vuole eseguire il broadcast.
Il protocollo si articola in due fasi:

- Nella prima $x$ invia il messaggio $I$ a $F + 1$ vicini

- Ogni nodo che riceve il messaggio da $x$ lo inoltra a tutti i propri vicini, eccetto $x$

![[assets/Screenshot 2024-11-13 093705.png|800]]

Siccome ci sono al massimo $F$ collegamenti faulty (cioè soggetti a fallimento), la somma dei collegamenti faulty per i due step è appunto al più $F$: $f_1 (x) + f_2 (x) \leq F$.
Al primo step, imporre l'invio a $F + 1$ vicini fa sì che almeno uno di questi venga raggiunto, anche nel caso peggiore in cui $F$ vicini di $x$ siano faulty. Al secondo step, ogni generica entità $y$ viene raggiunta da almeno un messaggio, perché:

$$\begin{aligned}
                    F + 1 - \underbrace{(f_1 (x) + f_2 (x))}_{\leq F} \geq 1
\end{aligned}$$

Cioè, i nodi verso i quali (a step 1) e dai quali (a step 2) i collegamenti sono faulty sono comunque in inferiorità rispetto $F - 1$.

- Messaggi inviati: $(F + 1)$ al primo step e $(F + 1) \cdot (n - 2)$ al secondo (a prescindere dal fatto che i collegamenti siano faulty). In tutto:

  $$\begin{aligned}
                          (F + 1) + (F + 1) \cdot (n - 2) \in O(F \cdot n)
  \end{aligned}$$

  Il costo asintotico dipende dal valore di $F$, che può determinare un oscillazione da $O(n)$ ad $O(n^2)$

### 5.2 Consensus problem con fallimenti sui nodi

###### Conseunsus problem - entity fault

L'impostazione del problema rimane la stessa che per i fallimenti sugli archi, così come i vincoli imposti (che in questo caso riguardano solo i nodi non-faulty).

![[assets/Screenshot 2024-11-13 100304.png|600]]

###### Teorema

È impossibile ottenere il consenso con un protocollo deterministico in un sistema asincrono, anche nelle condizioni più favorevoli, cioè:

- Il fallimento è minimo: $F = 1$

- Il fallimento è il più facile da gestire: cioè nel caso di crash

- Il grafo è completo

Questo è il risultato FLP: nel modello asincrono non esiste un protocollo deterministico che garantisca contemporaneamente agreement, validità e terminazione del consenso anche con un solo possibile crash. Non implica l'impossibilità generale del software fault-tolerant: si può cambiare modello o garanzia, per esempio introducendo sincronia parziale, failure detector o randomizzazione.
Per dimostrare quanto abbiamo detto, consideriamo il seguente fatto: i ritardi di comunicazione sono finiti ma impredicibili. L'idea è che, quando un nodo attende un messaggio ed è possibile che vi siano stati dei crash, esso non può stabilire in alcun modo se il messaggio arriverà oppure no.
In un contesto pratico, una possibile soluzione è quella di impostare dei time-out (es. TCP).

###### Consensus in sistemi sincroni

Ri-arrangiamo il sistema di restrizioni, imponendo:

- Grafo completo

- Connettività forte

- Sincronicità

- Fallimenti di tipo crash

- Inizio simultaneo

- Conoscenza di $F$ da parte dei nodi

Assumiamo inoltre che $v(x) = \{0, 1\}$ per ogni entità $x$.
Con questo set-up possiamo definire protocolli che raggiungano il consenso tollerando al più $f < n$ fallimenti dei nodi (crash).
Il protocollo è iterativo ed esegue per $F + 1$ iterazioni.

![[assets/Screenshot 2024-11-13 101007.png|600]]

Il report $r(x, t)$ si riferisce al nodo $x$ all'istante $t$. Il primissimo report, ovvero $r(x, 0)$ contiene semplicemente $v(x)$. Per i report successivi, ovvero i generici $r(x, t)$, applichiamo:

$$\begin{aligned}
                    r(x, t) = r(x, t - 1) \land m(y_1, t) \land m(y_2, t) \land \dots \land m(y_{|N(x)|}, t)
\end{aligned}$$

![[assets/Screenshot 2024-11-13 101244.png|250]]

Un esempio di possibile esecuzione è mostrato in figura.

![[assets/Screenshot 2024-11-13 101354.png|700]]

- Numero di messaggi: nel caso peggiore, cioè quello senza crash, vengono inviati $n - 1$ messaggi da $n$ nodi per $F + 1$ iterazioni, dunque complessivamente:

  $$\begin{aligned}
                          n \cdot (F + 1) \cdot (n - 1) \in O(n^2 \cdot F)
  \end{aligned}$$

- Tempo di esecuzione: la catena di messaggi è singola per ogni iterazione, perciò abbiamo in totale:

  $$\begin{aligned}
                          F + 1 \in O(F)
  \end{aligned}$$

Alcune osservazioni:

- Il protocollo termina, banalmente perché ci sono $F + 1$ iterazioni

- Se un nodo non-faulty riceve uno 0 all'istante $t \leq F$, allora tutte le altre riceveranno uno 0 a $t + 1$. In particolare, tale entità sceglierà 0

- Se tutte le entità iniziano con 1, allora tutte le non-faulty convergeranno ad 1

Possiamo usare le osservazioni fatte per verificare i constraints di:

- Non-trivialità: se tutte le entità inizialmente sono 0, tutte decideranno 0. Altrimenti, se tutte le entità inizialmente sono 1, decideranno 1, come abbiamo visto

- Agreement: se almeno un'entità non-faulty inizia con 0, tutte le altre decideranno 0. Se tutte le entità iniziano con 1, tutte le non-faulty decideranno 1. Perciò, tutte le possibili casistiche sono coperte e vi è garanzia di raggiungere il consenso

Le $F + 1$ iterazioni sono giustificate dal fatto che all'istante $t \leq F$ i nodi non faulty possono aver ricevuto solo 1 ed all'istante $t + 1$ potrebbero ricevere uno 0 da un nodo faulty.

![[assets/Screenshot 2024-11-13 102453.png|1000]]

Il caso in cui i nodi non faulty ricevano solo 1 fino all'istante $F + 1$ e poi per la prima volta uno 0 è il peggiore che possa verificarsi, ma di fatto non può accadere.
Possiamo dimostrarlo ripercorrendo la sequenza temporale all'indietro. Se un nodo faulty ha 0, deve averlo ricevuto per forza all'istante precedente. Ma se i nodi non faulty in quello stesso istante hanno valore 1, significa che il nodo dal quale esso ha ricevuto lo 0 all'istante precedente era faulty a sua volta. Ripetiamo questa logica a ritroso per esattamente $F$ volte. All'istante $t = 0$ abbiamo dunque individuato già $F$ nodi faulty, il che significa che non può essere avvenuto un crash. Se un nodo avesse inviato uno 0 agli altri a $t = 0$, non avrebbe potuto crashare, percui a $t = 1$ tutti gli altri avrebbero dovuto necessariamente essere a loro volta 0. La contraddizione ci porta a dimostrare l'assunto.

![[assets/Screenshot 2024-11-15 174808.png|600]]

La dimostrazione appena fatta fornisce un'ulteriore garanzia a supporto della proprietà di agreement.
Possiamo ridurre il numero di messaggi inviati dal protocollo. Infatti, i messaggi utili sono solo gli 0, perché determinano il valore dell'and logico calcolato sui nodi. Ogni 0 può dunque essere mandato una sola volta per assolvere al proprio uso. Poi, trovandoci in un sistema sincrono, non è necessario usare i messaggi per la sincronizzazione tra le entità; la computazione terminerà semplicemente dopo $F + 1$ iterazioni.

- Messaggi inviati: il caso peggiore è quello in cui ogni nodo invia uno 0 a tutti i propri vicini, dunque i messaggi si riducono a $n \cdot (n - 1) \in O(n^2)$

- Tempo di esecuzione: le iterazioni rimangono $F + 1$, sempre per garantire la tolleranza a $F$ crash

I risultati che abbiamo ottenuto sono generalizzabili per insiemi di valori diversi da $\{0, 1\}$, per avvii non simultanei e per grafi generici quando $F$ è minore del grado di connettività.

###### Consensus in sistemi asincroni

Le restrizioni in questo caso sono:

- Connettività forte

- Grafo completo

- Fallimenti di tipo crash

- Conoscenza di $n$ e $F$

Possiamo definire un protocollo (detto di Ben-Or) randomizzato che realizza il consenso tollerando al più $F < \frac{n}{2}$ crash.
Il protocollo lavora in rounds successivi. Ad ogni messaggio è associato il numero $r$ del round in cui esso è stato generato ed un valore nell'insieme $\{0, 1\}$. Le entità tengono traccia del round che stanno eseguendo ed in base al numero di round associato ai messaggi ricevuti reagiscono diversamente.

![[assets/Screenshot 2024-11-15 180257.png|500]]

Ogni round si articola in due passi: nel primo ogni entità propone il proprio valore alle altre e nel secondo, in base alle proposte ricevute, ogni entità sceglie il valore da proporre al round successivo.

![[assets/Screenshot 2024-11-15 180402.png|750]]

Nel primo passo, l'iniziale boradcast raggiunge anche chi lo ha inviato. Ogni entità attende l'arrivo di $n - F$ messaggi di tipo $MyValue$. Se un numero di messaggi pari almeno alla maggioranza assoluta contiene lo stesso valore, l'entità invierà un messaggio $Propose$ in broadcast contenente proprio tale valore. Altrimenti, proporrà un valore indefinito.
Gli $n - F$ messaggi attesi sono sicuramente più di $\frac{n}{2} + 1$ (ovvero la maggioranza assoluta) perché:

$$\begin{aligned}
                    F < \frac{n}{2} \Rightarrow n - F > \frac{n}{2}
\end{aligned}$$

Nel secondo passo, tutte le entità si mettono in attesa di $n - F$ messaggi di $Propose$. Quando viene ricevuto almeno un valore non indefinito, l'entità $x$ lo imposta come proprio. Quando ci sono almeno $F + 1$ messaggi $Propose$ con lo stesso valore (non indefinito), $x$ decide per tale valore. Se tutti i valori di $Propose$ sono indefiniti, il prossimo valore di $x$ è determinato casualmente, con probabilità uniforme.
$F + 1$ messaggi sono al più $\frac{n}{2}$, perché:

$$\begin{aligned}
                    F < \frac{n}{2} \Rightarrow F + 1 \leq \frac{n}{2} < n - F
\end{aligned}$$

![[assets/Screenshot 2024-11-15 181853.png|1000]]

Ora verifichiamo le proprietà del protocollo:

- Non-trivialità: se tutti i nodi partono con il valore $v \in \{0, 1\}$, il primo step si conclude con la proposta di $v$ per ognuno di essi.
  Al secondo step i messaggi $Propose$ (tutti identici) saranno $n - F$, quindi più della soglia di $F + 1$ imposta sulla decisione. $v$ verrà infine deciso all'unanimità.

  ![[assets/Screenshot 2024-11-15 183550.png|600]]

  Possiamo generalizzare il fatto che, al generico round $r$, se un'entità vede una maggioranza assoluta di valori, devono vederla anche tutte le altre. Non è infatti possibile che le maggioranze siano due: questo implicherebbe un numero di nodi maggiore di $n$. Ne deduciamo che, quando verranno inviati i messaggi di $Propose$ alla fine del primo step, questi porteranno tutti lo stesso valore $v$

- Agreement: dobbiamo fare vedere che quando un nodo non faulty $x$ decide il valore $v$, lo fanno anche gli altri nodi non faulty.
  Nel secondo step, siccome ogni nodo riceve $n - F > F$ messaggi $Propose$, almeno uno di questi viene da un nodo non faulty. Il valore $v$ ad esso associato viene visto e diventa il valore di tutte le altre entità, che sono $n - F > \frac{n}{2}$ (cioè la maggioranza assoluta). Queste lo manderanno come $Propose$ alla fine del primo step del round successivo. Il valore $v$ verrà infine scelto all'unanimità nel secondo step

  ![[assets/Screenshot 2024-11-15 185935.png|1000]]

- Terminazione: il protocollo termina in un numero di rounds che è $O(2^n)$.
  Per quanto abbiamo visto finora, essenzialmente il protocollo termina al round successivo quando c'è un numero di $MyValue$ uguali sufficientemente alto (cioè la maggioranza assoluta). Quando ciò non accade, è possibile che il protocollo non termini al round successivo. Ogni entità sceglierà il proprio valore al round successivo in base ai messaggi $Propose$ ricevuti oppure casualmente.
  La probabilità $p$ che al passo successivo si abbia una maggioranza è più alta di quella $q$ che tutte le entità scelgano casualmente lo stesso valore, che la limita dal basso.

  $$\begin{aligned}
                          p \geq q = \frac{1}{2^n}
  \end{aligned}$$

  La probabilità di successo al round $r$ può essere scritta seguendo una distribuzione geometrica come:

  $$\begin{aligned}
                          P(r) = p \cdot (1 - p)^{r - 1}
  \end{aligned}$$

  In pratica si tratta del prodotto tra la probabilità di $r - 1$ insuccessi e quella di un successo.
  L'expected value di una distribuzione geometrica è:

  $$\begin{aligned}
                          \mathbb{E} (X) = \frac{1}{p}
  \end{aligned}$$

  In particolare, combinando il risultato con l'ipotesi fatta sul lower bound di $p$:

  $$\begin{aligned}
                          p \geq \frac{1}{2^n} \Rightarrow \mathbb{E} (X) = p^{-1} \leq 2^n
  \end{aligned}$$

Il protocollo può essere modificato per tollerare $F \leq \frac{n}{3}$ crash e terminare in un numero di rounds costante.

###### Consensus deterministico con fallimenti bizantini

> **Status d'esame da confermare.** Le slide ufficiali disponibili trattano integralmente questa parte, mentre gli appunti precedenti la indicavano come facoltativa. Viene quindi mantenuta come approfondimento verificato.

Nel modello asincrono l'impossibilità deterministica con un solo crash vale a maggior ragione per i guasti bizantini. In un sistema **sincrono completo**, invece, si può tollerare $F<n/3$ sotto le seguenti ipotesi: avvio simultaneo, identificativi distinti non falsificabili, conoscenza degli identificativi dei vicini e valori iniziali booleani.

**RegisteredMail.** Per registrare in modo coerente la proposta di uno 0 originata da $y$ al tempo $t$:

1. $y$ trasmette `(init, 0, id(y), t)`;
2. chi riceve un `init` valido direttamente da $y$ esattamente a $t+1$ trasmette `(echo, 0, id(y), t)`; messaggi con mittente, tempo o seconda registrazione incoerenti vengono ignorati;
3. chi raccoglie almeno $F+1$ `echo` distinti ritrasmette l'`echo`, se non lo ha già fatto: almeno uno dei mittenti è non faulty;
4. chi raccoglie almeno $n-F$ `echo` distinti accetta la proposta: almeno $n-2F$ provengono da entità non faulty.

Questa soglia garantisce che una proposta accettata da una entità non faulty si propaghi a tutte le altre senza permettere a un singolo bizantino di inventare identità o tempi.

**TellZero-Byz.** Il protocollo procede per stage $i=0,\ldots,F+2$, lunghi due unità di tempo.

- Al tempo 0 ogni entità non faulty con valore iniziale 0 avvia una sola RegisteredMail.
- Al tempo $2i$, per $1\le i\le F+1$, una entità non faulty che non ha ancora originato una proposta la avvia se entro quel momento ha accettato proposte da più di $F+i-1$ identità distinte.
- Al tempo $2(F+2)$ decide 0 se ha accettato almeno $2F+1$ proposte distinte, altrimenti decide 1.

Il protocollo termina per costruzione; le soglie e $F<n/3$ garantiscono non-trivialità e agreement. La durata è $O(F)$ e il conteggio delle slide è $O(n^3)$ messaggi nel caso peggiore. Il risultato si estende a domini finiti noti e, su grafi non completi, richiede connettività per nodi maggiore di $2F$.

###### Consensus problem con fallimenti bizantini

In questo paragrafo affrontiamo la versione randomizzata di Consensus che contempla fallimenti bizantini sui nodi. In particolare, un nodo bizantino è un nodo che ad un generico round $r$ può assumere un comportamento inaspettato, come l'invio ai vicini di valori differenti, per minare il corretto svolgimento del protocollo. Esiste anche una versione deterministica di questo protocollo, ma è facoltativa.
Imponiamo le seguenti restrizioni:

- Grafo completo

- Connettività forte

- Fallimenti bizantini

- Identificativi unici; i valori proposti, distinti dagli identificativi, appartengono a $\{0,1\}$

La dinamica del protocollo è simile alla versione di Consensus con fallimenti sui nodi (seppur in qualche misura sia più semplice, poiché mira a raggiungere un risultato più debole). Il protocollo tollera al più $F < \frac{n}{9}$ fallimenti bizantini.

![[assets/Screenshot 2024-11-20 092309.png|800]]

Al primo round ciascuna entità fa un broadcast del proprio valore con un messaggio $Propose$ e si mette in attesa di $n - F$ messaggi $Propose$. Se almeno $n - 2 \cdot F$ di essi contengono lo stesso valore, allora l'entità lo imposta come suo e decide. Altrimenti, se almeno $n - 4 \cdot F$ messaggi $Propose$ contengono lo stesso valore, lo imposta semplicemente come suo. Se vengono ricevuti meno di $n - 4 \cdot F$ messaggi $Propose$ con lo stesso valore, viene effettuata una scelta casuale con probabilità uniforme. Il tutto è ripetuto ciclicamente fino al raggiungimento del consenso.
Verifichiamo le proprietà come nel paragrafo sopra:

- Non-triviality: tutte le entità iniziano con lo stesso valore $v \in \{0, 1\}$. Tutte le entità non faulty propongono il proprio valore $v$ al primo round e ricevono almeno $n - F \geq n - 2 \cdot F$ proposte per $v$. Siccome, appunto, i messaggi contenenti $v$ sono più di $n - 2 \cdot F$, tutte le entità non faulty finiscono per decidere $v$

- Agreement: al generico round $r$ un'entità non faulty $x$ decide per il valore $v \in \{0, 1\}$. Ciò significa che ha ricevuto $n - F$ messaggi $Propose$, di cui almeno $n - 2 \cdot F$ contenevano $v$.
  Allo stesso round $r$, un'altra entità non faulty $y \neq x$ attende $n - F$ messaggi. Alcuni mittenti dei messaggi verso $x$ e verso $y$ sono comuni, ma ce ne possono essere al più $F$ diversi per le regole base dell'insiemistica. Inoltre, al più $F$ dei mittenti comuni possono essere bizantini, cioè aver inviato valori diversi ad $x$ e $y$.
  Se togliamo due volte $F$ (cioè gli $F$ potenziali nodi non in comune tra $x$ ed $y$ e gli $F$ potenziali nodi bizantini) agli $n - 2 \cdot F$ valori necessari alla decisione, troviamo:

  $$\begin{aligned}
                      n - 2 \cdot F - 2 \cdot F = n - 4 \cdot F
  \end{aligned}$$

  Questo è il numero minimo complessivo di messaggi $Propose$ giunti a $y$ che contengono $v$.
  A questo punto, $x$ ha deciso $v$ ed $y$ ha assunto $v$ (perché, come abbiamo detto, almeno $n - 4 \cdot F$ messaggi lo contenevano). Al round $r + 1$ tutte le entità riceveranno almeno $n - F \geq n - 2 \cdot F$ messaggi $Propose$ contenenti $v$ da parte delle entità non faulty e decideranno unanimemente per esso

- Terminazione: l'algoritmo termina in un numero atteso di passi che è $O(2^n)$.
  Osserviamo per prima cosa che al round $r$, tutti i messaggi $Propose$ mandati da entità non faulty con scelta non-casuale portano lo stesso valore $v$.
  Se al round $r$ un'entità non faulty $x$ ha scelto $v \in \{0, 1\}$ in modo non-casuale, significa che ha ricevuto almeno $n - 4 \cdot F$ proposte per $v$, delle quali $n - 5 \cdot F$ da entità non faulty.
  Allo stesso tempo, supponiamo che un'altra entità non faulty $y \neq x$ scelga $v^\prime \neq v$ in modo non-casuale. Seguendo lo stesso ragionamento che per $x$, anche $y$ deve avere ricevuto $n - 5 \cdot F$ proposte per $v^\prime$. Secondo queste supposizioni però, il numero di entità sarebbe pari a:

  $$\begin{aligned}
                      n \geq \underbrace{2 \cdot (n - 5 \cdot F)}_{non faulty} + \underbrace{F}_{faulty} = 2 \cdot n - 9 \cdot F = n + (n - 9 \cdot F) > n
  \end{aligned}$$

  La catena di uguaglianze e disuguaglianze è chiaramente impossibile, percui vale l'assunto.
  Come abbiamo visto relativamente all'agreement, quando un'entità non faulty decide, lo stesso fanno anche le altre ed il protocollo termina al round successivo. Come abbiamo visto, perché un'entità decida occorre che le arrivino $n - 2 \cdot F$ messaggi con uno stesso valore $v$. Affinché questo accada, tutte le entità non faulty che hanno scelto non-casualmente devono ricevere $v$ (appena dimostrato) e che tutte le altre devono scegliere casualmente $v$.
  La probabilità che tutte le entità non faulty scelgano casualmente lo stesso valore $v$ è $p = \frac{1}{2^n}$ e fornisce senz'altro un lower bound alla probabilità che le entità non faulty che si trova no a scegliere casualmente convergano su di un unico valore $v$. A questo punto, ripetendo lo stesso procedimento visto al paragrafo sopra, si determina il valore atteso della distribuzione geometrica e si trova che il protocollo è $O(2^n)$

Anche in questa versione di Consensus si può migliorare il protocollo tollerando al più $F < \frac{n}{500}$ fallimenti bizantini, terminando in un numero di rounds che è $O(n^{2.5})$.

## 6 Strutture dati distribuite

###### Introduzione

Le strutture dati distribuite devono innanzitutto essere scalabili, cioè garantire il supporto ad un numero variabile di entità da memorizzare.

###### Hash tables

Sono strutture dati che memorizzano i dati sotto la forma di coppie $(key, value)$. Una apposita funzione di hash mappa ogni chiave su un indice, o bucket, di un vettore; il valore associato alla chiave viene memorizzato nel bucket corrispondente. Presso ogni casella può essere posta una lista di trabocco che raccoglie più coppie in caso di collisione.

![[assets/Screenshot 2024-11-20 101146.png|600]]

La funzione di hash deve distribuire il più uniformemente possibile le chiavi sui differenti bucket.
In un contesto distribuito, le coppie $(key, value)$ sono dislocate su un insieme di nodi. Bisogna tenere ben presente che il numero di tali nodi non è noto e può variare dinamicamente.

###### Gli inizi

Alla fine degli anni '90 nacque Napster, un software per la libera condivisione di musica su Internet. Napster era realizzato con un indice centralizzato, che conteneva le informazioni su dove localizzare tutti i vari files musicali, che si trovavano distribuiti sui computer degli utenti. Un utente che volesse scaricare un file musicale interrogava l'indice centralizzato, che forniva tutte le informazioni necessarie al reperimento della risorsa. Il download coinvolgeva direttamente i due computers. Fu proprio Napster a coniare per primo il termine "peer-to-peer".

![[assets/Screenshot 2024-11-20 101658.png|600]]

Napster fu chiuso perché, trovandosi tutte le informazioni in un nodo centrale, si potevano accusare i proprietari di avere arrecato un danno su larga scala all'industria discografica.
Nel 2000 Gnutella introdusse un sistema completamente distribuito. Per unirsi al sistema, un nuovo computer doveva conoscerne almeno un altro già appartenente. Ogni computer conteneva una parte dei files ed era connesso con un numero limitato di vicini. Le query erano inviate ricorsivamente a tutti i vicini (similmente a flooding).
Gnutella costituiva di fatto una rete virtuale giacente sulla rete IP ("overlayed"). Due vicini sulla rete Gnutella non dovevano esserlo necessariamente sulla rete IP.

![[assets/Screenshot 2024-11-20 101837.png|1000]]

L'approccio completamente distribuito di Gnutella era robusto, ma il flooding tendeva a riempire la rete di richieste.
KaZaA (2001) adottò un approccio ibrido tra Napster e Gnutella, differenziando tra nodi ordinari (ON) e supernodi (SN).

![[assets/Screenshot 2024-11-20 102317.png|600]]

Gli ON erano collegati ciascuno ad un solo SN e gli SN comunicavano direttament tra loro. Per unirsi al sistema, un ON inviava una richiesta ad un SN condividendo la propria lista di files da condividere. Quando un ON richiedeva un file, mandava un messaggio al proprio SN, che rispondeva direttamente per gli ON ad esso connessi e diversamente doveva inoltrare richieste agli altri SN.
KaZaA, pur unendo i punti forti di Napster e Gnutella (meno flooding e più servers "centrali") univa anche i loro difetti, come i point of failure.
Nelle reti strutturate, ovvero quelle per le quali la struttura stessa determina dove si trovino nodi e dati, una ricerca può essere fatta in modo efficiente. In reti non strutturate, cioè nelle quali nodi e dati possono essere aggiunti ovunque, vi è invece la necessità di trovare un meccanismo che consenta ricerche parimenti efficienti. Le hash tables distribuite possono essere questo meccanismo.

![[assets/Screenshot 2024-11-20 104158.png|1000]]

###### Chord

Protocollo per organizzare la dislocazione delle chiavi di una hash map distribuita, che considera la rete overlayed come un anello. Nome od indirizzo IP dei nodi vengono passati ad una hash function, generando identificativi per ordinarli in senso crescente. Lo spazio delle chiavi va da 0 a $2^m - 1$, dove $m$ sono i bit di codifica degli identificativi.
Ogni nodo conosce solo il proprio successore sull'anello, ovvero quel nodo che ha l'identificativo immediatamente superiore. Il mapping delle chiavi avviene sullo stesso intervallo di valori degli identificatori. Quando una chiave ha un valore che non esiste nell'anello, la si assegna al nodo con identificativo immediatamente superiore.

![[assets/Screenshot 2024-11-26 111716.png|800]]

Chord usa SHA-1 per il mapping uniforme delle chiavi su identificatori da $m = 160$ bit. Quando un nodo riceve la richiesta di una chiave, se la possiede può rispondere direttamente, altrimenti invia in forward la richiesta al proprio successore.

![[assets/Screenshot 2024-11-26 112149.png|400]]

In questo modo, il protocollo può richiedere l'attraversamento dell'intero anello nel caso peggiore: la catena contiene al più $n$ nodi presenti, quindi usa $O(n)$ hop. Il valore $2^m$ è la dimensione dello spazio degli identificativi, non il numero di nodi effettivamente attraversati. In assenza di guasti e con puntatori ai successori corretti, il lookup raggiunge sempre il nodo responsabile.
Per ovviare a casi pessimi come quello descritto sopra, ogni nodo può tenere una tabella, detta "finger table", nella quale conservare informazioni su dove trovare chiavi con valori maggiori rispetto alla propria. Le entry sono tante quanti i bit degli identificativi: per $j=1,\ldots,m$, l'entry $j$ punta al successore di $(i+2^{j-1})\bmod 2^m$. Gli offset sono quindi $1,2,4,\ldots,2^{m-1}$; a ogni posizione è associato il nodo responsabile di quell'intervallo.

![[assets/Screenshot 2024-11-26 112658.png|400]]

In fase di look-up della fingertable, il nodo che riceve la richiesta può tentare di contattare direttamente il nodo che ne è in possesso sulla base alle proprie informazioni. L'unica accortezza alla ci si deve attenere è quella di inviare la richiesta al nodo con identificativo immediatamente inferiore a quello della richiesta. In questo modo non è possibile in alcun modo saltare il nodo che ne sia in possesso.

![[assets/Screenshot 2024-11-26 112958.png|400]]

In media, il numero di nodi da contattare è $log (n)$. Ogni hop teoricamente dovrebbe dimezzare la distanza dal nodo desiderato.
Cosa accade se uno o più nodi si aggiungono al sistema? Per semplificare l'esecuzione del protocollo, aggiungiamo anche il requisito di conoscenza del nodo precedente.
L'inserimento di un nuovo nodo nell'anello attraversa le seguenti fasi:

- Inizializzazione del nuovo nodo (predecessore/successore e fingertable)

- Aggiornamento di predecessore/successore e fingertable dei nodi esistenti

- Trasferimento delle chiavi assegnate al nuovo nodo

Questa procedura si può esegurie in un tempo che è $O(log^2 (n))$. Si possono utilizzare protocolli cosiddetti "di stabilizzazione" per rendere più semplice il procedimento, rilassando le performance ma comunque mantenendo la correttezza dei look-up. La stabilizzazione funziona bene quando aggiornamento e look-up sono "interleaved", cioè non possono avvenire allo stesso tempo.
All'inserimento di un nuovo nodo, se i successori sono aggiornati, il look-up è corretto se controlla il successore prima della fingertable. Il successore è infatti sicuramente corretto per ipotesi, mentre la fingertable potrebbe non esserlo.

![[assets/Screenshot 2024-11-26 114109.png|350]]

A cadenza regolare ogni nodo $A$ esegue `stabilize` interrogando il proprio successore corrente $B$ sul predecessore di $B$, diciamo $B'$. Se $B'$ appartiene all'intervallo circolare aperto $(A,B)$, allora $A$ aggiorna il proprio successore a $B'$. Infine $A$ notifica la propria esistenza al successore scelto; quest'ultimo aggiorna il proprio predecessore ad $A$ soltanto se $A$ è più vicino del predecessore già noto. Il valore restituito da $B$ è quindi il predecessore di $B$, non l'identificativo che $A$ dovrebbe aspettarsi di ricevere.

![[assets/Screenshot 2024-11-26 114626.png|1000]]

Per aggiungersi all'anello, un nuovo nodo deve conoscerne almeno uno che sia già all'interno del sistema. Alla fine dell'inserimento vengono trasferite dal successore del nuovo nodo a quest'ultimo le chiavi che esso può gestire. Poi, il successore le cancella. Da questo punto in poi, il nuovo nodo delega al proprio successore il look-up sulla fingertable. In questo modo il routing è ancora possibile. I nodi sull'anello vanno ad aggiornare periodicamente le proprie fingertables, selezionando una riga alla volta.
Un nodo può uscire dall'anello principalmente in due casi: fallimento e non.

![[assets/Screenshot 2024-11-26 120047.png|600]]

###### Chord: leave, failure e replicazione

L'uscita di un nodo può essere **pulita** oppure dovuta a un **fallimento** improvviso.

**Leave pulita.** Un nodo $x$ che può cooperare prima di uscire:

1. trasferisce al proprio successore tutte le chiavi di cui è responsabile;
2. comunica al predecessore il nuovo successore;
3. comunica al successore il nuovo predecessore.

I puntatori immediati restano così connessi; le finger table che contengono $x$ possono essere corrette gradualmente dai normali aggiornamenti periodici.

**Fallimento.** Un nodo guasto non può migrare chiavi né inviare notifiche. Per non dipendere da un solo puntatore, ogni nodo mantiene una **successor list** contenente i primi $r$ successori sull'anello. Se il successore non risponde, viene sostituito con la prima entry viva della lista e `stabilize` ricostruisce progressivamente i puntatori. Se durante un lookup non risponde una finger entry, si prova una finger precedente, cioè un'alternativa che non oltrepassi la chiave; per indici bassi si ricorre anche alla successor list. Il routing può quindi continuare, eventualmente con più hop.

La continuità del routing non recupera automaticamente i dati memorizzati soltanto sul nodo guasto. Per tollerare la perdita di nodi, ogni coppia chiave-valore viene replicata sui primi $r$ successori del nodo responsabile. Dopo un fallimento, il primo successore vivo diventa responsabile e la replicazione viene ricostituita in background. L'aumento di $r$ migliora la tolleranza ai guasti consecutivi, al costo di più memoria e traffico di aggiornamento.

In condizioni stabili la finger table mantiene lookup attesi in $O(\log n)$ hop; successor list e fallback preservano la raggiungibilità durante la stabilizzazione, mentre la replica è il meccanismo separato che preserva i valori.
$$
