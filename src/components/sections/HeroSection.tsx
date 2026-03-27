"use client";
import { GasCounter } from "@/components/ui/GasCounter";
import { useGas } from "@/providers/GasProvider";

import { motion } from "framer-motion";

export function HeroSection() {
  const { stressConfig } = useGas();
  return (
    <section id="hero" className="flex min-h-screen flex-col items-center justify-center text-center px-4 relative z-10">
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass mb-8 rounded-full px-5 py-2 text-sm font-medium border-white/10 uppercase tracking-widest text-white/80 backdrop-blur-3xl"
      >
        <span className="mr-3 inline-block h-2 w-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ backgroundColor: stressConfig.color }}></span>
        Live Network Status
      </motion.p>
      
      <motion.h1 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-[clamp(3.5rem,10vw,8rem)] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-2xl"
      >
        Feel the Network
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 max-w-2xl text-lg md:text-xl text-zinc-300 font-light leading-relaxed mx-auto drop-shadow-md"
      >
        Experience Ethereum&apos;s heartbeat in real time. We instantly convert raw gas prices into a visceral 3D experience of color, motion, and intensity.
      </motion.p>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
        className="mt-14 flex flex-col items-center p-8 rounded-[2rem] glass border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:bg-white/5 transition-colors duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        <GasCounter size="lg" />
        <p className="mt-4 text-xl font-medium tracking-wide transition-colors duration-500 delay-100 flex items-center gap-3" style={{ color: stressConfig.color, textShadow: `0 0 20px ${stressConfig.color}40` }}>
          <span className="text-3xl filter drop-shadow-lg">{stressConfig.emoji}</span> {stressConfig.label}
        </p>
      </motion.div>
      
    </section>
  );
}
