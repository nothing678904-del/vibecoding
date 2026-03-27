"use client";
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { StressConfig } from "@/lib/constants";

export function PostEffects({ stressConfig }: { stressConfig: StressConfig }) {
  return <EffectComposer><Bloom luminanceThreshold={0.6} intensity={stressConfig.bloomIntensity} radius={0.8} /><ChromaticAberration offset={[stressConfig.chromaticAberration, stressConfig.chromaticAberration]} /><Vignette offset={0.3} darkness={0.5 + stressConfig.chromaticAberration * 8} /><Noise opacity={0.03} /></EffectComposer>;
}
