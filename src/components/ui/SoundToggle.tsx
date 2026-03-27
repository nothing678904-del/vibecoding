"use client";
import { useSound } from "@/providers/SoundProvider";

export function SoundToggle() {
  const { isMuted, toggleSound } = useSound();
  return <button onClick={toggleSound} className="glass px-3 py-1 text-sm">{isMuted ? "🔇" : "🔊"}</button>;
}
