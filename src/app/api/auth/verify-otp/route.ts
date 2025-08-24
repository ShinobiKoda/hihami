// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyOtpSchema } from "@/lib/validation";
import { cookies } from "next/headers";
import { decrypt, timingSafeEqualHex } from "@/lib/crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifyOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { otp } = parsed.data;

    // Read pending signup from cookie
    const cookieStore = await cookies();
    const payload = cookieStore.get("pending_signup")?.value;
    if (!payload) {
      return NextResponse.json(
        { error: "No pending signup. Please start again." },
        { status: 400 }
      );
    }

    let data: {
      email: string;
      password: string;
      username: string;
      otpHash: string;
      expiresAt: string;
    };
    try {
      data = JSON.parse(decrypt(payload));
    } catch {
      return NextResponse.json(
        { error: "Invalid signup state. Please start again." },
        { status: 400 }
      );
    }

    const { email, password, username, otpHash, expiresAt } = data;
    const exp = new Date(expiresAt);
    if (!exp || Number.isNaN(exp.getTime()) || exp <= new Date()) {
      // Clear stale cookie
      const resp = NextResponse.json(
        { error: "OTP expired. Please sign up again." },
        { status: 400 }
      );
      resp.cookies.delete("pending_signup");
      return resp;
    }

    const { sha256Hex } = await import("@/lib/crypto");
    const isMatch = timingSafeEqualHex(otpHash, sha256Hex(otp));
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    let admin;
    try {
      admin = createSupabaseAdminClient();
    } catch (envErr) {
      const msg = envErr instanceof Error ? envErr.message : String(envErr);
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    // Create user in Supabase Auth and profile now (idempotent handling)
    const { data: created, error: createErr } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    let uid: string | null = null;
    if (createErr || !created?.user) {
      const msg = createErr?.message || "Could not create user";
      const already = /already been registered/i.test(msg);
      if (!already) {
        return NextResponse.json({ error: msg }, { status: 500 });
      }
      // Find existing user by email (best-effort within first page)
      try {
        const { data: usersList } = await admin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });
        const found = usersList?.users?.find(
          (u) => (u.email ?? "").toLowerCase() === email.toLowerCase()
        );
        if (!found) {
          return NextResponse.json(
            { error: "Account already exists. Please log in." },
            { status: 409 }
          );
        }
        uid = found.id;
      } catch (e) {
        const m = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: m }, { status: 500 });
      }
    } else {
      uid = created.user.id;
    }

    // Ensure profile row exists and is marked verified, without overwriting username if present
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id")
      .eq("id", uid!)
      .maybeSingle();

    if (existingProfile) {
      const { error: updateErr } = await admin
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", uid!);
      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }
    } else {
      const { error: insertErr } = await admin
        .from("profiles")
        .insert({ id: uid!, username, is_verified: true })
        .single();
      if (insertErr) {
        return NextResponse.json({ error: insertErr.message }, { status: 500 });
      }
    }

    const resp = NextResponse.json({ message: "Email verified successfully!" });
    resp.cookies.delete("pending_signup");
    return resp;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
