import type { AccentName } from "../data/content";

/** Hex values for each accent, kept in sync with tokens.css. */
export const accentHex: Record<AccentName, string> = {
  violet: "#7c3aed",
  pink: "#ff3d81",
  lime: "#c8ff3d",
  cyan: "#22d3ee",
  orange: "#ff8a3d",
};

/** Second colour paired with each accent in the 3D shader gradient. */
export const accentPair: Record<AccentName, AccentName> = {
  violet: "pink",
  pink: "orange",
  lime: "cyan",
  cyan: "violet",
  orange: "pink",
};

/** Text colour that reaches AA contrast on a solid block of each accent. */
export const inkOn: Record<AccentName, string> = {
  violet: "#f5f3ee",
  pink: "#0a0a0f",
  lime: "#0a0a0f",
  cyan: "#0a0a0f",
  orange: "#0a0a0f",
};

export const BG = "#0a0a0f";
export const INK = "#f5f3ee";
