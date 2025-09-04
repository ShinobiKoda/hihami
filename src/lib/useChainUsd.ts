"use client";
import { useEffect, useRef, useState } from "react";

export type ChainId = "ethereum" | "sepolia" | "polygon";

const ENV_ETH = Number(process.env.NEXT_PUBLIC_ETH_USD || 0) || 0;
const ENV_MATIC = Number(process.env.NEXT_PUBLIC_MATIC_USD || 0) || 0;

const DEFAULTS: Record<ChainId, number> = {
  ethereum: ENV_ETH || 0,
  sepolia: ENV_ETH || 0, // testnet mirrors ETH pricing for display
  polygon: ENV_MATIC || 0.6, // sensible hardcoded fallback
};

export function useChainUsd(options?: {
  fallbacks?: Partial<Record<ChainId, number>>;
  intervalMs?: number;
}) {
  const { fallbacks, intervalMs = 60_000 } = options || {};
  const [usd, setUsd] = useState<Record<ChainId, number>>({
    ethereum: fallbacks?.ethereum ?? DEFAULTS.ethereum,
    sepolia: fallbacks?.sepolia ?? DEFAULTS.sepolia,
    polygon: fallbacks?.polygon ?? DEFAULTS.polygon,
  });
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let aborted = false;
    const fetchOnce = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,polygon-pos&vs_currencies=usd",
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const json = (await res.json()) as {
          ethereum?: { usd?: number };
          "polygon-pos"?: { usd?: number };
        };
        const eth = json?.ethereum?.usd;
        const matic = json?.["polygon-pos"]?.usd;
        if (aborted) return;
        setUsd((prev) => ({
          ethereum:
            typeof eth === "number" && isFinite(eth) && eth > 0
              ? eth
              : prev.ethereum,
          sepolia:
            typeof eth === "number" && isFinite(eth) && eth > 0
              ? eth
              : prev.sepolia,
          polygon:
            typeof matic === "number" && isFinite(matic) && matic > 0
              ? matic
              : prev.polygon,
        }));
      } catch {
        // ignore transient errors
      }
    };

    fetchOnce();
    timerRef.current = window.setInterval(fetchOnce, intervalMs);
    return () => {
      aborted = true;
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [intervalMs]);

  return usd;
}
