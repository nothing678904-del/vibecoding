"use client";
import { useEffect, useRef, useState } from "react";
import { useGas } from "@/providers/GasProvider";

export function StressSlider() {
  const { setOverrideGwei, overrideGwei, gasData } = useGas();
  const [sliderValue, setSliderValue] = useState<number>(gasData?.average ?? 10);
  const sliderValueRef = useRef(sliderValue);
  const rafRef = useRef<number | null>(null);
  const releaseTimerRef = useRef<number | null>(null);
  const wasOverriddenRef = useRef<boolean>(overrideGwei !== null);
  const revertingRef = useRef<boolean>(false);

  useEffect(() => {
    sliderValueRef.current = sliderValue;
  }, [sliderValue]);

  const animateTo = (to: number, durationMs = 700, onComplete?: () => void) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const from = sliderValueRef.current;
    const start = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      const next = from + (to - from) * easeOutCubic(p);
      setSliderValue(next);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        onComplete?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const liveTarget = gasData?.average ?? 10;
    const isOverridden = overrideGwei !== null;

    // While dragging/simulating, follow the slider immediately.
    if (isOverridden) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      revertingRef.current = false;
      setSliderValue(overrideGwei ?? liveTarget);
      wasOverriddenRef.current = true;
      return;
    }

    // If we just released, animate back instead of jumping.
    const justReleased = wasOverriddenRef.current === true;
    wasOverriddenRef.current = false;

    if (justReleased) {
      revertingRef.current = true;
      animateTo(liveTarget, 800, () => {
        revertingRef.current = false;
      });
      return;
    }

    // While animating back, ignore live updates to prevent flicker.
    if (revertingRef.current) return;

    // Otherwise (initial mount / gasData updates), keep value in sync.
    setSliderValue(liveTarget);
  }, [overrideGwei, gasData?.average]);

  const handleRelease = () => {
    // Return to live data after ~2 seconds, but slide back gracefully.
    if (releaseTimerRef.current) window.clearTimeout(releaseTimerRef.current);
    releaseTimerRef.current = window.setTimeout(() => setOverrideGwei(null), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <input 
        type="range" 
        min={0} 
        max={8} 
        step={0.01}
        value={sliderValue}
        onChange={(e) => {
          const v = Number(e.target.value);
          setSliderValue(v);
          setOverrideGwei(v);
        }}
        onMouseUp={handleRelease}
        onTouchEnd={handleRelease}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/20 accent-white outline-none focus:ring-2 focus:ring-white/50 transition-all" 
      />
      
      <div className="flex justify-between text-xs text-zinc-400 font-mono tracking-widest uppercase mt-4">
        <span>0 gwei (Calm)</span>
        <span>8 gwei (Critical)</span>
      </div>
      
      {overrideGwei !== null && (
        <p className="text-center text-sm font-medium mt-4 animate-pulse pt-4">
          Simulating: <span className="font-bold text-white">{overrideGwei.toFixed(2)} gwei</span> (release to reset)
        </p>
      )}
    </div>
  );
}
