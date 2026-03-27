"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGas } from "@/providers/GasProvider";
import { GASBOT_MESSAGES } from "@/lib/constants";

export function ChatPanel() {
  const { stressLevel, stressConfig, isGasBotActivated, toggleGasBot } = useGas();
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const lastLevel = useRef(stressLevel);
  const [messages, setMessages] = useState<{ id: string; text: string; ts: number }[]>(() => [
    { id: "welcome", text: "Hey! I'm GasBot 🤖 I'll keep you updated on network vibes!", ts: Date.now() },
  ]);

  const pickMessage = useMemo(() => {
    const list = GASBOT_MESSAGES[stressLevel];
    return list[Math.floor(Math.random() * list.length)];
  }, [stressLevel]);

  // If the user re-activates GasBot, always reopen the panel.
  useEffect(() => {
    if (!isGasBotActivated) return;
    setIsOpen(true);
  }, [isGasBotActivated]);

  useEffect(() => {
    if (!isGasBotActivated) return;
    if (lastLevel.current === stressLevel) return;
    lastLevel.current = stressLevel;

    setIsTyping(true);
    const t = window.setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: `${Date.now()}`, text: pickMessage, ts: Date.now() }].slice(-20));
    }, 1200);
    return () => window.clearTimeout(t);
  }, [isGasBotActivated, pickMessage, stressLevel]);

  if (!isGasBotActivated || !isOpen) return null;
  return (
    <aside className="glass fixed bottom-4 right-4 z-50 w-80 overflow-hidden text-sm" style={{ border: `1px solid ${stressConfig.color}` }}>
      <div className="flex items-center justify-between px-3 py-2" style={{ background: "rgba(0,0,0,0.25)" }}>
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-full" style={{ background: `linear-gradient(135deg, ${stressConfig.color}, #ffffff)` }}>🤖</div>
          <div className="font-semibold">GasBot</div>
          <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: stressConfig.color }} />
        </div>
        <div className="flex items-center gap-2">
          <button className="glass px-2 py-1" onClick={() => setIsMinimized((v) => !v)}>{isMinimized ? "▴" : "▾"}</button>
          <button
            className="glass px-2 py-1"
            onClick={() => {
              // Close panel and turn GasBot toggle OFF, so header button resets.
              toggleGasBot();
              setIsOpen(false);
              setIsMinimized(false);
            }}
          >
            ✕
          </button>
        </div>
      </div>
      {!isMinimized ? (
        <div className="max-h-80 overflow-auto p-3 overscroll-contain" data-lenis-prevent="true">
          <div className="space-y-2">
            {messages.map((m) => (
              <div key={m.id} className="glass p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                {m.text}
              </div>
            ))}
            {isTyping ? <div className="text-zinc-400">GasBot is typing…</div> : null}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
