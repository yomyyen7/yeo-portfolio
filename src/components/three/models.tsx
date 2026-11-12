"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export const ORANGE = "#ff8a2a";
export const GREEN = "#22c98a";

/** Noyau : sphère organique déformée, cage filaire et anneaux en orbite. */
export function Core({ wire = false, calm = false }: { wire?: boolean; calm?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const cage = useRef<THREE.Mesh>(null!);
  const rings = useRef<THREE.Group>(null!);
  const k = calm ? 0.25 : 1;

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    group.current.rotation.y += dt * 0.12 * k;
    cage.current.rotation.x -= dt * 0.1 * k;
    cage.current.rotation.z += dt * 0.07 * k;
    rings.current.rotation.z = t * 0.15 * k;
    rings.current.rotation.x = Math.sin(t * 0.2 * k) * 0.35 + 1.1;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.2, 14]} />
        <MeshDistortMaterial
          color={ORANGE}
          emissive="#ff4d00"
          emissiveIntensity={0.3}
          roughness={0.22}
          metalness={0.65}
          distort={0.36}
          speed={calm ? 0.4 : 1.5}
          wireframe={wire}
        />
      </mesh>
      <mesh ref={cage} scale={1.85}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={GREEN} wireframe transparent opacity={0.32} />
      </mesh>
      <group ref={rings}>
        <mesh>
          <torusGeometry args={[2.45, 0.012, 8, 160]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[0.9, 0.4, 0]}>
          <torusGeometry args={[2.8, 0.008, 8, 160]} />
          <meshBasicMaterial color={ORANGE} transparent opacity={0.6} />
        </mesh>
        <mesh position={[2.45, 0, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color={GREEN} />
        </mesh>
      </group>
    </group>
  );
}

/** Réseau de neurones : couches de nœuds, connexions et impulsions qui circulent. */
export function NeuralNet({ wire = false }: { wire?: boolean }) {
  const layers = [4, 6, 6, 3];
  const { nodes, edges, lineGeo } = useMemo(() => {
    const nodes: THREE.Vector3[][] = layers.map((n, li) =>
      Array.from({ length: n }, (_, i) => {
        const x = (li - (layers.length - 1) / 2) * 1.5;
        const y = (i - (n - 1) / 2) * 0.72;
        const z = Math.sin(i * 1.7 + li) * 0.35;
        return new THREE.Vector3(x, y, z);
      })
    );
    const edges: [THREE.Vector3, THREE.Vector3][] = [];
    for (let l = 0; l < nodes.length - 1; l++)
      for (const a of nodes[l]) for (const b of nodes[l + 1]) edges.push([a, b]);
    const pts = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      a.toArray(pts, i * 6);
      b.toArray(pts, i * 6 + 3);
    });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return { nodes, edges, lineGeo };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pulses = useRef<(THREE.Mesh | null)[]>([]);
  const group = useRef<THREE.Group>(null!);
  const PULSES = 18;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.25) * 0.35;
    for (let i = 0; i < PULSES; i++) {
      const m = pulses.current[i];
      if (!m) continue;
      const cycle = t * (0.35 + (i % 5) * 0.06) + i * 0.37;
      const edge = edges[(i * 13 + Math.floor(cycle) * 7) % edges.length];
      m.position.lerpVectors(edge[0], edge[1], cycle % 1);
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#8fb4ff" transparent opacity={0.22} />
      </lineSegments>
      {nodes.flatMap((layer, li) =>
        layer.map((p, i) => (
          <mesh key={`${li}-${i}`} position={p}>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial
              color={li === 0 ? GREEN : li === layers.length - 1 ? ORANGE : "#dfe6ff"}
              emissive={li === 0 ? GREEN : li === layers.length - 1 ? ORANGE : "#5b7cff"}
              emissiveIntensity={0.55}
              roughness={0.3}
              wireframe={wire}
            />
          </mesh>
        ))
      )}
      {Array.from({ length: PULSES }, (_, i) => (
        <mesh key={i} ref={(m) => { pulses.current[i] = m; }}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial color={i % 2 ? ORANGE : GREEN} />
        </mesh>
      ))}
    </group>
  );
}

/** Bouclier : forme extrudée et biseautée, symbole de la cybersécurité. */
export function Shield({ wire = false }: { wire?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const { outer, inner } = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 1.35);
    s.bezierCurveTo(0.45, 1.1, 0.85, 1.02, 1.1, 0.98);
    s.lineTo(1.1, 0.1);
    s.bezierCurveTo(1.1, -0.7, 0.55, -1.2, 0, -1.5);
    s.bezierCurveTo(-0.55, -1.2, -1.1, -0.7, -1.1, 0.1);
    s.lineTo(-1.1, 0.98);
    s.bezierCurveTo(-0.85, 1.02, -0.45, 1.1, 0, 1.35);
    const outer = new THREE.ExtrudeGeometry(s, {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.09,
      bevelSegments: 6,
      curveSegments: 32,
    });
    outer.center();
    const inner = new THREE.ExtrudeGeometry(s, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3,
      curveSegments: 32,
    });
    inner.center();
    return { outer, inner };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current.position.y = Math.sin(t * 1.1) * 0.08;
    group.current.rotation.y = Math.sin(t * 0.5) * 0.3;
  });

  return (
    <group ref={group} scale={1.15}>
      <mesh geometry={outer}>
        <meshStandardMaterial color="#2a3554" metalness={0.35} roughness={0.35} wireframe={wire} />
      </mesh>
      <mesh geometry={inner} scale={0.82} position={[0, 0, 0.2]}>
        <meshStandardMaterial
          color={GREEN}
          emissive={GREEN}
          emissiveIntensity={0.25}
          metalness={0.5}
          roughness={0.3}
          wireframe={wire}
        />
      </mesh>
      {/* Coche de validation */}
      <group position={[-0.05, -0.08, 0.36]}>
        <mesh position={[-0.3, -0.15, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.16, 0.5, 0.1]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0.2, 0.04, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.16, 1.0, 0.1]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
        </mesh>
      </group>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <torusGeometry args={[1.9, 0.01, 8, 120]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

/** Nuage de particules réparties dans une coquille sphérique. */
export function Particles({ count = 1400, radius = 9 }: { count?: number; radius?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    // Générateur déterministe : même rendu à chaque montage.
    let seed = 1337;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.35 + rnd() * 0.65);
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(2 * rnd() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius]);

  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#cfd8ff" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}
