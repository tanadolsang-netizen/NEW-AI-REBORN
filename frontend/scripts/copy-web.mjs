// Copies the Next.js static export (out/) into the Capacitor webDir (www/),
// since `next build` always writes to out/ but capacitor.config.ts points at www/.
import { cpSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, "out");
const dest = join(root, "www");

if (!existsSync(src)) {
  console.error(`Nothing to copy: ${src} does not exist. Run "npm run build" first.`);
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log(`Copied ${src} -> ${dest}`);
