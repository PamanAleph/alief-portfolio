import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { profile } from "../../data/content";
import { ease, spring } from "../../lib/motion";
import { useRichPointer } from "../../lib/hooks";
import { ProximityProvider, SplitText } from "../ui/SplitText";

const TICK_MS = 2200;
const MOUSE_PX = { bg: 24, fg: -48 };

/** Rotating role word in the mono line under the headline. */
function RoleTicker({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % words.length), TICK_MS);
    return () => window.clearInterval(id);
  }, [words.length]);
  return (
    <span className="ticker">
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[i]}
          className="ticker__word"
          aria-hidden="true"
          initial={reduced ? false : { y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: ease.outExpo }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Rotating circular text badge. */
function Badge() {
  return (
    <svg className="badge" viewBox="0 0 200 200" width="150" height="150" aria-hidden="true">
      <defs>
        <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <text className="badge__text">
        <textPath href="#badge-circle">AVAILABLE FOR WORK • FULLSTACK ENGINEER • </textPath>
      </text>
      <circle cx="100" cy="100" r="12" className="badge__dot" />
    </svg>
  );
}

/** Section 1 — giant split-letter name, role ticker, aurora + 3D object behind. */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const rich = useRichPointer();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const spread = useSpring(scrollYProgress, spring.scroll);
  const leftX = useTransform(spread, [0, 1], ["0vw", "-22vw"]);
  const rightX = useTransform(spread, [0, 1], ["0vw", "22vw"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(spread, [0, 1], [1, 0.92]);

  const mx = useSpring(useMotionValue(0), spring.soft);
  const my = useSpring(useMotionValue(0), spring.soft);
  const bgX = useTransform(mx, (v) => v * MOUSE_PX.bg);
  const bgY = useTransform(my, (v) => v * MOUSE_PX.bg);
  const fgX = useTransform(mx, (v) => v * MOUSE_PX.fg);
  const fgY = useTransform(my, (v) => v * MOUSE_PX.fg);

  useEffect(() => {
    if (!rich) return;
    const move = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [rich, mx, my]);

  const year = new Date().getFullYear();

  return (
    <section ref={ref} id="top" className="hero" data-section="hero" data-accent="violet" data-label="Intro">
      <motion.div className="hero__layer hero__layer--bg" style={{ x: bgX, y: bgY }} aria-hidden="true">
        <span className="blob blob--violet" />
        <span className="blob blob--pink" />
        <span className="blob blob--cyan" />
      </motion.div>
      <div className="hero__layer" aria-hidden="true">
        <span className="orb orb--poster hero__poster" />
      </div>
      <motion.div className="hero__layer hero__layer--fg" style={{ x: fgX, y: fgY }} aria-hidden="true">
        <Badge />
        <svg className="shape shape--cross float" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" /></svg>
        <svg className="shape shape--ring float" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /></svg>
        <svg className="shape shape--star float" viewBox="0 0 24 24">
          <path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" />
        </svg>
        <svg className="shape shape--squiggle float" viewBox="0 0 90 40">
          <path d="M4 20 Q 15 4 26 20 T 48 20 T 70 20 T 86 20" />
        </svg>
      </motion.div>

      <motion.div className="hero__inner container" style={reduced ? undefined : { opacity: fade, scale }}>
        <div className="hero__top">
          <p className="kicker">( Portfolio — {year} )</p>
          {profile.available && (
            <p className="kicker status">
              <span className="status__dot" aria-hidden="true" />
              Available for work
            </p>
          )}
        </div>

        <ProximityProvider>
          <SplitText
            as="h1"
            mode="chars"
            text={profile.nameLines}
            className="hero__title"
            lineClassNames={["", "is-outline hero__line--indent", "is-gradient"]}
            lineStyles={reduced ? [] : [{ x: leftX }, undefined, { x: rightX }]}
            trigger="load"
            delay={0.15}
            proximity
          />
        </ProximityProvider>

        <div className="hero__bottom">
          <p className="hero__role">
            {profile.role} <span aria-hidden="true">/</span> <RoleTicker words={profile.roleWords} />
          </p>
          <div className="hero__pitch">
            <p className="hero__tagline">{profile.tagline}</p>
            <p>{profile.pitch}</p>
          </div>
          <a href="#about" className="cue" aria-label="Scroll to about">
            <span className="cue__label" aria-hidden="true">Scroll</span>
            <span className="cue__track" aria-hidden="true">
              <span className="cue__bar" />
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
