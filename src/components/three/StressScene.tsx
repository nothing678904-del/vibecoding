"use client";
import { Canvas } from "@react-three/fiber";
import { useGas } from "@/providers/GasProvider";
import { MorphBlob } from "@/components/three/MorphBlob";
import { ParticleField } from "@/components/three/ParticleField";
import { useEffect, useState } from "react";

if (typeof console !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args.length > 0 && typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
    originalWarn(...args);
  };
}

export default function StressScene() {
  const { stressConfig } = useGas();
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    setWebglReady(Boolean(gl));
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-black">
      {webglReady ? (
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[2, 2, 2]} intensity={0.5} />
          <MorphBlob stressConfig={stressConfig} />
          <ParticleField stressConfig={stressConfig} />
        </Canvas>
      ) : null}
    </div>
  );
}
