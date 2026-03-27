"use client";
import { useStress } from "@/hooks/useStress";

export function StressGauge() {
  const { stressConfig, stressPercent } = useStress();
  const r = 80;
  const c = 2 * Math.PI * r;
  const offset = c - (stressPercent / 100) * c;
  return (
    <svg viewBox="0 0 200 200" className="h-56 w-56">
      <circle cx="100" cy="100" r={r} stroke="currentColor" strokeWidth="12" fill="none" opacity="0.15" />
      <circle cx="100" cy="100" r={r} stroke={stressConfig.color} strokeWidth="12" fill="none" strokeDasharray={c} strokeDashoffset={offset} transform="rotate(-90 100 100)" />
      <text x="100" y="88" textAnchor="middle" fontSize="24">{stressConfig.emoji}</text>
      <text x="100" y="110" textAnchor="middle" fontSize="14">{stressConfig.label}</text>
    </svg>
  );
}
