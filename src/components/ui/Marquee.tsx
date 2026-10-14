import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import clsx from "clsx";

const COPIES = 4;
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

export interface MarqueeProps {
  items: string[];
  /** Percent of one copy travelled per second; negative runs right-to-left. */
  speed?: number;
  /** Render alternating items as outlined type. */
  outline?: "none" | "alternate" | "all";
  separator?: string;
  className?: string;
}

/**
 * Infinite ticker. Speed rises with scroll velocity and direction flips with
 * scroll direction. Pauses off-screen; static under reduced motion.
 */
export function Marquee({ items, speed = -4, outline = "alternate", separator = "✦", className }: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "100px" });
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1000, 0, 1000], [-4, 0, 4], { clamp: false });
  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced || !visible) return;
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    const move = ((speed * delta) / 1000 / COPIES) * direction.current * (1 + Math.abs(f));
    baseX.set(baseX.get() + move);
  });

  const copy = (key: number) => (
    <span key={key} className="marquee__copy">
      {items.map((item, i) => (
        <span key={i} className="marquee__group">
          <span
            className={clsx(
              "marquee__item",
              (outline === "all" || (outline === "alternate" && i % 2 === 1)) && "is-outline",
            )}
          >
            {item}
          </span>
          <span className="marquee__sep">{separator}</span>
        </span>
      ))}
    </span>
  );

  return (
    <div ref={ref} className={clsx("marquee", className)}>
      <span className="sr-only">{items.join(", ")}</span>
      <motion.div className="marquee__track" style={{ x }} aria-hidden="true">
        {Array.from({ length: COPIES }, (_, i) => copy(i))}
      </motion.div>
    </div>
  );
}
