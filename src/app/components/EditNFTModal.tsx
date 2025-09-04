"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";

type NFT = {
  id: string;
  name: string;
  description: string | null;
  media_url: string;
  media_type: string;
  chain: string | null;
  price_eth: number | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  nft: NFT | null;
  onUpdated?: (nft: NFT) => void;
};

const CHAINS = [
  { id: "ethereum", label: "Ethereum", icon: "/images/(eth).svg" },
  { id: "polygon", label: "Polygon", icon: "/images/binance.svg" },
  { id: "sepolia", label: "Sepolia", icon: "/images/(eth).svg" },
];

export default function EditNFTModal({ open, onClose, nft, onUpdated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [chain, setChain] = useState("ethereum");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nft) return;
    setName(nft.name || "");
    setDescription(nft.description || "");
    setPrice(
      nft.price_eth != null && isFinite(nft.price_eth)
        ? String(nft.price_eth)
        : ""
    );
    setChain((nft.chain || "ethereum").toLowerCase());
    setError(null);
  }, [nft]);

  const selectedChain = useMemo(
    () => CHAINS.find((c) => c.id === chain) || CHAINS[0],
    [chain]
  );

  const onSubmit = async () => {
    if (!nft) return;
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const res = await fetch(`/api/nfts/${encodeURIComponent(nft.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description,
          priceEth: price.trim() ? parseFloat(price) : null,
          chain,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to update NFT");
      }
      if (onUpdated) onUpdated(json.data as NFT);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (!open || !nft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        className="relative z-10 w-[92vw] max-w-[560px] rounded-2xl p-5 bg-[linear-gradient(147.748deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.06)_100%)] border border-white/15 text-white"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/30 flex items-center justify-center">
            {nft.media_type?.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={nft.media_url}
                alt={nft.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={nft.media_url}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <h3 className="text-lg font-semibold">Edit NFT</h3>
        </div>
        <div className="space-y-4">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex flex-col gap-2">
            <label className="text-sm">Name</label>
            <input
              type="text"
              className="rounded-[12px] px-4 py-3 border border-white/20 bg-transparent outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="NFT name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm">Price (ETH)</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.0001"
              className="rounded-[12px] px-4 py-3 border border-white/20 bg-transparent outline-none"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm">Blockchain</label>
            <div className="rounded-[12px] px-3 py-2 border border-white/20 bg-transparent outline-none flex items-center gap-2">
              <Image
                src={selectedChain.icon}
                alt={selectedChain.label}
                width={20}
                height={20}
              />
              <select
                className="bg-transparent outline-none border-none w-full"
                value={chain}
                onChange={(e) => setChain(e.target.value)}
              >
                {CHAINS.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#140C1F]">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm">Description</label>
            <textarea
              rows={4}
              className="rounded-[12px] px-4 py-3 border border-white/20 bg-transparent outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your NFT..."
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
              disabled={saving}
            >
              Cancel
            </button>
            <motion.button
              onClick={onSubmit}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#AD1AAF] px-5 py-2 text-white disabled:opacity-70"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? "Saving..." : "Save"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
