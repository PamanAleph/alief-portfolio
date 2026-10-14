import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, MathUtils, type ShaderMaterial } from "three";
import { getScene, type SectionId } from "../../lib/sceneStore";
import { accentHex } from "../../lib/theme";
import { particleFragment, particleVertex } from "./shaders";

const SPREAD = { x: 14, y: 9, z: 6 };

const OPACITY: Record<SectionId, number> = {
  hero: 0.25,
  marquee: 0.5,
  about: 0.95,
  work: 0.3,
  stack: 0.55,
  journey: 0.45,
  principles: 0.2,
  contact: 0.6,
  footer: 0.15,
  page: 0.4,
};

export interface ParticleFieldProps {
  count: number;
}

/** Drifting point cloud tinted with the active accent; bursts outward on CTA hover. */
export function ParticleField({ count }: ParticleFieldProps) {
  const material = useRef<ShaderMaterial>(null);
  const dpr = useThree((s) => s.viewport.dpr);
  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPREAD.x;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD.z - 1;
      seeds[i] = Math.random();
    }
    g.setAttribute("position", new BufferAttribute(positions, 3));
    g.setAttribute("aSeed", new BufferAttribute(seeds, 1));
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 3.2 },
      uBurst: { value: 0 },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0 },
      uColor: { value: new Color(accentHex.violet) },
    }),
    [],
  );
  const target = useMemo(() => new Color(), []);

  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    const scene = getScene();
    const dt = Math.min(delta, 0.05);
    u.uTime.value = state.clock.elapsedTime;
    u.uPixelRatio.value = dpr;
    u.uOpacity.value = MathUtils.damp(u.uOpacity.value, OPACITY[scene.section], 2, dt);
    u.uBurst.value = MathUtils.damp(u.uBurst.value, scene.ctaHover ? 1.4 : 0, scene.ctaHover ? 6 : 2, dt);
    target.set(accentHex[scene.accent]);
    (u.uColor.value as Color).lerp(target, 1 - Math.exp(-3 * dt));
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
