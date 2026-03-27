"use client";
import { useGas } from "@/providers/GasProvider";

export function GasCounter({ size = "lg" }: { size?: "lg" | "md" | "sm" }) {
  const { gasData, stressConfig } = useGas();
  const cls = size === "lg" ? "text-5xl" : size === "md" ? "text-2xl" : "text-sm";
  return <div className={`${cls} font-mono font-semibold`} style={{ color: stressConfig.color }}>{(gasData?.average ?? 0).toFixed(2)} gwei</div>;
}
