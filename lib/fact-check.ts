// Fact check for the built site: every number shown must exist in the master profile.
import { parse } from "yaml";

const NUM = /\d[\d,.]*/g;

/** "1,212,958" -> "1212958", "4." -> "4". */
function norm(n: string): string {
  return n.replace(/,/g, "").replace(/\.$/, "");
}

/** Every number in the YAML's values (comments excluded: they hold unpublished counts). */
export function allowedNumbers(yamlText: string): Set<string> {
  const out = new Set<string>();
  const walk = (v: unknown): void => {
    if (typeof v === "string" || typeof v === "number") {
      for (const m of String(v).match(NUM) ?? []) out.add(norm(m));
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(parse(yamlText));
  return out;
}

/** Visible text of an HTML page: drops scripts, styles and tags. */
export function visibleText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ");
}

/** Numbers in `text` not found in `allowed`. Step labels like "01" are allowed by the caller. */
export function unknownNumbers(text: string, allowed: Set<string>): string[] {
  return [...new Set((text.match(NUM) ?? []).map(norm))].filter((n) => n && !allowed.has(n));
}
