"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Sphère de points reliés, monochrome : seul élément 3D de la console. */
function Network({ still }: { still: boolean }) {
  const group = useRef<THREE.Group>(null!);

  const { points, lines, highlights } = useMemo(() => {
    const N = 200;
    const R = 1.6;
    const pts: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      pts.push(new THREE.Vector3(Math.cos(t) * r * R, y * R, Math.sin(t) * r * R));
    }
    const pos = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => p.toArray(pos, i * 3));
    const seg: number[] = [];
    pts.forEach((p, i) => {
      pts
        .map((q, j) => ({ j, d: p.distanceToSquared(q) }))
        .filter((o) => o.j > i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach(({ j }) => seg.push(...p.toArray(), ...pts[j].toArray()));
    });
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const lg = new THREE.BufferGeometry();
    lg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(seg), 3));
    return { points: pg, lines: lg, highlights: [7, 41, 88, 132, 171].map((i) => pts[i]) };
  }, []);

  useFrame((_, dt) => {
    if (!still) group.current.rotation.y += dt * 0.07;
  });

  return (
    <group ref={group} rotation={[0.35, 0, 0]}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#9aa3b2" transparent opacity={0.18} />
      </lineSegments>
      <points geometry={points}>
        <pointsMaterial color="#c9cfd9" size={0.03} sizeAttenuation transparent opacity={0.7} />
      </points>
      {highlights.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#3ddc97" />
        </mesh>
      ))}
    </group>
  );
}

export default function Globe() {
  const still = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 40 }} gl={{ antialias: true, alpha: true }} style={{ pointerEvents: "none" }} aria-hidden="true">
      <Network still={still} />
    </Canvas>
  );
}
