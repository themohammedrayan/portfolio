"use client";

import { useEffect, useState } from "react";

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("toast", { detail: message }));
}

export default function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setMsg(null), 2200);
    };
    addEventListener("toast", on);
    return () => {
      removeEventListener("toast", on);
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="toast" role="status" aria-live="polite" data-show={msg ? "true" : "false"}>
      <span aria-hidden="true">✓</span> {msg}
    </div>
  );
}
