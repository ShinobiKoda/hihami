export type OwnersForTokenResponse = {
  owners: string[];
};

export async function getOwnersForToken(
  contractAddress: string,
  tokenId: string
): Promise<OwnersForTokenResponse> {
  try {
    const res = await fetch("/data/NFT.json", { cache: "no-store" });
    const all = (await res.json()) as Array<{
      contract: { address: string };
      token: { id: string };
      owner?: { address?: string };
    }>;
    const match = all.find(
      (x) =>
        x.contract.address.toLowerCase() === contractAddress.toLowerCase() &&
        x.token.id === tokenId
    );
    return { owners: match?.owner?.address ? [match.owner.address] : [] };
  } catch {
    return { owners: [] };
  }
}
