"use client";
import { useTheme } from "@/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme} className="glass px-3 py-1 text-sm">{theme === "dark" ? "🌙" : "☀️"}</button>;
}
