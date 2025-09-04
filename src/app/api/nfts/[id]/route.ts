import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id)
      return NextResponse.json(
        { ok: false, error: "Missing id" },
        { status: 400 }
      );

    const server = await createSupabaseServerClient();
    const { data: auth } = await server.auth.getUser();
    const email = auth.user?.email;
    if (!email)
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );

    const body = await req.json().catch(() => ({}));
    const { name, description, priceEth, chain } = body ?? {};

    const supa = createSupabaseAdminClient();
    const { data: row, error: getErr } = await supa
      .from("nfts")
      .select("id, owner_email")
      .eq("id", id)
      .single();
    if (getErr) throw getErr;
    if (!row)
      return NextResponse.json(
        { ok: false, error: "Not found" },
        { status: 404 }
      );
    if ((row as { owner_email: string | null }).owner_email !== email)
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );

    const updates: Record<string, unknown> = {};
    if (typeof name === "string" && name.trim()) updates.name = name.trim();
    if (typeof description === "string") updates.description = description;
    if (priceEth === null) updates.price_eth = null;
    else if (typeof priceEth === "number" && isFinite(priceEth))
      updates.price_eth = priceEth;
    if (typeof chain === "string" && chain.trim()) updates.chain = chain.trim();

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { ok: false, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data: updated, error: updErr } = await supa
      .from("nfts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (updErr) throw updErr;

    return NextResponse.json({ ok: true, data: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id)
      return NextResponse.json(
        { ok: false, error: "Missing id" },
        { status: 400 }
      );

    const server = await createSupabaseServerClient();
    const { data: auth } = await server.auth.getUser();
    const email = auth.user?.email;
    if (!email)
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );

    const supa = createSupabaseAdminClient();
    const { data: n, error: getErr } = await supa
      .from("nfts")
      .select("id, owner_email, media_url")
      .eq("id", id)
      .single();
    if (getErr) throw getErr;
    if (!n)
      return NextResponse.json(
        { ok: false, error: "Not found" },
        { status: 404 }
      );
    if ((n as { owner_email: string | null }).owner_email !== email)
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );

    // Attempt to delete the DB row first
    const { error: delErr } = await supa.from("nfts").delete().eq("id", id);
    if (delErr) throw delErr;

    // Best-effort: remove media from storage if it's in our public bucket
    try {
      const mediaUrl = (n as { media_url?: string }).media_url || "";
      const marker = "/storage/v1/object/public/nft-media/";
      const idx = mediaUrl.indexOf(marker);
      if (idx !== -1) {
        const path = mediaUrl.substring(idx + marker.length);
        if (path) {
          await supa.storage.from("nft-media").remove([path]);
        }
      }
    } catch {
      // ignore storage cleanup failure
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
