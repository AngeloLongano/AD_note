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

Un algoritmo per il problema $\Pi$ è **corretto** se, per ogni istanza $i \in I$, termina e produce il risultato richiesto; nella notazione funzionale, $\Pi(i) \in S$.

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

La figura ordina i costi per crescita ([[teacher_slides/0_intro_algorithm.pdf#page=11|slide della docente, p. 11]]). Il colore accanto a ciascun tipo riprende quello della figura. 
Nella tabella, $f(n)$ è l'espressione mostrata nella figura come $O(f(n))$; la classificazione si riferisce a un costo che cresce effettivamente come $T(n)=\Theta(f(n))$. 
Infatti, il solo limite superiore $O(2^n)$ non basta a dire che un costo è esponenziale: anche $n^2$ appartiene a $O(2^n)$.

| Tipo di costo $f(n)$ | Nome nella figura | Classificazione del costo $\Theta(f(n))$ |
| --- | --- | --- |
| <span style="color:#6fae63">■</span> $1$ | costante <small>(sublineare)</small> | polinomiale |
| <span style="color:#6fae63">■</span> $\log\log n$ | log log <small>(sublineare)</small> | polinomiale <small>(anche se non è un polinomio)</small> |
| <span style="color:#6fae63">■</span> $\log n$ | logaritmico <small>(sublineare)</small> | polinomiale <small>(anche se non è un polinomio)</small> |
| <span style="color:#c89b32">■</span> $\sqrt[c]{n}=n^{1/c}$, $c>1$ | sublineare | polinomiale <small>(anche se non è un polinomio)</small> |
| <span style="color:#c89b32">■</span> $n$ | lineare | polinomiale |
| <span style="color:#c89b32">■</span> $n\log n$ | $n\log n$ | polinomiale <small>(anche se non è un polinomio)</small> |
| <span style="color:#d9838f">■</span> $n^2$ | quadratico | polinomiale |
| <span style="color:#d9838f">■</span> $n^3$ | cubico | polinomiale |
| <span style="color:#d9838f">■</span> $n^k$, $k\geq 1$ costante | polinomiale | polinomiale |
| <span style="color:#a56790">■</span> $a^n$, $a>1$ costante | esponenziale | superpolinomiale |
| <span style="color:#a56790">■</span> $n!$ | fattoriale | superpolinomiale |

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

Per la seconda domanda, le [[teacher_slides/0_intro_algorithm.pdf#page=20|slide della docente, p. 20]] formulano la **tesi di Church–Turing estesa** così: modelli di calcolo diversi, ma ragionevoli, possono simularsi a vicenda con uno *slowdown* polinomiale. Questo significa che cambiare modello può aumentare il tempo di esecuzione, ma conserva la proprietà di essere risolvibile in tempo polinomiale. Per esempio, una simulazione che passa da un costo $O(n^2)$ a $O(n^5)$ è più lenta, ma resta polinomiale.

Questa è la ragione per cui possiamo definire $P$ usando un modello preciso, come la macchina di Turing, e usare poi la nozione di tempo polinomiale anche per i comuni modelli di calcolo classici.

**Fin dove arriva il confronto?** CPU e GPU organizzano il lavoro in modo diverso; il parallelismo da solo non implica che un problema diventi risolvibile in tempo polinomiale. Il calcolo quantistico usa invece un modello diverso da quelli classici e non coincide con la macchina di Turing non deterministica: la versione più forte della tesi estesa non va applicata automaticamente a quel caso.

## 2 Teoria della Complessità

### 2.1 Classificazione dei problemi per complessità

#### Perché si parte dai problemi decisionali

Le classi $P$ e $NP$ sono definite su **problemi decisionali**, cioè problemi per i quali ogni istanza richiede una risposta sì oppure no. Questa forma permette di identificare un problema con l'insieme delle sue **istanze positive**, quelle per cui la risposta corretta è sì, e rende precise le nozioni di accettazione e rifiuto.

La restrizione non rende inutili queste classi per gli altri tipi di problema: a un problema di ricerca o di ottimizzazione si può spesso associare una versione decisionale. Per esempio:

- ottimizzazione: «qual è la lunghezza del cammino minimo da $s$ a $v$?»;
- decisione: «esiste un cammino da $s$ a $v$ di lunghezza al più $k$?».
#### La classe P

> [!definition] Classe di problemi P
> Insieme di problemi decisionali che possono essere risolti con un algoritmo di costo computazionale in tempo polinomiale nella dimensione dell'input.

[[teacher_slides/1_complexity theory.pdf#page=3|Slide della docente, p. 3]]

**Modello.** Qui *deterministico* significa che, in ogni stato della computazione, la prossima operazione è determinata univocamente: su uno stesso input l'algoritmo segue un solo percorso di esecuzione. Il tempo è misurato nella dimensione dell'input.

#### Macchine non deterministiche

Per capire da dove nasce $NP$ bisogna introdurre la **macchina non deterministica**. È un modello teorico di calcolo, non un computer realmente esistente. Quando in un certo passo sono possibili più scelte, la macchina non ne seleziona una con una particolare strategia: la computazione viene descritta come un albero che contiene un ramo per ogni scelta possibile.

Un'istanza è **accettata** se almeno un ramo della computazione termina in uno stato di accettazione. È invece rifiutata se nessun ramo accetta. Il tempo non si ottiene sommando il lavoro di tutti i rami: si misura la lunghezza di un singolo ramo, e per una computazione in tempo polinomiale tutti i rami devono terminare entro un numero polinomiale di passi rispetto alla dimensione dell'input.

![[assets/macchine-deterministiche-non-deterministiche.svg|1000]]

Nello schema, a sinistra l'input segue un unico percorso; a destra le scelte generano più rami. L'istanza a destra è accettata perché **almeno uno** di essi accetta: i rami non rappresentano computer reali che lavorano in parallelo.

Consideriamo intuitivamente il **ciclo hamiltoniano**. Data una sequenza di $n$ vertici, controllare se descrive un ciclo che visita una volta tutti i vertici è semplice. Una macchina non deterministica può:

1. scegliere, passo dopo passo, una possibile sequenza dei vertici;
2. verificare che la sequenza rappresenti davvero un ciclo hamiltoniano;
3. accettare se la verifica riesce.

L'albero di computazione contiene i diversi ordinamenti che la macchina può scegliere. Se il grafo ha un ciclo hamiltoniano, almeno un ramo sceglie la sequenza corretta e accetta; se non lo ha, nessun ramo può superare la verifica. Ogni singolo ramo effettua soltanto una scelta e una verifica di lunghezza polinomiale: non si somma il costo di esplorare tutti gli ordinamenti.

Questo modello conduce alla classe $NP$. Prima della definizione usata dalla docente, introduciamo certificato e verificatore: sono gli oggetti con cui le slide formulano la classe.

#### Dalla macchina non deterministica ai certificati

Possiamo vedere la macchina non deterministica come una macchina che **indovina** una soluzione candidata e poi la verifica deterministicamente. “Indovinare” non indica un'operazione magica o casuale: rappresenta i diversi valori scelti sui diversi rami della computazione.

La soluzione candidata è chiamata **certificato**. Su un computer ordinario non possiamo creare contemporaneamente tutti i rami: immaginiamo invece che il certificato ci venga fornito dall'esterno. Un **verificatore** è un algoritmo deterministico $V$ che riceve l'istanza $x$ e un certificato candidato $c$; non deve trovare $c$, ma soltanto controllare se prova che $x$ è un'istanza positiva.

> [!definition] Certificato per una istanza positiva $i\in I_Y$ del problema $\Pi$
> Sequenza di caratteri (informazione aggiuntiva) di dimensione al massimo polinomiale nella dimensione dell'input che contiene l'evidenza del fatto che $i$ sia una istanza positiva per $\Pi$.

> [!definition] Algoritmo verificatore
> Algoritmo decisionale che prende in input un'istanza di $i\in I$ di un problema decisionale $\Pi$ e una sequenza di caratteri $C_i$ e restituisce SI se l'istanza $i$ è una istanza positiva per $\Pi$, NO altrimenti.

[[teacher_slides/1_complexity theory.pdf#page=7|Slide della docente, p. 7]]

**Precisazione nostra.** Il NO del verificatore per una coppia $(i,C_i)$ non prova da solo che $i$ sia negativa: il certificato proposto può essere sbagliato. La caratterizzazione formale qui sotto richiede che ogni istanza positiva abbia *almeno un* certificato accettato e che nessun certificato faccia accettare un'istanza negativa.

> [!definition] Verificare un problema
> Il problema $\Pi$ può essere verificato se valgono le due seguenti condizioni:
> 1. Per ogni istanza positiva $i$ del problema $\Pi$ esiste un certificato $C_i$ di dimensione polinomiale nella dimensione di $i$;
> 2. Esiste un algoritmo verificatore $A$ che risponde SI per ogni coppia $(i,C_i)$ tale che $i$ è un'istanza positiva di $\Pi$ e $C_i$ un suo certificato (polinomiale).

> [!definition] Classe di problemi NP (Non-deterministic Polynomial-time)
> Insieme di problemi decisionali che possono essere verificati con un algoritmo verificatore di costo computazionale in tempo polinomiale nella dimensione dell'input.

[[teacher_slides/1_complexity theory.pdf#page=8|Slide della docente, p. 8]]

**Spiegazione.** La definizione tramite verificatore è equivalente a quella tramite macchina non deterministica introdotta sopra: un ramo può scegliere un certificato candidato e verificarlo in tempo polinomiale. La sigla $NP$ significa ***nondeterministic polynomial time***, non “non polinomiale”. La formulazione della slide sulle coppie positive è completata dalla condizione di correttezza per le istanze negative nella formalizzazione seguente.

Un problema decisionale appartiene a $NP$ se, per ogni istanza con risposta sì, **esiste un certificato di dimensione polinomiale verificabile in tempo polinomiale**.

Formalmente, un problema decisionale $\Pi$ appartiene a $NP$ se esistono un verificatore polinomiale $V$ e un polinomio $p$ tali che

$$
x\text{ è positiva per }\Pi
\iff
\exists c:\ |c|\leq p(|x|)\ \land\ V(x,c)=\text{sì}.
$$

In linguaggio naturale, la formula afferma che la risposta per $x$ è sì **se e solo se** esiste almeno un certificato $c$, di lunghezza al più polinomiale in $|x|$, che il verificatore accetta. Quindi:

- se $x$ è positiva, almeno un certificato breve deve essere accettato;
- se $x$ è negativa, ogni certificato candidato deve essere rifiutato.

Il certificato non deve essere unico e quello ricevuto può essere errato. L'appartenenza a $NP$ garantisce l'esistenza di una prova breve per le istanze positive, non un algoritmo deterministico polinomiale capace di trovarla.

#### Esempio: ciclo hamiltoniano

Nel problema decisionale del **ciclo hamiltoniano** l'input è un grafo semplice non orientato $G=(V,E)$ e si chiede se esista un ciclo che visiti ogni vertice esattamente una volta e ritorni al vertice iniziale.

![[assets/ciclo-hamiltoniano.png|900]]

Per esempio, se $V=\{a,b,c,d,e\}$ e il grafo contiene gli archi

$$
\{a,b\},\{b,c\},\{c,d\},\{d,e\},\{e,a\},
$$

allora la sequenza $C=(a,b,c,d,e)$ è un certificato valido: descrive il ciclo $a\to b\to c\to d\to e\to a$. La sequenza candidata $C'=(a,b,d,c,e)$, invece, viene rifiutata se, per esempio, manca l'arco $\{b,d\}$; non basta elencare una volta tutti i vertici.

In generale, un certificato per un'istanza positiva è una sequenza $(v_1,\ldots,v_n)$ dei $n=|V|$ vertici nell'ordine in cui compaiono nel ciclo. Il verificatore controlla che:

1. la sequenza contenga tutti e soli i vertici di $G$, senza ripetizioni;
2. ogni coppia consecutiva $\{v_i,v_{i+1}\}$, per $1\leq i<n$, sia un arco di $G$;
3. anche $\{v_n,v_1\}$ sia un arco di $G$.

La sequenza è precisamente il **certificato**: contiene $n$ identificatori di vertice e ha quindi dimensione polinomiale. Con una tabella dei vertici visitati si controllano in tempo polinomiale sia la presenza di tutti e soli i vertici sia i $n$ archi del presunto ciclo. Questo prova che **Ciclo Hamiltoniano appartiene a $NP$**.

Attenzione alla differenza tra **verificare** e **trovare**. Se qualcuno consegna la sequenza $(a,b,c,d,e)$, il controllore la convalida rapidamente. Dato soltanto il grafo, però, un algoritmo deve individuare una sequenza valida oppure stabilire che non esiste. L'algoritmo esaustivo più immediato prova i possibili ordinamenti dei vertici: sono circa $n!$ e il suo tempo è fattoriale. Ciò mostra soltanto che *questo* metodo di ricerca è lento; non dimostra che tutti gli algoritmi possibili lo siano. Sappiamo però che Ciclo Hamiltoniano è NP-completo: un algoritmo polinomiale per esso implicherebbe $P=NP$, questione tuttora aperta.

#### Relazione tra P e NP

**Problema e modello.** Consideriamo un qualunque problema decisionale $\Pi\in P$: l'input è un'istanza $i$, l'output è SI o NO. Per definizione esiste un algoritmo deterministico $A$ che lo decide in tempo polinomiale nella dimensione di $i$. Vogliamo costruire un verificatore per $\Pi$ con lo stesso bound.

**Algoritmo verificatore.** Riceve $(i,C_i)$, pone $C_i$ uguale alla stringa vuota, invoca $A(i)$ e restituisce la sua risposta. Il certificato ha lunghezza zero e il costo del verificatore è quello polinomiale di $A$, oltre a un overhead costante.

> [!theorem] Teorema
> $P\subseteq NP$

[[teacher_slides/1_complexity theory.pdf#page=9|Slide della docente, p. 9]]

##### Dimostrazione

Dato un problema $\Pi\in P$, esiste un algoritmo $A$ di costo polinomiale per il problema che può essere utilizzato come verificatore con certificato la sequenza vuota:

1. Per ogni istanza positiva di $\Pi$, $C_i$ è la stringa vuota (nessun carattere).
2. L'algoritmo verificatore invoca l'algoritmo risolutore $A$ per $\Pi$ su un'istanza del problema e restituisce il risultato. Se l'istanza è positiva la risposta è SI, altrimenti è NO.

**Spiegazione.** Il verificatore accetta precisamente le istanze positive; la stringa vuota soddisfa il vincolo di lunghezza polinomiale. In termini di macchina non deterministica, basta seguire la computazione deterministica senza effettuare scelte.

Non sappiamo invece se $NP\subseteq P$. Il problema $P$ contro $NP$ può essere riassunto dalla domanda:

> **Se una soluzione può essere verificata velocemente, può anche essere trovata velocemente?**

Stabilire se $P=NP$ oppure $P\neq NP$ è uno dei principali problemi aperti dell'informatica teorica.

#### Perché servono le riduzioni

Una **riduzione** mostra come risolvere un problema usando un algoritmo per un altro problema. Serve a:

- trasferire algoritmi: se $A$ si riduce a $B$ e sappiamo risolvere efficientemente $B$, otteniamo un algoritmo efficiente anche per $A$;
- trasferire difficoltà: se un problema già noto come difficile si riduce a $B$, allora $B$ è almeno altrettanto difficile.

La direzione è quindi essenziale: per dimostrare che $B$ è difficile bisogna ridurre un problema difficile noto **a $B$**, non il contrario.

#### Riduzione di Karp

> [!definition] Riduzione di Karp ($A\leq_p B$)
> Un problema decisionale $A$ è riducibile in tempo polinomiale al problema decisionale $B$ se:
> - ogni istanza di $A$ può essere trasformata in tempo polinomiale in un'istanza di $B$;
> - ogni istanza positiva di $A$ viene trasformata in un'istanza positiva di $B$;
> - ogni istanza negativa di $A$ viene trasformata in un'istanza negativa di $B$.

[[teacher_slides/1_complexity theory.pdf#page=11|Slide della docente, p. 11]]

**Formalizzazione.** La trasformazione è una funzione $f$ calcolabile in tempo polinomiale tale che, per ogni istanza $x$,

$$
x\text{ è positiva per }A
\iff
f(x)\text{ è positiva per }B.
$$

La trasformazione preserva sia le risposte positive sia quelle negative e produce una sola istanza di $B$.

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

#### Problemi NP-completi

> [!definition] Classe di problemi NP-completi
> Un problema decisionale $A$ è NP-completo se:
> 1. $A\in NP$;
> 2. $\forall B\in NP : B\leq_p A$.

[[teacher_slides/1_complexity theory.pdf#page=17|Slide della docente, p. 17]]

Gli NP-completi sono dunque i problemi più difficili di $NP$ rispetto alle riduzioni polinomiali.
Il problema del ciclo hamiltoniano introdotto sopra è un esempio di problema NP-completo.

#### Conseguenza fondamentale

Per un qualunque problema NP-completo:

- trovare un algoritmo polinomiale implica $P=NP$;
- dimostrare che nessun algoritmo polinomiale può risolverlo implica $P\neq NP$.

Per dimostrare che un nuovo problema $A$ è NP-completo si procede normalmente così:

1. si dimostra che $A\in NP$;
2. si sceglie un problema $B$ già noto come NP-completo;
3. si costruisce una riduzione $B\leq_p A$.

La correttezza del metodo segue dalla transitività: per ogni $C\in NP$ sappiamo già che $C\leq_p B$; insieme a $B\leq_p A$ otteniamo $C\leq_p A$.

#### SAT e l'inizio della catena

Per avviare questo metodo serve almeno un problema già noto come NP-completo. I teoremi di Cook e Levin individuano questo punto di partenza nel problema **SAT** (*Boolean satisfiability problem*).

Nel corso SAT è presentato su formule in **forma normale congiuntiva** (FNC):

- un letterale è una variabile booleana oppure la sua negazione;
- una clausola è una disgiunzione di letterali;
- una formula in FNC è una congiunzione di clausole.

[Prova una formula in FNC](./widgets/sat-fnc)

Il problema chiede se esista un assegnamento di verità alle variabili che renda vera l'intera formula. Per esempio,

$$
(a\lor b\lor c)\land(\neg b\lor c)\land(\neg a \lor\neg b\lor c)
$$

è soddisfacibile: assegnando $c=\text{vero}$ tutte le clausole risultano vere. SAT appartiene a $NP$ perché un assegnamento costituisce un certificato verificabile valutando la formula in tempo polinomiale; il teorema di Cook–Levin dimostra inoltre che ogni problema in $NP$ si riduce a SAT.

#### Problemi NP-hard

> [!definition] Classe di problemi NP-hard
> Un problema $A$ è NP-hard se: $\forall B\in NP : B\leq_p A$.

[[teacher_slides/1_complexity theory.pdf#page=21|Slide della docente, p. 21]]

**Precisazione nostra.** Nella slide $A$ può essere anche un problema di ottimizzazione, mentre la riduzione di Karp appena definita ha due estremi decisionali. Per leggere coerentemente la formula in questo caso, occorre specificare una versione decisionale di $A$ oppure intendere una trasformazione polinomiale dell'istanza seguita da un risolutore per $A$ e da una trasformazione polinomiale della risposta, come nel diagramma della stessa p. 21. La riduzione con oracolo è esplicitata qui sotto.

Questa è la seconda condizione della definizione di NP-completezza, senza richiedere $A\in NP$. Un problema NP-completo è quindi sia NP-hard sia appartenente a $NP$; un problema NP-hard può invece non appartenere a $NP$.

Per dimostrare che $A$ è NP-hard basta scegliere un problema NP-completo $B$ e mostrare $B\leq_p A$: la transitività estende la riduzione a ogni problema di $NP$.

#### Riduzione di Turing e problemi di ottimizzazione

La riduzione di Karp è formulata tra problemi decisionali perché $P$, $NP$ e NP-complete sono, nella teoria classica, classi di linguaggi o problemi con risposta sì/no. Per confrontare un problema decisionale con un problema di ricerca o di ottimizzazione si usa invece una riduzione con oracolo.

Si scrive $A\leq_T^p B$ quando esiste un algoritmo polinomiale per $A$ che può interrogare un **oracolo per $B$**, cioè un sottoprogramma che restituisce correttamente la soluzione di $B$. Le interrogazioni possono essere più di una e quelle successive possono dipendere dalle risposte precedenti.

Per dimostrare che un problema $A$, anche di ottimizzazione, è NP-hard si può scegliere un problema NP-completo $B$ e costruire $B\leq_T^p A$. Nel caso più semplice sono sufficienti una sola chiamata all'oracolo per $A$ e una trasformazione polinomiale del risultato:

![[assets/riduzione-turing.png|1000]]

Per esempio, distinguiamo:

- TSP decisionale: «esiste un tour di costo al più $k$?», un problema NP-completo;
- TSP di ottimizzazione: «trova un tour di costo minimo», un problema NP-hard.

Un oracolo per la versione di ottimizzazione permette di risolvere quella decisionale confrontando il costo ottimo restituito con $k$. Non si dice che il TSP di ottimizzazione “non è in $NP$”: nella definizione classica l'affermazione non è ben posta, perché $NP$ contiene problemi decisionali. La riduzione dal ciclo hamiltoniano al TSP di ottimizzazione sarà costruita esplicitamente nella sezione successiva.

I problemi NP-hard restano importanti nelle applicazioni. In base al contesto si usano algoritmi esatti su istanze piccole, euristiche, parallelizzazione oppure algoritmi di approssimazione; quest'ultimo approccio è l'oggetto della sezione successiva.

#### Mappa per il ripasso

![[assets/mappa-classi-riduzioni.svg|1200]]

La figura va letta in due passaggi:

1. si identifica il **tipo di output** richiesto: sì/no, una soluzione ammissibile oppure una soluzione ottima;
2. si sceglie la nozione corretta: le classi $P$, $NP$ e NP-completo classificano formalmente problemi decisionali, mentre NP-hard può essere usato anche per problemi di ricerca e ottimizzazione, specificando la riduzione adottata.

| Classe | Ambito | Idea chiave |
|---|---|---|
| $P$ | Decisione | Risolvibile in tempo polinomiale |
| $NP$ | Decisione | Certificato positivo verificabile in tempo polinomiale |
| NP-completo | Decisione | Appartiene a $NP$ ed è NP-hard |
| NP-hard | Anche ricerca e ottimizzazione | Almeno difficile quanto ogni problema di $NP$ |

| Riduzione | Ambito | Meccanismo |
|---|---|---|
| **Karp** $A\leq_p B$ | Decisione $\to$ decisione | Una trasformazione $f(x)$ che preserva sì/no |
| **Turing** $A\leq_T^p B$ | Anche ricerca e ottimizzazione | Una o più interrogazioni, anche adattive, a un oracolo per $B$ |

### 2.2 Approssimazioni di problemi NP-hard

Qui consideriamo problemi di **ottimizzazione** per cui trovare sempre l'ottimo è difficile. La nozione di NP-hardness e la distinzione dalle classi decisionali sono in [[#Problemi NP-hard]]; per valutare una soluzione approssimata bastano il valore ottenuto e un limite sull'ottimo, definiti qui sotto.

#### Algoritmi di approssimazione

[[teacher_slides/1_complexity theory.pdf#page=57|Slide della docente, p. 57]]
[[teacher_slides/1_complexity theory.pdf#page=60|Slide della docente, p. 60]]

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

> **Esempio — come si legge il fattore**
> - **Minimizzazione:** se su un'istanza $OPT(I)=10$ e l'algoritmo restituisce una soluzione di costo $ALG(I)=12$, il rapporto ottenuto è $12/10=1{,}2$. Una garanzia di fattore $2$ permetterebbe, su questa istanza, qualsiasi costo al più $20$: non significa quindi che l'algoritmo debba costare esattamente il doppio dell'ottimo.
> - **Massimizzazione:** se $OPT(I)=100$ e $ALG(I)=80$, il rapporto è $100/80=1{,}25$. Una $2$-approssimazione garantirebbe soltanto $ALG(I)\geq 100/2=50$, quindi il valore $80$ rispetta ampiamente la garanzia.
>
> Questi calcoli misurano la qualità su una singola istanza. Per dimostrare che l'algoritmo ha davvero fattore $\rho$, la disuguaglianza deve valere per **tutte** le istanze.

La garanzia è di **worst-case**: non afferma che l'algoritmo ottenga sempre un rapporto uguale a $\rho$, ma che nessuna istanza può produrre un rapporto peggiore. Le istanze con ottimo nullo richiedono una convenzione separata, perché il rapporto non è definito; nei problemi studiati qui i costi sono positivi, oppure il caso $OPT(I)=0$ è banale da riconoscere e risolvere esattamente.

#### Dimostrare un fattore mediante un lower bound

Per conoscere la qualità esatta della soluzione restituita su un'istanza di **minimizzazione** dovremmo calcolare il rapporto

$$
\frac{ALG(I)}{OPT(I)}.
$$

Il problema è che $OPT(I)$ è proprio il valore difficile da calcolare. Un **lower bound** positivo sostituisce l'ottimo con un valore più facile da ottenere e sicuramente non superiore a esso:

$$
0<LB(I) \leq OPT(I)
$$

Poiché $LB(I)$ è al denominatore ed è minore o uguale a $OPT(I)$, si ottiene

$$
\frac{ALG(I)}{OPT(I)}
\leq
\frac{ALG(I)}{LB(I)}.
$$

Il rapporto con il lower bound è quindi una valutazione **prudente**: può essere maggiore del rapporto reale, ma non può sottostimarlo. Se riusciamo a dimostrare che, per ogni istanza,

$$
\frac{ALG(I)}{LB(I)}\leq \rho(n),
$$

allora anche il rapporto reale soddisfa

$$
\frac{ALG(I)}{OPT(I)}\leq \rho(n).
$$

Equivalentemente, basta provare la catena

$$
ALG(I) \leq \rho(n)\cdot LB(I)
\leq \rho(n)\cdot OPT(I).
$$

> **Significato della garanzia**
> Il lower bound **non determina necessariamente il vero fattore** ottenuto dall'algoritmo: permette di certificarne un limite nel caso peggiore senza conoscere $OPT(I)$. Un lower bound vicino all'ottimo può dare una garanzia stretta; un lower bound molto più piccolo resta corretto, ma può produrre una garanzia pessimistica. Per dimostrare che l'intero algoritmo è una $\rho$-approssimazione, queste disuguaglianze devono valere per **ogni** istanza.

Nei prossimi algoritmi il lower bound nascerà, per esempio, da un matching o da un rilassamento lineare; per la massimizzazione il ragionamento duale usa invece un upper bound su $OPT(I)$.

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
> **Input:** un grafo non diretto completo $G=(V,E)$ e una funzione di costo positiva sugli archi $c:E\to\mathbb{R}^{+}$.
>
> **Output:** un ciclo hamiltoniano in $G$ di costo minimo.

Qui consideriamo la versione di ottimizzazione $TSP_{opt}$: il costo di un ciclo è la somma dei costi dei suoi archi. Nella riduzione seguente usiamo costi $0/1$ come nelle slide. Per ottenere costi strettamente positivi basta sostituirli con $1/2$: ogni tour ha esattamente $|V|$ archi, quindi il confronto «costo ottimo $0$ oppure almeno $1$» diventa «costo ottimo $|V|$ oppure almeno $|V|+1$».

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

**Modello della riduzione.** Consideriamo un'istanza di $HC$ con grafo semplice e almeno tre vertici. L'istanza destinazione è un grafo completo non diretto con costi interi non negativi. Un risolutore esatto per $TSP_{opt}$ restituisce un tour minimo, non soltanto il suo costo; possiamo calcolarne il costo sommando i pesi degli archi.

**In simboli.** Vogliamo dimostrare $HC\leq_T^p TSP_{opt}$: la costruzione trasforma l'input, la chiamata all'oracolo trova il tour ottimo e il controllo finale lo converte nella risposta SI/NO. Le operazioni esterne all'oracolo devono essere polinomiali.

#### Strategia della riduzione

$HC$ chiede se un ciclo **esiste** nel grafo dato; il TSP chiede quale ciclo abbia **costo minimo** in un grafo completo. Per collegarli, trasformiamo la presenza o l'assenza degli archi di $G$ in costi. Completiamo il grafo e assegniamo:

- costo **$0$** agli archi già presenti in $G$;
- costo **$1$** agli archi aggiunti per renderlo completo.

Il costo di un tour conta quindi quanti archi aggiunti usa. Se il tour ottimo costa $0$, non ne usa nessuno ed è un ciclo Hamiltoniano di $G$; se costa almeno $1$, ogni tour deve usare un arco che mancava in $G$. Il costo diventa così un *rivelatore* della risposta a $HC$.

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

Ora chiediamo al risolutore TSP un tour ottimo $H^*$ di $G'$ e poniamo $K=c(H^*)$.
Rispondiamo
- **SI** a $HC$ se $K=0$,
- **NO** altrimenti.
Questa è l'intera procedura: costruire il grafo pesato, risolvere il TSP e controllare il costo restituito.

![[assets/riduzione-hc-tsp-01-istanze.svg|900]]

#### Studio della complessità

Con $n=|V|$, $G'$ ha $n(n-1)/2$ archi. Misuriamo qui il lavoro **esterno** al risolutore TSP:

- **Tempo:** con una matrice di adiacenza per $G$, costruire e pesare $G'$ richiede $O(n^2)$; calcolare $K$ dal tour richiede $O(n)$. Se $G$ è dato con liste di adiacenza, la matrice si prepara in $O(n^2+|E|)$.
- **Spazio:** matrice e grafo completo richiedono $O(n^2)$; ogni peso $0/1$ occupa un bit.
- **Oracolo:** una sola chiamata al risolutore esatto. Il suo tempo non è incluso nel costo della riduzione con oracolo.

#### Dimostrazione

1. **Da $HC$ a costo zero.** Se $G$ ha un ciclo hamiltoniano, lo stesso ciclo esiste in $G'$ e usa solo archi di costo $0$. Poiché tutti i costi sono non negativi, l'ottimo è $K=0$.
2. **Da costo zero a $HC$.** Se $K=0$, il tour ottimo contiene solo archi di costo $0$, dunque solo archi di $E$. È un ciclo hamiltoniano anche in $G$.
3. **Conclusione.** Abbiamo $K=0\iff G$ ha un ciclo hamiltoniano. La costruzione, il controllo e la singola chiamata all'oracolo costituiscono una riduzione polinomiale $HC\leq_T^p TSP_{opt}$. Poiché $HC$ è NP-completo, $TSP_{opt}$ è NP-hard.

**Spiegazione.** La direzione inversa dice anche che, se $G$ non ha un ciclo hamiltoniano, ogni tour di $G'$ usa almeno un arco aggiunto e quindi $K\geq1$.

La relazione chiave è:
$$
K=0
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
> 10.  $G^\prime \gets (V, E^\prime, c)$
> 11.  $H^* \gets TSP(G^\prime)$
> 12.  **if** $c(H^*) = 0$ **then**
> 13.   **return** sì
> 14.  **else**
> 15.   **return** no
> 16.  **end if**
> 17. **end function**

#### Perché scegliere pesi $1/2$ invece di $0/1$?

La scelta dei pesi nella riduzione non è casuale, ma determina **quale variante** del TSP stiamo dimostrando essere NP-Hard. ^tsp-pesi

La **disuguaglianza triangolare** esprime l'idea che andare direttamente da un vertice a un altro non debba costare più che passare per un vertice intermedio. Deve valere per ogni terna di vertici; non richiede che i costi siano distanze euclidee:

$$
c(u,w) \leq c(u,v)+c(v,w).
$$

Prendiamo per esempio tre vertici $u,v,w$: gli archi $uv$ e $vw$ appartengono al grafo originale, mentre aggiungiamo $uw$ per renderlo completo.
Possiamo farlo in due modi:

![[assets/tsp-pesi-01-12-triangolo.svg|1000]]

**Caso A — pesi $0/1$ (riduzione TSP generale)**

- Archi originali: costo $0$; arco aggiunto: costo $1$.
- **Test:** $1\leq0+0$ è falso.
- **Conclusione:** in un caso come questo la costruzione viola la disuguaglianza triangolare. Le istanze prodotte **possono non essere metriche**: la riduzione appena vista dimostra la NP-hardness del **TSP generale**.

**Caso B — pesi $1/2$ (riduzione TSP metrica)**

- Archi originali: costo $1$; arco aggiunto: costo $2$.
- **Test:** $2\leq1+1$ è vero. Vale per ogni triangolo: un lato costa al massimo $2$ e gli altri due insieme almeno $2$.
- **Conclusione:** la disuguaglianza triangolare vale per ogni terna, quindi le istanze prodotte sono **metriche**. La stessa riduzione dimostra la NP-hardness del **TSP metrico**: un tour ha $|V|$ archi e costa almeno $|V|$; costa esattamente $|V|$ se e solo se usa solo archi originali, cioè se il grafo originale ha un ciclo Hamiltoniano.

**Perché questa distinzione è cruciale?** Le due riduzioni mostrano che trovare l'**ottimo esatto** è NP-hard in entrambe le varianti. Da questo, però, non possiamo ancora concludere quanto bene si riesca ad approssimare l'ottimo:

- Per il **TSP generale**, la prossima sezione userà archi di costo $1$ e archi di costo $K$ per dimostrare che, a meno che $P=NP$, non esiste un algoritmo polinomiale con fattore di approssimazione costante.
- Per il **TSP metrico**, la disuguaglianza triangolare consente gli *shortcut*: su questa proprietà si basano la $2$-approssimazione e l'algoritmo di Christofides.

*La variante $1/2$ mostra che anche il TSP metrico è difficile da risolvere esattamente; è la disuguaglianza triangolare a permettere le garanzie di approssimazione che vedremo più avanti.*

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

Una scelta concreta, usata nelle slide, è $K=r|V|+1$. Il costo $1$ rende positivo l'ottimo quando $G$ ha un ciclo Hamiltoniano; il costo $K$ separa i due casi anche se $A$ restituisce un tour soltanto approssimato.

1. **Caso SI.** Se $G$ contiene un ciclo Hamiltoniano, in $G'$ possiamo usare soltanto archi originali: il tour costa $|V|$. Poiché ogni tour ha $|V|$ archi e ciascuno costa almeno $1$, questo è l'ottimo. Per la garanzia di $A$, il tour restituito costa **al massimo $r|V|$**.
2. **Caso NO.** Se $G$ non contiene un ciclo Hamiltoniano, ogni tour di $G'$ usa almeno un arco aggiunto. Gli altri $|V|-1$ archi costano almeno $1$ ciascuno, quindi ogni tour costa almeno

  $$K+(|V|-1)>r|V|.$$

  Anche il tour restituito da $A$ costa dunque **più di $r|V|$**.

La figura istanzia i due casi con $|V|=4$, $r=2$ e $K=9$; gli archi tratteggiati sono altri archi aggiunti al grafo completo, non usati nei tour evidenziati.

![[assets/tsp-inapprossimabilita-due-casi.png|1000]]

3. **Conclusione.** La soglia è $r|V|$: confrontando con essa il costo del tour prodotto da $A$, potremmo decidere in tempo polinomiale se $G$ ha un ciclo Hamiltoniano. Ne seguirebbe $P=NP$; dunque, se $P\neq NP$, l'algoritmo $A$ non può esistere.

#### Complessità della riduzione

Il grafo completo ha $|V|(|V|-1)/2$ archi: assegnare i costi richiede $O(|V|^2)$ operazioni nel modello a costo uniforme. Per $r$ costante possiamo scegliere un $K$ intero appena maggiore di $r|V|$; bastano $O(\log |V|)$ bit per rappresentarlo. Anche considerando la scrittura dei pesi, la trasformazione resta quindi polinomiale.

Il risultato riguarda il **TSP generale**: i costi costruiti non soddisfano necessariamente la disuguaglianza triangolare e quindi non esclude approssimazioni costanti per il TSP metrico.

### Approssimazioni per il TSP metrico

Il **TSP metrico** richiede costi che rispettino la disuguaglianza triangolare: andare direttamente da $u$ a $w$ non costa più che passare per un terzo vertice $v$. La prova in [[#Inapprossimabilità del TSP generale]] usa archi originali di costo $1$ e archi aggiunti di costo $K>2$, che possono violare questa proprietà; il suo risultato negativo riguarda perciò il TSP generale. La [[#^tsp-pesi|costruzione con pesi $1/2$]] mostra invece che il TSP metrico può restare difficile da risolvere *esattamente*. Qui cerchiamo garanzie di approssimazione costanti sfruttando la proprietà triangolare.

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

Essa formalizza l'idea che andare direttamente da $u$ a $z$ non costi più che passare per un nodo intermedio $v$. In alcune dimostrazioni useremo l'osservazione, più generale, che i costi possono essere non negativi: le istanze della docente hanno comunque costi positivi.


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

##### Dimostrazione

La prova è per induzione sul numero $k$ di archi del cammino.

1. Per $k=2$, la tesi è esattamente la disuguaglianza triangolare.
2. Per $k>2$, l'ipotesi induttiva riduce il prefisso da $v_1$ a $v_{k-1}$ a un solo arco; la disuguaglianza triangolare sostituisce poi gli ultimi due tratti con l'arco da $v_{k-1}$ a $v_{k+1}$ e infine combina i due archi ottenuti.
3. Si ottiene quindi il bound dell'enunciato. In particolare, eliminare un vertice intermedio e sostituire i due tratti adiacenti con l'arco diretto non aumenta il costo. Da un ciclo che visita alcuni vertici più volte si possono perciò saltare le visite ripetute ottenendo un ciclo Hamiltoniano di costo non maggiore.

#### Algoritmo di 2-approssimazione

> **Status per l'esame — non svolto nell'AA 2025/26.** L'analisi resta utile come preparazione della prova di Christofides.

L'idea è costruire un minimum spanning tree $T^*$, raddoppiarne gli archi per rendere pari ogni grado, calcolare un ciclo euleriano e applicare gli shortcut ai vertici già visitati.

Nell'immagine si mostrano, in sequenza, $T^*$, il ciclo euleriano $E$ sul multigrafo con archi raddoppiati e il ciclo Hamiltoniano $H$ ottenuto mediante shortcut. Per chiarezza non sono disegnati gli altri archi del grafo completo.

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

Rimuovendo un arco dal tour ottimo $H^*$ si ottiene uno spanning tree $T$. Poiché i costi sono non negativi e $T^*$ è un MST,

$$
cost(T^*)\leq cost(T)\leq cost(H^*).
$$

Combinando i due risultati segue

$$
cost(H)\leq 2\,cost(H^*),
$$

quindi l'algoritmo è una **2-approssimazione**.

**Tightness dell'analisi.** Il fattore 2 è asintoticamente tight per questo algoritmo. Nella famiglia seguente gli archi disegnati hanno costo 1 e tutti gli altri costo 2. L'MST può essere la stella di costo $n-1$ e una scelta sfavorevole del ciclo euleriano produce, dopo gli shortcut, un tour con $n-2$ archi di costo 2 e due archi di costo 1.

![[assets/2-approx-Pagina-2.jpg|1000]]

Il tour restituito può quindi costare $2n-2$, mentre esiste un tour ottimo di costo $n$:

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

Poiché $|U|$ è pari, gli archi di $\Gamma$, contati con la loro molteplicità, si possono ripartire alternandoli in due perfect matching $M_1$ e $M_2$ di $G[U]$.

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

> **Status per l'esame — approfondimento facoltativo (indicazione dell'utente).** Anche l'applicazione al TSP e il lower bound basato sull'1-tree qui sotto fanno parte di questo approfondimento. L'1-tree è trattato nella dispensa della docente dedicata a Branch and Bound per TSP (`teacher_slides/1_complexity theory.pdf`, pp. 101–104), ma non risulta come argomento autonomo nelle altre parti delle slide disponibili.

Il **Branch and Bound** cerca una soluzione ottima esplorando sottoinsiemi $S_i$ dello spazio delle soluzioni. Nel caso di minimizzazione, conserva il costo $UB$ della migliore soluzione ammissibile trovata finora (*current best solution*) e calcola per ogni $S_i$ un **lower bound** $LB(S_i)$ valido per tutte le sue soluzioni. Se $LB(S_i)\geq UB$, il sottoinsieme non può migliorare la soluzione corrente e viene scartato (*pruning*); altrimenti viene suddiviso mediante *branching*. I figli devono coprire le soluzioni del padre, ma possono sovrapporsi.

![[assets/Screenshot 2024-10-02 110633.png|900]]

L'esplorazione forma un albero: quando un sottoinsieme contiene una sola soluzione ammissibile, se ne valuta il costo e si aggiorna eventualmente $UB$. La visita può essere in profondità, in ampiezza o guidata da una stima. Lo pseudocodice seguente usa una visita ricorsiva in profondità per un problema di minimo; $BCS$ e $UB$ sono condivisi fra le chiamate e inizialmente valgono rispettivamente $null$ e $\infty$.

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
> 19. **call** B&B($S_{\mathrm{iniziale}}$); **return** $BCS$

Se un sottoinsieme non contiene soluzioni ammissibili, lo si scarta. La funzione $branch(S)$ genera sottoinsiemi strettamente più piccoli che, insieme, coprono tutte le soluzioni ammissibili di $S$; questo garantisce la terminazione quando lo spazio di ricerca è finito. Un'immagine aiuta a visualizzare la dinamica.

![[assets/Screenshot 2024-10-02 110148.png|600]]

Il pruning può ridurre molto il lavoro, ma **nel caso peggiore** potrebbe essere necessario esplorare quasi tutte le soluzioni: non c'è una garanzia generale di tempo polinomiale. Se si interrompe la ricerca con una soluzione corrente di costo $UB$ e restano sottoinsiemi inesplorati, sia $LB$ il minimo dei loro lower bound. Allora $LB\leq OPT\leq UB$ e l'errore additivo della soluzione corrente è al più $UB-LB$. Si può quindi fermare la ricerca dopo un tempo fissato oppure quando questo divario scende sotto una soglia scelta.

#### TSP in chiave branch and bound (facoltativo)

Per il TSP consideriamo un grafo completo non orientato $G=(V,E)$ con costi degli archi non negativi. Ogni nodo della ricerca rappresenta i cicli hamiltoniani contenuti in un sottografo $G'=(V,E')$, dove $E'\subseteq E$; alla radice si ha $G'=G$. Se $G'$ è disconnesso o ha un vertice di grado minore di $2$, non contiene cicli hamiltoniani e il ramo si scarta.

Per calcolare un lower bound in $G'$, scegliamo un vertice $v$, troviamo un minimum spanning tree $T^*$ sul sottografo indotto da $V\setminus\{v\}$ e prendiamo i due **distinti** archi meno costosi $e_1,e_2$ di $G'$ incidenti a $v$. Se l'MST non esiste o mancano due archi incidenti a $v$, il ramo è privo di soluzioni. L'unione di $T^*$ con $e_1,e_2$ è un **1-tree** rispetto a $v$: un albero sui vertici diversi da $v$ più due archi che collegano $v$ all'albero.

![[assets/Screenshot 2024-10-01 150520.png|700]]

Il lower bound (**bounding**) è:

$$\begin{aligned}
                    LB = cost(T^*) + cost(e_1) + cost(e_2)
\end{aligned}$$

Ogni ciclo hamiltoniano $H$ di $G'$ passa per $v$. Rimuovendo $v$ e i suoi due archi incidenti dal ciclo, rimane un cammino $P$ che è anche uno spanning tree sui vertici $V\setminus\{v\}$. Per la minimalità di $T^*$:

$$\begin{aligned}
                    cost(P) \geq cost(T^*)
\end{aligned}$$

I due archi $e',e''$ di $H$ incidenti a $v$ costano insieme almeno quanto i due archi meno costosi $e_1,e_2$:

$$\begin{aligned}
                    cost(e^\prime) + cost(e^{\prime\prime}) \geq cost(e_1) + cost(e_2)
\end{aligned}$$

Unendo il tutto, troviamo che:

$$\begin{aligned}
                    cost(H) &= cost(P) + cost(e^\prime) + cost(e^{\prime\prime})\\
                    &\geq cost(T^*) + cost(e_1) + cost(e_2) = LB = cost(1-Tree)
\end{aligned}$$

Se l'1-tree ottenuto è esso stesso un ciclo hamiltoniano, il suo costo coincide con $LB$: è dunque una soluzione **ottima nel sottografo $G'$** e può aggiornare la migliore soluzione corrente. In caso contrario, l'1-tree serve soltanto come lower bound.

![[assets/Screenshot 2024-10-02 152221.png|700]]

Per il **branching**, se l'1-tree calcolato non è un ciclo hamiltoniano, scegliamo un suo vertice $w$ di grado almeno $3$. Siano $e_1,\ldots,e_k$ **tutti** gli archi di $G'$ incidenti a $w$; per ogni $i$ si genera un figlio $G_i=(V,E'\setminus\{e_i\})$. Ogni ciclo hamiltoniano nel padre usa esattamente due archi incidenti a $w$ e, poiché $k\geq3$, ne omette almeno uno: compare quindi in almeno un figlio. I figli possono contenere alcuni cicli in comune.

![[assets/Screenshot 2024-10-02 152514.png|700]]

Ogni figlio si costruisce in tempo polinomiale. Questo non rende polinomiale l'intera esplorazione dell'albero di ricerca.

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

La condizione di copertura, da sola, è facile da soddisfare: per esempio, l'intero insieme $V$ è sempre un vertex cover. La difficoltà nasce quando si richiede una soluzione di cardinalità minima. Si distinguono quindi:

- **versione di ottimizzazione** $VC_{opt}$: trovare un vertex cover $C^*$ tale che $|C^*|=\min\{|C|:C\text{ è un vertex cover di }G\}$;
- **versione decisionale** $VCD$: dati $G$ e un intero $k\leq |V|$, stabilire se esista un vertex cover di cardinalità al più $k$.

![[assets/vertex_covers.png|500]]

> [!theorem] Teorema
> Il problema del Vertex Cover è NP-Hard.

[[teacher_slides/1_complexity theory.pdf#page=55|Slide della docente, p. 55]]

#### Dimostrazione

Il problema $VCD$ è NP-completo: una copertura proposta si verifica in tempo polinomiale controllandone la cardinalità e accertando che ogni arco abbia almeno un estremo selezionato; la NP-hardness è un risultato noto. Ne segue che la versione di ottimizzazione è NP-hard. Infatti, se avessimo un algoritmo per $VC_{opt}$, potremmo invocarlo una sola volta su $G$ e rispondere `YES` a $VCD$ se e solo se la soluzione restituita ha cardinalità al più $k$:

$$
VCD\leq_T^p VC_{opt}.
$$

![[assets/vertex-cover-riduzione-vcd-vc.png|850]]

Nella figura l'istanza della riduzione è la coppia $(G,k)$: il grafo $G$ viene passato all'algoritmo di ottimizzazione, mentre $k$ è usato nel confronto finale. Non si tratta di una riduzione di Karp tra problemi decisionali, ma di una riduzione di Turing con una chiamata all'oracolo di ottimizzazione.

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

Per evitare il comportamento sulla stella, si può scegliere a ogni iterazione un vertice con il massimo grado corrente, cioè quello che copre il maggior numero di archi ancora scoperti. La soluzione resta ammissibile e l'algoritmo è polinomiale, ma neppure questa euristica garantisce un fattore di approssimazione costante.

La figura seguente mostra un piccolo esempio. Inizialmente i quattro vertici di $A$ hanno grado $3$, mentre in $B$ vi sono due vertici di grado $4$ e quattro di grado $1$. L'algoritmo può scegliere prima i due vertici di grado $4$; sugli archi rimasti tutti i vertici hanno grado $1$ e un tie-breaking sfavorevole può fargli scegliere anche gli altri quattro vertici di $B$. Restituisce così una copertura di cardinalità $6$, mentre $A$ è una copertura ottima di cardinalità $4$: il rapporto è $3/2$.

![[assets/vertex-cover-grado-massimo-esempio.png|500]]

> **Approfondimento — famiglia con rapporto logaritmico**
> Il piccolo esempio spiega il meccanismo, ma non dimostra che il rapporto possa crescere senza limite. Per farlo si usa una famiglia di grafi bipartiti $B=(L,R,E)$: $L$ contiene $r$ vertici e $R$ è suddiviso in gruppi $R_1,\ldots,R_r$. Il gruppo $R_i$ contiene $\lfloor r/i\rfloor$ vertici, ciascuno adiacente a $i$ vertici di $L$, e due vertici dello stesso gruppo non condividono vicini.
>
> ![[assets/vertex-cover-grado-massimo-famiglia-logaritmica.png|700]]
>
> Con un tie-breaking sfavorevole, l'euristica può scegliere progressivamente tutti i vertici di $R_r,R_{r-1},\ldots,R_1$. L'insieme $L$ è invece un vertex cover di cardinalità $r$, perciò, indicando con $C$ la soluzione greedy e con $C^*$ l'ottimo,
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

L'analisi è tight per questa regola di rounding. In un ciclo con un numero pari $n$ di vertici, un vertex cover ottimo contiene un vertice sì e uno no e ha costo $n/2$. Il rilassamento ammette anche la soluzione ottima $x_v^*=1/2$ per ogni $v$; se viene restituita questa soluzione, il rounding seleziona tutti gli $n$ vertici e il rapporto è $2$. L'LP ammette anche soluzioni ottime intere su questi cicli: l'esempio mostra quindi il caso peggiore rispetto alla soluzione ottima frazionaria prodotta dal risolutore.

![[assets/vertexcoverILP.png|500]]

> **Programma AA 2025/26.** La variante pesata del Vertex Cover è indicata dalle dispense ufficiali come non materiale d'esame. L'estensione pesata di Relax & Round è quindi un approfondimento e non viene inclusa in questa trattazione principale.

[^vc-max-degree]: Costruzione tratta da M. Zito, [*Vertex Cover*, lecture notes COMP309 (2005), pp. 5–8](https://cgi.csc.liv.ac.uk/~michele/TEACHING/COMP309/2005/Lec10.4.4.pdf).

## 3 Algoritmi distribuiti

### 3.1 Teoria della computazione distribuita

Questo capitolo studia protocolli in cui nodi con memoria privata cooperano scambiando messaggi. Le proprietà della rete e del tempo non sono implicite: il modello di base è presentato qui, mentre ogni problema dichiara le restrizioni aggiuntive che usa.

#### Ambienti distribuiti

[[teacher_slides/2_distributed algorithms.pdf#page=3|Slide della docente, p. 3]]
[[teacher_slides/2_distributed algorithms.pdf#page=7|Slide della docente, p. 7]]

Un **ambiente distribuito** è una collezione finita di entità computazionali che cooperano tramite scambio di messaggi per raggiungere un obiettivo comune. Le entità possono avere capacità diverse, ma ciascuna dispone di computazione, memoria privata e clock locale: sono **molteplici**, **autonome** e capaci di **interagire**. Ne sono esempi il Web, le reti di comunicazione, le reti di sensori e quelle robotiche. Condividere risorse, tollerare guasti e aumentare la scalabilità sono motivazioni frequenti per usarle.

Un **algoritmo distribuito**, o *protocollo*, specifica le azioni locali delle entità in modo che il loro comportamento collettivo risolva il problema. Come per un algoritmo sequenziale, occorre dimostrarne la correttezza e valutarne l'efficienza.

La distinzione rispetto al calcolo parallelo riguarda soprattutto il modello di comunicazione: in una macchina parallela i processori condividono *tipicamente* la memoria e sono vicini, perciò sincronizzazione e mutua esclusione sono problemi centrali; nel modello distribuito del corso le memorie sono separate e la cooperazione richiede messaggi tra entità anche distanti. Le operazioni possono svolgersi in parallelo in entrambi i casi. L'assenza di memoria condivisa è un'ipotesi del modello **message-passing** qui studiato, non una proprietà universale di ogni sistema distribuito.

#### Il modello

[[teacher_slides/2_distributed algorithms.pdf#page=23|Slide della docente, p. 23]]

La rete di comunicazione è rappresentata da un grafo $G=(V,A)$: i vertici sono le **entità** (dette anche *nodi*) e gli archi orientati sono i collegamenti lungo i quali si possono inviare messaggi. L'orientamento permette di descrivere anche canali unidirezionali; quando si assume la restrizione dei collegamenti bidirezionali, il grafo si può trattare come non orientato e scrivere $G=(V,E)$.

#### Entità

[[teacher_slides/2_distributed algorithms.pdf#page=10|Slide della docente, p. 10]]
[[teacher_slides/2_distributed algorithms.pdf#page=11|Slide della docente, p. 11]]
[[teacher_slides/2_distributed algorithms.pdf#page=18|Slide della docente, p. 18]]
[[teacher_slides/2_distributed algorithms.pdf#page=19|Slide della docente, p. 19]]

Ogni entità $x$ riceve un input locale, eventualmente vuoto, ed è chiamata a produrre un output conforme alla specifica del problema. I valori prodotti dai singoli nodi possono essere diversi: per esempio, dopo un'elezione uno risulta *leader* e gli altri *follower*.

Il registro $status(x)$ indica lo **stato** corrente di $x$, scelto da un insieme finito $S$: in ogni momento vale $status(x)\in S$. Il comportamento è **reattivo**: un'azione è innescata da un evento, come l'arrivo di un messaggio, un battito del clock locale o un impulso spontaneo esterno (per esempio, una richiesta a uno sportello ATM inattivo). In assenza di eventi, l'entità non compie azioni.

Un'**azione** può comprendere calcolo locale, lettura o scrittura della memoria privata, invio di messaggi, cambio di stato, impostazione o azzeramento del clock oppure nessuna operazione (*NIL*). È atomica rispetto agli altri eventi e termina in tempo finito. Il protocollo assegna un'azione a ogni coppia possibile $(\text{stato},\text{evento})$: la regola è **completa** se nessuna coppia resta indefinita e **deterministica** se a ciascuna coppia corrisponde una sola azione.

Nel seguito consideriamo un sistema **simmetrico**: tutte le entità seguono la stessa descrizione del protocollo, pur potendo agire diversamente in base a stato, input e ruolo locale. Per esempio, lo stesso codice può scegliere un'azione per un nodo *iniziatore* (*initiator*) e un'altra per un nodo *dormiente* leggendo una variabile di ruolo; la simmetria del codice non richiede che i nodi si trovino nello stesso stato.

#### Comunicazione

[[teacher_slides/2_distributed algorithms.pdf#page=22|Slide della docente, p. 22]]
[[teacher_slides/2_distributed algorithms.pdf#page=23|Slide della docente, p. 23]]

Un messaggio è una sequenza **finita di bit**. La comunicazione è *point-to-point*: un'entità $x$ può inviare direttamente solo ai suoi **vicini in uscita** $N_o(x)$ e ricevere solo dai **vicini in ingresso** $N_i(x)$. Indichiamo con $N(x)=N_o(x)\cup N_i(x)$ l'insieme dei suoi vicini; con collegamenti bidirezionali i due insiemi coincidono. L'ordine FIFO dei messaggi lungo un collegamento non è garantito dal modello generale: quando serve, va dichiarato come restrizione.

#### Assiomi

[[teacher_slides/2_distributed algorithms.pdf#page=25|Slide della docente, p. 25]]
[[teacher_slides/2_distributed algorithms.pdf#page=26|Slide della docente, p. 26]]

Nel modello di base valgono due assiomi; le ulteriori ipotesi richieste da un protocollo sono **restrizioni**.

- **Ritardi di comunicazione finiti.** In assenza di guasti, un messaggio inviato a un vicino in uscita arriva integro ed è elaborato in tempo finito. L'assioma non fornisce un limite superiore noto o uniforme al ritardo.
- **Orientamento locale.** Ogni entità distingue i propri vicini in uscita e quelli in ingresso: può scegliere a quale vicino inviare e riconoscere da quale porta locale proviene un messaggio ricevuto. Le etichette delle porte sono distinte per i vicini dello stesso nodo, ma restano locali e non costituiscono identificativi globali delle entità.

#### Restrizioni

[[teacher_slides/2_distributed algorithms.pdf#page=27|Slide della docente, p. 27]]
[[teacher_slides/2_distributed algorithms.pdf#page=28|Slide della docente, p. 28]]
[[teacher_slides/2_distributed algorithms.pdf#page=29|Slide della docente, p. 29]]
[[teacher_slides/2_distributed algorithms.pdf#page=30|Slide della docente, p. 30]]
[[teacher_slides/2_distributed algorithms.pdf#page=31|Slide della docente, p. 31]]
[[teacher_slides/2_distributed algorithms.pdf#page=32|Slide della docente, p. 32]]
[[teacher_slides/2_distributed algorithms.pdf#page=33|Slide della docente, p. 33]]

Una **restrizione** è una proprietà aggiuntiva sfruttata dal protocollo: ne può rendere possibile o più efficiente l'esecuzione, ma limita i sistemi a cui si applica. Le ipotesi vanno quindi dichiarate per ogni algoritmo. Fra quelle ricorrenti ci sono:

- **Comunicazione:** ordine FIFO dei messaggi sullo stesso canale; **collegamenti bidirezionali** ($N_i(x)=N_o(x)=N(x)$).
- **Affidabilità:** rilevazione dei guasti di nodi o collegamenti, consegna garantita dei messaggi, limiti ai tipi di guasto. Nella terminologia delle slide, **affidabilità parziale** significa che non ci saranno guasti futuri, pur potendocene essere stati; **affidabilità totale** significa che non ce ne sono stati e non ce ne saranno.
- **Topologia e conoscenza:** connettività forte per un grafo diretto, semplice connettività per uno bidirezionale; eventuale conoscenza iniziale del numero $n$ di nodi, del numero $m$ di collegamenti o del diametro $D(G)$.
- **Tempo:** un *bounded communication delay* impone, in assenza di guasti, un limite $\Delta$ al ritardo di ogni messaggio; l'*unitary communication delay* lo fissa a un'unità, mentre i *synchronized clocks* fanno avanzare insieme i clock locali. Salvo indicazione contraria, il modello del corso è **asincrono**: i ritardi sono finiti in assenza di guasti, ma non hanno un bound noto.

#### Misure di efficienza per gli algoritmi distribuiti

[[teacher_slides/2_distributed algorithms.pdf#page=35|Slide della docente, p. 35]]
[[teacher_slides/2_distributed algorithms.pdf#page=36|Slide della docente, p. 36]]

Le misure principali sono la **quantità di comunicazione** e il **tempo**. Di norma la prima conta le trasmissioni di messaggi: un invio su un collegamento vale un messaggio, anche se un guasto ne impedisce la consegna. Se i messaggi hanno lunghezze molto diverse, si contano invece i **bit trasmessi** (*bit complexity*). Lo spazio locale resta una risorsa, ma qui l'analisi si concentra soprattutto sulla comunicazione; il costo del calcolo locale è considerato trascurabile rispetto alla trasmissione.

Il **tempo fisico** va dall'avvio della prima entità alla terminazione dell'ultima. Nel modello asincrono generale non ha un bound uniforme ricavabile dalla sola topologia, perché il ritardo di ciascun messaggio può essere arbitrariamente grande. Per analizzare un protocollo distinguiamo quindi due misure astratte:

- **Tempo ideale (*ideal time*):** durata in un'esecuzione sincrona con clock sincronizzati e un'unità di tempo per trasmettere ed elaborare un messaggio. Un messaggio può così avanzare di un collegamento per unità di tempo; catene indipendenti possono procedere in parallelo.
- **Tempo causale (*causal time*):** lunghezza massima di una catena di trasmissioni causalmente dipendenti, considerando le possibili esecuzioni. Conta la profondità delle dipendenze tra messaggi, non i secondi trascorsi; in generale non coincide con il tempo ideale.

Quando si indica una *time complexity* occorre specificare quale misura e quali restrizioni temporali si stanno usando. Il caso del broadcast mostrerà perché la distinzione conta.

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

Nel modello ideale sincrono, dopo $t$ unità hanno appreso $I$ tutti i nodi a distanza al più $t$ da $s$. Il tempo fino all'ultima prima ricezione è l'**eccentricità** $r(s)=\max_y d(s,y)$; nel caso peggiore rispetto all'iniziatore è il diametro $D(G)=\max_s r(s)\le n-1$. Nel modello asincrono, invece, il **tempo fisico** non ha un bound uniforme senza un limite ai ritardi. La catena che porta alla *prima* ricezione di un nodo segue nodi distinti e contiene al più $n-1$ trasmissioni, ma può seguire un cammino non minimo. Il **tempo causale** conta anche le copie ridondanti: poiché ogni nodo invia una sola volta, una catena di inoltri può contenere fino a $n$ trasmissioni. In un triangolo si può avere $s\to a\to b\to s$, con l'ultima copia ricevuta da $s$ già in $DONE$. Questi conteggi causali non vanno identificati con $D(G)$.

##### Lower bound

[[teacher_slides/2_distributed algorithms.pdf#page=57|Slide della docente, p. 57]]

In *ideal time*, per l'iniziatore $s$ ogni broadcast deve impiegare almeno $r(s)$ unità per raggiungere il nodo più lontano; se l'iniziatore è arbitrario, il caso peggiore è almeno $D(G)$. Flooding lo raggiunge ed è quindi ottimale per questa misura. Quanto ai messaggi, almeno $n-1$ nodi devono ricevere $I$. Per un protocollo generico corretto su **tutti** i grafi connessi, senza conoscenza globale della topologia o di $n$, vale il bound più forte $m$: se in un'esecuzione un arco non trasmettesse mai, potremmo sostituirlo con un cammino attraverso un nuovo nodo dormiente, lasciando invariata la vista locale degli estremi; il nuovo nodo non riceverebbe $I$. Questa contraddizione spiega perché Flooding, che usa meno di $2m$ messaggi, è ottimale **nell'ordine di grandezza** sotto quelle ipotesi.

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

Se un insieme $S$ di iniziatori si attiva simultaneamente all'istante iniziale e non intervengono altri impulsi, l'ultimo risveglio avviene dopo $\max_{v\in V}\min_{s\in S}d(s,v)$ unità: più iniziatori possono accelerare l'esecuzione. Nel caso peggiore ammesso, però, può attivarsi un solo iniziatore in un nodo di eccentricità $D(G)$, perciò la complessità ideale worst-case è $\Theta(D(G))$. Anche se altri impulsi spontanei arrivano più tardi, il primo iniziatore garantisce un upper bound ideale di $D(G)$; senza un bound sui ritardi il tempo fisico asincrono resta non limitato uniformemente.

#### Spanning tree

Uno **spanning tree** (albero di copertura) di un grafo connesso $G=(V,E)$ è un sottografo $T=(V,E')$, con $E'\subseteq E$, **connesso e aciclico**. Contiene tutti gli $n=|V|$ nodi e, come ogni albero, esattamente $n-1$ archi. Costruirlo permette poi, per esempio, di fare broadcast lungo i soli archi di $T$ con $n-1$ messaggi, oltre al costo iniziale della costruzione.

Nel problema distribuito **SPT** (*spanning tree construction*) ogni nodo $x$ deve conoscere, alla fine, l'insieme $TreeNeighbours(x)\subseteq N(x)$ dei propri vicini nell'albero; non è necessario che conosca tutto $T$. Gli insiemi locali devono essere coerenti: $y\in TreeNeighbours(x)$ se e solo se $x\in TreeNeighbours(y)$. La prima ricezione di un broadcast da un unico iniziatore individua già un *parent* per ogni altro nodo, ma servono risposte o ulteriori messaggi per far conoscere a ciascuno anche i figli e distinguere gli archi non appartenenti all'albero.

Per SHOUT e per la visita DFT assumiamo **un solo iniziatore**, grafo connesso, collegamenti bidirezionali e affidabilità totale; i nodi conoscono il proprio vicinato $N(x)$. Poniamo $m=|E|$. I protocolli non richiedono che i nodi conoscano l'intera topologia. Per lo pseudocodice di SHOUT con risposte $NO$ assumiamo anche consegna **FIFO su ogni link**: serve alla terminazione locale basata sul solo contatore.

#### Protocollo Shout

**Problema e modello.** SHOUT costruisce uno spanning tree che ogni nodo conosce tramite i propri vicini nell'albero; la specifica e le restrizioni sono in [[#Spanning tree]]. In particolare c'è un unico iniziatore, il grafo è connesso e bidirezionale, non vi sono guasti e, per la variante con risposte $NO$ e il contatore qui descritti, i messaggi su ciascun collegamento arrivano in ordine FIFO.

**Idea.** SHOUT estende Flooding: l'iniziatore invia una richiesta $Q$ a ogni vicino. Un nodo ancora $IDLE$ accetta la prima richiesta con $YES$, sceglie il mittente come parent e invia $Q$ agli altri vicini. Se è già $ACTIVE$, risponde $NO$ alle richieste successive. Ogni nodo conta una risposta per ciascun vicino a cui ha inviato $Q$; per un nodo non iniziatore si conta anche il parent, già deciso con $YES$.

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

**Tempo ideale.** Con trasmissioni simultanee di un'unità, i $Q$ raggiungono ogni nodo alla sua distanza dall'iniziatore $s$. Per $n\ge2$, l'ultimo nodo non può terminare prima di $r(s)+1$ unità, dove $r(s)=\max_x d(s,x)$ è l'eccentricità di $s$. Un $Q$ fra due nodi all'ultimo livello può però richiedere un successivo $NO$: per la terminazione locale di tutti i nodi vale quindi $r(s)+1\le T_{ideal}(\text{SHOUT})\le r(s)+2\le D(G)+2$. In un triangolo con iniziatore in un vertice, gli altri due si scambiano $Q$ e poi $NO$, raggiungendo il limite superiore. Il libro consigliato riporta $r(s)+1$ anche per SHOUT (*Design and Analysis of Distributed Algorithms*, p. 56): il triangolo mostra che, contando il passaggio di **tutti** i nodi a $DONE$ nel pseudocodice con $NO$, può servire un'unità in più. Per $n=1$ il tempo è zero. Senza un limite ai ritardi, il tempo fisico asincrono non ha un bound uniforme.

**SHOUT+** elimina i messaggi $NO$. Le azioni degli stati iniziali restano uguali; in $ACTIVE$, ricevere $Q$ da un vicino equivale a ricevere un rifiuto implicito: si incrementa `counter` senza rispondere. La gestione di $YES$ resta invariata. Quando due $Q$ si incrociano su un arco, ciascun estremo riceve il $Q$ dell'altro e conta la risposta implicita. Anche qui tutti i contatori arrivano a $|N(x)|$.

![[assets/Screenshot 2024-10-15 114636.png|400]]

Ogni arco trasporta esattamente due messaggi: $Q$–$YES$ se entra nell'albero, oppure $Q$–$Q$ se ne resta fuori. Quindi $M(\text{SHOUT+})=2m$; per $n\ge2$ il suo tempo ideale è ancora $r(s)+1$.

**Più iniziatori.** SHOUT e SHOUT+ sono specificati per un solo iniziatore. Se ne partono più di uno, un nodo già attivo non accetta la richiesta proveniente da un altro albero parziale: gli alberi non si fondono e il risultato può essere una **foresta**. Le strategie per costruire un unico albero in questa situazione sono trattate separatamente più avanti.

#### Costruzione dello spanning tree tramite traversal

**Problema e modello.** La visita in profondità distribuita (*depth-first traversal*, **DFT**) costruisce uno spanning tree con un solo iniziatore su un grafo connesso e bidirezionale, senza guasti; i nodi conoscono i propri vicini. La specifica locale dell'output è in [[#Spanning tree]]. Come per [[#Protocollo Shout|SHOUT]], assumiamo messaggi FIFO sui singoli collegamenti.

**Idea.** Circola un solo token di visita: un nodo prova un vicino alla volta e attende il ritorno del token prima di provarne un altro. Gli archi con cui il token raggiunge per la prima volta un nodo formano l'albero; i tentativi verso nodi già visitati individuano le *back-edge*, che ne restano fuori.

I tre messaggi sono `ForwardToken`, per tentare la visita, `ReturnToken`, per tornare dopo aver completato un sottoalbero, e `BackEdgeToken`, per respingere il token quando il nodo era già visitato.

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

**Problema.** Anche con più iniziatori vogliamo costruire un solo spanning tree, noto localmente tramite i vicini dell'albero come in [[#Spanning tree]]. Un nodo non sa se nella rete siano presenti altri iniziatori. Lanciare [[#Protocollo Shout|SHOUT]] o [[#Costruzione dello spanning tree tramite traversal|DFT]] indipendentemente da più nodi può produrre una foresta. Le slide presentano due **idee di soluzione** con identificatori univoci, senza specificare qui un protocollo completo o una sua complessità precisa:

- **Multiple spanning tree:** ogni iniziatore costruisce il proprio spanning tree con un protocollo a iniziatore unico; gli identificatori distinguono le costruzioni. Il costo in messaggi dipende dal numero di iniziatori e dal protocollo usato, e può essere elevato.

- **Costruzione selettiva:** ogni iniziatore avvia una costruzione identificata dal proprio ID. I nodi abbandonano progressivamente le costruzioni con ID maggiore e mantengono quella dell'iniziatore con ID minimo. Alcuni nodi potrebbero dover rieseguire il protocollo più volte; serve inoltre un meccanismo per notificare il completamento della costruzione dello **spanning tree**. Qui *spanning* significa che l'albero copre tutti i nodi, non che minimizza il peso degli archi.

Un'altra strada è eleggere un unico iniziatore, detto **leader**, prima di costruire l'albero.

#### Computazione negli alberi

In questa sezione la rete è un **albero**: un grafo connesso e aciclico con $n$ nodi e $n-1$ archi. Ogni nodo sa che la rete è un albero e conosce i propri vicini, ma non necessariamente l'intera topologia. Un albero può essere *rooted* (con radice e direzione padre–figli) oppure *unrooted* (senza radice designata).

![[assets/Screenshot 2024-10-16 093438.png|700]]

Le restrizioni più tipicamente applicate nel caso di alberi sono:

- Collegamenti bidirezionali

- Connettività

- Messaggi FIFO

- Affidabilità completa

- Conoscenza del fatto che la rete è un albero e del proprio vicinato

#### Tecnica di saturazione

**Problema e modello.** In un albero bidirezionale e affidabile con $n$ nodi, ogni nodo $x$ ha un valore $v(x)$, non necessariamente distinto dagli altri. Alla fine ciascuno deve sapere se il proprio valore è uguale al minimo globale. I nodi conoscono i propri vicini e sanno di trovarsi in un albero; la distinzione tra albero con e senza radice è in [[#Computazione negli alberi]].
Le foglie dell'albero avviano la computazione, mandando il proprio valore verso il proprio unico vicino, che può essere interno oppure, nel caso limite di un albero con due nodi, un'altra foglia. Un nodo attende che tutti i vicini tranne uno gli inviino il loro valore. Dopodiché calcola il minimo tra il proprio valore e quelli ricevuti e lo inoltra sul collegamento rimasto.
Ad un certo punto della computazione, da qualche parte nell'albero, due nodi adiacenti si scambieranno tra loro il valore minimo corrente ottenuto dalle due porzioni dell'albero.
La computazione procede propagando il minimo globale nuovamente verso la periferia dell'albero, così che alla fine tutti i nodi possano stabilire se il loro valore è corrisponde al minimo o no.

![[assets/Screenshot 2024-10-16 093901.png|1000]]

Per un albero con $n\geq2$, la procedura completa può essere avviata da un numero arbitrario di iniziatori: prima Wake-up attiva tutti i nodi, poi le foglie avviano la saturazione. La prima fase si chiama **attivazione**.
Le due fasi successive si dicono "saturazione" e "risoluzione". Nella prima viene inviato un peculiare messaggio detto "di saturazione". Quando i nodi ricevono i messaggi di saturazione provenienti dalla periferia, passano allo stato di "processing". Ogni nodo $x$ attende $|N(x)|-1$ messaggi di saturazione, poi calcola il minimo e lo inoltra sul collegamento mancante con un nuovo messaggio di saturazione.
È possibile dimostrare che, ad un certo punto della computazione, esattamente due nodi adiacenti si "saturano" scambiandosi il messaggio sul loro arco comune. Non è necessario che siano entrambi nodi interni: in un albero di due nodi sono entrambe foglie. Questi sono gli ultimi due nodi verso i quali fluiscono i messaggi di saturazione. Diverse esecuzioni possono portare a diverse coppie, ma la proprietà di adiacenza rimane valida.

![[assets/Screenshot 2024-10-16 094713.png|400]]

La resolution consiste dell'invio di una notifica da parte delle entità saturate, con inoltro, dall'interno verso l'esterno della struttura.
Vediamo i costi relativi alla saturazione:

- Messaggi inviati (caso peggiore, $n\geq2$)

  - Attivazione: Wake-up usa al più $2(n-1)$ messaggi, con il massimo raggiunto se tutti gli $n$ nodi sono inizialmente iniziatori

  - Saturazione: $(n - 1) + 1 = n$ messaggi, dove i primi $n - 1$ coprono tutti gli archi dell'albero e quello tra i due nodi saturati è contato 2 volte

  - Risoluzione: $(n - 2)$ messaggi, perché quello tra i due nodi saturati non viene ripercorso

  ![[assets/Screenshot 2024-10-16 113456.png|700]]

  Il costo complessivo è **al più $4n-4$ messaggi**. Questo bound conta i messaggi inviati nelle tre fasi, non i bit trasmessi. Se ogni nodo diffondesse separatamente il proprio valore a tutta la rete con flooding, il costo potrebbe invece essere quadratico.

La procedura termina perché ogni messaggio di saturazione attraversa un arco verso la coppia finale e la risoluzione percorre gli archi rimasti verso le foglie. Per $n=1$ non serve alcun messaggio: l'unico nodo conosce già il minimo. In assenza di un limite sui ritardi dei collegamenti, il tempo fisico asincrono non ha un bound uniforme.

La saturazione viene usata per risolvere problemi che richiedono di lavorare su formazioni conosciute localmente e che possono essere calcolate globalmente. Il minimo è solo un esempio di casi di questo genere.
Nel caso di un albero rooted, l'iniziatore naturale per diverse attività della rete è la radice. In questi casi tipicamente si fa partire un broadcasting dalla radice, le risposte vengono raccolte dal basso con la tecnica della saturazione e la radice attende i risultati dai propri vicini i risultati e dunque la fine della computazione.

### 3.2 Leader election in alberi

#### Introduzione

**Problema e modello.** La *leader election* su un albero con collegamenti bidirezionali e senza guasti deve far decidere a ogni nodo il proprio stato: uno solo è leader, tutti gli altri sono follower. I nodi conoscono i propri vicini; quando l'albero non ha una radice designata, il protocollo qui descritto usa identificativi univoci per distinguere i candidati. La rete può essere già attiva oppure richiedere la fase di wake-up indicata in [[#Tecnica di saturazione]].

![[assets/Screenshot 2024-10-25 111800.png|600]]

#### Limite deterministico senza identificativi distinguibili

> [!theorem] Teorema (Angluin, 1980)
> The leader election problem is unsolvable unless the entities have different IDs.

[[teacher_slides/2_distributed algorithms.pdf#page=136|Slide della docente, p. 136]]
[[teacher_slides/2_distributed algorithms.pdf#page=137|Slide della docente, p. 137]]

**Significato nel modello.** Con collegamenti bidirezionali, grafo connesso e assenza di guasti, un protocollo deterministico non può eleggere un solo nodo se le entità partono anonime e indistinguibili. Un identificativo distinto permette invece di confrontare i candidati. Una radice già designata rompe anch'essa la simmetria iniziale: è il caso separato del paragrafo seguente.

##### Idea della dimostrazione

Su una rete simmetrica di due entità anonime con lo stesso stato iniziale, i due nodi eseguono le stesse azioni e ricevono gli stessi messaggi in ogni istante. Restano quindi indistinguibili: se uno si dichiara leader, lo fa anche l'altro, contraddicendo l'unicità richiesta.

#### Leader election in alberi

Nel caso di alberi rooted il problema è particolarmente semplice: la radice si auto-elegge leader e tutti gli altri nodi follower. Non vengono scambiati messaggi nel processo di elezione e bastano $O(n)$ messaggi per la notifica.
Quando l'albero non è rooted, si usa la [[#Tecnica di saturazione|saturazione]]: i valori propagati verso il centro arrivano a due nodi adiacenti, che confrontano i propri identificativi univoci e scelgono il leader; una notifica diffonde poi il risultato. Il numero di messaggi è **al più $4n-4$** per $n\geq2$, includendo attivazione, saturazione e notifica; la rappresentazione degli identificativi richiede $O(\log MaxID)$ bit.

#### Leader election e spanning tree

Se è già disponibile uno spanning tree con radice designata, quella radice può essere il leader e la notifica percorre l'albero. Se invece si elegge prima un leader in un grafo connesso, lo si può usare come unico iniziatore per la costruzione di uno [[#Spanning tree|spanning tree]]. Queste due direzioni richiedono ipotesi iniziali diverse: un albero con radice già nota oppure un protocollo di elezione applicabile al grafo dato.

### 3.3 Leader election in anelli

#### Introduzione

**Problema e modello.** Nell'anello con $n$ nodi e $m=n$ archi bisogna eleggere un solo leader e far conoscere a ciascun nodo se è leader o follower. La topologia è simmetrica: senza identificativi distinti, nodi con la stessa vista locale non possono essere differenziati da un protocollo deterministico. Qui assumiamo identificativi univoci, collegamenti affidabili e una direzione di percorrenza riconoscibile localmente; i singoli algoritmi precisano se richiedono collegamenti bidirezionali. Il criterio è l'identificativo minimo.

![[assets/Screenshot 2024-10-25 113100.png|400]]

Le reti ad anello furono effettivamente molto usate prima dell'avvento del WiFi, motivo per cui si tratta di un caso d'uso molto studiato. Anche oggigiorno può accadere che i nodi all'interno di una rete si riconfigurino formando un anello virtuale.
Vedremo generalmente algoritmi deterministici con identificativi unici associati a ciascun nodo. Il criterio di selezione si baserà sull'identificativo più piccolo. Verrà infine eletto un solo leader, proprio perché gli identificativi sono unici.

#### All The Way

**Obiettivo e idea.** Ogni nodo deve poter confrontare il proprio identificativo con tutti gli altri, così da decidere localmente se è il minimo. All The Way fa percorrere l'intero anello a un messaggio per nodo, senza eliminare candidati durante il viaggio.

**Restrizioni:**

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

#### As Far As It Can

**Problema e modello.** Su un anello affidabile con identificativi distinti e direzione di inoltro comune, vogliamo eleggere il minimo. Come in [[#All The Way]], i candidati fanno circolare il proprio ID; qui un nodo **inoltra** un identificativo ricevuto solo se è più piccolo del minimo visto finora. Un ID più grande viene fermato, perché non può prevalere. Chi riceve di ritorno il proprio identificativo è il leader.

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

#### Controlled Distance

**Problema e modello.** Su un anello affidabile con identificativi univoci, collegamenti **bidirezionali** e orientamento locale, Controlled Distance elegge l'ID minimo anche con più iniziatori. Lavora per *stage*: in ciascuno ci sono candidati e nodi sconfitti. I candidati cercano prima identificativi più piccoli nelle vicinanze; quelli che sopravvivono ampliano progressivamente la distanza esplorata. Alla fine rimane un solo leader.
Al generico passo $i$-esimo, i candidati inviano i propri messaggi in entrambe le direzioni. Questi messaggi devono arrivare ad una distanza $2^i$ in cerca di identificatori più piccoli e tornano indietro solo nel caso in cui non ne abbiano trovati. Un candidato leader che vede ritornare entrambi i messaggi inviati ricomincerà come candidato leader anche al prossimo stage.
Ad un generico stage $i$, se un candidato leader riceve un messaggio con un identificativo più basso, passa automaticamente allo stato di leader sconfitto ed inoltra il messaggio. Un leader sconfitto rimane tale per tutto il resto dell'esecuzione del protocollo e continuerà passivamente a fare circolare i messaggi lungo l'anello. Un candidato leader che riceve un messaggio con un identificativo più alto, ferma la corsa del messaggio.

![[assets/Screenshot 2024-10-29 114205.png|700]]

Potenzialmente, allungando la distanza percorsa dei messaggi con la legge $2^i$, un candidato leader potrà ricevere in forward il proprio stesso messaggio. Questo significa banalmente che l'identificativo è il più basso di tutti, per cui il candidato può auto-proclamarsi leader.
Possiamo avere più iniziatori per questo protocollo.

![[assets/Screenshot 2024-10-29 114514.png|800]]

L'invio finale di una notifica è indispensabile, perché diversamente i nodi non possono sapere se la computazione sia terminata.

![[assets/Screenshot 2024-10-29 115446.png|1000]]

Controlled Distance termina sempre, perché prima o poi la distanza da percorrere per i messaggi supera senz'altro $n$, eleggendo leader il nodo con l'identificatore più basso.

- Numero di stage: lo stage finale ha indice $d$, il minimo intero tale che $2^d\geq n$. Poiché gli indici partono da $0$, gli stage sono $d+1$ in totale:

  $$\begin{aligned}
                          d=\lceil\log_2 n\rceil,\qquad s=d+1=\lceil\log_2 n\rceil+1.
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

#### Introduzione

**Problema e modello.** In un grafo connesso e bidirezionale $G=(V,E)$ ogni nodo deve conoscere se è l'unico leader oppure un follower. Assumiamo identificativi distinti, canali affidabili e orientamento locale; i protocolli precisano le ulteriori conoscenze necessarie. Qui il leader è il nodo con **identificativo massimo**, tranne in YO-YO, che elegge il minimo.

Per il protocollo FloodMax aggiungiamo:

- Canali FIFO

- Conoscenza di proprietà del grafo, in particolare il suo diametro $d$, da parte dei nodi

FloodMax usa round coordinati e la conoscenza del diametro $d$; YO-YO è descritto separatamente con le proprie ipotesi.

#### FloodMax

**Idea.** Per eleggere l'ID massimo, ogni nodo propaga il massimo visto finora. A differenza del [[#Broadcast|broadcast]] con un solo dato iniziale, qui ogni nodo parte dal proprio identificativo. Il grafo è connesso, bidirezionale e affidabile; i nodi conoscono il diametro $d$ e procedono in round coordinati.
Ogni entità mantiene il massimo identificativo visto fino a quel momento. L'esecuzione è divisa in "rounds". A ciascun round ogni entità invia l'identificativo massimo visto fino a quel momento alle altre ed attende quello dei vicini. Dopo un certo numero $d$ di rounds (pari al diametro del grafo), se il valore massimo dell'identificativo è quello dell'entità $x$, essa diventa leader, altrimenti follower. Scegliere di attendere esattamente $d$ passi ci assicura che l'esecuzione sia terminata per tutti i nodi.

![[assets/Screenshot 2024-10-30 185342.png|600]]

- Messaggi inviati: ogni entità ad ogni round invia un messaggio ad ogni vicino, dunque abbiamo $2 \cdot m \cdot d$ messaggi totali

- Tempo di esecuzione: uguale all'algoritmo di flooding, è banalmente il diametro $d$ del grafo

#### Protocollo YO-YO

**Problema e modello.** YO-YO è un protocollo deterministico per eleggere un solo leader in un grafo connesso, bidirezionale e affidabile con identificativi distinti; sceglie il nodo con identificativo **minimo**. I nodi conoscono i vicini e distinguono le porte locali; la descrizione non usa la conoscenza preventiva del diametro richiesta da [[#FloodMax]]. Mantiene un orientamento logico aciclico del grafo e distingue:

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

#### Introduzione

**Problema e modello.** Vogliamo eleggere l'ID minimo su un anello affidabile con identificativi distinti e orientamento riconoscibile. Qui, in più, il sistema è **sincrono**: tutti i clock battono insieme, ogni nodo può inviare a uno stesso vicino al più un messaggio per battito e il ritardo dei collegamenti ha un limite noto. Quando un protocollo richiede che tutti conoscano $n$, lo dichiara localmente.

In particolare assumiamo che:

- Ogni entità, quando deve mandare un messaggio, lo fa al battito del clock

- Quando avviene il battito del clock, un'entità può inviare al massimo un solo messaggio allo stesso vicino

- Si conosce il bound superiore del ritardo di comunicazione sui canali

Si prende come riferimento il tempo $\delta$ che intercorre tra due battiti di clock. Essendo il tempo lo stesso per tutti i nodi, lo si può sfruttare per definire i protocolli.
È importante il fatto che, per i sistemi sincroni, esiste un limite $c$ alla dimensione dei messaggi per garantire il bound del ritardo di comunicazione. Messaggi più grandi di $c$ vengono spezzati in messaggi più piccoli, delle dimensioni proprio di $c$.

#### Speeding

**Problema e modello.** Su un anello sincrono affidabile con ID distinti, Speeding vuole eleggere il minimo riducendo i messaggi. Qui consideriamo l'avvio simultaneo; le slide osservano che non è indispensabile al protocollo. Come in [[#As Far As It Can]], gli identificativi più grandi vengono bloccati da quelli più piccoli. L'idea aggiuntiva è dare priorità temporale agli ID piccoli, affinché possano bloccare prima quelli grandi.

[[teacher_slides/2_distributed algorithms.pdf#page=269|Slide della docente, p. 269]]
Pur non potendo effettivamente aumentare la velocità di propagazione per i messaggi con identificativi più piccoli, si possono introdurre dei ritardi alla propagazione di quelli con identificativi più grandi. Ogni candidato immette il proprio ID nell'anello; i nodi inoltrano il messaggio con un ritardo dipendente dall'ID e fermano un candidato quando conoscono un ID minore. L'immagine mostra i tempi di inoltro del protocollo.

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

#### Waiting

**Problema e modello.** Waiting elegge l'ID minimo in un anello sincrono affidabile con identificativi distinti; ogni nodo conosce anche la dimensione $n$ dell'anello. Ogni entità attende un tempo determinato dal proprio ID. Se non riceve alcuna notifica allo scadere si elegge leader e avvisa gli altri; altrimenti diventa follower. La notifica deve arrivare agli altri nodi prima della loro scadenza.
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

- Tempo di esecuzione: dipende essenzialmente dalla funzione di attesa. In questo caso è pari a $min \cdot n + n \in O((min+1)n)$; diventa $O(n)$ se il minimo identificativo è limitato da una costante

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

- Tempo di esecuzione: rispetto al caso in cui tutti i nodi si svegliano contemporaneamente, abbiamo raddoppiato il coefficiente nella funzione di attesa. Complessivamente: $2n\cdot min+2n\in O((min+1)n)$

Questo protocollo non è applicabile nel caso si ricerchi l'identificativo più alto piuttosto di quello più basso. In ogni caso, usare l'identificativo più piccolo offre dei vantaggi computazionali.

#### Universal waiting

**Obiettivo e modello.** Si vuole eleggere l'ID minimo in un grafo connesso e affidabile, con clock sincronizzati, identificativi distinti e un bound noto sul tempo di diffusione della notifica. [[#Waiting]] usa la lunghezza massima del percorso su un anello di $n$ nodi per separare i tempi di autoelezione; Universal Waiting sostituisce quel bound con il diametro $d$ del grafo.

![[assets/Screenshot 2024-11-06 100832.png|700]]

Per quanto riguarda i costi, sostituiamo il diametro $d$ al numero di nodi $n$ usato come bound di propagazione sull'anello. Si applicano funzioni di attesa analoghe a quelle di [[#Waiting]], distinguendo l'avvio simultaneo da quello con risveglio progressivo.

#### Elezione casuale del leader

**Problema e modello.** Su un anello sincrono affidabile senza identificativi univoci iniziali, nodi indistinguibili non possono rompere deterministicamente la simmetria. Vogliamo comunque eleggere un solo leader e comunicare il risultato a tutti, usando scelte casuali indipendenti e round ripetuti. Le due forme usuali di garanzia per un algoritmo randomizzato sono:

- Monte Carlo: terminano sempre, ma non è detto che ogni volta che lo fanno diano un risultato corretto

- Las Vegas: possono non terminare, ma quando lo fanno danno sempre il risultato corretto

L'idea dietro all'uso di identificativi era quella di trovare, alla fine del procedimento, un solo leader. Nel caso probabilistico, ogni nodo sceglie casualmente un identificativo intero e nel caso di minimi uguali si ripete il processo.

![[assets/Screenshot 2024-11-06 102152.png|800]]

Possiamo ad esempio utilizzare Waiting combinato ad un approccio probabilistico. I minimi fanno partire la notifica per primi e, siccome ci troviamo in un sistema sincrono, la attendono di ritorno dopo $i$ istanti di tempo. Quando arriva una notifica dopo meno di $i$ istanti, chi riceve la notifica diventa follower, altrimenti diventerà leader alla fine del processo.
Per un singolo round abbiamo:

- Comunicazione per round: $O(n)$ trasmissioni di messaggi da un bit, quindi $O(n)$ bit complessivi includendo la notifica o il riavvio; la dimensione del singolo messaggio resta $O(1)$

- Tempo di esecuzione: con identificativi estratti da $\{0,1\}$, un round richiede $O(n)$ unità di tempo, includendo la propagazione sull'anello; la scelta limita il tempo di attesa, non elimina il tempo di comunicazione. Per ottenere una probabilità di successo costante per round, ogni nodo sceglie $0$ con probabilità $1/n$ e $1$ con probabilità $(n-1)/n$. Il round ha successo quando un solo nodo sceglie $0$ e tutti gli altri scelgono $1$. La probabilità è:

  $$\begin{aligned}
                          P = n\cdot\frac{1}{n} \cdot (\frac{n - 1}{n})^{n - 1} = (\frac{n - 1}{n})^{n - 1} \xrightarrow{n \to \infty} \frac{1}{e} \sim 0.37
  \end{aligned}$$

  Per una specifica entità si moltiplicano la probabilità che scelga 0 e quelle che tutte le altre scelgano 1; il fattore $n$ conta le possibili scelte dell'unica entità che estrae 0.
  I round sono tentativi indipendenti con probabilità di successo che tende a $1/e$: il numero **atteso** di round tende a $e$, cioè circa $3$. Di conseguenza, tempo e comunicazione **attesi** dell'intero protocollo sono rispettivamente $O(n)$ unità di tempo e $O(n)$ bit. La terminazione è quasi certa, ma non esiste un numero massimo deterministico di round.

## 4 Algoritmi di routing

### Introduzione

**Problema.** Una sorgente $x$ deve far arrivare un messaggio a una destinazione $y$ scegliendo, a ogni nodo intermedio, il collegamento successivo. Il [[#Broadcast|broadcast]] potrebbe diffondere il messaggio a tutti, ma usa molte trasmissioni quando interessa una sola destinazione. Il routing costruisce invece le informazioni locali necessarie per instradare il messaggio.
Tipicamente il routing consiste nel processo di determinare un cammino tra una sorgente $x$ ed una destinazione $y$. Un router è un nodo che ha la proprietà di determinare automaticamente il percorso per i messaggi che lo attraversano in base all'indirizzo specificato, prendendo come riferimento ad un'apposita routing table locale.
Le restrizioni imposte per questa tipologia di problemi sono le seguenti:

- Collegamenti bidirezionali: con possibili costi associati

- Connettività

- Affidabilità totale

- Orientamento locale: tutti i nodi sono in grado di discernere tra i propri vicini, dunque da chi ricevono i messaggi

- Identificativi unici

### Routing table

Ciascun nodo ha una propria routing table che indica, per ogni possibile destinazione, su quale collegamento rimandare un messaggio in ingresso.
Sono di particolare interesse nella risoluzione di problemi di routing:

- La dimensione della tabella di routing, espresso in numero di bits

- Il tempo impiegato per scegliere il link da utilizzare

![[assets/Screenshot 2024-11-06 164323.png|700]]

Ogni nodo sceglie il prossimo collegamento in base ai cammini minimi dal proprio punto di vista. Il **principio di ottimalità** afferma che, se $x$ si trova su un cammino minimo da $a$ a $b$, allora il **suffisso da $x$ a $b$** è a sua volta un cammino minimo da $x$ a $b$. Per questo un nodo intermedio può continuare l'inoltro usando la propria tabella locale.

### Gossiping

**Problema e modello.** Su un grafo connesso, bidirezionale e affidabile, ogni nodo vuole costruire una [[#Routing table|tabella di routing]] per tutte le destinazioni. Nel *gossiping* ogni nodo comunica a tutti la propria lista di vicini; raccogliendo queste informazioni, ciascuno può ricostruire il grafo. La costruzione presuppone uno [[#Spanning tree|spanning tree]] lungo cui diffondere i dati.
Essenzialmente, per fare gossiping si costruisce uno spanning tree, attraverso il quale le entità possono fare il broadcasting di tali informazioni. Una volta che ciascun nodo ha ottenuto il grafo, può costruire il proprio albero dei cammini minimi e generare la tabella di routing. Il grafo memorizzato può quindi essere cancellato. Un downside del gossiping può essere dato dalla dimensione del grafo.

![[assets/Screenshot 2024-11-06 165045.png|600]]

- Comunicazione: il conteggio delle slide considera ogni informazione su un vicino come un elemento trasmesso separatamente lungo l'albero. Le fasi sono:

  - Shout+ per generare lo spanning tree: $O(2 \cdot m)$

  - Ottenimento delle informazioni sul vicinato, per ogni nodo: 2 messaggi scambiati per ogni collegamento (uno per direzione), dunque ancora: $O(2 \cdot m)$

  - Broadcast delle informazioni di ciascun nodo circa i propri vicini ($deg(x)$ messaggi, uno per ciascun vicino) attraverso tutti gli $n - 1$ collegamenti dello spanning tree:

    $$\begin{aligned}
                                \sum_{x} (n - 1) \cdot deg(x) = (n - 1) \cdot \sum_{x} deg(x) = (n - 1) \cdot 2 \cdot m
    \end{aligned}$$

    Naturalmente, la somma dei gradi di tutti i nodi è uguale a $2 \cdot m$.

  Con questa convenzione, il costo è $O(mn)$ trasmissioni di elementi. Se più informazioni vengono accorpate in un messaggio, il numero di invii può diminuire, mentre cresce la dimensione dei messaggi. Ogni nodo deve poter memorizzare la mappa completa del grafo, che richiede spazio $\Theta(n+m)$ in unità di vertici e archi.

### Iterating

**Problema e modello.** Ogni nodo deve costruire una tabella di routing su un grafo connesso e affidabile con costi dei collegamenti noti localmente. A differenza del [[#Gossiping|gossiping]], che diffonde il grafo intero, Iterating scambia stime delle distanze: all'inizio ogni nodo conosce solo i propri vicini, poi invia ai vicini il proprio *distance vector* e lo aggiorna usando quelli ricevuti. Le iterazioni e i conteggi sotto assumono l'esecuzione per round descritta nelle slide.

![[assets/Screenshot 2024-11-08 170555.png|1000]]

Questo modo di procedere è lo stesso previsto dall'algoritmo di Bellman-Ford; nella fattispepcie stiamo usando un Bellman-Ford distribuito. Il protocollo converge in al più $n - 1$ iterazioni, perché tale è la lunghezza massima di un cammino minimo tra due nodi. Al termine della computazione, a differenza di Gossiping, i nodi non conoscono né la mappa del grafo né l'albero dei cammini minimi da ogni sorgente.

- Comunicazione: a ogni iterazione ciascun nodo invia il proprio distance vector di $n$ costi a tutti i vicini. Se il vettore è **un messaggio**, gli invii sono $\sum_x |N(x)|=2m$ per iterazione, dunque al più $2m(n-1)\in O(mn)$ invii in totale. Se invece contiamo i singoli **elementi trasmessi**, come nel calcolo delle slide, otteniamo:

  $$\begin{aligned}
                      (n-1)n\sum_x |N(x)|=2mn(n-1)\in O(n^2m).
  \end{aligned}$$

  Nel conteggio per elementi, Iterating comunica più di Gossiping. Ogni nodo conserva il proprio vettore e le informazioni necessarie all'aggiornamento, senza memorizzare l'intera mappa del grafo.

Ci chiediamo a questo punto se sia possibile costruire tabelle di routing con una quantità di messaggi e memoria limitata. Possiamo farlo realizzando una versione distribuita degli algoritmi di Dijkstra o BFS, come vediamo nel seguito.

### Min-Hop routing

**Problema e modello.** Da una sorgente $s$ vogliamo costruire un albero dei cammini con il **minor numero di archi** verso ogni nodo. Assumiamo grafo connesso, bidirezionale e affidabile, con collegamenti senza peso oppure tutti dello stesso costo. Nel modello ideale sincrono, [[#Protocollo Shout|SHOUT]] scopre i nodi per livelli di distanza da $s$ e costruisce un albero BFS. Nel modello asincrono qui considerato occorre invece coordinare esplicitamente le esplorazioni dei livelli.
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
  Nella fase di esplorazione, ogni arco viene considerato una sola volta: passa un messaggio `explore` e una risposta, oppure due `explore` incrociati fra nodi dello stesso livello. Il totale è quindi **$2m$ messaggi**, come nelle slide; non bisogna contare una seconda esplorazione dello stesso arco.
  Sommando il tutto otteniamo:

  $$\begin{aligned}
                      2(n-1)d(G)+2m\leq 2(n-1)^2+2m\in O(n^2).
  \end{aligned}$$

  La scelta di $n-1$ come upper bound per $d(G)$ vale per ogni grafo connesso. Il conteggio fino a $r(s)$ iterazioni usa la terminazione quando non si scoprono nuovi nodi; se la radice esegue sempre $n-1$ iterazioni perché conosce $n$, il bound resta $O(n^2)$.

- Tempo di esecuzione: anche in questo caso, possiamo distinguere tre diversi costi per la generica iterazione $i$-esima. Explore e convergecast sono catene di $i - 1$ messaggi, mentre la ricerca è una catena di $2$ messaggi. Sommando il tutto troviamo $2 \cdot i$ messaggi consecutivi per ogni iterazione.
  Per tutte le iterazioni abbiamo:

  $$\begin{aligned}
                      \sum_{i = 1}^{r(s)} 2 \cdot i = 2 \cdot \frac{r(s) \cdot (r(s) + 1)}{2} = r(s) \cdot (r(s) + 1) \in O(r(s)^2) \in O(n^2)
  \end{aligned}$$

  Ancora una volta usiamo $n - 1 \in O(n)$ come upper bound per $r(s)$

### Algoritmo di Dijkstra

**Problema e modello.** Da una sorgente $s$ vogliamo costruire un albero dei cammini di **costo minimo** verso tutti i nodi di un grafo connesso, bidirezionale e affidabile. I pesi dei collegamenti sono positivi e noti ai loro estremi; a differenza di [[#Min-Hop routing|Min-Hop]], possono essere diversi. La radice coordina iterazioni distribuite tramite flooding e convergecast sull'albero parziale.
Nella versione classica dell'algoritmo di Dijkstra, ad ogni iterazione alcuni nodi fanno parte dell'albero di copertura dei cammini minimi ed altri no. Collegamenti in uscita dai primi li connettono con i secondi, generando una vera e propria "zona di confine". Ad ogni iterazione viene aggiunto all'albero di copertura dei cammini minimi (SPST) il nodo che ancora non ne fa parte verso il quale la distanza da $s$ è minima.

![[assets/Screenshot 2024-11-12 095921.png|1000]]

**Inizializzazione.** La sorgente è la radice dell'albero parziale, con distanza $\Delta(s)=0$; gli altri nodi sono inizialmente esterni all'albero. Ciascun nodo distingue localmente i collegamenti ancora *outgoing*, cioè diretti a un nodo non ancora inserito. La figura riassume gli stati e i messaggi iniziali.

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
Per tutte le sorgenti, Dijkstra distribuito usa $O(n^3)$ messaggi, mentre il conteggio per elementi delle slide dà $O(mn)$ per Gossiping e $O(n^2m)$ per Iterating. Nel caso denso $m=\Theta(n^2)$, il bound di Gossiping ha anch'esso ordine $O(n^3)$, ma **misura elementi trasmessi**, non necessariamente invii di messaggi; nel caso sparso $m=\Theta(n)$ scende a $O(n^2)$ elementi. Il vantaggio di memoria di Dijkstra è che non richiede a ogni nodo di conservare la mappa completa della rete.
L'algoritmo di Dijkstra distribuito è, in qualche modo, più semplice della versione sequenziale, perché non dobbiamo attingere ad una struttura dati aggiuntiva come la coda con priorità.

## 5 Errori e fallimenti

### Introduzione

I protocolli senza guasti assumono che nodi e collegamenti seguano le regole previste e che i messaggi arrivino integri in tempo finito. Qui studiamo come cambiano problema, possibilità e costo quando nodi o collegamenti possono fallire. La distinzione tra assiomi del modello e restrizioni di affidabilità è in [[#Assiomi]] e [[#Restrizioni]].
Esistono diverse classificazioni per i fallimenti:

![[assets/Screenshot 2024-11-12 121215.png|600]]

Solitamente si impongono restrizioni sul tipo di fallimento, per restringere il campo verso certi casi d'uso. Non è possibile progettare protocolli resistenti ad un numero arbitrario di fallimenti. Esistono poi protocolli che sono in grado di resistere fino ad un certo numero di fallimenti dello stesso tipo. Determinare tale numero è a carico di chi li definisce.

### Tipi di fallimenti

Le slide distinguono prima **quale componente** può fallire: solo nodi (*entity failure*), solo collegamenti (*link failure*) oppure entrambi (*hybrid failure*). Nel modello considerato qui un componente, una volta guasto, rimane tale. La gravità del comportamento dipende poi dal tipo di guasto:

- **Nodi:** con un *crash* il nodo si ferma definitivamente; con un'omissione può non inviare o non ricevere alcuni messaggi; con un guasto *bizantino* può compiere azioni arbitrarie, anche incoerenti con il protocollo.

  ![[assets/Screenshot 2024-11-12 121453.png|600]]

- **Collegamenti:** un'omissione perde un messaggio inviato; un'aggiunta consegna un messaggio mai inviato; una corruzione altera il messaggio durante la consegna. Aggiunta e corruzione sono comportamenti bizantini del collegamento nella classificazione delle slide.

  ![[assets/Screenshot 2024-11-12 121505.png|600]]

- **Entrambi:** il modello ibrido ammette guasti sia dei nodi sia dei collegamenti. Ogni protocollo successivo specifica quali di questi eventi sono ammessi.

[[teacher_slides/2_distributed algorithms.pdf#page=358|Slide della docente, p. 358]]
[[teacher_slides/2_distributed algorithms.pdf#page=359|Slide della docente, p. 359]]
[[teacher_slides/2_distributed algorithms.pdf#page=360|Slide della docente, p. 360]]

### Fault-tolerance e topologie di rete

La definizione di un protocollo fault-tolerant dipende in maniera preponderante dalla topologia del sistema. Si può disconnettere un grafo rimuovendo nodi o collegamenti.

![[assets/Screenshot 2024-11-12 121743.png|600]]

Se $k$ nodi/collegamenti arbitrari possono crashare, è impossibile eseguire un flooding, a meno che la rete non sia $(k+1)$-node/edge-connected.

### Problema di Agreement/Consensus

**Obiettivo.** I nodi devono scegliere valori compatibili anche quando il modello ammette guasti. Nelle sezioni successive distinguiamo guasti di collegamento, crash dei nodi e comportamento bizantino, dichiarando per ciascuno quali nodi sono tenuti a decidere.

Ogni entità $x$ ha associato un valore $v(x)$, estratto da un insieme conosciuto di valori. Alla fine del protocollo, almeno $p$ entità devono accordarsi su di uno stesso valore $d(x)$, anch'esso appartenente all'insieme.
La risoluzione del problema è tipicamente vincolata dalla "non-trivialità": se tutte le entità hanno inizialmente associato lo stesso valore, la decisione deve convergere verso di esso.
Per un accordo tra $p$ entità si parla di "$p$-agreement", mentre quando $p = n$ si parla di "consenso".

### 5.1 Consensus problem con fallimenti sui collegamenti

#### Introduzione

**Problema e modello.** Ogni nodo propone un valore; tutti i nodi, che qui non falliscono, devono terminare e decidere lo stesso valore. Possono invece perdersi messaggi a causa di fallimenti dei collegamenti. Per la definizione generale di accordo e non-trivialità si veda [[#Problema di Agreement/Consensus]]. Richiediamo:

- Agreement: le entità devono decidere tutte lo stesso valore

- Non-trivialità

- Terminazione: tutte le entità alla fine decidono

#### Il problema dei due generali

Due generali, ciascuno a capo di un esercito, devono coordinare un attacco contro il nemico. I due eserciti sono posizionati su colline opposte e possono comunicare solo inviandosi messaggi tramite un messaggero appiedato, che deve attraversare la valle. Essendo la valle controllata dal nemico, c'è il rischio che i messaggeri vengano intercettati e non raggiungano l'altro generale.
Entrambi i generali sanno che per vincere la battaglia devono attaccare contemporaneamente, quindi è fondamentale la loro coordinazione. Il problema nasce dal fatto che, anche se uno dei generali invia un messaggio per confermare l'attacco, non può essere certo che l'altro generale abbia ricevuto il messaggio, e viceversa. Potrebbero continuare a inviarsi messaggi di conferma indefinitamente, però rimane sempre l'incertezza che l'ultimo messaggio non sia stato ricevuto dall'altro generale.
Il problema dei due generali dimostra che in un sistema con un canale di comunicazione inaffidabile non sia possibile garantire un consenso certo.

![[assets/0_elHKtsxKn5VMl8cZ.jpg|500]]

#### Impossibilità nel problema dei due generali

Il problema dei due generali non si può risolvere, nemmeno se il sistema è completamente sincrono.

##### Lemma necessario

In ogni esecuzione di ogni protocollo in cui i due generali decidono di attaccare, almeno un messaggio deve essere consegnato. Altrimenti, l'altro generale è incapace di stabilire se il primo ha deciso di non attaccare o se il messaggio è andato perso.

##### Dimostrazione

Dimostriamo per assurdo il teorema. Supponiamo che un protocollo risolva il problema e scegliamo, fra le esecuzioni in cui entrambi attaccano, una esecuzione $E$ con il **numero minimo $k\geq1$ di messaggi consegnati**. Costruiamo $E'$ identica fino all'ultimo invio, ma in cui l'ultimo messaggio e ogni eventuale messaggio successivo vengono persi.

![[assets/Screenshot 2024-11-13 091232.png|800]]

Per il **mittente dell'ultimo messaggio** le due esecuzioni sono indistinguibili: non può sapere se quel messaggio è stato consegnato, quindi decide di attaccare anche in $E'$. Se il protocollo fosse corretto, anche l'altro generale dovrebbe attaccare in $E'$. Ma in $E'$ sono stati **consegnati** solo $k-1$ messaggi. Dividiamo i casi:

- Se $k-1>0$, contraddiciamo la minimalità di $k$ messaggi consegnati

- Se $k-1=0$, contraddiciamo il lemma: nessun messaggio viene consegnato

La possibilità del fallimento dell'unico collegamento tra i due generali, non l'effettivo fallimento di esso, è il fattore chiave che ci dà l'insolubilità del problema.

#### Connettività necessaria con guasti sui collegamenti

Se $F > 0$ collegamenti possono fallire, il consenso non si può raggiungere se il sistema non è $(F + 1)$-connesso, anche nelle condizioni di sincronicità. Qui la connettività è **per archi**: dopo la rimozione di fino a $F$ collegamenti, i nodi devono poter ancora comunicare. Senza questa condizione, un guasto può separare due gruppi che non riescono a coordinare le decisioni.
In un sistema con le proprietà appena descritte si può fare flooding, perché la rete non può essere disconnessa. Usando il flooding, ciascun nodo può diffondere il proprio valore, calcolare il valore di convergenza come funzione di quelli ricevuti e trovare l'agreement con gli altri. Diventa quindi possibile raggiungere il consenso.

#### Flooding in grafi completi con fallimenti nei collegamenti

**Problema e modello.** Un nodo $x$ deve diffondere un'informazione $I$ a tutti gli altri in un grafo completo con $n$ nodi, mentre al più $F<n-1$ collegamenti possono fallire; $x$ conosce $F$. I nodi non falliscono. Senza guasti, il *simple broadcast* di [[#Topologie particolari e raccordo]] richiede $n-1$ invii diretti. Qui si usano più possibili intermediari per tollerare i collegamenti guasti.
Il protocollo si articola in due fasi:

- Nella prima $x$ invia il messaggio $I$ a $F + 1$ vicini

- Ogni nodo che riceve il messaggio da $x$ lo inoltra a tutti i propri vicini, eccetto $x$

![[assets/Screenshot 2024-11-13 093705.png|800]]

Siccome ci sono al massimo $F$ collegamenti faulty (cioè soggetti a fallimento), la somma dei collegamenti faulty per i due step è appunto al più $F$: $f_1 (x) + f_2 (x) \leq F$.
Al primo step, imporre l'invio a $F + 1$ vicini fa sì che almeno uno di questi venga raggiunto, anche nel caso peggiore in cui $F$ vicini di $x$ siano faulty. Al secondo step, ogni generica entità $y$ viene raggiunta da almeno un messaggio, perché:

$$\begin{aligned}
                    F + 1 - \underbrace{(f_1 (x) + f_2 (x))}_{\leq F} \geq 1
\end{aligned}$$

I collegamenti guasti incontrati nei due passi sono in totale al più $F$: fra gli $F+1$ possibili intermediari ne resta quindi almeno uno che raggiunge $y$.

- Messaggi inviati: $(F + 1)$ al primo step e $(F + 1) \cdot (n - 2)$ al secondo (a prescindere dal fatto che i collegamenti siano faulty). In tutto:

  $$\begin{aligned}
                          (F+1)+(F+1)(n-2)=(F+1)(n-1)\in O((F+1)n)
  \end{aligned}$$

  Il costo asintotico dipende dal valore di $F$, che può determinare un oscillazione da $O(n)$ ad $O(n^2)$

### 5.2 Consensus problem con fallimenti sui nodi

#### Problema e modello con guasti dei nodi

Ogni nodo propone un valore; i nodi **non faulty** devono terminare, concordare un'unica decisione e rispettare la non-trivialità definita in [[#Problema di Agreement/Consensus]]. Qui i collegamenti non falliscono, mentre alcuni nodi possono smettere di partecipare (*crash*) o, nelle sezioni dedicate, comportarsi in modo bizantino. Il numero massimo di nodi guasti è indicato con $F$.

![[assets/Screenshot 2024-11-13 100304.png|600]]

#### Impossibilità deterministica asincrona

È impossibile ottenere il consenso con un protocollo deterministico in un sistema asincrono, anche nelle condizioni più favorevoli, cioè:

- Il fallimento è minimo: $F = 1$

- Il fallimento è il più facile da gestire: cioè nel caso di crash

- Il grafo è completo

Questo è il risultato FLP: nel modello asincrono non esiste un protocollo deterministico che garantisca contemporaneamente agreement, validità e terminazione del consenso anche con un solo possibile crash. Non implica l'impossibilità generale del software fault-tolerant: si può cambiare modello o garanzia, per esempio introducendo sincronia parziale, failure detector o randomizzazione.
Per dimostrare quanto abbiamo detto, consideriamo il seguente fatto: i ritardi di comunicazione sono finiti ma impredicibili. L'idea è che, quando un nodo attende un messaggio ed è possibile che vi siano stati dei crash, esso non può stabilire in alcun modo se il messaggio arriverà oppure no.
In un contesto pratico, una possibile soluzione è quella di impostare dei time-out (es. TCP).

#### Consensus in sistemi sincroni

**Problema e modello.** I nodi non faulty devono decidere lo stesso valore booleano e terminare nonostante al più $F$ crash; se tutti propongono lo stesso valore, devono decidere quello. La definizione generale è in [[#Problema di Agreement/Consensus]]. A differenza del modello dell'[[#Impossibilità deterministica asincrona|impossibilità asincrona]], qui i round sono sincroni. Assumiamo:

- Grafo completo

- Connettività forte

- Sincronicità

- Fallimenti di tipo crash

- Inizio simultaneo

- Conoscenza di $F$ da parte dei nodi

Assumiamo inoltre che $v(x)\in\{0,1\}$ per ogni entità $x$.
Con queste ipotesi possiamo definire protocolli che raggiungano il consenso tollerando al più $F<n$ crash.
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
                          n(F+1)(n-1)\in O(n^2(F+1))
  \end{aligned}$$

- Tempo di esecuzione: la catena di messaggi è singola per ogni iterazione, perciò abbiamo in totale:

  $$\begin{aligned}
                          F+1\in O(F+1)
  \end{aligned}$$

Alcune osservazioni:

- Il protocollo termina, banalmente perché ci sono $F + 1$ iterazioni

- Se un nodo non-faulty riceve uno 0 all'istante $t \leq F$, allora tutte le altre riceveranno uno 0 a $t + 1$. In particolare, tale entità sceglierà 0

- Se tutte le entità iniziano con 1, allora tutte le non-faulty convergeranno ad 1

Possiamo usare le osservazioni fatte per verificare i vincoli di:

- Non-trivialità: se tutte le entità inizialmente sono 0, il valore 0 si propaga nei round e tutte decideranno 0. Se tutte iniziano con 1, nessuna introduce uno 0 e tutte decideranno 1.

- Agreement: se almeno un'entità non faulty inizia con 0, tutte le altre decideranno 0; se tutte le entità iniziano con 1, tutte decideranno 1. Resta il caso in cui gli unici 0 iniziali appartengano a nodi che poi crashano: se uno 0 arriva a un nodo non faulty entro il round $F$, si propaga a tutti; altrimenti tutti i non faulty mantengono 1. La prova seguente esclude che uno 0 arrivi per la prima volta soltanto ad alcuni non faulty nell'ultimo round.

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

#### Consensus in sistemi asincroni

**Problema e modello.** Vogliamo consenso booleano fra i nodi non faulty con al più $F$ crash. L'[[#Impossibilità deterministica asincrona|impossibilità FLP]] esclude una garanzia deterministica di terminazione nel modello asincrono con un possibile crash; Ben-Or usa scelte casuali e garantisce terminazione quasi certa. Le restrizioni sono:

- Connettività forte

- Grafo completo

- Fallimenti di tipo crash

- Conoscenza di $n$ e $F$

Possiamo definire un protocollo (detto di Ben-Or) randomizzato che realizza il consenso tollerando al più $F < \frac{n}{2}$ crash.
Il protocollo lavora in rounds successivi. Ad ogni messaggio è associato il numero $r$ del round in cui esso è stato generato ed un valore nell'insieme $\{0, 1\}$. Le entità tengono traccia del round che stanno eseguendo ed in base al numero di round associato ai messaggi ricevuti reagiscono diversamente.

![[assets/Screenshot 2024-11-15 180257.png|500]]

Ogni round si articola in due passi: nel primo ogni entità propone il proprio valore alle altre e nel secondo, in base alle proposte ricevute, ogni entità sceglie il valore da proporre al round successivo.

![[assets/Screenshot 2024-11-15 180402.png|750]]

Nel primo passo, il broadcast conta anche il valore del mittente. Ogni entità attende $n-F$ messaggi `MyValue`. Se **più di $n/2$** messaggi contengono lo stesso valore, invia `Propose` con quel valore; altrimenti propone un valore indefinito. La soglia intera della maggioranza assoluta è $\lfloor n/2\rfloor+1$. I messaggi attesi bastano per poterla raggiungere, perché:

$$\begin{aligned}
                    F < \frac{n}{2} \Rightarrow n - F > \frac{n}{2}
\end{aligned}$$

Nel secondo passo, tutte le entità si mettono in attesa di $n - F$ messaggi di $Propose$. Quando viene ricevuto almeno un valore non indefinito, l'entità $x$ lo imposta come proprio. Quando ci sono almeno $F + 1$ messaggi $Propose$ con lo stesso valore (non indefinito), $x$ decide per tale valore. Se tutti i valori di $Propose$ sono indefiniti, il prossimo valore di $x$ è determinato casualmente, con probabilità uniforme.
$F+1$ messaggi possono essere ricevuti fra gli $n-F$ attesi, perché $n\geq2F+1$:

$$\begin{aligned}
                    F<\frac n2\quad\Longrightarrow\quad F+1\leq n-F.
\end{aligned}$$

![[assets/Screenshot 2024-11-15 181853.png|1000]]

Ora verifichiamo le proprietà del protocollo:

- Non-trivialità: se tutti i nodi partono con il valore $v \in \{0, 1\}$, il primo step si conclude con la proposta di $v$ per ognuno di essi.
  Al secondo step i messaggi $Propose$ (tutti identici) saranno $n - F$, quindi più della soglia di $F + 1$ imposta sulla decisione. $v$ verrà infine deciso all'unanimità.

  ![[assets/Screenshot 2024-11-15 183550.png|600]]

  Possiamo generalizzare il fatto che, al generico round $r$, se un'entità vede una maggioranza assoluta di valori, devono vederla anche tutte le altre. Non è infatti possibile che le maggioranze siano due: questo implicherebbe un numero di nodi maggiore di $n$. Ne deduciamo che, quando verranno inviati i messaggi di $Propose$ alla fine del primo step, questi porteranno tutti lo stesso valore $v$

- Agreement: se un nodo non faulty $x$ decide $v$, ha ricevuto almeno $F+1$ messaggi `Propose(v)`. Il gruppo che li ha inviati interseca qualunque insieme di $n-F$ mittenti da cui un altro nodo non faulty attende i messaggi: $(F+1)+(n-F)>n$. Poiché i guasti sono crash e i mittenti non inviano valori diversi a destinatari diversi, anche ogni altro nodo vede almeno un `Propose(v)` e adotta $v$. Al round successivo i nodi non faulty inviano quindi $v$ e decidono lo stesso valore.

  ![[assets/Screenshot 2024-11-15 185935.png|1000]]

- Terminazione: ogni nodo non faulty decide **quasi certamente**, e il numero **atteso** di round è $O(2^n)$; non c'è un bound deterministico sul numero di round.
  Per quanto abbiamo visto finora, essenzialmente il protocollo termina al round successivo quando c'è un numero di $MyValue$ uguali sufficientemente alto (cioè la maggioranza assoluta). Quando ciò non accade, è possibile che il protocollo non termini al round successivo. Ogni entità sceglierà il proprio valore al round successivo in base ai messaggi $Propose$ ricevuti oppure casualmente.
  La probabilità $p$ che al passo successivo si abbia una maggioranza è più alta di quella $q$ che tutte le entità scelgano casualmente lo stesso valore, che la limita dal basso.

  $$\begin{aligned}
                          p \geq q = \frac{1}{2^n}
  \end{aligned}$$

  Se la probabilità di successo fosse esattamente la stessa $p$ a ogni round indipendente, il numero di round seguirebbe una distribuzione geometrica:

  $$\begin{aligned}
                          P(r) = p \cdot (1 - p)^{r - 1}
  \end{aligned}$$

  In pratica si tratta del prodotto tra la probabilità di $r - 1$ insuccessi e quella di un successo.
  L'expected value di una distribuzione geometrica è:

  $$\begin{aligned}
                          \mathbb{E} (X) = \frac{1}{p}
  \end{aligned}$$

  Qui basta il limite inferiore **condizionato alla storia precedente**: il tempo di decisione $T$ è dominato da una geometrica con parametro $2^{-n}$, quindi:

  $$\begin{aligned}
                          p\geq 2^{-n}\quad\Longrightarrow\quad \mathbb{E}[T]\leq 2^n.
  \end{aligned}$$

Le slide citano inoltre una variante che tollera fino a circa $n/3$ crash e termina in un numero **atteso** di round costante; non ne sviluppano qui il protocollo.

#### Consensus deterministico con fallimenti bizantini

> **Status d'esame da confermare.** Le slide ufficiali disponibili trattano integralmente questa parte, mentre gli appunti precedenti la indicavano come facoltativa. Viene quindi mantenuta come approfondimento verificato.

**Problema e modello.** I nodi non faulty devono raggiungere consenso su un valore booleano anche se fino a $F$ nodi possono inviare messaggi arbitrari o incoerenti (*guasti bizantini*). L'[[#Impossibilità deterministica asincrona|impossibilità deterministica asincrona]] con un crash vale a maggior ragione in presenza di guasti bizantini. Qui il sistema è **sincrono e completo**; si assume $F<n/3$, avvio simultaneo, identificativi distinti non falsificabili e conoscenza degli identificativi dei vicini.

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

#### Consensus problem con fallimenti bizantini

**Problema e modello.** Questa è la versione randomizzata del consenso booleano con fallimenti bizantini: i nodi non faulty devono concordare e terminare quasi certamente, mentre un nodo guasto può inviare valori diversi a destinatari diversi. La versione [[#Consensus deterministico con fallimenti bizantini|deterministica]] usa un modello sincrono completo e tollera $F<n/3$; qui la soglia e il protocollo sono diversi. Il suo status d'esame resta da confermare.
Imponiamo le seguenti restrizioni:

- Grafo completo

- Connettività forte

- Fallimenti bizantini

- Identificativi unici; i valori proposti, distinti dagli identificativi, appartengono a $\{0,1\}$

La dinamica del protocollo è simile alla versione di Consensus con fallimenti sui nodi (seppur in qualche misura sia più semplice, poiché mira a raggiungere un risultato più debole). Il protocollo tollera al più $F < \frac{n}{9}$ fallimenti bizantini.

![[assets/Screenshot 2024-11-20 092309.png|800]]

Al primo round ciascuna entità fa un broadcast del proprio valore con un messaggio $Propose$ e si mette in attesa di $n - F$ messaggi $Propose$. Se almeno $n - 2 \cdot F$ di essi contengono lo stesso valore, allora l'entità lo imposta come suo e decide. Altrimenti, se almeno $n - 4 \cdot F$ messaggi $Propose$ contengono lo stesso valore, lo imposta semplicemente come suo. Se vengono ricevuti meno di $n - 4 \cdot F$ messaggi $Propose$ con lo stesso valore, viene effettuata una scelta casuale con probabilità uniforme. Il tutto è ripetuto ciclicamente fino al raggiungimento del consenso.
Verifichiamo separatamente non-trivialità, agreement e terminazione quasi certa per questo protocollo:

- Non-triviality: tutte le entità iniziano con lo stesso valore $v \in \{0, 1\}$. Tutte le entità non faulty propongono il proprio valore $v$ al primo round e ricevono almeno $n - F \geq n - 2 \cdot F$ proposte per $v$. Siccome, appunto, i messaggi contenenti $v$ sono più di $n - 2 \cdot F$, tutte le entità non faulty finiscono per decidere $v$

- Agreement: al generico round $r$ un'entità non faulty $x$ decide per il valore $v \in \{0, 1\}$. Ciò significa che ha ricevuto $n - F$ messaggi $Propose$, di cui almeno $n - 2 \cdot F$ contenevano $v$.
  Allo stesso round $r$, un'altra entità non faulty $y \neq x$ attende $n - F$ messaggi. Alcuni mittenti dei messaggi verso $x$ e verso $y$ sono comuni, ma ce ne possono essere al più $F$ diversi per le regole base dell'insiemistica. Inoltre, al più $F$ dei mittenti comuni possono essere bizantini, cioè aver inviato valori diversi ad $x$ e $y$.
  Se togliamo due volte $F$ (cioè gli $F$ potenziali nodi non in comune tra $x$ ed $y$ e gli $F$ potenziali nodi bizantini) agli $n - 2 \cdot F$ valori necessari alla decisione, troviamo:

  $$\begin{aligned}
                      n - 2 \cdot F - 2 \cdot F = n - 4 \cdot F
  \end{aligned}$$

  Questo è il numero minimo complessivo di messaggi $Propose$ giunti a $y$ che contengono $v$.
  A questo punto, $x$ ha deciso $v$ ed $y$ ha assunto $v$ (perché, come abbiamo detto, almeno $n - 4 \cdot F$ messaggi lo contenevano). Al round $r + 1$ tutte le entità riceveranno almeno $n - F \geq n - 2 \cdot F$ messaggi $Propose$ contenenti $v$ da parte delle entità non faulty e decideranno unanimemente per esso

- Terminazione: le entità non faulty decidono quasi certamente in un numero **atteso di round** $O(2^n)$; i round non hanno un massimo deterministico.
  Osserviamo per prima cosa che al round $r$, tutti i messaggi $Propose$ mandati da entità non faulty con scelta non-casuale portano lo stesso valore $v$.
  Se al round $r$ un'entità non faulty $x$ ha scelto $v \in \{0, 1\}$ in modo non-casuale, significa che ha ricevuto almeno $n - 4 \cdot F$ proposte per $v$, delle quali $n - 5 \cdot F$ da entità non faulty.
  Allo stesso tempo, supponiamo che un'altra entità non faulty $y \neq x$ scelga $v^\prime \neq v$ in modo non-casuale. Seguendo lo stesso ragionamento che per $x$, anche $y$ deve avere ricevuto $n - 5 \cdot F$ proposte per $v^\prime$. Secondo queste supposizioni però, il numero di entità sarebbe pari a:

  $$\begin{aligned}
                      n \geq \underbrace{2 \cdot (n - 5 \cdot F)}_{non faulty} + \underbrace{F}_{faulty} = 2 \cdot n - 9 \cdot F = n + (n - 9 \cdot F) > n
  \end{aligned}$$

  La catena di uguaglianze e disuguaglianze è chiaramente impossibile, percui vale l'assunto.
  L'argomento di agreement in questa sezione mostra che, quando un'entità non faulty decide, le altre adottano il suo valore e decidono al round successivo. Per decidere occorrono $n-2F$ proposte per uno stesso valore $v$: i nodi non faulty che scelgono senza estrazione casuale non possono scegliere valori opposti, come mostra il conteggio $2(n-5F)+F>n$ qui sopra; i restanti nodi devono estrarre casualmente $v$.
  La probabilità che tutte le entità non faulty che estraggono casualmente scelgano uno stesso valore prefissato $v$ è **almeno** $2^{-n}$. Questo dà un limite inferiore alla probabilità condizionata di convergenza per round; come nel caso dei crash, il tempo di decisione è dominato da una geometrica con parametro $2^{-n}$ e ha valore atteso $O(2^n)$.

Le slide citano anche una variante per $F<n/500$ fallimenti bizantini con $O(n^{2.5})$ round **attesi**, senza svilupparla qui.

## 6 Strutture dati distribuite

### Introduzione

Una struttura dati distribuita colloca dati su più nodi e deve restare utilizzabile quando cambia il numero dei partecipanti. Qui l'operazione centrale è la ricerca di una chiave: partiamo dalle hash table e dalle reti peer-to-peer, poi studiamo come Chord organizza chiavi e nodi in un anello logico.

### Hash tables

Sono strutture dati che memorizzano i dati sotto la forma di coppie $(key, value)$. Una apposita funzione di hash mappa ogni chiave su un indice, o bucket, di un vettore; il valore associato alla chiave viene memorizzato nel bucket corrispondente. Presso ogni casella può essere posta una lista di trabocco che raccoglie più coppie in caso di collisione.

![[assets/Screenshot 2024-11-20 101146.png|600]]

La funzione di hash deve distribuire il più uniformemente possibile le chiavi sui differenti bucket.
In un contesto distribuito, le coppie $(key, value)$ sono dislocate su un insieme di nodi. Bisogna tenere ben presente che il numero di tali nodi non è noto e può variare dinamicamente.

### Gli inizi

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

### Chord

**Problema e modello.** Chord organizza la dislocazione e la ricerca delle coppie chiave-valore di una [[#Hash tables|hash table distribuita]] in una rete *overlay*: i vicini logici possono non essere vicini nella rete fisica. Nodi e chiavi ricevono identificativi tramite hash e sono ordinati su un anello logico. Lo spazio degli identificativi va da 0 a $2^m-1$, dove qui $m$ è il **numero di bit degli ID**; la notazione $m=|E|$ per i grafi non è usata in questa sezione. Le garanzie di lookup descritte sotto assumono puntatori aggiornati e assenza di guasti, salvo quando sono specificate procedure di recupero.

#### Lookup con il successore

Nella versione di base, per effettuare un lookup basta che ogni nodo conosca il proprio **successore** sull'anello, cioè il primo nodo successivo in ordine circolare di identificativo. Il mapping delle chiavi usa lo stesso spazio degli identificativi: la chiave $k$ è assegnata al primo nodo con ID almeno $k$ percorrendo l'anello, con ritorno a zero quando necessario.

![[assets/Screenshot 2024-11-26 111716.png|800]]

Nella presentazione originale di Chord, SHA-1 produce identificativi di $m=160$ bit per nodi e chiavi. Quando un nodo riceve una richiesta di lookup, se è responsabile della chiave può rispondere; altrimenti inoltra la richiesta al successore.

![[assets/Screenshot 2024-11-26 112149.png|400]]

In questo modo, il protocollo può richiedere l'attraversamento dell'intero anello nel caso peggiore: la catena contiene al più $n$ nodi presenti, quindi usa $O(n)$ hop. Il valore $2^m$ è la dimensione dello spazio degli identificativi, non il numero di nodi effettivamente attraversati. In assenza di guasti e con puntatori ai successori corretti, il lookup raggiunge sempre il nodo responsabile.
#### Finger table e lookup accelerato

Con il solo puntatore al successore, [[#Lookup con il successore|il lookup]] può attraversare fino a $n$ nodi. Per ridurre gli hop, ogni nodo tiene una **finger table** con informazioni su dove trovare chiavi con ID più grandi. Le entry sono tante quanti i bit degli identificativi: per $j=1,\ldots,m$, l'entry $j$ punta al successore di $(i+2^{j-1})\bmod 2^m$. Gli offset sono quindi $1,2,4,\ldots,2^{m-1}$; a ogni posizione è associato il nodo responsabile di quell'intervallo.

![[assets/Screenshot 2024-11-26 112658.png|400]]

In fase di look-up della fingertable, il nodo che riceve la richiesta può tentare di contattare direttamente il nodo che ne è in possesso sulla base alle proprie informazioni. L'unica accortezza alla ci si deve attenere è quella di inviare la richiesta al nodo con identificativo immediatamente inferiore a quello della richiesta. In questo modo non è possibile in alcun modo saltare il nodo che ne sia in possesso.

![[assets/Screenshot 2024-11-26 112958.png|400]]

In media, il numero di nodi da contattare è $log (n)$. Ogni hop teoricamente dovrebbe dimezzare la distanza dal nodo desiderato.
#### Join e stabilizzazione

Quando un nodo si aggiunge all'anello, cambiano la responsabilità per alcune chiavi e le informazioni di instradamento. Oltre al successore, per gestire questa operazione ogni nodo mantiene il proprio **predecessore**, cioè il nodo immediatamente precedente nell'ordine circolare.
L'inserimento di un nuovo nodo nell'anello attraversa le seguenti fasi:

- Inizializzazione del nuovo nodo (predecessore/successore e fingertable)

- Aggiornamento di predecessore/successore e fingertable dei nodi esistenti

- Trasferimento delle chiavi assegnate al nuovo nodo

La procedura che aggiorna esplicitamente le finger table ha costo **medio** $O(\log^2 n)$ secondo le slide. Una soluzione più semplice usa la **stabilizzazione periodica**: aggiornamenti e lookup possono essere intercalati nel tempo, senza attendere che tutte le finger table siano aggiornate. In questa fase la correttezza del lookup richiede che i puntatori ai successori siano corretti e che si controlli il successore prima di usare una finger entry potenzialmente vecchia; la ricerca può risultare più lenta.

![[assets/Screenshot 2024-11-26 114109.png|350]]

A cadenza regolare ogni nodo $A$ esegue `stabilize` interrogando il proprio successore corrente $B$ sul predecessore di $B$, diciamo $B'$. Se $B'$ appartiene all'intervallo circolare aperto $(A,B)$, allora $A$ aggiorna il proprio successore a $B'$. Infine $A$ notifica la propria esistenza al successore scelto; quest'ultimo aggiorna il proprio predecessore ad $A$ soltanto se $A$ è più vicino del predecessore già noto. Il valore restituito da $B$ è quindi il predecessore di $B$, non l'identificativo che $A$ dovrebbe aspettarsi di ricevere.

![[assets/Screenshot 2024-11-26 114626.png|1000]]

Per aggiungersi all'anello, un nuovo nodo deve conoscere almeno un nodo già presente. Il suo successore gli trasferisce le chiavi di cui diventa responsabile; solo dopo il trasferimento elimina la copia precedente, secondo la politica di replica adottata. Durante l'aggiornamento delle finger table, il nuovo nodo può chiedere al successore di risolvere le entry mancanti e i lookup possono ripiegare sui puntatori ai successori. I nodi aggiornano periodicamente le proprie finger table, scegliendo una riga alla volta.
Un nodo può uscire dall'anello principalmente in due casi: fallimento e non.

![[assets/Screenshot 2024-11-26 120047.png|600]]

### Chord: leave, failure e replicazione

**Problema e modello.** In Chord, una chiave è assegnata al primo nodo con ID almeno pari alla chiave nell'anello logico; [[#Chord|lookup, finger table e stabilizzazione]] mantengono raggiungibile il responsabile quando i puntatori sono corretti. Qui consideriamo la perdita di un partecipante: l'uscita può essere **pulita** oppure dovuta a un **fallimento** improvviso. La replica dei valori è distinta dalla sola continuità dell'instradamento.

**Leave pulita.** Un nodo $x$ che può cooperare prima di uscire:

1. trasferisce al proprio successore tutte le chiavi di cui è responsabile;
2. comunica al predecessore il nuovo successore;
3. comunica al successore il nuovo predecessore.

I puntatori immediati restano così connessi; le finger table che contengono $x$ possono essere corrette gradualmente dai normali aggiornamenti periodici.

**Fallimento.** Un nodo guasto non può migrare chiavi né inviare notifiche. Per non dipendere da un solo puntatore, ogni nodo mantiene una **successor list** contenente i primi $r$ successori sull'anello. Se il successore non risponde, viene sostituito con la prima entry viva della lista e `stabilize` ricostruisce progressivamente i puntatori. Se durante un lookup non risponde una finger entry, si prova una finger precedente, cioè un'alternativa che non oltrepassi la chiave; per indici bassi si ricorre anche alla successor list. Il routing può continuare, eventualmente con più hop, **se resta raggiungibile almeno un successore vivo e l'anello non si è partizionato**.

La continuità del routing non recupera automaticamente i dati memorizzati soltanto sul nodo guasto. Come estensione per tollerare la perdita di nodi, un'applicazione può replicare ogni coppia chiave-valore sui primi $r$ successori del nodo responsabile. Dopo un fallimento, il primo successore vivo diventa responsabile e le repliche vengono ricostituite. L'aumento di $r$ migliora la tolleranza ai guasti consecutivi, al costo di più memoria e traffico di aggiornamento.

In condizioni stabili la finger table permette lookup attesi in $O(\log n)$ hop; successor list e fallback aiutano a mantenere raggiungibile il nodo responsabile durante la stabilizzazione, mentre la replica è il meccanismo separato che preserva i valori.

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

**Riferimento per questo approfondimento:** Cormen, *Introduction to Algorithms*, cap. 4, teorema 4.1 (p. 94 del libro; p. 115 del PDF presente in `teacher_slides/based_by/`). La ricorrenza e il caso Merge Sort sono trattati nello stesso capitolo.

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
