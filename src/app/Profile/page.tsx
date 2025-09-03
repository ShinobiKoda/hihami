"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { IoIosEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { FiCopy, FiCheck } from "react-icons/fi";
import Image from "next/image";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { useAccount } from "wagmi";
import {
  fadeIn,
  fadeInUp,
  zoomIn,
  staggerChildren,
  scaleOnHover,
} from "@/app/components/animations/motion";
type CreatedNFT = {
  id: string;
  name: string;
  description: string | null;
  media_url: string;
  media_type: string;
  chain: string | null;
  price_eth: number | null;
};

export default function Profile() {
  const { user } = useUser();
  const { isConnected, address, connector } = useAccount();

  const [fullName, setFullName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [avatarSeed, setAvatarSeed] = useState<string>("p");
  const [walletLabel, setWalletLabel] = useState<string>("Wallet");
  const [copied, setCopied] = useState(false);
  const [copyToastId, setCopyToastId] = useState<string | number | null>(null);
  const [created, setCreated] = useState<CreatedNFT[]>([]);
  const [loadingCreated, setLoadingCreated] = useState(false);

  const truncateAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

  useEffect(() => {
    const load = async () => {
      if (!user?.email) return;
      try {
        setLoadingCreated(true);
        const res = await fetch(
          `/api/nfts?ownerEmail=${encodeURIComponent(user.email)}`,
          { cache: "no-store" }
        );
        const json = await res.json().catch(() => ({}));
        if (json?.ok && Array.isArray(json.data))
          setCreated(json.data as CreatedNFT[]);
      } finally {
        setLoadingCreated(false);
      }
    };
    void load();
    const onCreated = () => void load();
    window.addEventListener("hihami:nft-created", onCreated);
    return () => window.removeEventListener("hihami:nft-created", onCreated);
  }, [user?.email]);

  useEffect(() => {
    setUserName(user?.username ?? "");
    setEmail(user?.email ?? "");
    setFullName((prev: string) => prev || user?.username || "");
  }, [user]);

  // Derive wallet label similar to Navbar
  useEffect(() => {
    if (!isConnected) {
      setWalletLabel("Wallet");
      return;
    }
    let label = "Wallet";
    try {
      const eth = (
        typeof window !== "undefined"
          ? (window as unknown as { ethereum?: Record<string, unknown> })
              .ethereum
          : null
      ) as
        | (Record<string, unknown> & {
            isMetaMask?: boolean;
            isTrust?: boolean;
            isTrustWallet?: boolean;
            provider?: { isTrustWallet?: boolean };
          })
        | null;
      const isTrust =
        eth?.isTrust === true ||
        eth?.isTrustWallet === true ||
        eth?.provider?.isTrustWallet === true ||
        (connector?.name?.toLowerCase?.().includes("trust") ?? false);
      const isMetaMask = eth?.isMetaMask === true;
      if (connector?.id === "injected") {
        if (isTrust) label = "Trust Wallet";
        else if (isMetaMask) label = "MetaMask";
        else label = connector?.name || "Injected Wallet";
      } else if (connector?.id === "coinbaseWallet") {
        label = "Coinbase Wallet";
      } else if (connector?.id === "walletConnect") {
        label = "WalletConnect";
      } else if (connector?.name) {
        label = connector.name;
      }
    } catch {}
    setWalletLabel(label);
  }, [isConnected, connector]);

  // Sync avatar with Navbar via localStorage and a custom event
  useEffect(() => {
    const KEY = "hihami.avatarSeed.v1";
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setAvatarSeed(saved);
    } catch {}
    const onSeed = (e: Event) => {
      const ce = e as CustomEvent<string>;
      if (typeof ce.detail === "string") setAvatarSeed(ce.detail);
    };
    window.addEventListener("hihami:avatarSeed", onSeed as EventListener);
    return () =>
      window.removeEventListener("hihami:avatarSeed", onSeed as EventListener);
  }, []);

  const onCopyAddress = async () => {
    if (!address || copied) return;
    // If a previous copy toast is still active, do nothing
    if (copyToastId && toast.isActive(copyToastId)) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      const id = toast.success("Address copied", {
        onClose: () => {
          setCopied(false);
          setCopyToastId(null);
        },
      });
      setCopyToastId(id);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const onSaveProfile = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userName, full_name: fullName, bio }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || (json && json.error))
        throw new Error(json.error || "Failed to save");
      toast.success("Profile saved");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not save profile";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async () => {
    try {
      setPwdSaving(true);
      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || (json && json.error))
        throw new Error(json.error || "Failed to update password");
      toast.success("Password updated");
      setNewPassword("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not update password";
      toast.error(msg);
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#140C1F] text-white pb-10">
      <motion.div
        className="w-full bg-cover bg-center h-[359px] relative flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/profile-bg-img.svg')",
        }}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="absolute -bottom-22 space-y-4"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-white w-[120px] h-[120px] rounded-full"
            variants={zoomIn}
          >
            <Image
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
                avatarSeed
              )}`}
              className="flex items-center justify-center"
              alt="Profile pic"
              height={310}
              width={130}
            />
          </motion.div>
          {/* <motion.p variants={fadeInUp}>Update your profile</motion.p> */}
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full px-4 max-w-[1440px] mx-auto lg:px-12 md:px-8"
        variants={staggerChildren}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="font-light text-lg opacity-80 lg:text-3xl mt-28"
          variants={fadeInUp}
        >
          User Profile Information
        </motion.h2>
        {isConnected && address ? (
          <motion.div
            className="mt-2 text-sm text-white/85"
            variants={fadeInUp}
          >
            <span className="font-semibold">{walletLabel}:</span>{" "}
            <span className="inline-flex items-center gap-2">
              <span>{truncateAddress(address)}</span>
              <button
                type="button"
                onClick={onCopyAddress}
                aria-label="Copy wallet address"
                disabled={copied}
                className="p-1 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {copied ? (
                  <FiCheck className="text-green-400" size={16} />
                ) : (
                  <FiCopy size={16} />
                )}
              </button>
            </span>
          </motion.div>
        ) : null}
        <motion.hr className="mt-[40px] text-[#A7A7A7]" variants={fadeIn} />

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 mt-10 gap-10">
          <motion.div className="flex flex-col gap-4" variants={fadeInUp}>
            <label
              htmlFor="full_name"
              className="font-light opacity-80 text-base lg:text-lg"
            >
              Full Name
            </label>
            <input
              type="text"
              className="rounded-[15px] border border-gray-500 px-4 py-6 outline-none"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </motion.div>
          <motion.div className="flex flex-col gap-4" variants={fadeInUp}>
            <label
              htmlFor="user_name"
              className="font-light opacity-80 text-base lg:text-lg"
            >
              User Name
            </label>
            <input
              type="text"
              className="rounded-[15px] border border-gray-500 px-4 py-6 outline-none"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </motion.div>
          <motion.div className="flex flex-col gap-4" variants={fadeInUp}>
            <label
              htmlFor="email"
              className="font-light opacity-80 text-base lg:text-lg"
            >
              Email
            </label>
            <input
              type="email"
              className="rounded-[15px] border border-gray-500 px-4 py-6 outline-none"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
          </motion.div>
          <motion.div className="flex flex-col gap-4" variants={fadeInUp}>
            <label
              htmlFor="password"
              className="font-light opacity-80 text-base lg:text-lg"
            >
              Password
            </label>
            <div className="relative rounded-[15px] border border-gray-500 px-4 py-6 outline-none pr-12">
              <input
                type={showPassword ? "text" : "password"}
                className="border-none outline-none w-full"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v: boolean) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A4A4A4] hover:text-white focus:outline-none"
              >
                {showPassword ? <IoIosEyeOff size={20} /> : <FaEye size={18} />}
              </button>
            </div>
            <div>
              <motion.button
                onClick={onChangePassword}
                disabled={pwdSaving}
                className="mt-2 inline-flex items-center gap-2 rounded-[12px] bg-[#AD1AAF] px-6 py-3 text-white disabled:opacity-70"
                variants={scaleOnHover}
                whileHover="hover"
                whileTap="tap"
              >
                {pwdSaving ? "Saving..." : "Save Password"}
              </motion.button>
            </div>
          </motion.div>
        </div>

        <motion.div className="flex flex-col gap-4 mt-10" variants={fadeInUp}>
          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            id="bio"
            rows={8}
            placeholder="Bio..."
            className="rounded-[15px] border border-gray-500 px-4 py-6 outline-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
          <div>
            <motion.button
              onClick={onSaveProfile}
              disabled={saving}
              className="mt-2 inline-flex items-center gap-2 rounded-[12px] bg-[#AD1AAF] px-6 py-3 text-white disabled:opacity-70"
              variants={scaleOnHover}
              whileHover="hover"
              whileTap="tap"
            >
              {saving ? "Saving..." : "Save Profile"}
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="mt-16" variants={fadeInUp}>
          <h3 className="text-2xl font-semibold mb-4">NFTs Created</h3>
          {loadingCreated ? (
            <p className="text-white/70">Loading...</p>
          ) : created.length === 0 ? (
            <p className="text-white/60">No created NFTs yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {created.map((n) => (
                <div
                  key={n.id}
                  className="rounded-xl border border-white/10 p-3 bg-white/5"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-black/30 flex items-center justify-center">
                    {n.media_type?.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={n.media_url}
                        alt={n.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={n.media_url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="font-medium">{n.name}</p>
                    {n.chain ? (
                      <p className="text-xs text-white/60">{n.chain}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
