import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import clsx from "clsx";
import type { Job } from "../../data/content";
import { ease, spring } from "../../lib/motion";
import { Reveal } from "../ui/Reveal";

interface EntryProps {
  job: Job;
  index: number;
  open: boolean;
  onToggle: () => void;
}

function Entry({ job, index, open, onToggle }: EntryProps) {
  const reduced = useReducedMotion();
  const panelId = useId();
  return (
    <Reveal kind="clip" as="li" className={clsx("tl__item", index % 2 === 1 && "tl__item--right")}>
      <motion.div layout={!reduced} className={clsx("tl__card", open && "is-open")} transition={spring.snappy}>
        <span className="tl__node" aria-hidden="true" />
        <h3 className="tl__heading">
          <button type="button" className="tl__toggle" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
            <span className="tl__dates">{job.dates}</span>
            <span className="tl__role">
              {job.role}
              <motion.span className="tl__icon" aria-hidden="true" animate={{ rotate: open ? 45 : 0 }}>
                +
              </motion.span>
            </span>
            <span className="tl__org">
              {job.org} <span className="tl__place">— {job.place}</span>
            </span>
          </button>
        </h3>
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              id={panelId}
              className="tl__bullets"
              initial={reduced ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: ease.outExpo }}
            >
              {job.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </Reveal>
  );
}

export interface JourneyProps {
  jobs: Job[];
  /** Open every entry by default (experience page) or only the first (home). */
  expanded?: "first" | "all";
}

/** Timeline whose spine draws with scroll; entries alternate sides and expand in place. */
export default function Journey({ jobs, expanded = "first" }: JourneyProps) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set(expanded === "all" ? jobs.map((_, i) => i) : [0]));
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const draw = useSpring(scrollYProgress, spring.scroll);

  const toggle = (i: number) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="tl">
      <svg className="tl__spine" viewBox="0 0 4 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="2" y1="0" x2="2" y2="100" className="tl__spine-bg" />
        <motion.line x1="2" y1="0" x2="2" y2="100" className="tl__spine-fg" style={{ pathLength: reduced ? 1 : draw }} />
      </svg>
      <ol ref={ref} className="tl__list">
        {jobs.map((job, i) => (
          <Entry key={`${job.org}-${job.dates}`} job={job} index={i} open={openSet.has(i)} onToggle={() => toggle(i)} />
        ))}
      </ol>
    </div>
  );
}
