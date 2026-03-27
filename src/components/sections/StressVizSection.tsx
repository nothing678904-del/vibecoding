"use client";
import { StressGauge } from "@/components/ui/StressGauge";
import { StressBar } from "@/components/ui/StressBar";
import { Sparkline } from "@/components/ui/Sparkline";
import { useGas } from "@/providers/GasProvider";

export function StressVizSection() {
  const { gasData, stressConfig, lastUpdated, error } = useGas();
  return <section id="visualize" className="min-h-screen px-6 py-24"><div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2"><div className="glass p-6"><StressGauge /><p className="text-xl font-semibold">{(gasData?.average ?? 0).toFixed(2)} gwei</p><p>{stressConfig.emoji} {stressConfig.label}</p><p className="text-sm text-zinc-400">Last updated: {lastUpdated?.toLocaleTimeString() ?? "--"} (LIVE)</p>{error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}</div><div className="glass p-6"><p>Safe: {(gasData?.safe ?? 0).toFixed(2)} gwei</p><p>Standard: {(gasData?.average ?? 0).toFixed(2)} gwei</p><p>Fast: {(gasData?.fast ?? 0).toFixed(2)} gwei</p><p className="mt-3 text-xs text-zinc-400">Source: Etherscan Gas Oracle</p><Sparkline /></div></div><div className="mx-auto mt-6 max-w-6xl"><StressBar /></div></section>;
}
