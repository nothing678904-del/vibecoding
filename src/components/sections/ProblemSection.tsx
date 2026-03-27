"use client";
import { useGas } from "@/providers/GasProvider";

export function ProblemSection() {
  const { gasData, stressConfig } = useGas();
  return (
    <section id="problem" className="mx-auto grid min-h-screen max-w-6xl items-center gap-6 px-6 py-24 md:grid-cols-2">
      <div className="glass p-6">
        <h3 className="mb-4 font-semibold">Traditional View</h3>
        <p className="text-sm text-zinc-300">
          Safe: {gasData?.safe ?? "--"} gwei | Standard: {gasData?.average ?? "--"} gwei | Fast: {gasData?.fast ?? "--"} gwei
        </p>
      </div>
      <div className="glass p-6" style={{ border: `1px solid ${stressConfig.color}` }}>
        <h3 className="mb-4 font-semibold">Our Interpretation</h3>
        <p className="text-sm text-zinc-300">Network is {stressConfig.label.toLowerCase()}. Fees match the current mood.</p>
      </div>
    </section>
  );
}
