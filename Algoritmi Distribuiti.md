# Algoritmi Distribuiti

## Indice

- [[#1 Introduzione|1 Introduzione]]
- [[#2 Teoria della Complessità|2 Teoria della Complessità]]
  - [[#2.1 Classificazione dei problemi per complessità|2.1 Classificazione dei problemi per complessità]]
  - [[#2.2 Approssimazioni di problemi NP-hard|2.2 Approssimazioni di problemi NP-hard]]
  - [[#TSP è un problema NP-hard|TSP è un problema NP-hard]]
  - [[#Inapprossimabilità del TSP generale|Inapprossimabilità del TSP generale]]
  - [[#Approssimazioni per il TSP metrico|Approssimazioni per il TSP metrico]]
  - [[#Branch and bound (facoltativo)|Branch and bound (facoltativo)]]
  - [[#Vertex Cover Problem|Vertex Cover Problem]]
  - [[#Self-reduction del Vertex Cover|Self-reduction del Vertex Cover]]
  - [[#Approssimazione greedy del Vertex Cover|Approssimazione greedy del Vertex Cover]]
  - [[#Relax & Round per Vertex Cover|Relax & Round per Vertex Cover]]
- [[#3 Algoritmi distribuiti|3 Algoritmi distribuiti]]
  - [[#3.1 Teoria della computazione distribuita|3.1 Teoria della computazione distribuita]]
  - [[#3.2 Leader election in alberi|3.2 Leader election in alberi]]
  - [[#3.3 Leader election in anelli|3.3 Leader election in anelli]]
  - [[#3.4 Leader election in grafi generici|3.4 Leader election in grafi generici]]
    - [[#Protocollo YO-YO|Protocollo YO-YO]]
  - [[#3.5 Leader election in anelli sincroni|3.5 Leader election in anelli sincroni]]
- [[#4 Algoritmi di routing|4 Algoritmi di routing]]
  - [[#Gossiping|Gossiping]]
  - [[#Iterating|Iterating]]
  - [[#Min-Hop routing|Min-Hop routing]]
  - [[#Algoritmo di Dijkstra|Dijkstra distribuito]]
- [[#5 Errori e fallimenti|5 Errori e fallimenti]]
  - [[#5.1 Consensus problem con fallimenti sui collegamenti|5.1 Consensus problem con fallimenti sui collegamenti]]
  - [[#5.2 Consensus problem con fallimenti sui nodi|5.2 Consensus problem con fallimenti sui nodi]]
    - [[#Consensus deterministico con fallimenti bizantini|Consensus deterministico con fallimenti bizantini]]
    - [[#Consensus problem con fallimenti bizantini|Consensus randomizzato con fallimenti bizantini]]
- [[#6 Strutture dati distribuite|6 Strutture dati distribuite]]
  - [[#Chord|Chord]]
  - [[#Chord: leave, failure e replicazione|Chord: leave, failure e replicazione]]
- [[#Appendice: Ricorrenze e Master Theorem (facoltativo)|Appendice: Ricorrenze e Master Theorem (facoltativo)]]
- [[#Vocabolario trasversale|Vocabolario trasversale]]

## Algoritmi e protocolli

### Algoritmi sequenziali

1. [[#^algorithm-1|Risoluzione Ciclo Hamiltoniano con TSP]]
2. [[#^algorithm-2|2-approssimazione di TSP]]
3. [[#^algorithm-3|Algoritmo di Christofides per TSP]]
4. [[#^algorithm-4|Algoritmo ricorsivo generico per B&B]]
5. [[#^algorithm-5|Self-reduction del Vertex Cover]]
6. [[#^algorithm-6|Algoritmo greedy per Vertex Cover]]
7. [[#^algorithm-7|Relax & Round per Vertex Cover]]

### Protocolli distribuiti

1. [[#Broadcast|Flooding / Broadcast]]
2. [[#Il wake-up problem|WFlood / Wake-up]]
3. [[#Protocollo Shout|SHOUT e SHOUT+]]
4. [[#Costruzione dello spanning tree tramite traversal|DFT e variante Visited/Ack]]
5. [[#Tecnica di saturazione|Saturazione su alberi]]
6. [[#All The Way|All The Way]]
7. [[#As Far As It Can|As Far As It Can]]
8. [[#Controlled Distance|Controlled Distance (Hirschberg–Sinclair)]]
9. [[#FloodMax|FloodMax su grafi generici]]
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

### Problema computazionale

Un **problema computazionale** $\Pi$ è una questione di carattere generale che dipende da parametri i cui valori non sono specificati. Si definisce tramite:

- **INPUT:** insieme $I$ dei possibili input;
- **OUTPUT:** insieme $S$ delle possibili soluzioni;
- **FUNZIONE:** $\Pi : I \to S$.

Un'**istanza** del problema si ottiene assegnando valori specifici ai parametri.
*Esempio: «ordinare una sequenza di numeri» è un problema; ordinare $\{5,2,9,1\}$ è una sua istanza.*

### Classificazione per tipo di soluzione

I problemi si classificano in base al tipo di soluzione cercata:

1. **Problemi Decisionali**: la risposta è binaria (**SÌ/NO**)
   - _Esempio:_ "Il numero $x$ è primo?" o "Esiste un cammino da A a B di lunghezza $\le K$?"

2. **Problemi di Ricerca**: cerchiamo una soluzione che soddisfi certe proprietà.
   - _Esempio:_ "Trovami un cammino da A a B".

3. **Problemi di Ottimizzazione**: Cerchiamo la soluzione **migliore** (minimo costo o massimo guadagno) tra tutte quelle ammissibili.
   - _Esempio:_ "Trovami il cammino _più breve_ da A a B".

### Algoritmi

Un **algoritmo** è una procedura generale per risolvere un problema definita tramite una **sequenza di passi finita**, **ben ordinata**, **non ambigua**, effettivamente **realizzabile** e che **termina** in tempo finito.

Un algoritmo per il problema $\Pi$ è **corretto** se, per ogni istanza $i \in I$, termina e produce in output $\Pi(i)$.

Fra gli algoritmi corretti interessa poi l'**efficienza**, cioè il costo in termini di risorse di calcolo, misurato rispetto a un modello e non a una particolare macchina:

- **tempo:** numero di operazioni elementari;
- **spazio:** numero di celle di memoria.

### Dimensione del problema

La **dimensione** misura la quantità di informazione necessaria per rappresentare un'istanza:

- **criterio di costo logaritmico:** numero di bit necessari per rappresentare l'input;
- **criterio di costo uniforme:** numero di elementi che compongono l'input.

### Analisi asintotica

Il tempo non si misura in secondi, ma come **numero di operazioni elementari** in funzione della dimensione dell'input $n$.

- **Caso peggiore (worst case):** massimo tempo richiesto da un'istanza di dimensione $n$. Rappresenta la garanzia fornita dall'algoritmo.
- **$O(f(n))$:** limite superiore asintotico.
- **$\Omega(f(n))$:** limite inferiore asintotico.
- **$\Theta(f(n))$:** ordine di crescita asintotico esatto, a meno di fattori costanti.

L'upper bound di un algoritmo corretto è anche un **upper bound del problema**. Un **lower bound del problema** deve invece valere per ogni algoritmo che lo risolve.

![[assets/Ordini di crescita - O-grande.png|900]]

La figura ordina i costi per crescita. Il colore accanto a ciascun tipo riprende quello della figura.

[[teacher_slides/0_intro_algorithm.pdf#page=11|Slide della docente, p. 11]]
Nella tabella, $f(n)$ è l'espressione mostrata nella figura come $O(f(n))$; la classificazione si riferisce a un costo che cresce effettivamente come $T(n)=\Theta(f(n))$. 
Infatti, il solo limite superiore $O(2^n)$ non basta a dire che un costo è esponenziale: anche $n^2$ appartiene a $O(2^n)$.

| Tipo di costo $f(n)$ | Nome nella figura | Valutazione della docente | Classificazione del costo $\Theta(f(n))$ |
| --- | --- | --- | --- |
| <span style="color:#6fae63">■</span> $1$ | costante <small>(sublineare)</small> | perfetto | polinomiale |
| <span style="color:#6fae63">■</span> $\log\log n$ | log log <small>(sublineare)</small> | perfetto | polinomiale <small>(anche se non è un polinomio)</small> |
| <span style="color:#6fae63">■</span> $\log n$ | logaritmico <small>(sublineare)</small> | perfetto | polinomiale <small>(anche se non è un polinomio)</small> |
| <span style="color:#c89b32">■</span> $\sqrt[c]{n}=n^{1/c}$, $c>1$ | sublineare | buono | polinomiale <small>(anche se non è un polinomio)</small> |
| <span style="color:#c89b32">■</span> $n$ | lineare | buono | polinomiale |
| <span style="color:#c89b32">■</span> $n\log n$ | $n\log n$ | buono | polinomiale <small>(anche se non è un polinomio)</small> |
| <span style="color:#d9838f">■</span> $n^2$ | quadratico | accettabile | polinomiale |
| <span style="color:#d9838f">■</span> $n^3$ | cubico | accettabile | polinomiale |
| <span style="color:#d9838f">■</span> $n^k$, $k\geq 1$ costante | polinomiale | accettabile | polinomiale |
| <span style="color:#a56790">■</span> $a^n$, $a>1$ costante | esponenziale | inaccettabile | superpolinomiale |
| <span style="color:#a56790">■</span> $n!$ | fattoriale | inaccettabile | superpolinomiale |

Qui **polinomiale** significa *limitato superiormente da $n^k$ per qualche esponente costante $k$*, non necessariamente *espresso da un polinomio*. Per esempio, $n\log n$ non è un polinomio, ma $n\log n\in O(n^2)$. Un costo è **superpolinomiale** se cresce più di $n^k$ per ogni $k$ costante: $a^n$, $n!$ e anche $n^n$ lo sono. Non tutti i costi superpolinomiali sono esponenziali: per esempio, $n^{\log n}$ supera ogni $n^k$, ma cresce meno di $a^n$ per ogni $a>1$ costante.

### Classificazione per difficoltà

In base al costo computazionale, i problemi si classificano in:

1. **Problemi trattabili (facili):** esiste un algoritmo che li risolve in tempo **polinomiale**. In altre parole, esiste una costante $k \ge 0$ tale che
   $$T(n) \in O(n^k).$$
   Sono polinomiali, per esempio, i costi $O(n)$, $O(n\log n)$ e $O(n^2)$.
   Per i problemi decisionali, questa è la classe $P$, che sarà definita formalmente nel capitolo successivo.
   - _Esempi:_ ordinamento, cammino minimo, costruzione di uno spanning tree.

2. **Problemi presumibilmente intrattabili (difficili):** non conosciamo un algoritmo di costo polinomiale, ma non è stato dimostrato che non esista.
   - _Esempio:_ la versione esatta del problema del commesso viaggiatore.

3. **Problemi intrattabili:** si può dimostrare che non esiste un algoritmo di costo polinomiale. Il costo necessario è quindi **superpolinomiale**, nel senso chiarito dalla tabella precedente.
   - _Esempi:_ produrre esplicitamente tutti i sottoinsiemi o tutte le permutazioni; Torre di Hanoi, se l'output richiesto è la sequenza completa delle mosse.
   - Un costo superpolinomiale può crescere molto rapidamente con la dimensione dell'input; per esempio, nei costi esponenziali o fattoriali anche un piccolo aumento dell'input può produrre un grande aumento del tempo.

4. **Problemi irrisolvibili:** si può dimostrare che non esiste alcun algoritmo risolutivo, indipendentemente dal costo.
   - _Esempio:_ **problema della fermata** (dato un algoritmo $A$ con input $D$, l'esecuzione di $A$ con input $D$ termina in tempo finito?).

### Perché il polinomiale è la soglia di trattabilità?

- Esistono pochi problemi trattabili per i quali si conoscono soltanto algoritmi polinomiali di grado alto.
- In molti problemi lo spazio delle soluzioni è esponenziale: trovare un algoritmo polinomiale significa “fare meglio” di un algoritmo di forza bruta.
- In molti problemi trattabili, le istanze worst case sono poche o si presentano con bassa probabilità; negli altri casi il costo è migliore.
- I costi superpolinomiali diventano rapidamente proibitivi al crescere della dimensione delle istanze.
- La distinzione tra costo polinomiale e superpolinomiale è stabile rispetto ai miglioramenti tecnologici.

La polinomialità è una nozione teorica di trattabilità: un algoritmo polinomiale di grado elevato o con costanti molto grandi può comunque essere poco pratico.

### Tesi di Church–Turing estesa

La classificazione di un problema come risolvibile in tempo polinomiale potrebbe dipendere dal computer con cui eseguiamo l'algoritmo? Per rispondere, serve un modello con cui descrivere e misurare un calcolo.

La **macchina di Turing** è un modello astratto: ha un nastro su cui legge e scrive simboli, una testina che si sposta sul nastro e uno stato interno. A ogni passo applica una regola che, in base allo stato e al simbolo letto, stabilisce cosa scrivere, dove spostarsi e quale sarà il nuovo stato. Per esempio, per aggiungere un `1` alla fine di `111`, può scorrere fino alla prima cella vuota, scrivere `1` e fermarsi.

Un computer attuale usa memoria, processori e istruzioni organizzati in modo diverso. Il collegamento è che **anche i suoi calcoli classici possono essere descritti come una sequenza di operazioni su informazioni memorizzate**. La macchina di Turing offre un modo preciso per rappresentare questi calcoli e contare i passi necessari; non è il progetto fisico di un computer moderno.

A questo punto possiamo porre due domande:

- **Calcolabilità:** un algoritmo può risolvere il problema? La tesi di Church–Turing ordinaria collega ciò che intendiamo intuitivamente per algoritmo a ciò che una macchina di Turing può calcolare.
- **Efficienza:** quanti passi richiede la soluzione al crescere dell'input? È la domanda rilevante quando distinguiamo il tempo polinomiale da quello superpolinomiale.

Per la seconda domanda, le slide della docente formulano la **tesi di Church–Turing estesa** così: modelli di calcolo diversi, ma ragionevoli, possono simularsi a vicenda con uno *slowdown* polinomiale. Questo significa che cambiare modello può aumentare il tempo di esecuzione, ma conserva la proprietà di essere risolvibile in tempo polinomiale. Per esempio, una simulazione che passa da un costo $O(n^2)$ a $O(n^5)$ è più lenta, ma resta polinomiale.

[[teacher_slides/0_intro_algorithm.pdf#page=20|Slide della docente, p. 20]]

Questa è la ragione per cui possiamo definire $P$ usando un modello preciso, come la macchina di Turing, e usare poi la nozione di tempo polinomiale anche per i comuni modelli di calcolo classici.

**Macchine deterministiche e non deterministiche.** In una macchina di Turing *deterministica*, lo stato e il simbolo letto fissano un'unica prossima mossa: ogni input segue un solo percorso di calcolo. In una macchina *non deterministica* possono esserci più mosse possibili; i percorsi formano un albero. L'input è accettato se **almeno un ramo** termina accettando. Nel tempo non deterministico si considera la lunghezza di un ramo nel caso peggiore, non la somma del lavoro di tutti i rami: per un costo polinomiale, ogni ramo deve terminare entro un numero polinomiale di passi.

![[assets/macchine-deterministiche-non-deterministiche.svg|1000]]

I rami rappresentano scelte alternative del modello teorico, non processori che lavorano contemporaneamente. Questa distinzione servirà per capire le classi $P$ e $NP$.

**Fin dove arriva il confronto?** CPU e GPU organizzano il lavoro in modo diverso; il parallelismo da solo non implica che un problema diventi risolvibile in tempo polinomiale. Il calcolo quantistico usa invece un modello diverso da quelli classici e non coincide con la macchina di Turing non deterministica: la versione più forte della tesi estesa non va applicata automaticamente a quel caso.

## 2 Teoria della Complessità

### 2.1 Classificazione dei problemi per complessità

#### Perché si considerano problemi decisionali

In questo capitolo consideriamo soprattutto **problemi decisionali**, nei quali ogni istanza richiede una risposta sì oppure no. La trattazione formale di questi problemi è più agevole e consente di trarre conclusioni utili anche per problemi di ricerca e di ottimizzazione.

Per esempio, dato un grafo $G=(V,E)$ e due vertici $s,v\in V$, il problema *Shortest Path* si può formulare in due modi:

- la versione di **ottimizzazione** chiede qual è la lunghezza del cammino minimo tra $s$ e $v$;
- la versione **decisionale**, dato anche un valore $k$, chiede se esiste un cammino tra $s$ e $v$ di lunghezza al più $k$.

#### La classe P

> [!definition] Classe di problemi P
> Insieme di problemi decisionali che possono essere risolti con un algoritmo di costo computazionale in tempo polinomiale nella dimensione dell'input.

[[teacher_slides/1_complexity theory.pdf#page=3|Slide della docente, p. 3]]

Per mostrare che un problema appartiene a $P$ basta esibire un algoritmo deterministico che lo risolve in tempo polinomiale.

#### La classe NP

> [!definition] Classe di problemi NP (Non-deterministic Polynomial-time)
> Insieme di problemi decisionali che possono essere verificati con un algoritmo verificatore di costo computazionale in tempo polinomiale nella dimensione dell'input.

[[teacher_slides/1_complexity theory.pdf#page=8|Slide della docente, p. 8]]

$P$ sta per *Polynomial-time*: riguarda la risoluzione in tempo polinomiale. $NP$ sta per *Non-deterministic Polynomial-time*: la $N$ significa *non-deterministico*, non “non polinomiale”. Nel seguito descriviamo la verifica attraverso certificati e verificatori; è equivalente alla formulazione con una macchina non deterministica.

#### Certificati e algoritmo verificatore

Un **certificato** è un'informazione aggiuntiva che può attestare che un'istanza ha risposta sì. Un **algoritmo verificatore** riceve l'istanza e una sequenza candidata come certificato e restituisce sì se l'istanza è positiva e la sequenza ne è una prova; altrimenti restituisce no.

> [!definition] Certificato per un'istanza positiva $i\in I_Y$ del problema $\Pi$
> Sequenza di caratteri (informazione aggiuntiva) di dimensione al massimo polinomiale nella dimensione dell'input che contiene l'evidenza del fatto che $i$ sia un'istanza positiva per $\Pi$.

> [!definition] Algoritmo verificatore
> Algoritmo decisionale che prende in input un'istanza $i\in I$ di un problema decisionale $\Pi$ e una sequenza di caratteri $C_i$ e restituisce SI se l'istanza $i$ è un'istanza positiva per $\Pi$, NO altrimenti.

[[teacher_slides/1_complexity theory.pdf#page=7|Slide della docente, p. 7]]

> [!definition] Verificare un problema
> Il problema $\Pi$ può essere verificato se valgono le due seguenti condizioni:
> 1. Per ogni istanza positiva $i$ del problema $\Pi$ esiste un certificato $C_i$ di dimensione polinomiale nella dimensione di $i$;
> 2. Esiste un algoritmo verificatore $A$ che risponde SI per ogni coppia $(i,C_i)$ tale che $i$ è un'istanza positiva di $\Pi$ e $C_i$ un suo certificato (polinomiale).

[[teacher_slides/1_complexity theory.pdf#page=8|Slide della docente, p. 8]]

Sia $p$ un polinomio che limita la lunghezza del certificato e sia $V$ un verificatore polinomiale. La condizione per l'appartenenza a $NP$ si può scrivere:

$$
x\text{ è positiva per }\Pi
\iff
\exists c:\ |c|\leq p(|x|)\ \land\ V(x,c)=\text{sì},
$$

La quantificazione esistenziale esprime che basta un certificato accettato per ogni istanza positiva. Per essere corretto, il verificatore deve inoltre rifiutare ogni certificato candidato per un'istanza negativa. Un NO su una singola coppia $(i,C_i)$ non dimostra che $i$ sia negativa: può essere sbagliato il certificato proposto. La definizione della docente a p. 8 esplicita la condizione sulle istanze positive; quella sulle istanze negative è necessaria per la correttezza della nozione.

Il certificato non deve essere unico. Nella formulazione non deterministica, la macchina sceglie un certificato candidato e lo verifica; accetta se almeno una scelta produce un certificato valido. Quindi l'appartenenza a $NP$ garantisce che i certificati positivi si possano verificare in tempo polinomiale, non che un algoritmo deterministico sappia trovarli in quel tempo.

#### Esempio: ciclo hamiltoniano

> [!problem] Ciclo hamiltoniano
> **Input:** un grafo semplice non orientato $G=(V,E)$.  
> **Output:** esiste in $G$ un ciclo che passa per tutti i vertici esattamente una volta?

[[teacher_slides/1_complexity theory.pdf#page=4|Slide della docente, p. 4]]

![[assets/ciclo-hamiltoniano.png|900]]

Se $V=\{a,b,c,d,e\}$ e il grafo contiene gli archi $\{a,b\},\{b,c\},\{c,d\},\{d,e\},\{e,a\}$, la sequenza $C=(a,b,c,d,e)$ certifica un ciclo hamiltoniano. In generale, il certificato è una sequenza $(v_1,\ldots,v_n)$ dei $n=|V|$ vertici. Il verificatore controlla che:

1. la sequenza contenga ogni vertice di $G$ esattamente una volta;
2. ogni coppia consecutiva $\{v_i,v_{i+1}\}$, per $1\leq i<n$, sia un arco;
3. anche l'arco di chiusura $\{v_n,v_1\}$ sia presente in $G$.

Per esempio, il verificatore rifiuta $C'=(a,b,d,c,e)$ se manca $\{b,d\}$. La sequenza contiene $n$ vertici, quindi ha dimensione polinomiale nell'input; i tre controlli si eseguono in tempo polinomiale. Questo prova che Ciclo Hamiltoniano appartiene a $NP$.

La verifica della sequenza proposta è rapida, mentre un algoritmo che riceve soltanto il grafo deve trovare una sequenza valida oppure stabilire che non esiste. Provare tutti gli ordinamenti richiede tempo fattoriale, ma questo dice soltanto che la ricerca esaustiva è lenta; non dimostra che ogni algoritmo lo sia. Ciclo Hamiltoniano è NP-completo, quindi un algoritmo polinomiale per risolverlo implicherebbe $P=NP$.

#### Relazione tra P e NP

Ogni problema in $P$ appartiene anche a $NP$: il verificatore può ignorare il certificato (per esempio la stringa vuota), eseguire l'algoritmo deterministico polinomiale che risolve il problema e restituirne la risposta.

> [!theorem] Teorema
> $P\subseteq NP$

[[teacher_slides/1_complexity theory.pdf#page=9|Slide della docente, p. 9]]

##### Dimostrazione

Sia $\Pi\in P$ e sia $A$ un algoritmo deterministico polinomiale che decide $\Pi$. Usiamo come verificatore l'algoritmo che, ricevuti l'istanza $i$ e il certificato vuoto, esegue $A(i)$ e restituisce la risposta di $A$. Il verificatore accetta tutte e sole le istanze positive, il certificato ha lunghezza zero e il tempo di esecuzione è polinomiale. Dunque $\Pi\in NP$.

Non sappiamo se $NP\subseteq P$. La domanda $P$ contro $NP$ è se ogni problema la cui risposta positiva si può verificare velocemente si possa anche risolvere velocemente. Stabilire se $P=NP$ oppure $P\ne NP$ rimane un problema aperto.

#### Perché servono le riduzioni

Una **riduzione** mostra come risolvere un problema usando un algoritmo per un altro. La direzione indica quale problema è almeno altrettanto difficile: se $A$ si riduce a $B$, un algoritmo efficiente per $B$ darebbe un algoritmo efficiente anche per $A$. Per dimostrare che $B$ è difficile, quindi, si riduce a $B$ un problema già noto come difficile.

#### Riduzione di Karp

> [!definition] Riduzione di Karp ($A\leq_p B$)
> Un problema decisionale $A$ è riducibile in tempo polinomiale al problema decisionale $B$ se:
> - ogni istanza di $A$ può essere trasformata in tempo polinomiale in un'istanza di $B$;
> - ogni istanza positiva di $A$ viene trasformata in un'istanza positiva di $B$;
> - ogni istanza negativa di $A$ viene trasformata in un'istanza negativa di $B$.

[[teacher_slides/1_complexity theory.pdf#page=11|Slide della docente, p. 11]]

In altre parole, una trasformazione polinomiale $f$ deve preservare la risposta per ogni istanza $x$:

$$
x\text{ è positiva per }A
\iff
f(x)\text{ è positiva per }B.
$$

La riduzione produce una sola istanza di $B$. Se $B\in P$, trasformiamo l'istanza di $A$ e poi usiamo l'algoritmo per $B$: così $A\in P$. Perciò, se $A\notin P$, allora $B\notin P$. Le implicazioni inverse non seguono: da $A\in P$ o da $B\notin P$ non si può concludere nulla, in generale, sul tempo necessario per l'altro problema. Se valgono entrambe le riduzioni $A\leq_p B$ e $B\leq_p A$, i problemi sono equivalenti rispetto alle riduzioni polinomiali. La riduzione è transitiva:

$$
A\leq_p B\ \land\ B\leq_p C\ \implies\ A\leq_p C.
$$

![[assets/riduzione-karp.png|1000]]

#### Problemi NP-completi

> [!definition] Classe di problemi NP-completi
> Un problema decisionale $A$ è NP-completo se:
> 1. $A\in NP$;
> 2. $\forall B\in NP : B\leq_p A$.

[[teacher_slides/1_complexity theory.pdf#page=17|Slide della docente, p. 17]]

Un problema NP-completo appartiene a $NP$ ed è almeno altrettanto difficile di ogni problema in $NP$. Per dimostrare che un problema $A$ è NP-completo:

1. si dimostra che $A\in NP$;
2. si sceglie un problema NP-completo noto $B$;
3. si dimostra $B\leq_p A$.

Infatti, per ogni $C\in NP$ vale $C\leq_p B$; per transitività, $C\leq_p A$. Il ciclo hamiltoniano è un esempio di problema NP-completo. Se un solo problema NP-completo ammettesse un algoritmo polinomiale, le riduzioni darebbero algoritmi polinomiali per tutti i problemi in $NP$, e quindi $P=NP$. Se invece si dimostrasse che un problema NP-completo non ha algoritmi polinomiali, seguirebbe $P\ne NP$.

#### SAT, il primo problema NP-completo

Cook e Levin dimostrarono che il problema SAT è NP-completo e fornisce il punto di partenza per le riduzioni.

> [!problem] SAT in forma normale congiuntiva
> **Input:** una formula in forma normale congiuntiva (FNC), cioè una congiunzione di clausole, ciascuna delle quali è una disgiunzione di letterali. Un letterale è una variabile booleana o la sua negazione.  
> **Output:** esiste un assegnamento di verità alle variabili che rende vera la formula?

[[teacher_slides/1_complexity theory.pdf#page=18|Slide della docente, p. 18]]

[Prova una formula in FNC](./widgets/sat-fnc)

Per esempio,

$$
(a\lor b\lor c)\land(\neg b\lor c)\land(\neg a\lor\neg b\lor c)
$$

è soddisfacibile: ponendo $c=\text{vero}$, tutte le clausole sono vere. Un assegnamento costituisce un certificato, verificabile valutando la formula in tempo polinomiale.

#### Problemi NP-hard

> [!definition] Classe di problemi NP-hard
> Un problema $A$ è NP-hard se: $\forall B\in NP : B\leq_p A$.

[[teacher_slides/1_complexity theory.pdf#page=21|Slide della docente, p. 21]]

La condizione è la seconda della definizione di NP-completezza; per NP-hard non si richiede però che $A$ appartenga a $NP$. Un problema NP-hard può essere decisionale, di ricerca o di ottimizzazione. Le classi $P$, $NP$ e NP-completo classificano qui problemi decisionali; quando si estende NP-hard a problemi non decisionali, va specificata una nozione di riduzione coerente.

#### Riduzione di Turing e problemi di ottimizzazione

La riduzione di Karp trasforma un'istanza decisionale in una sola istanza decisionale e ne preserva sì/no. Per collegare problemi decisionali a problemi di ricerca o di ottimizzazione si usa una riduzione con **oracolo**. Un oracolo per $B$ è un sottoprogramma che restituisce correttamente una soluzione di $B$. Si scrive $A\leq_T^p B$ se un algoritmo polinomiale per $A$ può interrogare un oracolo per $B$; può effettuare più interrogazioni e scegliere le successive in base alle risposte ricevute.

Per mostrare che un problema di ottimizzazione $A$ è NP-hard, si può ridurre a esso un problema NP-completo decisionale $B$, costruendo $B\leq_T^p A$. Nel caso più semplice l'algoritmo trasforma l'istanza, interroga una volta l'oracolo per $A$ e converte la soluzione restituita nella risposta sì/no per $B$.

![[assets/riduzione-turing.png|1000]]

Per esempio, il TSP decisionale chiede se esiste un tour di costo al più $k$ ed è NP-completo; la versione di ottimizzazione chiede invece un tour di costo minimo ed è NP-hard. Un oracolo per la seconda versione consente di risolvere la prima confrontando con $k$ il costo minimo restituito. L'appartenenza a $NP$ della versione di ottimizzazione non è definita nella classificazione classica, perché $NP$ contiene problemi decisionali.

I problemi NP-hard hanno applicazioni importanti. A seconda dell'istanza si possono usare algoritmi esatti per casi piccoli, euristiche, algoritmi paralleli o distribuiti e algoritmi di approssimazione, che cercano in tempo polinomiale una soluzione ammissibile con garanzie sullo scarto rispetto all'ottimo.

#### Mappa per il ripasso

![[assets/mappa-classi-riduzioni.svg|1200]]

Per scegliere la nozione da applicare, identifica prima il tipo di output: risposta sì/no, soluzione ammissibile oppure soluzione ottima. $P$, $NP$ e NP-completo classificano problemi decisionali. NP-hard si applica anche a ricerca e ottimizzazione, purché si specifichi la riduzione usata.

| Classe | Ambito | Idea chiave |
|---|---|---|
| $P$ | Decisione | Risolvibile in tempo polinomiale |
| $NP$ | Decisione | Certificati positivi verificabili in tempo polinomiale, senza accettare certificati per istanze negative |
| NP-completo | Decisione | Appartiene a $NP$ ed è NP-hard |
| NP-hard | Anche ricerca e ottimizzazione | Ogni problema in $NP$ si riduce al problema considerato, secondo una riduzione specificata |

| Riduzione | Ambito | Meccanismo |
|---|---|---|
| **Karp** $A\leq_p B$ | Decisione $\to$ decisione | Una trasformazione polinomiale che preserva entrambe le risposte |
| **Turing** $A\leq_T^p B$ | Anche ricerca e ottimizzazione | Una o più interrogazioni, anche adattive, a un oracolo per $B$ |
### 2.2 Approssimazioni di problemi NP-hard

Qui consideriamo problemi di **ottimizzazione** per cui trovare sempre l'ottimo è difficile. La nozione di NP-hardness e la distinzione dalle classi decisionali sono in [[#Problemi NP-hard]]. Un algoritmo di approssimazione restituisce in tempo polinomiale nella dimensione dell'input una soluzione **ammissibile**, cioè che rispetta i vincoli del problema, ma non necessariamente ottima; ne garantisce la qualità rispetto all'ottimo.

#### Algoritmi di approssimazione

[[teacher_slides/1_complexity theory.pdf#page=23|Slide della docente, p. 23: motivazione e definizione generale]]
[[teacher_slides/1_complexity theory.pdf#page=57|Slide della docente, pp. 57–60: esempio specifico di Vertex Cover]]
[[teacher_slides/based_by/Cormen Introduction to Algorithms.pdf#page=1127|Cormen, cap. 35, pp. 1106–1107: rapporto generale minimo/massimo]]

Sia $\Pi$ un problema di ottimizzazione, sia $I$ una sua istanza di dimensione $n$, e indichiamo con:

- $OPT(I)$ il valore della soluzione ottima;
- $ALG(I)$ il valore della soluzione restituita dall'algoritmo $ALG$.

Assumiamo che i costi delle soluzioni ammissibili siano **non negativi**. Le disuguaglianze seguenti sono la definizione della garanzia e valgono anche quando $OPT(I)=0$:

Il **fattore di approssimazione** $\rho(n) \geq 1$ (spesso indicato anche con $\alpha$) misura la qualità garantita nel caso peggiore. Diciamo che $ALG$ è una **$\rho$-approssimazione** se, per ogni istanza $I$ di dimensione $n$:

- per un problema di **minimizzazione**,
  $$
  ALG(I) \leq \rho(n) \cdot OPT(I);
  $$

- per un problema di **massimizzazione**,
  $$
  ALG(I) \geq \frac{OPT(I)}{\rho(n)}.
  $$

Quando i valori nei rapporti sono positivi, queste disuguaglianze equivalgono rispettivamente a

$$
\frac{ALG(I)}{OPT(I)}\leq\rho(n)
\qquad\text{e}\qquad
\frac{OPT(I)}{ALG(I)}\leq\rho(n).
$$

Quando è definito, il rapporto effettivo sulla singola istanza è almeno $1$. Il fattore $\rho(n)$ è una garanzia uniforme: deve valere per ogni istanza di dimensione $n$. Se $\rho=1$, l'algoritmo è esatto; a parità di problema, un fattore più vicino a $1$ dà una garanzia migliore. Il fattore può essere costante oppure dipendere da $n$.

> **Esempio — come si legge il fattore**
> - **Minimizzazione:** se su un'istanza $OPT(I)=10$ e l'algoritmo restituisce una soluzione di costo $ALG(I)=12$, il rapporto ottenuto è $12/10=1{,}2$. Una garanzia di fattore $2$ permetterebbe, su questa istanza, qualsiasi costo al più $20$: non significa quindi che l'algoritmo debba costare esattamente il doppio dell'ottimo.
> - **Massimizzazione:** se $OPT(I)=100$ e $ALG(I)=80$, il rapporto è $100/80=1{,}25$. Una $2$-approssimazione garantirebbe soltanto $ALG(I)\geq 100/2=50$, quindi il valore $80$ rispetta ampiamente la garanzia.
>
> Questi calcoli misurano la qualità su una singola istanza. Per dimostrare che l'algoritmo ha davvero fattore $\rho$, la disuguaglianza deve valere per **tutte** le istanze.

La garanzia è di **worst-case**: sulle istanze con rapporto definito, il rapporto effettivo può essere migliore di $\rho$, ma non deve mai superarlo. Se $OPT(I)=0$ in un problema di minimizzazione, la disuguaglianza richiede $ALG(I)=0$. In massimizzazione, se $OPT(I)=0$, la non negatività dei costi implica che anche ogni soluzione ammissibile ha valore zero; la disuguaglianza resta valida. In questi casi non si usa il rapporto, che avrebbe denominatore nullo. Per i casi con valori positivi, la definizione del rapporto segue l'ipotesi usata da Cormen, che assume costi positivi per tutte le soluzioni.

#### Dimostrare un fattore mediante un lower bound

Per conoscere la qualità esatta della soluzione restituita su un'istanza di **minimizzazione** dovremmo calcolare il rapporto

$$
\frac{ALG(I)}{OPT(I)}.
$$

Il problema è che $OPT(I)$ è proprio il valore difficile da calcolare. Per un'istanza con $OPT(I)>0$, se riusciamo a calcolare un **lower bound** positivo, cioè un valore più facile da ottenere e sicuramente non superiore all'ottimo, possiamo usarlo al suo posto nel denominatore:

$$
0<LB(I) \leq OPT(I)
$$

Poiché la soluzione restituita è ammissibile in un problema di minimizzazione, $OPT(I)\leq ALG(I)$. Inoltre $LB(I)>0$ e $LB(I)\leq OPT(I)$, quindi

$$
\frac{ALG(I)}{OPT(I)}
\leq
\frac{ALG(I)}{LB(I)}.
$$

Il rapporto con il lower bound è quindi una valutazione **prudente**: può essere maggiore del rapporto reale, ma non può sottostimarlo. Se riusciamo a dimostrare che, per ogni istanza con $LB(I)>0$,

$$
\frac{ALG(I)}{LB(I)}\leq \rho(n),
$$

allora anche il rapporto reale soddisfa

$$
\frac{ALG(I)}{OPT(I)}\leq \rho(n).
$$

Equivalentemente, per queste istanze basta provare la catena

$$
ALG(I) \leq \rho(n)\cdot LB(I)
\leq \rho(n)\cdot OPT(I).
$$

Per stabilire un fattore valido su tutte le istanze, quelle con $OPT(I)=0$ vanno controllate separatamente usando la disuguaglianza di garanzia senza divisione. Il rapporto con il lower bound dà una garanzia che può essere peggiore del rapporto effettivo. Nei prossimi algoritmi il lower bound sarà ottenuto, per esempio, da un matching o da un rilassamento lineare; per la massimizzazione si usa invece un upper bound su $OPT(I)$.

> **Esempio — confrontarsi con un limite noto**
> Supponiamo di avere, per una certa istanza di minimizzazione, una soluzione di costo $ALG(I)=18$ e un lower bound $LB(I)=12$. Anche senza calcolare l'ottimo sappiamo che
> $$
> 12=LB(I)\leq OPT(I)\leq ALG(I)=18.
> $$
> Inoltre $18=\frac{3}{2}\cdot 12$, quindi
> $$
> ALG(I)\leq \frac{3}{2}\,LB(I)\leq \frac{3}{2}\,OPT(I).
> $$
> Il rapporto reale potrebbe essere migliore: se, per esempio, $OPT(I)=15$, allora vale soltanto $18/15=1{,}2$. Il valore $1{,}5$ è quindi una **garanzia**, non necessariamente il rapporto effettivo.

### TSP è un problema NP-hard

> [!problem] Problema del commesso viaggiatore (TSP)
>
> **Input:** un grafo completo con archi pesati.
>
> **Output:** un ciclo hamiltoniano di costo minimo (costo = somma dei pesi sugli archi).

Qui consideriamo la versione di ottimizzazione $TSP_{opt}$ su un grafo completo non diretto: il costo di un ciclo è la somma dei pesi dei suoi archi. Nella dimostrazione della docente sono ammessi archi di costo $0$; la riduzione usa direttamente i pesi $0/1$.

> [!theorem] Teorema
> Il problema del commesso viaggiatore è NP-hard

[[teacher_slides/1_complexity theory.pdf#page=24|Slide della docente, p. 24]]
[[teacher_slides/1_complexity theory.pdf#page=25|Slide della docente, p. 25]]
[[teacher_slides/1_complexity theory.pdf#page=26|Slide della docente, p. 26]]

**Come lo dimostriamo.** Usiamo il problema NP-completo del **Ciclo hamiltoniano** ($HC$). Costruiamo una riduzione di Turing: trasformiamo un'istanza di $HC$ in un'istanza TSP, interroghiamo una volta un risolutore esatto per TSP e dalla risposta decidiamo SI o NO per $HC$.

> [!problem] Problema del ciclo hamiltoniano (HC)
>
> **Input:** un grafo non diretto $G=(V,E)$.
>
> **Output:** esiste un ciclo hamiltoniano in $G$?

![[assets/riduzione-hc-tsp-04-decisione.svg|900]]

**Modello della riduzione.** Consideriamo un'istanza di $HC$ con grafo semplice e almeno tre vertici. Costruiamo un grafo completo con pesi $0/1$ e lo passiamo al risolutore TSP esatto.

**In simboli.** Vogliamo dimostrare $HC\leq_T^p TSP_{opt}$: la costruzione trasforma l'input, la chiamata all'oracolo trova il tour ottimo e il controllo finale lo converte nella risposta SI/NO. Le operazioni esterne all'oracolo devono essere polinomiali.

#### Strategia della riduzione

$HC$ chiede se un ciclo **esiste** nel grafo dato; il TSP chiede quale ciclo abbia **costo minimo** in un grafo completo. Per collegarli, trasformiamo la presenza o l'assenza degli archi di $G$ in costi. Completiamo il grafo e assegniamo:

- costo **$0$** agli archi già presenti in $G$;
- costo **$1$** agli archi aggiunti per renderlo completo.

Il costo di un tour conta quanti archi aggiunti usa. Se il costo minimo è $0$, il tour non usa archi aggiunti ed è un ciclo Hamiltoniano di $G$; se è almeno $1$, ogni tour usa un arco che mancava in $G$. Il costo ottimo rivela così la risposta a $HC$.

![[assets/Pasted image 20260921114935.png]]

#### Costruzione e uso della riduzione

Partiamo da un'istanza $G=(V,E)$ di $HC$ e costruiamo l'istanza TSP $G'=(V,E',c)$:

1. Manteniamo gli stessi vertici $V$.
2. Inseriamo in $E'$ un arco per ogni coppia **distinta e non ordinata** di vertici: $E'=\{\{u,v\}:u,v\in V,\ u\neq v\}$. Così $G'$ è completo.
3. Assegniamo a ogni arco il costo

   $$
   c(\{u,v\})=
   \begin{cases}
   0 & \text{se }\{u,v\}\in E,\\
   1 & \text{se }\{u,v\}\notin E.
   \end{cases}
   $$

Passiamo $G'$ al risolutore esatto e riceviamo un tour ottimo $H^*$ di costo $K=\sum_{e\in H^*}c(e)$. Rispondiamo **SI** se $K=0$ e **NO** altrimenti. La procedura costruisce il grafo pesato, effettua una chiamata al TSP esatto e controlla il costo restituito.

![[assets/riduzione-hc-tsp-01-istanze.svg|900]]

#### Studio della complessità

Con $n=|V|$, $G'$ ha $n(n-1)/2$ archi. Misuriamo qui il lavoro **esterno** al risolutore TSP:

- **Tempo:** con una matrice di adiacenza per $G$, costruire e pesare $G'$ richiede $O(n^2)$; calcolare $K$ dal tour richiede $O(n)$. Se $G$ è dato con liste di adiacenza, la matrice si prepara in $O(n^2+|E|)$.
- **Spazio:** matrice e grafo completo richiedono $O(n^2)$; i pesi $0/1$ occupano un numero costante di bit.
- **Oracolo:** una sola chiamata al risolutore esatto. Il suo tempo non è incluso nel costo della riduzione con oracolo.

#### Dimostrazione

1. **Da $HC$ a costo zero.** Se $G$ ha un ciclo hamiltoniano, lo stesso ciclo in $G'$ usa solo archi di costo $0$. Tutti i costi sono non negativi, quindi l'ottimo è $K=0$.
2. **Da costo zero a $HC$.** Se l'ottimo TSP è $K=0$, il tour ottimo usa solo archi di costo $0$, cioè archi di $E$, ed è hamiltoniano anche in $G$.
3. **Conclusione.** Abbiamo $K=0\iff G$ ha un ciclo hamiltoniano. La costruzione, il controllo e la singola chiamata all'oracolo costituiscono una riduzione polinomiale $HC\leq_T^p TSP_{opt}$. Poiché $HC$ è NP-completo, $TSP_{opt}$ è NP-hard.

**Spiegazione.** Se $G$ non ha un ciclo hamiltoniano, ogni tour nel grafo completo $G'$ usa almeno un arco aggiunto: il suo costo, e quindi l'ottimo $K$, è almeno $1$.

La relazione chiave è:
$$
\operatorname{OPT}_{TSP}(G')=0
\iff
G\text{ contiene un ciclo Hamiltoniano}.
$$

![[assets/riduzione-hc-tsp-02-ciclo-costo-zero.svg|900]]

La figura seguente mostra il caso negativo su un'altra istanza.

![[assets/riduzione-hc-tsp-03-senza-ciclo.svg|900]]

**Precisazione nostra sulle slide.** Nel riquadro del caso NO a p. 26 compare «un arco del grafo originale $G$»; qui deve essere **un arco aggiunto**, cioè di $E'\setminus E$, altrimenti il costo non sarebbe positivo. La frase di p. 24 che parla di «assurdo sotto l'ipotesi $P\ne NP$» spiega la conseguenza condizionale dell'esistenza di un risolutore polinomiale: l'enunciato NP-hard e la riduzione appena dimostrata non richiedono tale ipotesi.

Lo pseudocodice compatta la procedura già descritta:

**Algorithm 1 Risoluzione Ciclo Hamiltoniano con TSP** ^algorithm-1

> 1. **function** HCtoTSP($G$)
> 2.  $E^\prime \gets \{\{u, v\} : u, v \in V, u \neq v\}$<br>
> 3.  **for all** $\{u,v\}$ in $E^\prime$ **do**
> 4.   **if** $\{u,v\} \in E$ **then**
> 5.    $c(\{u,v\}) \gets 0$
> 6.   **else**
> 7.    $c(\{u,v\}) \gets 1$
> 8.   **end if**
> 9.  **end for**
> 10.  $G^\prime \gets (V, E^\prime, c)$; $H^* \gets TSP(G^\prime)$
> 11.  $K \gets \sum_{e\in H^*}c(e)$
> 12.  **if** $K = 0$ **then**
> 13.   **return** sì
> 14.  **else**
> 15.   **return** no
> 16.  **end if**
> 17. **end function**

### Inapprossimabilità del TSP generale

Il problema è il TSP di ottimizzazione su grafi completi con costi positivi, senza vincolo di disuguaglianza triangolare. La riduzione da ciclo hamiltoniano in [[#TSP è un problema NP-hard]] distingue le istanze SI e NO tramite il costo **ottimo**, quindi richiede un risolutore esatto. Qui chiediamo se un tour garantito entro un fattore costante dall'ottimo possa comunque decidere $HC$: assegniamo agli archi aggiunti un costo abbastanza grande da superare anche il margine concesso dall'approssimazione.

> [!theorem] Teorema
> Non esiste un algoritmo di approssimazione polinomiale per il problema del commesso viaggiatore che abbia fattore di approssimazione costante, a meno che $P=NP$.

[[teacher_slides/1_complexity theory.pdf#page=68|Slide della docente, p. 68]]
[[teacher_slides/1_complexity theory.pdf#page=69|Slide della docente, p. 69]]

#### Dimostrazione

La dimostrazione è per assurdo. Supponiamo che esista un algoritmo polinomiale $A$ con fattore di approssimazione costante $r\geq1$. Usiamolo per decidere il problema NP-completo del ciclo Hamiltoniano. Data un'istanza $G=(V,E)$ di quest'ultimo problema, costruiamo il grafo completo $G'=(V,E')$: gli archi già presenti in $G$ costano $1$, quelli aggiunti costano $K$, scelto in modo che $K>r|V|$:

$$
c(e)=
\begin{cases}
1 & \text{se } e\in E,\\
K & \text{se } e\notin E.
\end{cases}
$$

Nelle slide si sceglie $K=r|V|+1$. Per garantire che il peso sia un intero codificabile anche quando $r$ è una costante reale, fissiamo un intero costante $R\geq r$ e usiamo $K=R|V|+1$; resta $K>r|V|$. Per $r=2$ possiamo scegliere $R=2$, come nella figura sotto. Il costo $1$ rende positivo l'ottimo quando $G$ ha un ciclo Hamiltoniano; il costo $K$ separa i due casi anche se $A$ restituisce un tour soltanto approssimato.

1. **Caso SI.** Se $G$ contiene un ciclo Hamiltoniano, in $G'$ possiamo usare soltanto archi originali: il tour costa $|V|$. Poiché ogni tour ha $|V|$ archi e ciascuno costa almeno $1$, questo è l'ottimo. Per la garanzia di $A$, il tour restituito costa **al massimo $r|V|$**.
2. **Caso NO.** Se $G$ non contiene un ciclo Hamiltoniano, ogni tour di $G'$ usa almeno un arco aggiunto. Gli altri $|V|-1$ archi costano almeno $1$ ciascuno, quindi ogni tour costa almeno

  $$K+(|V|-1)>r|V|.$$

  Anche il tour restituito da $A$ costa dunque **più di $r|V|$**.

La figura istanzia i due casi con gli stessi quattro vertici, $r=2$, $K=9$ e soglia comune $r|V|=8$: nel caso SI il tour di costo $4$ è accettato, nel caso NO ogni tour costa almeno $12$. Gli archi tratteggiati sono altri archi aggiunti al grafo completo, non usati nei tour evidenziati.

![[assets/tsp-inapprossimabilita-due-casi.png|1000]]

3. **Conclusione.** La soglia è $r|V|$: confrontando con essa il costo del tour prodotto da $A$, potremmo decidere in tempo polinomiale se $G$ ha un ciclo Hamiltoniano. Ne seguirebbe $P=NP$; dunque, se $P\neq NP$, l'algoritmo $A$ non può esistere.

#### Complessità della riduzione

Il grafo completo ha $|V|(|V|-1)/2$ archi: assegnare i costi richiede $O(|V|^2)$ operazioni nel modello a costo uniforme. Poiché $R$ è costante, bastano $O(\log |V|)$ bit per rappresentare $K=R|V|+1$. Anche considerando la scrittura dei pesi, la trasformazione resta quindi polinomiale.

Il risultato riguarda il **TSP generale**: i costi costruiti non soddisfano necessariamente la disuguaglianza triangolare e quindi non esclude approssimazioni costanti per il TSP metrico.

### Approssimazioni per il TSP metrico

Qui sfruttiamo la disuguaglianza triangolare per ottenere garanzie di approssimazione costanti per una restrizione del TSP generale: il **TSP metrico** su grafi completi non diretti con costi positivi. La prova di inapprossimabilità in [[#Inapprossimabilità del TSP generale]] usa archi di costo $1$ e archi di costo $K$, e può violare questa proprietà, quindi riguarda il TSP generale.

#### Problema e modello

> [!problem] Problema del Commesso Viaggiatore con disuguaglianza triangolare ($TSP_{dt}$)
>
> **Input:** Un grafo non diretto completo $G=(V,E)$; una funzione costo positiva sugli archi del grafo $c:E\to\mathbb{R}^{+}$ che rispetta la disuguaglianza triangolare.
>
> **Output:** Un ciclo hamiltoniano su $G$ di costo minimo.

[[teacher_slides/1_complexity theory.pdf#page=69|Slide della docente, p. 69]]

Per un sottografo o multigrafo $F$, indichiamo con $cost(F)$ la somma dei costi dei suoi archi, contati con la loro molteplicità. La condizione sui costi è

$$
\forall u,v,z\in V:\qquad c(u,z)\leq c(u,v)+c(v,z).
$$

Per i costi positivi della specifica, la triangolare implica anche la disuguaglianza per cammini con più archi dimostrata sotto. Nelle prove di lower bound useremo solo che questi costi sono non negativi.

#### Dalla riduzione $0/1$ ai pesi metrici $1/2$

La prova di [[#TSP è un problema NP-hard|NP-hardness del TSP]] usa i pesi $0/1$ delle slide della docente. Qui facciamo un'**osservazione aggiuntiva**: la stessa idea può produrre istanze metriche, mantenendo difficile la ricerca dell'ottimo esatto. ^tsp-pesi

Prendiamo tre vertici $u,v,w$: gli archi $uv$ e $vw$ appartengono al grafo originale, mentre $uw$ è stato aggiunto per completarlo.

![[assets/tsp-pesi-01-12-triangolo.svg|1000]]

- **Pesi $0/1$ della prova nelle slide:** $c(uv)=c(vw)=0$ e $c(uw)=1$. La triangolare richiederebbe $1\leq0+0$, che è falso. Quella costruzione non garantisce istanze metriche.
- **Pesi $1/2$ dell'osservazione aggiuntiva:** assegniamo $1$ agli archi originali e $2$ a quelli aggiunti. Per ogni terna, il lato diretto costa al massimo $2$ e gli altri due insieme almeno $2$: la disuguaglianza triangolare vale. I costi sono anche positivi, come richiesto dalla specifica del TSP metrico.

Ogni tour ha $|V|$ archi: passando da $0/1$ a $1/2$ il costo di ciascun tour aumenta di $|V|$. Nell'istanza metrica l'ottimo è quindi $|V|$ se e solo se il grafo originale ha un ciclo hamiltoniano. Questa è una deduzione dalla riduzione precedente, **non una variante presentata nelle slide**: mostra la NP-hardness della soluzione esatta del TSP metrico. La disuguaglianza triangolare permette invece gli *shortcut* usati nelle approssimazioni che seguono.

> **Esempio — uno shortcut**
> Se $c(A,B)=3$, $c(B,C)=4$ e $c(A,C)=6$, percorrere $A\to B\to C$ costa $3+4=7$, mentre lo shortcut diretto $A\to C$ costa $6$. Saltare $B$ non aumenta quindi il costo. Se invece fosse $c(A,C)=9$, lo shortcut sarebbe più costoso: proprio questo caso è escluso dalla disuguaglianza triangolare.

#### Strumenti usati dagli algoritmi

> [!definition] Definizione
> Dato un grafo $G=(V,E)$, un ciclo euleriano è un cammino chiuso che passa esattamente una volta per tutti gli archi del grafo.

> [!theorem] Teorema
> Dato un grafo $G$, esiste un cammino euleriano in $G$ se e solo se tutti i nodi del grafo hanno grado pari. Se esiste, il ciclo può essere trovato in tempo polinomiale.

[[teacher_slides/1_complexity theory.pdf#page=69|Slide della docente, p. 69]]

**Precisazione nostra.** Nell'enunciato della docente la connettività è implicita. Nella formulazione generale, un multigrafo non diretto ammette un ciclo euleriano se e solo se tutti i vertici di grado non nullo appartengono alla stessa componente connessa e hanno grado pari. Nei due algoritmi seguenti questa ipotesi è soddisfatta perché il multigrafo contiene un MST.

> [!theorem] Teorema
> Sia $G$ un grafo con archi pesati tale che la funzione costo sugli archi soddisfi la proprietà triangolare. Dato un cammino semplice $C=\langle v_1,\ldots,v_{k+1}\rangle$ di $k+1$ nodi e $k$ archi in $G$, abbiamo che
> $$
> c((v_1,v_{k+1}))\leq \sum_{i=1}^{k}c((v_i,v_{i+1})),
> $$

[[teacher_slides/1_complexity theory.pdf#page=70|Slide della docente, p. 70]]

Nel TSP metrico $G$ è completo, quindi per ogni coppia di vertici esiste l'arco diretto usato nello shortcut.

##### Dimostrazione

La prova è per induzione sul numero $k$ di archi del cammino.

1. Per $k=1$ la tesi è un'uguaglianza; per $k=2$ è la disuguaglianza triangolare.
2. Sia $k\geq3$ e supponiamo vera la tesi per cammini di $k-1$ archi. Applicandola al prefisso $\langle v_1,\ldots,v_k\rangle$ e poi usando la triangolare sugli archi $(v_1,v_k)$ e $(v_k,v_{k+1})$, otteniamo
   $$
   c((v_1,v_{k+1}))\leq c((v_1,v_k))+c((v_k,v_{k+1}))\leq \sum_{i=1}^{k}c((v_i,v_{i+1})).
   $$
   Questo prova il passo induttivo.

Il lemma garantisce che sostituire un cammino con l'arco diretto tra i suoi estremi non aumenta il costo. La completezza garantisce che quell'arco esista; applicando l'operazione per saltare le visite ripetute si ottiene un ciclo Hamiltoniano di costo non maggiore.

#### Algoritmo di 2-approssimazione

> **Status per l'esame — non svolto nell'AA 2025/26.** L'analisi resta utile come preparazione della prova di Christofides.

L'idea è costruire un minimum spanning tree $T^*$, raddoppiarne gli archi per rendere pari ogni grado, calcolare un ciclo euleriano e applicare gli shortcut ai vertici già visitati.

La figura mostra in sequenza l'MST $T^*$, il ciclo euleriano $E$ sul multigrafo con archi raddoppiati e il ciclo Hamiltoniano $H$ ottenuto mediante shortcut; per chiarezza non disegna gli altri archi del grafo completo.

![[assets/2-approx.jpg|1000]]

**Algorithm 2 2-approssimazione di TSP** ^algorithm-2

> 1. **function** 2-approx($G$)
> 2.  $T^* \gets MSTPrim(G)$
> 3.  $G^\prime \gets doubleEdges(T^*)$
> 4.  $E \gets EulerTour(G^\prime)$<br>
> 5.  $H \gets shortcutRepeatedVertices(E)$
> 6.  **return** $H$
> 7. **end function**

**Realizzabilità e terminazione.** Il raddoppio degli archi conserva la connettività di $T^*$ e raddoppia il grado di ogni vertice; tutti i gradi di $G'$ sono quindi pari e il ciclo euleriano $E$ esiste. Poiché $G$ è completo, ogni shortcut usa un arco esistente; il teorema sul costo degli shortcut in [[#Strumenti usati dagli algoritmi]] garantisce che il costo non aumenti. MST, ciclo euleriano e scansione di $E$ sono tutti calcolabili in tempo polinomiale, quindi l'algoritmo termina in tempo polinomiale e restituisce un ciclo Hamiltoniano.

> [!theorem] Teorema
> L'algoritmo è una due approssimazione.

[[teacher_slides/1_complexity theory.pdf#page=71|Slide della docente, p. 71]]

##### Dimostrazione

Il ciclo $E$ usa due volte ogni arco di $T^*$ e gli shortcut non aumentano il costo, dunque

$$
cost(H)\leq cost(E)=2\,cost(T^*).
$$

Rimuovendo un arco da $H^*$ si ottiene uno spanning tree $T$. I costi non negativi danno $cost(T)\leq cost(H^*)$; poiché $T^*$ è un MST, $cost(T^*)\leq cost(T)$. Quindi

$$
cost(T^*)\leq cost(T)\leq cost(H^*).
$$

Combinando i due bound otteniamo la catena

$$
cost(H)\leq cost(E)=2\,cost(T^*)\leq 2\,cost(T)\leq 2\,cost(H^*).
$$

quindi l'algoritmo è una **2-approssimazione**.

**Tightness dell'analisi.** Il fattore 2 è asintoticamente tight per questo algoritmo. Per $n\geq5$, considera il grafo completo in cui gli archi della stella centrata in 1 e quelli del ciclo $(1,2,\ldots,n,1)$ costano 1; tutti gli altri costano 2. L'MST può essere la stella di costo $n-1$. Un ordine euleriano sfavorevole può dare, dopo gli shortcut, un tour con $n-2$ archi di costo 2 e due archi di costo 1; la figura mostra un'istanza di questa famiglia.

![[assets/2-approx-Pagina-2.jpg|1000]]

Il tour restituito può quindi costare $2n-2$. Poiché ogni arco costa almeno 1 e il ciclo $(1,2,\ldots,n,1)$ costa $n$, quest'ultimo è ottimo:

$$
\frac{cost(H)}{cost(H^*)}=\frac{2n-2}{n}=2-\frac{2}{n}\xrightarrow{n\to\infty}2.
$$

#### Algoritmo di Christofides

Per il TSP metrico, un albero di copertura minimo costa al più un tour ottimo privato di un arco, quindi fornisce un lower bound sull'ottimo. La [[#Algoritmo di 2-approssimazione|2-approssimazione]] rende pari ogni grado raddoppiando l'intero MST; Christofides aggiunge invece archi soltanto ai vertici di grado dispari e garantisce un fattore di approssimazione $3/2$. Il ciclo euleriano risultante viene trasformato in un tour mediante gli shortcut definiti in [[#Strumenti usati dagli algoritmi]].

Un **matching** è un insieme di archi a due a due privi di estremi comuni. Un **perfect matching** copre tutti i vertici: ciascun vertice è incidente a esattamente un arco del matching. Un numero pari di vertici è una condizione necessaria; in un grafo completo è anche sufficiente.

![[assets/Screenshot 2024-10-01 111804.png|500]]

Si calcola un MST $T^*$ e si considera l'insieme $U$ dei suoi vertici di grado dispari. Sul sottografo completo $G[U]$ si trova un **minimum-weight perfect matching** $M^*$.

![[assets/christof1.png|800]]

Unendo come multinsieme gli archi di $T^*$ e $M^*$ si ottiene un multigrafo euleriano $F$. Dal suo ciclo euleriano $E$ si ricava infine il ciclo Hamiltoniano $H$ mediante shortcut.

![[assets/christof2.png|700]]

**Algorithm 3 Algoritmo di Christofides per TSP** ^algorithm-3

> 1. **function** Christofides-approx($G$)
> 2.  $T^* \gets MSTPrim(G)$
> 3.  $U \gets getOddDegreeNodes(T^*)$
> 4.  $G^\prime \gets getInducedSubgraph(G, U)$
> 5.  $M^* \gets minimumWeightPerfectMatching(G^\prime)$<br>
> 6.  $F \gets multisetUnion(T^*, M^*)$<br>
> 7.  $E \gets EulerTour(F)$<br>
> 8.  $H \gets shortcutRepeatedVertices(E)$
> 9.  **return** $H$
> 10. **end function**

**Perché l'algoritmo è sempre eseguibile.** Per il lemma della stretta di mano,

$$
\sum_{v\in V}\deg(v)=2|E|,
$$

quindi ogni grafo non diretto ha un numero pari di vertici di grado dispari. Ne segue che $|U|$ è pari e, poiché $G[U]$ è completo, esiste un perfect matching; quello di costo minimo può essere calcolato in tempo polinomiale.

Ogni vertice di $U$ riceve esattamente un arco aggiuntivo da $M^*$ e passa da grado dispari a grado pari; i vertici fuori da $U$ conservano grado pari. Inoltre $F$ è connesso perché contiene lo spanning tree $T^*$. Esiste dunque un ciclo euleriano $E$. Completezza e disuguaglianza triangolare permettono infine di trasformarlo mediante shortcut in un ciclo Hamiltoniano $H$ senza aumentarne il costo. Tutti i passi sono polinomiali; il più oneroso è il calcolo del minimum-weight perfect matching.

> [!theorem] Teorema
> L'algoritmo di Christofides ha un fattore di approssimazione uguale a $3/2$.

[[teacher_slides/1_complexity theory.pdf#page=73|Slide della docente, p. 73]]
[[teacher_slides/1_complexity theory.pdf#page=74|Slide della docente, p. 74]]

##### Dimostrazione

Rimuovendo un arco dal tour ottimo si ottiene uno spanning tree; per minimalità dell'MST e positività dei costi, vale il lower bound

$$
cost(T^*)\leq cost(H^*).
$$

Consideriamo ora l'ordine in cui il tour ottimo $H^*$ visita i vertici di $U$. Applicando gli shortcut fra visite consecutive si ottiene un ciclo $\Gamma$ sui soli vertici di $U$ tale che

$$
cost(\Gamma)\leq cost(H^*).
$$

Poiché $|U|$ è pari, gli archi di $\Gamma$, contati con la loro molteplicità, si possono ripartire alternandoli in due perfect matching $M_1$ e $M_2$ di $G[U]$. Se $|U|=2$, $\Gamma$ è formato da due occorrenze dello stesso arco: ciascun matching contiene una occorrenza, quindi $M_1$ e $M_2$ coincidono come insieme di archi ma i loro costi sommano correttamente il costo di $\Gamma$.

![[assets/christof3.png|1000]]

Essendo $M^*$ un perfect matching di costo minimo,

$$
2\,cost(M^*)\leq cost(M_1)+cost(M_2)=cost(\Gamma)\leq cost(H^*),
$$

e pertanto

$$
cost(M^*)\leq \frac{cost(H^*)}{2}.
$$

Il ciclo euleriano contiene esattamente gli archi di $T^*$ e di $M^*$, mentre gli shortcut non aumentano il costo. Di conseguenza,

$$
\begin{aligned}
cost(H)&\leq cost(E)\\
       &=cost(T^*)+cost(M^*)\\
       &\leq cost(H^*)+\frac{cost(H^*)}{2}\\
       &=\frac{3}{2}\,cost(H^*).
\end{aligned}
$$

Christofides è quindi una **$3/2$-approssimazione** per il TSP metrico. Il passaggio decisivo rispetto alla 2-approssimazione è che, invece di aggiungere un'altra copia dell'intero MST, rende pari i gradi aggiungendo un matching che costa al più metà dell'ottimo.

### Branch and bound (facoltativo)

> **Status per l'esame — approfondimento facoltativo (indicazione dell'utente).** Anche l'applicazione al TSP e il lower bound basato sull'1-tree fanno parte di questo approfondimento. L'1-tree è trattato nella dispensa della docente dedicata a Branch and Bound per TSP, pp. 101–104, ma non risulta come argomento autonomo nelle altre parti delle slide disponibili.

Il **Branch and Bound** cerca una soluzione di costo minimo esplorando gruppi di soluzioni possibili. Il *branching* suddivide un gruppo in gruppi più piccoli; il *bounding* calcola un limite inferiore al costo di tutte le soluzioni del gruppo. L'algoritmo conserva il costo $UB$ della migliore soluzione ammissibile trovata finora (*current best solution*) e, per ogni sottoinsieme $S$, calcola un lower bound $LB(S)$. Se $LB(S)\geq UB$, nessuna soluzione in $S$ può migliorare quella corrente, quindi il ramo viene scartato (*pruning*). I sottoinsiemi generati dal branching devono coprire tutte le soluzioni ammissibili del padre, ma possono sovrapporsi.

[[teacher_slides/1_complexity theory.pdf#page=97|Slide della docente, pp. 97–100]]

![[assets/Screenshot 2024-10-02 110633.png|900]]

Quando non è ancora stata trovata una soluzione ammissibile, poniamo $UB=\infty$: nessun lower bound finito può allora eliminare il ramo. Se $S$ contiene una sola soluzione ammissibile, l'algoritmo ne valuta il costo e aggiorna $UB$ e la soluzione corrente $BCS$ quando il costo è minore. Se $S$ è vuoto, il ramo termina senza aggiornamenti. Negli altri casi, il branching genera figli che contengono complessivamente tutte le soluzioni ammissibili di $S$; i figli possono sovrapporsi. La rappresentazione di ciascun figlio deve progredire verso un caso terminale, secondo una misura finita della rappresentazione (nell'esempio TSP, il numero di archi diminuisce a ogni passo). Questa condizione esclude cicli nella ricerca e assicura la terminazione.

La visita può essere in profondità, in ampiezza o guidata da una stima. Il seguente pseudocodice mostra una visita ricorsiva in profondità per un problema di minimo. $BCS$ e $UB$ sono condivisi tra le chiamate; all'inizio $BCS=null$ e $UB=\infty$. La condizione sul lower bound presuppone che $LB(S)$ sia valido per tutte le soluzioni ammissibili di $S$.

**Algorithm 4 Algoritmo ricorsivo generico per B&B** ^algorithm-4

> 1. $BCS \gets null$
> 2. $UB \gets \infty$<br>
> 3. **function** B&B($S$)
> 4.  **if** $S$ è vuoto **then**<br>
> 5.   **return**
> 6.  **end if**
> 7.  **if** $lowerBound(S) \geq UB$ **then**<br>
> 8.   **return**
> 9.  **end if**
> 10.  **if** $S$ rappresenta una sola soluzione ammissibile **then**<br>
> 11.   **if** $cost(S) < UB$ **then**<br>
> 12.    $BCS \gets S$
> 13.    $UB \gets cost(S)$<br>
> 14.   **end if**
> 15.  **else**
> 16.   **for all** $S_i$ in $branch(S)$ **do**
> 17.    B&B($S_i$)
> 18.   **end for**
> 19.  **end if**
> 20.  **return**
> 21. **end function**
> 22. **call** B&B($S_{\mathrm{iniziale}}$); **return** $BCS$

L'albero di ricerca mostra come i sottoinsiemi vengono suddivisi e scartati. In una foglia che rappresenta una singola soluzione si valuta il costo effettivo; una foglia vuota non contiene soluzioni da valutare.

![[assets/Screenshot 2024-10-02 110148.png|600]]

Il calcolo di un singolo lower bound o branching può richiedere tempo polinomiale, ma ciò non rende polinomiale l'intera ricerca: nel caso peggiore può essere necessario visitare un numero esponenziale di sottoinsiemi o valutare quasi tutte le soluzioni. Se la ricerca si interrompe dopo aver trovato una soluzione di costo $UB$, si consideri il lower bound globale $LB$, definito come il minimo tra $UB$ e i lower bound dei rami ancora rilevanti (quelli non scartati e non ancora risolti). Se esiste una soluzione corrente, vale

$$LB\leq OPT\leq UB,$$

dove $OPT$ è il costo ottimo; se non restano rami rilevanti, i rami sono stati scartati o risolti e la soluzione corrente è già ottima. La soluzione corrente ha quindi errore additivo $UB-OPT\leq UB-LB$. Si può fermare l'esecuzione dopo un tempo fissato e usare il divario per stimare l'errore, oppure arrestarla quando il divario è al più una soglia scelta.

#### TSP in chiave branch and bound (facoltativo)

Consideriamo il TSP su un grafo completo non diretto iniziale $G=(V,E)$, con costi degli archi non negativi. Un nodo dell'albero di ricerca è associato a un sottografo $G'=(V,E')$, con $E'\subseteq E$, e rappresenta l'insieme dei cicli hamiltoniani contenuti in $G'$. La radice corrisponde a $G$. I sottografi dei nodi successivi possono non essere completi. Se $G'$ è disconnesso oppure contiene un vertice di grado minore di $2$, non contiene cicli hamiltoniani e il ramo è vuoto.

[[teacher_slides/1_complexity theory.pdf#page=101|Slide della docente, pp. 101–104]]

Per calcolare un lower bound in un ramo non vuoto, scegliamo un vertice $v$. Consideriamo il sottografo indotto da $V\setminus\{v\}$ e troviamo un minimum spanning tree $T^*$ al suo interno. Poi scegliamo in $G'$ i due archi distinti meno costosi incidenti a $v$, indicati con $e_1$ ed $e_2$. Se il sottografo indotto non ammette uno spanning tree, oppure se in $G'$ non ci sono due archi distinti incidenti a $v$, il ramo non contiene cicli hamiltoniani. Altrimenti, l'unione di $T^*$ con $e_1,e_2$ è un **1-tree rispetto a $v$**.

> [!definition] 1-Tree
> Given a graph $G=(V,E)$ and a vertex $v\in V$, a 1-Tree for vertex $v$ is given by a spanning tree for vertices in $V\setminus\{v\}$ plus two distinct edges of $G$ having $v$ as an endpoint.

In altre parole, un 1-tree rispetto a $v$ è uno spanning tree sui vertici diversi da $v$, più due archi distinti incidenti a $v$.

![[assets/Screenshot 2024-10-01 150520.png|700]]

Il costo di questo 1-tree fornisce il lower bound

$$LB=cost(T^*)+cost(e_1)+cost(e_2).$$

Infatti, ogni ciclo hamiltoniano $H$ contenuto in $G'$ passa per $v$. Eliminando $v$ e i due archi del ciclo incidenti a $v$, resta un cammino $P$ che attraversa tutti i vertici di $V\setminus\{v\}$ e quindi è uno spanning tree sui vertici di quel sottografo. Poiché $T^*$ è un minimum spanning tree,

$$cost(P)\geq cost(T^*).$$

Inoltre, i due archi $e',e''$ di $H$ incidenti a $v$ sono distinti; dato che $e_1,e_2$ sono i due archi distinti meno costosi incidenti a $v$ in $G'$, vale

$$cost(e')+cost(e'')\geq cost(e_1)+cost(e_2).$$

Sommando le due disuguaglianze si ottiene

$$\begin{aligned}
cost(H)&=cost(P)+cost(e')+cost(e'')\\
&\geq cost(T^*)+cost(e_1)+cost(e_2)=LB.
\end{aligned}$$

Il bound vale dunque per tutti i cicli hamiltoniani rappresentati dal nodo. Se il 1-tree calcolato è un ciclo hamiltoniano, il suo costo è proprio $LB$; poiché ogni ciclo nel sottografo costa almeno $LB$, quel ciclo è ottimo **nel sottografo $G'$** e può aggiornare la soluzione corrente. Non si conclude necessariamente che sia ottimo nell'istanza iniziale $G$.

![[assets/Screenshot 2024-10-02 152221.png|700]]

Se il 1-tree non è un ciclo hamiltoniano, scegliamo nel 1-tree un vertice $w$ di grado almeno $3$. Sia $F$ l'insieme di **tutti gli archi di $G'$** incidenti a $w$, non soltanto quelli presenti nel 1-tree. Per ogni $e_i\in F$ creiamo un figlio eliminando quell'arco:

$$G_i=(V,E'\setminus\{e_i\}).$$

Ogni ciclo hamiltoniano rappresentato dal padre usa esattamente due archi incidenti a $w$. Siccome $w$ ha almeno tre archi incidenti nel padre, ogni ciclo ne omette almeno uno e resta quindi rappresentato in almeno un figlio. I figli possono sovrapporsi: un ciclo può omettere più di uno degli archi di $F$ e appartenere perciò a più figli.

![[assets/Screenshot 2024-10-02 152514.png|700]]

Il calcolo del bound e la costruzione dei figli richiedono tempo polinomiale per ogni nodo; il numero complessivo di nodi visitati può però essere esponenziale.

### Vertex Cover Problem

#### Problema e modelli

> [!definition] Definizione
> Dato un grafo $G=(V,E)$, un Vertex Cover $V'\subseteq V$ è un insieme di vertici in $V$ che copre tutti gli archi di $E$; ovvero, tale che
> $$
> \forall (u,v)\in E:\quad u\in V'\ \mathrm{OR}\ v\in V'.
> $$

> [!problem] Problema del Vertex Cover (VC)
>
> **Input:** Grafo $G=(V,E)$.
>
> **Output:** Vertex Cover di cardinalità minima.

[[teacher_slides/1_complexity theory.pdf#page=55|Slide della docente, p. 55]]

Nel seguito $G$ è non orientato e chiamiamo $C$ il vertex cover, invece di $V'$, per non confonderlo con l'insieme dei vertici. La condizione di copertura equivale a

$$
\forall (u,v)\in E:\quad u\in C\ \vee\ v\in C.
$$

L'insieme $V$ è sempre un vertex cover; il problema consiste nel trovarne uno di cardinalità minima. Si distinguono quindi:

- **versione di ottimizzazione** $VC_{opt}$: trovare un vertex cover $C^*$ tale che $|C^*|=\min\{|C|:C\text{ è un vertex cover di }G\}$;
- **versione decisionale** $VCD$: dati $G$ e un intero $k\leq |V|$, stabilire se esista un vertex cover di cardinalità al più $k$.

![[assets/vertex_covers.png|500]]

> [!theorem] Teorema
> Il problema del Vertex Cover è NP-Hard.

[[teacher_slides/1_complexity theory.pdf#page=55|Slide della docente, p. 55]]

#### Dimostrazione

Il problema $VCD$ è NP-completo: una soluzione proposta si verifica in tempo polinomiale controllando la cardinalità e verificando che ogni arco abbia almeno un estremo selezionato; la NP-hardness è un risultato noto. Per dimostrare la NP-hardness di $VC_{opt}$, riduciamo $VCD$ a $VC_{opt}$.

**Schema della riduzione.** L'istanza è la coppia $(G,k)$. Passiamo il grafo $G$ a un oracolo per $VC_{opt}$ e confrontiamo con $k$ la cardinalità della copertura restituita.

![[assets/vertex-cover-riduzione-vcd-vc.png|850]]

È una riduzione di Turing con una chiamata a un oracolo di ottimizzazione, non una riduzione di Karp tra problemi decisionali.

L'oracolo restituisce una copertura minima $C^*$ di $G$. Rispondiamo `YES` se e solo se $|C^*|\leq k$: questa condizione equivale alla risposta positiva di $VCD$. La riduzione effettua una sola chiamata all'oracolo e un confronto polinomiale, dunque $VCD\leq_T^p VC_{opt}$. Ne segue che $VC_{opt}$ è NP-hard.

### Self-reduction del Vertex Cover

> **AA 2025/26 — facoltativo.** Le dispense correnti presentano questa self-reduction come approfondimento facoltativo.

Per **Vertex Cover** si cerca una copertura di cardinalità minima in un grafo non orientato; la definizione e le versioni decisionale e di ottimizzazione sono in [[#Vertex Cover Problem]]. Qui usiamo un risolutore per la versione decisionale $VCD$: dato $(G,k)$, risponde se esiste una copertura di cardinalità al più $k$.

> [!theorem] Teorema
> $VC\leq_P VCD$.

[[teacher_slides/1_complexity theory.pdf#page=56|Slide della docente, p. 56]]
[[teacher_slides/1_complexity theory.pdf#page=57|Slide della docente, p. 57]]

#### Dimostrazione

Vale anche la riduzione nella direzione opposta: usando un oracolo decisionale $A(G,k)$ possiamo determinare sia la cardinalità ottima sia i vertici di una soluzione che la realizza. Questa trasformazione è una riduzione di Turing in tempo polinomiale, perché effettua più chiamate adattive all'oracolo.

##### Fase 1 — cardinalità ottima

La proprietà interrogata è monotona: se $G$ ha un vertex cover di cardinalità al più $k$, allora ne ha uno di cardinalità al più $k'$ per ogni $k'\geq k$. Una ricerca binaria nell'intervallo $[0,|V|]$ trova quindi il minimo $k^*$ tale che $A(G,k^*)=\mathrm{YES}$ usando $O(\log |V|)$ chiamate.

##### Fase 2 — ricostruzione

Manteniamo un grafo corrente $G_c$, il budget residuo $k$ e un insieme $U$ di vertici non ancora esaminati. Per ogni vertice $v$ proviamo temporaneamente a rimuoverlo:

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

Se la risposta alla riga 7 è `YES`, esiste una copertura del grafo corrente che contiene $v$: si sceglie $v$ e restano da selezionare al più $k-1$ vertici in $G_c-v$. Se la risposta è `NO`, nessuna copertura di $G_c$ con cardinalità al più $k$ e compatibile con le scelte già fatte può contenere $v$; il vertice viene soltanto marcato come esaminato e **non** si modifica $G_c$. Questo ultimo dettaglio è essenziale: eliminare definitivamente anche nel caso `NO` potrebbe far dimenticare archi che la soluzione deve ancora coprire.

L'invariante è che il grafo corrente possiede un vertex cover di cardinalità al più pari al budget residuo $k$. Quando non restano archi, $C$ copre tutti gli archi eliminati dalle scelte effettuate. La ricostruzione usa al più $|V|$ chiamate all'oracolo; insieme alla ricerca binaria, il totale è $O(|V|+\log |V|)$, quindi polinomiale.

### Approssimazione greedy del Vertex Cover

L'obiettivo è trovare, in un grafo non orientato $G=(V,E)$, una copertura $C$ che contenga almeno un estremo di ogni arco e sia vicina alla cardinalità minima $|C^*|$; si veda [[#Vertex Cover Problem]] per la specifica completa. Le tre scelte seguenti condividono l'idea di selezionare elementi finché tutti gli archi sono coperti, ma hanno garanzie diverse.

[[teacher_slides/1_complexity theory.pdf#page=58|Slide della docente, p. 58]]
[[teacher_slides/1_complexity theory.pdf#page=59|Slide della docente, p. 59]]
[[teacher_slides/1_complexity theory.pdf#page=60|Slide della docente, p. 60]]

Un algoritmo greedy costruisce la soluzione incrementalmente. Per Vertex Cover, tuttavia, la scelta locale è determinante: due idee naturali producono sempre una copertura, ma non garantiscono un fattore costante; scegliere opportunamente degli archi porta invece a una 2-approssimazione.

#### Prima scelta: un vertice arbitrario

La prima euristica seleziona un vertice arbitrario di grado positivo, lo aggiunge alla copertura ed elimina gli archi incidenti, ripetendo finché non rimangono archi. Con liste di adiacenza e opportune marcature, il costo è $O(|V|+|E|)$ e la soluzione è ammissibile, ma il rapporto di approssimazione non è limitato da una costante.

Si consideri una stella $S_k$ con un centro $c$ e $k$ foglie. L'ottimo è $C^*=\{c\}$, di cardinalità $1$; con scelte sfavorevoli, l'euristica può invece selezionare tutte le $k$ foglie. Il rapporto è quindi

$$
\frac{|C|}{|C^*|}=k,
$$

che cresce linearmente con il numero dei vertici.

![[assets/vertex-cover-stella-greedy.png|700]]

#### Seconda scelta: un vertice di grado massimo

Sulla stella, scegliere il vertice di grado massimo evita quel comportamento: il centro viene selezionato subito. In generale, l'euristica sceglie a ogni iterazione un vertice di grado massimo corrente, cioè quello che copre il maggior numero di archi ancora scoperti. La soluzione resta ammissibile e l'algoritmo è polinomiale, ma neppure questa euristica garantisce un fattore di approssimazione costante.

La figura seguente mostra un piccolo esempio. Inizialmente i quattro vertici di $A$ hanno grado $3$, mentre in $B$ vi sono due vertici di grado $4$ e quattro di grado $1$. L'algoritmo può scegliere prima i due vertici di grado $4$; sugli archi rimasti tutti i vertici hanno grado $1$ e un tie-breaking sfavorevole può fargli scegliere anche gli altri quattro vertici di $B$. Restituisce così una copertura di cardinalità $6$, mentre $A$ è una copertura ottima di cardinalità $4$: il rapporto è $3/2$.

![[assets/vertex-cover-grado-massimo-esempio.png|500]]

> **Approfondimento — famiglia con rapporto logaritmico**
> Il piccolo esempio spiega il meccanismo, ma non dimostra che il rapporto possa crescere senza limite. Per farlo si usa una famiglia di grafi bipartiti $B=(L,R,E)$: $L$ contiene $r$ vertici e $R$ è suddiviso in gruppi $R_1,\ldots,R_r$. Il gruppo $R_i$ contiene $\lfloor r/i\rfloor$ vertici, ciascuno adiacente a $i$ vertici di $L$; i vertici dello stesso gruppo non condividono vicini.
>
> ![[assets/vertex-cover-grado-massimo-famiglia-logaritmica.png|700]]
>
> Con un tie-breaking sfavorevole, l'euristica può scegliere progressivamente tutti i vertici di $R_r,R_{r-1},\ldots,R_1$. L'insieme $L$ è un vertex cover di cardinalità $r$. Poniamo $n=|L|+|R|=\Theta(r\log r)$; indicando con $C$ la soluzione greedy e con $C^*$ l'ottimo,
>
> $$
> \frac{|C|}{|C^*|}\geq \frac{|R|}{|L|}
> =\frac{\sum_{i=1}^{r}\lfloor r/i\rfloor}{r}
> =\Omega(\log r)=\Omega(\log n).
> $$
>
> L'euristica coincide con il greedy standard per Set Cover applicato agli archi e ha anche garanzia $O(\log n)$; il suo comportamento worst-case è dunque $\Theta(\log n)$, non costante. Questa costruzione è un approfondimento esterno al materiale ufficiale del corso.[^vc-max-degree]

#### Terza scelta: un arco arbitrario

La scelta efficace consiste nel selezionare un arco ancora scoperto e inserire nella copertura **entrambi** i suoi estremi. La scelta dell'arco è arbitraria: non richiede casualità.

**Algorithm 6 Algoritmo greedy per Vertex Cover** ^algorithm-6

> 1. **function** Approx-Vertex-Cover($G$)
> 2.  $C \gets \emptyset$
> 3.  **while** $E \neq \emptyset$ **do**
> 4.   scegli un arco arbitrario $(u,v)\in E$
> 5.   $C \gets C \cup \{u, v\}$
> 6.   $E \gets E \setminus incidentEdges(\{u, v\})$
> 7.  **end while**
> 8.  **return** $C$<br>
> 9. **end function**

L'algoritmo termina perché a ogni iterazione elimina almeno l'arco scelto. Inoltre restituisce un vertex cover: un arco viene eliminato solo quando almeno uno dei suoi estremi è stato inserito in $C$, e alla fine tutti gli archi sono stati eliminati. Con liste di adiacenza e marcature, ogni vertice e ogni arco viene esaminato un numero costante di volte, quindi il costo è $O(|V|+|E|)$.

> [!definition] Definizione
> Dato un grafo $G=(V,E)$, un sottoinsieme di archi $E'\subseteq E$ si dice un Matching se non esistono in $E'$ due archi che condividono un estremo. Se $E'$ è massimale, ovvero non è possibile aggiungere altri archi senza violare la proprietà del matching, si dice che $E'$ è un Maximal Matching. Infine, se il matching copre tutti i vertici del grafo, ovvero per ogni $v\in V$ esiste un $u\in V$ tale che $(v,u)\in E'$, si dice che $E'$ è un Perfect Matching.

[[teacher_slides/1_complexity theory.pdf#page=59|Slide della docente, p. 59]]

Sia $M\subseteq E$ l'insieme degli archi scelti. Questi archi non condividono estremi, perché dopo aver scelto $(u,v)$ vengono eliminati tutti gli archi incidenti a $u$ o $v$: $M$ è dunque un **matching**. È anche **massimale**, perché al termine non esiste un altro arco disgiunto da tutti quelli in $M$ che possa esservi aggiunto.

> **Massimale non significa massimo**
> Un matching **massimale** non può essere esteso aggiungendo un arco; un matching **massimo** ha invece la cardinalità più grande possibile. L'algoritmo richiede soltanto la prima proprietà.

Per ogni arco selezionato vengono inseriti due vertici, perciò

$$
|C|=2|M|.
$$

Ogni vertex cover, incluso quello ottimo $C^*$, deve coprire tutti gli archi di $M$. Poiché tali archi sono disgiunti, servono almeno $|M|$ vertici distinti:

$$
|C^*|\geq |M|.
$$

> [!theorem] Teorema
> Il fattore di approssimazione dell'algoritmo è 2.

[[teacher_slides/1_complexity theory.pdf#page=60|Slide della docente, p. 60]]

##### Dimostrazione

Combinando le due relazioni si ottiene

$$
|C|=2|M|\leq 2|C^*|
\qquad\Longrightarrow\qquad
\frac{|C|}{|C^*|}\leq 2.
$$

**Precisazione nostra.** Nella prova a p. 60 il lower bound necessario è $|C^*|\geq |M|$, non $|C^*|\geq |C|$: ogni arco del matching impone un vertice distinto nell'ottimo, ma questo non contiene necessariamente entrambi gli estremi scelti dall'algoritmo.

L'analisi è **tight**. Nel grafo bipartito completo $K_{m,m}$, tutti i vertici di una delle due partizioni formano un vertex cover ottimo di cardinalità $m$. L'algoritmo può scegliere un matching perfetto di $m$ archi e inserire entrambi gli estremi di ciascuno, restituendo tutti i $2m$ vertici. Il rapporto è esattamente $2$.

![[assets/Screenshot 2024-10-08 111957.png|800]]

### Relax & Round per Vertex Cover

Anche qui l'input è un grafo non orientato $G=(V,E)$ e l'output richiesto è una copertura di cardinalità minima; la specifica è in [[#Vertex Cover Problem]]. La costruzione seguente cerca una soluzione ammissibile in tempo polinomiale e ne confronta la cardinalità con l'ottimo.

[[teacher_slides/1_complexity theory.pdf#page=64|Slide della docente, p. 64]]
[[teacher_slides/1_complexity theory.pdf#page=65|Slide della docente, p. 65]]
[[teacher_slides/1_complexity theory.pdf#page=66|Slide della docente, p. 66]]
[[teacher_slides/1_complexity theory.pdf#page=67|Slide della docente, p. 67]]

La tecnica **Relax & Round** costruisce un'altra 2-approssimazione in tre passi: formula il problema come programma lineare intero, rilassa il vincolo di interezza e arrotonda la soluzione frazionaria ottenuta.

#### Formulazione ILP

Per ogni vertice $v\in V$ introduciamo una variabile binaria $x_v$:

$$
x_v=
\begin{cases}
1 & \text{se }v\in C,\\
0 & \text{altrimenti.}
\end{cases}
$$

Il vincolo $x_u+x_v\geq 1$ impone che ogni arco abbia almeno un estremo nella copertura; la funzione obiettivo minimizza il numero di vertici scelti:

$$
\begin{aligned}
\min\quad &\sum_{v\in V}x_v\\
\text{s.t.}\quad &x_u+x_v\geq 1 &&\forall (u,v)\in E,\\
&x_v\in\{0,1\} &&\forall v\in V.
\end{aligned}
$$

Questa formulazione è equivalente al Vertex Cover di ottimizzazione e risolverla esattamente è NP-hard.

#### Rilassamento

Sostituiamo il vincolo binario con $0\leq x_v\leq 1$:

$$
\begin{aligned}
\min\quad &\sum_{v\in V}x_v\\
\text{s.t.}\quad &x_u+x_v\geq 1 &&\forall (u,v)\in E,\\
&0\leq x_v\leq 1 &&\forall v\in V.
\end{aligned}
$$

Il rilassamento è un problema di programmazione lineare risolvibile in tempo polinomiale. Indichiamo con $x^*$ una sua soluzione ottima e con $OPT_{LP}=\sum_{v\in V}x_v^*$ il relativo costo.

#### Arrotondamento

Trasformiamo $x^*$ in una soluzione binaria $\hat{x}$ usando la soglia $1/2$:

$$
\hat{x}_v=
\begin{cases}
1 & \text{se }x_v^*\geq \frac12,\\
0 & \text{se }x_v^*<\frac12.
\end{cases}
$$

**Algorithm 7 Relax & Round per Vertex Cover** ^algorithm-7

> 1. **function** RelaxAndRoundVC($G$)<br>
> 2.  $x^*\gets solveFractionalVertexCoverLP(G)$<br>
> 3.  $C\gets\{v\in V:x_v^*\geq\frac{1}{2}\}$<br>
> 4.  **return** $C$<br>
> 5. **end function**

#### Ammissibilità e fattore di approssimazione

Per ogni arco $(u,v)$, la soluzione frazionaria soddisfa $x_u^*+x_v^*\geq 1$. I due valori non possono quindi essere entrambi strettamente minori di $1/2$: almeno uno dei due estremi viene inserito in $C$ e l'arco risulta coperto. Il segno di uguaglianza nella regola di rounding è essenziale proprio nel caso $x_u^*=x_v^*=1/2$.

Ogni soluzione intera ammissibile è anche ammissibile per il rilassamento LP; dunque il dominio intero è contenuto in quello frazionario e

$$
OPT_{LP}\leq OPT,
$$

dove $OPT$ è il costo del vertex cover ottimo. Inoltre, per ogni vertice vale

$$
\hat{x}_v\leq 2x_v^*:
$$

se $\hat{x}_v=0$ la disuguaglianza è immediata; se $\hat{x}_v=1$, allora $x_v^*\geq 1/2$ e quindi $1\leq 2x_v^*$. Sommando sui vertici,

$$
|C|=\sum_{v\in V}\hat{x}_v
\leq 2\sum_{v\in V}x_v^*
=2OPT_{LP}
\leq 2OPT.
$$

L'analisi è tight per questa regola di rounding. In un ciclo con un numero pari $n$ di vertici, un vertex cover ottimo contiene un vertice sì e uno no e ha costo $n/2$. La soluzione $x_v^*=1/2$ per ogni $v$ è ottima: sommando i vincoli dei $n$ archi si ottiene $2\sum_v x_v\geq n$, e questa assegnazione raggiunge il limite. Se il risolutore restituisce questa soluzione, il rounding seleziona tutti gli $n$ vertici e il rapporto è $2$. L'LP ammette anche soluzioni ottime intere su questi cicli: l'esempio mostra quindi il caso peggiore rispetto alla soluzione ottima frazionaria prodotta dal risolutore.

![[assets/vertexcoverILP.png|500]]

> **Programma AA 2025/26.** La variante pesata del Vertex Cover è indicata dalle dispense ufficiali come non materiale d'esame. L'estensione pesata di Relax & Round è quindi un approfondimento e non viene inclusa in questa trattazione principale.

[[teacher_slides/1_complexity theory.pdf#page=63|Slide della docente, p. 63]]

[^vc-max-degree]: Costruzione tratta da M. Zito, [*Vertex Cover*, lecture notes COMP309 (2005), pp. 5–8](https://cgi.csc.liv.ac.uk/~michele/TEACHING/COMP309/2005/Lec10.4.4.pdf).

## 3 Algoritmi distribuiti

### 3.1 Teoria della computazione distribuita

Questo capitolo studia protocolli in cui entità con memoria privata cooperano tramite messaggi. Per valutarne correttezza ed efficienza, dichiariamo il modello della rete e del tempo e le restrizioni richieste dai singoli protocolli.

#### Ambienti distribuiti

[[teacher_slides/2_distributed algorithms.pdf#page=3|Slide della docente, p. 3]]
[[teacher_slides/2_distributed algorithms.pdf#page=7|Slide della docente, p. 7]]

Un **ambiente distribuito** è una collezione finita di entità computazionali che comunicano tramite messaggi per raggiungere un obiettivo comune. Le entità sono molteplici e autonome e possono avere capacità diverse: ciascuna ha capacità di calcolo, memoria privata e un clock locale. Esempi sono il Web, le reti di comunicazione, di sensori e robotiche. La condivisione di risorse, la tolleranza ai guasti e la scalabilità sono motivi per cui si usano sistemi distribuiti.

Un **algoritmo distribuito**, o *protocollo*, specifica le azioni locali delle entità affinché il loro comportamento collettivo risolva il problema. Come per un algoritmo sequenziale, se ne devono verificare correttezza ed efficienza.

La distinzione dal calcolo parallelo riguarda il modello: una macchina parallela ha tipicamente processori vicini che condividono la memoria; nel modello **message-passing** del corso, le entità hanno memorie separate e cooperano scambiando messaggi, anche a distanza. In entrambi i casi le operazioni possono svolgersi in parallelo. La memoria separata è un'ipotesi del modello studiato qui, non una proprietà universale di ogni sistema distribuito.

#### Il modello

[[teacher_slides/2_distributed algorithms.pdf#page=23|Slide della docente, p. 23]]

Rappresentiamo la rete di comunicazione con un grafo $G=(V,A)$: i vertici sono le entità, dette anche *nodi*, e gli archi orientati rappresentano i collegamenti sui quali si possono inviare messaggi. Il grafo diretto descrive anche collegamenti unidirezionali. Se il protocollo assume collegamenti bidirezionali, i vicinati in ingresso e in uscita coincidono e si può rappresentare la rete con un grafo non orientato $G=(V,E)$.

#### Entità

[[teacher_slides/2_distributed algorithms.pdf#page=10|Slide della docente, p. 10]]
[[teacher_slides/2_distributed algorithms.pdf#page=11|Slide della docente, p. 11]]
[[teacher_slides/2_distributed algorithms.pdf#page=16|Slide della docente, p. 16]]
[[teacher_slides/2_distributed algorithms.pdf#page=18|Slide della docente, p. 18]]
[[teacher_slides/2_distributed algorithms.pdf#page=20|Slide della docente, p. 20]]

Ogni entità $x$ riceve un input locale, eventualmente vuoto, e produce un output conforme alla specifica del problema. Gli output locali non devono essere uguali: per esempio, nell'elezione un nodo diventa *leader* e gli altri *follower*.

Il registro $status(x)$ indica lo **stato** corrente dell'entità. Il suo valore appartiene all'insieme finito $S$ degli stati previsti dal protocollo; ciò non significa che tutta la memoria privata dell'entità sia finita. Il comportamento è **reattivo**: un'azione viene attivata da un evento, per esempio l'arrivo di un messaggio, il segnale del clock locale o un impulso spontaneo esterno. Quest'ultimo può essere, per esempio, una richiesta di prelievo a uno sportello ATM inattivo. Senza eventi, l'entità non agisce.

Un'**azione** è una sequenza finita di attività, atomica rispetto agli altri eventi: una volta iniziata non viene interrotta. Può comprendere calcolo locale, lettura o scrittura della memoria privata, invio di messaggi, cambio di stato, impostazione o azzeramento del clock, oppure l'azione nulla (*NIL*). Il protocollo specifica regole per le coppie $(\text{stato},\text{evento})$: è **completo** se definisce un'azione per ogni coppia possibile e **deterministico** se ne definisce una sola; ogni azione termina in tempo finito.

Nel seguito consideriamo sistemi **simmetrici**: tutte le entità seguono la stessa descrizione del protocollo, ma non per questo agiscono nello stesso modo. Il codice può scegliere azioni diverse in base allo stato, all'input o a un ruolo locale, come *iniziatore* (*initiator*) o nodo dormiente. La simmetria riguarda il codice, non gli stati o gli output dei nodi.

#### Comunicazione

[[teacher_slides/2_distributed algorithms.pdf#page=22|Slide della docente, p. 22]]
[[teacher_slides/2_distributed algorithms.pdf#page=23|Slide della docente, p. 23]]

Un messaggio è una sequenza **finita di bit**. Nel modello *point-to-point*, un'entità $x$ può inviare direttamente solo ai vicini in uscita $N_o(x)$ e ricevere solo dai vicini in ingresso $N_i(x)$. Poniamo $N(x)=N_o(x)\cup N_i(x)$. Con collegamenti bidirezionali i due insiemi coincidono. L'ordine FIFO sullo stesso collegamento non appartiene al modello generale: si assume solo quando il protocollo lo dichiara come restrizione.

#### Assiomi

[[teacher_slides/2_distributed algorithms.pdf#page=25|Slide della docente, p. 25]]
[[teacher_slides/2_distributed algorithms.pdf#page=26|Slide della docente, p. 26]]

Il modello di base ha **due soli assiomi**; le ulteriori proprietà richieste dal protocollo sono restrizioni.

- **Ritardi di comunicazione finiti.** In assenza di guasti, un messaggio inviato a un vicino in uscita arriva integro ed è elaborato in tempo finito. Questo non implica un limite superiore noto o uniforme ai ritardi.
- **Orientamento locale.** Ogni entità distingue i propri vicini in ingresso da quelli in uscita. Può scegliere a quale vicino in uscita inviare un messaggio e riconoscere da quale vicino in ingresso proviene un messaggio ricevuto. Le porte locali hanno etichette distinte presso ciascun nodo; le etichette non sono identificativi globali e non devono coincidere ai due estremi di un collegamento.

#### Restrizioni

[[teacher_slides/2_distributed algorithms.pdf#page=27|Slide della docente, p. 27]]
[[teacher_slides/2_distributed algorithms.pdf#page=28|Slide della docente, p. 28]]
[[teacher_slides/2_distributed algorithms.pdf#page=29|Slide della docente, p. 29]]
[[teacher_slides/2_distributed algorithms.pdf#page=30|Slide della docente, p. 30]]
[[teacher_slides/2_distributed algorithms.pdf#page=31|Slide della docente, p. 31]]
[[teacher_slides/2_distributed algorithms.pdf#page=32|Slide della docente, p. 32]]
[[teacher_slides/2_distributed algorithms.pdf#page=33|Slide della docente, p. 33]]

Una **restrizione** è una proprietà aggiuntiva sfruttata dal protocollo: può facilitarne o renderne possibile l'esecuzione, ma limita i sistemi a cui si applica. Le ipotesi usate vanno dichiarate. Esempi ricorrenti sono:

- **Comunicazione:** FIFO, cioè i messaggi inviati sullo stesso collegamento arrivano nello stesso ordine; collegamenti bidirezionali, per cui $N_i(x)=N_o(x)=N(x)$.
- **Affidabilità:** rilevazione dei guasti di nodi o collegamenti, consegna garantita dei messaggi e restrizioni ai guasti ammessi. Nella terminologia delle slide, l'affidabilità **parziale** esclude guasti futuri ma ammette che ve ne siano stati; quella **totale** esclude guasti passati e futuri.
- **Topologia e conoscenza:** connettività forte se il grafo è diretto, connessione se è non orientato; conoscenza iniziale di quantità quali il numero $n$ di nodi, il numero $m$ di collegamenti o il diametro $D(G)$.
- **Tempo:** un *bounded communication delay* impone, in assenza di guasti, un limite $\Delta$ al ritardo di ogni messaggio; l'*unitary communication delay* lo fissa a un'unità. Con *synchronized clocks* i clock locali avanzano insieme. Salvo indicazione contraria, il corso considera sistemi **asincroni**: in assenza di guasti i ritardi sono finiti, ma non è noto un loro limite superiore.

#### Misure di efficienza per gli algoritmi distribuiti

[[teacher_slides/2_distributed algorithms.pdf#page=35|Slide della docente, p. 35]]
[[teacher_slides/2_distributed algorithms.pdf#page=36|Slide della docente, p. 36]]

Le misure principali sono la **quantità di comunicazione** e il **tempo**. La prima conta di norma i messaggi trasmessi: ciascun invio su un collegamento vale un messaggio, indipendentemente dalla successiva consegna. Se le lunghezze dei messaggi variano molto, si può contare il numero di **bit trasmessi** (*bit complexity*). Anche lo spazio locale è una risorsa da considerare; nelle misure introdotte qui l'attenzione è soprattutto sulla comunicazione, mentre il tempo di calcolo locale è assunto trascurabile rispetto a quello di trasmissione e incluso in esso.

Il **tempo fisico** è l'intervallo dall'avvio della prima entità alla terminazione dell'ultima. Nel modello asincrono generale non è limitato da un bound uniforme determinato dalla sola topologia, perché i ritardi possono essere arbitrariamente grandi. Si usano quindi misure astratte, specificando quale si intende:

- **Tempo ideale (*ideal time*):** durata dell'esecuzione nel modello sincrono, con clock sincronizzati e un'unità di tempo per trasmettere un messaggio; il calcolo locale è incluso nel costo della trasmissione. Un messaggio avanza di un collegamento per unità di tempo e catene indipendenti possono avanzare in parallelo.
- **Tempo causale (*causal time*):** nei sistemi asincroni, lunghezza massima, su tutte le esecuzioni considerate, di una catena di messaggi che si susseguono causalmente. Misura la profondità delle dipendenze, non il tempo trascorso; non va identificato automaticamente con il tempo ideale.

Quando si riporta una *time complexity* bisogna quindi indicare la misura temporale e le restrizioni del modello. Il broadcast della sezione successiva mostrerà perché questa distinzione è utile.

#### Broadcast

##### Problema e modello

> [!problem] Broadcast
>
> **Input:** un solo nodo $s$, l'**iniziatore** (*initiator*), conosce inizialmente un'informazione $I$.
>
> **Output:** tutti gli altri nodi apprendono $I$ in tempo finito, qualunque sia la scelta di $s$.

[[teacher_slides/2_distributed algorithms.pdf#page=37|Slide della docente, p. 37]]
[[teacher_slides/2_distributed algorithms.pdf#page=38|Slide della docente, p. 38]]

Assumiamo un grafo $G=(V,E)$ con $n=|V|$ nodi e $m=|E|$ collegamenti; le restrizioni standard $R=\{BL,CN,TR\}$ sono collegamenti bidirezionali (**BL**), connettività (**CN**) e affidabilità totale (**TR**, nessun guasto). L'iniziatore unico che possiede $I$ è parte della specifica del problema ($UI^+$). Il protocollo che costruiamo è **generico**: i nodi non devono conoscere in anticipo la topologia, $n$ o gli identificativi dei vicini.

![[assets/Screenshot 2024-10-09 090924.png|400]]

##### Strategia e algoritmo Flooding

[[teacher_slides/2_distributed algorithms.pdf#page=40|Slide della docente, p. 40]]
[[teacher_slides/2_distributed algorithms.pdf#page=46|Slide della docente, p. 46]]

Se ogni nodo che riceve $I$ lo invia sempre a tutti i vicini, il protocollo può non terminare: nell'esempio, $y$ e $z$ continuano a rinviarsi il messaggio. Serve ricordare che l'invio è già stato effettuato. Introduciamo quindi lo stato $DONE$ e facciamo inoltrare $I$ una sola volta, alla prima ricezione. Poiché il nodo riconosce la porta da cui è arrivato il messaggio (orientamento locale), può inoltre escludere il mittente dall'inoltro.

![[assets/Screenshot 2024-10-09 091410.png|400]]

Il protocollo **Flooding** usa gli stati $INITIATOR$, $SLEEPING$ e $DONE$ e il messaggio $I$:

~~~text
INITIATOR, impulso spontaneo:
    invia I a tutti i vicini; passa a DONE
INITIATOR, ricezione di I:
    non fare nulla
SLEEPING, ricezione di I dal vicino p:
    invia I a tutti i vicini tranne p; passa a DONE
SLEEPING, impulso spontaneo:
    non fare nulla
DONE, qualunque evento:
    non fare nulla
~~~

![[assets/Screenshot 2024-10-09 091924.png|600]]

##### Correttezza

[[teacher_slides/2_distributed algorithms.pdf#page=52|Slide della docente, p. 52]]

###### Dimostrazione

Supponiamo che, dopo l'attivazione di $s$, qualche nodo non riceva mai $I$. Poiché $G$ è connesso, esisterebbe un arco tra un nodo che ha già appreso $I$ e uno che non lo apprende. Il primo, quando si è attivato, ha inviato $I$ su quell'arco: il secondo non può essere il mittente della sua prima copia. L'affidabilità e il ritardo finito di consegna danno una contraddizione. Quindi tutti i nodi apprendono $I$.

##### Terminazione

[[teacher_slides/2_distributed algorithms.pdf#page=49|Slide della docente, p. 49]]
[[teacher_slides/2_distributed algorithms.pdf#page=50|Slide della docente, p. 50]]

Ogni nodo invia al massimo una volta ai propri vicini e poi passa a $DONE$; il numero di messaggi è finito e tutti sono consegnati in tempo finito. Tutti i nodi raggiungono dunque $DONE$. Ciascuno conosce la propria **terminazione locale**, ma il protocollo non gli permette di rilevare quando *tutti* hanno terminato: questa è una questione distinta (*termination detection*). In una rete asincrona, i ritardi possono far arrivare una copia lungo un cammino più lungo prima di una copia inviata direttamente da $s$.

##### Complessità

###### Messaggi

[[teacher_slides/2_distributed algorithms.pdf#page=53|Slide della docente, p. 53]]

L'iniziatore invia $|N(s)|$ messaggi; ognuno degli altri $n-1$ nodi ne invia $|N(x)|-1$, escludendo il mittente della prima copia. Per il lemma della stretta di mano, $\sum_x|N(x)|=2m$, perciò il conteggio è esatto e non dipende dall'ordine di consegna:

$$
\begin{aligned}
M(\text{Flooding}(G))
&=|N(s)|+\sum_{x\ne s}(|N(x)|-1)\\
&=\sum_x|N(x)|-(n-1)=2m-n+1\in\Theta(m).
\end{aligned}
$$

###### Tempo

[[teacher_slides/2_distributed algorithms.pdf#page=54|Slide della docente, p. 54]]

Nel **tempo ideale**, ogni messaggio impiega un'unità di tempo e ogni vicino riceve il messaggio entro quell'unità. Dopo $t$ unità hanno appreso $I$ tutti i nodi a distanza al più $t$ da $s$, quindi l'ultima prima ricezione avviene dopo $r(s)=\max_y d(s,y)$ unità. Nel caso peggiore su tutte le scelte dell'iniziatore, $\max_s r(s)=D(G)\le n-1$. Nel modello asincrono il **tempo fisico** non ha un limite uniforme senza un limite ai ritardi. Il **tempo causale** misura invece la lunghezza della più lunga catena di messaggi causalmente dipendenti. La catena che porta alla prima ricezione di un nodo segue nodi distinti e contiene al più $n-1$ trasmissioni, ma può seguire un cammino non minimo. Una catena che include anche copie ridondanti può arrivare a $n$ trasmissioni: in un triangolo si può avere $s\to a\to b\to s$, con l'ultima copia ricevuta da $s$ già in $DONE$. Questo limite causale non è il diametro $D(G)$.

##### Lower bound

[[teacher_slides/2_distributed algorithms.pdf#page=57|Slide della docente, p. 57]]

Nel tempo ideale, con iniziatore fissato $s$, almeno $r(s)$ unità sono necessarie per raggiungere il nodo più lontano. Se il caso peggiore include ogni possibile iniziatore, il limite diventa $D(G)=\max_s r(s)$. Flooding raggiunge entrambi i limiti. Per i messaggi, il limite immediato è $n-1$, perché ogni nodo diverso da $s$ deve ricevere almeno una copia di $I$. Le slide della docente danno il limite più forte $m$ per un protocollo generico corretto su tutti i grafi connessi, senza conoscenza globale della topologia o di $n$. L'idea è che ogni arco deve trasportare almeno un messaggio: se un arco non fosse mai usato in un'esecuzione, si potrebbe sostituirlo con un cammino che passa per un nuovo nodo dormiente. Gli estremi non distinguerebbero localmente le due reti, mentre il nuovo nodo non riceverebbe $I$, in contraddizione con la correttezza. Il limite dipende dall'ipotesi di protocollo generico; non vale per protocolli che sfruttano conoscenza della topologia, come il simple broadcast su grafo completo. Poiché Flooding usa esattamente $2m-n+1<2m$ messaggi, è ottimale nell'ordine di grandezza rispetto a $m$.

##### Topologie particolari e raccordo

[[teacher_slides/2_distributed algorithms.pdf#page=60|Slide della docente, p. 60]]
[[teacher_slides/2_distributed algorithms.pdf#page=62|Slide della docente, p. 62]]
[[teacher_slides/2_distributed algorithms.pdf#page=63|Slide della docente, p. 63]]

Su un albero $m=n-1$, dunque Flooding usa esattamente $n-1$ messaggi anche se i nodi non sanno di trovarsi in un albero. Su un grafo completo, invece, usa $(n-1)^2=\Theta(n^2)$ messaggi; se almeno l'iniziatore sa che ogni altro nodo è suo vicino, il *simple broadcast* invia direttamente a tutti: $n-1$ messaggi e ideal time $1$. Questa conoscenza aggiuntiva spiega perché il bound $m$ dei protocolli generici non si applica a quel caso. Per riutilizzare broadcast economici su un grafo generico si può prima costruire uno **spanning tree** e poi trasmettere lungo i suoi $n-1$ archi, tenendo distinto il costo della costruzione.

#### Il wake-up problem

##### Problema e modello

> [!problem] Wake-up
>
> **Input:** alcuni nodi possono attivarsi autonomamente; gli altri restano dormienti finché non ricevono un messaggio.
>
> **Output:** tutti i nodi raggiungono lo stato $AWAKE$.

[[teacher_slides/2_distributed algorithms.pdf#page=65|Slide della docente, p. 65]]
[[teacher_slides/2_distributed algorithms.pdf#page=68|Slide della docente, p. 68]]

Il **wake-up** richiede di attivare tutti i nodi inizialmente dormienti. Rispetto al [[#Broadcast|broadcast]], dove un unico iniziatore diffonde un'informazione, qui gli iniziatori possono essere più di uno e non sanno quali altri nodi si siano già attivati. Assumiamo almeno un risveglio spontaneo e le restrizioni $R=\{BL,CN,TR\}$: collegamenti bidirezionali, grafo connesso e assenza di guasti.

##### Algoritmo WFlood

WFlood applica la strategia di Flooding al messaggio di risveglio $W$. Tutti partono in stato $ASLEEP$; $AWAKE$ è lo stato terminale:

~~~text
ASLEEP, impulso spontaneo:
    invia W a tutti i vicini; passa a AWAKE
ASLEEP, ricezione di W dal vicino p:
    invia W a tutti i vicini tranne p; passa a AWAKE
AWAKE, qualunque evento:
    non fare nulla
~~~

![[assets/Screenshot 2024-10-11 160525.png|450]]

##### Correttezza e terminazione

Da almeno un iniziatore, l'invio attraversa ogni frontiera tra nodi svegli e dormienti in un grafo connesso; con affidabilità totale ogni nodo si sveglia in tempo finito. Ogni nodo esegue un solo invio ai vicini e poi ignora le altre copie, quindi il protocollo termina. Anche qui nessun nodo rileva da solo quando *tutti* sono svegli e la computazione globale è terminata.

##### Complessità

###### Messaggi

Sia $k\ge1$ il numero di nodi che si sono effettivamente svegliati per impulso spontaneo *prima* di ricevere $W$. Questi inviano a tutti i vicini; gli altri $n-k$ escludono ciascuno il mittente della prima copia. Pertanto

$$
M(\text{WFlood}(G))=\sum_x|N(x)|-(n-k)=2m-(n-k),
\qquad 2m-n+1\le M(\text{WFlood}(G))\le2m.
$$

Con un solo iniziatore il costo coincide con Flooding; se tutti sono iniziatori vale $2m$. Su un albero la formula diventa $n+k-2$. Nel caso peggiore, wake-up generico richiede $\Theta(m)$ messaggi: contiene il caso broadcast con un solo iniziatore e WFlood fornisce il corrispondente upper bound.

###### Tempo ideale

Nel tempo ideale, se l'insieme $S$ degli iniziatori si attiva simultaneamente all'istante iniziale e non intervengono altri impulsi, ogni nodo $v$ si sveglia dopo $\min_{s\in S}d(s,v)$ unità. Il tempo totale è quindi $\max_{v\in V}\min_{s\in S}d(s,v)$: più iniziatori possono accelerare l'esecuzione. Nel caso peggiore, può esserci un solo iniziatore, scelto in un nodo di eccentricità $D(G)$; la complessità ideale worst-case è dunque $\Theta(D(G))$. Impulsi spontanei successivi possono solo aiutare: dal primo iniziatore, WFlood raggiunge ogni nodo entro al più $D(G)$ unità ideali. In asincrono il tempo fisico non ha un limite uniforme senza un bound sui ritardi.

#### Spanning tree

Uno **spanning tree** (albero di copertura) di un grafo connesso $G=(V,E)$ è un sottografo $T=(V,E')$, con $E'\subseteq E$, **connesso e aciclico**. Contiene tutti gli $n=|V|$ nodi e, come ogni albero, esattamente $n-1$ archi. Costruirlo permette poi, per esempio, di fare broadcast lungo i soli archi di $T$ con $n-1$ messaggi, oltre al costo iniziale della costruzione.

Nel problema distribuito **SPT** (*spanning tree construction*) ogni nodo $x$ deve conoscere, alla fine, l'insieme $TreeNeighbours(x)\subseteq N(x)$ dei propri vicini nell'albero; non è necessario che conosca tutto $T$. Gli insiemi locali devono essere coerenti: $y\in TreeNeighbours(x)$ se e solo se $x\in TreeNeighbours(y)$. La prima ricezione di un broadcast da un unico iniziatore individua già un *parent* per ogni altro nodo, ma servono risposte o ulteriori messaggi per far conoscere a ciascuno anche i figli e distinguere gli archi non appartenenti all'albero.

Per SHOUT e per la visita DFT assumiamo **un solo iniziatore**, grafo connesso, collegamenti bidirezionali e affidabilità totale; i nodi conoscono il proprio vicinato $N(x)$. Poniamo $m=|E|$. I protocolli non richiedono che i nodi conoscano l'intera topologia. Per lo pseudocodice di SHOUT con risposte $NO$ assumiamo anche consegna **FIFO su ogni link**: serve alla terminazione locale basata sul solo contatore.

#### Protocollo Shout

**Problema e modello.** SHOUT costruisce uno spanning tree che ogni nodo conosce tramite i propri vicini nell'albero; la specifica e le restrizioni sono in [[#Spanning tree]]. In particolare c'è un unico iniziatore, il grafo è connesso e bidirezionale, non vi sono guasti e, per la variante con risposte $NO$ e il contatore qui descritti, i messaggi su ciascun collegamento arrivano in ordine FIFO.

**Idea.** SHOUT estende Flooding: l'iniziatore invia una richiesta $Q$ a ogni vicino. Un nodo ancora $IDLE$ accetta la prima richiesta con $YES$, sceglie il mittente come parent e invia $Q$ agli altri vicini. Se è già $ACTIVE$, risponde $NO$ alle richieste successive. Ogni nodo conta una risposta per ciascun vicino a cui ha inviato $Q$; per un nodo non iniziatore si conta anche il parent, già deciso con $YES$.

[[teacher_slides/2_distributed algorithms.pdf#page=72|Slide della docente, p. 72]]

![[assets/Screenshot 2024-10-11 161549.png|600]]

![[assets/Screenshot 2024-10-11 161643.png|1100]]

Gli stati sono $\{INITIATOR,IDLE,ACTIVE,DONE\}$, con $INITIATOR$ e $IDLE$ iniziali e $DONE$ terminale. Ogni nodo mantiene $TreeNeighbours$, un contatore `counter` e, se non è la radice, `parent`. I messaggi sono $Q$, $YES$ e $NO$:

~~~text
INITIATOR, impulso spontaneo:
    TreeNeighbours ← ∅; counter ← 0
    se |N(x)| = 0: passa a DONE
    altrimenti: invia Q a tutti i vicini; passa ad ACTIVE

IDLE, ricezione di Q da p:
    parent ← p; TreeNeighbours ← {p}; counter ← 1
    invia YES a p
    se counter = |N(x)|: passa a DONE
    altrimenti: invia Q a N(x) \ {p}; passa ad ACTIVE

ACTIVE, ricezione di Q da p:
    invia NO a p
ACTIVE, ricezione di YES da p:
    TreeNeighbours ← TreeNeighbours ∪ {p}
    counter ← counter + 1
    se counter = |N(x)|: passa a DONE
ACTIVE, ricezione di NO da p:
    counter ← counter + 1
    se counter = |N(x)|: passa a DONE
~~~

**Correttezza e terminazione.** Ogni nodo diverso dall'iniziatore invia esattamente un $YES$, scegliendo un solo parent. La scelta avviene dopo che il parent è stato raggiunto: risalendo la catena dei parent si arriva all'iniziatore, quindi non si forma un ciclo. Poiché il grafo è connesso e le richieste sono consegnate, tutti i nodi vengono raggiunti. Su ogni arco scelto, i due estremi si registrano reciprocamente come vicini dell'albero; gli altri archi restano esclusi. Ogni richiesta riceve una risposta e il contatore arriva a $|N(x)|$, perciò ogni nodo raggiunge $DONE$. Questo segnala la **terminazione locale**: il protocollo non permette a un singolo nodo di rilevare che tutti abbiano terminato.

Nel caso $n=1$, l'iniziatore non ha vicini e passa direttamente a $DONE$: l'albero ha zero archi e non occorrono messaggi.

L'ipotesi FIFO evita che, su un arco dove si incrociano due $Q$, il $NO$ inviato dopo il $Q$ da un estremo arrivi all'altro **prima** di quel $Q$: in tal caso il contatore potrebbe farlo passare a $DONE$ e il $Q$ tardivo resterebbe senza risposta. La lista delle restrizioni nelle slide non menziona FIFO; il punto richiede una precisazione del modello per questa specifica con $NO$.

**Messaggi.** Su ciascuno dei $n-1$ archi dell'albero passano un $Q$ e un $YES$; su ciascuno dei $m-(n-1)$ altri archi passano due $Q$ e due $NO$. Le figure mostrano le due situazioni ammesse:

![[assets/Screenshot 2024-10-15 091649.png|500]]

![[assets/Screenshot 2024-10-15 092404.png|500]]

$$
\begin{aligned}
M(\text{SHOUT})
&=(n-1)+2[m-(n-1)]+(n-1)+2[m-(n-1)]\\
&=4m-2n+2=2(2m-n+1)=2M(\text{Flooding}).
\end{aligned}
$$

[[teacher_slides/2_distributed algorithms.pdf#page=80|Slide della docente, p. 80]]

**Tempo ideale.** Con trasmissioni simultanee di un'unità, i $Q$ raggiungono ogni nodo alla sua distanza dall'iniziatore $s$. Per $n\ge2$, l'ultimo nodo non può terminare prima di $r(s)+1$ unità, dove $r(s)=\max_x d(s,x)$ è l'eccentricità di $s$. Un $Q$ fra due nodi all'ultimo livello può però richiedere un successivo $NO$: per la terminazione locale di tutti i nodi vale quindi $r(s)+1\le T_{ideal}(\text{SHOUT})\le r(s)+2\le D(G)+2$. In un triangolo con iniziatore in un vertice, gli altri due si scambiano $Q$ e poi $NO$, raggiungendo il limite superiore. Il libro consigliato riporta $r(s)+1$ anche per SHOUT (*Design and Analysis of Distributed Algorithms*, p. 56): il triangolo mostra che, contando il passaggio di **tutti** i nodi a $DONE$ nel pseudocodice con $NO$, può servire un'unità in più. Per $n=1$ il tempo è zero. Senza un limite ai ritardi, il tempo fisico asincrono non ha un bound uniforme.

**SHOUT+** elimina i messaggi $NO$. Le azioni degli stati iniziali restano uguali; in $ACTIVE$, ricevere $Q$ da un vicino equivale a ricevere un rifiuto implicito: si incrementa `counter` senza rispondere. La gestione di $YES$ resta invariata. Quando due $Q$ si incrociano su un arco, ciascun estremo riceve il $Q$ dell'altro e conta la risposta implicita. Anche qui tutti i contatori arrivano a $|N(x)|$.

[[teacher_slides/2_distributed algorithms.pdf#page=83|Slide della docente, p. 83]]

![[assets/Screenshot 2024-10-15 114636.png|400]]

Ogni arco trasporta esattamente due messaggi: $Q$–$YES$ se entra nell'albero, oppure $Q$–$Q$ se ne resta fuori. Quindi $M(\text{SHOUT+})=2m$; per $n\ge2$ il suo tempo ideale è ancora $r(s)+1$.

**Più iniziatori.** SHOUT e SHOUT+ sono specificati per un solo iniziatore. Se ne partono più di uno, un nodo già attivo non accetta la richiesta proveniente da un altro albero parziale: gli alberi non si fondono e il risultato può essere una **foresta**. Le strategie per costruire un unico albero in questa situazione sono trattate separatamente più avanti.

#### Costruzione dello spanning tree tramite traversal

**Problema e modello.** La visita in profondità distribuita (*depth-first traversal*, **DFT**) costruisce uno spanning tree con un solo iniziatore su un grafo connesso e bidirezionale, senza guasti; i nodi conoscono i propri vicini. La specifica locale dell'output è in [[#Spanning tree]]. La visita con un solo token attivo non richiede FIFO.

**Idea.** Circola un solo token di visita: un nodo prova un vicino alla volta e attende il ritorno del token prima di provarne un altro. Gli archi con cui il token raggiunge per la prima volta un nodo formano l'albero; i tentativi verso nodi già visitati individuano le *back-edge*, che ne restano fuori.

I tre messaggi sono `ForwardToken`, per tentare la visita, `ReturnToken`, per tornare dopo aver completato un sottoalbero, e `BackEdgeToken`, per respingere il token quando il nodo era già visitato.

[[teacher_slides/2_distributed algorithms.pdf#page=94|Slide della docente, p. 94]]

![[assets/Screenshot 2024-10-15 120009.png|600]]

La radice è l'iniziatore. Ogni altro nodo memorizza in `entry` il mittente del **primo** `ForwardToken`: è il suo parent. I figli sono i vicini che ricevono da esso il token per la prima volta e restituiscono `ReturnToken`. I vicini che restituiscono `BackEdgeToken` non sono figli. `Unvisited` contiene i vicini ancora da provare; `pick` ne sceglie e rimuove uno.

~~~text
procedura VISIT:
    se Unvisited non è vuoto:
        p ← pick(Unvisited)
        invia ForwardToken a p; passa a VISITED
    altrimenti:
        se non sei l'iniziatore: invia ReturnToken a entry
        passa a DONE

INITIATOR, impulso spontaneo:
    Unvisited ← N(x); esegui VISIT
IDLE, ricezione di ForwardToken da p:
    entry ← p; Unvisited ← N(x) \ {p}; esegui VISIT
VISITED, ricezione di ForwardToken da p:
    Unvisited ← Unvisited \ {p}
    invia BackEdgeToken a p
VISITED, ricezione di ReturnToken dal vicino atteso p:
    registra p come figlio; esegui VISIT
VISITED, ricezione di BackEdgeToken dal vicino atteso p:
    esegui VISIT
~~~

**Correttezza e terminazione.** C'è un solo token di visita attivo: chi lo invia attende il suo ritorno. Ogni nodo non iniziatore viene scoperto una sola volta, registra un unico parent e viene collegato a una catena che risale alla radice. Ogni vicino viene rimosso da `Unvisited` quando è provato o quando si scopre che è già visitato; gli archi restanti vengono quindi classificati senza cicli. Su un grafo connesso, nessun nodo può restare non visitato quando l'iniziatore esaurisce i vicini e raggiunge $DONE$. Un nodo non iniziatore passa a $DONE$ dopo aver restituito il token al parent; la radice riconosce così la fine della visita quando è lei a passare a $DONE$.

**Messaggi e tempo.** Su ogni arco passa un `ForwardToken` seguito da un `ReturnToken` oppure da un `BackEdgeToken`:

![[assets/Screenshot 2024-10-15 121028.png|450]]

Pertanto $M(\text{DFT})=2m$, come per SHOUT+. Il costo è $\Theta(m)$ e raggiunge nell'ordine di grandezza il lower bound per la visita generica nel modello considerato. Poiché il token segue una sola catena sequenziale, il **tempo causale**, misurato in trasmissioni di token, è $2m$; coincide col tempo ideale in unità di trasmissione di questa visita. Ogni nodo deve comunque essere raggiunto in sequenza, quindi per una traversal $T\ge n-1$. Senza un limite ai ritardi, il tempo fisico asincrono non ha un bound uniforme.

**Variante Visited/Ack.** La DFT base spende tempo sequenziale anche sui tentativi che diventano back-edge. Per evitarli, quando un nodo riceve il token per la prima volta (iniziatore compreso), invia `Visited` ai vicini tranne il parent e **attende i loro `Ack`** prima di chiamare `VISIT`. Chi riceve `Visited` risponde con `Ack` e rimuove il mittente da `Unvisited`; se è ancora $IDLE$, conserva questa informazione per inizializzare `Unvisited` quando arriverà il token. Così non invierà in seguito il token a un vicino già visitato. Gli scambi `Visited`/`Ack` con vicini diversi procedono in parallelo, mentre il token continua a muoversi in modo sequenziale.

[[teacher_slides/2_distributed algorithms.pdf#page=100|Slide della docente, p. 100]]

![[assets/Screenshot 2024-10-15 121746.png|750]]

![[assets/Screenshot 2024-10-15 121941.png|600]]

**Tempo ideale della variante.** Il token percorre in andata e ritorno solo i $n-1$ archi dell'albero: la sua catena contiene $2(n-1)$ trasmissioni. Ogni nuova visita può aggiungere al cammino critico al più un handshake `Visited`/`Ack` lungo due trasmissioni, per al più $2n$ ulteriori unità. Ne segue il limite $T_{ideal}\le 2(n-1)+2n=4n-2\in O(n)$. Il termine $2n$ misura un **contributo temporale massimo**, non il numero totale dei messaggi `Visited`/`Ack`.

**Messaggi della variante.** Ogni arco dell'albero porta due token e al più un handshake `Visited`/`Ack`; su un arco non appartenente all'albero possono avvenire due handshake, uno per direzione. Quindi

$$
M(\text{DFT}_{Visited/Ack})
\le 2(n-1)+2(n-1)+4[m-(n-1)]
=4m\in O(m).
$$

La variante riduce il limite sul tempo da $O(m)$ a $O(n)$ quando $m$ può crescere oltre $n$, pagando più messaggi ma restando in $O(m)$. Non va confuso il limite di $4m$ sui messaggi con quello di $4n-2$ sul tempo.

**Quale albero si ottiene?** L'ordine di arrivo delle richieste in SHOUT e la scelta del prossimo vicino in DFT possono cambiare l'albero prodotto. Con trasmissioni ideali uniformi e simultanee per livello, SHOUT sceglie parent a distanza minima dall'iniziatore e costruisce un albero BFS; questa proprietà non è garantita nell'esecuzione asincrona. La DFT può produrre un albero di diametro grande: se l'albero servirà per broadcast ripetuti, un diametro piccolo sarebbe preferibile. Una possibile strategia è trovare un centro del grafo e costruirvi un albero BFS, ma entrambe le operazioni hanno un costo.

Anche DFT, come SHOUT, richiede un unico iniziatore: lanciare più visite indipendenti non assicura un solo spanning tree.

![[assets/Screenshot 2024-10-16 092040.png|600]]

#### Spanning tree con iniziatori multipli

[[teacher_slides/2_distributed algorithms.pdf#page=109|Slide della docente, p. 109]]

**Problema.** Anche con più iniziatori vogliamo costruire un solo spanning tree, noto localmente tramite i vicini dell'albero come in [[#Spanning tree]]. Un nodo non sa se nella rete siano presenti altri iniziatori. Lanciare [[#Protocollo Shout|SHOUT]] o [[#Costruzione dello spanning tree tramite traversal|DFT]] indipendentemente da più nodi può produrre una foresta. Le slide presentano due **idee di soluzione** con identificatori univoci, senza specificare qui un protocollo completo o una sua complessità precisa:

- **Multiple spanning tree:** ogni iniziatore costruisce il proprio spanning tree con un protocollo a iniziatore unico; gli identificatori distinguono le costruzioni. Il costo in messaggi dipende dal numero di iniziatori e dal protocollo usato, e può essere elevato.

- **Costruzione selettiva:** ogni iniziatore avvia una costruzione identificata dal proprio ID. I nodi abbandonano progressivamente le costruzioni con ID maggiore e mantengono quella dell'iniziatore con ID minimo. Alcuni nodi potrebbero dover rieseguire il protocollo più volte; serve inoltre un meccanismo per notificare il completamento della costruzione dello **spanning tree**. Qui *spanning* significa che l'albero copre tutti i nodi, non che minimizza il peso degli archi.

Un'altra strada è eleggere un unico iniziatore, detto **leader**, prima di costruire l'albero.

#### Computazione negli alberi

La rete è un **albero**, cioè un grafo connesso e aciclico con $n$ nodi e $n-1$ archi. In questo modello ogni nodo conosce i propri vicini e sa che la rete è un albero; non conosce necessariamente l'intera topologia. Un albero *rooted* ha una radice designata e una direzione padre–figli; un albero *unrooted* non ha una radice designata.

![[assets/Screenshot 2024-10-16 093438.png|700]]

Nel caso di alberi non radicati, consideriamo collegamenti bidirezionali, rete connessa e affidabile e messaggi FIFO. Sono le restrizioni del modello usato nelle slide per questa computazione; FIFO è un'ipotesi del protocollo, non una proprietà intrinseca degli alberi. La conoscenza della topologia significa qui che ciascun nodo sa di essere in un albero e conosce i propri vicini: può così distinguere una foglia (un solo vicino) da un nodo interno.

#### Tecnica di saturazione

La saturazione permette ai nodi di combinare valori distribuiti nella rete e poi di comunicare a tutti il risultato. Consideriamo il problema del minimo: ogni nodo $x$ possiede un valore $v(x)$, che può coincidere con quello di altri nodi; al termine ogni nodo deve sapere se il proprio valore è uguale al minimo globale.

Le foglie avviano la fase di saturazione inviando il proprio valore al loro unico vicino. Quando un nodo interno ha ricevuto valori da tutti i vicini tranne uno, calcola il minimo tra il proprio valore e quelli ricevuti, quindi invia quel minimo al vicino rimasto. Così ogni messaggio riassume i valori nella parte dell'albero da cui proviene. La propagazione procede verso una coppia di nodi adiacenti: entrambi ricevono un messaggio di saturazione da tutti i vicini e la coppia diventa la coppia **saturata**. A questo punto i due messaggi contengono i minimi delle rispettive parti dell'albero.

![[assets/Screenshot 2024-10-16 093901.png|1000]]

La coppia saturata è formata da esattamente due nodi adiacenti. Quale coppia viene selezionata può dipendere dai ritardi di comunicazione, ma l'adiacenza vale in ogni esecuzione. Per $n=2$ i due nodi sono entrambi foglie e ciascuno è l'unico vicino dell'altro: si scambiano direttamente i propri valori e diventano la coppia saturata. Questo caso limite non richiede nodi interni.

La computazione completa, detta **saturazione completa**, ha tre fasi:

1. **Attivazione.** Se la rete non è già attiva, almeno un iniziatore spontaneo avvia *Wake-up*, che attiva tutti i nodi. La fase può essere avviata da un numero arbitrario di iniziatori. Una volta attivi, i nodi sanno di appartenere a un albero e conoscono i propri vicini; non serve che conoscano l'intera topologia.
2. **Saturazione.** Le foglie iniziano l'invio dei messaggi; i nodi interni, nello stato di *processing*, aggregano i valori ricevuti e li inoltrano come descritto sopra. Alla fine viene selezionata la coppia adiacente saturata.
3. **Risoluzione.** La coppia saturata avvia la fase dipendente dall'applicazione, di solito una notifica che si propaga verso l'esterno. Nel problema del minimo, i due nodi confrontano i minimi ricevuti e propagano il minimo globale; così ogni nodo può decidere se il proprio valore lo realizza.

![[assets/Screenshot 2024-10-16 094713.png|400]]

**Complessità dei messaggi.** Per $n\geq2$, nel caso peggiore:

- l'attivazione invia al più $2(n-1)$ messaggi di *Wake-up*;
- la saturazione invia $n$ messaggi: i primi $n-1$ coprono gli archi dell'albero e il messaggio sull'arco tra i due nodi saturati è contato una seconda volta;
- la risoluzione invia $n-2$ messaggi, perché non ripercorre l'arco tra i nodi saturati.

![[assets/Screenshot 2024-10-16 113456.png|700]]

Il totale è quindi al più $2(n-1)+n+(n-2)=4n-4$ messaggi. Per $n=2$ la risoluzione non invia messaggi e le due fasi di scambio contano complessivamente quattro messaggi, in accordo con il bound. La procedura termina: ogni foglia invia una volta, ogni nodo interno inoltra una volta dopo aver ricevuto i messaggi attesi, e la risoluzione attraversa una sola volta ciascun arco restante. Il conteggio misura i messaggi, non i bit trasmessi né il tempo fisico; in un sistema asincrono senza un limite sui ritardi, il tempo fisico non ha un limite uniforme. Per $n=1$ non occorre inviare messaggi: l'unico nodo conosce già il minimo. Diffondere separatamente il valore di ogni nodo con flooding potrebbe invece richiedere un numero quadratico di messaggi.

La saturazione si applica anche ad altre funzioni calcolabili a partire da dati distribuiti, tra cui statistiche cardinali, eccentricità, centro, mediana e cammino diametrale. Il minimo è l'esempio usato qui per mostrare l'aggregazione e la successiva diffusione del risultato.

In un albero rooted, invece, la radice è già designata. Per le computazioni che lo richiedono, la radice avvia un *broadcast*; le risposte dei figli vengono raccolte verso l'alto con un *convergecast*: le foglie inviano al padre e ogni nodo interno invia il proprio risultato dopo aver ricevuto quelli da tutti i figli. La radice può quindi riconoscere il completamento quando riceve i risultati dai propri figli.

### 3.2 Leader election in alberi

#### Introduzione

La *leader election* porta il sistema a una configurazione in cui un solo nodo è leader e tutti gli altri sono follower. In assenza di una radice designata, l'elezione richiede un modo per distinguere i candidati; nel caso trattato qui si usano identificativi univoci. Ogni nodo deve conoscere il proprio stato finale.

![[assets/Screenshot 2024-10-25 111800.png|600]]

#### Limite deterministico senza identificativi distinguibili

> [!theorem] Teorema (Angluin, 1980)
> The leader election problem is unsolvable unless the entities have different IDs.

[[teacher_slides/2_distributed algorithms.pdf#page=136|Slide della docente, p. 136]]
[[teacher_slides/2_distributed algorithms.pdf#page=137|Slide della docente, p. 137]]

**Precisazione sul modello.** Il teorema riguarda un protocollo deterministico che deve risolvere l'elezione per reti connesse senza guasti e con collegamenti bidirezionali. La dimostrazione delle slide considera due entità anonime, sincrone, nello stesso stato iniziale: ricevono gli stessi messaggi, restano nello stesso stato e non possono eleggere esattamente una leader. Quindi, senza informazione che distingua i nodi, l'elezione non è garantita in generale. Una radice già designata rompe la simmetria iniziale e costituisce il caso distinto qui sotto.

#### Leader election in alberi

In un albero rooted, la radice si elegge leader e gli altri nodi diventano follower. L'elezione in sé non richiede messaggi; per notificare lo stato agli altri nodi occorrono $O(n)$ messaggi.

In un albero unrooted, i nodi usano la saturazione per selezionare due nodi adiacenti. I due nodi confrontano i propri identificativi univoci e diventa leader quello con l'identificativo minore; la risoluzione notifica l'esito al resto dell'albero. Includendo l'attivazione, il numero di messaggi è al più $4n-4$ per $n\geq2$. Nella saturazione bastano messaggi di $c=O(1)$ bit per individuare la coppia; l'invio dei due identificativi richiede $O(2\log MaxID)$ bit, dove $MaxID$ è il massimo identificativo. Il costo in bit indicato nelle slide è dunque $O(2\log MaxID+cn)$.

#### Leader election e spanning tree

Se uno spanning tree con radice designata è già disponibile, la radice può essere il leader e la notifica si propaga lungo l'albero. Nel verso opposto, se un protocollo elegge un leader in un grafo connesso, il leader può avviare la costruzione di uno spanning tree. Le ipotesi iniziali sono diverse: nel primo caso la radice è già designata; nel secondo serve un protocollo di elezione applicabile al grafo dato.

### 3.3 Leader election in anelli

#### Introduzione

[[teacher_slides/2_distributed algorithms.pdf#page=140|Slide della docente, p. 140]]

Un anello con $n$ nodi ha $m=n$ archi e una topologia simmetrica. Per eleggere deterministicamente un solo leader usiamo identificativi distinti; in questa sezione viene eletto il nodo con ID minimo. Ogni nodo deve infine sapere se è leader o follower. Assumiamo link affidabili e un orientamento locale, cioè ciascun nodo distingue i due vicini e può inoltrare in una direzione scelta localmente. Non serve che tutti concordino su un senso globale dell’anello. Gli algoritmi precisano se ammettono link unidirezionali o richiedono link bidirezionali.

![[assets/Screenshot 2024-10-25 113100.png|400]]

#### All The Way

Ogni nodo invia il proprio ID lungo l’anello. Quando riceve un ID da un vicino, lo inoltra all'altro vicino; se riceve di ritorno il proprio ID, ne termina l'inoltro. Così i messaggi percorrono un giro completo e ogni nodo aggiorna il minimo osservato. Quando ha confrontato tutti gli ID, il nodo sa autonomamente se è il minimo: non serve una notifica separata.

[[teacher_slides/2_distributed algorithms.pdf#page=145|Slide della docente, pp. 145–154]]

**Modello.** Link affidabili, ID distinti e orientamento locale. Il protocollo funziona su anelli unidirezionali o bidirezionali e ammette più iniziatori. Per sapere di aver ricevuto tutti gli ID, un nodo deve conoscere $n$ oppure usare canali FIFO; altrimenti il suo messaggio di ritorno potrebbe precedere messaggi di altri nodi. In alternativa, come nelle slide, può ricavare la dimensione dell’anello contando i salti nel messaggio e contando quanti ID distinti ha ricevuto.

![[assets/Screenshot 2024-10-25 114925.png|600]]

Con il contatore nel messaggio, quando il messaggio torna al mittente il nodo conosce la lunghezza dell’anello. Il contatore locale gli permette anche di tenere traccia degli ID distinti già visti. Quando il numero di ID distinti, incluso il proprio, raggiunge $n$, il nodo ha visto tutti gli identificativi e può terminare.

![[assets/Screenshot 2024-10-25 190012.png|800]]

**Messaggi.** Ogni ID attraversa $n$ archi e ci sono $n$ ID, per un totale di $n^2=O(n^2)$ messaggi. Le slide misurano separatamente anche i bit: se ogni ID richiede $O(\log(\mathrm{MaxID}))$ bit, il totale è $O(n^2\log(\mathrm{MaxID}))$.

**Tempo.** Nel caso peggiore considerato nelle slide, un solo iniziatore sveglia gli altri nodi in sequenza. La catena più lunga comprende gli $n-1$ invii che risvegliano i nodi e il messaggio dell’ultimo nodo risvegliato, che percorre $n$ archi: al più $2n-1$ invii in catena, cioè $O(n)$ unità nel modello a ritardo unitario.

#### As Far As It Can

As Far As It Can (LCR) riduce i messaggi di All The Way: un ID ricevuto viene inoltrato solo se è più piccolo del minimo osservato finora. Se è più grande, quel candidato non può diventare leader e il messaggio viene fermato. L’unico ID che compie il giro e torna al mittente è il minimo.

[[teacher_slides/2_distributed algorithms.pdf#page=155|Slide della docente, pp. 155–168]]

**Modello.** Link affidabili, ID distinti e orientamento locale. L’algoritmo usa un solo senso di inoltro, anche se l’anello fisico può essere bidirezionale. Non richiede di conoscere $n$ e ammette più iniziatori.

![[assets/Screenshot 2024-10-25 124227.png|600]]

Quando un nodo si attiva spontaneamente, invia il proprio ID e lo registra come minimo visto. Un nodo addormentato che riceve un ID si risveglia: se l’ID ricevuto è maggiore del proprio, lo ferma e avvia il proprio ID; se è minore, inoltra quello ricevuto e lo registra come minimo visto. Un nodo già sveglio inoltra un ID ricevuto se è minore del minimo che ha visto; se riceve il proprio ID di ritorno, si proclama leader e invia una notifica. Gli altri nodi inoltrano la notifica e diventano follower. Il nodo risvegliato non deve perdere l’avvio del proprio ID quando ferma un identificativo maggiore: entrambi i comportamenti fanno parte della regola di risveglio.

![[assets/Screenshot 2024-10-25 190720.png|400]]

![[assets/Screenshot 2024-10-29 113216.png|650]]

**Messaggi.** Nel caso pessimo tutti i nodi si svegliano insieme e gli ID sono disposti in ordine crescente nella direzione di inoltro. L’ID più alto percorre un arco, quello immediatamente inferiore due, e così via. Prima della notifica si inviano

$$\sum_{j=1}^{n}j=\frac{n(n+1)}2$$

messaggi. La notifica aggiunge $n$ invii, quindi il totale in questo caso è $\frac{n(n+1)}2+n=O(n^2)$. Nel caso migliore un solo iniziatore è il leader minimo: il suo ID compie il giro in $n$ invii, gli altri ID non vengono avviati e la notifica costa altri $n$, per un totale di $2n=O(n)$.

**Tempo.** Nel caso pessimo delle slide per la versione unidirezionale sincrona, l’iniziatore è il vicino successivo del futuro leader nella direzione che lo sveglia. Il risveglio del leader richiede $n-1$ invii; il giro del suo ID ne richiede $n$ e la notifica altri $n$. La catena fino alla notifica è quindi $3n-1=O(n)$ unità di tempo. Questo conto dipende dal modello sincrono e dalla catena di risveglio descritta; non è un tempo fisico indipendente dalle ipotesi di attivazione e ritardo.

#### Controlled Distance

Controlled Distance (HS) riduce il numero di messaggi rispetto a LCR ampliando a ogni stage la distanza percorsa dai candidati. Il candidato sopravvive se non incontra un ID più piccolo entro la distanza prevista in entrambe le direzioni. Dopo un numero finito di stage resta il minimo globale.

[[teacher_slides/2_distributed algorithms.pdf#page=169|Slide della docente, pp. 169–195]]

**Modello.** Link bidirezionali affidabili, ID distinti e orientamento locale. Sono ammessi più iniziatori; all’inizio tutti i nodi sono candidati oppure diventano candidati quando si attivano. Non è necessario conoscere $n$.

![[assets/Screenshot 2024-10-29 114205.png|700]]

Allo stage $i$ ogni candidato invia in entrambe le direzioni un messaggio **Forth** con il proprio ID e limite $2^i$. Il nodo inoltra il messaggio finché non raggiunge quel limite o incontra un ID più piccolo. Se un candidato riceve l’ID più piccolo di un altro candidato, diventa **DEFEATED** e da quel momento inoltra passivamente i messaggi altrui. Se un messaggio Forth incontra un candidato con ID minore, viene fermato; se raggiunge il limite senza essere fermato, torna indietro come **Back**. Il candidato passa allo stage successivo solo dopo aver ricevuto indietro entrambi i messaggi. Se un messaggio Forth del candidato minimo compie il giro e ritorna al mittente, il candidato è il leader e invia una notifica che raggiunge tutti i nodi.

![[assets/Screenshot 2024-10-29 114514.png|800]]

![[assets/Screenshot 2024-10-29 115446.png|1000]]

**Terminazione.** Il limite raddoppia a ogni stage; prima o poi supera $n$. Il minimo globale non viene sconfitto e il suo messaggio Forth completa il giro, permettendogli di dichiararsi leader. La notifica informa gli altri nodi della terminazione.

**Numero di stage.** Per $n\ge2$, il primo stage ha indice $0$ e il primo limite che raggiunge almeno $n$ è quello con indice $d=\lceil\log_2 n\rceil$. Gli stage sono quindi $d+1=\lceil\log_2 n\rceil+1$.

![[assets/Screenshot 2024-10-29 120125.png|1000]]

**Messaggi.** Per $i\ge1$, un candidato sopravvissuto allo stage precedente ha ID minore di tutti quelli entro distanza $2^{i-1}$ su entrambi i lati. Due candidati superstiti sono pertanto separati da almeno $2^{i-1}+1$ archi; il numero di candidati allo stage $i$ è al più $\left\lfloor n/(2^{i-1}+1)\right\rfloor$.

Un candidato invia al più $2^i$ messaggi Forth in ciascuna direzione e altrettanti Back, per un massimo di $4\cdot2^i$ messaggi. Per ogni stage interno $1\le i<d$:

$$4\cdot2^i\left\lfloor\frac{n}{2^{i-1}+1}\right\rfloor\le 8n\frac{2^{i-1}}{2^{i-1}+1}<8n.$$

Allo stage $0$ possono essere candidati tutti i nodi: il limite è $4n$ invii. All’ultimo stage $d$, il messaggio del minimo percorre il giro dell’anello in entrambe le direzioni, per $2n$ invii complessivi. La notifica costa $n$ invii. Per $n\ge2$, quindi, il limite riportato nelle slide è

$$4n+\sum_{i=1}^{d-1}8n+2n+n=7n+8n(d-1)=O(n\log n).$$

Il limite per l’ultimo stage è separato da quello degli stage interni: in quest’ultimo, il conteggio $4\cdot2^i$ per candidato e il limite sul numero di candidati non vanno applicati al leader quando il messaggio ha già percorso l’intero anello. Per $n=1$ l’unico nodo è leader senza eseguire gli stage dell’analisi per $n\ge2$.

**Tempo.** Con attivazioni simultanee e nel modello ideale a un invio per arco senza attese di coda, il risveglio dei nodi richiede al più $O(n)$ lungo l’anello. Lo stage $i$ impiega al più un tempo proporzionale a $2^i$ per andata e ritorno fino a $d-1$; la somma geometrica è $O(2^d)=O(n)$. L’ultimo stage e la notifica richiedono ciascuno $O(n)$. Il tempo ideale complessivo è quindi $O(n)$. Il bound esatto della docente non viene assunto per attivazioni arbitrarie o ritardi non unitari.

### 3.4 Leader election in grafi generici

#### Introduzione

In un grafo connesso e bidirezionale $G=(V,E)$ vogliamo che ogni nodo sappia se è l’unico leader o un follower. Assumiamo ID distinti, link affidabili e porte locali per distinguere i vicini. FloodMax elegge il nodo con ID massimo; YO-YO elegge quello con ID minimo. Le conoscenze ulteriori sono specificate per ciascun protocollo.

#### FloodMax

[[teacher_slides/2_distributed algorithms.pdf#page=198|Slide della docente, pp. 198–203]]

**Idea e modello.** Ogni nodo propaga il massimo ID che ha visto, iniziando dal proprio. FloodMax richiede un grafo connesso e bidirezionale, link affidabili, canali FIFO e round coordinati. Ogni nodo conosce il diametro $d$ del grafo o un suo limite superiore, così può fermarsi dopo quel numero di round.

![[assets/Screenshot 2024-10-30 185342.png|600]]

Al round $r$ ogni nodo invia ai vicini il massimo ID noto e attende un messaggio da ciascuno. Dopo $r$ round, il massimo globale è arrivato a tutti i nodi a distanza al più $r$ dal nodo che possiede quell’ID: questa è l’invariante di correttezza. Dopo $d$ round ogni nodo conosce quindi l’ID massimo globale e si dichiara leader se coincide col proprio; altrimenti diventa follower.

**Messaggi e tempo.** Ogni round ogni nodo invia un messaggio a ciascun vicino. Poiché la somma dei gradi è $2m$, in $d$ round vengono inviati $2md$ messaggi. Il tempo è $d$ round, in base alla sincronizzazione e all’attesa di tutti i messaggi del round.

#### Protocollo YO-YO

[[teacher_slides/2_distributed algorithms.pdf#page=204|Slide della docente, pp. 204–258]]

YO-YO elegge il nodo con ID minimo senza richiedere la conoscenza del diametro. Il grafo fisico resta connesso, bidirezionale e affidabile e gli ID sono distinti. Il protocollo usa gli ID dei vicini per costruire un orientamento logico aciclico e poi lo aggiorna durante le iterazioni.

**Orientamento iniziale.** Ogni coppia di vicini si scambia il proprio ID; l’arco viene orientato dal nodo con ID minore verso quello con ID maggiore. L’orientamento è un DAG, perché lungo ogni arco diretto gli ID crescono strettamente e quindi non può esistere un ciclo diretto. Un nodo con soli archi uscenti è una **source**; uno con soli archi entranti è un **sink**; un nodo con entrambi i tipi è **internal**.

**Iterazione.** Ogni iterazione ha due passi.

1. **YO, invio verso il basso.** Ogni source invia il proprio ID sugli archi uscenti. Un nodo internal attende un messaggio da ciascun arco entrante, calcola il minimo ricevuto e lo invia su tutti gli archi uscenti. I sink avviano il passo di ritorno.
2. **-YO, invio verso l’alto.** Ogni sink invia YES sugli archi dai quali ha ricevuto il minimo e NO sugli altri. Un nodo internal attende un voto da ciascun arco uscente. Se riceve solo YES, invia YES sugli archi entranti dai quali arrivava il minimo e NO sugli altri. Se riceve almeno un NO, invia NO su tutti gli archi entranti. Una source che riceve solo YES resta candidata; se riceve almeno un NO è sconfitta.

Prima dell’iterazione successiva, ogni arco percorso da un NO viene **invertito logicamente (flip)**. Una source sconfitta diventa sink o nodo internal; le nuove source sono perciò soltanto source sopravvissute. L’orientamento resta aciclico anche dopo i flip.

[[teacher_slides/2_distributed algorithms.pdf#page=239|Slide della docente, pp. 239–249]]

**Pruning logico e terminazione.** Durante il passo -YO si possono eliminare logicamente gli archi che non serviranno più: un sink con un solo arco entrante può eliminare quell’arco, perché la propria decisione coincide con quella del predecessore; quando un nodo riceve più copie dello stesso minimo, conserva un solo arco corrispondente. Il pruning non rimuove link fisici: i nodi non li useranno nelle iterazioni successive.

A ogni iterazione almeno una source viene sconfitta. Nel grafo delle source usato nelle slide, due source sono collegate se condividono un sink; in ogni cammino almeno una source su due viene sconfitta. Dopo il flip, le source superstiti formano quindi cammini lunghi al più la metà, e servono $O(\log n)$ iterazioni. Il minimo globale non riceve mai NO e resta candidato; è l’unica source che può sopravvivere. Quando resta una sola source, al più un’ulteriore iterazione elimina logicamente gli archi residui. La source rileva di non avere più archi, si dichiara leader e invia la notifica lungo gli ultimi archi potati.

[[teacher_slides/2_distributed algorithms.pdf#page=230|Slide della docente, p. 230]]

**Messaggi.** Senza pruning, il setup usa due messaggi per arco ($2m$) e ogni iterazione al più due messaggi per arco ($2m$). La notifica usa $n-1$ messaggi. Con $O(\log n)$ iterazioni si ottiene l’upper bound $O(m\log n)$; le slide non danno un conteggio esatto valido per ogni esecuzione con pruning, perché il numero di archi attivi varia.

### 3.5 Leader election in anelli sincroni

#### Introduzione

Nei protocolli sincroni i nodi possono usare il tempo per coordinare le proprie azioni e distinguere i candidati. Assumiamo un sistema affidabile con clock sincronizzati: i nodi inviano messaggi ai vicini soltanto al battito del clock e, a ogni battito, inviano al più un messaggio allo stesso vicino. Il ritardo di comunicazione ha un limite superiore noto. Indichiamo con $\delta$ il tempo tra due battiti. Assumiamo inoltre che ogni messaggio abbia dimensione al più $c$ bit; un messaggio più grande viene suddiviso in pacchetti di $c$ bit, e questa suddivisione può incidere sui costi.

Nei protocolli seguenti il grafo è un anello orientato, salvo dove è indicato il caso generale. Quando si parla di elezione deterministica, gli ID sono distinti e l'obiettivo è eleggere quello minimo. Le informazioni note ai nodi, come $n$, sono specificate per ciascun protocollo.

#### Speeding

**Problema e idea.** In un anello sincrono unidirezionale con ID distinti, vogliamo eleggere il nodo con ID minimo. Come in [[#As Far As It Can]], un ID più piccolo può fermare un candidato più grande. Speeding assegna ai messaggi ritardi maggiori quanto più grande è il loro ID, così il candidato minimo può raggiungere e bloccare gli altri prima che completino il giro.

[[teacher_slides/2_distributed algorithms.pdf#page=269|Slide della docente, p. 269]]

La slide della docente precisa che la partenza simultanea serve a esporre l'analisi, ma non è un requisito intrinseco del protocollo; non occorre conoscere $n$ (slide p. 269). Scegliamo la funzione crescente $f(i)=2^i$. Quando un nodo riceve un ID $i$ più piccolo del proprio, lo inoltra dopo $2^i$ unità di tempo. Se riceve il proprio ID di ritorno, si elegge leader e invia una notifica senza ritardo.

![[assets/Screenshot 2024-10-30 185452.png|600]]

**Tempo.** Sia $m$ il minimo ID. Il suo messaggio attende $2^m$ unità presso ciascuno degli $n$ nodi e attraversa $n$ archi, impiegando un'unità per arco. Il leader viene quindi eletto e notificato entro $2^m n+n=O(2^m n)$ unità di tempo.

Gli altri candidati non completano il giro prima che la notifica li raggiunga. Infatti, il secondo ID più piccolo è almeno $m+1$ e, durante il tempo $2^m n+n$ impiegato dal minimo, può attraversare al più

$$\frac{2^m n+n}{2^{m+1}}=\frac n2+\frac{n}{2^{m+1}}\le n$$

nodi; per completare il giro dovrebbe attraversare $n$ archi, ma dopo aver atteso presso i nodi attraversa un numero di archi strettamente minore del numero di nodi visitati. Gli ID successivi attendono almeno altrettanto a ogni inoltro, quindi non possono completare il giro prima. L'argomento riguarda il tempo fino alla notifica: il conteggio dei nodi visitati da solo non va confuso con il conteggio degli archi già attraversati.

![[assets/Screenshot 2024-11-05 111636.png|700]]

**Messaggi.** Il minimo invia un messaggio su ciascuno degli $n$ archi. Il secondo ID più piccolo attraversa meno di $n$ archi; per il candidato in posizione $j\ge3$, il confronto temporale mostra che attraversa meno di $n/2^{j-2}$ archi: il suo ID è almeno $m+j-1$, perciò attende almeno $2^{m+j-1}$ a ogni nodo. Sommando, il numero totale di messaggi è al più $n+n+\sum_{j=3}^{n}n/2^{j-2}=O(n)$. Il bound $O(n)$ conta messaggi logici e assume che un ID occupi un messaggio. Se gli ID sono interi non negativi fino a $\mathrm{Max}$, la loro lunghezza è $O(\log(\mathrm{Max}+2))$ bit: il traffico è $O(n\log(\mathrm{Max}+2))$ bit. Se il limite $c$ impone di spezzare un ID, aumentano il numero di pacchetti e il tempo di trasmissione.

**Usare il silenzio.** In un sistema sincrono si può codificare una quantità nel tempo tra due messaggi. Per trasmettere un intero $x$ a un vicino, il mittente invia un bit, attende $x$ unità e ne invia un secondo. Il destinatario misura la distanza temporale tra le ricezioni e ricava $x$. Si usano due bit e $x$ unità di attesa (oltre alla propagazione dei due bit); questa idea di codifica non modifica da sola il protocollo Speeding.

![[assets/Screenshot 2024-11-05 111823.png|700]]

#### Waiting

**Problema e idea.** Waiting elegge l'ID minimo in un anello sincrono affidabile con ID distinti e con $n$ noto a tutti. Ogni nodo attende un tempo determinato dal proprio ID; se entro la scadenza non riceve una notifica, si elegge leader e notifica gli altri. La funzione di attesa deve crescere con l'ID e lasciare alla notifica del minimo il tempo di raggiungere ogni altro nodo prima che questo scada.

Sia $d(x,y)$ la distanza orientata dal nodo $x$ al nodo $y$, misurata in archi. Con avvio simultaneo, il caso peggiore per separare il minimo $x$ dal candidato successivo $y$ è $y=x+1$ in valore di ID e $d(x,y)=n-1$. Per far arrivare la notifica prima della scadenza di $y$ occorre

$$f(x,n)+d(x,y)<f(y,n),$$

e quindi è sufficiente che $f(x+1,n)-f(x,n)>n-1$. La scelta $f(i,n)=in$ soddisfa il vincolo: la differenza è $n$. Ogni nodo invia una notifica di un bit, per un totale di $n$ messaggi. Il tempo fino all'elezione e alla notifica è al più $mn+n=O((m+1)n)$, dove $m$ è il minimo ID; il termine additivo mantiene valido il bound anche se $m=0$.

![[assets/Screenshot 2024-11-05 112934.png|700]]
![[assets/Screenshot 2024-11-05 113015.png|700]]

**Risveglio progressivo.** Se i nodi non partono insieme, un nodo sveglio spontaneamente invia un messaggio di *wake-up* al vicino prima di iniziare l'attesa; un nodo addormentato che lo riceve lo inoltra e poi inizia ad attendere. Sia $t(i)$ l'istante in cui il nodo $i$ si sveglia, $x$ il minimo ID e $y$ un altro ID. La notifica di $x$ deve raggiungere $y$ prima che termini la sua attesa:

$$t(x)+f(x,n)+d(x,y)<t(y)+f(y,n).$$

Sul ciclo, un risveglio propagato e una notifica percorrono al più $n-1$ archi, dunque $t(x)-t(y)<n$ e $d(x,y)<n$. È quindi sufficiente imporre $f(x,n)+2n\le f(y,n)$. Nel caso peggiore $y=x+1$; la scelta $f(i,n)=2ni$ soddisfa il requisito, perché $f(x+1,n)-f(x,n)=2n$. La stretta disuguaglianza iniziale garantisce che la notifica arrivi prima della scadenza anche quando gli istanti sono interi.

Si invia un messaggio di wake-up e uno di notifica su ciascun arco: $2n$ messaggi di un bit, quindi $O(n)$ bit. Il tempo è al più $2nm+2n=O((m+1)n)$ unità.

#### Universal Waiting

La strategia Waiting si estende a un grafo connesso e affidabile con ID distinti, clock sincronizzati e $n$ noto. Il protocollo diffonde un messaggio di avvio; quando un nodo diventa attivo, attende $f(i,n)$ unità. Se non riceve una notifica di elezione entro la scadenza, dichiara di avere l'ID minimo e diffonde uno *stop*; chi riceve lo stop mentre attende rinuncia e lo inoltra.

Perché la separazione delle scadenze funzioni, serve un limite noto $D$ sul tempo di propagazione sia dell'attivazione sia della notifica. Se ogni trasmissione lungo un arco impiega al più un’unità di tempo, in un grafo connesso di $n$ nodi il diametro è al più $n-1$, quindi si può usare $n$ come limite superiore e scegliere $f(i,n)=2ni$, come nelle slide (pp. 288; il ragionamento di Waiting è alle pp. 282–286). In forma generale, se si dispone direttamente del limite $D$, una separazione di almeno $2D$ tra scadenze di ID consecutivi è sufficiente per lo stesso argomento. Questa formulazione esplicita il bound necessario: sostituire semplicemente $n$ con il diametro senza specificare quale ritardo esso limita non basta.

![[assets/Screenshot 2024-11-06 100832.png|700]]

#### Elezione casuale del leader

**Problema e garanzia.** Se i nodi di un anello sono anonimi o hanno tutti lo stesso ID, un protocollo deterministico non può eleggere un unico leader: nodi indistinguibili ricevono le stesse informazioni e si comportano nello stesso modo. Un protocollo randomizzato usa scelte casuali per rompere questa simmetria.

Un protocollo **Monte Carlo** termina sempre, ma può dare un risultato errato con una certa probabilità. Un protocollo **Las Vegas** dà sempre un risultato corretto quando termina, ma può non terminare; nel protocollo qui descritto termina con probabilità 1, senza un limite deterministico al numero di round.

**Protocollo.** Si ripetono round indipendenti. In ogni round ogni nodo sceglie in modo indipendente un ID casuale in $\{0,1\}$. Si usa Waiting per individuare il minimo. Il round ha successo solo se il minimo è unico: con scelte in $\{0,1\}$ questo accade quando un solo nodo sceglie $0$ e tutti gli altri scelgono $1$. Quel nodo verifica che il suo messaggio percorra l'intero anello e ritorni dopo $n$ unità, poi si elegge. Se il minimo non è unico (anche nel caso in cui tutti scelgano $1$), la rilevazione di pareggio del protocollo Waiting avvia un nuovo round tramite un messaggio di *restart*.

![[assets/Screenshot 2024-11-06 102152.png|800]]

Per $n\ge2$, ogni nodo sceglie $0$ con probabilità $1/n$ e $1$ con probabilità $(n-1)/n$. Il round riesce quando un solo nodo sceglie $0$ e tutti gli altri scelgono $1$. Per una scelta fissata $x$, la probabilità è $(1/n)((n-1)/n)^{n-1}$; vi sono $n$ possibili nodi $x$, quindi

$$p_n=n\cdot\frac1n\left(\frac{n-1}{n}\right)^{n-1}=\left(1-\frac1n\right)^{n-1}\xrightarrow[n\to\infty]{}\frac1e.$$

Per ogni round i messaggi di ricerca e quelli di notifica o restart totalizzano $O(n)$ bit. Il tempo di un round è $O(n)$ unità: la propagazione sull'anello richiede fino a $n$ unità e l'attesa è limitata perché gli ID sono solo 0 e 1. I round sono indipendenti; il numero di round ha distribuzione geometrica e valore atteso $1/p_n$, che tende a $e$ (perciò è circa 3 per $n$ grande). Ne seguono $O(n)$ bit e $O(n)$ unità di tempo attesi per l'intera elezione. Non c'è un massimo deterministico di round, ma la probabilità di non terminare dopo $r$ round è $(1-p_n)^r$, che tende a zero.

## 4 Algoritmi di routing

### Introduzione

**Problema.** Una sorgente $x$ deve far arrivare un messaggio a una destinazione $y$. Il [[#Broadcast|broadcast]] raggiungerebbe anche tutti gli altri nodi; il *routing* permette invece a ogni nodo attraversato di scegliere il collegamento successivo dalla propria tabella locale, usando l'indirizzo di destinazione. Vogliamo costruire queste tabelle in una rete con:

- collegamenti bidirezionali, eventualmente con costi associati;

- grafo connesso;

- comunicazione affidabile;

- orientamento locale: ogni nodo distingue i propri vicini e la provenienza dei messaggi;

- identificativi univoci.

### Routing table

Ciascun nodo conserva, per ogni destinazione, il vicino a cui inoltrare il messaggio (*next hop*) e, quando si cercano cammini minimi, il costo del cammino noto. Ci interessano:

- lo spazio della tabella, misurato in bit;

- il tempo necessario per scegliere il collegamento in uscita.

![[assets/Screenshot 2024-11-06 164323.png|700]]

Ogni nodo sceglie il prossimo collegamento in base ai cammini minimi dal proprio punto di vista. Il **principio di ottimalità** afferma che, se $x$ si trova su un cammino minimo da $a$ a $b$, allora il **suffisso da $x$ a $b$** è a sua volta un cammino minimo da $x$ a $b$. Per questo un nodo intermedio può continuare l'inoltro usando la propria tabella locale.

### Gossiping

[[teacher_slides/2_distributed algorithms.pdf#page=306|Slide della docente: Gossiping, p. 306]]

**Idea.** Ogni nodo comunica a tutti la propria lista di vicini. Dopo la costruzione di uno [[#Spanning tree|spanning tree]], le liste sono diffuse lungo l'albero: ogni nodo ricostruisce il grafo, calcola i cammini minimi verso le destinazioni e genera la propria tabella. La mappa può poi essere scartata, ma durante la costruzione ogni nodo deve poterla conservare.

![[assets/Screenshot 2024-11-06 165045.png|600]]

- Comunicazione: il conteggio delle slide considera ogni informazione su un vicino come un elemento trasmesso separatamente lungo l'albero. Le fasi sono:

  - SHOUT+ per generare lo spanning tree: $2m$ messaggi;

  - scambio delle informazioni sul vicinato: due messaggi per collegamento, uno per direzione, quindi $2m$ invii;

  - diffusione lungo lo spanning tree: la lista di $x$ contiene $\deg(x)$ elementi; se ciascuno viaggia separatamente, viene trasmesso sui $n-1$ archi dell'albero:

    $$\begin{aligned}
                                \sum_{x} (n - 1) \cdot deg(x) = (n - 1) \cdot \sum_{x} deg(x) = (n - 1) \cdot 2 \cdot m
    \end{aligned}$$

    La somma dei gradi è $2m$ perché ogni arco è incidente a due nodi.

  Con questa convenzione, il costo è $O(mn)$ trasmissioni di elementi. Se più informazioni vengono accorpate in un messaggio, il numero di invii può diminuire, mentre cresce la dimensione dei messaggi. Ogni nodo deve poter memorizzare la mappa completa del grafo, che richiede spazio $\Theta(n+m)$ in unità di vertici e archi.

### Iterating

[[teacher_slides/2_distributed algorithms.pdf#page=314|Slide della docente: Iterating, p. 314]]

**Problema e modello.** Ogni nodo deve costruire una tabella di routing su un grafo connesso e affidabile con costi non negativi dei collegamenti noti ai loro estremi. A differenza del [[#Gossiping|gossiping]], che diffonde il grafo intero, Iterating scambia stime delle distanze: all'inizio ogni nodo conosce il costo dei collegamenti ai propri vicini, poi invia ai vicini il proprio *distance vector* di $n$ costi e lo aggiorna usando quelli ricevuti. Le iterazioni e i conteggi sotto assumono round coordinati e conoscenza di $n$, come nelle slide.

![[assets/Screenshot 2024-11-08 170555.png|1000]]

È una forma distribuita di Bellman–Ford: dopo il round $k$, ogni nodo conosce il costo minimo di un cammino con al più $k$ archi verso ciascuna destinazione e il vicino che realizza la stima. Con costi non negativi esiste un cammino minimo semplice, con al più $n-1$ archi; quindi dopo $n-1$ round tutte le tabelle sono corrette. A differenza di Gossiping, i nodi non ricostruiscono la mappa completa.

- Comunicazione: a ogni iterazione ciascun nodo invia il proprio distance vector di $n$ costi a tutti i vicini. Se il vettore è **un messaggio**, gli invii sono $\sum_x |N(x)|=2m$ per iterazione, dunque al più $2m(n-1)\in O(mn)$ invii in totale. Se invece contiamo i singoli **elementi trasmessi**, come nel calcolo delle slide, otteniamo:

  $$\begin{aligned}
                      (n-1)n\sum_x |N(x)|=2mn(n-1)\in O(n^2m).
  \end{aligned}$$

  Nel conteggio per elementi, Iterating ha il bound $O(n^2m)$ contro $O(mn)$ di Gossiping. Ogni nodo conserva il proprio vettore e le stime ricevute dai vicini per aggiornarlo; non memorizza l'intera mappa del grafo. Lo spazio dipende anche da come vengono conservati questi vettori.

I due algoritmi seguenti costruiscono invece un albero dei cammini minimi da una sorgente alla volta: Min-Hop per il numero di archi e Dijkstra per i costi positivi.

### Min-Hop routing

[[teacher_slides/2_distributed algorithms.pdf#page=333|Slide della docente: Min-Hop, p. 333]]

**Problema e modello.** Da una sorgente $s$ vogliamo costruire un albero dei cammini con il **minor numero di archi** verso ogni nodo. Assumiamo un grafo connesso, bidirezionale e affidabile, con collegamenti senza peso oppure tutti dello stesso costo. Nel modello ideale sincrono, [[#Protocollo Shout|SHOUT]] scopre i nodi per livelli di distanza da $s$ e costruisce un albero BFS. In una rete asincrona l'ordine di arrivo dei messaggi non identifica il livello: Min-Hop coordina esplicitamente l'esplorazione di un livello per volta. Ogni nodo può esplorare in parallelo più collegamenti, ma la radice avvia il livello successivo soltanto dopo tutte le risposte del livello corrente.

![[assets/Screenshot 2024-11-08 171837.png|600]]

All'inizio dell'iterazione $i$, l'albero parziale contiene esattamente i nodi a distanza al più $i-1$ da $s$. Ogni nodo già incluso conosce il padre, i figli e la propria distanza. La radice diffonde `start` nell'albero; le foglie di livello $i-1$ esplorano i collegamenti ancora non trattati. Un nodo esterno che riceve il primo `explore` entra nell'albero al livello $i$ e risponde; una risposta negativa o un'esplorazione incrociata evita di aggiungere di nuovo un nodo già raggiunto. Al termine, i nuovi nodi sono precisamente quelli a distanza $i$.

![[assets/Screenshot 2024-11-08 172142.png|600]]

Quando ogni esploratore ha ricevuto le risposte attese, un *convergecast* nell'albero riporta l'esito a $s$. La radice può arrestarsi dopo aver contato $n-1$ nodi aggiunti o eseguito $n-1$ iterazioni, se conosce $n$; altrimenti può arrestarsi quando un'iterazione completa non scopre alcun nodo nuovo. Quest'ultima prova di stagnazione può richiedere un'iterazione ulteriore dopo la scoperta dell'ultimo livello. La radice diffonde infine `stop` nell'albero.

- Messaggi inviati: all'$i$-esima iterazione abbiamo un flooding sull'albero parziale (di profondità esattamente pari a $i - 1$), poi la fase di esplorazione ed infine il convergecast.
  Sia $n_i$ il numero di nodi già nell’albero all’inizio dell’iterazione $i$. Sia il convergecast sia il flooding implicano $n_i-1$ messaggi, uno per arco dell’albero parziale. Per questi, abbiamo complessivamente:

  $$\begin{aligned}
                      \sum_{i = 1}^{r(s)} 2 \cdot (n_i - 1) \leq 2 \cdot (n - 1) \sum_{i = 1}^{r(s)} 1 \leq 2 \cdot (n - 1) \cdot D(G)
  \end{aligned}$$

  dove $r(s)$ è l’eccentricità di $s$, cioè la massima distanza da $s$, e $D(G)$ è il diametro. Queste sono le iterazioni che scoprono livelli nuovi, con $r(s)\le D(G)\le n-1$; un’eventuale verifica finale di stagnazione aggiunge al più $2(n-1)$ messaggi nell’albero.
  Nella fase di esplorazione, ogni arco viene considerato una sola volta: passa un messaggio `explore` e una risposta, oppure due `explore` incrociati fra nodi dello stesso livello. Il totale è quindi **$2m$ messaggi**, come nelle slide; non bisogna contare una seconda esplorazione dello stesso arco.
  Sommando il tutto otteniamo:

  $$\begin{aligned}
                      2(n-1)D(G)+2m\leq 2(n-1)^2+2m\in O(n^2).
  \end{aligned}$$

  La maggiorazione $D(G)\le n-1$ vale per ogni grafo connesso. Eseguire comunque $n-1$ iterazioni, oppure una verifica finale senza nodi nuovi, mantiene il bound $O(n^2)$.

- Tempo di esecuzione: anche in questo caso, possiamo distinguere tre diversi costi per la generica iterazione $i$-esima. Explore e convergecast sono catene di $i - 1$ messaggi, mentre la ricerca è una catena di $2$ messaggi. Sommando il tutto troviamo $2 \cdot i$ messaggi consecutivi per ogni iterazione.
  Per tutte le iterazioni abbiamo:

  $$\begin{aligned}
                      \sum_{i = 1}^{r(s)} 2 \cdot i = 2 \cdot \frac{r(s) \cdot (r(s) + 1)}{2} = r(s) \cdot (r(s) + 1) \in O(r(s)^2) \in O(n^2)
  \end{aligned}$$

  Per la verifica finale di stagnazione si sostituisce $r(s)$ con al più $r(s)+1$: il tempo resta $O(n^2)$.

### Algoritmo di Dijkstra

[[teacher_slides/2_distributed algorithms.pdf#page=349|Slide della docente: Dijkstra, p. 349]]

**Problema e modello.** Da una sorgente $s$ vogliamo costruire un albero dei cammini di **costo minimo** verso tutti i nodi di un grafo connesso, bidirezionale e affidabile. I pesi dei collegamenti sono strettamente positivi e noti ai loro estremi; a differenza di [[#Min-Hop routing|Min-Hop]], possono essere diversi. La radice coordina iterazioni distribuite tramite flooding e convergecast sull'albero parziale. In ogni iterazione aggiunge il nodo esterno con la minima stima $\Delta(x)+c(x,y)$ fra gli archi $(x,y)$ sul confine. L'invariante è che $\Delta(x)$ è già la distanza minima da $s$ per ogni nodo $x$ nell'albero; la scelta del minimo sul confine rende definitiva anche la distanza del nuovo nodo.

![[assets/Screenshot 2024-11-12 095921.png|1000]]

**Inizializzazione.** La sorgente è la radice dell'albero parziale, con distanza $\Delta(s)=0$; gli altri nodi sono inizialmente esterni all'albero. Ciascun nodo distingue localmente i collegamenti ancora *outgoing*, cioè diretti a un nodo non ancora inserito. La figura riassume gli stati e i messaggi iniziali.

![[assets/Screenshot 2024-11-12 100018.png|550]]

Ogni nodo conosce localmente lo stato dei propri collegamenti; un vicino appena inserito segnala la variazione, così gli altri nodi non lo considerano più un candidato esterno. La radice diffonde `start iteration` nell'albero. Ogni nodo interno $x$ sceglie tra i suoi archi ancora *outgoing* il candidato $y_x$ che minimizza:

$$\begin{aligned}
                \Delta (x) + c(x, y)
\end{aligned}$$

La selezione del nuovo nodo da aggiungere all'albero è fatta attraverso un convergecast, che propaga verso $s$ l'aggregazione:

$$\begin{aligned}
                \hat{x} = \operatorname*{argmin}_{x\text{ nell'albero},\; y_x\text{ esterno}} \{\Delta(x) + c(x, y_x)\}
\end{aligned}$$

Ricevuto il risultato del convergecast, la radice invia la notifica lungo il percorso dell'albero verso $\hat{x}$; ogni nodo intermedio ricorda da quale figlio è arrivata l'offerta minima. $\hat{x}$ comunica a $y_{\hat{x}}$ la distanza definitiva $\Delta(y_{\hat{x}})=\Delta(\hat{x})+c(\hat{x},y_{\hat{x}})$ ed entrambi marcano l'arco come appartenente all'albero. La notifica percorre soltanto quel cammino, senza flooding generale.
A questo punto, $y_{\hat{x}}$ notifica ai propri vicini (tranne $\hat{x}$) di essere stato aggiunto all'albero, in modo che questi possano marcare il collegamento verso $y_{\hat{x}}$ come "non-outgoing". $y_{\hat{x}}$ attende gli ack e quando li ha ricevuti tutti, invia verso $s$ un messaggio di "end iteration".

![[assets/Screenshot 2024-11-12 113900.png|1000]]

Solo la radice decide la terminazione e diffonde poi `stop`. Se conosce $n$, bastano $n-1$ aggiunte. Altrimenti esegue un'ulteriore iterazione: ogni nodo senza archi candidati restituisce un marcatore «nessun candidato» nel convergecast; se tutte le offerte sono vuote, la radice sa che il grafo connesso è stato interamente coperto. Il silenzio, da solo, non certifica la fine in una rete asincrona.

- Messaggi inviati: dobbiamo sommare le complessità delle diverse fasi in cui si articola il protocollo.

  - Flooding di inizio iterazione: $i - 1$ messaggi, uno per ogni arco dell'albero

  - Convergecast: $i - 1$ messaggi, sempre uno per ogni arco

  - Notifica al nodo aggiunto all'albero: nel caso peggiore, cioè quello in cui l'albero intero sia una catena, $(i - 1) + 1$ messaggi

  - Notifica di fine iterazione: uguale alla notifica precedente, quindi al più $(i - 1) + 1=i$ messaggi

  quindi $4i-2$ messaggi sulla struttura ad albero per ogni iterazione che aggiunge un nodo. Sommando le $n-1$ aggiunte, abbiamo:

  $$\begin{aligned}
                          \sum_{i = 1}^{n - 1} (4 \cdot i - 2) &= 4 \cdot \sum_{i = 1}^{n - 1} i  - 2 \cdot \sum_{i = 1}^{n - 1} 1 = 4 \cdot \frac{(n - 1) \cdot n}{2} - 2 \cdot (n - 1)\\
                          &= 2 \cdot (n - 1)^2 \in O (n^2)
  \end{aligned}$$

  Aggiungiamo le notifiche ai vicini del nodo inserito e i relativi ack, oltre alla fase iniziale della sorgente:

  $$\begin{aligned}
                          2\left(\sum_{x\neq s}(deg(x)-1)+deg(s)\right)=4m-2(n-1)
  \end{aligned}$$

  Sommando otteniamo il conteggio delle slide; la diffusione finale di `stop` e l'eventuale iterazione che verifica l'assenza di candidati aggiungono $O(n)$ invii e non cambiano il bound:

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

  La lunghezza della catena causale è al più $4i$ unità ideali per iterazione, contando un'unità per trasmissione e non il numero totale di invii paralleli.
  Complessivamente, per tutte le iterazioni:

  $$\begin{aligned}
                          4 \cdot \sum_{i = 1}^{n - 1} i = 4 \cdot \frac{n \cdot (n - 1)}{2} = 2 \cdot (n) \cdot (n - 1)
  \end{aligned}$$

  Aggiungendo l'inizializzazione lunga 2 e la notifica finale lunga al più $n-1$, il totale è $2+2n(n-1)+(n-1)=2n^2-n-1\in O(n^2)$ unità ideali. Una verifica finale senza candidati aggiunge al più un'altra iterazione $O(n)$.

Per avere tabelle di routing per tutte le sorgenti, ogni nodo avvia una propria costruzione dell'albero, identificando i messaggi della propria istanza. Il bound complessivo è $n\cdot O(n^2)=O(n^3)$ **invii**; le istanze possono sovrapporsi nel tempo, ma ciò non riduce il numero totale di invii. Gossiping usa invece $O(mn)$ **elementi trasmessi** e Iterating $O(n^2m)$ elementi: il confronto numerico ha senso soltanto ricordando che sono unità diverse. Se $m=\Theta(n^2)$, $O(mn)=O(n^3)$; se $m=\Theta(n)$, è $O(n^2)$. Dijkstra evita la memorizzazione della mappa completa in ogni nodo; la selezione globale è realizzata dal convergecast, senza una coda con priorità condivisa.

## 5 Errori e fallimenti

### Introduzione

Finora abbiamo assunto che nodi e collegamenti rispettino il protocollo e che i messaggi siano consegnati correttamente. In questa sezione consideriamo sistemi in cui nodi o collegamenti possono guastarsi. Le slide classificano i guasti per componente, comportamento, durata ed estensione; qui useremo soprattutto le prime due classificazioni.

![[assets/Screenshot 2024-11-12 121215.png|600]]

Un protocollo dichiara quali guasti ammette e quanti ne tollera. Non si può garantire il funzionamento in presenza di un numero arbitrario di guasti.

### Tipi di fallimenti

Le slide distinguono il componente che può guastarsi:

- **Entity failure:** possono guastarsi solo i nodi.
- **Link failure:** possono guastarsi solo i collegamenti.
- **Hybrid failure:** possono guastarsi sia nodi sia collegamenti.

Nel modello usato nelle slide i guasti sono permanenti: un componente guasto resta guasto. Il tipo di guasto descrive invece il comportamento del componente difettoso.

- **Guasti dei nodi.** Con un *crash* (o *fail-stop*) il nodo si arresta. Con un guasto di omissione il nodo può non inviare messaggi preparati o non ricevere alcuni messaggi. Un nodo bizantino non è vincolato dal protocollo e può compiere qualunque azione.

  ![[assets/Screenshot 2024-11-12 121453.png|600]]

- **Guasti dei collegamenti.** Con un'omissione un messaggio inviato non viene consegnato; con un'aggiunta viene consegnato un messaggio che nessuno ha inviato; con una corruzione viene consegnato un messaggio diverso da quello inviato. Aggiunta e corruzione sono comportamenti bizantini del collegamento nella classificazione delle slide.

  ![[assets/Screenshot 2024-11-12 121505.png|600]]

Ogni protocollo deve specificare quali comportamenti ammette. Un guasto ibrido ammette guasti sia dei nodi sia dei collegamenti.

[[teacher_slides/2_distributed algorithms.pdf#page=358|Slide della docente, p. 358]]
[[teacher_slides/2_distributed algorithms.pdf#page=359|Slide della docente, p. 359]]
[[teacher_slides/2_distributed algorithms.pdf#page=360|Slide della docente, p. 360]]

### Fault-tolerance e topologie di rete

La connettività della rete limita quali guasti un protocollo può tollerare. La **connettività per nodi** è il minimo numero di nodi la cui rimozione disconnette il grafo; la **connettività per archi** è il minimo numero di archi la cui rimozione lo disconnette. Per esempio, un albero ha entrambe pari a 1, un anello bidirezionale pari a 2 e un grafo completo con $n$ nodi pari a $n-1$.

![[assets/Screenshot 2024-11-12 121743.png|600]]

Se possono andare in crash fino a $k$ nodi, il flooding richiede una rete $(k+1)$-connessa per nodi; se possono fallire fino a $k$ collegamenti, richiede una rete $(k+1)$-connessa per archi. La condizione impedisce che i guasti ammessi separino la rete.

[[teacher_slides/2_distributed algorithms.pdf#page=361|Slide della docente, p. 361]]
[[teacher_slides/2_distributed algorithms.pdf#page=362|Slide della docente, p. 362]]

### Problema di Agreement/Consensus

Ogni entità $x$ propone un valore iniziale $v(x)$ scelto da un insieme noto. Il protocollo deve far decidere a un gruppo di almeno $p$ entità un valore comune, appartenente allo stesso insieme. Si parla di **$p$-agreement**; quando $p=n$, dove $n$ è il numero delle entità, si parla di **consenso**.

Le proprietà richieste comprendono:

- **Agreement:** le entità tenute a decidere scelgono tutte lo stesso valore.
- **Validità (o non-trivialità nel lessico delle slide):** se tutti propongono inizialmente lo stesso valore, quello è il valore deciso.
- **Terminazione:** ogni entità tenuta a decidere prende una decisione.

Le sezioni seguenti specificano quali nodi devono decidere e quali guasti sono ammessi.

### 5.1 Consensus problem con fallimenti sui collegamenti

#### Introduzione

Qui nessun nodo si guasta; possono invece perdersi messaggi a causa di guasti dei collegamenti. Tutti i nodi devono terminare e decidere lo stesso valore, rispettando agreement, validità (non-trivialità) e terminazione definiti sopra.

#### Il problema dei due generali

Due generali, a capo di eserciti su colline opposte, devono attaccare contemporaneamente. Possono comunicare solo tramite messaggeri che attraversano una valle controllata dal nemico: un messaggio può essere intercettato e perso. Se un generale invia una conferma, non può sapere con certezza che l'altro l'abbia ricevuta; anche una conferma della conferma può andare persa. Qualunque sia l'ultimo messaggio inviato, il mittente non può sapere se è stato consegnato.

![[assets/0_elHKtsxKn5VMl8cZ.jpg|500]]

> [!theorem] Impossibilità dei due generali
> Il problema dei due generali non si può risolvere, nemmeno se il sistema è completamente sincrono.

> [!theorem] Lemma necessario
> In ogni esecuzione di un protocollo in cui entrambi i generali decidono di attaccare, almeno un messaggio deve essere consegnato. Se non ne viene consegnato nessuno, un generale non può distinguere fra il caso in cui l'altro abbia deciso di non attaccare e quello in cui abbia deciso di attaccare ma i suoi messaggi siano andati persi.

**Dimostrazione.** Supponiamo per assurdo che esista un protocollo corretto. Fra le esecuzioni in cui entrambi decidono di attaccare, scegliamone una, $E$, con il numero minimo $k$ di messaggi consegnati. Per il lemma, $k\geq1$. Costruiamo un'esecuzione $E'$ identica a $E$ fino all'invio dell'ultimo messaggio consegnato, ma in cui quel messaggio viene perso; anche eventuali messaggi successivi non vengono consegnati.

![[assets/Screenshot 2024-11-13 091232.png|800]]

Il mittente dell'ultimo messaggio non può distinguere $E$ da $E'$: sa di averlo inviato, ma non se sia stato consegnato. Decide quindi di attaccare anche in $E'$. Per agreement, anche l'altro generale deve decidere di attaccare. In $E'$ sono stati consegnati $k-1$ messaggi:

- se $k-1>0$, ciò contraddice la scelta di $E$ con il minimo numero di messaggi consegnati;
- se $k-1=0$, ciò contraddice il lemma.

Non esiste quindi un protocollo corretto. L'impossibilità dipende dal fatto che il collegamento **può** fallire, non dal fatto che fallisca necessariamente.

[[teacher_slides/2_distributed algorithms.pdf#page=371|Slide della docente, p. 371]]
[[teacher_slides/2_distributed algorithms.pdf#page=372|Slide della docente, p. 372]]
[[teacher_slides/2_distributed algorithms.pdf#page=373|Slide della docente, p. 373]]
[[teacher_slides/2_distributed algorithms.pdf#page=374|Slide della docente, p. 374]]
[[teacher_slides/2_distributed algorithms.pdf#page=375|Slide della docente, p. 375]]
[[teacher_slides/2_distributed algorithms.pdf#page=376|Slide della docente, p. 376]]

#### Connettività necessaria con guasti sui collegamenti

**Teorema.** Se possono fallire $F>0$ collegamenti, il consenso non è realizzabile quando la rete non è $(F+1)$-connessa per archi, anche se il sistema è sincrono.

Questa è una condizione necessaria: eliminando fino a $F$ archi la rete potrebbe dividersi in gruppi che non possono coordinare le decisioni. Viceversa, se $F$ è strettamente minore della connettività per archi, la rimozione di al più $F$ collegamenti lascia la rete connessa. Il flooding può allora portare ogni valore a tutti i nodi; se tutti calcolano la stessa funzione dei valori ricevuti (per esempio il minimo), ottengono la stessa decisione. Questa sufficienza riguarda il modello di guasti e broadcast descritto dalle slide; non estende automaticamente la garanzia a protocolli non specificati per guasti di aggiunta o corruzione.

La slide 378 riporta «not larger than edge-connectivity», in contrasto con la disuguaglianza stretta e l'argomento della slide 379. Per il risultato di consenso appena enunciato si segue la slide 379: $F$ deve essere **minore** della connettività per archi.

[[teacher_slides/2_distributed algorithms.pdf#page=377|Slide della docente, p. 377]]
[[teacher_slides/2_distributed algorithms.pdf#page=378|Slide della docente, p. 378]]
[[teacher_slides/2_distributed algorithms.pdf#page=379|Slide della docente, p. 379]]

#### Flooding in grafi completi con fallimenti nei collegamenti

**Problema e modello.** Un nodo $x$ deve diffondere un'informazione $I$ a tutti gli altri nodi di un grafo completo con $n$ nodi. Possono fallire al più $F<n-1$ collegamenti; $x$ conosce $F$ e i nodi non si guastano. Senza guasti, $x$ invia direttamente a tutti gli altri con $n-1$ messaggi. Il protocollo *TwoSteps* usa destinatari intermedi per tollerare le omissioni dei collegamenti.

1. $x$ invia $I$ a $F+1$ vicini distinti.
2. Ogni nodo che riceve $I$ direttamente da $x$ la inoltra a tutti i propri vicini tranne $x$.

![[assets/Screenshot 2024-11-13 093705.png|800]]

Fissiamo un destinatario $y\ne x$. Se $y$ è tra i $F+1$ vicini scelti e il collegamento $x\!\to y$ funziona, riceve $I$ direttamente. Se quel collegamento è guasto, restano gli altri $F$ intermediari e il guasto diretto ha già consumato una delle $F$ possibilità di fallimento. Se invece $y$ non è tra i vicini scelti, vi sono $F+1$ cammini di due archi $x\to z\to y$, uno per ciascun intermediario $z$. In entrambi i casi possiamo contare $F+1$ vie alternative: la via diretta quando $y$ è scelto, più le vie via gli altri intermediari, oppure soltanto le $F+1$ vie via intermediari quando $y$ non è scelto. Queste vie non condividono archi. Indichiamo con $f_1(x)$ i collegamenti guasti nel primo passo e con $f_2(x)$ quelli guasti dalle vie via intermediari verso $y$. La somma è al più $F$; quindi almeno una via resta funzionante:

$$F+1-(f_1(x)+f_2(x))\geq1.$$

Se la via rimasta è diretta, $x$ consegna $I$ a $y$; altrimenti l'intermediario la riceve da $x$ e la consegna a $y$. Poiché l'argomento vale per ogni $y\ne x$, tutti i nodi ricevono l'informazione. Il caso limite $F=n-2$ è ammesso: $x$ ha $n-1$ vicini e può sceglierne $F+1=n-1$.

**Messaggi.** Il primo passo comporta $F+1$ invii. Ciascuno degli intermediari che ha ricevuto $I$ invia poi ad al più $n-2$ nodi, escluso $x$. Contando anche gli invii su collegamenti guasti, il numero totale è **al più**

$$ (F+1)+(F+1)(n-2)=(F+1)(n-1)\in O((F+1)n). $$

Questo conteggio vale anche per $F=0$ e varia da $O(n)$ a $O(n^2)$ al variare di $F$ nell'intervallo ammesso.

[[teacher_slides/2_distributed algorithms.pdf#page=381|Slide della docente, p. 381]]
[[teacher_slides/2_distributed algorithms.pdf#page=382|Slide della docente, p. 382]]

### 5.2 Consensus problem con fallimenti sui nodi

#### Problema e modello con guasti dei nodi

Ogni nodo propone un valore iniziale. I nodi non faulty devono decidere lo stesso valore e terminare; se tutti i nodi propongono lo stesso valore, i nodi non faulty devono decidere quel valore. Questa è la definizione di consenso richiamata in [[#Problema di Agreement/Consensus]]. Indichiamo con $F$ il massimo numero di nodi guasti; le slide usano $f$. Nei protocolli seguenti i collegamenti non falliscono; cambiano invece il tipo di guasto ammesso e le ipotesi di sincronia.

![[assets/Screenshot 2024-11-13 100304.png|600]]

#### Impossibilità deterministica asincrona

[[teacher_slides/2_distributed algorithms.pdf#page=385|Slide della docente, p. 385]]

> [!theorem] Teorema (FLP)
> In un sistema asincrono con grafo completo, non esiste un protocollo deterministico che garantisca il consenso anche con un solo possibile guasto di tipo crash.

La slide presenta il caso più favorevole: al più un crash ($F=1$) e rete completa. In un sistema asincrono i ritardi sono finiti ma imprevedibili: se un nodo non riceve una risposta, non può distinguere un ritardo da un crash. Il risultato esclude la garanzia deterministica di terminazione richiesta dal consenso in questo modello. Non afferma che sia impossibile costruire in generale software tollerante ai guasti: si può cambiare ipotesi, per esempio adottando sincronia, un rilevatore di guasti oppure randomizzazione.

#### Consensus in sistemi sincroni

[[teacher_slides/2_distributed algorithms.pdf#page=387|Slide della docente, pp. 387–411]]

**Problema e modello.** Vogliamo che i nodi non faulty decidano lo stesso valore booleano e terminino, anche se si verificano al più $F<n$ crash. Se tutti i nodi hanno lo stesso valore iniziale, quello deve essere deciso. Il protocollo `TellAll_Crash` assume:

- grafo completo e fortemente connesso;
- round sincroni e avvio simultaneo;
- guasti di tipo crash e conoscenza di $F$;
- valori iniziali in $\{0,1\}$.

**Idea.** Per $F+1$ round ogni nodo comunica il proprio report agli altri. Un report contiene l'AND dei valori già conosciuti e dei report ricevuti. Se in un round manca il messaggio di un vicino, si usa il valore neutro $1$: un crash non introduce così uno $0$ che quel nodo non ha comunicato.

Il report iniziale del nodo $x$ è $r(x,0)=v(x)$. Al tempo $t$, per $1\le t\le F+1$, il nodo aggiorna il report con

$$r(x,t)=r(x,t-1)\land\bigwedge_{y\in N(x)}m(y,t),$$

dove $m(y,t)$ è il messaggio ricevuto da $y$ nel round $t$, oppure $1$ se il messaggio non arriva entro la fine del round. Il grafo è completo, quindi $N(x)$ contiene tutti gli altri nodi. Dopo il round $F+1$, ogni nodo non faulty decide $r(x,F+1)$.

![[assets/Screenshot 2024-11-13 101007.png|600]]

![[assets/Screenshot 2024-11-13 101244.png|250]]

La figura mostra un'esecuzione possibile. La successiva illustra perché $F+1$ round bastano anche quando un crash avviene durante l'invio.

![[assets/Screenshot 2024-11-13 101354.png|700]]

![[assets/Screenshot 2024-11-13 102453.png|1000]]

**Correttezza.** Se un nodo non faulty riceve uno $0$ entro il round $F$, il suo report resta $0$ e nel round seguente lo comunica a tutti i nodi non faulty; dunque tutti decidono $0$ entro il round $F+1$. Il caso delicato è che uno $0$ compaia per la prima volta presso soltanto alcuni nodi non faulty nell'ultimo round. La prova illustrata nella figura risale la catena dei messaggi che ha propagato quello zero: per ogni round precedente in cui gli altri nodi non faulty avevano ancora report $1$, il mittente dello zero deve essere faulty. Dopo aver individuato $F$ nodi faulty, il mittente iniziale al tempo zero non può essere un ulteriore nodo faulty; è quindi non faulty e avrebbe trasmesso lo zero a tutti al primo round. Ne segue che lo zero non può comparire per la prima volta soltanto presso alcuni nodi non faulty al round $F+1$.

![[assets/Screenshot 2024-11-15 174808.png|600]]

Ne segue agreement: o un valore $0$ raggiunge tutti i nodi non faulty e tutti decidono $0$, oppure nessuno di loro ne riceve uno e tutti conservano $1$. Per la non-trivialità, se tutti iniziano con $0$ l'AND resta $0$; se tutti iniziano con $1$, tutti i report restano $1$.

La terminazione avviene dopo esattamente $F+1$ unità di tempo. Nel caso peggiore senza crash, ogni nodo invia un messaggio a ciascuno degli altri in ciascun round: il numero di invii è

$$n(n-1)(F+1)\in O(n^2(F+1)).$$

Il fattore $F+1$ va mantenuto anche per $F=0$. La docente scrive $O(n^2F)$, forma che non copre il caso senza guasti. Per inviare solo le informazioni utili si può usare la variante delle slide: ogni nodo inoltra al più una volta ciascuno zero, e non invia messaggi contenenti solo uno. Questa variante usa al più $n(n-1)=O(n^2)$ invii e mantiene $F+1$ round.

Le slide indicano che si possono generalizzare i valori iniziali, l'avvio non simultaneo e i grafi non completi quando $F$ è minore della connettività per nodi; non sviluppano qui le modifiche al protocollo e alle relative ipotesi.

#### Consensus in sistemi asincroni

[[teacher_slides/2_distributed algorithms.pdf#page=412|Slide della docente, pp. 412–431]]

FLP impedisce di garantire terminazione deterministica anche con un crash. Ben-Or usa scelte casuali: con probabilità 1 i nodi non faulty decidono, ma non esiste un limite deterministico al numero di round. Il modello assume grafo completo e fortemente connesso, crash, conoscenza di $n$ e $F$, e $F<n/2$. I valori sono booleani.

Ogni messaggio porta il numero del round in cui è stato generato. Un nodo usa i messaggi del round corrente, ignora quelli di round precedenti e conserva per dopo quelli di round futuri. Il broadcast comprende anche il mittente.

Ogni round ha due fasi:

1. **Propose.** Il nodo trasmette `MyValue(r,v)` e attende $n-F$ messaggi di questo tipo. Se più di $n/2$ contengono lo stesso valore, trasmette `Propose(r,v)`; altrimenti trasmette `Propose(r,?)`, dove `?` indica un valore indefinito. La soglia è una maggioranza stretta, cioè almeno $\lfloor n/2\rfloor+1$. È raggiungibile tra gli $n-F$ messaggi attesi perché
   $$F<n/2\quad\Longrightarrow\quad n-F>n/2.$$
2. **Adapt.** Il nodo attende $n-F$ messaggi `Propose`. Se ne riceve almeno uno con valore definito, adotta quel valore; se almeno $F+1$ messaggi riportano lo stesso valore definito, decide quel valore. Se tutti i valori ricevuti sono indefiniti, sceglie uniformemente a caso il valore da proporre nel round successivo. La soglia di decisione è raggiungibile fra i messaggi attesi:
   $$F<n/2\quad\Longrightarrow\quad F+1\le n-F.$$

![[assets/Screenshot 2024-11-15 180257.png|500]]

![[assets/Screenshot 2024-11-15 180402.png|750]]

![[assets/Screenshot 2024-11-15 181853.png|1000]]

**Non-trivialità.** Se tutti iniziano con $v$, tutti inviano `MyValue(r,v)` al primo round. Poiché $n-F>n/2$, ogni nodo vede una maggioranza stretta di $v$ e invia `Propose(r,v)`. I nodi non faulty ricevono almeno $n-F\ge F+1$ messaggi `Propose(r,v)` e decidono $v$.

![[assets/Screenshot 2024-11-15 183550.png|600]]

**Agreement.** Se un nodo non faulty $x$ decide $v$, ha ricevuto almeno $F+1$ messaggi `Propose(r,v)`. Sia $S$ l'insieme dei loro mittenti e $T$ l'insieme dei mittenti dei $n-F$ messaggi attesi da un altro nodo non faulty $y$. Allora $|S|=F+1$, $|T|=n-F$ e

$$|S\cap T|\ge |S|+|T|-n=1.$$

Quindi $y$ riceve almeno un `Propose(r,v)`. Poiché i guasti sono crash, un mittente non può inviare valori diversi ai destinatari; se quel mittente è poi faulty, il valore già inviato resta comunque $v$. Il nodo $y$ adotta quindi $v$. Nel round successivo tutti i nodi non faulty propongono $v$. Poiché sono almeno $n-F>n/2$ e nessun altro valore può avere una maggioranza stretta, tutti i nodi non faulty inviano `Propose(r+1,v)` e poi decidono $v$.

![[assets/Screenshot 2024-11-15 185935.png|1000]]

Un'osservazione utile per la prova è più circoscritta: in una fase `Propose`, se un nodo invia `Propose(r,v)` con $v$ definito, ha visto una maggioranza stretta di `MyValue(r,v)`. Due valori distinti non possono entrambi avere maggioranza stretta nell'intero insieme di $n$ nodi; quindi tutti i messaggi `Propose` definiti inviati in quel round hanno lo stesso valore. Non è necessario, né sempre vero, che ogni nodo veda quella maggioranza.

**Terminazione e costo atteso.** Se un nodo non faulty vede una maggioranza stretta nella fase `Propose`, la docente mostra che tutti i nodi non faulty decidono entro il round successivo (pp. 426–428). Se ciò non accade, quando tutti i messaggi `Propose` sono indefiniti, i nodi non faulty fanno scelte indipendenti e uniformi: la probabilità che scelgano tutti lo stesso valore è almeno $2^{-n}$. Una scelta concorde porta alla decisione nei round successivi. Anche condizionatamente alla storia dei round precedenti, la probabilità di convergere in ciascun tentativo è quindi almeno $2^{-n}$; il numero di round è dominato da una variabile geometrica di parametro $2^{-n}$ e il suo valore atteso è al più $2^n$. Il protocollo termina quasi certamente, in $O(2^n)$ round **attesi**, non in un numero massimo deterministico di round.

Le slide citano una variante che tollera fino a circa $n/3$ crash e termina in un numero costante di round attesi, senza svilupparne qui il protocollo.

#### Consensus deterministico con fallimenti bizantini

[[teacher_slides/2_distributed algorithms.pdf#page=432|Slide della docente, pp. 432–464]]

> **Status d'esame da confermare.** Le slide ufficiali disponibili sviluppano questa variante; l'originale dell'amico la indica come facoltativa. La manteniamo come approfondimento finché il perimetro d'esame non è confermato.

**Problema e modello.** I nodi non faulty devono raggiungere consenso sui valori booleani anche se fino a $F$ nodi possono inviare messaggi arbitrari o diversi a destinatari diversi. Il protocollo qui descritto è sincrono, ha grafo completo e avvio simultaneo, usa identificativi unici non falsificabili noti ai nodi, e tollera $F<n/3$. Nel modello sincrono anche un nodo guasto può inviare al più un messaggio per vicino a ogni unità di tempo: questo limite è usato nel conteggio degli invii. I broadcast includono il mittente. L'algoritmo deterministico è `TellZero_Byz`: i nodi non faulty propongono solo la possibilità di decidere $0$; se non ricevono prove sufficienti, decidono $1$.

> [!theorem] Limite per il consenso deterministico bizantino
> In un sistema sincrono con grafo completo non è possibile garantire il consenso deterministico tollerando $F\ge n/3$ guasti bizantini.

Questo limite, presentato nelle slide p. 432, spiega la soglia stretta $F<n/3$ assunta dal protocollo.

**RegisteredMail.** Questo sottoprotocollo registra in modo coerente una proposta `(0,id(y),t)` originata da $y$ al tempo $t$.

1. $y$ invia `(init,0,id(y),t)`.
2. Un nodo che riceve direttamente da $y$ un `init` valido esattamente al tempo $t+1$ invia `(echo,0,id(y),t)`. Mittente, identità e tempo devono corrispondere; un nodo ignora messaggi incoerenti e registra al più una volta quella proposta.
3. Dopo aver ricevuto, al tempo $t'\ge t+2$, $F+1$ `echo` da identità distinte, un nodo inoltra quell'`echo` a tutti, se non l'ha già inoltrato. Fra i mittenti c'è almeno un nodo non faulty.
4. Dopo aver ricevuto, al tempo $t'\ge t+2$, $n-F$ `echo` distinti, il nodo accetta la proposta. Almeno $n-2F$ di questi echo provengono da nodi non faulty.

Se un nodo non faulty accetta una proposta, gli almeno $n-2F\ge F+1$ echo non faulty la propagano; tutti i nodi non faulty ricevono così almeno $F+1$ echo e la inoltrano. Al round successivo ogni nodo non faulty raccoglie gli almeno $n-F$ echo non faulty e accetta la stessa proposta. La soglia $F+1$ impedisce inoltre che una proposta inventata da soli nodi faulty venga inoltrata dai nodi non faulty.

**TellZero_Byz.** Il protocollo è diviso in stage $i=0,\ldots,F+2$, ciascuno di due unità di tempo. Ogni nodo non faulty applica queste regole:

1. Al tempo $0$, se il suo valore iniziale è $0$, avvia una sola `RegisteredMail` con la propria identità e tempo $0$.
2. Al tempo $2i$, per $1\le i\le F+1$, se non ha già originato una proposta, ne avvia una quando ha accettato proposte da più di $F+i-1$ identità distinte.
3. Al tempo $2(F+2)$, decide $0$ se ha accettato proposte da almeno $2F+1$ identità distinte; altrimenti decide $1$.

**Correttezza.** Il protocollo termina dopo $2(F+2)$ unità di tempo. Se tutti i valori iniziali sono $0$, ogni nodo non faulty avvia una proposta al tempo zero; la proprietà di RegisteredMail le fa accettare da tutti, e i nodi non faulty accettano almeno $n-F\ge 2F+1$ identità e decidono $0$. Se tutti i valori iniziali sono $1$, nessun nodo non faulty avvia una proposta al tempo zero. Ai tempi successivi, per avviarne una servirebbero più di $F$ proposte accettate; al massimo $F$ proposte possono provenire dai nodi faulty, quindi nessun nodo non faulty ne avvia una. Tutti decidono $1$.

Per agreement, supponiamo che un nodo non faulty $x$ decida $0$. Ha accettato almeno $2F+1$ identità, dunque almeno $F+1$ delle proposte sono state avviate da nodi non faulty. Consideriamo l'insieme di queste proposte non faulty. Le proposte avviate al tempo zero sono accettate da tutti; anche una proposta accettata da un nodo non faulty in uno stage successivo si propaga a tutti gli altri. Se un nodo non faulty avvia una proposta al tempo $2i$, lo fa perché ha già accettato più di $F+i-1$ proposte. Entro il tempo $2i+2$, RegisteredMail propaga a tutti sia quelle proposte sia la nuova proposta: tutti hanno quindi accettato più di $F+i$ identità. Se $i\le F$, al tempo $2(i+1)$ tutti superano la soglia dello stage successivo e avviano la proposta se non l'hanno già fatto. Ripetendo l'argomento, entro lo stage finale tutti hanno accettato almeno $2F+1$ proposte e decidono $0$. Il caso in cui una proposta non faulty venga avviata già nello stage finale soddisfa direttamente la soglia finale, perché in quello stage è richiesta una soglia strettamente maggiore di $2F$. Se nessun nodo non faulty decide $0$, tutti decidono $1$. Dunque l'accordo vale in entrambi i casi.

Le slide riportano per `TellZero_Byz` un costo di $O(n^3)$ messaggi nel caso peggiore. La formula dettagliata della slide p. 463 conta invii `init`, `echo` dei nodi non faulty e messaggi possibili dei nodi faulty; con $F<n/3$ il totale è $O(n^3)$. La durata è $2(F+2)=O(F+1)$ unità di tempo. Le slide indicano inoltre due estensioni, senza svilupparle qui: domini finiti noti per i valori iniziali e grafi non completi con connettività per nodi maggiore di $2F$.

#### Consensus problem con fallimenti bizantini

[[teacher_slides/2_distributed algorithms.pdf#page=465|Slide della docente, pp. 465–474]]

Questa variante randomizzata tollera $F<n/9$ guasti bizantini su un grafo completo e fortemente connesso. Gli identificativi sono unici; i valori iniziali sono in $\{0,1\}$ e restano distinti dagli identificativi. Ogni nodo non faulty attende $n-F$ messaggi `Propose` per round; i messaggi includono il numero di round e il broadcast include il mittente.

Al primo round ciascun nodo propone il proprio valore. In ogni round successivo un nodo non faulty applica queste regole ai $n-F$ messaggi ricevuti:

![[assets/Screenshot 2024-11-20 092309.png|800]]

- se almeno $n-2F$ messaggi contengono lo stesso valore $v$, adotta $v$ e decide;
- altrimenti, se almeno $n-4F$ messaggi contengono lo stesso valore $v$, adotta $v$ senza decidere;
- se nessun valore raggiunge $n-4F$, sceglie $0$ o $1$ uniformemente a caso.

Poi trasmette `Propose(v,r+1)` e continua finché decide. I nodi faulty possono inviare valori diversi a destinatari diversi.

**Non-trivialità.** Se tutti iniziano con $v$, i nodi non faulty propongono $v$ al primo round. Ogni nodo non faulty riceve almeno $n-F\ge n-2F$ proposte per $v$ e decide $v$.

**Agreement.** Se un nodo non faulty $x$ decide $v$ al round $r$, ha ricevuto almeno $n-2F$ proposte per $v$. Un altro nodo non faulty $y$ attende anch'esso $n-F$ proposte. Fra i mittenti verso $x$ e quelli verso $y$ possono differire al più $F$ identità; inoltre al più $F$ mittenti comuni possono essere faulty e aver inviato valori diversi. Quindi $y$ riceve almeno

$$n-2F-F-F=n-4F$$

proposte per $v$ e adotta $v$. Nel round successivo tutti i nodi non faulty inviano $v$; sono $n-F\ge n-2F$, perciò tutti decidono $v$.

**Terminazione e costo atteso.** Nel round $r$, tutti i messaggi inviati dai nodi non faulty che scelgono senza estrazione casuale portano lo stesso valore. Infatti, se due nodi non faulty scegliessero senza casualità valori opposti, ciascuno avrebbe ricevuto almeno $n-4F$ proposte del proprio valore, di cui almeno $n-5F$ da nodi non faulty. Insieme ai possibili $F$ nodi faulty servirebbero

$$2(n-5F)+F=2n-9F>n$$

nodi, impossibile perché $F<n/9$. Quindi, per raggiungere la soglia di decisione $n-2F$, basta che i nodi non faulty che scelgono casualmente scelgano tutti uno stesso valore: i nodi non faulty che non estraggono hanno già scelto quel valore. La probabilità condizionata di questo evento in ciascun round è almeno $2^{-n}$. Perciò il protocollo termina quasi certamente e il numero di round atteso è $O(2^n)$; non ha un massimo deterministico.

Le slide citano una variante che tollera $F<n/500$ e termina in $O(n^{2.5})$ round **attesi**, senza specificarne qui il protocollo.

## 6 Strutture dati distribuite

### Introduzione

Una struttura dati distribuita deve conservare e rendere accessibili i dati mentre cambia il numero dei nodi che li ospitano. Qui ci interessa soprattutto cercare una coppia chiave-valore: partiamo dalle hash table e da alcune architetture peer-to-peer, poi vediamo come Chord assegna le chiavi ai nodi e le cerca in una rete overlay.

### Hash tables

Una hash table memorizza coppie $(key, value)$. Una funzione di hash associa ogni chiave a un indice, detto *bucket*, di un vettore; nel bucket si conserva il valore associato. Se più chiavi finiscono nello stesso bucket, una lista di trabocco raccoglie le coppie in collisione.

![[assets/Screenshot 2024-11-20 101146.png|600]]

La funzione di hash dovrebbe distribuire le chiavi nel modo più uniforme possibile fra i bucket. In una hash table distribuita, invece, le coppie $(key, value)$ sono collocate su più nodi. Il numero dei nodi che compongono il sistema non è noto localmente e può cambiare dinamicamente.

### Gli inizi

Alla fine degli anni ’90 Napster permetteva di condividere musica su Internet. Un indice centralizzato teneva le informazioni sulla posizione dei file, memorizzati sui computer degli utenti. Chi voleva scaricare un file interrogava l’indice e poi scaricava la risorsa direttamente dal computer che la ospitava. L’indice centralizzato costituiva un punto singolo di guasto: se non era disponibile, il sistema non funzionava. Le slide indicano che Napster fu chiuso nel 2001 per decisione del tribunale legata alla condivisione di file protetti da copyright.

![[assets/Screenshot 2024-11-20 101658.png|600]]

[[teacher_slides/2_distributed algorithms.pdf#page=483|Slide della docente, p. 483]]

Nel 2000 Gnutella propose una rete completamente distribuita. Per unirsi, un computer doveva conoscere almeno un partecipante; ogni computer ospitava una parte dei file ed era collegato a un numero limitato di vicini. Le query venivano inoltrate ricorsivamente ai vicini tramite *flooding*, fino a un limite di hop indicato dal TTL (*Time To Live*). Se il file esiste ma si trova oltre quel limite, la query può non raggiungerlo e il file può non essere trovato. I collegamenti formavano una rete *overlay* sulla rete IP: due vicini logici potevano non essere vicini fisici. Il flooding rendeva la ricerca robusta, ma poteva riempire la rete di richieste.

![[assets/Screenshot 2024-11-20 101837.png|1000]]

[[teacher_slides/2_distributed algorithms.pdf#page=484|Slide della docente, p. 484]]
[[teacher_slides/2_distributed algorithms.pdf#page=489|Slide della docente, p. 489: limite di ricerca dovuto al TTL]]

KaZaA (2001) adottò un’organizzazione ibrida fra Napster e Gnutella: distingueva nodi ordinari (*ordinary nodes*, ON) e supernodi (*supernodes*, SN). Ogni ON era collegato a un solo SN per volta; gli SN comunicavano fra loro. Un ON registrava presso il proprio SN l’elenco dei file condivisi. Quando cercava un file, interrogava lo SN, che rispondeva per gli ON a esso collegati oppure inoltrava la richiesta agli altri SN. Questa soluzione riduceva il flooding, ma manteneva punti centrali di possibile guasto.

![[assets/Screenshot 2024-11-20 102317.png|600]]

In una rete *strutturata*, la struttura determina dove si trovano nodi e dati e permette di instradare le ricerche in modo efficiente. In una rete *non strutturata*, nodi e dati possono essere aggiunti senza una collocazione determinata, perciò una ricerca può non essere efficiente. Una DHT (*Distributed Hash Table*) organizza invece un overlay strutturato: la struttura determina dove assegnare gli oggetti e come instradare le ricerche in modo efficiente.

![[assets/Screenshot 2024-11-20 104158.png|1000]]

[[teacher_slides/2_distributed algorithms.pdf#page=494|Slide della docente, pp. 494–496]]

### Chord

[[teacher_slides/2_distributed algorithms.pdf#page=497|Slide della docente, pp. 497–501]]

Chord è una DHT che organizza nodi e chiavi su un anello logico, sovrapposto alla rete fisica, per realizzare una [[#Hash tables|hash table distribuita]]. Una funzione di hash assegna un identificativo (*ID*) sia ai nodi sia alle chiavi; l’ID della chiave e quello del nodo responsabile appartengono allo stesso spazio. Le slide usano identificativi di $m$ bit, da $0$ a $2^m-1$, ordinati in senso circolare: dopo $2^m-1$ si torna a $0$. Il parametro $m$ indica il numero di bit degli ID, mentre $n$ indica il numero di nodi effettivamente presenti.

#### Lookup con il successore

Nella versione di base, ogni nodo conosce il proprio **successore**: il primo nodo successivo nell’ordine circolare degli ID. La chiave $k$ è assegnata al nodo `successor(k)`, cioè al primo nodo il cui ID è almeno $k$; se non esiste un ID sufficiente prima della fine dello spazio, si riprende la ricerca da $0$.

![[assets/Screenshot 2024-11-26 111716.png|800]]

Le slide presentano SHA-1 come funzione di hash per chiavi e nodi, con ID di $m=160$ bit. Quando un nodo riceve un lookup, risponde se è responsabile della chiave; altrimenti inoltra la richiesta al successore.

![[assets/Screenshot 2024-11-26 112149.png|400]]

Per esempio, nell’anello illustrato, il lookup di $K37$ raggiunge $N44$: l’ID $44$ è il primo ID di nodo almeno pari a $37$. Con il solo puntatore al successore la richiesta può attraversare l’intero anello. Nel caso peggiore il lookup visita quindi fino a $n$ nodi effettivi e costa $O(n)$ hop; $2^m$ è la dimensione dello spazio degli ID, non il numero di nodi della rete. Se i puntatori ai successori sono corretti e non ci sono guasti, il lookup raggiunge il nodo responsabile.

#### Finger table e lookup accelerato

[[teacher_slides/2_distributed algorithms.pdf#page=502|Slide della docente, pp. 502–504]]

Per ridurre il numero di hop rispetto al [[#Lookup con il successore|lookup con il solo successore]], ogni nodo $i$ mantiene una *finger table* con $m$ voci. Per $j=1,\ldots,m$, la voce $j$ contiene il nodo `successor((i+2^{j-1}) mod 2^m)`. Gli offset sono dunque $1,2,4,\ldots,2^{m-1}$; la prima voce coincide con il successore. La tabella registra più dettagli sui nodi vicini nell’ordine degli ID e meno su quelli lontani.

![[assets/Screenshot 2024-11-26 112658.png|400]]

Per cercare la chiave $k$, il nodo controlla prima se è responsabile oppure se lo è il suo successore. Altrimenti inoltra il lookup al nodo della propria finger table che precede $k$ più da vicino nell’ordine circolare, senza oltrepassarla. Se nessuna voce fornisce un predecessore, inoltra al successore. Da quel nodo la ricerca continua con la stessa regola. Il controllo del successore evita di saltare il responsabile quando questo è il successore immediato.

![[assets/Screenshot 2024-11-26 112958.png|400]]

Le slide danno un costo medio di $O(\log n)$ hop: in media, ogni hop riduce la distanza dal nodo cercato. Questa è una garanzia media, sotto l’ipotesi che gli ID siano distribuiti in modo adeguato; non è il limite del caso peggiore per ogni configurazione.

#### Join e stabilizzazione

[[teacher_slides/2_distributed algorithms.pdf#page=505|Slide della docente, pp. 505–510]]

Quando entra un nuovo nodo, Chord deve mantenere corretti i puntatori ai successori e assegnare ogni chiave al suo nuovo responsabile. Per gestire l’inserimento, ogni nodo mantiene anche un puntatore al **predecessore**, il nodo immediatamente precedente nell’ordine circolare.

L’inserimento comprende tre operazioni:

1. **Inizializzazione:** il nuovo nodo trova il proprio successore e inizializza successore, predecessore e finger table.
2. **Aggiornamento:** i nodi esistenti aggiornano i puntatori a successore e predecessore e le finger table interessate.
3. **Trasferimento:** il successore trasferisce al nuovo nodo i valori associati alle chiavi che ora gli competono.

L’aggiornamento esplicito può essere eseguito in tempo medio $O(\log^2 n)$, secondo le slide. Un protocollo più semplice usa la **stabilizzazione periodica** e accetta che le finger table non siano sempre aggiornate. Con successori corretti, un lookup resta corretto se controlla il successore prima di consultare le finger table; una finger table obsoleta può rallentare la ricerca. Questa garanzia presuppone che inserimenti, stabilizzazione e lookup siano intercalati in modo compatibile: non implica correttezza automatica per ogni possibile interleaving concorrente.

![[assets/Screenshot 2024-11-26 114109.png|350]]

A intervalli regolari, un nodo $A$ esegue `stabilize` interrogando il successore corrente $B$ per conoscere il predecessore di $B$, che indichiamo con $B'$. Se $B'$ appartiene all’intervallo circolare aperto $(A,B)$, $A$ aggiorna il successore a $B'$. Poi $A$ notifica la propria presenza al successore scelto; il successore aggiorna il predecessore ad $A$ se $A$ è più vicino del predecessore che conosceva. Quindi `stabilize` fa ottenere ad $A$ il predecessore di $B$; non gli restituisce necessariamente un ID atteso in anticipo.

![[assets/Screenshot 2024-11-26 114626.png|1000]]

Per entrare nell’anello, il nuovo nodo deve conoscere almeno un nodo già presente. Interroga quel nodo per trovare il proprio successore, inizializza i puntatori e la finger table e riceve dal successore i valori delle chiavi di cui diventa responsabile. Il successore elimina la propria copia solo dopo il trasferimento, secondo la politica di replica adottata. Le finger table vengono aggiornate progressivamente: il nuovo nodo può chiedere al successore di risolvere i lookup necessari per le proprie voci, mentre i nodi ricalcolano periodicamente le proprie tabelle, una voce per volta. Le finger table obsolete rendono il routing più lento; finché i puntatori ai successori sono aggiornati e le operazioni rispettano le ipotesi di interleaving indicate sopra, il lookup può proseguire.

### Chord: leave, failure e replicazione

[[teacher_slides/2_distributed algorithms.pdf#page=511|Slide della docente, p. 511]]

Una chiave è assegnata al suo successore nell’anello. Quando un nodo esce, occorre quindi aggiornare il routing e mantenere disponibili i valori che ospitava. Le operazioni di [[#Chord|lookup, finger table e stabilizzazione]] permettono di raggiungere un responsabile quando i puntatori sono corretti; la replica protegge i dati dalla perdita di un nodo.

**Leave pulita.** Se il nodo $x$ può cooperare prima di uscire, trasferisce al successore i valori delle chiavi di cui è responsabile, notifica al predecessore il nuovo successore e al successore il nuovo predecessore. Gli altri puntatori e le finger table che riferiscono $x$ possono essere aggiornati progressivamente.

![[assets/Screenshot 2024-11-26 120047.png|600]]

**Fallimento.** Un nodo che si guasta non può trasferire i valori né notificare i vicini. Per non dipendere da un solo successore, ogni nodo mantiene una lista dei primi $r$ successori (*successor list*). Se un successore non risponde, il nodo prova il successivo nella lista e `stabilize` ricostruisce i puntatori. Se non risponde una finger entry, il nodo prova una finger precedente; per gli indici bassi può ricorrere alla successor list. Il routing può continuare, anche con più hop, se almeno un successore vivo resta raggiungibile e l’anello non è partizionato.

La continuità del routing non ripristina i valori che erano conservati soltanto sul nodo guasto. Per tollerare la perdita dei nodi, l’applicazione può replicare ogni coppia chiave-valore sui primi $r$ successori del nodo responsabile. Dopo un guasto, il primo successore vivo assume la responsabilità e le repliche possono essere ricostituite. Aumentare $r$ permette di tollerare più guasti consecutivi, ma richiede più spazio e traffico di aggiornamento.

In condizioni stabili, le finger table consentono lookup in $O(\log n)$ hop attesi; le liste di successori e i fallback sostengono il routing durante i guasti, mentre la replica è il meccanismo separato che conserva i valori.

## Appendice: Ricorrenze e Master Theorem (facoltativo)

> **Status per l'esame — facoltativo secondo indicazione dell'utente.** Il Master Theorem non è presentato nei tre PDF delle slide della docente disponibili. Le slide introduttive riportano la ricorrenza di Merge Sort come esempio di analisi asintotica, senza enunciare il teorema. Questo approfondimento segue il Cormen consigliato.

[[teacher_slides/0_intro_algorithm.pdf#page=38|Slide della docente, p. 38]]

Una **ricorrenza** descrive il costo di un algoritmo ricorsivo in funzione del costo di istanze più piccole. Per molti algoritmi divide et impera ha la forma:

$$T(n) = aT(n/b) + f(n),$$

dove $a\geq 1$ e $b>1$ sono costanti, $a$ è il numero di sottoproblemi, $n/b$ la dimensione di ciascuno e $f(n)$ il lavoro svolto fuori dalle chiamate ricorsive; serve inoltre un caso base, per esempio $T(1)=\Theta(1)$. Per dimensioni non divisibili per $b$, si usa $\lfloor n/b\rfloor$ oppure $\lceil n/b\rceil$.

Il **Master Theorem** consente di stimare direttamente l'ordine di crescita di questa forma di ricorrenza. Posto $p=\log_b a$, confrontiamo $f(n)$ con $n^p$:

1. se $f(n)=O(n^{p-\varepsilon})$, prevale il costo ricorsivo e $T(n)=\Theta(n^p)$;
2. se $f(n)=\Theta(n^p)$, i costi sono bilanciati e $T(n)=\Theta(n^p\log n)$;
3. se $f(n)=\Omega(n^{p+\varepsilon})$ e, per qualche costante $c<1$ e per ogni $n$ sufficientemente grande, vale $a f(n/b)\leq c f(n)$, prevale il lavoro esterno e $T(n)=\Theta(f(n))$.

Nei casi 1 e 3, $\varepsilon>0$ è una costante: il divario rispetto a $n^p$ deve essere **polinomiale**.

**Esempio — Merge Sort.** La ricorrenza è $T(n)=2T(n/2)+\Theta(n)$. Poiché $a=2$, $b=2$ e $n^{\log_2 2}=n$, si applica il secondo caso: $T(n)=\Theta(n\log n)$.

[Apri il laboratorio interattivo](http://localhost:4321/widgets/master-theorem)

Il teorema non si applica direttamente a ricorrenze con sottoproblemi di dimensioni diverse, come $T(n)=T(n/3)+T(2n/3)+n$, né a forme decrementali come $T(n)=T(n-1)+n$.

**Riferimento per questo approfondimento:** Cormen, *Introduction to Algorithms*, cap. 4, teorema 4.1 (p. 94 del libro; p. 115 del PDF locale). La ricorrenza e il caso Merge Sort sono trattati nello stesso capitolo.

[[teacher_slides/based_by/Cormen Introduction to Algorithms.pdf#page=115|Cormen, PDF locale, p. 115]]

## Vocabolario trasversale

### Problemi, soluzioni e costi

- **[[#Problema computazionale|Problema e istanza]]:** il problema specifica che cosa calcolare; l'istanza fissa un input concreto.
- **[[#Classificazione per tipo di soluzione|Tipo di problema]]:** decisione richiede SÌ/NO, ricerca una soluzione ammissibile, ottimizzazione la migliore soluzione ammissibile.
- **[[#Algoritmi|Algoritmo corretto]]:** per ogni istanza termina e produce l'output richiesto.
- **[[#Dimensione del problema|Dimensione dell'input]]:** misura la rappresentazione dell'istanza; può contare bit oppure elementi, secondo il modello dichiarato.
- **[[#Analisi asintotica|Notazione asintotica]]:** $O$ è un limite superiore, $\Omega$ inferiore, $\Theta$ un ordine di crescita esatto a fattori costanti.
- **[[#Analisi asintotica|Caso peggiore]]:** costo massimo fra le istanze della stessa dimensione; non è il costo di ogni esecuzione.
- **[[#Elezione casuale del leader|Costo atteso]]:** media dei costi rispetto alle scelte casuali del protocollo; va distinto da un bound deterministico.
- **[[#Analisi asintotica|Upper bound e lower bound]]:** il primo limita il costo dall'alto, il secondo dal basso; specificare sempre se riguarda un algoritmo, un problema o il valore ottimo.
- **[[#Classificazione per difficoltà|Tempo polinomiale]]:** tempo limitato da $O(n^k)$ per una costante $k$ rispetto alla dimensione dell'input dichiarata.
- **[[#Algoritmi di approssimazione|Soluzione ammissibile e ottima]]:** la prima rispetta i vincoli del problema; l'ottima ha il miglior valore fra tutte le soluzioni ammissibili.

### Grafi e protocolli

- **[[#Il modello|Grafo]]:** $G=(V,E)$ ha vertici $V$ e archi $E$; di norma $n=|V|$ e $m=|E|$. Nei grafi diretti gli archi orientati possono essere indicati con $A$. In Chord $m$ indica invece i bit degli identificativi.
- **[[#Broadcast|Distanza e diametro]]:** la distanza è il numero minimo di archi fra due nodi nel grafo non pesato; il diametro è la massima distanza fra coppie di nodi.
- **[[#Spanning tree|Spanning tree]]:** sottografo connesso e aciclico che contiene tutti i nodi; ha $n-1$ archi.
- **[[#Ambienti distribuiti|Entità, nodo e protocollo]]:** entità e nodo sono sinonimi; il protocollo descrive azioni locali che realizzano un obiettivo collettivo.
- **[[#Comunicazione|Messaggio e vicinato]]:** un nodo scambia sequenze finite di bit con i vicini raggiungibili direttamente; non dispone per questo di una vista globale della rete.
- **[[#Broadcast|Iniziatore]]:** nodo che avvia spontaneamente un protocollo o possiede per primo l'informazione da diffondere; il suo numero dipende dal problema.
- **[[#Assiomi|Orientamento locale]]:** un nodo distingue le porte dei propri vicini, ma le etichette locali non sono identificativi globali.
- **[[#Restrizioni|Modello e restrizioni]]:** connettività, bidirezionalità, FIFO, sincronia, affidabilità e conoscenza iniziale si assumono solo quando dichiarate dal protocollo.
- **[[#Misure di efficienza per gli algoritmi distribuiti|Costo distribuito]]:** distinguere invii di messaggi, bit trasmessi, tempo ideale, tempo causale e tempo fisico.
- **[[#Tipi di fallimenti|Guasto]]:** crash, omissione e comportamento bizantino descrivono capacità diverse di un componente difettoso; ogni risultato specifica quali sono ammessi.
