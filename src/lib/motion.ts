/**
 * One motion system for the whole site: easings, springs, durations,
 * stagger steps, parallax depth multipliers and shared variants.
 */
import type { Transition, Variants } from "framer-motion";

export type Bezier = [number, number, number, number];

export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as Bezier,
  inOutQuart: [0.76, 0, 0.24, 1] as Bezier,
};

export const spring = {
  snappy: { type: "spring", stiffness: 400, damping: 30 } satisfies Transition,
  soft: { type: "spring", stiffness: 120, damping: 20 } satisfies Transition,
  /** Smoothing pass for scroll-linked values. */
  scroll: { stiffness: 140, damping: 28, mass: 0.4 },
};

export const duration = { micro: 0.2, element: 0.8, section: 1.2 };

export const stagger = { chars: 0.035, words: 0.05, lines: 0.08 };

/** Parallax depth multipliers (fraction of scroll distance). */
export const depth = { bg: 0.1, far: 0.25, mid: 0.5, near: 0.8, fg: 1.2 } as const;
export type Depth = keyof typeof depth;

/** Max parallax travel, in vh, applied at depth = 1. */
export const PARALLAX_RANGE_VH = 18;

/** Masked slide-up used by SplitText pieces. */
export const riseFromMask: Variants = {
  hidden: { y: "110%" },
  visible: (i: number = 0) => ({
    y: "0%",
    transition: { duration: duration.element, ease: ease.outExpo, delay: i },
  }),
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.element, ease: ease.outExpo } },
};

export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0.4 },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: { duration: duration.section, ease: ease.outExpo },
  },
};

export const staggerParent = (step: number = stagger.words, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
});

/** Default viewport options for whileInView reveals. */
export const inView = { once: true, margin: "0px 0px -12% 0px" } as const;
