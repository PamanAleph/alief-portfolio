import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "../../data/content";
import { scrollToTarget } from "./SmoothScroll";

const CLOCK_MS = 15_000;

function formatTime(zone: string) {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: zone });
}

/** Live local time in the owner's time zone. */
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const update = () => setTime(formatTime(profile.timeZone));
    update();
    const id = window.setInterval(update, CLOCK_MS);
    return () => window.clearInterval(id);
  }, []);
  return (
    <p className="foot__time">
      Local time <span className="foot__clock">{time ?? "--:--"}</span> {profile.timeZoneLabel}
    </p>
  );
}

/** Smooth "back to top" with an arrow that loops upward on hover. */
export function BackToTop() {
  const reduced = useReducedMotion();
  return (
    <motion.button
      type="button"
      className="btn btn--ghost backtop"
      onClick={() => scrollToTarget(0)}
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
    >
      Back to top
      <span className="backtop__arrow" aria-hidden="true">
        <motion.span
          variants={reduced ? {} : { hover: { y: ["0%", "-120%", "120%", "0%"], transition: { duration: 0.6 } } }}
        >
          ↑
        </motion.span>
      </span>
    </motion.button>
  );
}
