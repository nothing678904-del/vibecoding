"use client";
import { useState } from "react";
import { useGas } from "@/providers/GasProvider";

export function AIActivationSection() {
  const [isActivated, setIsActivated] = useState(false);
  const { activateGasBot } = useGas();
  return <section className="flex min-h-screen flex-col items-center justify-center gap-6"><h2 className="text-4xl font-semibold">Activate the Interpreter</h2>{isActivated ? <p>✓ GasBot Active</p> : <button onClick={() => { setIsActivated(true); activateGasBot(); }} className="glass rounded-full px-8 py-5">ACTIVATE</button>}</section>;
}
