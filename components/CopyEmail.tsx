"use client";

import { toast } from "./Toast";

/** Email button: copies the address (with a toast) instead of opening a mail client. */
export default function CopyEmail({ email, className }: { email: string; className?: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className={className}
      data-magnetic
      onClick={(e) => {
        if (!navigator.clipboard) return;
        e.preventDefault();
        navigator.clipboard.writeText(email).then(
          () => toast(`Copied ${email}`),
          () => (location.href = `mailto:${email}`),
        );
      }}
    >
      <span>{email}</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M5 15V6a2 2 0 0 1 2-2h9" stroke="currentColor" strokeWidth="2" />
      </svg>
    </a>
  );
}
