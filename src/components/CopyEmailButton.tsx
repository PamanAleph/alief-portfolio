import { useState } from "react";

const EMAIL = "aliefbuscode@gmail.com";

export default function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }

  return (
    <button
      type="button"
      className="copy-btn"
      data-state={copied ? "copied" : undefined}
      onClick={handleCopy}
      onMouseLeave={() => setCopied(false)}
    >
      <span className="copy-btn__label">
        {copied ? "Copied" : EMAIL}
      </span>
    </button>
  );
}
