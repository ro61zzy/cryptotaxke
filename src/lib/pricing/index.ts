/** Map token symbols to CoinGecko coin IDs. */
const COINGECKO_IDS: Record<string, string> = {
  ETH: "ethereum",
  WETH: "ethereum",
  USDC: "usd-coin",
  USDT: "tether",
  DAI: "dai",
  BTC: "bitcoin",
  WBTC: "wrapped-bitcoin",
};

/** Rough USD prices used when APIs are unavailable (demo/CI). */
const FALLBACK_USD: Record<string, number> = {
  ETH: 3200,
  WETH: 3200,
  USDC: 1,
  USDT: 1,
  DAI: 1,
  BTC: 65000,
  WBTC: 65000,
};

const FALLBACK_USD_KES = 130;

const priceCache = new Map<string, number>();
const fxCache = new Map<string, number>();

function cacheKey(symbol: string, timestamp: number): string {
  const day = new Date(timestamp).toISOString().slice(0, 10);
  return `${symbol}:${day}`;
}

function fxCacheKey(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

async function fetchUsdToKes(date: string): Promise<number> {
  const cached = fxCache.get(date);
  if (cached) return cached;

  try {
    const res = await fetch(`https://api.frankfurter.app/${date}?from=USD&to=KES`, {
      next: { revalidate: 86400 },
    });
    if (res.ok) {
      const data = (await res.json()) as { rates?: { KES?: number } };
      const rate = data.rates?.KES;
      if (rate) {
        fxCache.set(date, rate);
        return rate;
      }
    }
  } catch {
    // fall through
  }

  fxCache.set(date, FALLBACK_USD_KES);
  return FALLBACK_USD_KES;
}

async function fetchHistoricalUsd(symbol: string, timestamp: number): Promise<number> {
  const key = cacheKey(symbol, timestamp);
  const cached = priceCache.get(key);
  if (cached) return cached;

  const coinId = COINGECKO_IDS[symbol.toUpperCase()];
  if (!coinId) {
    const fallback = FALLBACK_USD[symbol.toUpperCase()] ?? 0;
    priceCache.set(key, fallback);
    return fallback;
  }

  const date = new Date(timestamp);
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = date.getUTCFullYear();
  const cgDate = `${dd}-${mm}-${yyyy}`;

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${cgDate}`,
      { next: { revalidate: 86400 } },
    );
    if (res.ok) {
      const data = (await res.json()) as { market_data?: { current_price?: { usd?: number } } };
      const usd = data.market_data?.current_price?.usd;
      if (usd) {
        priceCache.set(key, usd);
        return usd;
      }
    }
  } catch {
    // fall through
  }

  const fallback = FALLBACK_USD[symbol.toUpperCase()] ?? 0;
  priceCache.set(key, fallback);
  return fallback;
}

/** Value of an asset amount in KES at a given timestamp. */
export async function valueInKES(
  symbol: string,
  amount: number,
  timestamp: number,
): Promise<number> {
  const usd = await fetchHistoricalUsd(symbol, timestamp);
  const date = new Date(timestamp).toISOString().slice(0, 10);
  const kesRate = await fetchUsdToKes(date);
  return amount * usd * kesRate;
}

/** Clear caches — useful in tests. */
export function clearPricingCache(): void {
  priceCache.clear();
  fxCache.clear();
}
