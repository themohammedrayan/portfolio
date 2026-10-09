"use client";

import { useEffect, useState } from "react";

/** Types out each role in turn, then deletes it. Static (first role) under reduced motion. */
export default function RoleTicker({ roles }: { roles: string[] }) {
  const [text, setText] = useState(roles[0]);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || roles.length < 2) return;
    let i = 0;
    let n = roles[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (deleting) {
        n--;
        if (n <= 0) {
          deleting = false;
          i = (i + 1) % roles.length;
        }
      } else {
        n++;
      }
      setText(roles[i].slice(0, Math.max(0, n)));
      let wait = deleting ? 28 : 55;
      if (!deleting && n >= roles[i].length) {
        deleting = true;
        wait = 2200;
      }
      timer = setTimeout(step, wait);
    };
    timer = setTimeout(step, 2600);
    return () => clearTimeout(timer);
  }, [roles]);
  return (
    <span className="ticker" aria-label={roles.join(", ")}>
      <span aria-hidden="true">{text}</span>
      <span className="caret" aria-hidden="true" />
    </span>
  );
}
