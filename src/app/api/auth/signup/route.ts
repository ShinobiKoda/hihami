import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendOtpEmail } from "@/lib/email";
import { addMinutes } from "date-fns";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3).max(20),
});

function genOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email, password, username } = bodySchema.parse(json);

    let admin;
    try {
      admin = createSupabaseAdminClient();
    } catch (envErr) {
      const msg = envErr instanceof Error ? envErr.message : String(envErr);
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }

    const { data: userRes, error: createErr } =
      await admin.auth.admin.createUser({
        email,
        password,
      });
    if (createErr || !userRes.user) {
      const msg = createErr?.message ?? "Could not create user";
      if (process.env.NODE_ENV !== "production") {
        console.error("[dev] Supabase createUser failed:", createErr);
        console.log(
          "[dev] NEXT_PUBLIC_SUPABASE_URL set:",
          !!process.env.NEXT_PUBLIC_SUPABASE_URL
        );
        console.log(
          "[dev] SUPABASE_SERVICE_ROLE_KEY set:",
          !!process.env.SUPABASE_SERVICE_ROLE_KEY
        );
      }
      const isDuplicate =
        msg.toLowerCase().includes("already") ||
        msg.toLowerCase().includes("registered");
      const isNetwork =
        msg.toLowerCase().includes("fetch failed") ||
        msg.toLowerCase().includes("getaddrinfo") ||
        msg.toLowerCase().includes("network");
      return NextResponse.json(
        { ok: false, error: msg },
        { status: isDuplicate ? 409 : isNetwork ? 502 : 400 }
      );
    }
    const userId = userRes.user.id;

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

    const otp = genOtp();
    const expiresAt = addMinutes(new Date(), 10).toISOString();

    const { error: insertErr } = await admin.from("profiles").insert({
      id: userId,
      username,
      is_verified: false,
      otp_code: hash(otp),
      otp_expires_at: expiresAt,
    });

    if (insertErr) {
      return NextResponse.json(
        { ok: false, error: insertErr.message },
        { status: 400 }
      );
    }

    // 4) Send email with OTP

    console.log(
      "[dev] RESEND_API_KEY present in route.ts:",
      !!process.env.RESEND_API_KEY
    );
    console.log("[dev] EMAIL_FROM:", process.env.EMAIL_FROM);
    try {
      const mailResult = await sendOtpEmail(email, otp);
      if (process.env.NODE_ENV !== "production") {
        // Helpful when testing locally
        console.log("Resend send result:", mailResult);
      }
    } catch (mailErr) {
      const msg = mailErr instanceof Error ? mailErr.message : String(mailErr);
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[dev] Email send failed, proceeding with OTP shown in server logs:",
          msg
        );
        console.warn(`OTP for ${email}: ${otp}`);
      } else {
        return NextResponse.json(
          {
            ok: false,
            error: "Could not send verification email. Please try again later.",
          },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ ok: true, uid: userId });
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
