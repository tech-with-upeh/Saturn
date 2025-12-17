// src/services/coinService.ts
import { getCache, setCache } from "./cacheService";

const CACHE_KEY = "memeCoins";
const CACHE_TTL = 60 * 1000; // 1 minute
const base_url = "https://api.dexscreener.com/";

export async function fetchMemeCoins(): Promise<any[]> {
  // Try cache first
  const cached = await getCache(CACHE_KEY);
  if (cached) {
    console.log("✅ Loaded meme coins from cache");
    return cached;
  }

  console.log("🌐 Fetching meme coins from API...");
  const url = base_url + "token-boosts/top/v1";
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    });
    const data = await res.json();
    const memeCoind = data.slice(0, 8);
    const memeCoins = await Promise.all(
      memeCoind.map(async (item: any, num: any) => {
        const coin = await fetchCoinData(item.chainId, item.tokenAddress);
        const name = coin[0].baseToken.name;
        const perc = coin[0].priceChange.h24;

        return {
          ...item,
          name,
          percent: perc,
        };
      })
    );
    await setCache(CACHE_KEY, memeCoins, CACHE_TTL);
    return memeCoins;
  } catch (error) {
    console.error("❌ Failed to fetch meme coins:", error);
    return [];
  }
}

export async function fetchCoinData(
  chainId: string,
  tokenAddress: string
): Promise<any | null> {
  console.log("🌐 Fetching meme >>>>>>> coins from API...");
  const url = base_url + "tokens/v1/" + chainId + "/" + tokenAddress;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    });
    const memeCoins = await res.json();

    return memeCoins;
  } catch (error) {
    console.error("❌ Failed to fetch meme coin data:", error);
    return [];
  }
}
