import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const distDirectory = fileURLToPath(new URL("../dist", import.meta.url));

async function collectDeclarationFiles(directory) {
  const entries = await readdir(directory);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry);
    const entryStat = await stat(fullPath);

    if (entryStat.isDirectory()) {
      files.push(...(await collectDeclarationFiles(fullPath)));
      continue;
    }

    if (fullPath.endsWith(".d.ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

const declarationFiles = await collectDeclarationFiles(distDirectory);

await Promise.all(
  declarationFiles.map(async (filePath) => {
    const source = await readFile(filePath, "utf8");
    const next = source.replace(
      /((?:from|import)\s+["'][^"']+)\.(?:ts|tsx)(["'])/g,
      "$1$2",
    );

    if (next !== source) {
      await writeFile(filePath, next);
    }
  }),
);
