import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes.user) {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }
    const uid = userRes.user.id;
    const email = userRes.user.email ?? "";

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", uid)
      .maybeSingle();

    if (profileErr) {
      return NextResponse.json(
        { ok: false, error: profileErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: { id: uid, email, username: profile?.username ?? null },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
