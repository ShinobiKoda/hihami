import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contractAddress = searchParams.get("contractAddress");
  const limitParam = searchParams.get("limit");
  const limit = Math.max(1, Math.min(50, Number(limitParam) || 10));

  if (!contractAddress) {
    return NextResponse.json(
      { error: "contractAddress is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(new URL("/data/NFT.json", request.url).toString(), {
      cache: "no-store",
    });
    const all = (await res.json()) as Array<{
      contract: { address: string };
    }>;
    const filtered = all.filter(
      (x) => x.contract.address.toLowerCase() === contractAddress.toLowerCase()
    );
    return NextResponse.json(
      { nfts: filtered.slice(0, limit) },
      { status: 200 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ nfts: [], error: msg }, { status: 200 });
  }
}
