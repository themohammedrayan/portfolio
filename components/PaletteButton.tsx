"use client";

import { openPalette } from "./CommandPalette";

export default function PaletteButton() {
  return (
    <button type="button" className="iconBtn kbdBtn" onClick={openPalette} aria-label="Open command menu">
      <kbd>⌘K</kbd>
    </button>
  );
}
