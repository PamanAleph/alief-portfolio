/**
 * Mutable, framework-free store shared by the DOM layer (scroll, section observer,
 * pointer) and the WebGL layer. The 3D scene reads it inside useFrame, so updates
 * never trigger React renders. It lives on globalThis so every island and inline
 * script sees the same instance.
 */
import type { AccentName } from "../data/content";

export type SectionId =
  | "hero"
  | "marquee"
  | "about"
  | "work"
  | "stack"
  | "journey"
  | "principles"
  | "contact"
  | "footer"
  | "page";

export interface SceneState {
  /** Page scroll progress, 0–1. */
  progress: number;
  /** Scroll velocity in px per frame (signed). */
  velocity: number;
  section: SectionId;
  accent: AccentName;
  /** Principle index while in the principles block (0-based), else -1. */
  morph: number;
  /** Pointer in normalised device coords, -1…1. */
  pointer: { x: number; y: number };
  /** True while the contact CTA is hovered (drives the pulse + burst). */
  ctaHover: boolean;
}

const KEY = "__aliefScene";

type Holder = { [KEY]?: SceneState };

export function getScene(): SceneState {
  const g = globalThis as unknown as Holder;
  if (!g[KEY]) {
    g[KEY] = {
      progress: 0,
      velocity: 0,
      section: "hero",
      accent: "violet",
      morph: -1,
      pointer: { x: 0, y: 0 },
      ctaHover: false,
    };
  }
  return g[KEY];
}

/** DOM event fired whenever the active section changes. */
export const SECTION_EVENT = "af:section";

export interface SectionEventDetail {
  id: SectionId;
  label: string;
  accent: AccentName;
}
