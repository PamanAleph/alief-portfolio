import { useRef, type CSSProperties, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { accentCycle, type WorkItem } from "../../data/content";
import { accentHex, inkOn } from "../../lib/theme";
import { spring } from "../../lib/motion";
import { useRichPointer } from "../../lib/hooks";
import { Magnetic } from "../ui/Magnetic";
import { SectionHeading } from "./SectionHeading";

const TILT_DEG = 10;
const STACK_STEP = 0.045;
const STICKY_STEP_PX = 28;

/** Preview plate that tilts in 3D toward the cursor and RGB-splits on hover. */
function Preview({ item }: { item: WorkItem }) {
  const rich = useRichPointer();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-TILT_DEG, TILT_DEG]), spring.soft);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [TILT_DEG, -TILT_DEG]), spring.soft);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!rich) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
    e.currentTarget.style.setProperty("--rx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--ry", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };
  const lead = item.tags[0] ?? item.type;

  return (
    <motion.div
      className="plate"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={move}
      onPointerLeave={reset}
      data-cursor="Read"
      aria-hidden="true"
    >
      <span className="plate__grid" />
      <span className="plate__ripple" />
      <span className="plate__word" data-text={lead}>
        {lead}
      </span>
      <span className="plate__tags">{item.tags.slice(1, 4).join(" · ")}</span>
    </motion.div>
  );
}

interface CardProps {
  item: WorkItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function Card({ item, index, total, progress }: CardProps) {
  const reduced = useReducedMotion();
  const accent = accentCycle[index % accentCycle.length] ?? "violet";
  const depthFromTop = total - 1 - index;
  const scale = useTransform(progress, [index / total, 1], [1, 1 - depthFromTop * STACK_STEP]);
  const shade = useTransform(progress, [index / total, 1], [0, Math.min(0.5, depthFromTop * 0.16)]);
  const rotate = useTransform(progress, [index / total, 1], [0, depthFromTop * -0.6]);
  const style = {
    "--card-bg": accentHex[accent],
    "--card-ink": inkOn[accent],
    top: `calc(var(--card-top) + ${index * STICKY_STEP_PX}px)`,
  } as CSSProperties;

  return (
    <div className="card-slot" style={style}>
      <motion.article className="card" style={reduced ? undefined : { scale, rotate }} aria-labelledby={`work-${item.id}`}>
        <motion.span className="card__shade" style={{ opacity: reduced ? 0 : shade }} aria-hidden="true" />
        <div className="card__body">
          <div className="card__top">
            <span className="card__index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="kicker">
              {item.type === "project" ? "Project" : "Writing"} · {item.dateLabel}
            </span>
          </div>
          <h3 id={`work-${item.id}`} className="card__title">
            <a href={item.href} className="card__link">
              {item.shortTitle}
            </a>
          </h3>
          <ul className="pills" aria-label="Tags">
            {item.tags.map((t) => (
              <li key={t} className="pill">
                {t}
              </li>
            ))}
          </ul>
          <p className="card__desc">{item.description}</p>
          <div className="card__actions">
            <Magnetic>
              <a className="btn btn--dark" href={item.href} data-cursor="Read">
                Read the write-up <span aria-hidden="true">→</span>
              </a>
            </Magnetic>
          </div>
        </div>
        <Preview item={item} />
      </motion.article>
    </div>
  );
}

export interface WorkProps {
  items: WorkItem[];
}

/** Section 4 — sticky stacked cards; each pins while the next slides over it. */
export default function Work({ items }: WorkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section className="section work" id="work" data-section="work" data-accent="pink" data-label="Selected work" aria-labelledby="work-title">
      <div className="container">
        <SectionHeading index="02" title={["Selected", "work"]} id="work-title" aside={`( ${String(items.length).padStart(2, "0")} pieces — newest first )`} />
        <div ref={ref} className="stack-cards">
          {items.map((item, i) => (
            <Card key={item.id} item={item} index={i} total={items.length} progress={scrollYProgress} />
          ))}
        </div>
        <p className="work__more">
          <a className="link-arrow" href="/learning/">
            All projects &amp; writing <span aria-hidden="true">→</span>
          </a>
        </p>
      </div>
    </section>
  );
}
