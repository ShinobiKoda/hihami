export async function getTrendingCollections() {
  const res = await fetch(
    "https://api.reservoir.tools/search/collections/v2?sortBy=7DayVolume&limit=5",
    {
      headers: {
        accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch collections: ${res.status}`);
  }

  return res.json();
}
