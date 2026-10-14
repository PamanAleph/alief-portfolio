import { useEffect } from "react";
import Lenis from "lenis";
import { getScene, SECTION_EVENT, type SectionEventDetail, type SectionId } from "../../lib/sceneStore";
import { accentHex, BG, INK, inkOn } from "../../lib/theme";
import { prefersReducedMotion } from "../../lib/capabilities";
import type { AccentName } from "../../data/content";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const NAV_OFFSET = -88;

function isAccent(v: string | undefined): v is AccentName {
  return v !== undefined && v in accentHex;
}

/** Applies a section's theme to the page and the shared scene store. */
function applySection(el: HTMLElement) {
  const scene = getScene();
  const id = (el.dataset.section ?? "page") as SectionId;
  const accent = isAccent(el.dataset.accent) ? el.dataset.accent : scene.accent;
  const bgName = el.dataset.bg;
  const bg = isAccent(bgName) ? accentHex[bgName] : BG;
  const ink = isAccent(bgName) ? inkOn[bgName] : INK;
  const root = document.documentElement.style;
  root.setProperty("--accent", accentHex[accent]);
  if (bgName !== "inherit") {
    root.setProperty("--page-bg", bg);
    root.setProperty("--page-ink", ink);
    document.documentElement.dataset.pageBg = isAccent(bgName) ? "accent" : "dark";
  }
  scene.section = id;
  scene.accent = accent;
  scene.morph = el.dataset.morph !== undefined ? Number(el.dataset.morph) : -1;
  const detail: SectionEventDetail = { id, accent, label: el.dataset.label ?? "" };
  window.dispatchEvent(new CustomEvent<SectionEventDetail>(SECTION_EVENT, { detail }));
}

/**
 * Global scroll layer: Lenis smooth scrolling (skipped under reduced motion),
 * scroll/pointer values for the 3D store, and the per-section colour observer.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const scene = getScene();
    let lenis: Lenis | undefined;

    const onNativeScroll = () => {
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      scene.progress = limit > 0 ? window.scrollY / limit : 0;
    };

    if (!prefersReducedMotion()) {
      lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: NAV_OFFSET } });
      window.__lenis = lenis;
      lenis.on("scroll", (l: Lenis) => {
        scene.progress = l.progress;
        scene.velocity = l.velocity;
      });
    } else {
      window.addEventListener("scroll", onNativeScroll, { passive: true });
    }

    const onPointer = (e: PointerEvent) => {
      scene.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scene.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) applySection(entry.target as HTMLElement);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    if (sections[0]) applySection(sections[0]);

    return () => {
      io.disconnect();
      lenis?.destroy();
      window.__lenis = undefined;
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return null;
}

/** Smooth-scrolls to a target via Lenis when active, natively otherwise. */
export function scrollToTarget(target: string | number) {
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset: typeof target === "string" ? NAV_OFFSET : 0 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target });
  else document.querySelector(target)?.scrollIntoView();
}
