import { useRef, type ReactNode, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import clsx from "clsx";
import { spring } from "../../lib/motion";
import { useRichPointer } from "../../lib/hooks";

export interface MagneticProps {
  children: ReactNode;
  /** Fraction of the cursor offset the element follows (0–1). */
  strength?: number;
  className?: string;
}

/** Wrapper that drifts toward the cursor while hovered and springs back on leave. */
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const rich = useRichPointer();
  const x = useSpring(useMotionValue(0), spring.snappy);
  const y = useSpring(useMotionValue(0), spring.snappy);

  const move = (e: PointerEvent<HTMLSpanElement>) => {
    if (!rich || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={clsx("magnetic", className)}
      style={{ x, y }}
      onPointerMove={move}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
