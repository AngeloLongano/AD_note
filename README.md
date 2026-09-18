# Algoritmi Distribuiti — sito Astro

Il file `Algoritmi Distribuiti.md` rimane la fonte di verità e continua a essere
modificabile con Obsidian. Astro pubblica una copia MDX generata automaticamente.

## Avvio locale

```sh
npm install
npm run dev
```

Il riassunto è disponibile su `http://localhost:4321/`. I widget hanno anche una
pagina autonoma sotto `/widgets/<nome>`.

## Come inserire un widget negli appunti

Nel Markdown sorgente si inserisce un normale link su una riga dedicata:

```md
[Apri il laboratorio interattivo](http://localhost:4321/widgets/master-theorem)
```

In Obsidian il link apre la pagina autonoma. Durante `npm run dev` o
`npm run build`, `scripts/build-content.mjs` lo sostituisce con il componente
interattivo inline. Il file generato in `src/content/generated/` non va modificato
a mano.

Per aggiungere un nuovo widget:

1. creare il componente in `src/components/widgets/`;
2. creare la pagina autonoma in `src/pages/widgets/`;
3. registrare slug, nome del componente e percorso nella mappa `widgets` di
   `scripts/build-content.mjs`;
4. aggiungere il link corrispondente nel Markdown sorgente.

Il convertitore gestisce anche immagini embed di Obsidian, wiki-link verso
heading e block ID, `<br>` e delimitatori matematici compatibili con Obsidian.

## Comandi

- `npm run content:build` genera solo l'MDX;
- `npm run dev` genera il contenuto e avvia Astro;
- `npm run check` controlla componenti e TypeScript;
- `npm run build` crea il sito statico in `dist/`.

## Pubblicazione su GitHub Pages

Il workflow `.github/workflows/deploy.yml` compila e pubblica automaticamente il
sito a ogni push su `main`; può anche essere avviato manualmente dalla sezione
**Actions** del repository.

Nel repository GitHub, aprire **Settings → Pages** e impostare **Source** su
**GitHub Actions**. La configurazione Astro ricava automaticamente proprietario
e nome del repository da `GITHUB_REPOSITORY`, quindi gestisce sia i siti
`utente.github.io` sia gli indirizzi `utente.github.io/nome-repository`.
