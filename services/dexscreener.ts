// src/services/dexScreener.ts

// Simple local cache (to reduce API calls)
const cache = new Map<string, { data: any; time: number }>();

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

async function safeFetch<T = any>(url: string, ttl = 60000): Promise<T> {
  // ✅ Cache check
  if (cache.has(url)) {
    const { data, time } = cache.get(url)!;
    if (Date.now() - time < ttl) return data as T;
  }

  // 🌐 Fetch request
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const data = (await res.json()) as T;

  // 💾 Store cache
  cache.set(url, { data, time: Date.now() });
  return data;
}

// ---------------- Types ----------------

export interface TokenDetail {
  address: string;
  name: string;
  symbol: string;
  graphql: string;
  description: string;
  chainId: string;
}

// ---------------- API Functions ----------------

export async function gettrending(): Promise<string[]> {
  const response = await fetch(
    "https://api.dexscreener.com/token-boosts/top/v1",
    {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    }
  );
  if (!response.ok) {
    return ["errrrooroor"];
  }
  const data = await response.json();
  return data;
}

export async function getMostActiveBoostedTokens(): Promise<string[]> {
  const data = await safeFetch<any>(
    "https://api.dexscreener.com/token-boosts/latest/v1"
  );
  return data.pairs?.slice(0, 8).map((pair: any) => pair.address) || [];
}

export async function getTokenDetails(
  address: string
): Promise<TokenDetail | null> {
  const url = `https://api.dexscreener.io/latest/dex/tokens/${address}`;
  const data = await safeFetch<any>(url);

  const match = data.pairs?.find((p: any) => p.baseToken?.address === address);
  if (!match) return null;

  return {
    address: match.baseToken.address,
    name: match.baseToken.name,
    symbol: match.baseToken.symbol,
    graphql: match.url,
    description: match.info?.description || "No description available",
    chainId: match.chainId || "unknown",
  };
}

export async function getTopBoostedTokenDetails(): Promise<TokenDetail[]> {
  const addresses = await getMostActiveBoostedTokens();
  const results: TokenDetail[] = [];

  for (let i = 0; i < addresses.length; i++) {
    const addr = addresses[i];

    try {
      const detail = await getTokenDetails(addr);
      if (detail) results.push(detail);
    } catch (e) {
      console.warn(`⚠️ Failed to fetch ${addr}`, e);
    }

    // 💤 Small delay between requests (to avoid hitting rate limit)
    await sleep(200);
  }

  return results;
}
