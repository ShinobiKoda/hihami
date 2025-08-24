import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendOtpEmail } from "@/lib/email";
import { cookies } from "next/headers";
import { addMinutes } from "date-fns";
import { encrypt, sha256Hex } from "@/lib/crypto";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3).max(20),
});

function genOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email, password, username } = bodySchema.parse(json);

    // Validate email is not already registered and username is available
    try {
      const admin = createSupabaseAdminClient();

      // Check email existence (best-effort within first page)
      try {
        const { data: usersList } = await admin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });
        const emailExists = Boolean(
          usersList?.users?.some(
            (u) => (u.email ?? "").toLowerCase() === email.toLowerCase()
          )
        );
        if (emailExists) {
          return NextResponse.json(
            { ok: false, error: "This email is already registered." },
            { status: 409 }
          );
        }
      } catch {
        // Ignore listing errors; continue best-effort
      }

      // Check username availability
      const { data: usernameCheck } = await admin
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();
      if (usernameCheck) {
        return NextResponse.json(
          { ok: false, error: "Username already taken" },
          { status: 409 }
        );
      }
    } catch (envErr) {
      const msg = envErr instanceof Error ? envErr.message : String(envErr);
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }

    const otp = genOtp();
    const expiresAt = addMinutes(new Date(), 10).toISOString();

    // Store pending signup securely in an HttpOnly cookie (no Supabase writes yet)
    const cookieStore = await cookies();
    const payload = encrypt(
      JSON.stringify({
        email,
        password,
        username,
        otpHash: sha256Hex(otp),
        expiresAt,
      })
    );
    cookieStore.set("pending_signup", payload, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10, // 10 minutes
    });

    // Send OTP via email
    try {
      await sendOtpEmail(email, otp);
      if (process.env.NODE_ENV !== "production") {
        console.log(`[dev] OTP for ${email}: ${otp}`);
      }
    } catch (mailErr) {
      const msg = mailErr instanceof Error ? mailErr.message : String(mailErr);
      return NextResponse.json(
        { ok: false, error: `Could not send verification email: ${msg}` },
        { status: 502 }
      );
    }

    // Respond that verification is required; client should go to verify-email with no uid yet
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      const first = e.issues?.[0]?.message ?? "Invalid input";
      return NextResponse.json({ ok: false, error: first }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "Unknown error";
    if (process.env.NODE_ENV !== "production") {
      console.error("[dev] Signup route unhandled error:", e);
      console.log(
        "[dev] NEXT_PUBLIC_SUPABASE_URL set:",
        !!process.env.NEXT_PUBLIC_SUPABASE_URL
      );
      console.log(
        "[dev] SUPABASE_SERVICE_ROLE_KEY set:",
        !!process.env.SUPABASE_SERVICE_ROLE_KEY
      );
    }
    const isNetwork =
      message.toLowerCase().includes("fetch failed") ||
      message.toLowerCase().includes("getaddrinfo") ||
      message.toLowerCase().includes("network");
    return NextResponse.json(
      { ok: false, error: message },
      { status: isNetwork ? 502 : 400 }
    );
  }
}
