"use client";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/ui/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { StressVizSection } from "@/components/sections/StressVizSection";
import { PlaygroundSection } from "@/components/sections/PlaygroundSection";
import { DecisionSection } from "@/components/sections/DecisionSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { ChatPanel } from "@/components/ui/ChatPanel";

const StressScene = dynamic(() => import("@/components/three/StressScene"), { ssr: false });

export default function Home() {
  return (
    <main>
      <StressScene />
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <StressVizSection />
      <PlaygroundSection />
      <DecisionSection />
      <FeaturesSection />
      <FooterSection />
      <ChatPanel />
    </main>
  );
}
