import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { spring } from "../../lib/motion";
import { useRichPointer } from "../../lib/hooks";

const INTERACTIVE = "a, button, [data-cursor], summary, label, input, textarea, select";

/**
 * Dot + trailing ring cursor. Grows over interactive elements and shows the
 * element's `data-cursor` label. Not rendered on touch or under reduced motion.
 */
export default function CustomCursor() {
  const rich = useRichPointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, spring.soft);
  const ringY = useSpring(y, spring.soft);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState("");
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!rich) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>(INTERACTIVE);
      setHover(Boolean(target));
      setLabel(target?.dataset.cursor ?? "");
    };
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [rich, x, y]);

  if (!rich) return null;

  const ringScale = label ? 3.2 : hover ? 1.8 : 1;
  return (
    <div className="cursor" aria-hidden="true">
      <motion.div className="cursor__dot" style={{ x, y }} animate={{ scale: down ? 0.5 : hover ? 0 : 1 }} />
      <motion.div
        className="cursor__ring"
        data-label={label ? "true" : undefined}
        style={{ x: ringX, y: ringY }}
        animate={{ scale: down ? ringScale * 0.85 : ringScale }}
        transition={spring.snappy}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              className="cursor__label"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 / 3.2 }}
              exit={{ opacity: 0 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
