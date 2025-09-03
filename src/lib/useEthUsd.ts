"use client";
import { useEffect, useRef, useState } from "react";

export function useEthUsd(options?: {
  fallback?: number;
  intervalMs?: number;
}) {
  const { fallback = 0, intervalMs = 60_000 } = options || {};
  const [usd, setUsd] = useState<number>(fallback);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let aborted = false;
    const fetchOnce = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const json = (await res.json()) as { ethereum?: { usd?: number } };
        const v = json?.ethereum?.usd;
        if (!aborted && typeof v === "number" && isFinite(v) && v > 0) {
          setUsd(v);
        }
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
