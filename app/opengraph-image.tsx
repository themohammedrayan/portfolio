import { ImageResponse } from "next/og";
import { heroStats } from "@/content/site";
import { loadProfile } from "@/lib/profile";

export const dynamic = "force-static";
export const alt = "Mohammed Rayan A, Product Analyst";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const p = loadProfile();
  const stats = heroStats();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f6f4ef",
          color: "#16171b",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, color: "#c2451a", letterSpacing: 2 }}>{p.contact.name.toUpperCase()}</div>
          <div style={{ fontSize: 66, lineHeight: 1.08, marginTop: 24, maxWidth: 980 }}>
            Product analyst who finds the problem, writes the spec, builds it and launches it.
          </div>
        </div>
        <div style={{ display: "flex", gap: 64, borderTop: "2px solid #e2ddd2", paddingTop: 28 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", maxWidth: 320 }}>
              <div style={{ fontSize: 56 }}>{s.value.replace("₹", "Rs ")}</div>
              <div style={{ fontSize: 20, color: "#4a4c55", fontFamily: "sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
