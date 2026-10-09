"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Page-wide interaction layer, driven by data attributes so pages stay server components:
//   [data-reveal]     fades/rises in when scrolled into view (stagger with style="--d: 120ms")
//   [data-count]      counts its leading number up from 0 when visible ("₹100 Cr+", "2,500+")
//   [data-tilt]       tilts toward the pointer and exposes --mx/--my for a spotlight glow
//   [data-spotlight]  exposes --mx/--my (pointer position) for a background spotlight
//   [data-magnetic]   drifts slightly toward the pointer
//   [data-progress]   gets --p (0..1): how far the viewport has travelled through it, and
//                     data-step (0..n-1) when it has data-steps="n"
//   [data-spy="id"]   gets aria-current while section #id is in view
// Plus the root's --scroll (page progress) and data-nav="hidden" while scrolling down.

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => matchMedia("(hover: hover) and (pointer: fine)").matches;

function countUp(el: HTMLElement) {
  const text = el.dataset.final ?? el.textContent ?? "";
  el.dataset.final = text;
  const m = text.match(/^(\D*)(\d[\d,]*)(\D*)$/);
  if (!m || reduced()) return;
  const [, pre, num, post] = m;
  const target = Number(num.replace(/,/g, ""));
  const commas = num.includes(",");
  const dur = 1400;
  const t0 = performance.now();
  const fmt = (n: number) => (commas ? n.toLocaleString("en-US") : String(n));
  const tick = (t: number) => {
    const k = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - k, 4);
    el.textContent = pre + fmt(Math.round(target * eased)) + post;
    if (k < 1) requestAnimationFrame(tick);
    else el.textContent = text;
  };
  el.textContent = pre + fmt(0) + post;
  requestAnimationFrame(tick);
}

export default function Effects() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const cleanups: (() => void)[] = [];

    // Reveal + count-up
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (el.hasAttribute("data-reveal")) el.classList.add("in");
          if (el.hasAttribute("data-count")) countUp(el);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    document.querySelectorAll("[data-reveal]:not(.in), [data-count]").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // Scroll-spy
    const spies = Array.from(document.querySelectorAll<HTMLElement>("[data-spy]"));
    if (spies.length) {
      const spyIo = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            spies.forEach((a) =>
              a.dataset.spy === e.target.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"),
            );
          }
        },
        { rootMargin: "-45% 0px -50% 0px" },
      );
      new Set(spies.map((a) => a.dataset.spy)).forEach((id) => {
        const sec = id && document.getElementById(id);
        if (sec) spyIo.observe(sec);
      });
      cleanups.push(() => spyIo.disconnect());
    }

    // Scroll-linked values
    const progressEls = Array.from(document.querySelectorAll<HTMLElement>("[data-progress]"));
    let lastY = scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = scrollY;
        const max = root.scrollHeight - innerHeight;
        root.style.setProperty("--scroll", String(max > 0 ? y / max : 0));
        root.style.setProperty("--sy", `${y}px`);
        if (Math.abs(y - lastY) > 6) {
          root.dataset.nav = y > lastY && y > 240 ? "hidden" : "shown";
          lastY = y;
        }
        for (const el of progressEls) {
          const r = el.getBoundingClientRect();
          // 0 when its top reaches 85% down the viewport; 1 after a further max(height, half a viewport).
          const span = Math.max(r.height, innerHeight * 0.5);
          const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / span));
          el.style.setProperty("--p", p.toFixed(3));
          const n = Number(el.dataset.steps);
          if (n) el.dataset.step = String(Math.min(n - 1, Math.floor(p * n)));
        }
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    cleanups.push(() => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    });

    // Pointer effects (desktop only)
    if (finePointer()) {
      const onMove = (ev: PointerEvent) => {
        const t = ev.target as HTMLElement | null;
        if (!t?.closest) return;
        const spot = t.closest<HTMLElement>("[data-spotlight], [data-tilt]");
        if (spot) {
          const r = spot.getBoundingClientRect();
          spot.style.setProperty("--mx", `${ev.clientX - r.left}px`);
          spot.style.setProperty("--my", `${ev.clientY - r.top}px`);
          if (spot.hasAttribute("data-tilt") && !reduced()) {
            const rx = ((ev.clientY - r.top) / r.height - 0.5) * -6;
            const ry = ((ev.clientX - r.left) / r.width - 0.5) * 8;
            spot.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
          }
        }
        const mag = t.closest<HTMLElement>("[data-magnetic]");
        if (mag && !reduced()) {
          const r = mag.getBoundingClientRect();
          const dx = ev.clientX - (r.left + r.width / 2);
          const dy = ev.clientY - (r.top + r.height / 2);
          mag.style.transform = `translate(${dx * 0.25}px, ${dy * 0.35}px)`;
        }
      };
      const onOut = (ev: PointerEvent) => {
        const t = ev.target as HTMLElement | null;
        const el = t?.closest?.<HTMLElement>("[data-tilt], [data-magnetic]");
        if (el && !el.contains(ev.relatedTarget as Node | null)) el.style.transform = "";
      };
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerout", onOut);
      cleanups.push(() => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerout", onOut);
      });
    }

    return () => cleanups.forEach((f) => f());
  }, [pathname]);

  return null;
}
