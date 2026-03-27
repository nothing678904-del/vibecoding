"use client";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { STRESS_CONFIGS, type StressConfig, type StressLevel } from "@/lib/constants";
import { useGasHistory } from "@/hooks/useGasHistory";
import { fetchLiveGas, getStressLevel } from "@/services/gasService";

type GasData = { safe: number; average: number; fast: number };

type GasCtx = {
  gasData: GasData | null;
  stressLevel: StressLevel;
  stressConfig: StressConfig;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  overrideGwei: number | null;
  setOverrideGwei: (gwei: number | null) => void;
  isGasBotActivated: boolean;
  activateGasBot: () => void;
  toggleGasBot: () => void;
  gasHistory: { ts: number; average: number }[];
};

const GasContext = createContext<GasCtx | null>(null);

export function GasProvider({ children }: { children: React.ReactNode }) {
  const [gasData, setGasData] = useState<GasData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [overrideGwei, _setOverrideGwei] = useState<number | null>(null);
  const overrideGweiRef = useRef<number | null>(null);
  const setOverrideGwei = (gwei: number | null) => _setOverrideGwei(gwei);

  const overrideRatiosRef = useRef<{ safeRatio: number; fastRatio: number } | null>(null);

  const [isGasBotActivated, setIsGasBotActivated] = useState(false);
  const { history, loadHistory, addReading } = useGasHistory();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    overrideGweiRef.current = overrideGwei;
  }, [overrideGwei]);

  useEffect(() => {
    // Freeze safe/fast ratios while overriding so UI doesn't flicker on live updates.
    if (overrideGwei === null) {
      overrideRatiosRef.current = null;
      return;
    }
    if (!overrideRatiosRef.current && gasData) {
      const baseAvg = gasData.average || 1;
      overrideRatiosRef.current = {
        safeRatio: gasData.safe / baseAvg,
        fastRatio: gasData.fast / baseAvg,
      };
    }
  }, [overrideGwei, gasData]);

  useEffect(() => {
    let cancelled = false;
    let timer: NodeJS.Timeout;

    const tick = async () => {
      if (cancelled) return;
      setIsLoading(false);

      try {
        const next = await fetchLiveGas(process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "");
        setGasData(next);
        setError(null);

        const readingAvg = overrideGweiRef.current ?? next.average;
        addReading({ ts: Date.now(), average: readingAvg });
        setLastUpdated(new Date());
      } catch (e) {
        setError("Failed to fetch live gas (server).");
      }

      timer = setTimeout(tick, 10000);
    };

    tick();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [addReading]);

  const effectiveGasData = useMemo<GasData | null>(() => {
    if (!gasData) return null;
    if (overrideGwei === null) return gasData;

    const ratios = overrideRatiosRef.current;
    const baseAvg = gasData.average || 1;
    const safeRatio = ratios?.safeRatio ?? gasData.safe / baseAvg;
    const fastRatio = ratios?.fastRatio ?? gasData.fast / baseAvg;
    return {
      safe: Math.max(0, safeRatio * overrideGwei),
      average: overrideGwei,
      fast: Math.max(0, fastRatio * overrideGwei),
    };
  }, [gasData, overrideGwei]);

  const effectiveAverage = effectiveGasData?.average ?? 0;
  const stressLevel = useMemo(() => getStressLevel(effectiveAverage), [effectiveAverage]);
  const stressConfig = STRESS_CONFIGS[stressLevel];

  useEffect(() => {
    document.documentElement.style.setProperty("--stress-color", stressConfig.color);
  }, [stressConfig.color]);

  const value = useMemo<GasCtx>(
    () => ({
      gasData: effectiveGasData,
      stressLevel,
      stressConfig,
      isLoading,
      error,
      lastUpdated,
      overrideGwei,
      setOverrideGwei,
      isGasBotActivated,
      activateGasBot: () => setIsGasBotActivated(true),
      toggleGasBot: () => setIsGasBotActivated((v) => !v),
      gasHistory: history,
    }),
    [
      effectiveGasData,
      stressLevel,
      stressConfig,
      isLoading,
      error,
      lastUpdated,
      overrideGwei,
      isGasBotActivated,
      history,
    ],
  );

  return <GasContext.Provider value={value}>{children}</GasContext.Provider>;
}

export const useGas = () => {
  const ctx = useContext(GasContext);
  if (!ctx) throw new Error("useGas must be used within GasProvider");
  return ctx;
};
