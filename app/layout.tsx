import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { CV_PATH, GITHUB, SITE_URL, caseStudies } from "@/content/site";
import { loadProfile } from "@/lib/profile";
import Nav from "@/components/Nav";
import Effects from "@/components/Effects";
import CommandPalette, { type PaletteItem } from "@/components/CommandPalette";
import Toaster from "@/components/Toast";
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

const paletteItems: PaletteItem[] = [
  ...caseStudies().map((c) => ({ id: c.slug, label: c.title, group: "Case studies", hint: c.kicker.split(" · ")[0], href: `/work/${c.slug}/` })),
  { id: "go-home", label: "Home", group: "Go to", href: "/" },
  { id: "go-work", label: "Selected work", group: "Go to", href: "/#work" },
  { id: "go-process", label: "How I work", group: "Go to", href: "/#process" },
  { id: "go-experience", label: "Experience", group: "Go to", href: "/#experience" },
  { id: "go-toolkit", label: "Toolkit", group: "Go to", href: "/#toolkit" },
  { id: "go-contact", label: "Contact", group: "Go to", href: "/#contact" },
  { id: "email", label: "Copy email address", group: "Actions", hint: p.contact.email, action: "copy-email", shortcut: "e" },
  { id: "cv", label: "Download CV (PDF)", group: "Actions", href: CV_PATH, download: true, shortcut: "c" },
  { id: "linkedin", label: "Open LinkedIn", group: "Actions", hint: p.contact.linkedin, href: `https://${p.contact.linkedin}`, shortcut: "l" },
  { id: "github", label: "Open GitHub", group: "Actions", hint: GITHUB, href: `https://${GITHUB}`, shortcut: "g" },
  { id: "open-rivlo", label: "Open Rivlo", group: "Actions", hint: "rivlo.live", href: "https://rivlo.live" },
  { id: "theme", label: "Toggle dark mode", group: "Actions", action: "theme", shortcut: "t" },
];

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
        <Effects />
        <CommandPalette items={paletteItems} email={p.contact.email} />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
