// pages/api/prices.js
let cache = { ts: 0, data: null };
const CACHE_TTL = 60 * 1000; // 60秒キャッシュ

export default async function handler(req, res) {
  try {
    const now = Date.now();
    if (cache.data && now - cache.ts < CACHE_TTL) {
      return res.status(200).json({ ...cache.data, cached: true });
    }

    // CoinGecko で BTC/USD と XAU/USD を同時取得
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cxau&vs_currencies=usd";
    const response = await fetch(url);
    if (!response.ok) throw new Error("CoinGecko API error");

    const data = await response.json();

    const btcUsd = data.bitcoin.usd;
    const goldUsd = data.xau.usd;

    if (!btcUsd || !goldUsd) throw new Error("Missing price data");

    const btcInOunces = btcUsd / goldUsd;
    const btcInGrams = btcInOunces * 31.1034768;

    const payload = {
      btcUsd,
      goldUsdPerOunce: goldUsd,
      btcInOunces,
      btcInGrams,
      updatedAt: new Date().toISOString(),
    };

    cache = { ts: Date.now(), data: payload };
    return res.status(200).json({ ...payload, cached: false });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
