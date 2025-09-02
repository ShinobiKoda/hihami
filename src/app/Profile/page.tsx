"use client";
import { useEffect, useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { useUser } from "@/app/context/UserContext";
import { IoIosEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import Image from "next/image"


export default function Profile() {
  const { user } = useUser();

  const [fullName, setFullName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setUserName(user?.username ?? "");
    setEmail(user?.email ?? "");
    setFullName((prev) => prev || user?.username || "");
  }, [user]);

  return (
    <div className="w-full min-h-screen bg-[#140C1F] text-white pb-10">
      <Navbar />
      <div
        className="w-full bg-cover bg-center h-[359px] relative flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/profile-bg-img.svg')",
        }}
      >
        <div className="absolute -bottom-22 space-y-4">
          <div className="bg-white w-[120px] h-[120px] rounded-full">
            <Image src="https://api.dicebear.com/7.x/adventurer/svg?seed=p" className="flex items-center justify-center" alt="Profile pic" height={310} width={130}/>
          </div>
          <p>Update your profile</p>
        </div>
      </div>

      <div className="w-full px-4 max-w-[1440px] mx-auto lg:px-12 md:px-8">
        <h2 className="font-light text-lg opacity-80 lg:text-3xl mt-28">
          User Profile Information
        </h2>
        <hr className="mt-[40px] text-[#A7A7A7]" />

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 mt-10 gap-10">
          <div className="flex flex-col gap-4">
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
          </div>
          <div className="flex flex-col gap-4">
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
          </div>
          <div className="flex flex-col gap-4">
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
            />
          </div>
          <div className="flex flex-col gap-4">
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
                placeholder="********"
                autoComplete="new-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A4A4A4] hover:text-white focus:outline-none"
              >
                {showPassword ? <IoIosEyeOff size={20} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-10">
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
        </div>
      </div>
    </div>
  );
}
