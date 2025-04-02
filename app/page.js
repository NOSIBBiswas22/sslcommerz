"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const randomAmount = Math.floor(1000 + Math.random() * 9000);
      const response = await fetch("/api/sslcommerz/pre-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: randomAmount,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Payment initiation failed");
      }

      const result = await response.json();

      if (result.url) {
        window.location.href = result.url; // Redirect the user to SSLCommerz
      } else {
        throw new Error("Payment URL not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-4">SSLCommerz Payment</h1>
      <div>
        <Link href={"/admin"}>
          <button className="m-1 px-6 py-3 bg-blue-600 text-white rounded-md disabled:opacity-50">
            Admin Panel
          </button>
        </Link>
        <button
          onClick={handlePayment}
          className="m-1 px-6 py-3 bg-blue-600 text-white rounded-md disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
