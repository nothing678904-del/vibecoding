"use client";
import { useGas } from "@/providers/GasProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { useLenis } from "@studio-freight/react-lenis";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const { gasData, stressConfig, toggleGasBot, isGasBotActivated } = useGas();
  const lenis = useLenis();
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY || 0;
        const delta = y - lastScrollY.current;
        lastScrollY.current = y;

        // Stop at top: when near top, always show.
        if (y < 40) {
          setIsHidden(false);
          return;
        }

        // Hide when scrolling down, show when scrolling up.
        if (delta > 10) setIsHidden(true);
        if (delta < -10) setIsHidden(false);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const links = [
    { id: "hero", label: "Hero" },
    { id: "problem", label: "Problem" },
    { id: "visualize", label: "Visualize" },
    { id: "decide", label: "Decide" },
    { id: "features", label: "Features" },
  ];

  return (
    <header
      className="glass fixed left-4 right-4 top-4 z-50 flex items-center justify-between p-3 transition-transform duration-300 will-change-transform"
      style={{ transform: isHidden ? "translateY(-130%)" : "translateY(0)" }}
    >
      <div className="flex items-center gap-3">
        <div className="font-bold">⛽ GasMood</div>
        <nav className="hidden items-center gap-4 text-sm md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                const el = document.getElementById(l.id);
                if (el) lenis?.scrollTo(el);
              }}
              className="text-zinc-300 hover:text-white transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="rounded-full px-3 py-1" style={{ border: `1px solid ${stressConfig.color}` }}>
          <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: stressConfig.color, boxShadow: `0 0 16px ${stressConfig.color}` }} />
          {typeof gasData?.average === "number" ? gasData.average.toFixed(2) : "--"} gwei
        </span>
        <button
          onClick={() => {
            toggleGasBot();
          }}
          className="glass px-3 py-1 text-sm"
          style={{
            borderColor: isGasBotActivated ? stressConfig.color : "rgba(255,255,255,0.15)",
            boxShadow: isGasBotActivated ? `0 0 18px ${stressConfig.color}55` : undefined,
          }}
        >
          {isGasBotActivated ? "✓ GasBot Active" : "Activate GasBot"}
        </button>
        <ThemeToggle />
        <SoundToggle />
      </div>
    </header>
  );
}
