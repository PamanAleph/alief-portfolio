import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { clipReveal, fadeUp, inView } from "../../lib/motion";

type Kind = "fade" | "clip";
type Tag = "div" | "section" | "article" | "li" | "p" | "header";

export interface RevealProps {
  children: ReactNode;
  kind?: Kind;
  as?: Tag;
  className?: string;
  /** Seconds of delay before the reveal starts. */
  delay?: number;
  /** Reveal only the first time it enters the viewport (default true). */
  once?: boolean;
}

/** Fade/slide or clip-path reveal wrapper. Under reduced motion it shows its final state at once. */
export function Reveal({ children, kind = "fade", as = "div", className, delay = 0, once = true }: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  const variants = kind === "clip" ? clipReveal : fadeUp;
  const play = reduced
    ? { initial: false as const, animate: "visible" }
    : { initial: "hidden", whileInView: "visible", viewport: { ...inView, once } };
  return (
    <Tag className={className} variants={variants} transition={{ delay }} {...play}>
      {children}
    </Tag>
  );
}
