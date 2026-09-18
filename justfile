set shell := ["zsh", "-cu"]

# Elenca i comandi disponibili.
default:
    @just --list

# Rigenera l'MDX a partire da Algoritmi Distribuiti.md.
mdx:
    npm run content:build

# Rigenera l'MDX e avvia il sito in locale.
dev:
    npm run dev

# Controlla componenti Astro e TypeScript.
check:
    npm run check

# Genera il sito statico in dist/.
build:
    npm run build

# Simula la build nel sottopercorso usato da GitHub Pages.
pages repository="angelolongano/AD_note":
    env GITHUB_REPOSITORY={{repository}} npm run build
