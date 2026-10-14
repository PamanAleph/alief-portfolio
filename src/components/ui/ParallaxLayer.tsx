import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { depth as depthTokens, PARALLAX_RANGE_VH, spring, type Depth } from "../../lib/motion";

export interface ParallaxLayerProps {
  children?: ReactNode;
  /** Depth token: bg/far move slower than content, near/fg faster. */
  depth?: Depth;
  axis?: "x" | "y";
  /** Flip travel direction (useful for opposing rows). */
  invert?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Decorative layers are hidden from assistive tech. */
  decorative?: boolean;
}

/** Scroll-linked parallax layer driven by depth tokens, smoothed with a spring. */
export function ParallaxLayer({
  children,
  depth = "mid",
  axis = "y",
  invert = false,
  className,
  style,
  decorative = true,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const range = depthTokens[depth] * PARALLAX_RANGE_VH * (invert ? -1 : 1);
  const unit = axis === "y" ? "vh" : "vw";
  const travel = reduced ? 0 : range;
  const raw = useTransform(scrollYProgress, [0, 1], [travel, -travel]);
  const smooth = useSpring(raw, spring.scroll);
  const offset = useTransform(smooth, (v) => `${v}${unit}`);
  const motionStyle = { ...style, [axis]: offset };

  return (
    <motion.div ref={ref} className={className} style={motionStyle} aria-hidden={decorative || undefined}>
      {children}
    </motion.div>
  );
}
