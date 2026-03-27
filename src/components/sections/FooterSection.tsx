"use client";
import { useLenis } from "@studio-freight/react-lenis";

export function FooterSection() {
  const lenis = useLenis();
  return <footer className="flex min-h-[50vh] flex-col items-center justify-center gap-6 bg-black px-6 text-center text-white"><h2 className="text-4xl font-semibold">Stop Calculating. Start Feeling.</h2><button onClick={() => lenis?.scrollTo(0)} className="glass px-6 py-3">Back to Top</button><p className="text-sm text-zinc-400">Built for ETH Global Hackathon</p></footer>;
}
