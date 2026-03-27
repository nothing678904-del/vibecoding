import { LIVE_THRESHOLDS, STRESS_CONFIGS, StressLevel } from "@/lib/constants";

export type GasData = { safe: number; average: number; fast: number };

export const getStressLevel = (gwei: number): StressLevel =>
  (LIVE_THRESHOLDS.find((x) => gwei <= x.max)?.level ?? "critical") as StressLevel;

export const getStressConfigFromGwei = (gwei: number) => STRESS_CONFIGS[getStressLevel(gwei)];

export const fetchLiveGas = async (key: string): Promise<GasData> => {
  const _unused = key;
  const res = await fetch("/api/gas", { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Failed to fetch /api/gas");
  if (json?.error) throw new Error(json.error);
  return {
    safe: Number(json?.safe ?? 0),
    average: Number(json?.average ?? 0),
    fast: Number(json?.fast ?? 0),
  };
};
