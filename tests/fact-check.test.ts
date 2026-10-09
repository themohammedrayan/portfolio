import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { allowedNumbers, unknownNumbers, visibleText } from "../lib/fact-check";

const OUT = path.join(process.cwd(), "out");
const yamlText = readFileSync(path.join(process.cwd(), "content", "master-profile.yaml"), "utf8");
// Section numbers on the "How I work" strip.
const allowed = new Set([...allowedNumbers(yamlText), "01", "02", "03", "04"]);

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) return f === "_next" ? [] : htmlFiles(p);
    return p.endsWith(".html") ? [p] : [];
  });
}

describe("built site", () => {
  it("has been built (run npm run build first)", () => {
    expect(existsSync(OUT)).toBe(true);
  });

  const pages = existsSync(OUT) ? htmlFiles(OUT) : [];

  it.each(pages.map((p) => [path.relative(OUT, p), p]))("%s: every number is in the master profile", (_, file) => {
    const text = visibleText(readFileSync(file, "utf8"));
    expect(unknownNumbers(text, allowed)).toEqual([]);
  });

  it.each(pages.map((p) => [path.relative(OUT, p), p]))("%s: follows the wording rules", (_, file) => {
    const text = visibleText(readFileSync(file, "utf8")).toLowerCase();
    expect(text).not.toMatch(/1m\+ enrollments handled/);
    expect(text).not.toMatch(/10m\+ enrollments/);
  });
});

describe("fact-check helpers", () => {
  it("flags a number not in the profile", () => {
    expect(unknownNumbers("Collected Rs 9 Cr+ from 4,321 payments", new Set(["4321"]))).toEqual(["9"]);
  });
});
