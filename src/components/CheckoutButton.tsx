"use client";

import { useState } from "react";

export default function CheckoutButton({
  slug,
  disabled = false,
}: {
  slug: string;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function checkout() {
    if (disabled || loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, quantity: 1 }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "checkout failed");
      window.location.href = data.url;
    } catch {
      alert("決済画面を開けませんでした。設定を確認してください。");
      setLoading(false);
    }
  }

  return (
    <button className="buyButton" onClick={checkout} disabled={disabled || loading}>
      {disabled ? "COMING SOON" : loading ? "OPENING…" : "購入する"}
    </button>
  );
}