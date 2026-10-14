import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionStyle, type MotionValue } from "framer-motion";
import clsx from "clsx";
import { inView, riseFromMask, spring, stagger } from "../../lib/motion";

type Mode = "chars" | "words" | "lines";
type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

interface PointerCtx {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

const ProximityContext = createContext<PointerCtx | null>(null);

/** Supplies pointer coordinates to proximity-reactive characters inside it. */
export function ProximityProvider({ children }: { children: ReactNode }) {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);
  return <ProximityContext.Provider value={{ x, y }}>{children}</ProximityContext.Provider>;
}

const PROXIMITY_RADIUS = 180;

/** A character that lifts and tilts as the cursor approaches it. */
function ProximityChar({ children }: { children: string }) {
  const ctx = useContext(ProximityContext);
  const ref = useRef<HTMLSpanElement>(null);
  const centre = useRef({ x: 0, y: 0 });
  const fallback = useMotionValue(-9999);

  useEffect(() => {
    const measure = () => {
      const r = ref.current?.getBoundingClientRect();
      if (r) centre.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, []);

  const pull = useTransform([ctx?.x ?? fallback, ctx?.y ?? fallback], (values: number[]) => {
    const [px = 0, py = 0] = values;
    const d = Math.hypot(px - centre.current.x, py - centre.current.y);
    return Math.max(0, 1 - d / PROXIMITY_RADIUS);
  });
  const smooth = useSpring(pull, spring.snappy);
  const y = useTransform(smooth, (v) => `${-v * 0.12}em`);
  const rotate = useTransform(smooth, (v) => v * -6);
  const scale = useTransform(smooth, (v) => 1 + v * 0.06);

  return (
    <motion.span ref={ref} className="split__char" style={{ y, rotate, scale }}>
      {children}
    </motion.span>
  );
}

interface PieceProps {
  children: ReactNode;
  delay: number;
  className?: string;
}

function Piece({ children, delay, className }: Omit<PieceProps, "animate">) {
  return (
    <motion.span className={clsx("split__piece", className)} variants={riseFromMask} custom={delay}>
      {children}
    </motion.span>
  );
}

export interface SplitTextProps {
  /** One string, or one string per visual line. */
  text: string | string[];
  mode?: Mode;
  as?: Tag;
  className?: string;
  /** Extra class per line (outline, gradient, offset…). */
  lineClassNames?: string[];
  /** Seconds before the first piece starts. */
  delay?: number;
  /** Animate on mount ("load") or when scrolled into view ("view"). */
  trigger?: "load" | "view";
  /** Characters react to cursor proximity (chars mode only). */
  proximity?: boolean;
  /** Motion style per line, e.g. scroll-linked offsets. */
  lineStyles?: (MotionStyle | undefined)[];
  id?: string;
}

/**
 * Staggered masked reveal for headlines. The full string is kept in a visually
 * hidden span for assistive tech; the animated pieces are aria-hidden.
 */
export function SplitText({
  text,
  mode = "words",
  as = "span",
  className,
  lineClassNames = [],
  delay = 0,
  trigger = "view",
  proximity = false,
  lineStyles = [],
  id,
}: SplitTextProps) {
  const reduced = useReducedMotion();
  const animate = !reduced;
  const lines = Array.isArray(text) ? text : [text];
  const label = lines.join(" ");
  const step = stagger[mode];
  let index = 0;
  const next = () => delay + index++ * step;

  const Tag = motion[as];
  // Same element tree in every mode so hydration never leaves SSR "hidden" styles behind.
  const motionProps = !animate
    ? { initial: false as const, animate: "visible" }
    : trigger === "load"
      ? { initial: "hidden", animate: "visible" }
      : { initial: "hidden", whileInView: "visible", viewport: inView };

  return (
    <Tag id={id} className={clsx("split", className)} {...motionProps}>
      <span className="sr-only">{label}</span>
      {lines.map((line, li) => (
        <motion.span key={li} className={clsx("split__line", lineClassNames[li])} style={lineStyles[li]} aria-hidden="true">
          {mode === "lines" && (
            <span className="split__mask">
              <Piece delay={next()}>
                {line}
              </Piece>
            </span>
          )}
          {mode === "words" &&
            line.split(" ").map((word, wi) => (
              <span key={wi}>
                <span className="split__mask">
                  <Piece delay={next()}>
                    {word}
                  </Piece>
                </span>{" "}
              </span>
            ))}
          {mode === "chars" && (
            <span className="split__mask">
              {line.split(" ").map((word, wi, words) => (
                <span key={wi} className="split__word">
                  {Array.from(word).map((ch, ci) => (
                    <Piece key={ci} delay={next()}>
                      {proximity && animate ? <ProximityChar>{ch}</ProximityChar> : ch}
                    </Piece>
                  ))}
                  {wi < words.length - 1 ? " " : null}
                </span>
              ))}
            </span>
          )}
        </motion.span>
      ))}
    </Tag>
  );
}
