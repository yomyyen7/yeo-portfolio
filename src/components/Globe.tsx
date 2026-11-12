"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Sphère de points reliés : un réseau, sobre et monochrome.
 * Seul élément 3D du site ; il tourne lentement et suit légèrement le pointeur.
 */
function Network({ ink, accent, still }: { ink: string; accent: string; still: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const pointer = useRef({ x: 0, y: 0 });

  const { points, lines, highlights } = useMemo(() => {
    const N = 220;
    const R = 1.6;
    const pts: THREE.Vector3[] = [];
    // Répartition régulière sur la sphère (spirale de Fibonacci).
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      pts.push(new THREE.Vector3(Math.cos(t) * r * R, y * R, Math.sin(t) * r * R));
    }

    const pos = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => p.toArray(pos, i * 3));

    // Chaque point est relié à ses deux plus proches voisins.
    const seg: number[] = [];
    pts.forEach((p, i) => {
      pts
        .map((q, j) => ({ j, d: p.distanceToSquared(q) }))
        .filter((o) => o.j > i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach(({ j }) => seg.push(...p.toArray(), ...pts[j].toArray()));
    });

    // Quelques nœuds mis en évidence.
    const hi = [7, 41, 88, 132, 171, 203].map((i) => pts[i]);

    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const lg = new THREE.BufferGeometry();
    lg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(seg), 3));
    return { points: pg, lines: lg, highlights: hi };
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((_, dt) => {
    const g = group.current;
    if (!still) g.rotation.y += dt * 0.08;
    g.rotation.x += (pointer.current.y * 0.25 + 0.35 - g.rotation.x) * 0.04;
    g.rotation.z += (-pointer.current.x * 0.12 - g.rotation.z) * 0.04;
  });

  return (
    <group ref={group} rotation={[0.35, 0, 0]}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={ink} transparent opacity={0.22} />
      </lineSegments>
      <points geometry={points}>
        <pointsMaterial color={ink} size={0.035} sizeAttenuation transparent opacity={0.75} />
      </points>
      {highlights.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      ))}
    </group>
  );
}

export default function Globe() {
  const dark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const still = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Network ink={dark ? "#e8e6e1" : "#1b1b1f"} accent={dark ? "#4fb28f" : "#1f6b52"} still={still} />
    </Canvas>
  );
}
