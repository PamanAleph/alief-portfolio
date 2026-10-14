import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { profile } from "../../data/content";
import { ease, spring, stagger } from "../../lib/motion";
import { SECTION_EVENT, type SectionEventDetail } from "../../lib/sceneStore";

interface NavLink {
  href: string;
  label: string;
}

const LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/experience/", label: "Experience" },
  { href: "/learning/", label: "Learning" },
];

function isActive(href: string, currentPath: string) {
  return href === "/" ? currentPath === "/" : currentPath.startsWith(href);
}

export interface NavProps {
  currentPath: string;
}

/** Fixed minimal header with an active-section readout and a full-screen overlay menu. */
export default function Nav({ currentPath }: NavProps) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("");
  const reduced = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onSection = (e: Event) => setSection((e as CustomEvent<SectionEventDetail>).detail.label);
    window.addEventListener(SECTION_EVENT, onSection);
    return () => window.removeEventListener(SECTION_EVENT, onSection);
  }, []);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.classList.add("menu-open");
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.documentElement.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
      toggleRef.current?.focus();
    };
  }, [open]);

  const menuLinks: NavLink[] = [...LINKS, { href: `mailto:${profile.email}`, label: "Contact" }];

  return (
    <>
      <header className="nav">
        <div className="nav__row">
          <a href="/" className="nav__mark" aria-label={`${profile.name} — home`}>
            {profile.monogram}
            <span className="nav__dot">.</span>
          </a>
          <AnimatePresence mode="wait">
            {section && (
              <motion.span
                key={section}
                className="nav__section"
                aria-hidden="true"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.4, ease: ease.outExpo }}
              >
                {section}
              </motion.span>
            )}
          </AnimatePresence>
          <nav className="nav__links" aria-label="Primary">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav__link"
                aria-current={isActive(link.href, currentPath) ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            ref={toggleRef}
            type="button"
            className="btn btn--nav"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            Menu <span aria-hidden="true">●</span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={reduced ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "circle(150% at calc(100% - 3rem) 2.5rem)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            transition={{ duration: 0.8, ease: ease.inOutQuart }}
          >
            <div className="menu__top">
              <span className="menu__kicker">Navigate</span>
              <button type="button" className="btn btn--dark" onClick={() => setOpen(false)}>
                Close <span aria-hidden="true">✕</span>
              </button>
            </div>
            <motion.nav
              className="menu__links"
              aria-label="Menu"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger.lines, delayChildren: 0.25 } } }}
            >
              {menuLinks.map((link, i) => (
                <span key={link.href} className="menu__mask">
                  <motion.a
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={link.href}
                    className="menu__link"
                    aria-current={isActive(link.href, currentPath) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    variants={{ hidden: { y: "110%" }, visible: { y: "0%", transition: spring.soft } }}
                    whileHover={reduced ? undefined : { x: 24, skewX: -6 }}
                  >
                    <span className="menu__num">0{i + 1}</span>
                    {link.label}
                  </motion.a>
                </span>
              ))}
            </motion.nav>
            <div className="menu__foot">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              {profile.socials.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.ariaLabel}>
                  {s.label} ↗
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
