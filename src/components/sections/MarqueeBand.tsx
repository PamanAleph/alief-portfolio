import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { marqueeLines } from "../../data/content";
import { Marquee } from "../ui/Marquee";

/** Section 2 — two opposing, velocity-reactive tickers on a band that tilts with scroll. */
export default function MarqueeBand() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], reduced ? [-1.5, -1.5] : [-3, 1]);

  return (
    <motion.section
      ref={ref}
      className="band"
      data-section="marquee"
      data-accent="lime"
      data-label="Intro"
      aria-label="Highlights"
      style={{ rotate }}
    >
      <Marquee items={marqueeLines[0]} speed={-5} outline="alternate" className="band__row" />
      <Marquee items={marqueeLines[1]} speed={5} outline="alternate" separator="✶" className="band__row band__row--accent" />
    </motion.section>
  );
}
