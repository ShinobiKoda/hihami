import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerEmail = searchParams.get("ownerEmail");
    const supa = createSupabaseAdminClient();
    let q = supa
      .from("nfts")
      .select(
        "id,name,description,media_url,media_type,price_eth,chain,owner_email,owner_username,created_at"
      )
      .order("created_at", { ascending: false });
    if (ownerEmail) q = q.eq("owner_email", ownerEmail);
    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
