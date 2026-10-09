// Copies the master profile from a job-portal checkout into content/, so the site and the CVs
// share one fact bank. Usage: npm run sync:profile [-- path/to/job-portal]
import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";

const repo = path.resolve(process.argv[2] ?? "../job-portal");
const src = path.join(repo, "data", "master-profile.yaml");
if (!existsSync(src)) {
  console.error(`not found: ${src}`);
  process.exit(1);
}
copyFileSync(src, path.join(process.cwd(), "content", "master-profile.yaml"));
console.log(`copied ${src} -> content/master-profile.yaml`);
