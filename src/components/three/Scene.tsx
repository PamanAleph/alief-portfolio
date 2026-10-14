import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";
import { getScene } from "../../lib/sceneStore";
import { tierSettings } from "../../lib/capabilities";
import { SignatureObject } from "./SignatureObject";
import { ParticleField } from "./ParticleField";

const FPS_SAMPLE = 90;
const FPS_FLOOR = 45;

/** Camera drifts with the pointer so WebGL depth matches the DOM parallax layers. */
function CameraRig() {
  useFrame(({ camera }, delta) => {
    const { pointer } = getScene();
    const dt = Math.min(delta, 0.05);
    camera.position.x = MathUtils.damp(camera.position.x, pointer.x * 0.35, 2, dt);
    camera.position.y = MathUtils.damp(camera.position.y, pointer.y * 0.2, 2, dt);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/** Steps pixel ratio down once if the average frame rate stays low. */
function AdaptiveDpr() {
  const setDpr = useThree((s) => s.setDpr);
  const frames = useRef<number[]>([]);
  const lowered = useRef(false);
  useFrame((_, delta) => {
    if (lowered.current) return;
    frames.current.push(delta);
    if (frames.current.length < FPS_SAMPLE) return;
    const avg = frames.current.reduce((a, b) => a + b, 0) / frames.current.length;
    frames.current = [];
    if (1 / avg < FPS_FLOOR) {
      lowered.current = true;
      setDpr(1);
    }
  });
  return null;
}

export interface SceneProps {
  tier: "low" | "high";
  /** Called when the WebGL context is lost, so the parent can show the poster. */
  onLost: () => void;
  onReady: () => void;
}

/** The single persistent canvas behind all home-page content. */
export default function Scene({ tier, onLost, onReady }: SceneProps) {
  const settings = tierSettings[tier];
  const [active, setActive] = useState(true);

  useEffect(() => {
    const onVisibility = () => setActive(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <Canvas
      dpr={settings.dpr}
      frameloop={active ? "always" : "demand"}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onLost();
        });
        onReady();
      }}
    >
      <CameraRig />
      <AdaptiveDpr />
      <ParticleField count={settings.particles} />
      <SignatureObject detail={settings.detail} />
    </Canvas>
  );
}
