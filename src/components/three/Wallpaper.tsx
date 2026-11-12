"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Core, NeuralNet, Particles, Shield, GREEN, ORANGE } from "./models";

export type WallpaperId = "core" | "net" | "shield";

function Scene({ calm, variant }: { calm: boolean; variant: WallpaperId }) {
  const pointer = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    if (calm) return;
    const cam = state.camera;
    cam.position.x += (pointer.current.x * 0.7 - cam.position.x) * 0.03;
    cam.position.y += (-pointer.current.y * 0.4 + 0.3 - cam.position.y) * 0.03;
    cam.lookAt(0, 0, 0);
  });

  // Sur grand écran, le modèle se décale à droite pour laisser respirer les icônes.
  const wide = viewport.width > 9;
  const x = wide ? viewport.width * 0.2 : 0;
  const scale = (wide ? 1 : 0.72) * (variant === "core" ? 1 : variant === "net" ? 1.02 : 1.25);

  return (
    <>
      <color attach="background" args={["#07090f"]} />
      <fog attach="fog" args={["#07090f", 9, 26]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#fff1e0" />
      <pointLight position={[-6, -2, 2]} intensity={40} color={GREEN} />
      <pointLight position={[6, 3, -4]} intensity={30} color={ORANGE} />
      <group position={[x, wide ? 0.2 : 0.9, 0]} scale={scale}>
        {variant === "core" && <Core calm={calm} />}
        {variant === "net" && <NeuralNet />}
        {variant === "shield" && <Shield />}
      </group>
      <Particles />
      <gridHelper args={[80, 80, "#2a3350", "#161b2c"]} position={[0, -3.2, 0]} />
      <EffectComposer>
        <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.42} luminanceSmoothing={0.3} radius={0.75} />
      </EffectComposer>
    </>
  );
}

export default function Wallpaper({ variant = "core" }: { variant?: WallpaperId }) {
  const calm =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Canvas
      className="wallpaper-canvas"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.3, 8.5], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Scene calm={calm} variant={variant} />
    </Canvas>
  );
}
