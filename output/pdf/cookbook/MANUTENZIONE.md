# Come modificare il cookbook

Guida per un agente che riprende il lavoro. Descrive la prima versione completa del 30 settembre 2026: **16 pagine A4 orizzontali**, 7 algoritmi sequenziali e 23 protocolli distribuiti, con le rispettive varianti.

**Percorso più breve:** trova la pagina in [coverage.md](coverage.md), individua il riquadro in [source/generate.py](source/generate.py), verifica la modifica sulle fonti, modifica il sorgente, rigenera e ispeziona le pagine interessate. Poi aggiorna copertura, verifica e archivio ZIP.

## 1. Approccio didattico e fonti

Il cookbook è una sintesi autonoma per il ripasso: ogni famiglia di problemi mette a confronto specifica, ipotesi, strategia, passaggio decisivo della prova e costo. I riquadri hanno dimensioni diverse secondo il contenuto. Le prove che richiedono spazio non sono state ridotte a una sola formula; l'utente ha autorizzato più pagine del limite iniziale di dieci.

Prima di intervenire, leggere `AGENTS.md` e `style.md` nella radice della repository. Per la parte da modificare:

1. Consultare la sezione completa di `Algoritmi Distribuiti.md` e le sezioni collegate.
2. Controllare le decisioni già verificate in `archived/ROADMAP.md` e `archived/REVISIONE-SEMANTICA-ESITO.md`.
3. Verificare modello, terminologia e risultati nelle slide della docente. Cercare nei bundle sotto `teacher_slides/knowledge_parsed/`, poi leggere le pagine pertinenti. Usare `rg --no-ignore` o percorsi espliciti: il corpus è ignorato da Git.
4. Per formule, figure o simboli dubbi, aprire la pagina originale del PDF. L'estrazione testuale può perdere indici e disuguaglianze.
5. Consultare figure e annotazioni di `Algoritmi_Distribuiti_originale.pdf` per le spiegazioni dirette; usare i libri locali quando serve chiarire un punto tecnico.

Le slide fissano il modello del corso; le correzioni documentate ne precisano refusi e ipotesi implicite. Non ricopiare un refuso già risolto. Le pagine delle fonti in `coverage.md` sono **pagine fisiche dei PDF, a partire da 1**. Le sigle I/C/D/A e Mxx/Cxx/Bxx sono definite lì.

Preservare in ogni sintesi:

- input/output o specifica; topologia, sincronia, guasti, iniziatori e conoscenze necessari;
- distinzione fra invii, bit, record, round, hop overlay e tempo ideale/fisico;
- ipotesi del bound, caso peggiore/atteso, notifica e rilevazione della terminazione quando pertinenti;
- verso delle riduzioni e passaggio che trasferisce la difficoltà;
- etichette facoltativo, non d'esame o status da confermare.

I dubbi residui sono registrati in `coverage.md`: status d'esame del deterministico bizantino, estensioni dei guasti di link, concorrenza/partizioni in Chord e portata dei bound del consenso randomizzato. Non eliminarli senza nuove evidenze. Una modifica al cookbook non autorizza automaticamente una modifica al riassunto canonico o alle fonti.

## 2. File e responsabilità

| File | Ruolo |
| --- | --- |
| `source/generate.py` | Sorgente di contenuti, composizione e disegno. Genera tutte le pagine. |
| `pagina-NN.svg` | Output vettoriale modificabile, con testo nativo e font incorporati. |
| `cookbook-algoritmi-distribuiti.pdf` | PDF unico, con un segnalibro per pagina. |
| `fonts/` e `font-license.txt` | Font DejaVu Sans Condensed regular/bold e licenza. |
| `coverage.md` | Checklist completa, fonti, status e dubbi. Va aggiornato manualmente. |
| `source/layout-check.json` | Rapporto geometrico scritto dal generatore a ogni esecuzione riuscita. |
| `source/verification.json` | Fotografia dei controlli finali, con hash. **Non** viene aggiornata dal generatore. |
| `svg-modificabili.zip` | Pacchetto di consegna. **Non** viene aggiornato dal generatore. |

Per una modifica destinata a restare, intervenire nel sorgente comune. Una modifica manuale al solo SVG verrebbe sovrascritta e lascerebbe il PDF diverso. Se l'utente ha già modificato uno SVG, conservarne una copia e riportare le modifiche pertinenti nel generatore prima di rigenerare.

## 3. Dove intervenire nel generatore

Il file ha tre parti: motore di disegno, contenuti iniziali e composizione finale. **I numeri delle prime chiamate `page(...)` non sono i numeri della consegna attuale.** Sono una struttura iniziale in dieci gruppi, successivamente ricomposta in sedici pagine.

### Contenuti: `sec`, `p`, `formula`, `diagram`

Un riquadro viene definito così:

```python
sec('Titolo del riquadro',
    p('Specifica', 'Input → output; ipotesi necessarie.'),
    p('Passi', 'Strategia in pochi passi.'),
    p('Prova', 'Invariante o passaggio decisivo.'),
    formula('M = O(n log n)'),
    p('Costo', 'Che cosa si conta e in quale modello.'),
    tag='FACOLTATIVO')
```

- `p(etichetta, testo)` gestisce colore, ritorni a capo e altezza del paragrafo. Usare le etichette già presenti in `COLORS`.
- `formula(testo)` produce una riga centrata. È **testo Unicode, non LaTeX**: `\\frac` o `$...$` non vengono interpretati. Per formule lunghe usare più righe esplicite e controllare che la separazione non cambi il significato.
- `diagram(tipo, ...)` richiama un disegno vettoriale in `draw_diag`.
- `tag` è l'avviso rosso sotto il titolo. Se non serve, ometterlo.

### Composizione: `S`, `OLD`, `pick` e `new`

Cercare il commento **`# Impaginazione finale`**:

- `S` associa il titolo di ogni riquadro iniziale al suo oggetto.
- `OLD` conserva i dieci gruppi iniziali.
- `PAGES` viene azzerato; le chiamate `new(...)` costruiscono le sedici pagine finali, nell'ordine di stampa.
- `pick('Titolo', ...)` recupera i riquadri da `S`.
- Ogni lista interna di `cols` è una colonna; i riquadri vengono impilati dall'alto verso il basso. Due liste danno due colonne, tre liste tre colonne.

**Attenzione ai riferimenti condivisi:** `S`, `OLD` e `pick` non creano copie indipendenti dei riquadri. Una modifica successiva dell'oggetto cambia anche la pagina che lo usa. Inoltre, alcuni contenuti vengono sostituiti nella parte finale:

| Parte | Punto da controllare |
| --- | --- |
| SHOUT, p. 6 | Sostituzione del diagramma tramite `PAGES[-1]`, subito dopo la relativa `new`. |
| Ben-Or, p. 14 | `ben = S['FLP e Ben-Or con crash']` e sostituzione degli ultimi due blocchi con `[:-2]`. |
| Bizantino randomizzato, p. 14 | Nuova definizione `byz = sec(...)`; il vecchio riquadro iniziale non è quello pubblicato. |
| Chord, p. 16 | Sostituzioni di `S['Stabilize e refresh']['blocks']` e `S['Leave, failure e replica']['blocks']`. |

Cercare **tutte** le occorrenze del titolo prima di editarlo. Se lo rinomini, aggiornare anche le chiavi `S[...]` e le chiamate `pick(...)`. Se aggiungi blocchi a Ben-Or, ricontrollare lo slicing `[:-2]`. Per cambiare pagina o colonna, modificare la composizione finale, senza duplicare il contenuto.

Mappa attuale: 1 fondamenti; 2 TSP generale/B&B; 3 TSP metrico; 4 VC; 5 broadcast/wake-up; 6 spanning tree; 7 saturazione/All The Way; 8 LCR/HS; 9 FloodMax/YO-YO; 10 elezione sincrona; 11 Gossiping/Iterating; 12 Min-Hop/Dijkstra; 13 link failure/crash; 14 consenso randomizzato; 15 bizantino deterministico; 16 Chord.

## 4. Impaginazione e diagrammi

`Draw` emette le stesse primitive verso SVG e ReportLab: testo, linee, cerchi, riquadri e frecce. Questo mantiene coerenti i due formati senza convertire il testo in immagini o tracciati. Le coordinate del disegno hanno origine in alto a sinistra; il motore converte l'asse verticale per il PDF.

Valori attuali, in punti tipografici:

| Parametro | Valore |
| --- | --- |
| Pagina | 841,889764 × 595,275591 pt = 297 × 210 mm |
| Margini laterali / distanza fra colonne | 24 / 12 pt |
| Corpo / interlinea | `FS=10.15` / `LEAD=13.0` |
| Titolo pagina / titolo riquadro | 22 / 12,6 pt |
| Primo riquadro | y=82; aumenta se il sottotitolo va a capo |
| Fondo massimo dei riquadri / separatore footer | y=565 / y=568 |

Colori stabili: blu specifiche/ipotesi, arancio passi, verde prove, viola costi, rosso limiti/status; grigio note e fonti. Il colore accompagna sempre un'etichetta testuale.

Per un nuovo diagramma aggiungere il caso in `draw_diag` **e la sua altezza in `diag_height`**. Disegnare rispetto a `x, y, w`, perché lo stesso schema può essere usato in colonne di larghezza diversa. Le etichette dei diagrammi non vanno automaticamente a capo come i paragrafi.

Controlli visivi importanti emersi durante il lavoro:

- le frecce devono fermarsi sul bordo dei nodi, senza punte nascoste dal riempimento;
- le etichette «esplora/pota» devono stare sotto il ramo corretto;
- un disegno di quorum deve avere cardinalità e intersezione coerenti con i numeri della prova;
- i nodi vicini di Chord devono restare separati: le posizioni attuali sono dichiarate schematiche;
- nuovi pedici/apici e simboli devono esistere nel font, anche nella variante bold.

Se una pagina trabocca: eliminare ripetizioni, riequilibrare le colonne o spostare un riquadro su un'altra pagina. Evitare di ridurre globalmente il corpo per far entrare una singola aggiunta. Se cambia la numerazione, aggiornare tutti i rimandi e `coverage.md`.

## 5. Rigenerazione e controllo

I comandi seguenti partono dalla **radice della repository**. Occorrono Python con `reportlab`; per i controlli testuali anche `pypdf`; per il rendering `pdftoppm`. Usare il runtime disponibile nell'ambiente. Durante la prima versione è stato usato:

```sh
/Users/angelolongano/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3
```

Se `python3` ha le dipendenze necessarie:

```sh
python3 output/pdf/cookbook/source/generate.py
```

Questo rigenera **tutto il PDF e tutti gli SVG**, anche per una modifica locale. Gli errori su parole/formule troppo larghe, testo fuori riquadro o fondo pagina oltre il limite devono essere corretti. La scrittura non è atomica: un errore può lasciare output parziali; dopo la correzione rieseguire fino al completamento. Se diminuisce il numero di pagine, il generatore non cancella gli SVG eccedenti: identificarli ed escluderli dalla consegna.

Solo dopo una generazione riuscita, renderizzare. Esempio per la pagina 9:

```sh
mkdir -p /tmp/ad-cookbook-review
pdftoppm -f 9 -l 9 -r 130 -png \
  output/pdf/cookbook/cookbook-algoritmi-distribuiti.pdf \
  /tmp/ad-cookbook-review/cookbook
```

Aprire la PNG prodotta e controllare la pagina intera e i dettagli. Valutare la leggibilità alla dimensione fisica A4, non soltanto ingrandendo l'immagine. Con modifiche locali, ispezionare le pagine interessate; con cambi di font, motore, griglia o ordine, ispezionarle tutte. Rimuovere `-f` e `-l` per renderizzare l'intero PDF.

### Che cosa verificano gli strumenti, e che cosa resta da fare

Il generatore controlla larghezze e limiti geometrici del testo e scrive `layout-check.json`. **Non verifica la correttezza teorica, la copertura semantica, tutte le collisioni fra forme o l'ambiguità delle frecce.** Il rendering va sempre ispezionato.

Nel controllo finale della prima versione sono stati verificati anche:

- numero di pagine, formato A4 orizzontale e segnalibri PDF;
- XML degli SVG valido, presenza di `<text>` nativi e assenza di immagini raster;
- uguaglianza, ignorando gli spazi bianchi, fra il testo degli SVG in ordine di emissione e `PdfReader(...).pages[i].extract_text()`;
- disponibilità dei caratteri in `pdfmetrics.getFont(font).face.charWidths`, per Body/Bold;
- collegamenti di `coverage.md`, tutte le 30 voci **e le varianti**, oltre al semplice conteggio delle righe;
- integrità del ZIP e corrispondenza dei suoi file con quelli consegnati.

`source/verification.json` è il risultato di quei controlli, non uno script eseguibile. Dopo una modifica, ripetere i controlli pertinenti e aggiornarne data, risultati e hash SHA-256 dei file finali. Non mantenere hash vecchi o dichiarazioni di verifica non ripetute. Le funzioni e le pagine possono essere ispezionate con `runpy.run_path(...)`: il blocco `if __name__ == '__main__'` impedisce la generazione durante questa lettura.

### Aggiornare il pacchetto

Aggiornare prima `coverage.md`, poi ricreare il ZIP. Questo esempio include gli SVG correnti, i font, la licenza, la copertura e questa guida; prima assicurarsi che non restino SVG obsoleti:

```sh
python3 - <<'PY'
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path('output/pdf/cookbook')
files = sorted(root.glob('pagina-*.svg'))
files += sorted((root / 'fonts').glob('*.ttf'))
files += [root / name for name in (
    'font-license.txt', 'coverage.md', 'MANUTENZIONE.md')]
with ZipFile(root / 'svg-modificabili.zip', 'w', ZIP_DEFLATED) as archive:
    for path in files:
        archive.write(path, path.relative_to(root))
with ZipFile(root / 'svg-modificabili.zip') as archive:
    assert archive.testzip() is None
PY
```

## 6. Conclusione di un intervento

Una modifica è pronta quando contenuti e ipotesi sono verificati, il generatore termina, le pagine interessate sono state ispezionate e PDF/SVG/copertura/ZIP sono coerenti. Riportare sinteticamente quali pagine sono cambiate, la fonte della modifica, i controlli svolti e gli eventuali dubbi rimasti.

Preservare le modifiche preesistenti dell'utente. Per il solo cookbook non servono `just mdx`, `just check` o `just build`: non è contenuto consumato dal sito. Se l'incarico comprende anche il riassunto o il sito, applicare separatamente i controlli di `AGENTS.md`.

Questa guida documenta l'approccio e non cambia il contenuto del cookbook. Alla sua creazione PDF, SVG e ZIP sono rimasti quelli della prima versione; il ZIP preesistente non include ancora la guida.
