import type { CSSProperties } from "react";
import { manifesto, stats } from "../../data/content";
import { accentHex } from "../../lib/theme";
import { Counter } from "../ui/Counter";
import { ParallaxLayer } from "../ui/ParallaxLayer";
import { Reveal } from "../ui/Reveal";
import { ScrollWordFill } from "../ui/ScrollWordFill";
import { SectionHeading } from "./SectionHeading";

const STAT_ACCENTS = [accentHex.cyan, accentHex.pink, accentHex.orange, accentHex.violet];

/** Section 3 — manifesto that fills in on scroll, plus count-up stats. */
export default function About() {
  return (
    <section className="section about" data-section="about" data-accent="lime" data-label="About" aria-labelledby="about-title">
      <ParallaxLayer depth="bg" className="layer layer--bg">
        <span className="ghost-num">01</span>
      </ParallaxLayer>
      <ParallaxLayer depth="fg" className="layer layer--fg">
        <svg className="shape shape--cross shape--about float" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" /></svg>
        <svg className="shape shape--ring shape--about2 float" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /></svg>
      </ParallaxLayer>

      <div className="container layer--content">
        <SectionHeading index="01" title="About" id="about-title" />
        <ScrollWordFill text={manifesto.text} className="about__manifesto" />
        <ul className="stats" aria-label="Highlights">
          {stats.map((s, i) => (
            <Reveal as="li" key={s.label} delay={i * 0.08} className="stat">
              <div className="stat__inner" tabIndex={0} style={{ "--hover": STAT_ACCENTS[i] } as CSSProperties}>
                <span className="stat__value">
                  <Counter value={s.value} suffix={s.suffix} />
                </span>
                <span className="stat__label">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
