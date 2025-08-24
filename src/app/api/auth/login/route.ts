import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email, password } = bodySchema.parse(json);

    const supabase = await createSupabaseServerClient();

    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (signInError || !signInData.user) {
      try {
        const admin = createSupabaseAdminClient();

        const { data: usersList } = await admin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });
        const exists = Boolean(
          usersList?.users?.some(
            (u) => (u.email ?? "").toLowerCase() === email.toLowerCase()
          )
        );
        if (!exists) {
          return NextResponse.json(
            { ok: false, error: "You don't have an account. Sign up" },
            { status: 404 }
          );
        }
      } catch {
      }

      return NextResponse.json(
        { ok: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const uid = signInData.user.id;

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("is_verified")
      .eq("id", uid)
      .single();

    if (profileErr || !profile) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { ok: false, error: "You're not signed up yet. Go to signup." },
        { status: 403 }
      );
    }

    if (!profile.is_verified) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { ok: false, error: "You're not signed up yet. Go to signup." },
        { status: 403 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      const first = e.issues?.[0]?.message ?? "Invalid input";
      return NextResponse.json({ ok: false, error: first }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
