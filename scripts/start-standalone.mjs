import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const standaloneRoot = join(projectRoot, ".next", "standalone");
const serverPath = join(standaloneRoot, "server.js");

if (!existsSync(serverPath)) {
  throw new Error("Standalone build not found. Run `npm run build` first.");
}

const publicSource = join(projectRoot, "public");
if (existsSync(publicSource)) {
  cpSync(publicSource, join(standaloneRoot, "public"), {
    recursive: true,
    force: true,
  });
}

const staticSource = join(projectRoot, ".next", "static");
if (existsSync(staticSource)) {
  const staticTarget = join(standaloneRoot, ".next", "static");
  mkdirSync(join(standaloneRoot, ".next"), { recursive: true });
  cpSync(staticSource, staticTarget, { recursive: true, force: true });
}

await import(pathToFileURL(serverPath).href);
