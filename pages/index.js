import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [btcGold, setBtcGold] = useState(null);
  const [usdGold, setUsdGold] = useState(null);
  const [usdBtc, setUsdBtc] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // CoinGecko API: Bitcoin (BTC/USD)
        const btcData = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        );

        // CoinGecko API: PAX Gold (1 PAXG = 1 oz Gold)
        const goldData = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd"
        );

        const btcUsd = btcData.data.bitcoin.usd;
        const goldUsd = goldData.data["pax-gold"].usd;
        const btcGoldPrice = btcUsd / goldUsd;

        setUsdBtc(btcUsd);
        setUsdGold(goldUsd);
        setBtcGold(btcGoldPrice.toFixed(2));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    }

    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "sans-serif",
        backgroundColor: "#0b0b0b",
        color: "#f5c542",
        textAlign: "center",
        padding: "1rem"
      }}
    >
      <h1>🏆 BTC in Gold (XAU)</h1>

      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : btcGold ? (
        <>
          <p>1 BTC = {btcGold} oz Gold</p>
          <p style={{ fontSize: "0.9em", color: "#aaa" }}>
            (BTC/USD: ${usdBtc?.toLocaleString()} | XAU/USD: ${usdGold?.toLocaleString()})
          </p>
        </>
      ) : (
        <p>Loading prices...</p>
      )}

      <footer
        style={{
          position: "absolute",
          bottom: "20px",
          fontSize: "0.8em",
          color: "#777"
        }}
      >
        Powered by CoinGecko
      </footer>
    </div>
  );
}
