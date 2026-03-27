"use client";
import { useGas } from "@/providers/GasProvider";
import { useTheme } from "@/providers/ThemeProvider";

export function useStress() {
  const { stressConfig } = useGas();
  const { theme } = useTheme();
  const shouldShake = stressConfig.shakeIntensity > 0;
  return {
    stressConfig,
    stressColor: stressConfig.color,
    stressPercent: ({ calm: 20, moderate: 40, tense: 60, stressed: 80, critical: 100 } as const)[stressConfig.level],
    shouldShake,
    shakeStyle: shouldShake ? { transform: `translate(${(Math.random() - 0.5) * stressConfig.shakeIntensity}px, ${(Math.random() - 0.5) * stressConfig.shakeIntensity}px)` } : {},
    bgColor: theme === "dark" ? stressConfig.bgDark : stressConfig.bgLight,
    glowShadow: `0 0 20px ${stressConfig.color}`,
    transitionCSS: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  };
}
