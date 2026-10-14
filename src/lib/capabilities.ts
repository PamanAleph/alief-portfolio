/** Device capability checks used to pick a 3D quality tier. */

export type Tier = "off" | "low" | "high";

export interface TierSettings {
  dpr: [number, number];
  particles: number;
  detail: number;
}

export const tierSettings: Record<Exclude<Tier, "off">, TierSettings> = {
  low: { dpr: [1, 1.5], particles: 700, detail: 24 },
  high: { dpr: [1, 2], particles: 2400, detail: 56 },
};

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isCoarsePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function detectTier(): Tier {
  if (typeof window === "undefined") return "off";
  if (prefersReducedMotion() || !hasWebGL()) return "off";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 8;
  const narrow = window.innerWidth < 768;
  if (isCoarsePointer() || narrow || cores <= 4 || memory <= 4) return "low";
  return "high";
}
