"use client";
import { createContext, useContext, useMemo, useState } from "react";

const SoundContext = createContext<{ isMuted: boolean; toggleSound: () => void } | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);
  const value = useMemo(() => ({ isMuted, toggleSound: () => setIsMuted((v) => !v) }), [isMuted]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export const useSound = () => {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
};
