import Link from "next/link";
import { CV_PATH, GITHUB } from "@/content/site";
import { loadProfile } from "@/lib/profile";
import { GitHubIcon, LinkedInIcon } from "./Icons";
import PaletteButton from "./PaletteButton";
import ThemeToggle from "./ThemeToggle";
import s from "./Nav.module.css";

export default function Nav() {
  const { linkedin } = loadProfile().contact;
  return (
    <nav className={s.nav} aria-label="Main">
      <div className={`wrap ${s.inner}`}>
        <Link href="/" className={s.brand}>
          Rayan<span>.</span>
        </Link>
        <div className={s.links}>
          <Link href="/#work" data-spy="work" className={s.hideXs}>
            Work
          </Link>
          <Link href="/#process" data-spy="process" className={s.hideMd}>
            Process
          </Link>
          <Link href="/#experience" data-spy="experience" className={s.hideSm}>
            Experience
          </Link>
          <Link href="/#contact" data-spy="contact" className={s.hideSm}>
            Contact
          </Link>
          <a
            href={`https://${linkedin}`}
            target="_blank"
            rel="noopener"
            className={s.social}
            aria-label="LinkedIn (shortcut L)"
            data-tip="LinkedIn · L"
            data-magnetic
          >
            <LinkedInIcon />
          </a>
          <a
            href={`https://${GITHUB}`}
            target="_blank"
            rel="noopener"
            className={s.social}
            aria-label="GitHub (shortcut G)"
            data-tip="GitHub · G"
            data-magnetic
          >
            <GitHubIcon />
          </a>
          <PaletteButton />
          <ThemeToggle />
          <a href={CV_PATH} className={s.cv} download data-magnetic>
            CV
          </a>
        </div>
      </div>
      <div className={s.progress} aria-hidden="true" />
    </nav>
  );
}
