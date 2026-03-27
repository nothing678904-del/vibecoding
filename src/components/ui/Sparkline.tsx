"use client";
import { useGas } from "@/providers/GasProvider";

export function Sparkline() {
  const { gasHistory, stressConfig } = useGas();
  const points = gasHistory.slice(-12);
  if (!points.length) return <svg viewBox="0 0 100 30" className="h-10 w-full" />;
  const max = Math.max(...points.map((p) => p.average), 1);
  const min = Math.min(...points.map((p) => p.average), 0);
  const poly = points.map((p, i) => `${(i / Math.max(1, points.length - 1)) * 100},${30 - ((p.average - min) / Math.max(1, max - min)) * 28}`).join(" ");
  return <svg viewBox="0 0 100 30" className="h-10 w-full"><polyline fill="none" stroke={stressConfig.color} strokeWidth="2" points={poly} /></svg>;
}
