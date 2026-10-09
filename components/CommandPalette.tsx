"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toggleTheme } from "./ThemeToggle";
import { toast } from "./Toast";
import s from "./CommandPalette.module.css";

export type PaletteItem = {
  id: string;
  label: string;
  group: string;
  hint?: string;
  /** Internal route, external URL, or a built-in action. */
  href?: string;
  action?: "copy-email" | "theme";
  download?: boolean;
  /** Single key that runs this item from anywhere on the page (shown as a kbd hint). */
  shortcut?: string;
};

function typingInField(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

export function openPalette() {
  window.dispatchEvent(new Event("open-palette"));
}

export default function CommandPalette({ items, email }: { items: PaletteItem[]; email: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const openRef = useRef(false);
  openRef.current = open;
  const router = useRouter();

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    // Best first: hint or label starts with the query, then a word starts with it, then anywhere.
    const score = (x: PaletteItem) => {
      const label = x.label.toLowerCase();
      const hint = (x.hint ?? "").toLowerCase();
      if (label.startsWith(t) || hint.startsWith(t)) return 0;
      if (new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(`${label} ${hint}`)) return 1;
      return `${label} ${x.group.toLowerCase()} ${hint}`.includes(t) ? 2 : 3;
    };
    return items
      .map((x, n) => ({ x, n, s: score(x) }))
      .filter((r) => r.s < 3)
      .sort((a, b) => a.s - b.s || a.n - b.n)
      .map((r) => r.x);
  }, [q, items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
      else if (!e.metaKey && !e.ctrlKey && !e.altKey && !openRef.current && !typingInField(e.target)) {
        const hit = items.find((x) => x.shortcut === e.key.toLowerCase());
        if (hit) {
          e.preventDefault();
          run(hit);
        }
      }
    };
    const onOpen = () => setOpen(true);
    addEventListener("keydown", onKey);
    addEventListener("open-palette", onOpen);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("open-palette", onOpen);
    };
    // run() only reads stable values (router, email); items come from the server and don't change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setI(0);
      requestAnimationFrame(() => input.current?.focus());
    }
  }, [open]);

  function run(x: PaletteItem) {
    setOpen(false);
    if (x.action === "copy-email") {
      navigator.clipboard?.writeText(email).then(
        () => toast(`Copied ${email}`),
        () => (location.href = `mailto:${email}`),
      );
    } else if (x.action === "theme") toggleTheme();
    else if (x.href?.startsWith("/") && !x.download) router.push(x.href);
    else if (x.href) {
      const a = document.createElement("a");
      a.href = x.href;
      if (x.download) a.download = "";
      else a.target = "_blank";
      a.rel = "noopener";
      a.click();
    }
  }

  if (!open) return null;

  let lastGroup = "";
  return (
    <div className={s.backdrop} onMouseDown={() => setOpen(false)}>
      <div
        className={s.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={s.search}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={input}
            value={q}
            placeholder="Jump to a case study, copy email, download CV…"
            aria-label="Search commands"
            onChange={(e) => {
              setQ(e.target.value);
              setI(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setI((v) => Math.min(results.length - 1, v + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setI((v) => Math.max(0, v - 1));
              } else if (e.key === "Enter" && results[i]) run(results[i]);
            }}
          />
          <kbd>esc</kbd>
        </div>
        <ul className={s.list} role="listbox">
          {results.length === 0 ? <li className={s.empty}>No matches.</li> : null}
          {results.map((x, n) => {
            const header = !q.trim() && x.group !== lastGroup ? x.group : null;
            lastGroup = x.group;
            return (
              <li key={x.id}>
                {header ? <p className={s.group}>{header}</p> : null}
                <button
                  type="button"
                  role="option"
                  aria-selected={n === i}
                  className={s.item}
                  onMouseEnter={() => setI(n)}
                  onClick={() => run(x)}
                >
                  <span>{x.label}</span>
                  <span className={s.hint}>
                    {x.hint}
                    {x.shortcut ? <kbd>{x.shortcut.toUpperCase()}</kbd> : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className={s.foot}>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> to move
          </span>
          <span>
            <kbd>↵</kbd> to open
          </span>
        </div>
      </div>
    </div>
  );
}
