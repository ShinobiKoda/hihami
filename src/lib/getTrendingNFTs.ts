export async function getTrendingCollections() {
  try {
    const res = await fetch("/data/NFT.json", { cache: "no-store" });
    const all = (await res.json()) as Array<{
      collection?: { name?: string; slug?: string };
      contract: { address: string };
      price?: { eth?: number };
    }>;
    const byCollection = new Map<
      string,
      { address: string; count: number; floor: number }
    >();
    for (const x of all) {
      const key = x.collection?.name || x.contract.address;
      const item = byCollection.get(key) || {
        address: x.contract.address,
        count: 0,
        floor: Infinity,
      };
      item.count += 1;
      if (typeof x.price?.eth === "number" && isFinite(x.price.eth)) {
        item.floor = Math.min(item.floor, x.price.eth);
      }
      byCollection.set(key, item);
    }
    const arr = Array.from(byCollection.entries()).map(([name, v]) => ({
      name,
      address: v.address,
      items: v.count,
      floorEth: v.floor === Infinity ? null : v.floor,
    }));
    // Simple sort by items desc
    arr.sort((a, b) => b.items - a.items);
    return arr.slice(0, 5);
  } catch {
    return [] as Array<{
      name: string;
      address: string;
      items: number;
      floorEth: number | null;
    }>;
  }
}
