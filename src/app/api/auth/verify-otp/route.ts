// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyOtpSchema } from "@/lib/validation";
import crypto from "crypto";

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function timingSafeEqualHash(input: string, hashed: string) {
  try {
    const a = Buffer.from(hash(input), "hex");
    const b = Buffer.from(hashed, "hex");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifyOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { uid, otp } = parsed.data;

    let supabaseAdmin;
    try {
      supabaseAdmin = createSupabaseAdminClient();
    } catch (envErr) {
      const msg = envErr instanceof Error ? envErr.message : String(envErr);
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    // 1. Look up user profile
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 2. Validate OTP
    const expiresAt = profile.otp_expires_at
      ? new Date(profile.otp_expires_at)
      : null;
    const isExpired =
      !expiresAt ||
      Number.isNaN(expiresAt.getTime()) ||
      expiresAt <= new Date();
    const hasCode = typeof profile.otp_code === "string" && profile.otp_code;
    const matches = hasCode && timingSafeEqualHash(otp, profile.otp_code);

    if (!matches || isExpired) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // 3. Update profile AND Supabase Auth
    const { error: updateProfileErr } = await supabaseAdmin
      .from("profiles")
      .update({ is_verified: true, otp_code: null, otp_expires_at: null })
      .eq("id", uid);

    if (updateProfileErr) {
      return NextResponse.json(
        { error: updateProfileErr.message },
        { status: 500 }
      );
    }

    // Mark email as verified in Supabase Auth
    const { error: updateAuthErr } =
      await supabaseAdmin.auth.admin.updateUserById(uid, {
        email_confirm: true,
      });

    if (updateAuthErr) {
      return NextResponse.json(
        { error: updateAuthErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Email verified successfully!" });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
