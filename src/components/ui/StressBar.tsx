"use client";
import { useGas } from "@/providers/GasProvider";

export function StressBar() {
  const { gasData } = useGas();
  // Calibrated for modern ranges: most values are 0–3 gwei.
  const max = 8;
  const pos = Math.min(100, ((gasData?.average ?? 0) / max) * 100);
  return <div className="relative h-3 rounded-full" style={{ background: "linear-gradient(to right,#06d6a0,#118ab2,#ffd166,#ef476f,#ff006e)" }}><div className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white" style={{ left: `calc(${pos}% - 8px)` }} /></div>;
}
