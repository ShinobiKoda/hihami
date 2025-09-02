"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { IoIosEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import Image from "next/image";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import {
  fadeIn,
  fadeInUp,
  zoomIn,
  staggerChildren,
  scaleOnHover,
} from "@/app/components/animations/motion";

export default function Profile() {
  const { user } = useUser();

  const [fullName, setFullName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [avatarSeed, setAvatarSeed] = useState<string>("p");

  useEffect(() => {
    setUserName(user?.username ?? "");
    setEmail(user?.email ?? "");
    setFullName((prev: string) => prev || user?.username || "");
  }, [user]);

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
          <motion.p variants={fadeInUp}>Update your profile</motion.p>
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
      </motion.div>
    </div>
  );
}
