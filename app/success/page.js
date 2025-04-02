"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [response, setResponse] = useState(null); // Start with null instead of an empty string

  useEffect(() => {
    if (!tranId) {
      router.replace("/");
      return;
    }

    const verifyTransaction = async () => {
      try {
        const response = await fetch("/api/sslcommerz/verify-transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tran_id: tranId }),
        });

        const data = await response.json();
        setResponse(data); // Set the response data

        const status = data?.tran_details?.element?.[0]?.status;
        if (status === "VALID" || status === "VALIDATED") {
          setIsValid(true);
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.error("Transaction verification failed");
        // router.replace("/"); // Uncomment if you want to redirect on error
      } finally {
        setLoading(false);
      }
    };

    verifyTransaction();
  }, [tranId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Verifying transaction...</p>
      </div>
    );
  }

  if (!isValid) return null; // Prevents rendering if the transaction is invalid

  return (
    <div className="p-15 flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-3xl font-bold text-green-700">Payment Successful!</h1>
      <p className="mt-5 text-lg text-gray-700">
        Transaction ID: <span className="font-semibold">{tranId}</span>
      </p>
      <Link href="/">
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Go to Homepage
        </button>
      </Link>

      {/* Print response data */}
      {response && (
        <div className="w-1/2 mt-4 p-4 bg-white rounded-lg shadow-md">
          <h1 className="font-semibold text-green-700 text-xl">Transaction Details:</h1>
          <pre className="text-lg text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)} {/* Format JSON for better readability */}
          </pre>
        </div>
      )}

    </div>
  );
}
