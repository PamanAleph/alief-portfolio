import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { principles, type AccentName, type Principle } from "../../data/content";
import { DrawPath } from "../ui/DrawPath";
import { ParallaxLayer } from "../ui/ParallaxLayer";
import { SplitText } from "../ui/SplitText";

const BLOCKS: { bg: AccentName; icon: string }[] = [
  { bg: "lime", icon: "M10 70 L40 40 L60 60 L90 20 M70 20 L90 20 L90 40" },
  { bg: "violet", icon: "M50 8 L88 24 L88 52 C88 74 70 88 50 94 C30 88 12 74 12 52 L12 24 Z M34 50 L46 62 L68 38" },
  { bg: "cyan", icon: "M30 38 a12 12 0 1 1 0.1 0 M70 38 a12 12 0 1 1 0.1 0 M10 88 C14 66 46 66 50 88 M50 88 C54 66 86 66 90 88" },
];

function Statement({ principle, index }: { principle: Principle; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const block = BLOCKS[index % BLOCKS.length] ?? BLOCKS[0]!;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reduced ? ["0vw", "0vw"] : ["5vw", "-5vw"]);

  return (
    <div
      ref={ref}
      className="statement"
      data-section="principles"
      data-accent={block.bg}
      data-bg={block.bg}
      data-morph={index}
      data-label="How I work"
    >
      <ParallaxLayer depth="far" className="layer layer--bg">
        <span className="ghost-num">{String(index + 1).padStart(2, "0")}</span>
      </ParallaxLayer>
      <div className="statement__inner container layer--content">
        <p className="kicker">
          How I work — {String(index + 1).padStart(2, "0")} / {String(principles.length).padStart(2, "0")}
        </p>
        <motion.div style={{ x }}>
          <SplitText as="h3" mode="words" text={principle.title} className="statement__title" />
        </motion.div>
        <div className="statement__foot">
          <p className="statement__body">{principle.body}</p>
          <DrawPath d={block.icon} size={120} className="statement__icon" />
        </div>
      </div>
    </div>
  );
}

/** Section 7 — full-screen statements; the page colour and 3D shape morph per principle. */
export default function Principles() {
  return (
    <section className="principles" aria-labelledby="principles-title">
      <h2 id="principles-title" className="sr-only">
        How I work
      </h2>
      {principles.map((p, i) => (
        <Statement key={p.title} principle={p} index={i} />
      ))}
    </section>
  );
}
