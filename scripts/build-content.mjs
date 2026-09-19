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
    .replace(/\s+/g, '-');
}

function convertObsidian(source) {
  const usedWidgets = new Set();
  let content = source.replace(/\r\n/g, '\n');

  // remark-math richiede i delimitatori dei blocchi su righe dedicate.
  // Obsidian accetta anche `$$\begin{...}` e `\end{...}$$`.
  content = content.replace(/^(\s*)\$\$(\S.*)$/gm, (_match, indent, formula) => `${indent}$$\n${indent}${formula}`);
  content = content.replace(/^(\s*)(\S.*)\$\$\s*$/gm, (_match, indent, formula) => `${indent}${formula}\n${indent}$$`);

  content = content.replace(/^(\s*)!\[\[assets\/([^\]|]+)(?:\|(\d+))?\]\]$/gm, (_match, indent, file, width) => {
    const safePath = file.split('/').map(encodeURIComponent).join('/');
    const size = width ? ` width="${width}"` : '';
    return `${indent}<img src="./${safePath}" alt=""${size} loading="lazy" decoding="async" />`;
  });

  content = content.replace(/\[\[#([^\]|]+)\|([^\]]+)\]\]/g, (_match, target, label) => {
    const id = target.startsWith('^') ? target.slice(1) : headingSlug(target);
    return `[${label}](#${id})`;
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
