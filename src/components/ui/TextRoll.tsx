import type { CSSProperties } from "react";
import clsx from "clsx";

export interface TextRollProps {
  text: string;
  href: string;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
}

/** Link whose letters roll vertically, one after another, on hover/focus (pure CSS). */
export function TextRoll({ text, href, className, external, ariaLabel }: TextRollProps) {
  const letters = Array.from(text);
  return (
    <a
      href={href}
      className={clsx("roll", className)}
      aria-label={ariaLabel ?? text}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="roll__inner" aria-hidden="true">
        {letters.map((ch, i) => (
          <span key={i} className="roll__ch" style={{ "--i": i } as CSSProperties} data-ch={ch}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </a>
  );
}
