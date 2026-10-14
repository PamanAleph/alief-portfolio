import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, IcosahedronGeometry, MathUtils, type Mesh, type ShaderMaterial } from "three";
import { getScene, type SectionId } from "../../lib/sceneStore";
import { accentHex, accentPair } from "../../lib/theme";
import { objectFragment, objectVertex } from "./shaders";

/** Target state for the object while a section is active. x/y are viewport fractions (-1…1). */
interface Pose {
  x: number;
  y: number;
  z: number;
  scale: number;
  amp: number;
  freq: number;
  oct: number;
  cube: number;
  opacity: number;
}

const BASE: Pose = { x: 0.42, y: 0.05, z: 0, scale: 1, amp: 0.26, freq: 1.4, oct: 0, cube: 0, opacity: 1 };

const POSES: Record<SectionId, Partial<Pose>> = {
  hero: {},
  marquee: { x: 0.62, y: 0.45, z: -1, scale: 0.45 },
  about: { x: 0.72, y: 0.55, z: -1, scale: 0.32 },
  work: { x: -0.7, y: -0.5, z: -2, scale: 0.5, opacity: 0.55 },
  stack: { x: 0.7, y: -0.45, z: -1.5, scale: 0.42, freq: 2.2 },
  journey: { x: -0.72, y: 0.4, z: -1.5, scale: 0.38 },
  principles: { x: 0.55, y: 0, scale: 0.85 },
  contact: { x: 0.5, y: 0.1, scale: 0.7, amp: 0.05, freq: 1.1 },
  footer: { x: 0, y: -0.6, z: -2, scale: 0.5, opacity: 0.25, amp: 0.05 },
  page: { x: 0.6, y: 0.3, z: -1, scale: 0.6 },
};

/** Principle-specific morph presets: spiky blob → octahedron → cube. */
const MORPHS: Partial<Pose>[] = [
  { amp: 0.42, freq: 2.4 },
  { oct: 1, amp: 0.07, freq: 3 },
  { cube: 1, amp: 0.05, freq: 3 },
];

const LAMBDA = 3.2;
const NARROW_ASPECT = 0.9;

export interface SignatureObjectProps {
  detail: number;
}

/** Shader-driven hero object that changes pose, shape and colour per section. */
export function SignatureObject({ detail }: SignatureObjectProps) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const { viewport, size } = useThree();
  const geometry = useMemo(() => new IcosahedronGeometry(1, detail), [detail]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: [0, 0] as [number, number] },
      uScroll: { value: 0 },
      uAmp: { value: BASE.amp },
      uFreq: { value: BASE.freq },
      uOct: { value: 0 },
      uCube: { value: 0 },
      uPulse: { value: 0 },
      uOpacity: { value: 0 },
      uColorA: { value: new Color(accentHex.violet) },
      uColorB: { value: new Color(accentHex.pink) },
    }),
    [],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  const targetA = useMemo(() => new Color(), []);
  const targetB = useMemo(() => new Color(), []);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const scene = getScene();
    const dt = Math.min(delta, 0.05);
    const narrow = size.width / size.height < NARROW_ASPECT;
    const morph = scene.section === "principles" && scene.morph >= 0 ? MORPHS[scene.morph % MORPHS.length] : {};
    const pose: Pose = { ...BASE, ...POSES[scene.section], ...morph };

    let x = pose.x;
    let y = pose.y;
    if (scene.section === "contact") {
      x += scene.pointer.x * 0.2;
      y += scene.pointer.y * 0.2;
    }
    if (narrow && scene.section === "hero") {
      x = 0;
      y = 0.32;
    }

    const half = { w: viewport.width / 2, h: viewport.height / 2 };
    const unit = Math.min(viewport.width, viewport.height) * (narrow ? 0.36 : 0.3);
    const pulse = scene.ctaHover ? 1 : 0;

    m.position.x = MathUtils.damp(m.position.x, x * half.w, LAMBDA, dt);
    m.position.y = MathUtils.damp(m.position.y, y * half.h, LAMBDA, dt);
    m.position.z = MathUtils.damp(m.position.z, pose.z, LAMBDA, dt);
    const s = MathUtils.damp(m.scale.x, pose.scale * unit * (1 + pulse * 0.08), LAMBDA, dt);
    m.scale.setScalar(s);
    m.rotation.y += dt * (0.12 + Math.min(Math.abs(scene.velocity), 60) * 0.004);
    m.rotation.x = MathUtils.damp(m.rotation.x, scene.pointer.y * 0.35, 2, dt);

    const u = material.current?.uniforms;
    if (!u) return;
    u.uTime.value = state.clock.elapsedTime;
    u.uScroll.value = scene.progress;
    u.uMouse.value = [scene.pointer.x, scene.pointer.y];
    u.uAmp.value = MathUtils.damp(u.uAmp.value, pose.amp, LAMBDA, dt);
    u.uFreq.value = MathUtils.damp(u.uFreq.value, pose.freq, LAMBDA, dt);
    u.uOct.value = MathUtils.damp(u.uOct.value, pose.oct, LAMBDA, dt);
    u.uCube.value = MathUtils.damp(u.uCube.value, pose.cube, LAMBDA, dt);
    u.uPulse.value = MathUtils.damp(u.uPulse.value, pulse * (0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 8)), 8, dt);
    u.uOpacity.value = MathUtils.damp(u.uOpacity.value, pose.opacity, 2.5, dt);
    targetA.set(accentHex[scene.accent]);
    targetB.set(accentHex[accentPair[scene.accent]]);
    const k = 1 - Math.exp(-LAMBDA * dt);
    (u.uColorA.value as Color).lerp(targetA, k);
    (u.uColorB.value as Color).lerp(targetB, k);
  });

  return (
    <mesh ref={mesh} geometry={geometry} scale={0.01}>
      <shaderMaterial
        ref={material}
        vertexShader={objectVertex}
        fragmentShader={objectFragment}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
