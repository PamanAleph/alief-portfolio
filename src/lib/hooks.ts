import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Tracks a CSS media query. Returns false during SSR. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/** True when hover-driven effects should run: fine pointer and motion allowed. */
export function useRichPointer(): boolean {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  return fine && !reduced;
}
