import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const uid = userRes.user.id;
    const email = userRes.user.email ?? "";

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("username, full_name, bio")
      .eq("id", uid)
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({
      ok: true,
      data: {
        email,
        username: profile?.username ?? null,
        full_name: profile?.full_name ?? null,
        bio: profile?.bio ?? null,
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { username, full_name, bio } = body as {
      username?: string;
      full_name?: string;
      bio?: string;
    };

    const supabase = await createSupabaseServerClient();
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const uid = userRes.user.id;

    const update: Record<string, unknown> = {};
    if (typeof username === "string") update.username = username;
    if (typeof full_name === "string") update.full_name = full_name;
    if (typeof bio === "string") update.bio = bio;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabase
      .from("profiles")
      .update(update)
      .eq("id", uid);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
