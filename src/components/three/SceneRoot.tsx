import { useEffect, useState, type ComponentType } from "react";
import { detectTier, type Tier } from "../../lib/capabilities";
import type { SceneProps } from "./Scene";

const IDLE_TIMEOUT_MS = 1500;
const NO_WEBGL_CLASS = "no-webgl";

/**
 * Picks a quality tier, then lazy-loads the WebGL scene after first paint.
 * Under reduced motion, without WebGL, or after a lost context it marks the
 * document `no-webgl` so the static CSS poster shows instead.
 */
export default function SceneRoot() {
  const [tier, setTier] = useState<Tier>("off");
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const detected = detectTier();
    if (detected === "off") {
      document.documentElement.classList.add(NO_WEBGL_CLASS);
      return;
    }
    setTier(detected);
    let cancelled = false;
    const load = () => {
      import("./Scene")
        .then((mod) => {
          if (!cancelled) setScene(() => mod.default);
        })
        .catch(() => document.documentElement.classList.add(NO_WEBGL_CLASS));
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: IDLE_TIMEOUT_MS })
      : window.setTimeout(load, IDLE_TIMEOUT_MS);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  const handleLost = () => {
    document.documentElement.classList.add(NO_WEBGL_CLASS);
    setScene(null);
  };

  if (tier === "off" || !Scene) return null;
  return (
    <div className="scene" data-ready={ready || undefined} aria-hidden="true">
      <Scene tier={tier} onLost={handleLost} onReady={() => setReady(true)} />
    </div>
  );
}
