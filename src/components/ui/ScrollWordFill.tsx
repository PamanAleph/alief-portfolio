import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import clsx from "clsx";

interface Token {
  word: string;
  marked: boolean;
}

/** Splits "plain [[marked words]] plain" into word tokens. */
function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const parts = text.split(/(\[\[.+?\]\])/g);
  for (const part of parts) {
    const marked = part.startsWith("[[");
    const clean = marked ? part.slice(2, -2) : part;
    for (const word of clean.split(/\s+/).filter(Boolean)) tokens.push({ word, marked });
  }
  return tokens;
}

const MIN_OPACITY = 0.2;

interface WordProps {
  token: Token;
  progress: MotionValue<number>;
  range: [number, number];
  still: boolean;
}

function Word({ token, progress, range, still }: WordProps) {
  const opacity = useTransform(progress, range, still ? [1, 1] : [MIN_OPACITY, 1]);
  const marker = useTransform(progress, [range[0], range[1] + 0.08], still ? [1, 1] : [0, 1]);
  return (
    <span className={clsx("fill__word", token.marked && "fill__word--marked")}>
      <motion.span style={{ opacity }}>{token.word}</motion.span>
      {token.marked && <motion.span aria-hidden="true" className="fill__marker" style={{ scaleX: marker }} />}
    </span>
  );
}

export interface ScrollWordFillProps {
  text: string;
  className?: string;
}

/** Paragraph whose words brighten from 20% to 100% as it scrolls through the viewport. */
export function ScrollWordFill({ text, className }: ScrollWordFillProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const still = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const tokens = tokenize(text);

  return (
    <p ref={ref} className={clsx("fill", className)}>
      {tokens.map((t, i) => {
        const start = i / tokens.length;
        return (
          <span key={i}>
            <Word token={t} progress={scrollYProgress} range={[start, start + 1 / tokens.length]} still={still} />{" "}
          </span>
        );
      })}
    </p>
  );
}
