import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/content/site";
import { loadProfile } from "@/lib/profile";
import Nav from "@/components/Nav";
import Motion from "@/components/Motion";
import "./globals.css";

const p = loadProfile();
const description =
  "Product analyst and team lead at Xylem Learning (a Physics Wallah company). I find the problem in the data, write the spec, build it, and launch it.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${p.contact.name} · Product Analyst`, template: `%s · ${p.contact.name}` },
  description,
  authors: [{ name: p.contact.name }],
  openGraph: {
    type: "profile",
    title: `${p.contact.name} · Product Analyst who ships`,
    description,
    url: SITE_URL,
    siteName: p.contact.name,
  },
  twitter: { card: "summary_large_image", title: `${p.contact.name} · Product Analyst who ships`, description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1013" },
  ],
};

// Runs before paint: applies a saved theme and opts into scroll-reveal.
const boot = `try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add("js")`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Motion />
        <Analytics />
      </body>
    </html>
  );
}
