"use client";
import { lato } from "../font";
import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import {
  fadeInDown,
  fadeIn,
  fadeInUp,
  staggerChildren,
  zoomIn,
  scaleOnHover,
} from "../components/animations/motion";

export default function CreateNFT() {
  const { user } = useUser();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [chain, setChain] = useState("ethereum");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const chains = useMemo(
    () => [
      { id: "ethereum", label: "Ethereum", icon: "/images/(eth).svg" },
      { id: "polygon", label: "Polygon", icon: "/images/binance.svg" },
      { id: "sepolia", label: "Sepolia", icon: "/images/(eth).svg" },
    ],
    []
  );

  const onPick = () => inputRef.current?.click();
  const onSelect = (f?: File) => {
    if (!f) return;
    const ok = /^image\//.test(f.type) || /^video\//.test(f.type);
    if (!ok) {
      setFile(null);
      setFileError("Only images and videos are allowed");
      return;
    }
    setFileError(null);
    setFile(f);
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    onSelect(f);
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    onSelect(f);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const mediaPreviewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    };
  }, [mediaPreviewUrl]);

  const onSubmit = async () => {
    if (!name.trim()) {
      setFileError("Enter a name for your NFT");
      return;
    }
    if (!file) {
      setFileError("Please select an image or video");
      return;
    }
    try {
      setSubmitting(true);
      // Upload to Supabase Storage
      const supabase = createSupabaseBrowserClient();
      const mediaType = file.type;
      const path = `${(user?.email || "anon").replace(
        /[^a-zA-Z0-9-_@.]/g,
        "_"
      )}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from("nft-media")
        .upload(path, file, { contentType: mediaType, upsert: false });
      if (upErr) throw new Error(upErr.message || "Upload failed");
      const { data: pub } = supabase.storage
        .from("nft-media")
        .getPublicUrl(path);
      const mediaUrl = pub?.publicUrl as string;
      const res = await fetch("/api/nfts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || "",
          mediaUrl,
          mediaType,
          priceEth: price.trim() ? parseFloat(price) : null,
          chain,
          ownerEmail: user?.email ?? null,
          ownerUsername: user?.username ?? null,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed to create NFT");
      // Broadcast event so lists can refresh
      window.dispatchEvent(new CustomEvent("hihami:nft-created"));
      setFile(null);
      setName("");
      setDescription("");
      setPrice("");
      setFileError(null);
      // Redirect to profile to view the created NFT card
      router.push("/Profile");
    } catch (e: unknown) {
      setFileError(e instanceof Error ? e.message : "Failed to create NFT");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="w-full text-white max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 mt-10 lg:mt-20">
      <motion.div
        className="text-center space-y-8 mb-10"
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="font-medium text-4xl lg:text-[64px]"
          variants={fadeInDown}
        >
          Create NFT
        </motion.h2>
        <motion.p
          className={`${lato.className} text-base lg:text-lg opacity-50`}
          variants={fadeIn}
        >
          Get Onboard And Earn Money Like a Pro
        </motion.p>
      </motion.div>

      <motion.div
        className="bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] backdrop-blur-3xl rounded-[15px] p-4 h-[461px] text-center"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div
          className="w-full rounded-[15px] border-2 border-dashed border-white/50 h-full flex flex-col items-center justify-center space-y-4"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <motion.div
            className="w-[85px] h-[85px] rounded-md bg-[linear-gradient(147.748deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] flex items-center justify-center"
            variants={zoomIn}
          >
            <Image
              src="/images/folder-img.svg"
              alt="Folder Image"
              height={30}
              width={30}
            />
          </motion.div>
          <motion.p className="flex flex-col gap-2" variants={fadeIn}>
            <span className="font-normal text-base lg:text-lg">
              Drag and Drop Your NFT File Here
            </span>
            <span className="font-light text-white opacity-50 text-base">
              Images or Videos up to 100mb
            </span>
          </motion.p>
          {fileError && <p className="text-sm text-red-400">{fileError}</p>}
          {file && (
            <div className="mt-2">
              {file.type.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaPreviewUrl || undefined}
                  alt="Preview"
                  className="w-[180px] h-[180px] object-cover rounded-lg"
                />
              ) : (
                <video
                  src={mediaPreviewUrl || undefined}
                  className="w-[220px] h-[160px] rounded-lg"
                  controls
                />
              )}
            </div>
          )}
          <motion.p
            className="underline text-[#379BD3] font-normal text-lg lg:text-xl cursor-pointer"
            variants={scaleOnHover}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            onClick={onPick}
          >
            Browse
          </motion.p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={onInputChange}
          />
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 mt-20 gap-10"
        variants={staggerChildren}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 1 }}
      >
        <motion.div className="flex flex-col gap-6" variants={fadeInUp}>
          <label htmlFor="itemName" className="font-light text-lg lg:text-xl">
            Item Name
          </label>
          <input
            type="text"
            placeholder="Enter Item Name"
            className="rounded-[15px] px-6 py-4 border border-gray-600 outline-none text-[#A48EA9] font-light text-base lg:text-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </motion.div>
        <motion.div className="flex flex-col gap-6" variants={fadeInUp}>
          <label htmlFor="priceEth" className="font-light text-lg lg:text-xl">
            Price (ETH)
          </label>
          <input
            id="priceEth"
            type="number"
            inputMode="decimal"
            step="0.0001"
            placeholder="0.00"
            className="rounded-[15px] px-6 py-4 border border-gray-600 outline-none text-[#A48EA9] font-light text-base lg:text-xl"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </motion.div>
        <motion.div className="flex flex-col gap-6" variants={fadeInUp}>
          <label
            htmlFor="description"
            className="font-light text-lg lg:text-xl"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={6}
            placeholder="Describe your NFT..."
            className="rounded-[15px] px-6 py-4 border border-gray-600 outline-none text-[#A48EA9] font-light text-base lg:text-xl"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </motion.div>
        <motion.div className="flex flex-col gap-6" variants={fadeInUp}>
          <label htmlFor="blockChain" className="font-light text-lg lg:text-xl">
            Blockchain
          </label>
          <div className="rounded-[15px] px-4 py-4 border border-gray-600 outline-none flex items-center gap-3">
            {(() => {
              const sel = chains.find((c) => c.id === chain) || chains[0];
              return (
                <>
                  <Image
                    src={sel.icon}
                    alt={sel.label}
                    width={24}
                    height={24}
                  />
                  <select
                    value={chain}
                    onChange={(e) => setChain(e.target.value)}
                    className="bg-transparent outline-none border-none w-full text-[#A48EA9] font-light text-base lg:text-xl"
                  >
                    {chains.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#140C1F]">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </>
              );
            })()}
          </div>
        </motion.div>
      </motion.div>

      <div className="mt-10">
        <motion.button
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-[12px] bg-[#AD1AAF] px-6 py-3 text-white disabled:opacity-70"
          variants={scaleOnHover}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-3">
              <ClipLoader size={18} color="#fff" />
              Creating...
            </span>
          ) : (
            "Create NFT"
          )}
        </motion.button>
      </div>

      <motion.div
        className="mt-30 w-full max-w-[1440px] mx-auto flex flex-col justify-center items-center gap-10 px-4 lg:px-12 md:px-8"
        variants={staggerChildren}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="font-bold text-4xl lg:text-[64px] text-center"
          variants={fadeInDown}
        >
          Ready for Next NFT Drop?
        </motion.h2>
        <motion.div
          className="rounded-[15px] text-[#A48EA9] border border-[#AD1AAF] w-full max-w-[480px] flex justify-between"
          variants={fadeInUp}
        >
          <input
            type="email"
            placeholder="abc@gmail.com"
            className="outline-none border-none w-full px-4"
          />
          <motion.button
            className="bg-[#AD1AAF] rounded-[15px] w-[68px] h-[60px] p-2 cursor-pointer hover:opacity-80"
            variants={scaleOnHover}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <Image
              src="/images/arrow.svg"
              alt="Arrow Image"
              width={100}
              height={100}
              className="w-full"
            />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
