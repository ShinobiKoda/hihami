import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email } = bodySchema.parse(json);

    // Build absolute redirect URL to the reset page
    const origin =
      req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;
    if (!origin) {
      return NextResponse.json(
        { ok: false, error: "Missing site URL. Set NEXT_PUBLIC_SITE_URL." },
        { status: 500 }
      );
    }
    const redirectTo = `${origin}/reset-password`;

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[forgot-password] reset request error:", error.message);
      }
      // Always return generic success to avoid account enumeration
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      const first = e.issues?.[0]?.message ?? "Invalid input";
      return NextResponse.json({ ok: false, error: first }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "Unknown error";
    if (process.env.NODE_ENV !== "production") {
      console.error("[forgot-password] unhandled error:", message);
    }
    // Return generic success even on unexpected server errors to avoid enumeration
    return NextResponse.json({ ok: true });
  }
}
