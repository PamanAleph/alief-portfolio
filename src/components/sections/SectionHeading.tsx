import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";
import { SplitText } from "../ui/SplitText";

export interface SectionHeadingProps {
  index: string;
  title: string | string[];
  id: string;
  /** "h1" on sub-page heroes, "h2" for sections. */
  as?: "h1" | "h2";
  className?: string;
  aside?: string;
}

/**
 * Giant outlined index number + split headline. The number fills with the
 * accent as the heading scrolls through the viewport.
 */
export function SectionHeading({ index, title, id, as = "h2", className, aside }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "start 30%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [reduced ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)", "inset(0% 0 0 0)"]);

  return (
    <div ref={ref} className={clsx("heading", className)}>
      <span className="heading__index" aria-hidden="true">
        <span className="heading__num is-outline">{index}</span>
        <motion.span className="heading__num heading__num--fill" style={{ clipPath: fill }}>
          {index}
        </motion.span>
      </span>
      <SplitText as={as} id={id} mode="words" text={title} className="heading__title" trigger={as === "h1" ? "load" : "view"} />
      {aside && <p className="heading__aside kicker">{aside}</p>}
    </div>
  );
}
