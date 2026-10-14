import { useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { accentCycle, type WorkItem } from "../../data/content";
import { accentHex, inkOn } from "../../lib/theme";
import { ease, inView, staggerParent } from "../../lib/motion";

type Filter = "all" | WorkItem["type"];

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "project", label: "Projects" },
  { id: "writing", label: "Writing" },
];

const row = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: ease.outExpo } },
};

export interface LearningListProps {
  items: WorkItem[];
}

/** Index of projects & writing; rows flood with their accent on hover/focus. */
export default function LearningList({ items }: LearningListProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const reduced = useReducedMotion();
  const counts: Record<Filter, number> = {
    all: items.length,
    project: items.filter((i) => i.type === "project").length,
    writing: items.filter((i) => i.type === "writing").length,
  };
  const visible = filter === "all" ? items : items.filter((i) => i.type === filter);

  return (
    <div className="ll">
      <div className="ll__filters" role="group" aria-label="Filter entries">
        {FILTERS.filter((f) => counts[f.id] > 0).map((f) => (
          <button
            key={f.id}
            type="button"
            className={clsx("pill pill--button", filter === f.id && "is-active")}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label} <span className="pill__count">{counts[f.id]}</span>
          </button>
        ))}
      </div>
      <motion.ol
        key={filter}
        className="ll__list"
        variants={staggerParent(reduced ? 0 : 0.08)}
        {...(reduced ? { initial: false as const, animate: "visible" } : { initial: "hidden", whileInView: "visible", viewport: inView })}
      >
        {visible.map((item, i) => {
          const accent = accentCycle[i % accentCycle.length] ?? "violet";
          return (
            <motion.li key={item.id} variants={row} className="ll__item">
              <a
                href={item.href}
                className="ll__row"
                data-cursor="Read"
                style={{ "--row-bg": accentHex[accent], "--row-ink": inkOn[accent] } as CSSProperties}
              >
                <span className="ll__index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="ll__main">
                  <span className="ll__meta kicker">
                    {item.type === "project" ? "Project" : "Writing"} · {item.dateLabel}
                    {item.org ? ` · ${item.org}` : ""}
                  </span>
                  <span className="ll__title">{item.title}</span>
                  <span className="ll__desc">{item.description}</span>
                  {item.tags.length > 0 && (
                    <span className="ll__tags">
                      {item.tags.map((t) => (
                        <span key={t} className="pill">
                          {t}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
                <span className="ll__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </motion.li>
          );
        })}
      </motion.ol>
    </div>
  );
}
