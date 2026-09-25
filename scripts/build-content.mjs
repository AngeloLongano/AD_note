import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sourcePath = resolve(root, 'Algoritmi Distribuiti.md');
const outputPath = resolve(root, 'src/content/generated/algoritmi-distribuiti.mdx');

const widgets = {
  'master-theorem': {
    component: 'MasterTheoremWidget',
    importPath: '../../components/widgets/MasterTheoremWidget.astro'
  },
  'sat-fnc': {
    component: 'SatFnCWidget',
    importPath: '../../components/widgets/SatFnCWidget.astro'
  }
};

function widgetSlug(href) {
  try {
    const url = new URL(href, 'http://localhost:4321');
    const match = url.pathname.match(/^\/widgets\/([a-z0-9-]+)\/?$/i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

function headingSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-');
}

function convertObsidian(source) {
  const usedWidgets = new Set();
  let content = source.replace(/\r\n/g, '\n');

  // I riferimenti al PDF della docente servono solo per la lettura in Obsidian.
  content = content.replace(/^\[\[teacher_slides\/[^\]\n]+\.pdf#page=\d+\|[^\]\n]+\]\][ \t]*\n?/gm, '');

  // Le sezioni marcate come facoltative diventano tendine chiuse inizialmente.
  const headings = [...content.matchAll(/^(#{2,6}) (.+)$/gm)];
  for (let i = headings.length - 1; i >= 0; i--) {
    const [line, hashes, rawTitle] = headings[i];
    const title = rawTitle.trim();
    if (!title.endsWith('(facoltativo)')) continue;
    const start = headings[i].index;
    const contentStart = start + line.length;
    const level = hashes.length;
    const next = headings.slice(i + 1).find(([, nextHashes]) => nextHashes.length <= level);
    const end = next?.index ?? content.length;
    const body = content.slice(contentStart, end).replace(/^\n+|\n+$/g, '');
    const label = title.replace(/\s*\(facoltativo\)$/, '');
    const id = headingSlug(title);
    content = `${content.slice(0, start)}<details class="optional-section">\n<summary id="${id}">${label} <span>Facoltativo</span></summary>\n\n${body}\n\n</details>\n\n${content.slice(end)}`;
  }

  // I callout mantengono il loro tipo per lo stile del sito.
  content = content.replace(/^([ \t]*>[ \t]*)\[!(definition|theorem|problem|note)\][+-]?(?:[ \t]+([^\n]*))?$/gm, (_match, prefix, kind, label) => {
    const title = label || { definition: 'Definizione', theorem: 'Teorema', problem: 'Problema', note: 'Nota' }[kind];
    return `${prefix}<strong class="formal-callout-label formal-callout-label--${kind}">${title}</strong>`;
  });

  // remark-math richiede i delimitatori dei blocchi su righe dedicate.
  // Obsidian accetta anche `$$\begin{...}` e `\end{...}$$`.
  content = content.replace(/^(\s*)\$\$(\S.*)$/gm, (_match, indent, formula) => `${indent}$$\n${indent}${formula}`);
  content = content.replace(/^(\s*)(\S.*)\$\$\s*$/gm, (_match, indent, formula) => `${indent}${formula}\n${indent}$$`);

  content = content.replace(/^([ \t]*(?:>[ \t]*)*)!\[\[assets\/([^\]|]+)(?:\|(\d+))?\]\]$/gm, (_match, prefix, file, width) => {
    const safePath = file.split('/').map(encodeURIComponent).join('/');
    const size = width ? ` width="${width}"` : '';
    return `${prefix}<img src="./${safePath}" alt=""${size} loading="lazy" decoding="async" />`;
  });

  content = content.replace(/\[\[#([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, target, label) => {
    const id = target.startsWith('^') ? target.slice(1) : headingSlug(target);
    return `[${label ?? target.replace(/^\^/, '')}](#${id})`;
  });

  content = content.replace(/\s+\^([a-zA-Z0-9_-]+)$/gm, '\n<span id="$1"></span>');
  content = content.replace(/<br>/g, '<br />');

  content = content.replace(/^\[([^\]]+)\]\(([^)]+)\)\s*$/gm, (match, _label, href) => {
    const slug = widgetSlug(href);
    if (!slug) return match;
    const widget = widgets[slug];
    if (!widget) {
      throw new Error(`Widget non registrato: ${slug}`);
    }
    usedWidgets.add(slug);
    return `<${widget.component} />`;
  });

  const imports = [...usedWidgets]
    .map((slug) => {
      const widget = widgets[slug];
      return `import ${widget.component} from '${widget.importPath}';`;
    })
    .join('\n');

  return `${imports}${imports ? '\n\n' : ''}${content.trim()}\n`;
}

const source = await readFile(sourcePath, 'utf8');
const generated = convertObsidian(source);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, generated, 'utf8');
console.log(`Generato ${outputPath.replace(`${root}/`, '')}`);
