import { NextResponse } from "next/server";

const ETHERSCAN_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "";

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function GET() {
  if (!ETHERSCAN_KEY) {
    return NextResponse.json({ error: "Missing Etherscan API key.", safe: 0, average: 0, fast: 0 }, { status: 200 });
  }

  const v2 = `https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle&apikey=${ETHERSCAN_KEY}`;
  const v1 = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_KEY}`;

  try {
    let json: any;
    try {
      json = await fetchJson(v2);
    } catch {
      json = await fetchJson(v1);
    }

    const result = json?.result ?? {};
    const safe = Number(result.SafeGasPrice ?? 0);
    const average = Number(result.ProposeGasPrice ?? 0);
    const fast = Number(result.FastGasPrice ?? 0);

    const status = json?.status;
    const message = json?.message;

    // Etherscan commonly returns status/message with result even on failures.
    if (status && status !== "1") {
      return NextResponse.json(
        {
          error: message || "Etherscan returned NOTOK.",
          safe: 0,
          average: 0,
          fast: 0,
          source: "etherscan",
          status,
        },
        { status: 200 },
      );
    }

    if ([safe, average, fast].some((n) => Number.isNaN(n))) {
      return NextResponse.json(
        { error: "Invalid gas response from Etherscan.", safe: 0, average: 0, fast: 0, source: "etherscan", raw: json },
        { status: 200 },
      );
    }

    return NextResponse.json({ safe, average, fast, source: "etherscan", status, message }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to fetch gas data from Etherscan.",
        details: error instanceof Error ? error.message : "unknown",
        safe: 0,
        average: 0,
        fast: 0,
      },
      { status: 200 },
    );
  }
}

