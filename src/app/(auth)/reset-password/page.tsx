"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { motion } from "motion/react";
import {
  fadeInUp,
  fadeInDown,
  scaleOnHover,
} from "@/app/components/animations/motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type Form = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  // Wrap the client logic that uses useSearchParams in Suspense per Next.js guidance
  return (
    <Suspense fallback={null}>
      <ResetPasswordClient />
    </Suspense>
  );
}

function ResetPasswordClient() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  useEffect(() => {
    // Supabase uses a "type=recovery" param in the URL on reset link
    const type = search.get("type");
    if (type === "recovery") {
      setReady(true);
    } else {
      // If user visits without a recovery session, redirect to forgot page
      router.replace("/forgot-password");
    }
  }, [router, search]);

  const onSubmit = async (data: Form) => {
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateErr } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (updateErr) {
        setError(updateErr.message);
        return;
      }
      router.replace("/login");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to reset password";
      setError(msg);
    }
  };

  if (!ready) return null;

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#160430] text-white px-4">
      <motion.div
        className="w-full max-w-md bg-[#261046] p-6 rounded-md"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-2xl font-bold mb-4" variants={fadeInDown}>
          Set a new password
        </motion.h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New password"
              className="w-full bg-[#160430] px-3 py-2 rounded-md outline-none"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full bg-[#160430] px-3 py-2 rounded-md outline-none"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full text-white font-medium py-3 rounded-md disabled:opacity-70 bg-[linear-gradient(89.933deg,#501794_0%,#3E70A1_100%)]"
            variants={scaleOnHover}
            whileHover="hover"
            whileTap="tap"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <ClipLoader size={20} color="white" />
                Updating
              </span>
            ) : (
              "Update Password"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
