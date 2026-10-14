import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { AccentName } from "../../data/content";
import { SplitText } from "../ui/SplitText";

export interface PageHeroProps {
  kicker: string;
  /** Giant single-word page title (rendered as the page's h1). */
  title: string;
  lede?: string;
  sub?: string;
  accent: AccentName;
  label: string;
}

/** Hero for sub-pages: giant outlined-to-filled word, lede, drifting orb. */
export default function PageHero({ kicker, title, lede, sub, accent, label }: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-14vw"]);
  const orbY = useTransform(scrollYProgress, [0, 1], ["0vh", "18vh"]);

  return (
    <section ref={ref} className="page-hero" data-section="page" data-accent={accent} data-label={label}>
      <motion.div className="page-hero__orb-wrap" style={reduced ? undefined : { y: orbY }} aria-hidden="true">
        <span className="orb page-hero__orb" />
      </motion.div>
      <div className="container layer--content">
        <p className="kicker">{kicker}</p>
        <SplitText as="h1" mode="chars" text={title} className="page-hero__title" trigger="load" lineStyles={reduced ? [] : [{ x }]} />
        {sub && <p className="page-hero__sub">{sub}</p>}
        {lede && <p className="page-hero__lede">{lede}</p>}
      </div>
    </section>
  );
}
