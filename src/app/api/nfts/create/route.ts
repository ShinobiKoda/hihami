import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      mediaUrl,
      mediaType,
      priceEth,
      chain,
      ownerEmail,
      ownerUsername,
    } = body ?? {};

    if (!name || !mediaUrl || !mediaType || !chain) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (!/^image\//.test(mediaType) && !/^video\//.test(mediaType)) {
      return NextResponse.json(
        { ok: false, error: "Only images and videos are allowed" },
        { status: 400 }
      );
    }

    const supa = createSupabaseAdminClient();
    const { data, error } = await supa
      .from("nfts")
      .insert({
        name,
        description: description || "",
        media_url: mediaUrl,
        media_type: mediaType,
        price_eth: typeof priceEth === "number" ? priceEth : null,
        chain,
        owner_email: ownerEmail || null,
        owner_username: ownerUsername || null,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
