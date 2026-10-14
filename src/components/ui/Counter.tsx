import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { ease } from "../../lib/motion";

export interface CounterProps {
  value: number;
  suffix?: string;
  /** Seconds the count-up takes. */
  duration?: number;
}

/** Number that counts up from zero the first time it scrolls into view. */
export function Counter({ value, suffix = "", duration = 1.6 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || started.current) return;
    if (!seen) {
      el.textContent = `0${suffix}`;
      return;
    }
    started.current = true;
    const controls = animate(0, value, {
      duration,
      ease: ease.outExpo,
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [seen, reduced, value, suffix, duration]);

  return (
    <span ref={ref} className="counter">
      {value}
      {suffix}
    </span>
  );
}
