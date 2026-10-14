import { motion, useScroll, useSpring } from "framer-motion";
import { spring } from "../../lib/motion";

/** Thin accent-gradient bar at the top of the viewport showing page progress. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, spring.scroll);
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />;
}
