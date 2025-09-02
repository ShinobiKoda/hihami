"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  overlayFade,
  sidebarSlide,
  fadeInUp,
} from "@/app/components/animations/motion";
import { useConnect } from "wagmi";

type ConnectModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ConnectModal({ open, onClose }: ConnectModalProps) {
  const { connectors, connect, error, status } = useConnect();
  const attemptedFromHere = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  // Reset the attempt flag whenever the modal opens
  useEffect(() => {
    if (open) {
      attemptedFromHere.current = false;
      setConnectingId(null);
      setHint(null);
    }
  }, [open]);

  // Auto-close only after a successful connection initiated here
  useEffect(() => {
    if (!open) return;
    if (status === "success" && attemptedFromHere.current) onClose();
  }, [status, open, onClose]);

  // Clear local connecting state on error
  useEffect(() => {
    if (!open) return;
    if (status === "error") {
      setConnectingId(null);
      setHint(
        "Connection failed. If a popup was blocked, enable popups or try a different connector."
      );
    }
  }, [status, open]);

  // Safety timeout to avoid indefinite pending state
  useEffect(() => {
    if (!open || !connectingId || status !== "pending") return;
    const t = window.setTimeout(() => {
      setConnectingId(null);
      setHint(
        "This is taking a while. Check your wallet extension/app, disable blockers, or try WalletConnect."
      );
    }, 15000);
    return () => window.clearTimeout(t);
  }, [open, connectingId, status]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/60"
            variants={overlayFade}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md z-[90] bg-[#0f0f17] border-l border-white/10 shadow-2xl p-6 overflow-y-auto"
            variants={sidebarSlide}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Connect a wallet</h3>
              <button
                aria-label="Close"
                onClick={onClose}
                className="rounded-md px-3 py-1.5 bg-white/10 hover:bg-white/15"
              >
                Close
              </button>
            </div>

            <p className="text-white/70 text-sm mt-2">
              Choose a wallet provider. If you don’t have a wallet extension
              installed, use WalletConnect to scan a QR code with your mobile
              wallet.
            </p>

            <div className="mt-6 space-y-3">
              {mounted &&
                connectors.map((c) => (
                  <motion.button
                    key={c.id}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3 text-left"
                    onClick={() => {
                      attemptedFromHere.current = true;
                      setHint(null);
                      setConnectingId(c.id);
                      connect({ connector: c });
                    }}
                    disabled={!!connectingId}
                  >
                    <span className="font-medium">{c.name}</span>
                    <span className="text-xs text-white/60">
                      {connectingId === c.id && status === "pending"
                        ? "Connecting…"
                        : c.id}
                    </span>
                  </motion.button>
                ))}
            </div>

            {error ? (
              <p className="text-red-300 text-sm mt-3">{error.message}</p>
            ) : null}
            {hint ? <p className="text-white/70 text-xs mt-2">{hint}</p> : null}

            <div className="mt-8">
              <p className="text-white/60 text-sm mb-2">Don’t have a wallet?</p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="https://trustwallet.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-white/10 hover:bg-white/15 px-3 py-2 text-sm"
                >
                  Get Trust Wallet
                </a>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-white/10 hover:bg-white/15 px-3 py-2 text-sm"
                >
                  Get MetaMask
                </a>
                <a
                  href="https://www.coinbase.com/wallet/downloads"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-white/10 hover:bg-white/15 px-3 py-2 text-sm"
                >
                  Get Coinbase Wallet
                </a>
              </div>
             
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
