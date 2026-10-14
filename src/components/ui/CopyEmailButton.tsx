import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { profile } from "../../data/content";
import { spring } from "../../lib/motion";

const TOAST_MS = 2400;

export interface CopyEmailButtonProps {
  className?: string;
  label?: string;
}

/** Copies the email address and confirms with an animated toast. Falls back to mailto. */
export default function CopyEmailButton({ className, label = "Copy email" }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), TOAST_MS);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <span className="copy">
      <button type="button" className={clsx("btn btn--ghost", className)} onClick={handleCopy} data-cursor="Copy">
        {copied ? "Copied ✓" : label}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
      <AnimatePresence>
        {copied && (
          <motion.span
            className="toast"
            aria-hidden="true"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={spring.snappy}
          >
            ✓ {profile.email} copied
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
