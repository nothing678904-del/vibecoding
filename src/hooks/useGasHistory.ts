"use client";
import { useCallback, useMemo, useState } from "react";

export type GasReading = { ts: number; average: number };
const KEY = "gasmood_history";

export function useGasHistory() {
  const [history, setHistory] = useState<GasReading[]>([]);

  const loadHistory = useCallback(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? (JSON.parse(raw) as GasReading[]) : [];
      setHistory(parsed);
      return parsed;
    } catch {
      return [];
    }
  }, []);

  const addReading = useCallback((reading: GasReading) => {
    setHistory((prev) => {
      const next = [...prev, reading].slice(-50);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch {}
    setHistory([]);
  }, []);

  const recentReadings = useMemo(() => history.slice(-20), [history]);
  return { history, loadHistory, addReading, clearHistory, recentReadings };
}
