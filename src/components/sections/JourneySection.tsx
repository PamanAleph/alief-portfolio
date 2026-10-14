import { jobs } from "../../data/content";
import { ParallaxLayer } from "../ui/ParallaxLayer";
import Journey from "./Journey";
import { SectionHeading } from "./SectionHeading";

/** Section 6 — home-page journey: compact timeline linking to the full history. */
export default function JourneySection() {
  return (
    <section className="section journey" id="journey" data-section="journey" data-accent="orange" data-label="Journey" aria-labelledby="journey-title">
      <ParallaxLayer depth="bg" className="layer layer--bg">
        <span className="ghost-num ghost-num--right">04</span>
      </ParallaxLayer>
      <div className="container layer--content">
        <SectionHeading index="04" title="Journey" id="journey-title" aside="Tap a role to expand" />
        <Journey jobs={jobs} expanded="first" />
        <p className="work__more">
          <a className="link-arrow" href="/experience/">
            Full work history, education &amp; leadership <span aria-hidden="true">→</span>
          </a>
        </p>
      </div>
    </section>
  );
}
