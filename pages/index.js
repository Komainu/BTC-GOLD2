import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [unit, setUnit] = useState("ounces");
  const [loading, setLoading] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/prices");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, 60000);
    return () => clearInterval(id);
  }, []);

  if (!data) return <main style={{ padding: 20 }}>Loading...</main>;

  const { btcUsd, goldUsdPerOunce, btcInOunces, btcInGrams, updatedAt, cached } = data;

  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: 20,
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <h1>💰 BTC / GOLD</h1>
      <p>最終更新: {new Date(updatedAt).toLocaleString()} {cached ? "(cached)" : ""}</p>
      <div style={{ marginBottom: 10 }}>
        <strong>BTC (USD):</strong> ${btcUsd.toLocaleString()}
        <br />
        <strong>Gold (USD/oz):</strong> ${goldUsdPerOunce.toLocaleString()}
      </div>

      <div style={{ margin: "10px 0" }}>
        <label>
          <input
            type="radio"
            checked={unit === "ounces"}
            onChange={() => setUnit("ounces")}
          />
          オンス建て
        </label>
        <label style={{ marginLeft: 12 }}>
          <input
            type="radio"
            checked={unit === "grams"}
            onChange={() => setUnit("grams")}
          />
          グラム建て
        </label>
      </div>

      <div
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginTop: 10,
          color: "#c19b00",
        }}
      >
        {unit === "ounces"
          ? `${btcInOunces.toLocaleString(undefined, { maximumFractionDigits: 6 })} troy oz`
          : `${btcInGrams.toLocaleString(undefined, { maximumFractionDigits: 2 })} g`}
      </div>

      <p style={{ color: "#777", fontSize: 12, marginTop: 20 }}>
        Source: CoinGecko API
      </p>
    </main>
  );
}
