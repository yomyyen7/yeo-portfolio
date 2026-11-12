"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Core, NeuralNet, Shield, Particles, GREEN, ORANGE } from "./models";

export type ModelId = "core" | "net" | "shield";

export default function LabCanvas({
  model,
  wire,
  spin,
  glow,
}: {
  model: ModelId;
  wire: boolean;
  spin: boolean;
  glow: boolean;
}) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0.6, 7], fov: 45 }} gl={{ antialias: true }}>
      <color attach="background" args={["#090b12"]} />
      <fog attach="fog" args={["#090b12", 10, 24]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} color="#fff1e0" />
      <pointLight position={[-5, -1, 3]} intensity={40} color={GREEN} />
      <pointLight position={[5, 3, -3]} intensity={30} color={ORANGE} />
      {model === "core" && <Core wire={wire} />}
      {model === "net" && <NeuralNet wire={wire} />}
      {model === "shield" && <Shield wire={wire} />}
      <Particles count={500} radius={8} />
      <gridHelper args={[40, 40, "#2a3350", "#161b2c"]} position={[0, -2.4, 0]} />
      <OrbitControls
        enablePan={false}
        minDistance={3.5}
        maxDistance={12}
        autoRotate={spin}
        autoRotateSpeed={1.4}
        enableDamping
      />
      {glow && (
        <EffectComposer>
          <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.42} luminanceSmoothing={0.3} radius={0.75} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
