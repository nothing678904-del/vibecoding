"use client";
import { StressSlider } from "@/components/ui/StressSlider";

export function PlaygroundSection() {
  return <section className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-4 px-6"><h2 className="text-4xl font-semibold">Playground Mode</h2><p>Drag the slider to preview stress levels.</p><StressSlider /></section>;
}
