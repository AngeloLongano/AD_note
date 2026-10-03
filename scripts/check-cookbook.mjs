import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const directory = await mkdtemp(join(tmpdir(), "ad-cookbook-"));
try {
  for (const name of [
    "diffusion",
    "election",
    "routing",
    "consensus",
    "chord",
    "integration",
  ]) {
    const outfile = join(directory, `${name}.mjs`);
    await build({
      entryPoints: [`tests/cookbook-${name}.ts`],
      outfile,
      bundle: true,
      platform: "node",
      format: "esm",
      logLevel: "silent",
    });
    const tests = await import(pathToFileURL(outfile));
    const run = tests[`test${name[0].toUpperCase()}${name.slice(1)}`];
    if (run) {
      const result = run();
      if (result !== undefined) console.log(`${name}:`, result);
    }
  }
} finally {
  await rm(directory, { recursive: true, force: true });
}
