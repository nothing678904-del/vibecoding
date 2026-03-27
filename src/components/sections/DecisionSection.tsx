"use client";
import { useGas } from "@/providers/GasProvider";

export function DecisionSection() {
  const { stressLevel, gasData } = useGas();
  const state = stressLevel === "calm" || stressLevel === "moderate" ? "go" : stressLevel === "tense" ? "wait" : "avoid";
  return <section id="decide" className="mx-auto min-h-screen max-w-6xl px-6 py-24"><h2 className="mb-2 text-center text-4xl font-semibold">Know When to Act</h2><p className="mb-10 text-center text-zinc-400">Standard gas is {gasData?.average ?? "--"} gwei right now.</p><div className="grid items-start gap-6 md:grid-cols-3"><article className={`glass p-6 ${state === "go" ? "ring-2 ring-green-400" : "opacity-70"}`}><h3 className="font-semibold">Go Ahead</h3><p className="mt-2 text-sm text-zinc-300">Network is calm enough for routine transactions.</p></article><article className={`glass p-6 ${state === "wait" ? "ring-2 ring-amber-300" : "opacity-70"}`}><h3 className="font-semibold">Hold On</h3><p className="mt-2 text-sm text-zinc-300">Gas is rising. Wait if your transaction is not urgent.</p></article><article className={`glass p-6 ${state === "avoid" ? "ring-2 ring-rose-400" : "opacity-70"}`}><h3 className="font-semibold">Avoid</h3><p className="mt-2 text-sm text-zinc-300">Congestion is high. Send only critical transactions.</p></article></div></section>;
}
