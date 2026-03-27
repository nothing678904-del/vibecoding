"use client";
import { useFrame } from "@react-three/fiber";
import { Mesh, Color, MathUtils } from "three";
import { useRef } from "react";
import { MeshDistortMaterial } from "@react-three/drei";
import { StressConfig } from "@/lib/constants";

export function MorphBlob({ stressConfig }: { stressConfig: StressConfig }) {
  const outerMesh = useRef<Mesh>(null);
  const innerMesh = useRef<Mesh>(null);
  const coreMesh = useRef<Mesh>(null);
  const targetColor = useRef(new Color(stressConfig.color));
  const time = useRef(0);

  useFrame((_, delta) => {
    if (!outerMesh.current || !innerMesh.current || !coreMesh.current) return;
    time.current += delta;

    targetColor.current.lerp(new Color(stressConfig.color), 0.05);

    // Keep a strong baseline movement so calm still feels "alive"
    const baseSpin = Math.max(0.9, stressConfig.orbRotationSpeed * 0.9);
    const baseDistort = Math.max(0.28, stressConfig.orbDistortion * 0.85);
    const pulseAmount = 0.04 + stressConfig.orbDistortion * 0.08;
    const pulseSpeed = 2.2 + stressConfig.orbRotationSpeed * 2.2;
    const pulse = 1 + Math.sin(time.current * pulseSpeed) * pulseAmount;

    outerMesh.current.rotation.y += delta * baseSpin * 0.32;
    outerMesh.current.rotation.x = Math.sin(time.current * 0.7) * 0.08;

    innerMesh.current.rotation.x += delta * baseSpin * 0.95;
    innerMesh.current.rotation.y -= delta * baseSpin * 1.15;
    innerMesh.current.rotation.z += delta * baseSpin * 0.35;

    coreMesh.current.rotation.y += delta * baseSpin * 1.8;
    coreMesh.current.rotation.x = Math.cos(time.current * 1.3) * 0.25;

    const s = MathUtils.lerp(outerMesh.current.scale.x, stressConfig.orbScale * pulse, 0.07);
    outerMesh.current.scale.setScalar(s);
    innerMesh.current.scale.setScalar(s * (0.8 + Math.sin(time.current * 2.4) * 0.03));
    coreMesh.current.scale.setScalar(s * (0.36 + Math.cos(time.current * 3.1) * 0.025));

    const innerMat = innerMesh.current.material as MeshDistortMaterial;
    const coreMat = coreMesh.current.material as any;
    if (innerMat) {
      innerMat.color.copy(targetColor.current);
      innerMat.distort = MathUtils.lerp(innerMat.distort ?? 0.3, baseDistort, 0.1);
      innerMat.speed = MathUtils.lerp(innerMat.speed ?? 1.3, Math.max(1.35, stressConfig.orbRotationSpeed * 1.5), 0.1);
    }
    if (coreMat?.emissive) {
      coreMat.color.copy(targetColor.current);
      coreMat.emissive.copy(targetColor.current);
      coreMat.emissiveIntensity = MathUtils.lerp(coreMat.emissiveIntensity ?? 0.8, 0.8 + stressConfig.bloomIntensity * 0.4 + Math.abs(Math.sin(time.current * 3.4)) * 0.2, 0.1);
    }
  });

  return (
    <group>
      <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={1} color="#aaccff" />
      
      <mesh ref={outerMesh}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial 
          transparent={true}
          opacity={0.15}
          roughness={0}
          clearcoat={1}
          clearcoatRoughness={0}
          color="#aaccff"
          depthWrite={false}
        />
      </mesh>
      
      <mesh ref={innerMesh}>
        <icosahedronGeometry args={[0.78, 20]} />
        <MeshDistortMaterial
          color={stressConfig.color}
          emissive={stressConfig.color}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.2}
          transparent
          opacity={0.85}
          distort={Math.max(0.28, stressConfig.orbDistortion * 0.85)}
          speed={Math.max(1.35, stressConfig.orbRotationSpeed * 1.5)}
        />
      </mesh>

      {/* Bright inner seed gives the "alive core" effect */}
      <mesh ref={coreMesh}>
        <sphereGeometry args={[0.24, 48, 48]} />
        <meshStandardMaterial
          color={stressConfig.color}
          emissive={stressConfig.color}
          emissiveIntensity={0.8}
          roughness={0.25}
          metalness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}
