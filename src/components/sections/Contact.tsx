import { useRef, type PointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { contact, profile } from "../../data/content";
import { spring } from "../../lib/motion";
import { useRichPointer } from "../../lib/hooks";
import { getScene } from "../../lib/sceneStore";
import CopyEmailButton from "../ui/CopyEmailButton";
import { Magnetic } from "../ui/Magnetic";
import { SplitText } from "../ui/SplitText";
import { TextRoll } from "../ui/TextRoll";

/** Flood radius in vmax: a cursor spotlight, or the whole section over the CTA. */
const SPOT = 14;
const FULL = 160;
const SHAPE_PX = 40;

/** Section 8 — giant CTA, rolling email, copy-to-clipboard, colour flood from the cursor. */
export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const rich = useRichPointer();
  const ox = useMotionValue(0);
  const oy = useMotionValue(0);
  const radius = useSpring(0, { stiffness: 90, damping: 20 });
  const clipPath = useMotionTemplate`circle(${radius}vmax at ${ox}px ${oy}px)`;
  const mx = useSpring(useMotionValue(0), spring.soft);
  const my = useSpring(useMotionValue(0), spring.soft);
  const shapeX = useTransform(mx, (v) => v * SHAPE_PX);
  const shapeY = useTransform(my, (v) => v * SHAPE_PX);

  const move = (e: PointerEvent<HTMLElement>) => {
    if (!rich || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ox.set(e.clientX - r.left);
    oy.set(e.clientY - r.top);
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const ctaEnter = () => {
    getScene().ctaHover = true;
    if (rich) radius.set(FULL);
  };
  const ctaLeave = () => {
    getScene().ctaHover = false;
    if (rich) radius.set(SPOT);
  };

  return (
    <section
      ref={ref}
      className="section contact"
      id="contact"
      data-section="contact"
      data-accent="pink"
      data-bg="pink"
      data-label="Contact"
      aria-labelledby="contact-title"
      onPointerMove={move}
      onPointerEnter={() => rich && radius.set(SPOT)}
      onPointerLeave={() => radius.set(0)}
    >
      <motion.span className="flood" aria-hidden="true" style={{ clipPath }} />
      <motion.div className="layer layer--fg" style={{ x: shapeX, y: shapeY }} aria-hidden="true">
        <svg className="shape shape--x float" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" /></svg>
        <svg className="shape shape--star-lime float" viewBox="0 0 24 24">
          <path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" />
        </svg>
      </motion.div>

      <div className="container layer--content">
        <p className="kicker">05 — Contact</p>
        <SplitText as="h2" id="contact-title" mode="lines" text={contact.headline} className="contact__title" />
        <TextRoll text={profile.email} href={`mailto:${profile.email}`} className="contact__email" ariaLabel={`Email ${profile.email}`} />
        <div className="contact__actions">
          <Magnetic>
            <a
              className="btn btn--dark btn--xl"
              href={`mailto:${profile.email}`}
              onPointerEnter={ctaEnter}
              onPointerLeave={ctaLeave}
              onFocus={ctaEnter}
              onBlur={ctaLeave}
              data-cursor="Say hi"
            >
              {contact.cta} <span aria-hidden="true">→</span>
            </a>
          </Magnetic>
          <CopyEmailButton />
        </div>
        <ul className="socials" aria-label="Elsewhere">
          {profile.socials.map((s) => (
            <li key={s.href}>
              <a className="social" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.ariaLabel}>
                {s.label} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
          <li>
            <span className="social social--static">{profile.location}</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
