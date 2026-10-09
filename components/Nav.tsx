import Link from "next/link";
import { CV_PATH } from "@/content/site";
import ThemeToggle from "./ThemeToggle";
import s from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={s.nav} aria-label="Main">
      <div className={`wrap ${s.inner}`}>
        <Link href="/" className={s.brand}>
          Rayan<span>.</span>
        </Link>
        <div className={s.links}>
          <Link href="/#work">Work</Link>
          <Link href="/#experience">Experience</Link>
          <Link href="/#about" className={s.hideSm}>
            About
          </Link>
          <Link href="/#contact" className={s.hideSm}>
            Contact
          </Link>
          <ThemeToggle />
          <a href={CV_PATH} className={s.cv} download>
            CV
          </a>
        </div>
      </div>
    </nav>
  );
}
