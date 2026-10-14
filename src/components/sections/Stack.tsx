import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { stack } from "../../data/content";
import { spring } from "../../lib/motion";
import { ParallaxLayer } from "../ui/ParallaxLayer";
import { SectionHeading } from "./SectionHeading";

/** Section 5 — tech tiles by category; hover lifts and dims neighbours, click expands. */
export default function Stack() {
  const [open, setOpen] = useState<string | null>(null);
  const reduced = useReducedMotion();

  return (
    <section className="section stack" id="stack" data-section="stack" data-accent="cyan" data-label="Stack" aria-labelledby="stack-title">
      <ParallaxLayer depth="far" className="layer layer--bg">
        <svg className="poly poly--hex float" viewBox="0 0 100 100">
          <path d="M50 6 L92 30 L92 70 L50 94 L8 70 L8 30 Z M50 6 L50 50 L92 70 M50 50 L8 70 M8 30 L50 50 L92 30" />
        </svg>
        <svg className="poly poly--tri float" viewBox="0 0 100 100">
          <path d="M50 8 L92 86 L8 86 Z M50 8 L50 62 L92 86 M50 62 L8 86" />
        </svg>
        <svg className="poly poly--oct float" viewBox="0 0 100 100">
          <path d="M50 4 L96 50 L50 96 L4 50 Z M50 4 L50 96 M4 50 L96 50" />
        </svg>
      </ParallaxLayer>

      <div className="container layer--content">
        <SectionHeading index="03" title="Stack" id="stack-title" aside="Tap a tile for what it pairs with" />
        <LayoutGroup>
          <div className="stack__groups">
            {stack.map((group, gi) => (
              <ParallaxLayer key={group.name} depth="far" axis="x" invert={gi % 2 === 1} decorative={false} className="stack__group">
                <h3 className="stack__name">{group.name}</h3>
                <ul className="tiles">
                  {group.items.map((item) => {
                    const id = `${group.name}:${item}`;
                    const isOpen = open === id;
                    const pairs = group.items.filter((x) => x !== item).slice(0, 3);
                    return (
                      <motion.li key={id} layout={!reduced} transition={spring.snappy} className={clsx("tile-slot", isOpen && "is-open")}>
                        <motion.button
                          layout={!reduced}
                          type="button"
                          className={clsx("tile", isOpen && "tile--open")}
                          aria-expanded={isOpen}
                          onClick={() => setOpen(isOpen ? null : id)}
                          whileTap={{ scale: 0.96 }}
                          transition={spring.snappy}
                        >
                          <motion.span layout="position" className="tile__name">
                            {item}
                          </motion.span>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.span
                                className="tile__detail"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                              >
                                {group.name} · pairs with {pairs.join(", ")}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </motion.li>
                    );
                  })}
                </ul>
              </ParallaxLayer>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
