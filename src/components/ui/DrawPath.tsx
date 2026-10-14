import { motion, useReducedMotion } from "framer-motion";
import { ease, inView } from "../../lib/motion";

export interface DrawPathProps {
  d: string;
  size?: number;
  viewBox?: string;
  strokeWidth?: number;
  className?: string;
  /** Seconds the draw takes. */
  duration?: number;
}

/** Decorative SVG icon whose stroke draws itself when it enters the viewport. */
export function DrawPath({ d, size = 120, viewBox = "0 0 100 100", strokeWidth = 5, className, duration = 1.6 }: DrawPathProps) {
  const reduced = useReducedMotion();
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <motion.path
        d={d}
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ ...inView, once: false }}
        transition={{ duration, ease: ease.inOutQuart }}
      />
    </svg>
  );
}
