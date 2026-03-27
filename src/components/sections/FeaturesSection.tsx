"use client";
import { useGas } from "@/providers/GasProvider";

export function FeaturesSection() {
  const { gasData, stressConfig, lastUpdated } = useGas();
  const items = [
    { title: "Real-Time Data", desc: `Live mode updates every 10s from Etherscan gas oracle.` },
    { title: "Visual Mapping", desc: `Current stress: ${stressConfig.label}. Color and motion follow network load.` },
    { title: "AI Interpretation", desc: "GasBot explains when to send now vs wait using plain language." },
    { title: "Stress Metrics", desc: `Safe ${gasData?.safe ?? "--"} | Standard ${gasData?.average ?? "--"} | Fast ${gasData?.fast ?? "--"} gwei.` },
    { title: "Decision Support", desc: "Action cards auto-highlight based on live network stress level." },
    { title: "Data Source", desc: `Etherscan gas oracle${lastUpdated ? `, last sync ${lastUpdated.toLocaleTimeString()}` : ""}.` },
  ];
  return <section id="features" className="mx-auto min-h-screen max-w-6xl px-6 py-24"><h2 className="mb-10 text-4xl font-semibold">What Makes This Different</h2><div className="grid items-start gap-4 md:grid-cols-3">{items.map((i) => <article key={i.title} className="glass p-5"><h3 className="font-semibold">{i.title}</h3><p className="mt-2 text-sm text-zinc-300">{i.desc}</p></article>)}</div></section>;
}
