"use client";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo } from "react";
import { StressConfig } from "@/lib/constants";

export function ParticleField({ stressConfig }: { stressConfig: StressConfig }) {
  const positions = useMemo(() => Float32Array.from({ length: 3000 }, () => (Math.random() - 0.5) * 6), [stressConfig.level]);
  return <Points positions={positions as unknown as number[]} stride={3}><PointMaterial size={0.01} color={stressConfig.color} /></Points>;
}
